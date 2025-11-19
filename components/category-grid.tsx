'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UploadDialog } from './upload-dialog'

export interface CategorySubmission {
  id: number
  image: string
  name: string
  location: string
  votes: number
  submittedBy: string
  timestamp: string
  description?: string
  score?: number
  rank?: number
}

export interface CategoryTheme {
  emoji: string
  title: string
  subtitle: string
  primaryColor: string
  accentColor: string
  gradientFrom: string
  gradientVia: string
  gradientTo: string
}

interface CategoryGridProps {
  submissions: CategorySubmission[]
  theme: CategoryTheme
  cta?: {
    heading: string
    description: string
    buttonText: string
  }
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
}

export function CategoryGrid({ submissions, theme, cta, onLoadMore, hasMore, isLoading }: CategoryGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // Generate dynamic color classes based on theme
  const getBorderColor = () => {
    const colorMap: Record<string, string> = {
      amber: 'hover:border-amber-500/50',
      orange: 'hover:border-orange-500/50',
      green: 'hover:border-green-500/50',
      emerald: 'hover:border-emerald-500/50',
      blue: 'hover:border-blue-500/50',
      sky: 'hover:border-sky-500/50',
      purple: 'hover:border-purple-500/50',
      violet: 'hover:border-violet-500/50',
      yellow: 'hover:border-yellow-500/50',
    }
    return colorMap[theme.primaryColor] || 'hover:border-primary/50'
  }

  const getGlowColor = () => {
    const colorMap: Record<string, string> = {
      amber: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]',
      orange: 'hover:shadow-[0_0_40px_rgba(251,146,60,0.3)]',
      green: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]',
      emerald: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.3)]',
      blue: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]',
      sky: 'hover:shadow-[0_0_40px_rgba(56,189,248,0.3)]',
      purple: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]',
      violet: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]',
      yellow: 'hover:shadow-[0_0_40px_rgba(234,179,8,0.3)]',
    }
    return colorMap[theme.primaryColor] || 'hover:shadow-[0_0_40px_rgba(255,140,0,0.3)]'
  }

  const getCtaBorderColor = () => {
    const colorMap: Record<string, string> = {
      amber: 'border-amber-500/30 hover:border-amber-500',
      orange: 'border-orange-500/30 hover:border-orange-500',
      green: 'border-green-500/30 hover:border-green-500',
      emerald: 'border-emerald-500/30 hover:border-emerald-500',
      blue: 'border-blue-500/30 hover:border-blue-500',
      sky: 'border-sky-500/30 hover:border-sky-500',
      purple: 'border-purple-500/30 hover:border-purple-500',
      violet: 'border-violet-500/30 hover:border-violet-500',
      yellow: 'border-yellow-500/30 hover:border-yellow-500',
    }
    return colorMap[theme.primaryColor] || 'border-primary/30 hover:border-primary'
  }

  const getCtaGlowColor = () => {
    const colorMap: Record<string, string> = {
      amber: 'hover:shadow-[0_0_50px_rgba(251,191,36,0.4)]',
      orange: 'hover:shadow-[0_0_50px_rgba(251,146,60,0.4)]',
      green: 'hover:shadow-[0_0_50px_rgba(34,197,94,0.4)]',
      emerald: 'hover:shadow-[0_0_50px_rgba(52,211,153,0.4)]',
      blue: 'hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]',
      sky: 'hover:shadow-[0_0_50px_rgba(56,189,248,0.4)]',
      purple: 'hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]',
      violet: 'hover:shadow-[0_0_50px_rgba(139,92,246,0.4)]',
      yellow: 'hover:shadow-[0_0_50px_rgba(234,179,8,0.4)]',
    }
    return colorMap[theme.primaryColor] || 'hover:shadow-[0_0_50px_rgba(255,140,0,0.4)]'
  }

  const getCtaHeadingGradient = () => {
    // Use theme gradient classes for the heading
    return `${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo}`
  }

  const getDividerGradientStyle = (direction: 'left' | 'right') => {
    const colorMap: Record<string, string> = {
      amber: 'rgba(251, 191, 36, 0.5)',
      orange: 'rgba(251, 146, 60, 0.5)',
      green: 'rgba(34, 197, 94, 0.5)',
      emerald: 'rgba(52, 211, 153, 0.5)',
      blue: 'rgba(59, 130, 246, 0.5)',
      sky: 'rgba(56, 189, 248, 0.5)',
      purple: 'rgba(168, 85, 247, 0.5)',
      violet: 'rgba(139, 92, 246, 0.5)',
      yellow: 'rgba(234, 179, 8, 0.5)',
    }
    const color = colorMap[theme.primaryColor] || 'rgba(255, 140, 0, 0.5)'
    return {
      background: direction === 'right'
        ? `linear-gradient(to right, transparent, ${color})`
        : `linear-gradient(to left, transparent, ${color})`
    }
  }

  const getDotStyle = () => {
    const colorMap: Record<string, string> = {
      amber: 'rgba(251, 191, 36, 0.6)',
      orange: 'rgba(251, 146, 60, 0.6)',
      green: 'rgba(34, 197, 94, 0.6)',
      emerald: 'rgba(52, 211, 153, 0.6)',
      blue: 'rgba(59, 130, 246, 0.6)',
      sky: 'rgba(56, 189, 248, 0.6)',
      purple: 'rgba(168, 85, 247, 0.6)',
      violet: 'rgba(139, 92, 246, 0.6)',
      yellow: 'rgba(234, 179, 8, 0.6)',
    }
    const color = colorMap[theme.primaryColor] || 'rgba(255, 140, 0, 0.6)'
    return { backgroundColor: color }
  }

  return (
    <section className="py-24 px-4 md:px-8 max-w-[2000px] mx-auto">
      <div className="mb-20 text-center max-w-4xl mx-auto">
        <h2 className={`text-4xl md:text-6xl lg:text-8xl font-black mb-6 leading-tight bg-gradient-to-r ${getCtaHeadingGradient()}`} style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LEADERBOARD
        </h2>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-0.5 w-16" style={getDividerGradientStyle('right')}></div>
          <div className="w-2 h-2 rounded-full" style={getDotStyle()}></div>
          <div className="h-0.5 w-16" style={getDividerGradientStyle('left')}></div>
        </div>

        <p className="text-lg md:text-xl text-white/90 font-medium tracking-wide mb-3">
          Ranked by an AI Jury
        </p>

        <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
          {theme.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {submissions.map((item, index) => {
          const imageUrl = item.image || "/placeholder.svg";
          const encodedImageUrl = encodeURIComponent(imageUrl);
          return (
          <Link
            key={item.id}
            href={`/submission/${item.id}?image=${encodedImageUrl}`}
            className={`relative aspect-square overflow-hidden group cursor-pointer border border-border/30 bg-black transition-all duration-500 ${getBorderColor()} ${getGlowColor()}`}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image with enhanced transitions */}
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-75"
            />

            {/* Rank badge - minimal elegant */}
            <div className="absolute top-5 left-5 z-20 transition-all duration-400 group-hover:scale-105">
              <div className="relative">
                {/* Soft ambient glow */}
                <div className={`absolute inset-0 bg-${theme.accentColor}/20 blur-xl rounded-lg scale-150 opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Badge container */}
                <div className="relative bg-black/80 px-6 py-2.5 rounded-lg border border-white/10 shadow-[0_0_20px_rgba(255,180,0,0.15),0_0_40px_rgba(255,140,0,0.08)] elegant-shimmer">
                  <span className="text-2xl font-black text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    #{item.rank || index + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Votes badge - minimal elegant */}
            <div className="absolute top-5 right-5 z-20 transition-all duration-400 group-hover:scale-105 group-hover:-translate-y-0.5">
              <div className="relative">
                {/* Soft ambient glow */}
                <div className={`absolute inset-0 bg-${theme.accentColor}/20 blur-xl rounded-lg scale-150 opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Badge container */}
                <div className="relative bg-black/80 px-5 py-2.5 rounded-lg border border-white/10 shadow-[0_0_20px_rgba(255,160,0,0.15),0_0_40px_rgba(255,120,0,0.08)] elegant-shimmer">
                  <span className="text-2xl font-black text-white flex items-center gap-2.5 tracking-wide">
                    <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,100,0,0.8)]">{theme.emoji}</span>
                    <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.score || item.votes}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Hover overlay with refined gradients */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/20 transition-all duration-500 ${
                hoveredId === item.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-all duration-500">
                {/* Decorative top border */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <h3 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {item.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group/item">
                    <span className="text-2xl mt-0.5 drop-shadow-glow transition-transform group-hover/item:scale-110">📍</span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Location</p>
                      <p className="text-base font-bold text-white/90">{item.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item">
                    <span className="text-2xl mt-0.5 drop-shadow-glow transition-transform group-hover/item:scale-110">👤</span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Submitted by</p>
                      <p className="text-base font-bold text-primary">{item.submittedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item">
                    <span className="text-2xl mt-0.5 drop-shadow-glow transition-transform group-hover/item:scale-110">📅</span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Date</p>
                      <p className="text-base font-bold text-white/90">
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle gradient vignette always visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Corner accent (top-left glow) */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className={`group relative px-12 py-5 bg-black/80 border border-white/10 rounded-lg transition-all duration-500 ${getBorderColor()} ${getGlowColor()} hover:scale-105 elegant-shimmer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative text-xl font-black text-white tracking-wider">
              {isLoading ? 'LOADING...' : 'LOAD MORE'}
            </span>
          </button>
        </div>
      )}

      {/* Upload CTA */}
      {cta && (
        <div className="mt-32 max-w-4xl mx-auto text-center">
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-0.5 w-24" style={getDividerGradientStyle('right')}></div>
            <div className="w-3 h-3 rounded-full" style={getDotStyle()}></div>
            <div className="h-0.5 w-24" style={getDividerGradientStyle('left')}></div>
          </div>

          <h3 className={`text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r ${getCtaHeadingGradient()}`} style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {cta.heading}
          </h3>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {cta.description}
          </p>

          <UploadDialog categoryTheme={theme}>
            <button className={`group relative px-16 py-6 bg-primary/10 border-2 ${getCtaBorderColor()} rounded-lg transition-all duration-500 ${getCtaGlowColor()} hover:scale-105 elegant-shimmer cursor-pointer`}>
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-2xl md:text-3xl font-black text-white tracking-wider flex items-center gap-4">
                <span className="text-3xl">{theme.emoji}</span>
                {cta.buttonText}
              </span>
            </button>
          </UploadDialog>
        </div>
      )}
    </section>
  )
}
