'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowUpRight,
  Lock,
  Zap,
  Layers,
  BarChart3,
  Command,
  FileText,
  Settings,
  ShieldCheck
} from 'lucide-react'

const ScrollReveal = ({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const Features = () => {
  return (
    <section id='features' className='relative overflow-hidden border-t border-gray-100 bg-white py-32'>
      <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

      <div className='container relative z-10 mx-auto px-4 md:px-6'>
        <ScrollReveal className='mx-auto mb-24 max-w-3xl text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary shadow-sm'>
            <Layers className='h-3 w-3' />
            <span>Core Capabilities</span>
          </div>
          <h2 className='mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-5xl'>
            Everything you need to <br className='hidden md:block' />
            build world-class products.
          </h2>
          <p className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-500 md:text-xl'>
            A comprehensive suite of tools designed for scalability, security, and performance. Engineered for teams
            who demand the best.
          </p>
          <div className='flex justify-center gap-4'>
            <Button className='group h-11 rounded-full bg-primary px-8 text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90'>
              Get Started
              <ArrowUpRight className='ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1' />
            </Button>
            <Button variant='outline' className='h-11 rounded-full border-gray-200 px-8 hover:border-primary/30 hover:bg-primary/5 hover:text-primary'>
              View Documentation
            </Button>
          </div>
        </ScrollReveal>

        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6'>
          <ScrollReveal className='h-full lg:col-span-3' delay={0}>
            <div className='group relative flex h-full min-h-[300px] cursor-default flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5'>
              <div className='relative z-10 mb-6 flex h-48 items-center justify-center'>
                <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-30 [background-size:16px_16px]'></div>

                <div className='relative h-[200px] w-full max-w-[400px]'>
                  <svg
                    className='absolute inset-0 h-full w-full overflow-visible'
                    viewBox='0 0 400 200'
                    preserveAspectRatio='xMidYMid meet'
                  >
                    <path id='path1' d='M50,100 Q125,100 200,50 T350,100' fill='none' stroke='#e5e7eb' strokeWidth='2' />
                    <path id='path2' d='M50,100 Q125,100 200,150 T350,100' fill='none' stroke='#e5e7eb' strokeWidth='2' />

                    <path
                      d='M50,100 Q125,100 200,50 T350,100'
                      fill='none'
                      stroke='hsl(var(--primary))'
                      strokeWidth='2'
                      strokeDasharray='8 8'
                      className='animate-[flow_3s_linear_infinite]'
                      style={{ opacity: 0.4 }}
                    />
                    <path
                      d='M50,100 Q125,100 200,150 T350,100'
                      fill='none'
                      stroke='hsl(var(--primary))'
                      strokeWidth='2'
                      strokeDasharray='8 8'
                      className='animate-[flow_3s_linear_infinite_reverse]'
                      style={{ opacity: 0.4 }}
                    />

                    <circle r='3' fill='hsl(var(--primary))'>
                      <animateMotion repeatCount='indefinite' dur='3s' keyPoints='0;1' keyTimes='0;1'>
                        <mpath href='#path1' />
                      </animateMotion>
                    </circle>
                    <circle r='3' fill='hsl(var(--primary))'>
                      <animateMotion repeatCount='indefinite' dur='3s' keyPoints='0;1' keyTimes='0;1' begin='1.5s'>
                        <mpath href='#path2' />
                      </animateMotion>
                    </circle>
                  </svg>

                  <div className='group/node absolute left-[50px] top-[100px] z-20 -translate-x-1/2 -translate-y-1/2'>
                    <div className='relative flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary group-hover/node:shadow-md'>
                      <Command className='h-5 w-5 text-gray-500 transition-colors group-hover/node:text-primary' />
                    </div>
                    <div className='pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover/node:-translate-y-1 group-hover/node:opacity-100'>
                      Source
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary'></div>
                    </div>
                  </div>

                  <div className='group/node absolute left-[200px] top-[50px] z-20 -translate-x-1/2 -translate-y-1/2'>
                    <div className='relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary/50 group-hover/node:bg-white'>
                      <FileText className='h-4 w-4 text-gray-400 transition-colors group-hover/node:text-primary' />
                    </div>
                    <div className='pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover/node:-translate-y-1 group-hover/node:opacity-100'>
                      Logic
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary'></div>
                    </div>
                  </div>

                  <div className='group/node absolute left-[200px] top-[150px] z-20 -translate-x-1/2 -translate-y-1/2'>
                    <div className='relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300 group-hover/node:scale-110 group-hover/node:border-primary/50 group-hover/node:bg-white'>
                      <Settings className='h-4 w-4 text-gray-400 transition-colors group-hover/node:text-primary' />
                    </div>
                    <div className='pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover/node:translate-y-1 group-hover/node:opacity-100'>
                      Config
                      <div className='absolute -top-1 left-1/2 -translate-x-1/2 border-b-4 border-l-4 border-r-4 border-b-primary border-l-transparent border-r-transparent'></div>
                    </div>
                  </div>

                  <div className='group/node absolute left-[350px] top-[100px] z-20 -translate-x-1/2 -translate-y-1/2'>
                    <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover/node:scale-110 group-hover/node:shadow-xl group-hover/node:shadow-primary/20'>
                      <Zap className='h-5 w-5 transition-all group-hover/node:fill-current' />
                    </div>
                    <div className='pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover/node:-translate-y-1 group-hover/node:opacity-100'>
                      Action
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary'></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='mb-2 text-xl font-bold text-gray-900'>Workflow Automation</h3>
                <p className='text-sm leading-relaxed text-gray-500'>
                  Orchestrate complex logic with our visual builder. Connect disparate services into a single, cohesive
                  pipeline.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className='h-full lg:col-span-3' delay={100}>
            <div className='group relative flex h-full min-h-[300px] cursor-default flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5'>
              <div className='relative z-10 mb-6 flex h-48 items-center justify-center'>
                <div className='flex h-[90%] w-[85%] transform overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-700 ease-out [transform:rotateX(6deg)_rotateY(-8deg)] group-hover:scale-105 group-hover:[transform:rotateX(0deg)_rotateY(0deg)]'>
                  <div className='flex w-16 flex-col gap-3 border-r border-gray-100 bg-gray-50/50 p-3'>
                    <div className='h-6 w-6 rounded-md bg-primary/80 transition-all duration-500 group-hover:bg-primary'></div>
                    <div className='my-1 h-px w-full bg-gray-200'></div>
                    <div className='h-2 w-8 rounded-full bg-gray-200 transition-all duration-500 group-hover:w-10'></div>
                    <div className='h-2 w-6 rounded-full bg-gray-100 transition-all delay-75 duration-500 group-hover:w-8'></div>
                    <div className='h-2 w-7 rounded-full bg-gray-100 transition-all delay-100 duration-500 group-hover:w-9'></div>
                  </div>
                  <div className='flex-1 bg-white p-4'>
                    <div className='mb-4 flex items-center justify-between'>
                      <div className='h-3 w-20 rounded-full bg-gray-100 transition-colors duration-500 group-hover:bg-primary/10'></div>
                      <div className='h-6 w-6 rounded-full bg-gray-100 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/10'></div>
                    </div>
                    <div className='space-y-3'>
                      {[1, 2, 3].map(i => (
                        <div key={i} className='flex items-center gap-3 transition-transform duration-300 hover:translate-x-1'>
                          <div className='h-8 w-8 rounded-lg border border-gray-100 bg-gray-50 group-hover:border-primary/20 group-hover:bg-primary/5'></div>
                          <div className='flex-1 space-y-1.5'>
                            <div className='h-2 w-24 rounded-full bg-gray-100 transition-all duration-500 group-hover:w-28 group-hover:bg-primary/10'></div>
                            <div className='h-1.5 w-16 rounded-full bg-gray-50'></div>
                          </div>
                          <div className='h-4 w-10 rounded-full bg-gray-50 transition-colors group-hover:bg-primary/20'></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='mb-2 text-xl font-bold text-gray-900'>Modern Interface</h3>
                <p className='text-sm leading-relaxed text-gray-500'>
                  Pre-built, accessible components that look great on any device. Fully customizable to match your
                  brand identity.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className='h-full lg:col-span-2' delay={200}>
            <div className='group relative flex h-full cursor-default flex-col overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-6 transition-all duration-500 hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/5'>
              <div className='relative z-10 mb-6 flex h-32 w-full items-end'>
                <svg className='h-full w-full overflow-visible' viewBox='0 0 100 50' preserveAspectRatio='none'>
                  <defs>
                    <linearGradient id='chartGradient' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='hsl(var(--primary))' stopOpacity='0.1' />
                      <stop offset='100%' stopColor='hsl(var(--primary))' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                  <path
                    d='M0,50 L0,30 Q25,10 50,25 T100,15 L100,50 Z'
                    fill='url(#chartGradient)'
                    className='transition-opacity duration-300 group-hover:opacity-80'
                  />
                  <path
                    id='chartLine'
                    d='M0,30 Q25,10 50,25 T100,15'
                    fill='none'
                    stroke='hsl(var(--primary))'
                    strokeWidth='1.5'
                    vectorEffect='non-scaling-stroke'
                  />

                  <line
                    x1='50'
                    y1='0'
                    x2='50'
                    y2='50'
                    stroke='hsl(var(--primary))'
                    strokeWidth='1'
                    strokeDasharray='2 2'
                    className='opacity-0 transition-opacity duration-300 group-hover:opacity-40'
                  >
                    <animate attributeName='x1' values='0;100;0' dur='5s' repeatCount='indefinite' />
                    <animate attributeName='x2' values='0;100;0' dur='5s' repeatCount='indefinite' />
                  </line>
                  <circle r='2' fill='hsl(var(--primary))' className='opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <animateMotion dur='5s' repeatCount='indefinite'>
                      <mpath href='#chartLine' />
                    </animateMotion>
                  </circle>
                </svg>
                <div className='absolute right-4 top-4 rounded border border-primary/20 bg-white px-2 py-1 font-mono text-[10px] text-primary opacity-0 shadow-sm transition-opacity delay-100 group-hover:opacity-100'>
                  +24.5%
                </div>
              </div>

              <div className='mt-auto'>
                <div className='mb-2 flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5 text-gray-900' />
                  <h3 className='text-lg font-bold text-gray-900'>Advanced Analytics</h3>
                </div>
                <p className='text-sm leading-snug text-gray-500'>
                  Deep insights into user behavior and system performance metrics.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className='h-full lg:col-span-2' delay={300}>
            <div className='group relative flex h-full cursor-default flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-black p-6 text-white transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10'>
              <div className='relative z-10 mb-6 flex h-32 items-center justify-center'>
                <div className='relative flex h-16 w-16 items-center justify-center'>
                  <ShieldCheck className='relative z-20 h-10 w-10 text-white transition-colors duration-300 group-hover:text-primary' />

                  <div className='absolute inset-0 z-30 h-full w-full animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100'></div>

                  <div className='absolute inset-0 scale-125 rounded-full border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:border-primary/30'></div>
                  <div className='absolute inset-0 scale-150 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-white/10 group-hover:animate-[spin_6s_linear_infinite] group-hover:border-primary/20'></div>
                </div>
              </div>

              <div className='mt-auto'>
                <div className='mb-2 flex items-center gap-2'>
                  <Lock className='h-5 w-5 text-white/80' />
                  <h3 className='text-lg font-bold text-white'>Enterprise Security</h3>
                </div>
                <p className='text-sm leading-snug text-gray-400'>
                  SOC2 Type II certified. End-to-end encryption for all sensitive data.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className='h-full lg:col-span-2' delay={400}>
            <div className='group relative flex h-full cursor-default flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'>
              <div className='relative z-10 mb-6 h-32 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-3 font-mono text-[10px] leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-600'>
                <div className='animate-[scrollUp_8s_linear_infinite]'>
                  <p>
                    <span className='text-primary'>&#10003;</span> Connected to socket.io
                  </p>
                  <p>Incoming stream: 402kb</p>
                  <p>Processing payload...</p>
                  <p className='text-primary'>&rarr; Syncing database</p>
                  <p>User joined: @alex_d</p>
                  <p>Updated state: active</p>
                  <p>
                    <span className='text-primary'>&#10003;</span> Batch complete
                  </p>
                  <p>Waiting for events...</p>
                  <p>
                    <span className='text-primary'>&#10003;</span> Connected to socket.io
                  </p>
                  <p>Incoming stream: 402kb</p>
                </div>
                <div className='absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t from-gray-50 to-transparent'></div>
              </div>

              <div className='mt-auto'>
                <div className='mb-2 flex items-center gap-2'>
                  <Zap className='h-5 w-5 text-gray-900' />
                  <h3 className='text-lg font-bold text-gray-900'>Real-time Sync</h3>
                </div>
                <p className='text-sm leading-snug text-gray-500'>
                  Instant updates across all clients via WebSocket infrastructure.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 32; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scan {
            0%, 100% { transform: translateY(-100%); }
            50% { transform: translateY(100%); }
        }
        @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  )
}

export default Features
