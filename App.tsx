import React, { useEffect, useRef, useState } from 'react';
import { useGeminiLive } from './hooks/useGeminiLive';
import { ConnectionState, AppMode } from './types';
import { Visualizer } from './components/Visualizer';
import { ChatMessage } from './components/ChatMessage';
import { Mic, MicOff, AlertCircle, Loader2, MessageSquare, FileText, Command, Zap, Upload } from 'lucide-react';
import { AudioUpload } from './components/AudioUpload';
import { useAudioUpload } from './hooks/useAudioUpload';

const App: React.FC = () => {
  const { connect, disconnect, connectionState, messages, volume } = useGeminiLive();
  const { transcribe, isProcessing, result, error, clear } = useAudioUpload();
  const [mode, setMode] = useState<AppMode>('conversation');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isActive = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;
  const isError = connectionState === ConnectionState.ERROR;

  const handleToggleConnection = () => {
    if (isActive) {
      disconnect();
    } else {
      connect(mode);
    }
  };

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return;
    
    // If active, we need to reconnect to apply new system instructions
    if (isActive) {
      disconnect();
      setTimeout(() => {
         setMode(newMode);
         connect(newMode);
      }, 500);
    } else {
      setMode(newMode);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black">
      
      {/* Navbar */}
      <nav className="flex-none border-b border-white/10 bg-black/50 backdrop-blur-xl z-20 h-14">
        <div className="max-w-screen-xl mx-auto h-full px-6 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                 <Zap size={14} className="text-black fill-current" />
             </div>
             <span className="font-bold text-sm tracking-tight text-white">RorHash</span>
             <span className="text-zinc-600 text-sm">/</span>
             <span className="text-zinc-400 text-sm font-medium">{mode === 'dictation' ? 'Dictation' : mode === 'upload' ? 'Upload' : 'Chat'}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
             {/* Mode Toggle (Segmented Control) */}
             <div className="hidden md:flex bg-zinc-900 border border-white/5 p-1 rounded-lg">
                <button
                  onClick={() => handleModeChange('conversation')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    mode === 'conversation'
                      ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <MessageSquare size={12} />
                  Chat
                </button>
                <button
                  onClick={() => handleModeChange('dictation')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    mode === 'dictation'
                      ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <FileText size={12} />
                  Dictate
                </button>
                <button
                  onClick={() => handleModeChange('upload')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    mode === 'upload'
                      ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/5'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Upload size={12} />
                  Upload
                </button>
             </div>
             
             {/* Status Badge */}
             <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-mono border ${
                 isActive 
                    ? 'border-green-500/20 bg-green-500/10 text-green-400' 
                    : 'border-zinc-800 bg-zinc-900 text-zinc-500'
             }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                {isActive ? 'ONLINE' : 'OFFLINE'}
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-3xl mx-auto w-full">
        
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide"
        >
          {/* Upload Mode UI */}
          {mode === 'upload' && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-8 flex items-center justify-center shadow-2xl shadow-black">
                <Upload size={32} className="text-zinc-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                Audio Upload
              </h1>
              <p className="text-zinc-500 max-w-md mx-auto mb-8 font-khmer leading-relaxed text-center">
                Upload an audio file to transcribe. Supports Khmer and English.
              </p>
              <AudioUpload
                onTranscribe={transcribe}
                isProcessing={isProcessing}
                result={result}
                error={error}
                onClear={clear}
              />
            </div>
          )}

          {/* Live Mode Empty State */}
          {mode !== 'upload' && messages.length === 0 && !isActive && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-8 flex items-center justify-center shadow-2xl shadow-black">
                 {mode === 'dictation' ? (
                   <FileText size={32} className="text-zinc-400" />
                 ) : (
                   <Command size={32} className="text-zinc-400" />
                 )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                {mode === 'dictation' ? 'Smart Dictation' : 'RorHash Voice'}
              </h1>
              <p className="text-zinc-500 max-w-md mx-auto mb-8 font-khmer leading-relaxed">
                {mode === 'dictation'
                  ? 'Speak naturally in English or Khmer. I will transcribe and format your text intelligently.'
                  : 'Start a natural conversation. Ask questions, brainstorm ideas, or just chat in two languages.'}
              </p>

              {/* Mobile Mode Switcher (Visible only on empty state mobile) */}
              <div className="flex md:hidden bg-zinc-900 border border-white/5 p-1 rounded-lg mb-8">
                <button
                  onClick={() => handleModeChange('conversation')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'conversation' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => handleModeChange('dictation')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'dictation' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                  }`}
                >
                  Dictate
                </button>
                <button
                  onClick={() => handleModeChange('upload')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    mode === 'upload' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
                  }`}
                >
                  Upload
                </button>
              </div>

              {isError && (
                 <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Connection failed. Please check configuration.</span>
                 </div>
              )}
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {/* Spacer for bottom bar */}
          <div className="h-32" />
        </div>

        {/* Floating Control Bar - Hidden in Upload mode */}
        {mode !== 'upload' && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center px-4 pointer-events-none">
           <div className="pointer-events-auto bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-black/50 p-2 pl-4 pr-2 flex items-center gap-6 max-w-md w-full justify-between transition-all duration-500 ease-out hover:border-white/20">
              
              {/* Left Side: Liquid Morphism Visualizer */}
              <div className="flex-1 flex items-center h-10">
                 {isActive || isConnecting ? (
                    <Visualizer volume={volume} isActive={isActive} isConnecting={isConnecting} />
                 ) : (
                    <span className="text-sm text-zinc-500 font-medium ml-4">
                        Ready to start
                    </span>
                 )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleToggleConnection}
                disabled={isConnecting}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-lg ${
                  isActive 
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                    : isConnecting 
                      ? 'bg-zinc-800 text-zinc-500'
                      : 'bg-white text-black hover:bg-zinc-200 shadow-white/10'
                }`}
              >
                {isConnecting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : isActive ? (
                  <MicOff size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </button>
           </div>
        </div>
        )}

      </main>
    </div>
  );
};

export default App;