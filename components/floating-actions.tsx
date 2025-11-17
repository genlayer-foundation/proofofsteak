'use client'

import { useState } from 'react'
import type { CategoryTheme } from '@/components/category-grid'

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)

const HelpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)

interface FloatingActionsProps {
  theme?: CategoryTheme
}

export function FloatingActions({ theme }: FloatingActionsProps) {
  const [hoveredUpload, setHoveredUpload] = useState(false)
  const [hoveredHelp, setHoveredHelp] = useState(false)

  const getBorderStyle = (isHovered: boolean) => {
    if (!theme) {
      return {
        borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
      }
    }

    const colorMap: Record<string, { normal: string; hover: string }> = {
      amber: { normal: 'rgba(251, 191, 36, 0.2)', hover: 'rgba(251, 191, 36, 0.4)' },
      orange: { normal: 'rgba(251, 146, 60, 0.2)', hover: 'rgba(251, 146, 60, 0.4)' },
      green: { normal: 'rgba(34, 197, 94, 0.2)', hover: 'rgba(34, 197, 94, 0.4)' },
      emerald: { normal: 'rgba(52, 211, 153, 0.2)', hover: 'rgba(52, 211, 153, 0.4)' },
      blue: { normal: 'rgba(59, 130, 246, 0.2)', hover: 'rgba(59, 130, 246, 0.4)' },
      sky: { normal: 'rgba(56, 189, 248, 0.2)', hover: 'rgba(56, 189, 248, 0.4)' },
      purple: { normal: 'rgba(168, 85, 247, 0.2)', hover: 'rgba(168, 85, 247, 0.4)' },
      violet: { normal: 'rgba(139, 92, 246, 0.2)', hover: 'rgba(139, 92, 246, 0.4)' },
      yellow: { normal: 'rgba(234, 179, 8, 0.2)', hover: 'rgba(234, 179, 8, 0.4)' },
    }

    const colors = colorMap[theme.primaryColor] || { normal: 'rgba(255, 255, 255, 0.1)', hover: 'rgba(255, 255, 255, 0.2)' }
    return {
      borderColor: isHovered ? colors.hover : colors.normal
    }
  }

  const getBoxShadow = (isHovered: boolean) => {
    const baseShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'

    if (!isHovered || !theme) {
      return { boxShadow: baseShadow }
    }

    const colorMap: Record<string, string> = {
      amber: 'rgba(251, 191, 36, 0.3)',
      orange: 'rgba(251, 146, 60, 0.3)',
      green: 'rgba(34, 197, 94, 0.3)',
      emerald: 'rgba(52, 211, 153, 0.3)',
      blue: 'rgba(59, 130, 246, 0.3)',
      sky: 'rgba(56, 189, 248, 0.3)',
      purple: 'rgba(168, 85, 247, 0.3)',
      violet: 'rgba(139, 92, 246, 0.3)',
      yellow: 'rgba(234, 179, 8, 0.3)',
    }

    const glowColor = colorMap[theme.primaryColor] || 'rgba(255, 255, 255, 0.2)'
    return {
      boxShadow: `${baseShadow}, 0 0 30px ${glowColor}`
    }
  }

  const getIconColor = (isHovered: boolean) => {
    if (!isHovered || !theme) {
      return { color: 'currentColor' }
    }

    const colorMap: Record<string, string> = {
      amber: 'rgb(251, 191, 36)',
      orange: 'rgb(251, 146, 60)',
      green: 'rgb(34, 197, 94)',
      emerald: 'rgb(52, 211, 153)',
      blue: 'rgb(59, 130, 246)',
      sky: 'rgb(56, 189, 248)',
      purple: 'rgb(168, 85, 247)',
      violet: 'rgb(139, 92, 246)',
      yellow: 'rgb(234, 179, 8)',
    }

    const color = colorMap[theme.primaryColor] || 'currentColor'
    return { color }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <button
        className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-300 elegant-shimmer cursor-pointer flex items-center justify-center"
        style={{
          ...getBorderStyle(hoveredUpload),
          ...getBoxShadow(hoveredUpload)
        }}
        onMouseEnter={() => setHoveredUpload(true)}
        onMouseLeave={() => setHoveredUpload(false)}
        aria-label="Upload steak"
      >
        <span style={getIconColor(hoveredUpload)} className="transition-colors duration-300 flex items-center justify-center">
          <UploadIcon />
        </span>
      </button>
      <button
        className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-300 elegant-shimmer cursor-pointer flex items-center justify-center"
        style={{
          ...getBorderStyle(hoveredHelp),
          ...getBoxShadow(hoveredHelp)
        }}
        onMouseEnter={() => setHoveredHelp(true)}
        onMouseLeave={() => setHoveredHelp(false)}
        aria-label="Help"
      >
        <span style={getIconColor(hoveredHelp)} className="transition-colors duration-300 flex items-center justify-center">
          <HelpIcon />
        </span>
      </button>
    </div>
  )
}
