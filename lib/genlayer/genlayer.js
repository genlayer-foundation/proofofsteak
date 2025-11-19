import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS required");
}

let readClient = null;
const writeClients = new Map();

function getReadClient() {
  if (!readClient) {
    const account = createAccount({ chain: studionet });
    readClient = createClient({ chain: studionet, account });
  }
  return readClient;
}

function getWriteClient(userAddress, provider) {
  if (!writeClients.has(userAddress)) {
    writeClients.set(
      userAddress,
      createClient({
        chain: studionet,
        account: userAddress,
        provider: provider, // Inject Privy's wallet provider
      })
    );
  }
  return writeClients.get(userAddress);
}

export async function analyzeImage(imageUrl, defense = "", userAddress, provider) {
  if (!userAddress) {
    throw new Error("Wallet address required for image analysis");
  }

  if (!provider) {
    throw new Error("Wallet provider required for image analysis");
  }

  const client = getWriteClient(userAddress, provider);

  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "analyze_image",
    args: [imageUrl, defense],
  });

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
