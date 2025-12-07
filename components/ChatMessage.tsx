'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Message } from '@/types'
import { Bot, User, Loader2 } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  theme?: 'light' | 'dark'
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme = 'light' }) => {
  const isUser = message.role === 'user'
  const isGenerating = !isUser && message.isPartial
  const isLight = theme === 'light'

  return (
    <motion.div
      className={`group flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className={`flex w-full max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`relative mt-1 flex h-8 w-8 flex-shrink-0 items-start justify-center ${isUser ? 'ml-3' : 'mr-3'}`}>
          {isUser ? (
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${
                isLight ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              <User size={14} />
            </div>
          ) : (
            <div className='relative'>
              {isGenerating && (
                <motion.div
                  className={`absolute -inset-1 rounded-full border ${
                    isLight ? 'border-pink-300' : 'border-white/20'
                  }`}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <div
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-md border ${
                  isLight
                    ? `border-black/5 bg-white ${isGenerating ? 'ring-1 ring-pink-200' : ''}`
                    : `border-white/10 bg-black ${isGenerating ? 'ring-1 ring-white/30' : ''}`
                }`}
              >
                <Bot size={14} className={isLight ? 'text-black/50' : 'text-white/60'} />
              </div>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex max-w-full flex-col overflow-hidden ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`whitespace-pre-wrap text-sm leading-relaxed md:text-base ${
              isUser
                ? isLight
                  ? 'rounded-2xl rounded-tr-sm border border-black/5 bg-black/5 px-4 py-2.5 text-black'
                  : 'rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white shadow-sm'
                : isLight
                  ? 'py-1 text-black/70'
                  : 'py-1 text-white/80'
            }`}
          >
            {message.text}

            {/* Streaming Cursor */}
            {isGenerating && message.text.length > 0 && (
              <motion.span
                className={`ml-1 inline-block h-4 w-0.5 align-middle ${
                  isLight ? 'bg-pink-400' : 'bg-white/60'
                }`}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}

            {/* Thinking Dots */}
            {isGenerating && message.text.length === 0 && (
              <div className='flex h-7 items-center gap-1 px-1'>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${isLight ? 'bg-pink-400' : 'bg-white/60'}`}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={`mt-1.5 flex items-center ${isUser ? 'mr-1 justify-end' : 'ml-0 justify-start'}`}>
            {isGenerating ? (
              <span
                className={`flex items-center gap-1.5 font-mono text-[10px] tracking-wider ${
                  isLight ? 'text-pink-500' : 'text-white/50'
                }`}
              >
                <Loader2 size={10} className='animate-spin' />
                GENERATING
              </span>
            ) : (
              <span
                className={`font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${
                  isLight ? 'text-black/30' : 'text-white/40'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
