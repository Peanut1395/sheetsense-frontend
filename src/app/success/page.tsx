"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";

function SuccessContent() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <h1 className="text-3xl font-bold text-white mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-300 text-lg mb-8 max-w-xl">
        Thank you for upgrading! Your payment has been received.
        <br />
        Our team will activate your new plan within the next few minutes.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-gray-400 mt-10">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
