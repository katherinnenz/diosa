# DIOSA · Guía para publicar el sitio

Esta guía te lleva de cero a un sitio funcionando en **diosa.katherinnenunez.com**, con cobro automático del plan Elevado por **$4.14 al mes**, sin dar códigos a nadie.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Todo el sitio. Aquí pegas tus datos de configuración. |
| `CNAME` | Le dice a GitHub que use tu subdominio. |
| `.nojekyll` | Evita que GitHub transforme los archivos. No lo borres. |
| `supabase/schema.sql` | Crea la tabla de suscripciones en Supabase. |
| `supabase/functions/stripe-webhook/index.ts` | Recibe los avisos de Stripe y activa o desactiva el plan. |

## Cuánto cuesta

| Servicio | Costo |
|---|---|
| GitHub Pages (alojamiento) | Gratis |
| Supabase (cuentas y suscripciones) | Gratis en su plan gratuito |
| Stripe (cobros) | Sin mensualidad. Solo cobra una comisión por cada pago recibido |
| Tu dominio | Ya lo tienes |

**Cómo funciona:** el plan Esencial no necesita cuenta. Para el plan Elevado, la persona escribe su correo y recibe un enlace para entrar (sin contraseñas), paga con Stripe y Stripe avisa a Supabase. El plan se activa solo. Si cancela o falla un pago, se desactiva solo.

---

## Paso 1 · Sube el sitio a GitHub

1. Crea una cuenta en **github.com** (si no tienes).
2. Toca **New repository**. Nómbralo `diosa`.
   - **Importante:** GitHub Pages es gratis solo con repositorios **públicos**. Cualquiera podrá ver el código del sitio (nunca hay contraseñas ni claves secretas en él). Si prefieres que el código sea privado, mira la nota al final.
3. Dentro del repositorio, toca **Add file → Upload files** y arrastra **todo el contenido** de esta carpeta (incluida la carpeta `supabase`). Toca **Commit changes**.
4. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)**. Guarda.
5. En la misma página, en *Custom domain*, escribe `diosa.katherinnenunez.com` y guarda.

## Paso 2 · Conecta tu subdominio

En el lugar donde administras katherinnenunez.com, crea un registro DNS:

| Tipo | Nombre / Host | Valor / Destino |
|---|---|---|
| CNAME | `diosa` | `TU-USUARIO.github.io` |

Cambia `TU-USUARIO` por tu usuario de GitHub. Cuando GitHub detecte el dominio (de minutos a unas horas), vuelve a **Settings → Pages** y activa **Enforce HTTPS**.

En este punto el sitio ya funciona en **modo de demostración**. Los pasos siguientes conectan el cobro real.

---

## Paso 3 · Crea tu proyecto en Supabase

1. Crea una cuenta en **supabase.com** y un proyecto nuevo (plan gratuito). Guarda la contraseña de la base de datos en un lugar seguro.
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y toca **Run**.
3. Ve a **Authentication → URL Configuration**:
   - *Site URL:* `https://diosa.katherinnenunez.com/`
   - *Redirect URLs:* agrega `https://diosa.katherinnenunez.com/**`
4. (Recomendado) Ve a **Authentication → Email Templates → Magic Link** y agrega esta línea al mensaje, para que el correo también incluya un código de 6 dígitos (útil si alguien abre el enlace en otra aplicación):
   ```
   O escribe este código en DIOSA: {{ .Token }}
   ```
5. Ve a **Project Settings → API** y copia:
   - **Project URL**
   - La clave **anon** o **publishable** (es pública por diseño; la seguridad la da la tabla del Paso 3.2).

## Paso 4 · Configura Stripe (primero en modo de prueba)

1. Crea una cuenta en **stripe.com**. Arriba verás el interruptor **Modo de prueba**: déjalo activado por ahora.
2. **Crea el producto:** *Catálogo de productos → Agregar producto* → nombre `DIOSA Elevado`, precio **$4.14 USD**, **recurrente, mensual**. (Opcional: agrega un segundo precio anual, por ejemplo $39 al año.)
3. **Crea el enlace de pago:** *Payment Links → Nuevo* → elige el precio mensual.
   - En *Después del pago*, elige **No mostrar página de confirmación → Redirigir a tu sitio** y escribe: `https://diosa.katherinnenunez.com/#/gracias`
   - Copia el enlace (empieza con `https://buy.stripe.com/...`). Si creaste el precio anual, haz otro enlace para él.
4. **Activa el portal de clientes:** *Configuración → Facturación → Portal de clientes* → permite cancelar suscripciones y actualizar el método de pago → activa el **enlace de inicio de sesión** y cópialo (empieza con `https://billing.stripe.com/p/login/...`).

## Paso 5 · Publica la función que activa el plan

