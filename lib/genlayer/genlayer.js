import { createClient, createAccount } from 'genlayer-js'
import { genlayerStudio } from '../chain-config';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS required");
}

// Helper function to format category names from snake_case to Title Case
function formatCategoryName(category) {
  if (!category) return 'Steak';
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
    const account = createAccount()
    readClient = createClient({
      chain: genlayerStudio,
      account: account,
      endpoint:'https://devconnect-25-studio.genlayer.com/api'
    })
  }
  return readClient
}

function getWriteClient(userAddress) {
  if (!writeClients.has(userAddress)) {
    writeClients.set(userAddress, createClient({
      chain: genlayerStudio,
      account: userAddress,
      endpoint:'https://devconnect-25-studio.genlayer.com/api'
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


    // Try to switch to the network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${genlayerStudio.id.toString(16)}` }],
      })

      // Invalidate clients after successful switch
      invalidateClients()
    } catch (switchError) {
      // If chain doesn't exist (error 4902), add it
      if (switchError.code === 4902) {
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
      } else {
        throw switchError
      }
    }
  } catch (error) {
    console.error('Failed to ensure correct network:', error)
    throw new Error('Please switch to GenLayer Studio network in your wallet')
  }
}

export async function analyzeImage(id, originalUrl, leaderboardUrl, analysisUrl, defense = '', name = '', location = '', userAddress, waitForReceipt = true) {
  if (!userAddress) {
    throw new Error('Wallet address required for image analysis')
  }


  const client = getWriteClient(userAddress)

  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'analyze_image',
    args: [id, originalUrl, leaderboardUrl, analysisUrl, defense, name, location],
    value: 0n,
  })


  if (!waitForReceipt) {
    return { hash };
  }

  try {
    const receipt = await client.waitForTransactionReceipt({
      hash,
      status: "ACCEPTED",
      retries: 24,
      interval: 5000,
    });

    return { hash, receipt };
  } catch (receiptError) {
    console.error('Failed to get transaction receipt:', receiptError);
    throw new Error(`Transaction submitted (${hash}) but confirmation timed out. Check status later.`);
  }
}

export async function getAnalysisByCategory(
  category,
  startIndex = 0,
  count = 10
) {
  const client = getReadClient();

  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_analysis_by_category",
    args: [category, startIndex, count],
  });


  // Convert Map to regular object and handle BigInt values recursively
  function convertMapsAndBigInts(obj) {
    if (obj instanceof Map) {
      return convertMapsAndBigInts(Object.fromEntries(obj));
    } else if (Array.isArray(obj)) {
      return obj.map(convertMapsAndBigInts);
    } else if (obj && typeof obj === 'object') {
      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        converted[key] = convertMapsAndBigInts(value);
      }
      return converted;
    } else if (typeof obj === 'bigint') {
      return Number(obj);
    }
    return obj;
  }

  if (result instanceof Map) {
    const processed = convertMapsAndBigInts(result);

    // Transform GenLayer records to match UI expectations
    if (processed.records && Array.isArray(processed.records)) {
      processed.records = processed.records.map((record) => {
        let consensus = {};
        try {
          consensus = JSON.parse(record.consensus_output || '{}');
        } catch (e) {
          console.warn('Failed to parse consensus_output:', record.consensus_output);
        }

        return {
          id: record.id, // Contract now always provides ID
          image: record.leaderboard_url || record.analysis_url || record.original_url || record.url,
          originalImage: record.original_url || record.image,
          name: record.name || `${formatCategoryName(consensus.category)} Entry`,
          location: record.location || 'Location not provided',
          votes: consensus.score || record.score || 0,
          submittedBy: record.caller_address?.slice(0, 6) + '...' + record.caller_address?.slice(-4) || 'Unknown',
          timestamp: new Date().toISOString(),
          description: consensus.reasoning || 'No reasoning provided',
          rank: record.rank,
          score: record.score,
          // Keep original data for reference
          _original: record,
          _consensus: consensus
        };
      });
    }

    return processed;
  }

  return result;
}

