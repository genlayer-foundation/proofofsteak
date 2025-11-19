'use client'

import { useEffect, useRef, useState } from 'react'

export interface CategoryHeroProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export function CategoryHero({ title, subtitle, backgroundImage }: CategoryHeroProps) {
  const handleScrollClick = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  // Split title into "PROOF OF" and the category word
  const titleParts = title.split(' ')
  const proofOf = titleParts.slice(0, 2).join(' ') // "PROOF OF"
  const categoryWord = titleParts.slice(2).join(' ') // "STEAK", "MATE", etc.

  const textStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  // Fit-to-width component with resize observer
  function FitToWidthLine({ text, applyBackground = true }: { text: string; applyBackground?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [fontSize, setFontSize] = useState(100)

    useEffect(() => {
      const fitText = () => {
        if (!containerRef.current || !textRef.current) return

        const containerWidth = containerRef.current.offsetWidth
        let currentSize = 200 // Start large

        textRef.current.style.fontSize = `${currentSize}px`

        // Binary search for the perfect font size
        let textWidth = textRef.current.scrollWidth
        let min = 10
        let max = 500

        while (max - min > 1) {
          currentSize = (min + max) / 2
          textRef.current.style.fontSize = `${currentSize}px`
          textWidth = textRef.current.scrollWidth

          if (textWidth > containerWidth) {
            max = currentSize
          } else {
            min = currentSize
          }
        }

        setFontSize(min)
      }

      fitText()

      const resizeObserver = new ResizeObserver(fitText)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => resizeObserver.disconnect()
    }, [text])

    return (
      <div ref={containerRef} className="w-full">
        <div
          ref={textRef}
          className="font-black tracking-tighter uppercase whitespace-nowrap"
          style={{
            ...(applyBackground ? textStyle : {}),
            fontSize: `${fontSize}px`,
            letterSpacing: '-0.05em',
            lineHeight: '1',
          }}
        >
          {text}
        </div>
      </div>
    )
  }

  // Render fit-to-width line
  const renderFitToWidthLine = (text: string) => <FitToWidthLine text={text} />

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-20">
        {/* Mobile: Two-line fit-to-width layout with shared background */}
        <h1 className="sm:hidden w-full flex flex-col gap-2" style={{
          ...textStyle,
          backgroundSize: 'contain',
          backgroundAttachment: 'fixed',
        }}>
          <FitToWidthLine text={proofOf} applyBackground={false} />
          <FitToWidthLine text={categoryWord} applyBackground={false} />
        </h1>

        {/* Desktop: Single line with vw sizing */}
        <h1
          className="hidden sm:block text-[14vw] md:text-[16vw] lg:text-[18vw] xl:text-[20vw] font-black leading-[0.9] text-center tracking-tighter uppercase"
          style={textStyle}
        >
          {title}
        </h1>

        <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-6 md:mt-8 text-[oklch(0.85_0.08_45)] tracking-widest">
          {subtitle}
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-pointer hover:scale-110 transition-transform animate-bounce hover:animate-none"
        onClick={handleScrollClick}
        aria-label="Scroll down"
        type="button"
      >
        <div className="w-6 h-10 md:w-8 md:h-12 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 md:w-1.5 md:h-3 bg-white/60 rounded-full animate-pulse" />
        </div>
      </button>
    </section>
  )
}
