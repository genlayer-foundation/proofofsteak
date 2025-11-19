import type { Metadata } from "next";
import { SubmissionDetail } from "@/components/submission-detail";
import { SubmissionWaiting } from "@/components/submission-waiting";
import { Footer } from "@/components/footer";
import { getAnalysisById } from "@/lib/genlayer/genlayer.js";
import { getCategoryTheme } from "@/lib/category-data";

interface SubmissionPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    image?: string;
    hash?: string;
    wallet?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: SubmissionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const submissionId = parseInt(resolvedParams.id, 10);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://proofofsteak.fun";
  const defaultImageUrl = `${baseUrl}/hero-steak-hd.jpg`;
  const waitingImageUrl = resolvedSearchParams.image || defaultImageUrl;

  // Handle waiting or invalid ID state
  if (isNaN(submissionId)) {
    return {
      title: "PROOF OF STEAK",
      description: "AI consensus making sure doneness of steak",
      openGraph: {
        title: "PROOF OF STEAK",
        description: "AI consensus making sure doneness of steak",
        url: `${baseUrl}/s/${resolvedParams.id}`,
        siteName: "PROOF OF STEAK",
        images: [
          {
            url: waitingImageUrl,
            width: 1200,
            height: 630,
            alt: "PROOF OF STEAK",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "PROOF OF STEAK",
        description: "AI consensus making sure doneness of steak",
        images: [
          {
            url: waitingImageUrl,
            alt: "PROOF OF STEAK",
          },
        ],
      },
    };
  }

  // Try to fetch submission data for dynamic metadata
  try {
    const submission = await getAnalysisById(resolvedParams.id);

    if (submission) {
      const categoryData = getCategoryTheme(submission.category);
      const title = `${submission.name} | ${categoryData.theme.title}`;
      const description = submission.description || `AI Jury Score: ${submission.score}/1000. ${categoryData.theme.subtitle}`;
      // Use analysis_url (1024px optimized) for OG image - perfect size for social sharing
      const ogImageUrl = submission._original?.analysis_url || submission.image;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `${baseUrl}/s/${submissionId}`,
          siteName: "PROOF OF STEAK",
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: submission.name,
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [ogImageUrl],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching submission for metadata:', error);
  }

  // Fallback metadata if submission not found or error occurred
  return {
    title: "PROOF OF STEAK",
    description: "AI consensus-driven steak leaderboard for DevConnect 2025 Buenos Aires",
    openGraph: {
      title: "PROOF OF STEAK",
      description: "AI consensus-driven steak leaderboard for DevConnect 2025 Buenos Aires",
      url: `${baseUrl}/s/${submissionId}`,
      siteName: "PROOF OF STEAK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "PROOF OF STEAK",
      description: "AI consensus-driven steak leaderboard for DevConnect 2025 Buenos Aires",
    },
  };
}

export default async function SubmissionPage({
  params,
  searchParams,
}: SubmissionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const submissionId = resolvedParams.id;
  const imageUrl = resolvedSearchParams.image;
  const transactionHash = resolvedSearchParams.hash;
  const walletAddress = resolvedSearchParams.wallet;

  // If it's a waiting page, show waiting with polling
  if (submissionId === 'waiting' && transactionHash && walletAddress) {
    return (
      <main className="h-screen bg-black flex flex-col">
        <div className="flex-1">
          <SubmissionWaiting imageUrl={imageUrl} transactionHash={transactionHash} walletAddress={walletAddress} />
        </div>
        <Footer />
      </main>
    );
  }

  // If it's a waiting page without proper params, show basic waiting
  if (submissionId === 'waiting') {
    return (
      <main className="h-screen bg-black flex flex-col">
        <div className="flex-1">
          <SubmissionWaiting imageUrl={imageUrl} />
        </div>
        <Footer />
      </main>
    );
  }

  // For GenLayer submissions, use the actual ID to fetch details
  try {
    const submission = await getAnalysisById(submissionId);

    if (submission) {
      // Get the correct theme based on the category returned from the contract
      const categoryData = getCategoryTheme(submission.category);

      return (
        <main className="min-h-screen bg-black">
          <SubmissionDetail
            submission={submission}
            theme={categoryData.theme}
            categoryTitle={categoryData.theme.title}
            showShareButton={true}
          />
          <Footer />
        </main>
      );
    }
  } catch (error) {
    console.error('Failed to load submission:', error);
  }

  // If submission not found, check if we have transaction details (pending submission)
  if (transactionHash && walletAddress) {
    return (
      <main className="h-screen bg-black flex flex-col">
        <div className="flex-1">
          <SubmissionWaiting
            imageUrl={imageUrl}
            transactionHash={transactionHash}
            walletAddress={walletAddress}
          />
        </div>
        <Footer />
      </main>
    );
  }

  // If submission not found and no transaction info
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Not Found</h1>
        <p className="text-white/70">The page you're looking for doesn't exist.</p>
      </div>
    </main>
  );
}
