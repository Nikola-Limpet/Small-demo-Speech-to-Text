'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExtractionResult,
  ConversationContext,
  UserInfo,
  ExtractedEntity
} from '@/utils/dataExtraction'
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Hash,
  Tag,
  Target,
  CheckSquare,
  TrendingUp,
  User,
  Globe,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react'

interface ExtractedDataPanelProps {
  extraction: ExtractionResult | null
  context: ConversationContext | null
  userInfo: UserInfo | null
  isOpen: boolean
  onClose: () => void
  theme?: 'light' | 'dark'
}

const entityIcons: Record<ExtractedEntity['type'], React.ReactNode> = {
  email: <Mail size={12} />,
  phone: <Phone size={12} />,
  date: <Calendar size={12} />,
  time: <Clock size={12} />,
  number: <Hash size={12} />,
  person: <User size={12} />,
  organization: <Target size={12} />,
  location: <Globe size={12} />,
  action: <CheckSquare size={12} />,
  topic: <Tag size={12} />
}

const sentimentColors = {
  positive: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  neutral: { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-500/20' },
  negative: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' }
}

export const ExtractedDataPanel: React.FC<ExtractedDataPanelProps> = ({
  extraction,
  context,
  userInfo,
  isOpen,
  onClose,
  theme = 'light'
}) => {
  const isDark = theme === 'dark'

  if (!extraction && !context && !userInfo) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed right-0 top-0 z-50 h-full w-80 overflow-hidden border-l shadow-2xl md:w-96 ${
            isDark
              ? 'border-white/10 bg-neutral-900'
              : 'border-black/5 bg-white'
          }`}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3 ${
            isDark ? 'border-white/10' : 'border-black/5'
          }`}>
            <div className='flex items-center gap-2'>
              <motion.div
                className='flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500 text-white'
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={14} />
              </motion.div>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                Extracted Insights
              </span>
            </div>
            <button
              onClick={onClose}
              className={`rounded-lg p-1.5 transition-colors ${
                isDark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-black/5 text-black/40'
              }`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className='h-[calc(100%-52px)] overflow-y-auto p-4'>
            {extraction && (
              <div className='space-y-4'>
                {/* Sentiment & Language */}
                <div className='flex gap-2'>
                  <motion.div
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      sentimentColors[extraction.sentiment].bg
                    } ${sentimentColors[extraction.sentiment].text} ${
                      sentimentColors[extraction.sentiment].border
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <TrendingUp size={12} />
                    {extraction.sentiment.charAt(0).toUpperCase() + extraction.sentiment.slice(1)}
                  </motion.div>
                  <motion.div
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      isDark
                        ? 'border-white/10 bg-white/5 text-white/70'
                        : 'border-black/10 bg-black/5 text-black/70'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Globe size={12} />
                    {extraction.language === 'km' ? 'Khmer' : extraction.language === 'mixed' ? 'Mixed' : 'English'}
                  </motion.div>
                </div>

                {/* Summary */}
                {extraction.summary && (
                  <motion.div
                    className={`rounded-xl border p-3 ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/[0.02]'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-black/40'
                    }`}>
                      Summary
                    </h4>
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-white/80' : 'text-black/70'
                    }`}>
                      {extraction.summary}
                    </p>
                  </motion.div>
                )}

                {/* Entities */}
                {extraction.entities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-black/40'
                    }`}>
                      Detected Entities ({extraction.entities.length})
                    </h4>
                    <div className='flex flex-wrap gap-1.5'>
                      {extraction.entities.map((entity, i) => (
                        <motion.div
                          key={`${entity.type}-${i}`}
                          className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs ${
                            isDark
                              ? 'border-white/10 bg-white/5 text-white/80'
                              : 'border-black/10 bg-white text-black/80 shadow-sm'
                          }`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          <span className={isDark ? 'text-pink-400' : 'text-pink-500'}>
                            {entityIcons[entity.type]}
                          </span>
                          <span className='max-w-[120px] truncate'>{entity.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Intents */}
                {extraction.intents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-black/40'
                    }`}>
                      Detected Intents
                    </h4>
                    <div className='space-y-1.5'>
                      {extraction.intents.map((intent, i) => (
                        <motion.div
                          key={`intent-${i}`}
                          className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                            isDark
                              ? 'border-white/10 bg-white/5'
                              : 'border-black/5 bg-black/[0.02]'
                          }`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                        >
                          <div className='flex items-center gap-2'>
                            <Target size={14} className='text-pink-500' />
                            <span className={`text-sm font-medium capitalize ${
                              isDark ? 'text-white' : 'text-black'
                            }`}>
                              {intent.intent}
                            </span>
                          </div>
                          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            {Math.round(intent.confidence * 100)}%
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Items */}
                {extraction.actionItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-black/40'
                    }`}>
                      Action Items ({extraction.actionItems.length})
                    </h4>
                    <div className='space-y-1.5'>
                      {extraction.actionItems.slice(0, 5).map((item, i) => (
                        <motion.div
                          key={`action-${i}`}
                          className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${
                            isDark
                              ? 'border-white/10 bg-white/5'
                              : 'border-pink-500/10 bg-pink-500/5'
                          }`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          <ChevronRight size={14} className='mt-0.5 flex-shrink-0 text-pink-500' />
                          <span className={`text-sm ${isDark ? 'text-white/80' : 'text-black/70'}`}>
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Keywords */}
                {extraction.keywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-white/40' : 'text-black/40'
                    }`}>
                      Keywords
                    </h4>
                    <div className='flex flex-wrap gap-1'>
                      {extraction.keywords.slice(0, 10).map((keyword, i) => (
                        <motion.span
                          key={`keyword-${i}`}
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            isDark
                              ? 'bg-white/10 text-white/60'
                              : 'bg-black/5 text-black/60'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.03 }}
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Context Section */}
            {context && context.turnCount > 0 && (
              <motion.div
                className={`mt-4 rounded-xl border p-3 ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/[0.02]'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-white/40' : 'text-black/40'
                }`}>
                  Conversation Context
                </h4>
                <div className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                  <p>Turns: {context.turnCount}</p>
                  {context.topics.length > 0 && (
                    <p>Topics: {context.topics.join(', ')}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* User Info Section */}
            {userInfo && (userInfo.contactInfo.email || userInfo.contactInfo.phone || userInfo.interests.length > 0) && (
              <motion.div
                className={`mt-4 rounded-xl border p-3 ${
                  isDark ? 'border-pink-500/20 bg-pink-500/5' : 'border-pink-500/10 bg-pink-500/5'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-pink-400' : 'text-pink-600'
                }`}>
                  <User size={12} />
                  Extracted User Info
                </h4>
                <div className={`space-y-1 text-sm ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                  {userInfo.contactInfo.email && (
                    <div className='flex items-center gap-2'>
                      <Mail size={12} className='text-pink-500' />
                      <span>{userInfo.contactInfo.email}</span>
                    </div>
                  )}
                  {userInfo.contactInfo.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone size={12} className='text-pink-500' />
                      <span>{userInfo.contactInfo.phone}</span>
                    </div>
                  )}
                  {userInfo.interests.length > 0 && (
                    <div className='mt-2'>
                      <span className={`text-xs ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                        Interests:
                      </span>
                      <div className='mt-1 flex flex-wrap gap-1'>
                        {userInfo.interests.slice(0, 8).map((interest, i) => (
                          <span
                            key={i}
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              isDark
                                ? 'bg-pink-500/20 text-pink-300'
                                : 'bg-pink-500/10 text-pink-600'
                            }`}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mini widget for showing extraction status
export const ExtractionStatusWidget: React.FC<{
  extraction: ExtractionResult | null
  onClick: () => void
  theme?: 'light' | 'dark'
}> = ({ extraction, onClick, theme = 'light' }) => {
  const isDark = theme === 'dark'

  if (!extraction) return null

  const totalItems = extraction.entities.length + extraction.intents.length + extraction.actionItems.length

  if (totalItems === 0) return null

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-lg transition-all ${
        isDark
          ? 'border-pink-500/30 bg-neutral-900 text-pink-400 hover:border-pink-500/50'
          : 'border-pink-500/20 bg-white text-pink-600 hover:border-pink-500/40 hover:shadow-pink-500/10'
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles size={14} />
      </motion.div>
      <span>{totalItems} insights extracted</span>
      <ChevronRight size={14} />
    </motion.button>
  )
}
