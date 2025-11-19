import { http, createConfig } from 'wagmi'
import { genlayerStudio } from './chain-config'

// Create wagmi config using the shared chain configuration
export const config = createConfig({
  chains: [genlayerStudio],
  transports: {
    [genlayerStudio.id]: http(genlayerStudio.rpcUrls.default.http[0]),
  },
})

// Re-export chain for convenience
export { genlayerStudio }
