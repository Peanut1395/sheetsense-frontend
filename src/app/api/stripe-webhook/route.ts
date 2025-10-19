import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key (NOT anon)
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // 🔹 When checkout completes
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const email = session.customer_details?.email;
      const priceId = session.metadata?.price_id || session.subscription?.price?.id;

      console.log("✅ Stripe session completed for", email, priceId);

      if (email) {
        let plan = "free";
        if (priceId === "price_1SHi6lBMisi9mPSqj5vNdzNM") plan = "pro";
        if (priceId === "price_1SHi6yBMisi9mPSqxbPDIUK4") plan = "business";

        const { error } = await supabase
          .from("users")
          .update({ plan })
          .eq("email", email);

        if (error) console.error("Supabase update error:", error);
        else console.log(`🔹 Updated ${email} to plan: ${plan}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
