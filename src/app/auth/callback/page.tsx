"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        toast.error("Login failed. Try again.");
        router.push("/login");
      } else if (data.session) {
        toast.success("Welcome! You're now logged in.");
        router.push("/");
      }
    }
    handleAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
      <p className="text-lg">Logging you in...</p>
    </main>
  );
}
