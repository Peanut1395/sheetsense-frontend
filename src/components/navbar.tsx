"use client";

import Link from "next/link";
import supabase from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#0d1b2a] border-b border-gray-700 shadow-md">
      <Link href="/" className="text-2xl font-extrabold text-blue-400">
        SheetSense
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          href="/pricing"
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium"
        >
          Pricing
        </Link>

        {user ? (
          <>
            <span className="text-gray-300">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-semibold"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
