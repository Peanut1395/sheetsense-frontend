"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1️⃣ — Attempt sign-up
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        },
      });

      // Step 2️⃣ — Handle specific Supabase error cases
      if (error) {
        const msg = error.message.toLowerCase();

        if (
          msg.includes("user already registered") ||
          msg.includes("already exists") ||
          msg.includes("email") && msg.includes("exists")
        ) {
          toast.error("⚠️ This email already has an account. Redirecting to login...");
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }

        toast.error(error.message || "Sign-up failed. Try again later.");
        return;
      }

      // Step 3️⃣ — Handle case when no user returned but no error (Supabase bug)
      if (!data?.user) {
        toast.error("⚠️ This email already has an account. Redirecting to login...");
        setTimeout(() => (window.location.href = "/login"), 2000);
        return;
      }

      // Step 4️⃣ — Normal first-time signup
      toast.success("✅ Verification email sent! Please check your inbox.");
      setEmail("");
      setPassword("");
      setTimeout(() => (window.location.href = "/login"), 5000);
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error("Unexpected error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0d12] text-white px-6 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent blur-3xl pointer-events-none"></div>

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
        .glow-blue {
          animation: glow-blue 3s ease-in-out infinite;
          border-color: #3b82f6;
        }
      `}</style>

      {/* Signup form */}
      <form
        onSubmit={handleSignup}
        className="glow-blue bg-[#131720] border rounded-2xl p-8 shadow-2xl w-full max-w-md text-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">
          Create Your Account
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Join SheetSense and start cleaning your data effortlessly.
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
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/40"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
