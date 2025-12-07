'use client'

import { Card, CardContent } from '@/components/ui/card'

type Logos = {
  image: string
  alt: string
}

const defaultLogos: Logos[] = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    alt: 'Google'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    alt: 'Microsoft'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    alt: 'OpenAI'
  },
  {
    image: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
    alt: 'Vercel'
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    alt: 'Stripe'
  }
]

const LogoCloud = ({ logos = defaultLogos }: { logos?: Logos[] }) => {
  return (
    <section className='bg-muted/30 py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>
            <span>Trusted by</span>{' '}
            <span className='relative z-[1]'>
              industry leaders
              <span className='bg-primary/20 absolute bottom-1 left-0 -z-[1] h-2 w-full'></span>
            </span>{' '}
            <span>worldwide</span>
          </h2>
          <p className='text-muted-foreground text-xl'>Powering the next generation of voice technology.</p>
        </div>

        <Card className='border-none bg-background/50 shadow-none backdrop-blur-sm'>
          <CardContent className='px-4 md:px-14'>
            <div className='flex flex-wrap items-center justify-center gap-x-12 gap-y-12 md:gap-x-20'>
              {logos.map((logo, index) => (
                <div key={index} className='group relative flex items-center justify-center'>
                  <img 
                    src={logo.image} 
                    alt={logo.alt} 
                    className='h-8 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-10' 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default LogoCloud
