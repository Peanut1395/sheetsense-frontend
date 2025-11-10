import Upload from "@/components/Upload";
import { FaMagic, FaBolt, FaTable, FaLock } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white flex flex-col">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gradient-to-b from-[#0d1b2a] to-[#1b263b]">
        <h1 className="text-5xl md:text-6xl font-extrabold">
          Turn Messy Spreadsheets <br /> Into Clean Data in Seconds
        </h1>
        <p className="text-lg text-gray-300 mt-6 max-w-2xl mx-auto">
          Save hours of manual cleanup. Upload your spreadsheet, choose cleaning
          options, and download perfectly formatted data — instantly.
        </p>
        <a
          href="#upload"
          className="inline-block mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
        >
          Try It Now
        </a>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#1b263b]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why SheetSense?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <FaMagic className="text-4xl text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Smart Cleaning</h3>
              <p className="text-gray-400">
                Remove duplicates, fix headers, and trim spaces with one click.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <FaTable className="text-4xl text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Better Formatting</h3>
              <p className="text-gray-400">
                Standardize dates, emails, and names for consistent records.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <FaBolt className="text-4xl text-yellow-400 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Fast & Easy</h3>
              <p className="text-gray-400">
                Upload, select, download — no learning curve, no wasted time.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
              <FaLock className="text-4xl text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">Private & Secure</h3>
              <p className="text-gray-400">
                Your files never leave the app — nothing is stored on servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#0d1b2a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">1. Upload</h3>
              <p className="text-gray-400">Choose your CSV or Excel file.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">2. Select Options</h3>
              <p className="text-gray-400">Pick the cleaning tasks you need.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-2">3. Download</h3>
              <p className="text-gray-400">Get your cleaned, formatted file.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-20 bg-[#1b263b]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Try SheetSense</h2>
          <p className="text-center text-gray-400 mb-12">
            Upload a file below and see how quickly you can turn messy data into
            something usable.
          </p>
          <Upload />
        </div>
      </section>

      {/* Footer */}
<footer className="mt-20 border-t border-gray-800 bg-[#0b0d12] py-8 text-center text-sm text-gray-500">
  <div className="space-y-2">

    <div className="space-x-4">
      <a href="/privacy" className="hover:text-blue-400 transition">
        Privacy Policy
      </a>
      <span className="text-gray-600">|</span>
      <a href="/terms" className="hover:text-blue-400 transition">
        Terms of Service
      </a>
      <span className="text-gray-600">|</span>
      <a href="/refund" className="hover:text-blue-400 transition">
        Refund Policy
      </a>
    </div>
  </div>
</footer>


    </main>
  );
}
