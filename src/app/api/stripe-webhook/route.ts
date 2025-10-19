import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Lazy init Supabase
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials missing");
  }

  return createClient(url, key);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = getSupabase();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const email = session.customer_details?.email;
    const priceId = session.metadata?.price_id;

    let plan = "free";
    if (priceId === "price_1SHhpkBMisi9mPSq0U1XvD7b") plan = "pro";
    if (priceId === "price_1SHi6yBMisi9mPSqxbPDIUK4") plan = "business";

    const { error } = await supabase
      .from("users")
      .update({ plan })
      .eq("email", email);

    if (error) {
      console.error("Supabase update error:", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
