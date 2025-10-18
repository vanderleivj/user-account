import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-11-20.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      planType,
      priceId,
      email,
      fullName,
      metadata,
      successUrl,
      cancelUrl,
    } = await req.json();

    console.log("=== CREATE CHECKOUT SESSION ===");
    console.log("Plan Type:", planType);
    console.log("Price ID:", priceId);
    console.log("Email:", email);
    console.log("Full Name:", fullName);
    console.log("Success URL:", successUrl);
    console.log("Cancel URL:", cancelUrl);

    // Validar dados obrigatórios
    if (!priceId || !email) {
      return new Response(
        JSON.stringify({
          error: "priceId e email são obrigatórios",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Criar ou buscar customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log("Customer existente encontrado:", customer.id);
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: fullName || undefined,
        metadata: metadata || {},
      });
      console.log("Novo customer criado:", customer.id);
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${req.headers.get("origin")}/success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/plans`,
      metadata: {
        ...metadata,
        plan_type: planType,
      },
      subscription_data: {
        metadata: {
          ...metadata,
          plan_type: planType,
        },
      },
    });

    console.log("Checkout session criada:", session.id);
    console.log("Checkout URL:", session.url);

    return new Response(
      JSON.stringify({
        checkoutUrl: session.url,
        sessionId: session.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Erro ao criar checkout session:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Erro ao criar checkout session",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
