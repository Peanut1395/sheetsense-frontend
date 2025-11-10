"use client";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-gray-200 px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-white mb-6">Refund Policy</h1>
        <p className="text-sm text-gray-400 mb-10">
          Last Updated: November 2025
        </p>

        <div className="space-y-6 leading-relaxed">
          <p>
            SheetSense provides subscription-based software services. We aim for
            transparency and fairness in billing.
          </p>

          <h2 className="text-xl font-semibold text-white">1. Free Plan</h2>
          <p>
            Users can test SheetSense under a free plan before upgrading.
          </p>

          <h2 className="text-xl font-semibold text-white">2. Paid Subscriptions</h2>
          <p>
            Paid plans renew automatically via Stripe until cancelled. You may
            cancel anytime through your account or Stripe portal.
          </p>

          <h2 className="text-xl font-semibold text-white">3. Refunds</h2>
          <p>
            Because our service is digital and active immediately, refunds are
            generally not offered. Exceptions apply for duplicate charges or
            verified technical issues. Request a review within 14 days at{" "}
            <a
              href="mailto:billing@sheetsense.me"
              className="text-blue-400 hover:underline"
            >
              singhpranitj07@gmail.com
            </a>.
          </p>

          <h2 className="text-xl font-semibold text-white">4. Cancellations</h2>
          <p>
            Cancel anytime before renewal to avoid future charges. You retain
            access until the current billing cycle ends.
          </p>

          <h2 className="text-xl font-semibold text-white">5. Contact</h2>
          <p>
            Billing questions:{" "}
            <a
              href="mailto:billing@sheetsense.me"
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
