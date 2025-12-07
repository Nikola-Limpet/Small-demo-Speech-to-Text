'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home', hasDropdown: false },
    { name: 'Products', href: '#features', hasDropdown: false },
    { name: 'About Us', href: '#', hasDropdown: true },
    { name: 'Contacts', href: '#', hasDropdown: true }
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? 'border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
        {/* Logo */}
        <Link href='#home' className='group flex cursor-pointer items-center gap-2.5'>
          <motion.div
            className='flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='h-4 w-4'>
              <path d='M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4' strokeLinecap='round' />
            </svg>
          </motion.div>
          <span className='text-lg font-semibold tracking-tight text-black'>RorHash</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center gap-8 md:flex'>
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className='group relative flex items-center gap-1 text-sm font-medium text-black/60 transition-colors hover:text-black'
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown className='h-3 w-3 transition-transform duration-300 group-hover:rotate-180' />
              )}
              {/* Animated underline */}
              <span className='absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full' />
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className='hidden items-center gap-4 md:flex'>
          <Button
            variant='outline'
            size='sm'
            className='border-black/10 bg-transparent font-medium text-black transition-all hover:border-black/20 hover:bg-black/5'
            asChild
          >
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className='rounded-lg p-2 text-black transition-colors hover:bg-black/5 md:hidden'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className='absolute left-0 top-16 flex w-full flex-col gap-1 border-b border-black/5 bg-white p-4 shadow-xl md:hidden'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className='rounded-lg px-3 py-2.5 text-sm font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black'
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {link.name}
              </motion.a>
            ))}
            <div className='my-2 h-px bg-black/5' />
            <Button className='w-full bg-black text-white hover:bg-black/90' asChild>
              <Link href='/dashboard'>Dashboard</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
