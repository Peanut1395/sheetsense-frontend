"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Invalid login credentials");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#1b263b] p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Log In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
