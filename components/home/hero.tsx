'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Mic, MicOff, FileText, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import NodeGraph from './node-graph'
import { useGeminiLive } from '@/hooks/useGeminiLive'
import { ConnectionState, AppMode } from '@/types'
import { ChatMessage } from '@/components/ChatMessage'
import { SparkleIcon, VoiceWaveformIcon, EQBarsIcon, OrbitDotsIcon } from '@/components/icons'
import { ExtractedDataPanel, ExtractionStatusWidget } from '@/components/ExtractedDataPanel'

const Hero = () => {
  // Get extraction data directly from the hook
  const {
    connect,
    disconnect,
    connectionState,
    messages,
    volume,
    extractedData,
    conversationContext,
    userInfo
  } = useGeminiLive()
  const [mode, setMode] = useState<AppMode>('dictation')
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<{ x: number; y: number; life: number; vx: number; vy: number; size: number }[]>([])

  const isActive = connectionState === ConnectionState.CONNECTED
  const isConnecting = connectionState === ConnectionState.CONNECTING
  const isError = connectionState === ConnectionState.ERROR

  // Auto-scroll messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleToggleConnection = () => {
    if (isActive) {
      disconnect()
    } else {
      connect(mode)
    }
  }

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === mode) return

    if (isActive) {
      disconnect()
      setTimeout(() => {
        setMode(newMode)
        connect(newMode)
      }, 500)
    } else {
      setMode(newMode)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseRef.current = { x, y }

      if (Math.random() > 0.7) {
        particlesRef.current.push({
          x: x,
          y: y,
          life: 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5
        })
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        const dpr = window.devicePixelRatio || 1
        const rect = containerRef.current.getBoundingClientRect()

        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr

        ctx.scale(dpr, dpr)
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
      }
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    // Wave layers - black/pink monochrome, no gradients
    const layers = [
      { color: 'rgba(236, 72, 153, 0.18)', speed: 0.0004, baseAmp: 25, yOffset: 0, width: 2.5, freq: 0.003 },
      { color: 'rgba(0, 0, 0, 0.08)', speed: 0.0006, baseAmp: 20, yOffset: 12, width: 2, freq: 0.004 },
      { color: 'rgba(236, 72, 153, 0.12)', speed: 0.0008, baseAmp: 16, yOffset: -10, width: 1.5, freq: 0.005 },
      { color: 'rgba(0, 0, 0, 0.05)', speed: 0.001, baseAmp: 12, yOffset: 20, width: 1, freq: 0.006 }
    ]

    const draw = () => {
      if (!canvas || !ctx) return

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)
      const centerY = height * 0.45

      ctx.clearRect(0, 0, width, height)
      timeRef.current += 1

      const vol = isActive ? volume : 0
      // Idle breathing animation - continuous subtle movement
      const breathe = Math.sin(timeRef.current * 0.015) * 0.3 + 1

      // Draw Aurora Waves with continuous animation
      layers.forEach((layer, i) => {
        ctx.beginPath()
        ctx.strokeStyle = layer.color
        ctx.lineWidth = layer.width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.moveTo(0, centerY)

        const step = 4
        // Always animate - idle uses breathe, active uses volume
        const currentAmp = layer.baseAmp * breathe + vol * 50

        for (let x = 0; x <= width; x += step) {
          // Multiple wave frequencies for organic movement
          const wave1 = Math.sin(x * layer.freq + timeRef.current * layer.speed)
          const wave2 = Math.cos(x * (layer.freq * 0.7) + timeRef.current * (layer.speed * 1.3) + i * 1.5)
          const wave3 = Math.sin(x * (layer.freq * 0.4) + timeRef.current * (layer.speed * 0.7) - i) * 0.5

          const y = centerY + (wave1 + wave2 + wave3) * currentAmp + layer.yOffset
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      // Draw Cursor Trail
      particlesRef.current.forEach((p, index) => {
        p.life -= 0.025
        p.x += p.vx
        p.y += p.vy

        if (p.life > 0) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(236, 72, 153, ${p.life * 0.1})`
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          particlesRef.current.splice(index, 1)
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive, volume])

  return (
    <section
      ref={containerRef}
      id='home'
      className='relative flex min-h-screen flex-col overflow-hidden bg-white px-4 pb-8 pt-20 md:pt-24'
      onMouseMove={handleMouseMove}
    >
      {/* Grid Background */}
      <div
        className='pointer-events-none absolute inset-0 z-0 opacity-40'
        style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(to right, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)'
        }}
      ></div>

      {/* Canvas Layer */}
      <canvas ref={canvasRef} className='pointer-events-none absolute inset-0 z-0 h-full w-full' />

      {/* Main Content */}
      <div className='container relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center'>
        {/* Refined Badge */}
        <motion.div
          className='mb-6 inline-flex items-center gap-2.5 rounded-full border border-pink-500/20 bg-white/90 px-4 py-1.5 text-sm shadow-sm backdrop-blur-sm'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <SparkleIcon size={12} className='text-pink-500' animated />
          <span className='font-medium tracking-wide text-black/70'>Next-Gen Voice AI</span>
          <motion.span
            className='relative flex h-2 w-2'
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400/60'></span>
            <span className='relative inline-flex h-2 w-2 rounded-full bg-pink-500'></span>
          </motion.span>
        </motion.div>

        {/* Refined Headline */}
        <motion.h1
          className='mb-4 text-4xl font-black leading-[1.05] tracking-tighter text-black md:text-5xl lg:text-6xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className='relative inline-block'>
            Turn Voice into
            {/* Animated decorative underline */}
            <motion.svg
              className='absolute -bottom-1 left-0 h-1.5 w-full'
              viewBox='0 0 200 6'
              preserveAspectRatio='none'
            >
              <motion.path
                d='M0 3 Q50 0 100 3 T200 3'
                stroke='rgba(236, 72, 153, 0.4)'
                strokeWidth='3'
                fill='none'
                strokeLinecap='round'
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.svg>
          </span>
          <span className='mt-1 block pb-2 text-5xl font-black text-black md:mt-2 md:text-7xl lg:text-8xl'>
            Actionable Data
          </span>
        </motion.h1>

        {/* Subhead */}
        <p className='mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg'>
          Experience real-time intelligence. Our advanced engine visualizes and processes your voice instantly,
          transforming spoken words into structured insights.
        </p>

        {/* Mode Switcher */}
        <div className='mb-6 flex rounded-xl border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm'>
          <button
            onClick={() => handleModeChange('conversation')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === 'conversation'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <MessageSquare className='h-4 w-4' />
            Chat
          </button>
          <button
            onClick={() => handleModeChange('dictation')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === 'dictation'
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <FileText className='h-4 w-4' />
            Dictate
          </button>
        </div>

        {/* Refined CTA Buttons */}
        <motion.div
          className='mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className='relative'>
            {/* Pulsing glow ring behind button */}
            {!isActive && !isConnecting && (
              <motion.div
                className='absolute -inset-1 rounded-xl bg-pink-500/20 blur-lg'
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
            {isActive && (
              <motion.div
                className='absolute -inset-1 rounded-xl bg-pink-500/40 blur-md'
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.03, 0.98]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
            <Button
              size='lg'
              className={`group relative min-w-[200px] text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl ${
                isActive
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : isConnecting
                    ? 'bg-black/50 text-white'
                    : 'bg-black text-white hover:bg-black/90'
              }`}
              onClick={handleToggleConnection}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <OrbitDotsIcon size={18} className='mr-2' />
                  Connecting...
                </>
              ) : isActive ? (
                <>
                  <MicOff className='mr-2 h-4 w-4 transition-transform group-hover:scale-110' />
                  Stop Session
                </>
              ) : (
                <>
                  <VoiceWaveformIcon size={18} className='mr-2 transition-transform group-hover:scale-110' />
                  Start Demo
                </>
              )}
            </Button>
          </div>

          <Button
            variant='outline'
            size='lg'
            className='group min-w-[160px] border-black/10 bg-white text-base font-medium text-black transition-all duration-300 hover:border-black/20 hover:bg-black/5'
            onClick={scrollToFeatures}
          >
            Learn more
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Button>
        </motion.div>

        {/* Error State */}
        {isError && (
          <div className='mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600'>
            Connection failed. Please check your API key configuration.
          </div>
        )}

        {/* Live Transcription Area */}
        <AnimatePresence>
        {(isActive || isConnecting || messages.length > 0) && (
          <motion.div
            className='mx-auto mb-8 w-full max-w-2xl'
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className='overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl shadow-black/5'>
              {/* Header */}
              <div className='flex items-center justify-between border-b border-black/5 bg-black/[0.02] px-4 py-3'>
                <div className='flex items-center gap-2'>
                  {isActive ? (
                    <>
                      <span className='relative flex h-1.5 w-1.5'>
                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-black/40'></span>
                        <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-black'></span>
                      </span>
                      <span className='text-xs font-medium uppercase tracking-wider text-black/60'>
                        {volume > 0.02 ? 'Speaking' : 'Listening'}
                      </span>
                    </>
                  ) : isConnecting ? (
                    <>
                      <OrbitDotsIcon size={12} className='text-black/40' />
                      <span className='text-xs font-medium uppercase tracking-wider text-black/40'>Initializing...</span>
                    </>
                  ) : (
                    <span className='text-xs font-medium uppercase tracking-wider text-black/30'>Session Ended</span>
                  )}
                </div>
                <span className='rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-medium text-black/50'>
                  {mode === 'dictation' ? 'Dictation' : 'Chat'}
                </span>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className='max-h-[280px] min-h-[120px] overflow-y-auto p-4'>
                {messages.length === 0 ? (
                  <div className='flex h-full min-h-[100px] flex-col items-center justify-center text-center'>
                    <Mic className='mb-2 h-8 w-8 text-gray-300' />
                    <p className='text-sm text-gray-400'>
                      {isActive
                        ? 'Start speaking in English or Khmer...'
                        : isConnecting
                          ? 'Setting up audio connection...'
                          : 'Click Start Demo to begin'}
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {messages.map(msg => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                  </div>
                )}
              </div>

              {/* Refined Volume Indicator */}
              {isActive && (
                <div className='border-t border-black/5 bg-black/[0.02] px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <EQBarsIcon size={20} volume={volume} className='flex-shrink-0 text-black/50' />
                    <div className='flex-1'>
                      <div className='mb-1.5 flex items-center justify-between'>
                        <span className='text-[10px] font-medium uppercase tracking-wider text-black/40'>Audio Level</span>
                        <span className='font-mono text-[10px] font-medium text-black/30'>
                          {Math.round(volume * 100)}%
                        </span>
                      </div>
                      <div className='h-1.5 overflow-hidden rounded-full bg-black/5'>
                        <motion.div
                          className='h-full rounded-full bg-black/30'
                          animate={{ width: `${Math.min(volume * 100 * 3, 100)}%` }}
                          transition={{ duration: 0.075, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Extraction Status Widget */}
            {extractedData && messages.length > 0 && (
              <div className='mt-3 flex justify-center'>
                <ExtractionStatusWidget
                  extraction={extractedData}
                  onClick={() => setIsPanelOpen(true)}
                  theme='light'
                />
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Node Graph - Only visible when not actively transcribing */}
      <div
        className={`relative z-10 mt-auto w-full transition-all duration-500 ${
          isActive || messages.length > 0 ? 'scale-90 opacity-30 blur-[1px]' : 'scale-100 opacity-100'
        }`}
      >
        <NodeGraph theme='light' />
      </div>

      {/* Extracted Data Panel */}
      <ExtractedDataPanel
        extraction={extractedData}
        context={conversationContext}
        userInfo={userInfo}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        theme='light'
      />
    </section>
  )
}

export default Hero
