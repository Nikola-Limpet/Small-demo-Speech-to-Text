import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

interface UseAudioUploadResult {
  transcribe: (file: File) => Promise<void>;
  isProcessing: boolean;
  result: string | null;
  error: string | null;
  clear: () => void;
}

export const useAudioUpload = (): UseAudioUploadResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const transcribe = useCallback(async (file: File) => {
    if (!process.env.API_KEY) {
      setError('API Key is not configured');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          // Extract base64 data after the comma
          const base64Data = dataUrl.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Determine mime type
      let mimeType = file.type;
      if (!mimeType || mimeType === 'audio/mpeg') {
        mimeType = 'audio/mp3';
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64,
                },
              },
              {
                text: `Transcribe this audio accurately.
If it contains Khmer, transcribe in Khmer script.
If it contains English, transcribe in English.
If it contains both languages, transcribe each part in its original language.
Output ONLY the transcription text, no explanations or labels.`,
              },
            ],
          },
        ],
      });

      const text = response.text || '';
      if (!text.trim()) {
        setError('No speech detected in the audio');
      } else {
        setResult(text);
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError(err.message || 'Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    transcribe,
    isProcessing,
    result,
    error,
    clear,
  };
};
