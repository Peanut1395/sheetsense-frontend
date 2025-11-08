"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 If already logged in, go home
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/");
    });
  }, [router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_SITE_URL || "https://sheetsense.me",
        },
      });

      // 🧭 Handle existing account case
      if (error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("already registered") ||
          msg.includes("user already exists") ||
          msg.includes("exists")
        ) {
          toast.error("⚠️ Account already exists. Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        toast.error(error.message);
        return;
      }

      // 🧭 Handle weird Supabase 'user = null' case (duplicate email)
      if (!data?.user) {
        toast.error("⚠️ Account already exists. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      // ✅ Normal signup flow
      toast.success("✅ Verification email sent! Please check your inbox.");
      setEmail("");
      setPassword("");
      // no redirect — user stays on signup page
    } catch (err: any) {
      console.error(err);
      toast.error("Unexpected error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b0d12] text-white px-6 relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent blur-3xl pointer-events-none"></div>

      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition"
      >
        ← Back to Home
      </Link>

      <form
        onSubmit={handleSignup}
        className="bg-[#131720] border border-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Create Your Account</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Join <span className="text-blue-400 font-semibold">SheetSense</span> to
          start cleaning your data effortlessly.
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg mb-6 bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/40"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
