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
      paymentMethod,
    } = await req.json();

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

    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: fullName || undefined,
        metadata: metadata || {},
      });
    }

    if (paymentMethod === "pix") {
      const price = await stripe.prices.retrieve(priceId);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount || 0,
        currency: price.currency || "brl",
        customer: customer.id,
        payment_method_types: ["pix"],
        metadata: {
          ...metadata,
          plan_type: planType,
          payment_method: "pix",
          price_id: priceId,
        },
      });

      const updatedPaymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntent.id
      );

      const pixData = updatedPaymentIntent.next_action?.display_pix_qr_code;

      if (!pixData || !pixData.qr_code) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const retryPaymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntent.id
        );
        const retryPixData =
          retryPaymentIntent.next_action?.display_pix_qr_code;

        if (!retryPixData || !retryPixData.qr_code) {
          throw new Error(
            "Não foi possível gerar dados do PIX. Tente novamente."
          );
        }

        return new Response(
          JSON.stringify({
            paymentIntentId: retryPaymentIntent.id,
            pixQrCode: retryPixData.qr_code,
            pixCode: retryPixData.code || "",
            pixKey: customer.email || email,
            expiresAt: retryPixData.expires_at,
            amount: price.unit_amount ? price.unit_amount / 100 : 0,
            currency: price.currency || "brl",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          paymentIntentId: updatedPaymentIntent.id,
          pixQrCode: pixData.qr_code,
          pixCode: pixData.code || "",
          pixKey: customer.email || email,
          expiresAt: pixData.expires_at,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency || "brl",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const sessionConfig: any = {
      customer: customer.id,
      payment_method_types: ["card", "boleto"],
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
        payment_method: paymentMethod || "boleto_card",
      },
      subscription_data: {
        metadata: {
          ...metadata,
          plan_type: planType,
          payment_method: paymentMethod || "boleto_card",
        },
      },
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
