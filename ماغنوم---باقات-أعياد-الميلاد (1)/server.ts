import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataLength = pcmBuffer.length;
  const wavBuffer = Buffer.alloc(44 + dataLength);

  // RIFF header
  wavBuffer.write('RIFF', 0);
  wavBuffer.writeUInt32LE(36 + dataLength, 4);
  wavBuffer.write('WAVE', 8);

  // "fmt " sub-chunk
  wavBuffer.write('fmt ', 12);
  wavBuffer.writeUInt32LE(16, 16);
  wavBuffer.writeUInt16LE(1, 20);
  wavBuffer.writeUInt16LE(numChannels, 22);
  wavBuffer.writeUInt32LE(sampleRate, 24);
  wavBuffer.writeUInt32LE(byteRate, 28);
  wavBuffer.writeUInt16LE(blockAlign, 32);
  wavBuffer.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  wavBuffer.write('data', 36);
  wavBuffer.writeUInt32LE(dataLength, 40);

  pcmBuffer.copy(wavBuffer, 44);
  return wavBuffer;
}

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Arabic script fully vocalized with tashkeel and strictly phonetic Arabic letters
const FULL_ARABIC_TASHKEEL_SCRIPT = `عِيدُ مِيلَادِكَ، خَلِّيهِ ذِكْرَى تَسْتَاهِلُ الِاحْتِفَالَ!
مَعَنَا ثَلَاثُ بَاقَاتٍ، اخْتَرْ مِنْهَا مَا يُنَاسِبُكَ:
البَاقَةُ الأُولَى: طَاوِلَةُ الفِي آي بِي بِدِيكُورٍ كَامِلٍ، مَعَ إِمْكَانِيَّةِ اخْتِيَارِ اللَّوْنِ، وَعَدَدِ أَشْخَاصٍ حَتَّى عَشَرَة، بِسِعْرِ سَبْعِمِئَةٍ وَخَمْسِينَ دِينَاراً!
البَاقَةُ الثَّانِيَةُ: طَاوِلَةُ الفِي آي بِي بِدِيكُورٍ عَادِيّ، وَعَدَدُ الأَشْخَاصِ أَرْبَعَة، بِسِعْرِ خَمْسِمِئَةِ دِينَارٍ!
وَالبَاقَةُ الثَّالِثَةُ: طَاوِلَةُ الفِي آي بِي تَشْمَلُ تَجْهِيزَ الطَّاوِلَةِ فَقَطْ، بِسِعْرِ مِئَتَيْنِ وَخَمْسِينَ دِينَاراً!
اخْتَرْ بَاقَتَكَ، وَاحْجِزِ احْتِفَالَكَ، وَخَلِّي يَوْمَكَ مُمَيَّزاً مَعَ مَّاغْنُوم!
لِلتَّوَاصُلِ مَعَنَا يُرْجَى إِرْسَالُ رِسَالَةٍ مُبَاشَرَةٍ لِتَأْكِيدِ الحَجْزِ وَتَحْدِيدِ التَّارِيخِ المَطْلُوبِ.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // Pure Arabic Voiceover generator using gemini-2.5-flash with strict Arabic prompt
  app.post('/api/voiceover', async (req, res) => {
    try {
      const client = getAiClient();

      if (!client) {
        return res.status(200).json({
          success: false,
          fallback: true,
          message: 'Gemini API key not configured, using browser Arabic voice fallback',
        });
      }

      const rawText = req.body.text || FULL_ARABIC_TASHKEEL_SCRIPT;
      const cleanArabicText = rawText
        .replace(/VIP/gi, 'الفِي آي بِي')
        .replace(/MAGNUM/gi, 'مَاغْنُوم')
        .replace(/[^\u0600-\u06FF\s،!.؟:0-9]/g, ' ');

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [
              {
                text: `أنت معلّق صوتي محترف، ناطق أصلي باللغة العربية بلكنة مصرية فخمة وهادئة ورسمية.
المهمة: اقرأ النص التالي باللغة العربية الفصحى حصراً وبصوت عربي خالص وواضح جداً، دون نطق أي حرف أو كلمة إنجليزية إطلاقاً.
انطق بدفء وفخامة ووضوح تام للكلمات:

${cleanArabicText}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
          },
        },
      });

      const candidate = response.candidates?.[0];
      const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData && p.inlineData.data);

      if (audioPart && audioPart.inlineData?.data) {
        const rawPcm = Buffer.from(audioPart.inlineData.data, 'base64');
        const wavBuffer = pcmToWav(rawPcm, 24000, 1, 16);
        const wavBase64 = wavBuffer.toString('base64');

        return res.json({
          success: true,
          audioUrl: `data:audio/wav;base64,${wavBase64}`,
          format: 'wav',
        });
      }

      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'No audio returned, fallback to browser Arabic TTS',
      });
    } catch (err: any) {
      console.error('Error generating Arabic voiceover:', err);
      return res.status(200).json({
        success: false,
        fallback: true,
        error: err.message || 'TTS generation error',
      });
    }
  });

  // Automated Booking Availability Checker Simulation API
  app.get('/api/check-date', (req, res) => {
    const { date } = req.query;
    // Automation calculation based on date string
    const d = new Date(String(date || ''));
    const isWeekend = d.getDay() === 4 || d.getDay() === 5; // Thu/Fri
    res.json({
      success: true,
      available: true,
      tablesLeft: isWeekend ? 2 : 5,
      estimatedPreparationHours: 4,
      instantConfirmation: true,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
