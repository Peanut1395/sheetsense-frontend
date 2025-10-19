"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = params.get("session_id");
        if (!sessionId) {
          setMessage("Missing session ID. Please contact support.");
          setLoading(false);
          return;
        }

        // 🔹 1. Get or restore user session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          toast.error("Please log in again to activate your plan.");
          setMessage("You need to be logged in to verify your plan.");
          setLoading(false);
          return;
        }

        const user = session.user;

        // 🔹 2. Verify payment on backend
        const res = await fetch(`/api/verify-checkout?session_id=${sessionId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");

        const newPlan = data.plan || "pro";

        // 🔹 3. Update Supabase user plan
        const { error: updateError } = await supabase
          .from("users")
          .update({ plan: newPlan })
          .eq("id", user.id);

        if (updateError) throw updateError;

        setPlan(newPlan);
        setMessage(`✅ Payment verified. Your plan is now ${newPlan.toUpperCase()}.`);
        toast.success("Plan updated successfully!");
      } catch (err: any) {
        console.error("❌ Verification failed:", err);
        setMessage(err.message || "An error occurred while verifying your plan.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <Toaster position="top-right" />
      {loading ? (
        <div className="text-gray-400 text-lg animate-pulse">
          Verifying your payment...
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-4">
            {plan ? "Payment Successful 🎉" : "Something went wrong"}
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">{message}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white"
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-gray-400 mt-10">Loading payment details...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
