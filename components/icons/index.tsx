'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface IconProps {
  size?: number
  className?: string
  animated?: boolean
  strokeWidth?: number
}

// Refined Voice Waveform - Minimal geometric bars with continuous animation
export const VoiceWaveformIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false,
  strokeWidth = 2
}) => {
  const bars = [
    { x: 4, baseH: 4, maxH: 8, delay: 0, phase: 0 },
    { x: 8, baseH: 8, maxH: 14, delay: 0.1, phase: 0.5 },
    { x: 12, baseH: 10, maxH: 16, delay: 0.15, phase: 1 },
    { x: 16, baseH: 6, maxH: 12, delay: 0.2, phase: 1.5 },
    { x: 20, baseH: 3, maxH: 6, delay: 0.25, phase: 2 }
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {bars.map((bar, i) => (
        <motion.line
          key={i}
          x1={bar.x}
          y1={12 - bar.baseH / 2}
          x2={bar.x}
          y2={12 + bar.baseH / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={animated ? {
            // Active animation - more dynamic
            y1: [12 - bar.maxH / 2, 12 - bar.baseH / 2, 12 - bar.maxH / 2],
            y2: [12 + bar.maxH / 2, 12 + bar.baseH / 2, 12 + bar.maxH / 2],
            opacity: [1, 0.7, 1]
          } : {
            // Idle animation - gentle breathing
            y1: [12 - bar.baseH / 2, 12 - (bar.baseH + 2) / 2, 12 - bar.baseH / 2],
            y2: [12 + bar.baseH / 2, 12 + (bar.baseH + 2) / 2, 12 + bar.baseH / 2],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: animated ? 0.5 : 1.2,
            repeat: Infinity,
            delay: bar.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </svg>
  )
}

// Refined AI Brain - Clean hexagonal neural network
export const AIBrainIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false,
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    {/* Hexagon frame */}
    <motion.path
      d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      fill="none"
      animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Center node */}
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    {/* Neural connections */}
    <motion.g
      animate={animated ? { opacity: [0.4, 0.8, 0.4] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <line x1="12" y1="9.5" x2="12" y2="5" stroke="currentColor" strokeWidth={strokeWidth} />
      <line x1="14" y1="13" x2="18" y2="15" stroke="currentColor" strokeWidth={strokeWidth} />
      <line x1="10" y1="13" x2="6" y2="15" stroke="currentColor" strokeWidth={strokeWidth} />
    </motion.g>
    {/* Outer nodes */}
    <circle cx="12" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="18" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="6" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
  </svg>
)

// Refined Sound Wave - Concentric arcs
export const SoundWaveIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false,
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    {[10, 14, 18].map((x, i) => (
      <motion.path
        key={i}
        d={`M${x} 7C${x + 3} 9 ${x + 3} 15 ${x} 17`}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        opacity={1 - i * 0.25}
        animate={animated ? { opacity: [1 - i * 0.25, 0.3, 1 - i * 0.25] } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.15
        }}
      />
    ))}
  </svg>
)

// Refined Mic Pulse - Minimal microphone
export const MicPulseIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false,
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    {/* Microphone body */}
    <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
    {/* Stand */}
    <path
      d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
    />
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Pulse rings */}
    {animated && (
      <>
        <motion.circle
          cx="12"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <motion.circle
          cx="12"
          cy="8"
          r="8"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        />
      </>
    )}
  </svg>
)

// Refined Language - Overlapping speech bubbles
export const LanguageIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false,
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <motion.path
      d="M4 5H13C14.1 5 15 5.9 15 7V12C15 13.1 14.1 14 13 14H7L4 17V7C4 5.9 4.9 5 4 5Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      fill="none"
      animate={animated ? { y: [0, -1, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.path
      d="M9 10H18C19.1 10 20 10.9 20 12V17C20 18.1 19.1 19 18 19H12L9 22V12C9 10.9 9.9 10 9 10Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      fill="none"
      opacity="0.6"
      animate={animated ? { y: [0, 1, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
    />
  </svg>
)

// Refined Data Flow - Minimal arrow
export const DataFlowIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false,
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <motion.path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      animate={animated ? { pathLength: [0.5, 1, 0.5] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.path
      d="M14 7L19 12L14 17"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      animate={animated ? { x: [0, 2, 0] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
)

// Refined Export - Upload arrow
export const ExportIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 1.5
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 3L12 15M12 3L7 8M12 3L17 8"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V14"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
)

// Refined Analyze - Chart bars
export const AnalyzeIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    {[
      { x: 5, h: 8 },
      { x: 10, h: 14 },
      { x: 15, h: 10 },
      { x: 20, h: 16 }
    ].map((bar, i) => (
      <motion.rect
        key={i}
        x={bar.x - 1.5}
        y={20 - bar.h}
        width="3"
        height={bar.h}
        rx="1"
        fill="currentColor"
        opacity={0.5 + i * 0.15}
        animate={animated ? {
          height: [bar.h, bar.h * 1.2, bar.h * 0.8, bar.h],
          y: [20 - bar.h, 20 - bar.h * 1.2, 20 - bar.h * 0.8, 20 - bar.h]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.1
        }}
      />
    ))}
  </svg>
)

// Refined Sparkle - Clean star with continuous animation
export const SparkleIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  animated = false
}) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    animate={animated ? {
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7]
    } : {
      // Idle - gentle twinkle
      scale: [1, 1.1, 1],
      opacity: [0.6, 1, 0.6]
    }}
    transition={{
      duration: animated ? 3 : 2,
      repeat: Infinity,
      ease: animated ? 'linear' : 'easeInOut'
    }}
  >
    <path d="M12 2L13.5 9L20 10L13.5 11L12 18L10.5 11L4 10L10.5 9L12 2Z" />
  </motion.svg>
)

// EQ Bars for volume indicator
export const EQBarsIcon: React.FC<IconProps & { volume?: number }> = ({
  size = 24,
  className = '',
  volume = 0
}) => {
  const barCount = 8
  const bars = Array.from({ length: barCount }, (_, i) => {
    const baseHeight = 3 + Math.sin(i * 0.8) * 2
    const volumeBoost = volume * 14 * (1 + Math.sin(i * 1.2) * 0.5)
    return Math.min(baseHeight + volumeBoost, 18)
  })

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {bars.map((height, i) => (
        <motion.rect
          key={i}
          x={2 + i * 2.75}
          y={12 - height / 2}
          width="2"
          height={height}
          rx="1"
          fill="currentColor"
          opacity={0.4 + (height / 18) * 0.6}
          animate={{ height, y: 12 - height / 2 }}
          transition={{ duration: 0.075, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

// Orbit Dots - Loading indicator
export const OrbitDotsIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    {[0, 1, 2].map(i => (
      <motion.circle
        key={i}
        r="1.5"
        fill="currentColor"
        opacity={0.6 - i * 0.15}
        animate={{
          cx: [12, 12 + 6 * Math.cos(i * 2.1), 12],
          cy: [12, 12 + 6 * Math.sin(i * 2.1), 12]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut'
        }}
      />
    ))}
  </svg>
)
