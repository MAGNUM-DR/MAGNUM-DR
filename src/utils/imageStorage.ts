/**
 * Image compression and safe storage utilities to prevent QuotaExceededError
 */

export const compressImage = (
  fileOrDataUrl: File | string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.82
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      }
    };

    img.onerror = () => {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          img.src = reader.result;
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
};

/**
 * Resizes logos to lightweight avatars (max 280x280, ~20KB)
 */
export const compressLogo = (file: File): Promise<string> => {
  return compressImage(file, 280, 280, 0.85);
};

/**
 * Resizes showcase photos to max 1200x1200 (~80KB - 150KB)
 */
export const compressPackagePhoto = (file: File): Promise<string> => {
  return compressImage(file, 1200, 1200, 0.8);
};

/**
 * Safely saves to localStorage with QuotaExceededError protection and recovery
 */
export const safeSetLocalStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    console.warn(`[Storage] Failed to save key "${key}" to localStorage:`, error);
    try {
      // If quota exceeded, remove older heavy package images cache to free space
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        if (key.includes('logo')) {
          localStorage.removeItem('magnum_custom_package_images');
          localStorage.setItem(key, value);
          return true;
        }
      }
    } catch {
      // Silent failover, state remains in memory
    }
    return false;
  }
};

/**
 * Safely reads from localStorage
 */
export const safeGetLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