export async function getAnalysisById(id) {
  const client = getReadClient();

  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_analysis_by_id",
    args: [id],
  });


  // Convert Map to regular object and handle BigInt values
  function convertMapsAndBigInts(obj) {
    if (obj instanceof Map) {
      return convertMapsAndBigInts(Object.fromEntries(obj));
    } else if (Array.isArray(obj)) {
      return obj.map(convertMapsAndBigInts);
    } else if (obj && typeof obj === 'object') {
      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        converted[key] = convertMapsAndBigInts(value);
      }
      return converted;
    } else if (typeof obj === 'bigint') {
      return Number(obj);
    }
    return obj;
  }

  if (result instanceof Map) {
    const processed = convertMapsAndBigInts(result);

    // Check if record was found (empty dict means not found)
    if (Object.keys(processed).length === 0) {
      console.warn('Record not found for ID:', id);
      return null;
    }

    // Transform single record to UI format
    let consensus = {};
    try {
      consensus = JSON.parse(processed.consensus_output || '{}');
    } catch (e) {
      console.warn('Failed to parse consensus_output:', processed.consensus_output);
    }

    // Use category from contract response (preferred) or consensus fallback
    const category = processed.category || consensus.category || 'steak';

    const transformed = {
      id: processed.id,
      category: category,
      image: processed.leaderboard_url || processed.analysis_url || processed.original_url,
      originalImage: processed.original_url || processed.image,
      name: processed.name || `${formatCategoryName(category)} Entry`,
      location: processed.location || 'Location not provided',
      votes: consensus.score || processed.score || 0,
      submittedBy: processed.caller_address?.slice(0, 6) + '...' + processed.caller_address?.slice(-4) || 'Unknown',
      timestamp: new Date().toISOString(),
      description: consensus.reasoning || 'No reasoning provided',
      rank: processed.rank,
      score: processed.score,
      // Keep original data for reference
      _original: processed,
      _consensus: consensus
    };

    return transformed;
  }

  return result;
}

export async function waitForTransactionConfirmation(hash) {
  const client = getReadClient();


  try {
    // Wait for ACCEPTED status (faster than FINALIZED)
    const receipt = await client.waitForTransactionReceipt({
      hash,
      status: 'ACCEPTED', // Explicitly request ACCEPTED status
      fullTransaction: true, // Get full receipt including return value
      retries: 60, // Wait longer for confirmation
      interval: 3000, // Check every 3 seconds
    });


    // If we got here, the transaction reached ACCEPTED status
    return {
      success: true,
      receipt
    };
  } catch (error) {
    console.error('Failed to get transaction receipt:', error);
    throw new Error(`Transaction confirmation failed: ${error.message}`);
  }
}

export async function getAnalysesByWallet(userAddress, startIndex = 0, count = 10) {
  const client = getReadClient();

  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_analysis_by_wallet",
    args: [userAddress, startIndex, count],
  });


  // Convert Map to regular object and handle BigInt values recursively
  function convertMapsAndBigInts(obj) {
    if (obj instanceof Map) {
      return convertMapsAndBigInts(Object.fromEntries(obj));
    } else if (Array.isArray(obj)) {
      return obj.map(convertMapsAndBigInts);
    } else if (obj && typeof obj === 'object') {
      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        converted[key] = convertMapsAndBigInts(value);
      }
      return converted;
    } else if (typeof obj === 'bigint') {
      return Number(obj);
    }
    return obj;
  }

  if (result instanceof Map) {
    const processed = convertMapsAndBigInts(result);

    // Transform GenLayer records to match UI expectations
    if (processed.records && Array.isArray(processed.records)) {
      processed.records = processed.records.map((record) => {
        let consensus = {};
        try {
          consensus = JSON.parse(record.consensus_output || '{}');
        } catch (e) {
          console.warn('Failed to parse consensus_output:', record.consensus_output);
        }

        return {
          id: record.id, // Contract now always provides ID
          image: record.leaderboard_url || record.analysis_url || record.original_url || record.url,
          originalImage: record.original_url || record.image,
          name: record.name || `${formatCategoryName(consensus.category)} Entry`,
          location: record.location || 'Location not provided',
          votes: consensus.score || record.score || 0,
          submittedBy: record.caller_address?.slice(0, 6) + '...' + record.caller_address?.slice(-4) || 'Unknown',
          timestamp: new Date().toISOString(),
          description: consensus.reasoning || 'No reasoning provided',
          rank: record.rank,
          score: record.score,
          // Keep original data for reference
          _original: record,
          _consensus: consensus
        };
      });
    }

    return processed;
  }

  return result;
}
