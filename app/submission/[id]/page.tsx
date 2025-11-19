import type { Metadata } from "next";
import { SubmissionDetail } from "@/components/submission-detail";
import { SubmissionWaiting } from "@/components/submission-waiting";
import { Footer } from "@/components/footer";
import { findSubmissionById } from "@/lib/submission-utils";
import { getAnalysisById } from "@/lib/genlayer/genlayer.js";
import { steakCategory } from "@/lib/category-data";

interface SubmissionPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    image?: string;
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

  if (isNaN(submissionId)) {
    return {
      title: "PROOF OF STEAK",
      description: "AI consensus making sure doneness of steak",
      openGraph: {
        title: "PROOF OF STEAK",
        description: "AI consensus making sure doneness of steak",
        url: `${baseUrl}/submission/${resolvedParams.id}`,
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

  // Check if it's a numeric ID (old static data) vs string ID (GenLayer data)
  const numericId = parseInt(submissionId, 10);
  let result = null;

  if (!isNaN(numericId)) {
    result = findSubmissionById(numericId);
  }

  if (!result) {
    return {
      title: "PROOF OF STEAK",
      description: "AI consensus making sure doneness of steak",
      openGraph: {
        title: "PROOF OF STEAK",
        description: "AI consensus making sure doneness of steak",
        url: `${baseUrl}/submission/${submissionId}`,
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

  const { submission, theme, categoryTitle } = result;
  const imageUrl = submission.image.startsWith("/")
    ? `${baseUrl}${submission.image}`
    : submission.image;

  return {
    title: `${submission.name} | PROOF OF STEAK`,
    description:
      submission.description ||
      `${submission.name} - ${categoryTitle} submission from ${submission.location}. ${submission.votes} votes.`,
    openGraph: {
      title: `${submission.name} | PROOF OF STEAK`,
      description:
        submission.description ||
        `${submission.name} - ${categoryTitle} submission from ${submission.location}`,
      url: `${baseUrl}/submission/${submissionId}`,
      siteName: "PROOF OF STEAK",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: submission.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${submission.name} | PROOF OF STEAK`,
      description:
        submission.description ||
        `${submission.name} - ${categoryTitle} submission from ${submission.location}`,
      images: [
        {
          url: imageUrl,
          alt: submission.name,
        },
      ],
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
  const waitingForId = resolvedSearchParams.id; // ID we're waiting for
  const transactionHash = resolvedSearchParams.hash; // Transaction hash for waiting

  // If it's a waiting page, show waiting with polling
  if (submissionId === 'waiting' && waitingForId) {
    return (
      <main className="h-screen bg-black flex flex-col">
        <div className="flex-1">
          <SubmissionWaiting imageUrl={imageUrl} submissionId={waitingForId} transactionHash={transactionHash} />
        </div>
        <Footer />
      </main>
    );
  }

  // If it's a waiting page without ID, show basic waiting
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
    // TODO: Determine category from URL path - for now defaulting to 'steak'
    const category = 'steak';
    const submission = await getAnalysisById(category, submissionId);

    if (submission) {
      return (
        <main className="min-h-screen bg-black">
          <SubmissionDetail
            submission={submission}
            theme={steakCategory.theme}
            categoryTitle={steakCategory.theme.title}
            showShareButton={true}
          />
          <Footer />
        </main>
      );
    }
  } catch (error) {
    console.error('Failed to load submission:', error);
  }

  // If submission not found
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Submission Not Found</h1>
        <p className="text-white/70">The submission you're looking for doesn't exist.</p>
      </div>
    </main>
  );
}
