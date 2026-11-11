/**
 * TTS Service using Gemini 3.8 Flash TTS via server endpoint /api/tts
 * with seamless HTML5 Audio playback and Web Speech fallback.
 */

export interface PlaybackOptions {
  voice?: 'Kore' | 'Puck' | 'Aoede' | 'Fenrir';
  style?: string;
  rate?: number;
  onStart?: () => void;
  onEnded?: () => void;
  onError?: (err: any) => void;
  onSourceChange?: (source: 'gemini' | 'browser') => void;
}

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>(); // text+voice -> base64 Data URL
  private isBrowserSpeaking = false;

  public stopAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isBrowserSpeaking = false;
    }
  }

  public async speak(text: string, options: PlaybackOptions = {}): Promise<void> {
    this.stopAll();

    const voice = options.voice || 'Kore';
    const cacheKey = `${voice}_${text}`;

    // 1. Try Gemini 3.8 Flash TTS via backend
    try {
      let audioUrl = this.audioCache.get(cacheKey);

      if (!audioUrl) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice,
            style:
              options.style ||
              'Warm, enthusiastic, clear Thai vocational admission counselor at Maharat College',
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        if (!data.audioBase64) {
          throw new Error('No audio returned from server.');
        }

        audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        this.audioCache.set(cacheKey, audioUrl);
      }

      options.onSourceChange?.('gemini');

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      if (options.rate && options.rate !== 1) {
        audio.playbackRate = options.rate;
      }

      audio.onplay = () => {
        options.onStart?.();
      };

      audio.onended = () => {
        this.currentAudio = null;
        options.onEnded?.();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error, falling back to Web Speech API', e);
        this.fallbackWebSpeech(text, options);
      };

      await audio.play();
      return;
    } catch (err) {
      console.warn('Gemini 3.8 Flash TTS request failed, using Web Speech API fallback:', err);
      // Fallback to browser Web Speech API
      this.fallbackWebSpeech(text, options);
    }
  }

  private fallbackWebSpeech(text: string, options: PlaybackOptions) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options.onError?.(new Error('TTS not supported on this browser'));
      options.onEnded?.();
      return;
    }

    try {
      options.onSourceChange?.('browser');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'th-TH';
      utterance.rate = options.rate || 1.0;

      // Select Thai voice if available
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice = voices.find((v) => v.lang.includes('th') || v.lang.includes('TH'));
      if (thaiVoice) {
        utterance.voice = thaiVoice;
      }

      utterance.onstart = () => {
        this.isBrowserSpeaking = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isBrowserSpeaking = false;
        options.onEnded?.();
      };

      utterance.onerror = (event) => {
        this.isBrowserSpeaking = false;
        options.onError?.(event);
        options.onEnded?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      options.onError?.(e);
      options.onEnded?.();
    }
  }

  public pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (this.currentAudio) {
      this.currentAudio.play();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}

export const ttsService = new TTSService();
