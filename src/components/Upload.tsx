"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Upload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState("same");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false); // ✅ NEW

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

    // 🔑 Ensure logged-in user
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      toast.error("You must be logged in to clean files.");
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
    fd.append("output_format", outputFormat);

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
      const res = await fetch("http://127.0.0.1:8000/clean", { method: "POST", body: fd });

      if (!res.ok) {
        const errText = await res.text();
        let errorMessage = "Server error";

        try {
          const json = JSON.parse(errText);
          errorMessage = json.error || errText;
        } catch {
          errorMessage = errText;
        }

        // ✅ Handle usage limit from backend
        if (errorMessage.includes("Usage limit reached")) {
          setLimitReached(true);
          setMessage("⚠️ You’ve reached your free limit (5 files). Please upgrade to continue.");
          setLoading(false);
          setProgress(0);
          toast.error("🚫 Usage limit reached — please upgrade your plan.");
          return;
        } else {
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Extract filename
      const cd = res.headers.get("Content-Disposition");
      let filename = `cleaned_${file.name}`;
      if (cd) {
        const m = cd.match(/filename="?([^"]+)"?/i);
        if (m?.[1]) filename = m[1];
      }

      setDownloadUrl(url);
      setDownloadFilename(filename);
      toast.success("✅ File cleaned successfully. Click 'Download File' to save it.");
      setMessage(null); // ✅ clear "Processing file..."
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Usage limit reached")) {
        setLimitReached(true);
        setMessage("⚠️ You’ve reached your free limit (5 files). Please upgrade to continue.");
        setLoading(false);
        setProgress(0);
        toast.error("🚫 Usage limit reached — please upgrade your plan.");
        return;
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

      {/* Upload box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
        }}
        className={`w-full p-10 border-2 border-dashed rounded-2xl cursor-pointer text-center transition ${
          dragActive ? "border-blue-400 bg-blue-900/30" : "border-gray-600 hover:border-blue-400"
        }`}
      >
        <p className="text-lg">
          {file ? (
            <>📂 <strong>Selected:</strong> {file.name}</>
          ) : (
            <>⬆️ Drag & Drop a file here, or <span className="text-blue-400 underline">click to upload</span></>
          )}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
      </div>

      {/* Cleaning + Formatting options */}
      {file && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Data Cleanup */}
            <div className="p-5 rounded-xl bg-gray-800/70 border border-gray-700 space-y-3">
              <h3 className="font-semibold text-lg mb-2">🧹 Data Cleanup</h3>
              <div className="flex flex-col gap-2">
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
            </div>

            {/* Formatting */}
            <div className="p-5 rounded-xl bg-gray-800/70 border border-gray-700 space-y-3">
              <h3 className="font-semibold text-lg mb-2">✨ Formatting</h3>
              <div className="flex flex-col gap-2">
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
                    <label className="block text-sm text-gray-300 mb-1">Placeholder text</label>
                    <input
                      type="text"
                      value={options.placeholder}
                      onChange={(e) => setOptions({ ...options, placeholder: e.target.value })}
                      className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
                      placeholder="Unknown"
                    />
                  </div>
                )}
              </div>
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

            <div className="mt-2">
              <label className="font-semibold mr-2">Output Format:</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
              >
                <option value="same">Same as uploaded</option>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Start / Upgrade / Download buttons */}
      {file && (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {limitReached ? (
            <button
              onClick={() => (window.location.href = "/pricing")}
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
