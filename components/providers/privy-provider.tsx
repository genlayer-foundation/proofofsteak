'use client'

import { PrivyProvider } from '@privy-io/react-auth'

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#f59e0b',
          logo: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🥩</text></svg>",
        },
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
