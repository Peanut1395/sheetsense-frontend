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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to homepage (upload page)
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push("/");
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

if (error) {
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    toast.error("❌ Incorrect email or password.");
  } else if (msg.includes("email not confirmed")) {
    toast.error("📧 Please verify your email before logging in.");
  } else {
    toast.error(error.message);
  }
}


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0b0d12] text-white px-6 relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent blur-3xl pointer-events-none"></div>

      <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white transition">
        ← Back to Home
      </Link>

      <form
        onSubmit={handleLogin}
        className="bg-[#131720] border border-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-gray-400 mb-6 text-sm">Log in to continue cleaning your files.</p>

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
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
