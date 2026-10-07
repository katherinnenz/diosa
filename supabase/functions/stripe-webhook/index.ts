// DIOSA · Función que recibe los avisos de Stripe y activa o desactiva el plan Elevado.
// Se publica en Supabase → Edge Functions con el nombre: stripe-webhook
// Secretos necesarios (Supabase → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY      → Stripe → Desarrolladores → Claves de API → Clave secreta
//   STRIPE_WEBHOOK_SECRET  → Stripe → Desarrolladores → Webhooks → tu endpoint → Secreto de firma
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY ya existen automáticamente en Supabase.

import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});
const crypto = Stripe.createSubtleCryptoProvider();
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

// La fecha de fin del periodo puede venir en la suscripción o en su primer elemento, según la versión de la API.
const finPeriodo = (sub: any): string | null => {
  const t = sub?.current_period_end ?? sub?.items?.data?.[0]?.current_period_end;
  return t ? new Date(t * 1000).toISOString() : null;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Método no permitido", { status: 405 });
  const firma = req.headers.get("Stripe-Signature");
  const cuerpo = await req.text();

  let evento: Stripe.Event;
  try {
    evento = await stripe.webhooks.constructEventAsync(cuerpo, firma!, Deno.env.get("STRIPE_WEBHOOK_SECRET")!, undefined, crypto);
  } catch (_e) {
    return new Response("Firma inválida", { status: 400 });
  }

  try {
    if (evento.type === "checkout.session.completed") {
      const s = evento.data.object as Stripe.Checkout.Session;
      const userId = s.client_reference_id;
      if (userId && s.subscription) {
        const sub = await stripe.subscriptions.retrieve(s.subscription as string);
        const { error } = await db.from("suscripciones").upsert({
          user_id: userId,
          email: s.customer_details?.email ?? s.customer_email ?? null,
          estado: sub.status,
          stripe_customer: s.customer as string,
          stripe_subscription: sub.id,
          periodo_fin: finPeriodo(sub),
          actualizado: new Date().toISOString(),
        });
        if (error) throw error;
      }
    }

    if (evento.type === "customer.subscription.updated" || evento.type === "customer.subscription.deleted") {
      const sub = evento.data.object as Stripe.Subscription;
      const { error } = await db.from("suscripciones").update({
        estado: evento.type === "customer.subscription.deleted" ? "cancelada" : sub.status,
        stripe_subscription: sub.id,
        periodo_fin: finPeriodo(sub),
        actualizado: new Date().toISOString(),
      }).eq("stripe_customer", sub.customer as string);
      if (error) throw error;
    }
  } catch (e) {
    console.error("Error al procesar el evento", evento.type, e);
    return new Response("Error interno", { status: 500 }); // Stripe reintentará automáticamente
  }

  return new Response(JSON.stringify({ recibido: true }), { headers: { "Content-Type": "application/json" } });
});