1. En Supabase ve a **Edge Functions → Deploy a new function → Via editor**.
2. Nómbrala exactamente `stripe-webhook`, borra el código de ejemplo y pega el contenido de `supabase/functions/stripe-webhook/index.ts`. Publícala.
3. En los ajustes de la función, **desactiva "Enforce JWT verification" (Verify JWT)**. Stripe no envía credenciales de Supabase; la seguridad la da la firma de Stripe.
4. Copia la dirección de la función: `https://TU-PROYECTO.supabase.co/functions/v1/stripe-webhook`
5. En Stripe ve a **Desarrolladores → Webhooks → Agregar endpoint**:
   - URL: la dirección del punto anterior
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Guarda y copia el **Secreto de firma** (empieza con `whsec_`).
6. En Supabase ve a **Edge Functions → Secrets** y crea dos secretos:
   - `STRIPE_SECRET_KEY` → Stripe → Desarrolladores → Claves de API → **Clave secreta** (empieza con `sk_test_`)
   - `STRIPE_WEBHOOK_SECRET` → el `whsec_...` del punto anterior

> Las claves secretas **solo** van en Supabase. Nunca las pegues en `index.html` ni en GitHub.

## Paso 6 · Pega tu configuración en el sitio

En GitHub, abre `index.html`, toca el lápiz (✏️) para editar y busca la sección `CONFIGURACIÓN` al inicio del código:

```js
sitio:"https://diosa.katherinnenunez.com/",
supabaseUrl:"",          // ← Project URL de Supabase
supabaseAnon:"",         // ← clave anon / publishable de Supabase
stripeLinkMensual:"",    // ← enlace de pago mensual de Stripe
stripeLinkAnual:"",      // ← opcional: enlace de pago anual
precioAnual:39,          // ← precio anual que muestras (si lo usas)
stripePortal:"",         // ← enlace de inicio de sesión del portal de clientes
contacto:"hola@katherinnenunez.com",   // ← tu correo real
jurisdiccion:"...",      // ← el estado y país cuyas leyes aplican
```

Toca **Commit changes**. GitHub actualiza el sitio en un minuto.

## Paso 7 · Prueba todo

1. Abre el sitio, completa la bienvenida y toca **Elegir Elevado**.
2. Escribe tu correo, abre el enlace que te llega **en el mismo navegador** y vuelve al plan.
3. Toca **Suscribirme** y paga con la tarjeta de prueba `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.
4. Stripe te regresa a `/#/gracias`. En unos segundos el plan Elevado se activa solo.
5. En **Mi cuenta → Administrar mi suscripción**, cancela la suscripción de prueba y toca **Actualizar estado**: el plan vuelve a Esencial al terminar el periodo.

Si algo falla, revisa en Supabase **Edge Functions → stripe-webhook → Logs**, y en Stripe **Desarrolladores → Webhooks → tu endpoint**, donde se ven los avisos enviados y sus respuestas.

## Paso 8 · Pasa a cobros reales

1. Completa la verificación de tu cuenta en Stripe (datos personales o de negocio y cuenta bancaria).
2. Desactiva el **Modo de prueba** y repite en modo real: el producto, el enlace de pago, el portal de clientes y el webhook. Los elementos de prueba no pasan a modo real.
3. Actualiza en Supabase los secretos con la clave `sk_live_...` y el nuevo `whsec_...`.
4. Actualiza en `index.html` los enlaces de pago y del portal con los de modo real.

---

## Límites del plan gratuito que debes conocer

- **Supabase pausa los proyectos gratuitos sin actividad** durante varios días seguidos. Con personas entrando y pagando no suele pasar, pero si ocurre, lo reactivas desde el panel. Revisa las condiciones vigentes en su página de precios.
- **Correos de acceso:** el servicio de correo incluido en Supabase tiene un límite bajo por hora, pensado para pruebas. Cuando lances, conecta un servicio de correo con plan gratuito (por ejemplo Resend) en **Authentication → SMTP Settings**.
- **Los datos de cada persona** (hábitos, diario, etc.) siguen guardándose en su navegador. Supabase solo guarda el correo y el estado de la suscripción. Sincronizar los datos entre dispositivos es el siguiente paso.
- **El contenido del plan Elevado vive dentro del sitio.** Alguien con conocimientos técnicos podría desbloquearlo en su propio navegador sin pagar. Para una beta es un riesgo aceptable; la protección completa requiere servir ese contenido desde el servidor.

## Nota: si quieres el código privado

Conecta este mismo repositorio de GitHub (puede ser privado) a **Cloudflare Pages** o **Netlify**, que alojan gratis desde repositorios privados. El resto de la guía es igual; solo cambia el destino del registro CNAME por el que te indique ese servicio.

## Antes del lanzamiento

Los textos de Términos, Privacidad y Aviso de bienestar son una base sólida, pero conviene que los revise un abogado.
