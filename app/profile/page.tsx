'use client'

import { usePrivy } from '@privy-io/react-auth'
import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { useUserContributions } from '@/lib/hooks/use-user-contributions'

// Profile theme with user-focused styling
const profileTheme = {
  emoji: '👤',
  title: 'My Submissions',
  subtitle: 'Your contributions to the leaderboard',
  primaryColor: 'blue',
  accentColor: 'sky',
  gradientFrom: 'from-blue-600',
  gradientVia: 'via-sky-500',
  gradientTo: 'to-blue-400',
}

const profileHero = {
  title: 'MY STEAKS',
  subtitle: 'YOUR CONTRIBUTIONS TO THE LEADERBOARD',
  backgroundImage: '/hero-steak-hd.jpg', // Reuse same background
}

export default function ProfilePage() {
  const { authenticated, ready, user, login } = usePrivy()

  // Get user wallet address
  const getUserAddress = () => {
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

  const userAddress = getUserAddress()
  const { records, hasMore, isLoading, totalCount, loadMore } = useUserContributions(userAddress)

  // Show loading while Privy is initializing
  if (!ready) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </main>
    )
  }

  // Show wallet connection required
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-black">
        <CategoryHero {...profileHero} />
        <div className="py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
              WALLET REQUIRED
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Connect your wallet to view your submissions and track your contributions to the leaderboard.
            </p>
            <button
              onClick={login}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
            >
              Connect Wallet
            </button>
          </div>
        </div>
        <Footer />
        <FloatingActions theme={profileTheme} />
      </main>
    )
  }

  // Show empty state if user has no submissions
  if (!isLoading && records.length === 0) {
    return (
      <main className="min-h-screen bg-black">
        <CategoryHero {...profileHero} />
        <div className="py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-8xl mb-6">🥩</div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
            >
              NO SUBMISSIONS YET
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              You haven't uploaded any submissions yet. Start contributing to the leaderboard by uploading your first photo!
            </p>
          </div>
        </div>
        <Footer />
        <FloatingActions theme={profileTheme} />
      </main>
    )
  }

  // Show submissions
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...profileHero} />
      <CategoryGrid
        submissions={records}
        theme={profileTheme}
        cta={{
          heading: 'GOT MORE STEAKS?',
          description: 'Upload another photo and compete for the top spot on the leaderboard',
          buttonText: 'UPLOAD YOUR EXPERIENCE',
        }}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      <Footer />
      <FloatingActions theme={profileTheme} />
    </main>
  )
}