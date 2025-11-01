"use client";

import { useRef, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Upload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  // 🧭 Usage + plan state
  const [plan, setPlan] = useState<string>("free");
  const [usageCount, setUsageCount] = useState<number>(0);
  const [limit, setLimit] = useState<number | null>(null);

  const [options, setOptions] = useState({
    removeDuplicates: false,
    trimSpaces: false,
    cleanHeaders: false,
    dropEmptyColumns: false,
    normaliseDates: false,
    fixEmails: false,
    titlecaseNames: false,
    sentencecaseComments: false,
    fillBlanks: false,
    highlightEmpty: false,
    placeholder: "Unknown",
  });

  // 🔹 Fetch user usage & plan info
  async function fetchUserUsage() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      const { data, error: dbError } = await supabase
        .from("users")
        .select("plan, usage_count")
        .eq("id", user.id)
        .single();

      if (!dbError && data) {
        setPlan(data.plan || "free");
        setUsageCount(data.usage_count || 0);
        setLimit(data.plan === "free" ? 5 : data.plan === "pro" ? 50 : null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch usage info:", err);
    }
  }

  useEffect(() => {
    fetchUserUsage();
  }, []);

  function handleFileSelect(f: File) {
    const ok = /\.(csv|xls|xlsx)$/i.test(f.name);
    if (!ok) {
      toast.error("Please upload a CSV or Excel (.xlsx) file.");
      return;
    }
    setFile(f);
    setMessage(null);
    setProgress(0);
    setDownloadUrl(null);
    setDownloadFilename(null);
  }

  function toggle(key: keyof typeof options) {
    if (key === "placeholder") return;
    setOptions((o) => ({ ...o, [key]: !o[key] }));
  }

  function selectAll() {
    setOptions({
      removeDuplicates: true,
      trimSpaces: true,
      cleanHeaders: true,
      dropEmptyColumns: true,
      normaliseDates: true,
      fixEmails: true,
      titlecaseNames: true,
      sentencecaseComments: true,
      fillBlanks: true,
      highlightEmpty: true,
      placeholder: "Unknown",
    });
  }

  async function start() {
    if (!file) return toast.error("Please upload a file first.");

    // 🔹 Check if user is logged in — redirect to /login if not
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage("Processing file...");
    setProgress(0);
    setDownloadUrl(null);
    setDownloadFilename(null);

    const tick = setInterval(() => setProgress((p) => (p < 90 ? p + 8 : p)), 250);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("user_id", user.id);
    fd.append("remove_duplicates", String(options.removeDuplicates));
    fd.append("trim_spaces", String(options.trimSpaces));
    fd.append("clean_headers", String(options.cleanHeaders));
    fd.append("drop_empty_columns", String(options.dropEmptyColumns));
    fd.append("normalize_dates", String(options.normaliseDates));
    fd.append("fix_emails", String(options.fixEmails));
    fd.append("titlecase_names", String(options.titlecaseNames));
    fd.append("sentencecase_comments", String(options.sentencecaseComments));
    fd.append("fill_blanks", String(options.fillBlanks));
    fd.append("highlight_empty", String(options.highlightEmpty));
    fd.append("fill_value", options.placeholder || "Unknown");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://sheetsense-backend.onrender.com"}/clean`,
        { method: "POST", body: fd }
      );

      if (!res.ok) {
        const errText = await res.text();
        let errorMessage = "Server error";

        try {
          const json = JSON.parse(errText);
          errorMessage = json.error || errText;
        } catch {
          errorMessage = errText;
        }

        if (errorMessage.includes("Usage limit reached")) {
          setLimitReached(true);
          setMessage("⚠️ You’ve reached your free limit. Please upgrade to continue.");
          setLoading(false);
          setProgress(0);
          toast.error("🚫 Usage limit reached — please upgrade your plan.");
          return;
        } else {
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // ✅ Read usage headers
      const newPlan = res.headers.get("X-Usage-Plan") || plan;
      const newUsage = res.headers.get("X-Usage-Count");
      const newLimit = res.headers.get("X-Usage-Limit");

      // Convert file blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const cd = res.headers.get("Content-Disposition");
      let filename = `cleaned_${file.name}`;
      if (cd) {
        const m = cd.match(/filename="?([^"]+)"?/i);
        if (m?.[1]) filename = m[1];
      }

      setDownloadUrl(url);
      setDownloadFilename(filename);

      // Refresh usage info
      await fetchUserUsage();

      const safeUsage =
        newUsage && newLimit
          ? `Usage: ${newUsage}/${newLimit} (${newPlan})`
          : limit
          ? `Usage: ${usageCount + 1}/${limit} (${plan})`
          : `Plan: ${plan.toUpperCase()}`;

      toast.success(`✅ File cleaned successfully! ${safeUsage}`);
      setMessage(null);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Usage limit reached")) {
        setLimitReached(true);
        setMessage("⚠️ You’ve reached your free limit. Please upgrade to continue.");
        toast.error("🚫 Usage limit reached — please upgrade your plan.");
      } else {
        toast.error(err.message || "Server error");
      }
    } finally {
      clearInterval(tick);
      setProgress(100);
      setLoading(false);
      setTimeout(() => setProgress(0), 1200);
    }
  }

  function downloadFile() {
    if (!downloadUrl || !downloadFilename) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFilename;
    a.click();
  }

  return (
    <div className="mt-8 flex flex-col items-center max-w-4xl w-full mx-auto space-y-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* 🧭 Usage Info Bar */}
      {plan && (
        <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
          <h3 className="text-lg font-semibold text-white mb-1">
            Current Plan:{" "}
            <span
              className={`${
                plan === "pro"
                  ? "text-blue-400"
                  : plan === "business"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {plan.toUpperCase()}
            </span>
          </h3>
          <p className="text-gray-400 text-sm">
            {limit
              ? `You’ve used ${usageCount} of ${limit} cleanings this month.`
              : "Unlimited cleanings 🎉"}
          </p>
          {limit && (
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  plan === "pro"
                    ? "bg-blue-500"
                    : plan === "business"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min((usageCount / limit) * 100, 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Upload Box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
        }}
        className={`w-full p-10 border-2 border-dashed rounded-2xl cursor-pointer text-center transition ${
          dragActive
            ? "border-blue-400 bg-blue-900/30"
            : "border-gray-600 hover:border-blue-400"
        }`}
      >
        <p className="text-lg">
          {file ? (
            <>
              📂 <strong>Selected:</strong> {file.name}
            </>
          ) : (
            <>
              ⬆️ Drag & Drop a file here, or{" "}
              <span className="text-blue-400 underline">click to upload</span>
            </>
          )}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
        />
      </div>

      {/* Cleaning Options */}
      {file && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Data Cleanup */}
            <div className="p-5 rounded-xl bg-gray-800/70 border border-gray-700 space-y-3">
              <h3 className="font-semibold text-lg mb-2">🧹 Data Cleanup</h3>
              {[
                ["removeDuplicates", "Remove Duplicates", "Deletes repeated rows so each record is unique."],
                ["trimSpaces", "Trim Spaces", "Removes extra spaces from text fields."],
                ["cleanHeaders", "Clean Headers", "Standardizes column names (lowercase, underscores)."],
                ["dropEmptyColumns", "Drop Empty Columns", "Removes columns that contain no data."],
              ].map(([key, label, desc]) => (
                <label key={key} className="inline-flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={(options as any)[key]}
                    onChange={() => toggle(key as keyof typeof options)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-gray-400">{desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Formatting */}
            <div className="p-5 rounded-xl bg-gray-800/70 border border-gray-700 space-y-3">
              <h3 className="font-semibold text-lg mb-2">✨ Formatting</h3>
              {[
                ["normaliseDates", "Normalize Dates", "Converts dates to DD-MM-YYYY format."],
                ["fixEmails", "Fix Emails", "Cleans emails and replaces invalid ones."],
                ["titlecaseNames", "Titlecase Names/Cities", "Capitalizes names and city names."],
                ["sentencecaseComments", "Sentencecase Comments", "Makes comments start with a capital letter."],
                ["highlightEmpty", "Highlight Empty Cells", "Yellow in Excel, '__EMPTY__' markers in CSV."],
              ].map(([key, label, desc]) => (
                <label key={key} className="inline-flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={(options as any)[key]}
                    onChange={() => toggle(key as keyof typeof options)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-gray-400">{desc}</div>
                  </div>
                </label>
              ))}

              <label className="inline-flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={options.fillBlanks}
                  onChange={() => toggle("fillBlanks")}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Fill Empty Cells</div>
                  <div className="text-sm text-gray-400">
                    Replace empty cells with your chosen placeholder.
                  </div>
                </div>
              </label>

              {options.fillBlanks && (
                <div className="ml-10 mt-2">
                  <label className="block text-sm text-gray-300 mb-1">
                    Placeholder text
                  </label>
                  <input
                    type="text"
                    value={options.placeholder}
                    onChange={(e) =>
                      setOptions({ ...options, placeholder: e.target.value })
                    }
                    className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
                    placeholder="Unknown"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              onClick={selectAll}
              className="mt-2 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium"
            >
              Select All Cleaning Options
            </button>
          </div>
        </>
      )}

      {/* Start / Download / Upgrade */}
      {file && (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {limitReached ? (
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-xl px-8 py-3 font-semibold bg-yellow-500 text-black shadow hover:bg-yellow-400 transition"
            >
              ⚡ Upgrade Plan
            </button>
          ) : (
            <button
              onClick={start}
              disabled={loading}
              className="rounded-xl px-8 py-3 font-semibold bg-blue-600 shadow hover:bg-blue-500 transition disabled:opacity-50"
            >
              {loading ? "Cleaning..." : "Start Cleaning"}
            </button>
          )}

          {downloadUrl && (
            <button
              onClick={downloadFile}
              className="rounded-xl px-8 py-3 font-semibold bg-green-600 shadow hover:bg-green-500 transition"
            >
              Download File
            </button>
          )}
        </div>
      )}

      {/* Progress Bar + Message */}
      {loading && (
        <div className="w-full bg-gray-700 rounded-full h-3 mt-4 overflow-hidden">
          <div
            className="bg-blue-400 h-3 rounded-full animate-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {message && (
        <p
          className={`mt-4 text-lg font-medium text-center ${
            message.startsWith("⚠️") ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
