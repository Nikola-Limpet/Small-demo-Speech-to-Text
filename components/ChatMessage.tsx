import React from 'react';
import { Message } from '../types';
import { Bot, User, Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  // Check if message is from model and is currently being generated
  const isGenerating = !isUser && message.isPartial;
  
  return (
    <div className={`flex w-full mb-8 group ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-2xl w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar Area (Minimalist) */}
        <div className={`flex-shrink-0 w-8 h-8 flex items-start justify-center mt-1 relative ${
          isUser ? 'ml-4' : 'mr-4'
        }`}>
          {isUser ? (
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm z-10">
                <User size={14} className="text-black" />
            </div>
          ) : (
            <div className="relative">
                {isGenerating && (
                    <div className="absolute -inset-1 rounded-full border border-white/20 animate-pulse-slow"></div>
                )}
                <div className={`w-6 h-6 rounded-md border border-zinc-800 flex items-center justify-center bg-black z-10 relative ${isGenerating ? 'ring-1 ring-white/30' : ''}`}>
                    <Bot size={14} className="text-zinc-400" />
                </div>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full overflow-hidden`}>
          <div className={`text-sm md:text-base font-khmer leading-7 whitespace-pre-wrap ${
            isUser 
              ? 'bg-zinc-100 text-black px-4 py-3 rounded-lg shadow-sm border border-transparent' 
              : 'text-zinc-300 py-1' // Minimalist text for model
          }`}>
             {/* Render Text */}
             {message.text}
             
             {/* Streaming Cursor (Block style) */}
             {isGenerating && message.text.length > 0 && (
               <span className="inline-block w-2 h-4 ml-1 bg-zinc-500 align-middle animate-pulse rounded-[1px]"/>
             )}

             {/* Thinking Dots (Initial State - Empty Text) */}
             {isGenerating && message.text.length === 0 && (
                 <div className="flex items-center gap-1 h-7 px-1">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                 </div>
             )}
          </div>
          
          {/* Metadata / Status Label */}
          <div className={`flex items-center mt-2 ${isUser ? 'mr-1 justify-end' : 'ml-0 justify-start'}`}>
              {isGenerating ? (
                   <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 tracking-wider animate-pulse">
                       <Loader2 size={10} className="animate-spin" />
                       GENERATING
                   </span>
              ) : (
                  <span className={`text-[10px] text-zinc-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};