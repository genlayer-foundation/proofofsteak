import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left: Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/GenLayer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-muted-foreground/60 hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              𝕏
            </a>

            <span className="text-muted-foreground/30">·</span>

            <a
              href="https://github.com/genlayer-foundation/proofofsteak"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-base font-bold text-muted-foreground/60 hover:text-foreground transition-all duration-300 hover:scale-110"
            >
              <Github className="w-4 h-4" />
              <span>Github</span>
            </a>
          </div>

          {/* Center: Powered By */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground/60 font-medium">
              Powered by
            </span>
            <a
              href="https://genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-300 hover:scale-105"
            >
              <img
                src="/GenLayer_Logo_White_Cropped.svg"
                alt="GenLayer"
                className="h-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
            <span className="text-sm text-muted-foreground/60 font-medium">
              &
            </span>
            <a
              href="https://proofoftravel.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground/60 hover:text-foreground transition-all duration-300 font-medium"
            >
              ProofOfTravel.xyz
            </a>
          </div>

          {/* Right: Built With */}
          <p className="text-sm text-muted-foreground/60 font-mono tracking-wide">
            Built with <span className="inline-block hover:scale-125 transition-transform duration-300">🥩</span> at Devconnect 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
