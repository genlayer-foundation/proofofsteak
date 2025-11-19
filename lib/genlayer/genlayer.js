import { createClient, createAccount } from 'genlayer-js'
import { genlayerStudio } from '../chain-config'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS required");
}

let readClient = null;
const writeClients = new Map();

// Invalidate all cached clients (e.g., after network switch)
function invalidateClients() {
  readClient = null
  writeClients.clear()
}

function getReadClient() {
  if (!readClient) {
    const account = createAccount({ chain: genlayerStudio })
    readClient = createClient({
      chain: genlayerStudio,
      account,
    })
  }
  return readClient
}

function getWriteClient(userAddress) {
  if (!writeClients.has(userAddress)) {
    writeClients.set(userAddress, createClient({
      chain: genlayerStudio,
      account: userAddress,
    }))
  }
  return writeClients.get(userAddress)
}

// Ensure wallet is on the correct GenLayer network
export async function ensureCorrectNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.warn('No ethereum provider found')
    return
  }

  try {
    // Get current chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const currentChainId = parseInt(chainId, 16)

    // If already on correct network, do nothing
    if (currentChainId === genlayerStudio.id) {
      return
    }

    console.log(`Switching from chain ${currentChainId} to ${genlayerStudio.id}...`)

    // Try to switch to the network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${genlayerStudio.id.toString(16)}` }],
      })

      // Invalidate clients after successful switch
      invalidateClients()
      console.log('Network switched successfully')
    } catch (switchError) {
      // If chain doesn't exist (error 4902), add it
      if (switchError.code === 4902) {
        console.log('Chain not found, adding to wallet...')
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${genlayerStudio.id.toString(16)}`,
              chainName: genlayerStudio.name,
              nativeCurrency: genlayerStudio.nativeCurrency,
              rpcUrls: genlayerStudio.rpcUrls.default.http,
              blockExplorerUrls: genlayerStudio.blockExplorers?.default?.url
                ? [genlayerStudio.blockExplorers.default.url]
                : undefined,
            },
          ],
        })

        // Invalidate clients after adding network
        invalidateClients()
        console.log('Network added successfully')
      } else {
        throw switchError
      }
    }
  } catch (error) {
    console.error('Failed to ensure correct network:', error)
    throw new Error('Please switch to GenLayer Studio network in your wallet')
  }
}

export async function analyzeImage(originalUrl, leaderboardUrl, analysisUrl, defense = '', name = '', location = '', userAddress) {
  if (!userAddress) {
    throw new Error('Wallet address required for image analysis')
  }

  const client = getWriteClient(userAddress)

  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'analyze_image',
    args: [originalUrl, leaderboardUrl, analysisUrl, defense, name, location]
  })

  const receipt = await client.waitForTransactionReceipt({
    hash,
    retries: 60,
    interval: 5000,
  });

  return { hash, receipt };
}

export async function getAnalysisByCategory(
  category,
  startIndex = 0,
  count = 10
) {
  const client = getReadClient();

  return await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_analysis_by_category",
    args: [category, startIndex, count],
  });
}
