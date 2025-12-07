import Navbar from '@/components/home/navbar'
import Hero from '@/components/home/hero'
import Features from '@/components/home/features'
import LogoCloud from '@/components/home/logo-cloud'
import VideoGenerator from '@/components/home/video-generator'

export default function Home() {
  return (
    <div className='min-h-screen bg-white selection:bg-black selection:text-white'>
      <Navbar />
      <main className='flex flex-col gap-0 pb-0'>
        <Hero />
        <LogoCloud />
        <Features />
        <VideoGenerator />
      </main>
      <footer className='border-t border-gray-100 bg-gray-50 py-10 text-center text-sm text-gray-500'>
        <p>&copy; {new Date().getFullYear()} RorHash. All rights reserved.</p>
      </footer>
    </div>
  )
}
