import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  // 1. Verificar usuario (Seguridad)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 2. Crear la sesión de pago en Stripe
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // IMPORTANTE: Pon aquí tu ID de precio real de Stripe (ej: price_12345...)
          price: "price_1SdFkM9lpaS7N5G1Dw4nJjuf", 
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancelled`,
      customer_email: user.email, // Para que Stripe sepa quién paga
      metadata: {
        userId: user.id, // Guardamos el ID de usuario para usarlo luego
      },
    });

    // 3. Devolver la URL de pago al frontend
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando sesión" }, { status: 500 });
  }
}