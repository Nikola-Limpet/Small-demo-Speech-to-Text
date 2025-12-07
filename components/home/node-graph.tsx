'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MicPulseIcon,
  SoundWaveIcon,
  LanguageIcon,
  AnalyzeIcon,
  DataFlowIcon,
  ExportIcon,
  AIBrainIcon
} from '@/components/icons'

interface NodeGraphProps {
  theme?: 'light' | 'dark'
}

const NodeGraph = ({ theme = 'light' }: NodeGraphProps) => {
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const nodes = [
    { Icon: MicPulseIcon, label: 'Voice Capture', x: 20, y: 20, delay: 0.2, isLeft: true },
    { Icon: SoundWaveIcon, label: 'Audio Processing', x: 5, y: 50, delay: 0.4, isLeft: true },
    { Icon: LanguageIcon, label: 'Translation', x: 20, y: 80, delay: 0.6, isLeft: true },
    { Icon: AnalyzeIcon, label: 'Transcription', x: 80, y: 20, delay: 0.8, isLeft: false },
    { Icon: DataFlowIcon, label: 'Actions', x: 95, y: 50, delay: 1.0, isLeft: false },
    { Icon: ExportIcon, label: 'Export', x: 80, y: 80, delay: 1.2, isLeft: false }
  ]

  const isDark = theme === 'dark'

  // Calculate line paths for particles
  const linePaths = useMemo(() => {
    return nodes.map(node => {
      const startX = node.isLeft ? node.x : 50
      const startY = node.isLeft ? node.y : 50
      const endX = node.isLeft ? 50 : node.x
      const endY = node.isLeft ? 50 : node.y
      return { startX, startY, endX, endY }
    })
  }, [])

  return (
    <div className='relative mx-auto mt-8 h-[300px] w-full max-w-[900px] select-none md:h-[400px]'>
      {/* Connection Lines SVG */}
      <svg className='pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible'>
        <defs>
          {/* Gradient for active state - Primary Color */}
          <linearGradient id='active-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='hsl(var(--primary))' stopOpacity='0.1' />
            <stop offset='50%' stopColor='hsl(var(--primary))' stopOpacity='0.6' />
            <stop offset='100%' stopColor='hsl(var(--primary))' stopOpacity='0.1' />
          </linearGradient>
        </defs>

        {nodes.map((node, i) => {
          const path = linePaths[i]
          const isActive = activeNode === i

          return (
            <g key={i}>
              {/* Base solid line */}
              <motion.line
                x1={`${path.startX}%`}
                y1={`${path.startY}%`}
                x2={`${path.endX}%`}
                y2={`${path.endY}%`}
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                strokeWidth='1.5'
                strokeLinecap='round'
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: mounted ? 1 : 0, opacity: mounted ? 1 : 0 }}
                transition={{ duration: 1.5, delay: node.delay, ease: 'easeOut' }}
              />

              {/* Active highlight line */}
              {isActive && (
                <motion.line
                  x1={`${path.startX}%`}
                  y1={`${path.startY}%`}
                  x2={`${path.endX}%`}
                  y2={`${path.endY}%`}
                  stroke='url(#active-gradient)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              {/* Traveling particles - 1 per line */}
              {mounted && (
                <motion.circle
                  key={`particle-${i}`}
                  r='2.5'
                  fill={isActive ? 'hsl(var(--primary))' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0.6, 0],
                    cx: [`${path.startX}%`, `${path.endX}%`],
                    cy: [`${path.startY}%`, `${path.endY}%`]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: node.delay,
                    ease: 'linear'
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Center Node - AI Core */}
      <motion.div
        className='absolute left-1/2 top-1/2 z-20'
        initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8, x: '-50%', y: '-50%' }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      >
        <div className='group relative cursor-pointer'>
          {/* Rotating dashed border ring */}
          <motion.div
            className='pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] rounded-[2rem]'
            style={{
              x: '-50%',
              y: '-50%',
              border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />

          {/* Second rotating ring (opposite direction) */}
          <motion.div
            className='pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] rounded-[1.5rem]'
            style={{
              x: '-50%',
              y: '-50%',
              border: `1px dashed ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          />

          {/* Main container */}
          <motion.div
            className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border shadow-xl md:h-28 md:w-28 ${
              isDark
                ? 'border-neutral-800 bg-neutral-900'
                : 'border-neutral-200 bg-white'
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            {/* Inner icon container */}
            <motion.div
              className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black'
              }`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AIBrainIcon size={26} animated />
            </motion.div>
          </motion.div>

          {/* Tooltip */}
          <motion.div
            className={`pointer-events-none absolute -bottom-12 left-1/2 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-sm ${
              isDark
                ? 'border-neutral-800 bg-neutral-900/90 text-neutral-300'
                : 'border-neutral-200 bg-white/90 text-neutral-600 shadow-sm'
            }`}
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 5 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            AI Core Engine
          </motion.div>
        </div>
      </motion.div>

      {/* Surrounding Nodes */}
      {nodes.map((node, i) => {
        const isActive = activeNode === i

        return (
          <motion.div
            key={i}
            className='absolute z-10'
            style={{ left: `${node.x}%`, top: `${node.y}%`, x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0 }}
            transition={{ duration: 0.8, delay: node.delay, ease: 'backOut' }}
            onMouseEnter={() => setActiveNode(i)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className={`pointer-events-none absolute -top-12 left-1/2 z-50 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm ${
                    isDark
                      ? 'border-neutral-800 bg-neutral-900/95 text-white'
                      : 'border-neutral-200 bg-white text-black'
                  }`}
                  style={{ x: '-50%' }}
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {node.label}
                  <div
                    className={`absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r ${
                      isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Node */}
            <motion.div
              className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-500 md:h-16 md:w-16 ${
                isDark
                  ? `bg-neutral-900 ${isActive ? 'border-primary text-primary' : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'}`
                  : `bg-white shadow-sm ${isActive ? 'border-primary text-primary shadow-primary/20' : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'}`
              }`}
              whileHover={{ scale: 1.05 }}
              animate={isActive ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Pulse ring on active */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className='absolute inset-0 rounded-2xl border border-primary/50'
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                )}
              </AnimatePresence>

              <node.Icon size={24} animated={isActive} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default NodeGraph
