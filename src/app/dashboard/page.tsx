"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<number>(0);
  const [plan, setPlan] = useState<string>("free");
  const [limit, setLimit] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          toast.error("Please log in to view your dashboard.");
          setLoading(false);
          return;
        }

        setUser(user);

        const { data, error: dbError } = await supabase
          .from("users")
          .select("plan, usage_count")
          .eq("id", user.id)
          .single();

        if (dbError) {
          toast.error("Could not load usage data.");
          console.error(dbError);
        } else if (data) {
          setPlan(data.plan);
          setUsage(data.usage_count || 0);
          setLimit(
            data.plan === "free" ? 5 : data.plan === "pro" ? 50 : null
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-gray-400">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white flex flex-col items-center py-16 px-6">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard 👋</h1>
      {user && (
        <p className="text-gray-400 mb-8 text-lg">
          Logged in as <span className="font-semibold text-blue-400">{user.email}</span>
        </p>
      )}

      <div className="bg-[#131720] border border-gray-700 rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-3">Your Plan: {plan.toUpperCase()}</h2>
        <p className="text-gray-400 mb-6">
          {limit
            ? `You’ve used ${usage} of ${limit} cleanings this month.`
            : `Unlimited cleanings 🎉`}
        </p>

        <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full ${
              plan === "business" ? "bg-yellow-400" : plan === "pro" ? "bg-blue-500" : "bg-green-500"
            }`}
            style={{
              width: limit ? `${Math.min((usage / limit) * 100, 100)}%` : "100%",
            }}
          ></div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            Start Cleaning
          </Link>

          {plan !== "business" && (
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold"
            >
              Upgrade Plan
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
