'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import type { CategoryTheme } from '@/components/category-grid'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog'
import { UploadDialog } from '@/components/upload-dialog'

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

const WalletIcon = () => (
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
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
)

const ProfileIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

interface FloatingActionsProps {
  theme?: CategoryTheme
}

export function FloatingActions({ theme }: FloatingActionsProps) {
  const router = useRouter()
  const { login, logout, ready, authenticated, user } = usePrivy()
  const [hoveredUpload, setHoveredUpload] = useState(false)
  const [hoveredHelp, setHoveredHelp] = useState(false)
  const [hoveredWallet, setHoveredWallet] = useState(false)
  const [hoveredProfile, setHoveredProfile] = useState(false)

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getWalletAddress = () => {
    if (!user) return null

    // Check for embedded wallet
    if (user.wallet?.address) {
      return user.wallet.address
    }

    // Check for linked wallets
    if (user.linkedAccounts) {
      const walletAccount = user.linkedAccounts.find(
        (account: any) => account.type === 'wallet'
      )
      if (walletAccount?.address) {
        return walletAccount.address
      }
    }

    return null
  }

  const walletAddress = getWalletAddress()

  const handleWalletClick = () => {
    if (authenticated) {
      logout()
    } else {
      login()
    }
  }

  const handleProfileClick = () => {
    if (authenticated) {
      router.push('/profile')
    } else {
      login()
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      {/* Wallet Connect / Disconnect Button */}
      <button
        onClick={handleWalletClick}
        disabled={!ready}
        className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-300 elegant-shimmer cursor-pointer flex items-center justify-center relative disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          ...getBorderStyle(hoveredWallet),
          ...getBoxShadow(hoveredWallet)
        }}
        onMouseEnter={() => setHoveredWallet(true)}
        onMouseLeave={() => setHoveredWallet(false)}
        aria-label={authenticated ? "Disconnect wallet" : "Connect wallet"}
      >
        <span style={getIconColor(hoveredWallet)} className="transition-colors duration-300 flex items-center justify-center relative">
          <WalletIcon />
          {/* Connected Status Indicator */}
          {authenticated && (
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black shadow-lg animate-pulse" />
          )}
        </span>
      </button>

      {/* Profile Button - Only show when authenticated */}
      {authenticated && (
        <button
          onClick={handleProfileClick}
          className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-300 elegant-shimmer cursor-pointer flex items-center justify-center"
          style={{
            ...getBorderStyle(hoveredProfile),
            ...getBoxShadow(hoveredProfile)
          }}
          onMouseEnter={() => setHoveredProfile(true)}
          onMouseLeave={() => setHoveredProfile(false)}
          aria-label="My submissions"
        >
          <span style={getIconColor(hoveredProfile)} className="transition-colors duration-300 flex items-center justify-center">
            <ProfileIcon />
          </span>
        </button>
      )}

      {/* Upload Button */}
      <UploadDialog categoryTheme={theme || {
        emoji: '🥩',
        title: 'Steak',
        subtitle: 'Best steaks in Buenos Aires',
        primaryColor: 'amber',
        accentColor: 'orange',
        gradientFrom: 'from-amber-600',
        gradientVia: 'via-orange-500',
        gradientTo: 'to-amber-400',
      }}>
        <button
          className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-sm border-2 hover:scale-110 transition-all duration-300 elegant-shimmer cursor-pointer flex items-center justify-center"
          style={{
            ...getBorderStyle(hoveredUpload),
            ...getBoxShadow(hoveredUpload)
          }}
          onMouseEnter={() => setHoveredUpload(true)}
          onMouseLeave={() => setHoveredUpload(false)}
          aria-label="Upload photo"
        >
          <span style={getIconColor(hoveredUpload)} className="transition-colors duration-300 flex items-center justify-center">
            <UploadIcon />
          </span>
        </button>
      </UploadDialog>

      {/* Help Dialog */}
      <Dialog>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <DialogContent
            className="max-w-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(12px)',
            }}
          >
            <DialogHeader>
              <DialogTitle
                className="text-3xl font-black tracking-tight uppercase"
                style={{ color: 'oklch(0.85 0.08 45)' }}
              >
                About This Project
              </DialogTitle>
              <DialogDescription style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Information about the Proof of Steak project
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <p>
                Proof of Steak is a decentralized application (dApp) that invites users to upload photos showcasing authentic Argentine cultural experiences — with a special highlight on the iconic steak and asado tradition — and evaluates how "Argentinean" each submission appears using GenLayer's decentralized AI consensus (scoring 0–100).
              </p>

              <p>
                Photos are ranked on public leaderboards across themed tracks such as food, customs, sports, touristic spots, crypto & community, among others. The platform operates in a transparent and trustless manner, leveraging GenLayer's consensus as a "digital court" where validator nodes powered by diverse AI models collectively decide on subjective cultural scoring — reducing bias and enabling fair, crowdsourced-style cultural evaluation.
              </p>

              <p className="font-semibold" style={{ color: 'oklch(0.85 0.08 45)' }}>
                To celebrate Argentina's steak heritage, the top-ranked steak photo will win an invitation to an asado for two people.
              </p>

              <p className="text-sm italic border-t pt-4 mt-6" style={{ color: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                We are actively seeking sponsors for categories, rewards, and special tracks.
                <br />
                For collaboration, questions, or partnership proposals, contact: <a href="https://twitter.com/luck_loce" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 underline transition-opacity" style={{ color: 'oklch(0.85 0.08 45)' }}>Twitter/X: @luck_loce</a>
              </p>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}
