import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover" as any,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });

    const lineItem = session.line_items?.data?.[0];
    const productName =
      (lineItem?.price?.product as Stripe.Product)?.name || "Pro";

    let plan = "pro";
    if (productName.toLowerCase().includes("business")) plan = "business";

    return NextResponse.json({ success: true, plan });
  } catch (err: any) {
    console.error("❌ Stripe verification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
