'use client'

import { useState, useRef } from 'react'
import { GoogleGenAI } from '@google/genai'
import { Upload, Film, Loader2, Play, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>
      openSelectKey: () => Promise<void>
    }
  }
}

const VideoGenerator = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setGeneratedVideoUrl(null)
      setError(null)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please upload an image first.')
      return
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      setError('API Key is missing. Please check your environment variables.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedVideoUrl(null)
    setStatusMessage('Initializing Veo...')

    try {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey()
        if (!hasKey) {
          await window.aistudio.openSelectKey()
        }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
      const base64Image = await convertFileToBase64(selectedFile)

      setStatusMessage('Sending to Veo model...')

      let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-uhd',
        prompt: prompt || 'Animate this image cinematically',
        image: {
          imageBytes: base64Image,
          mimeType: selectedFile.type
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      })

      setStatusMessage('Dreaming up pixels (this takes a moment)...')

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        operation = await ai.operations.getVideosOperation({ operation: operation })
        setStatusMessage('Rendering frames...')
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri
        setStatusMessage('Downloading video...')

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`)
        const videoBlob = await videoResponse.blob()
        const videoObjectUrl = URL.createObjectURL(videoBlob)

        setGeneratedVideoUrl(videoObjectUrl)
        setStatusMessage('Complete!')
      } else {
        throw new Error('No video URI returned from API.')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong during generation.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id='veo-studio' className='border-t border-gray-100 bg-white py-20'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <div className='mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-2'>
            <Film className='h-5 w-5 text-primary' />
          </div>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Animate with Veo</h2>
          <p className='text-lg text-gray-500'>
            Bring static images to life using our advanced AI video generation model.
          </p>
        </div>

        <div className='mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2'>
          <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'>
            <h3 className='mb-6 text-xl font-semibold'>Configuration</h3>

            <div className='mb-8'>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Source Image</label>
              <div
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  previewUrl
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50 hover:bg-primary/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className='group relative'>
                    <img src={previewUrl} alt='Preview' className='mx-auto max-h-[200px] rounded-lg shadow-sm' />
                    <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
                      <p className='text-sm font-medium text-white'>Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'>
                      <Upload className='h-6 w-6' />
                    </div>
                    <p className='text-sm font-medium text-gray-900'>Click to upload</p>
                    <p className='mt-1 text-xs text-gray-500'>JPG or PNG (Max 10MB)</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/png, image/jpeg'
                  className='hidden'
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className='mb-6'>
              <label className='mb-2 block text-sm font-medium text-gray-700'>Prompt (Optional)</label>
              <textarea
                className='w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                rows={3}
                placeholder="Describe how the image should move (e.g., 'The water flows gently', 'Camera pans right')..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className='mb-8'>
              <label className='mb-3 block text-sm font-medium text-gray-700'>Aspect Ratio</label>
              <div className='flex gap-4'>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                    aspectRatio === '16:9'
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Landscape (16:9)
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                    aspectRatio === '9:16'
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Portrait (9:16)
                </button>
              </div>
            </div>

            <Button 
              className='h-12 w-full bg-primary text-base text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90' 
              onClick={handleGenerate} 
              disabled={isGenerating || !selectedFile}
            >
              {isGenerating ? (
                <>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  Generating Video...
                </>
              ) : (
                <>
                  <Film className='mr-2 h-5 w-5' />
                  Generate Video
                </>
              )}
            </Button>

            {statusMessage && isGenerating && (
              <p className='mt-3 animate-pulse text-center text-xs text-primary'>{statusMessage}</p>
            )}

            {error && (
              <div className='mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600'>
                <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
                {error}
              </div>
            )}
          </div>

          <div className='relative flex h-full min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'>
            {generatedVideoUrl ? (
              <div className='flex h-full w-full animate-in fade-in flex-col items-center duration-500'>
                <div className='mb-4 flex items-center gap-2 font-medium text-green-600'>
                  <CheckCircle2 className='h-5 w-5' />
                  Generation Successful
                </div>
                <video
                  controls
                  autoPlay
                  loop
                  className='w-full rounded-lg bg-black shadow-lg shadow-primary/10'
                  style={{ aspectRatio: aspectRatio === '16:9' ? '16/9' : '9/16' }}
                >
                  <source src={generatedVideoUrl} type='video/mp4' />
                  Your browser does not support the video tag.
                </video>
                <Button
                  variant='outline'
                  className='mt-6 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary'
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = generatedVideoUrl
                    a.download = `veo-generated-${Date.now()}.mp4`
                    a.click()
                  }}
                >
                  Download Video
                </Button>
              </div>
            ) : (
              <div className='text-gray-400'>
                {isGenerating ? (
                  <div className='flex flex-col items-center'>
                    <div className='relative mb-6 h-20 w-20'>
                      <div className='absolute inset-0 rounded-full border-4 border-gray-100'></div>
                      <div className='absolute inset-0 animate-spin rounded-full border-4 border-t-primary'></div>
                    </div>
                    <h4 className='mb-1 text-lg font-medium text-gray-900'>Creating Magic</h4>
                    <p className='text-sm'>Veo is processing your image...</p>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-primary/5'>
                      <Play className='h-8 w-8 opacity-20 transition-colors group-hover:text-primary' />
                    </div>
                    <p className='mb-1 text-lg font-medium text-gray-900'>Ready to create</p>
                    <p className='max-w-xs text-sm'>Upload an image and hit generate to see the result here.</p>
                  </div>
                )}
              </div>
            )}

            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] opacity-[0.03] [background-size:16px_16px]'></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoGenerator
