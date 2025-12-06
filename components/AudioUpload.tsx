import React, { useRef, useState } from 'react';
import { Upload, FileAudio, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AudioUploadProps {
  onTranscribe: (file: File) => Promise<void>;
  isProcessing: boolean;
  result: string | null;
  error: string | null;
  onClear: () => void;
}

const SUPPORTED_TYPES = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/ogg',
  'audio/flac',
  'audio/mp4',
  'audio/m4a',
  'audio/aac',
  'audio/webm',
];

export const AudioUpload: React.FC<AudioUploadProps> = ({
  onTranscribe,
  isProcessing,
  result,
  error,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      alert('Unsupported file type. Please upload MP3, WAV, OGG, FLAC, M4A, AAC, or WebM.');
      return;
    }
    setFileName(file.name);
    onTranscribe(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setFileName(null);
    onClear();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      {!result && !isProcessing && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all
            ${dragOver
              ? 'border-white bg-white/5'
              : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
              <Upload size={24} className="text-zinc-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">Drop audio file here or click to browse</p>
              <p className="text-zinc-500 text-sm">MP3, WAV, OGG, FLAC, M4A, WebM supported</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="border border-zinc-800 rounded-xl p-8 bg-zinc-900/50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="text-white animate-spin" />
            <div className="text-center">
              <p className="text-white font-medium mb-1">Transcribing...</p>
              {fileName && (
                <p className="text-zinc-500 text-sm flex items-center gap-2 justify-center">
                  <FileAudio size={14} />
                  {fileName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="border border-zinc-800 rounded-xl bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Transcription Complete</span>
            </div>
            <button
              onClick={handleClear}
              className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <X size={16} className="text-zinc-400" />
            </button>
          </div>
          {fileName && (
            <div className="px-4 py-2 border-b border-zinc-800 flex items-center gap-2 text-zinc-500 text-sm">
              <FileAudio size={14} />
              {fileName}
            </div>
          )}
          <div className="p-4 max-h-96 overflow-y-auto">
            <p className="text-zinc-200 whitespace-pre-wrap font-khmer leading-relaxed">{result}</p>
          </div>
          <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900">
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/10">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium mb-1">Transcription Failed</p>
              <p className="text-red-400/70 text-sm">{error}</p>
              <button
                onClick={handleClear}
                className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
