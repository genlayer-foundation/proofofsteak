import { createClient, createAccount } from 'genlayer-js'
import { genlayerStudio } from '../chain-config';

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

export async function analyzeImage(originalUrl, leaderboardUrl, analysisUrl, defense = '', name = '', location = '', userAddress, waitForReceipt = true) {
  if (!userAddress) {
    throw new Error('Wallet address required for image analysis')
  }

  console.log('Starting analyzeImage transaction:', {
    originalUrl,
    leaderboardUrl,
    analysisUrl,
    defense,
    name,
    location,
    userAddress,
    contractAddress: CONTRACT_ADDRESS,
    waitForReceipt
  });

  const client = getWriteClient(userAddress)

  console.log('Calling writeContract...');
  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'analyze_image',
    args: [originalUrl, leaderboardUrl, analysisUrl, defense, name, location]
  })

  console.log('Transaction submitted with hash:', hash);

  if (!waitForReceipt) {
    return { hash };
  }

  console.log('Waiting for transaction receipt...');
  try {
    const receipt = await client.waitForTransactionReceipt({
      hash,
      retries: 24,
      interval: 5000,
    });

    console.log('Transaction receipt received:', receipt);
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

  console.log('GenLayer getAnalysisByCategory raw result:', {
    category,
    startIndex,
    count,
    result,
    resultType: typeof result,
    isMap: result instanceof Map
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
          id: record.id,
          image: record.url,
          name: `${consensus.category || 'Steak'} Submission`,
          location: record.defense || 'Location not provided',
          votes: consensus.score || 0,
          submittedBy: record.caller_address?.slice(0, 6) + '...' + record.caller_address?.slice(-4) || 'Unknown',
          timestamp: new Date().toISOString(),
          description: consensus.reasoning || 'No reasoning provided',
          // Keep original data for reference
          _original: record,
          _consensus: consensus
        };
      });
    }

    console.log('Converted and transformed data:', processed);
    return processed;
  }

  return result;
}

export async function getAnalysisById(category, id) {
  const client = getReadClient();

  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_analysis_by_id",
    args: [category, id],
  });

  console.log('GenLayer getAnalysisById raw result:', {
    category,
    id,
    result,
    resultType: typeof result,
    isMap: result instanceof Map
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

    // Transform single record to UI format
    let consensus = {};
    try {
      consensus = JSON.parse(processed.consensus_output || '{}');
    } catch (e) {
      console.warn('Failed to parse consensus_output:', processed.consensus_output);
    }

    const transformed = {
      id: processed.id,
      image: processed.url,
      name: `${consensus.category || 'Steak'} Submission`,
      location: processed.defense || 'Location not provided',
      votes: consensus.score || 0,
      submittedBy: processed.caller_address?.slice(0, 6) + '...' + processed.caller_address?.slice(-4) || 'Unknown',
      timestamp: new Date().toISOString(),
      description: consensus.reasoning || 'No reasoning provided',
      // Keep original data for reference
      _original: processed,
      _consensus: consensus
    };

    console.log('Converted single submission:', transformed);
    return transformed;
  }

  return result;
}

export async function waitForTransactionConfirmation(hash) {
  const client = getReadClient();

  console.log('Waiting for transaction confirmation:', hash);

  try {
    const receipt = await client.waitForTransactionReceipt({
      hash,
      retries: 60, // Wait longer for confirmation
      interval: 3000, // Check every 3 seconds
    });

    console.log('Transaction receipt received:', { hash, status: receipt.status });

    // Check if status is "ACCEPTED" (successful)
    return {
      success: receipt.status === 'ACCEPTED',
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
    functionName: "get_analyses_by_wallet",
    args: [userAddress, startIndex, count],
  });

  console.log('GenLayer getAnalysesByWallet raw result:', {
    userAddress,
    startIndex,
    count,
    result,
    resultType: typeof result,
    isMap: result instanceof Map
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
          id: record.id,
          image: record.url,
          name: `${consensus.category || 'Steak'} Submission`,
          location: record.defense || 'Location not provided',
          votes: consensus.score || 0,
          submittedBy: record.caller_address?.slice(0, 6) + '...' + record.caller_address?.slice(-4) || 'Unknown',
          timestamp: new Date().toISOString(),
          description: consensus.reasoning || 'No reasoning provided',
          // Keep original data for reference
          _original: record,
          _consensus: consensus
        };
      });
    }

    console.log('Converted user submissions data:', processed);
    return processed;
  }

  return result;
}
