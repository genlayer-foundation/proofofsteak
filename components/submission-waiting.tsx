"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { waitForTransactionConfirmation } from "@/lib/genlayer/genlayer.js";

interface SubmissionWaitingProps {
  imageUrl?: string;
  submissionId?: string;
  transactionHash?: string;
}

export function SubmissionWaiting({ imageUrl, submissionId, transactionHash }: SubmissionWaitingProps) {
  const router = useRouter();
  // Always use an image - prefer provided imageUrl, fallback to default hero image
  const backgroundImage = imageUrl || "/hero-steak-hd.jpg";

  // Wait for transaction confirmation
  useEffect(() => {
    if (!transactionHash || !submissionId) return;

    const waitForConfirmation = async () => {
      try {
        console.log('Waiting for transaction confirmation:', transactionHash);
        const result = await waitForTransactionConfirmation(transactionHash);

        if (result.success) {
          console.log('Transaction confirmed! Redirecting to submission:', submissionId);
          router.push(`/submission/${submissionId}`);
        } else {
          console.error('Transaction failed:', result.receipt);
          // Could redirect to an error page or show error state
        }
      } catch (error) {
        console.error('Failed to wait for transaction confirmation:', error);
        // Handle timeout or other errors
      }
    };

    waitForConfirmation();
  }, [transactionHash, submissionId, router]);

  return (
    <div className="h-full bg-black flex flex-col relative overflow-hidden">
      {/* Background Image - Always shown */}
      <img
        src={backgroundImage}
        alt="Submission"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* Back button - Top left */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="group flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-lg border transition-all duration-300 hover:scale-105"
          style={{
            borderColor: "rgba(251, 191, 36, 0.4)",
            boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
          }}
        >
          <ArrowLeft className="w-5 h-5 text-amber-500 transition-transform group-hover:-translate-x-1" />
          <span className="text-white font-bold tracking-wide">
            BACK TO LEADERBOARD
          </span>
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center px-4 max-w-2xl mx-auto">
          {/* Main steak emoji with animation */}
          <div className="mb-8 relative">
            <div className="text-9xl md:text-[12rem] filter drop-shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-bounce-slow">
              🥩
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 text-9xl md:text-[12rem] opacity-50 blur-xl animate-pulse">
              🥩
            </div>
          </div>

          {/* Title with gradient */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 animate-gradient-x"
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 200%",
            }}
          >
            COOKING THE STEAK...
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 mb-8 font-medium">
            {submissionId
              ? "Waiting for blockchain confirmation..."
              : "Our AI consensus is checking the doneness"
            }
          </p>

          {/* Submission and Transaction Info */}
          {submissionId && (
            <p className="text-sm text-white/40 mb-2 font-mono">
              ID: {submissionId}
            </p>
          )}
          {transactionHash && (
            <p className="text-sm text-white/40 mb-8 font-mono">
              Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-6)}
            </p>
          )}

          {/* Animated loading dots */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-3 h-3 bg-amber-500 rounded-full"
              style={{
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: "0s",
              }}
            />
            <div
              className="w-3 h-3 bg-orange-500 rounded-full"
              style={{
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: "0.2s",
              }}
            />
            <div
              className="w-3 h-3 bg-amber-500 rounded-full"
              style={{
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: "0.4s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

