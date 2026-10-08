import { Language } from '../types';

export interface SpeechResult {
  text: string;
  amount?: number;
  category?: string;
}

export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export class SpeechAssistant {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (isSpeechSupported()) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  public startListening(
    lang: Language,
    onResult: (result: SpeechResult) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      // Browser fallback simulation for environments without Web Speech
      this.simulateSpeech(lang, onResult, onEnd);
      return;
    }

    const langCode = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    this.recognition.lang = langCode;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        const parsed = this.parseTranscript(finalTranscript);
        onResult(parsed);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch {
      this.simulateSpeech(lang, onResult, onEnd);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  private parseTranscript(text: string): SpeechResult {
    // Extract any numbers from text
    const numbers = text.match(/\d+/g);
    let amount: number | undefined;
    if (numbers && numbers.length > 0) {
      amount = parseInt(numbers[0], 10);
    }

    return {
      text,
      amount
    };
  }

  private simulateSpeech(lang: Language, onResult: (res: SpeechResult) => void, onEnd: () => void) {
    // Sample presets if microphone unavailable
    const samples: Record<Language, { text: string; amount: number }[]> = {
      en: [
        { text: '600 rupees for weed removal labor', amount: 600 },
        { text: '1200 rupees for urea fertilizer', amount: 1200 },
        { text: '2500 rupees tractor plowing', amount: 2500 }
      ],
      te: [
        { text: 'కూలీల ఖర్చు 600 రూపాయలు', amount: 600 },
        { text: 'యూరియా ఎరువు 1200 రూపాయలు', amount: 1200 },
        { text: 'ట్రాక్టర్ దుక్కి 2500 రూపాయలు', amount: 2500 }
      ],
      hi: [
        { text: 'मजदूरी के 600 रुपये', amount: 600 },
        { text: 'खाद के 1200 रुपये', amount: 1200 },
        { text: 'ट्रैक्टर जुताई 2500 रुपये', amount: 2500 }
      ]
    };

    const pick = samples[lang][Math.floor(Math.random() * samples[lang].length)];
    setTimeout(() => {
      onResult({
        text: pick.text,
        amount: pick.amount
      });
      onEnd();
    }, 1500);
  }
}

export const speechAssistant = new SpeechAssistant();
