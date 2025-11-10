"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-gray-200 px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">
          Last Updated: November 2025
        </p>

        <div className="space-y-6 leading-relaxed">
          <p>
            SheetSense values your privacy. This Privacy Policy explains how we
            collect, use, and protect your information when you use our Service.
          </p>

          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li>Account data: email and password (stored securely via Supabase)</li>
            <li>Usage data: plan type, usage count, analytics</li>
            <li>Uploaded files: temporarily processed, then deleted</li>
            <li>Payment data: managed by Stripe; we do not store card details</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">2. How We Use Data</h2>
          <p>
            We use your data to provide, maintain, and improve the Service,
            enforce usage limits, process payments, and communicate with you.
          </p>

          <h2 className="text-xl font-semibold text-white">3. Data Retention</h2>
          <p>
            Uploaded files are automatically deleted after processing. Account
            data is retained while your account is active.
          </p>

          <h2 className="text-xl font-semibold text-white">4. Data Sharing</h2>
          <p>
            We only share information with trusted third parties:
            Supabase (auth), Stripe (billing), and Render/Vercel (hosting).
            We never sell or rent personal data.
          </p>

          <h2 className="text-xl font-semibold text-white">5. Security</h2>
          <p>
            We use SSL encryption and reputable infrastructure providers to
            safeguard your information.
          </p>

          <h2 className="text-xl font-semibold text-white">6. Your Rights</h2>
          <p>
            You can request account deletion or data access by contacting us at{" "}
            <a
              href="mailto:privacy@sheetsense.me"
              className="text-blue-400 hover:underline"
            >
              singhpranitj07@gmail.com
            </a>.
          </p>

          <h2 className="text-xl font-semibold text-white">7. Updates</h2>
          <p>
            We may update this policy periodically. Continued use after changes
            means you accept the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}
