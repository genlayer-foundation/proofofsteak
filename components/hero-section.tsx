'use client'

export function HeroSection() {
  const handleScrollClick = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-20">
        <h1
          className="text-[18vw] sm:text-[14vw] md:text-[16vw] lg:text-[18vw] xl:text-[20vw] font-black leading-[0.9] text-center tracking-tighter uppercase max-w-full"
        >
          <span
            className="block"
            style={{
              backgroundImage: 'url(/hero-steak-hd.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PROOF OF<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            STEAK
          </span>
        </h1>
        <p className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-6 md:mt-8 text-[oklch(0.85_0.08_45)] tracking-widest">
          DEVCONNECT 2025 · BUENOS AIRES
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
