/**
 * Audio File Upload Example using Gemini API
 *
 * Usage:
 *   npx tsx examples/upload-audio.ts path/to/audio.mp3
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable not set');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Supported audio MIME types
const MIME_TYPES: Record<string, string> = {
  '.mp3': 'audio/mp3',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.webm': 'audio/webm',
};

async function transcribeAudio(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext];

  if (!mimeType) {
    throw new Error(`Unsupported file type: ${ext}. Supported: ${Object.keys(MIME_TYPES).join(', ')}`);
  }

  console.log(`Reading: ${filePath}`);
  const audioData = fs.readFileSync(filePath);
  const base64Audio = audioData.toString('base64');

  console.log(`Uploading to Gemini (${(audioData.length / 1024 / 1024).toFixed(2)} MB)...`);

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Audio,
            },
          },
          {
            text: 'Transcribe this audio. If it contains Khmer or English, transcribe in the original language. Output only the transcription, no explanations.',
          },
        ],
      },
    ],
  });

  return response.text || '';
}

// Main
const audioFile = process.argv[2];

if (!audioFile) {
  console.log('Usage: npx tsx examples/upload-audio.ts <audio-file>');
  console.log('');
  console.log('Supported formats: mp3, wav, ogg, flac, m4a, aac, webm');
  console.log('');
  console.log('Example:');
  console.log('  npx tsx examples/upload-audio.ts recording.mp3');
  process.exit(0);
}

transcribeAudio(audioFile)
  .then((text) => {
    console.log('\n--- Transcription ---\n');
    console.log(text);
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
