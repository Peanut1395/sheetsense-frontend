"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PricingPage() {
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          setPlan("free");
          setLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("users")
          .select("plan")
          .eq("email", user.email)
          .single();

        if (dbError) {
          console.warn("DB Error:", dbError.message);
          setPlan("free");
        } else {
          setPlan(data?.plan || "free");
        }
      } catch (err) {
        console.error(err);
        setPlan("free");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-300">
        Checking your plan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white flex flex-col items-center py-16 px-6">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
      <p className="text-gray-400 mb-12 text-center max-w-2xl">
        Unlock higher limits and team access by upgrading your plan.
        Cancel anytime — your data stays secure.
      </p>

      <p className="text-lg mb-8">
        Current Plan:{" "}
        <span
          className={`font-semibold ${
            plan === "pro"
              ? "text-blue-400"
              : plan === "business"
              ? "text-yellow-400"
              : "text-gray-300"
          } capitalize`}
        >
          {plan}
        </span>
      </p>

      {/* ✨ Dynamic Glow Animations */}
      <style jsx>{`
        @keyframes glow-blue {
          0%, 100% {
            box-shadow: 0 0 8px rgba(59,130,246,0.3),
                        0 0 16px rgba(59,130,246,0.4),
                        0 0 24px rgba(59,130,246,0.2);
          }
          50% {
            box-shadow: 0 0 12px rgba(59,130,246,0.6),
                        0 0 28px rgba(59,130,246,0.8),
                        0 0 40px rgba(59,130,246,0.4);
          }
        }
        @keyframes glow-yellow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(250,204,21,0.3),
                        0 0 16px rgba(250,204,21,0.4),
                        0 0 24px rgba(250,204,21,0.2);
          }
          50% {
            box-shadow: 0 0 12px rgba(250,204,21,0.6),
                        0 0 28px rgba(250,204,21,0.8),
                        0 0 40px rgba(250,204,21,0.4);
          }
        }
        @keyframes glow-gray {
          0%, 100% {
            box-shadow: 0 0 8px rgba(156,163,175,0.2),
                        0 0 16px rgba(156,163,175,0.3);
          }
          50% {
            box-shadow: 0 0 12px rgba(156,163,175,0.4),
                        0 0 24px rgba(156,163,175,0.4);
          }
        }
        .glow-free { animation: glow-gray 3s ease-in-out infinite; border-color: #6b7280; }
        .glow-pro { animation: glow-blue 3s ease-in-out infinite; border-color: #3b82f6; }
        .glow-business { animation: glow-yellow 3s ease-in-out infinite; border-color: #facc15; }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {/* Free */}
        <div
          className={`flex flex-col items-center bg-[#131720] border rounded-2xl p-8 w-full md:w-80 transition-all shadow-lg hover:shadow-blue-900/20 ${
            plan === "free" ? "glow-free" : "border-gray-700"
          }`}
        >
          <h2 className="text-2xl font-bold mb-1">Free</h2>
          <p className="text-3xl font-bold mb-1">$0</p>
          <p className="text-gray-400 mb-6 text-center">
            Get started with all essential features.
          </p>
          <ul className="text-left space-y-2 text-sm mb-8">
            <li>✅ Up to 5 cleanings / month</li>
            <li>✅ All core cleaning tools included</li>
            <li>✅ Email-only support</li>
          </ul>
          <button
            disabled={plan === "free"}
            className={`w-full py-3 rounded-lg font-medium ${
              plan === "free"
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gray-800 hover:bg-blue-600 text-white"
            }`}
          >
            {plan === "free" ? "✅ Current Plan" : "Select Free"}
          </button>
        </div>

        {/* Pro */}
        <div
          className={`flex flex-col items-center bg-[#131720] border rounded-2xl p-8 w-full md:w-80 transition-all hover:scale-[1.02] hover:shadow-blue-900/30 ${
            plan === "pro" ? "glow-pro" : "border-gray-700"
          }`}
        >
          <h2 className="text-2xl font-bold mb-1">Pro</h2>
          <p className="text-3xl font-bold mb-1">$29 / month</p>
          <p className="text-gray-400 mb-6 text-center">
            Perfect for freelancers and small teams.
          </p>
          <ul className="text-left space-y-2 text-sm mb-8">
            <li>✅ Up to 50 cleanings / month</li>
            <li>✅ All core cleaning tools included</li>
            <li>✅ Email support</li>
          </ul>
          <button
            disabled={plan === "pro"}
            onClick={() =>
              (window.location.href = "https://buy.stripe.com/test_aFaaEW9jJef09hUbdwafS00")
            }
            className={`w-full py-3 rounded-lg font-medium ${
              plan === "pro"
                ? "bg-blue-700 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {plan === "pro" ? "✅ Current Plan" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Business */}
        <div
          className={`flex flex-col items-center bg-[#131720] border rounded-2xl p-8 w-full md:w-80 transition-all hover:scale-[1.02] hover:shadow-yellow-900/30 ${
            plan === "business" ? "glow-business" : "border-gray-700"
          }`}
        >
          <h2 className="text-2xl font-bold mb-1">Business</h2>
          <p className="text-3xl font-bold mb-1">$249 / month</p>
          <p className="text-gray-400 mb-6 text-center">
            Unlimited power for teams and organizations.
          </p>
          <ul className="text-left space-y-2 text-sm mb-8">
            <li>✅ Unlimited cleanings</li>
            <li>✅ Up to 10 team accounts</li>
            <li>✅ Email support</li>
          </ul>
          <button
            disabled={plan === "business"}
            onClick={() =>
              (window.location.href = "https://buy.stripe.com/test_business_link")
            }
            className={`w-full py-3 rounded-lg font-medium ${
              plan === "business"
                ? "bg-yellow-600 text-black cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            {plan === "business" ? "✅ Current Plan" : "Upgrade to Business"}
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-10">
        All payments securely processed by{" "}
        <span className="text-blue-400 font-semibold">Stripe</span>.
      </p>
    </div>
  );
}
