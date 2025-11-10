"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-gray-200 px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">
          Last Updated: November 2025
        </p>

        <div className="space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>SheetSense</strong>. By
            accessing or using our website <strong>https://sheetsense.me</strong> (“Service”),
            you agree to comply with and be bound by these Terms of Service. If
            you do not agree, you must not use the Service.
          </p>

          <h2 className="text-xl font-semibold text-white">1. Description of Service</h2>
          <p>
            SheetSense provides an online tool that allows users to upload
            spreadsheet files (CSV/XLSX), apply automated cleaning operations,
            and download processed versions. Users may access the Service under
            a Free, Pro, or Business subscription plan.
          </p>

          <h2 className="text-xl font-semibold text-white">2. Eligibility</h2>
          <p>
            You must be at least 16 years old to use the Service. If you are
            using SheetSense on behalf of an organisation, you represent that
            you have authority to bind that entity.
          </p>

          <h2 className="text-xl font-semibold text-white">3. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials and all activity under your account. You agree to
            provide accurate and complete information and promptly update it as
            necessary.
          </p>

          <h2 className="text-xl font-semibold text-white">4. Use of Service</h2>
          <ul className="list-disc ml-6">
            <li>Do not use the Service for unlawful purposes.</li>
            <li>Do not reverse-engineer or misuse the system.</li>
            <li>Do not attempt to bypass plan limits or quotas.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">5. Payments & Subscriptions</h2>
          <p>
            Paid subscriptions are handled via <strong>Stripe</strong>. You
            authorise recurring payments until cancelled. Refunds are handled as
            outlined in our Refund Policy.
          </p>

          <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
          <p>
            SheetSense is provided “as is”. We are not liable for indirect,
            incidental, or consequential damages resulting from use of the
            Service.
          </p>

          <h2 className="text-xl font-semibold text-white">7. Governing Law</h2>
          <p>
            These Terms are governed by the laws of New South Wales, Australia.
          </p>

          <h2 className="text-xl font-semibold text-white">8. Contact</h2>
          <p>
            Questions about these Terms:{" "}
            <a
              href="mailto:support@sheetsense.me"
              className="text-blue-400 hover:underline"
            >
              singhpranitj07@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
