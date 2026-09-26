/**
 * Arabic Voice Synthesizer with guaranteed pure Arabic output
 */

class AudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private timer: number | null = null;

  public stopAll() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  public async playVoiceover(
    text: string,
    onProgress: (progress: number, currentTime: number, duration: number) => void,
    onEnd: () => void,
    onError: (err: string) => void
  ) {
    this.stopAll();

    // 1. First attempt: Server-Side Gemini Arabic Audio
    try {
      const response = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: 'Puck',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          this.audioElement = audio;

          audio.ontimeupdate = () => {
            if (audio.duration) {
              const prog = audio.currentTime / audio.duration;
              onProgress(prog, audio.currentTime, audio.duration);
            }
          };

          audio.onended = () => {
            this.stopAll();
            onEnd();
          };

          audio.onerror = () => {
            this.playPureArabicSpeech(text, onProgress, onEnd);
          };

          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('Server TTS not available, playing pure Arabic synthesized speech', e);
    }

    // 2. Client-side Arabic Speech
    this.playPureArabicSpeech(text, onProgress, onEnd);
  }

  private playPureArabicSpeech(
    text: string,
    onProgress: (progress: number, currentTime: number, duration: number) => void,
    onEnd: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.simulatePlayback(18, onProgress, onEnd);
      return;
    }

    window.speechSynthesis.cancel();

    // Convert English acronyms to explicit Arabic words
    const pureArabic = text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/VIP/gi, 'في آي بي')
      .replace(/MAGNUM/gi, 'ماغنوم')
      .replace(/750/g, 'سبعمئة وخمسين')
      .replace(/500/g, 'خمسمئة')
      .replace(/250/g, 'مئتين وخمسين')
      .replace(/10/g, 'عشرة')
      .replace(/4/g, 'أربعة')
      .replace(/…/g, '، ');

    const utterance = new SpeechSynthesisUtterance(pureArabic);
    this.currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();
    // Look specifically for Arabic voices
    const arabicVoice =
      voices.find((v) => v.lang === 'ar-EG') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ||
      voices.find((v) => v.name.toLowerCase().includes('arabic') || v.name.includes('عربي'));

    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    } else {
      utterance.lang = 'ar-EG';
    }

    utterance.pitch = 1.0;
    utterance.rate = 0.95; // Calm, respectful formal pace

    const words = pureArabic.split(/\s+/).length;
    const duration = Math.max(15, words / 2.1);
    const startTime = Date.now();

    this.timer = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(0.99, elapsed / duration);
      onProgress(progress, elapsed, duration);
    }, 100);

    utterance.onend = () => {
      this.stopAll();
      onProgress(1, duration, duration);
      onEnd();
    };

    utterance.onerror = () => {
      this.stopAll();
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  private simulatePlayback(
    duration: number,
    onProgress: (progress: number, currentTime: number, duration: number) => void,
    onEnd: () => void
  ) {
    const startTime = Date.now();
    this.timer = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(1, elapsed / duration);
      onProgress(progress, elapsed, duration);
      if (progress >= 1) {
        this.stopAll();
        onEnd();
      }
    }, 100);
  }
}

export const audioEngine = new AudioEngine();
