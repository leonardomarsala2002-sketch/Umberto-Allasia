// Edge Function "send-email" — invio email tramite Resend (se c'è RESEND_API_KEY) oppure Brevo.
//
// Azioni supportate:
//   - subscribe  (pubblica): aggiunge l'email ai contatti Brevo e invia la mail di benvenuto.
//                L'email deve essere già presente nella tabella `subscribers`.
//   - newsletter (solo admin): invia l'avviso di un nuovo articolo a tutti gli iscritti,
//                una email separata per ciascuno (nessuno vede gli indirizzi degli altri).
//   - health     (pubblica): verifica che la chiave Brevo funzioni e che il mittente sia
//                verificato, senza inviare nulla.
//
// Deploy: supabase functions deploy send-email --project-ref yqevubcpaloxwjxvqchc --no-verify-jwt --use-api

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4"

// Mittente: si può cambiare senza ripubblicare impostando il secret SENDER_EMAIL in Supabase.
// Deve essere un mittente verificato su Brevo. (Provvisorio: Gmail di test, poi info@ del dominio.)
const SENDER = {
  name: "Il Fisioterapista",
  email: (Deno.env.get("SENDER_EMAIL") || "leonardo.marsala2002@gmail.com").toLowerCase(),
}
const SITE_URL = "https://umberto-allasia.vercel.app/"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })

const escapeHtml = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  )

const isEmail = (e: unknown): e is string =>
  typeof e === "string" && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

function welcomeHtml() {
  return `
  <div style="background-color:#FEFCF9;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #E2D8CC;">
      <div style="background:#FBF7F2;padding:40px;text-align:center;border-bottom:1px solid #E2D8CC;">
        <div style="font-size:24px;color:#2C2420;font-weight:bold;letter-spacing:1px;">IL <span style="font-style:italic;color:#B07D55;">FISIOTERAPISTA</span></div>
      </div>
      <div style="padding:40px;">
        <h2 style="color:#2C2420;font-size:22px;margin-bottom:20px;font-weight:500;">Benvenuto nel mio spazio digitale</h2>
        <p style="color:#6B5E55;line-height:1.7;font-size:16px;margin-bottom:20px;">Ciao! Ti ringrazio per aver scelto di rimanere in contatto.</p>
        <p style="color:#6B5E55;line-height:1.7;font-size:16px;margin-bottom:30px;">Da oggi riceverai direttamente via email i miei consigli sulla salute, le storie di chi ha ritrovato il movimento e le ultime news dallo studio di San Marino.</p>
        <div style="padding-top:20px;border-top:1px solid #F5EFE6;">
          <p style="color:#6B5E55;line-height:1.7;font-size:16px;margin-bottom:5px;">A presto,</p>
          <p style="color:#B07D55;font-size:18px;font-weight:bold;margin:0;">Umberto Allasia</p>
        </div>
      </div>
      <div style="background:#2C2420;padding:20px;text-align:center;">
        <p style="font-size:12px;color:#EDE4D8;margin:0;opacity:0.8;">San Marino — Str. Ca' Vagnetto, 3</p>
      </div>
    </div>
  </div>`
}

function newsletterHtml(title: string, excerpt: string, articleId: string | number | null) {
  const link = articleId ? `${SITE_URL}articolo.html?id=${encodeURIComponent(String(articleId))}` : SITE_URL
  return `
  <div style="background-color:#FEFCF9;padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #E2D8CC;">
      <div style="background:#FBF7F2;padding:40px;text-align:center;border-bottom:1px solid #E2D8CC;">
        <div style="font-size:14px;color:#B07D55;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">Nuova Storia</div>
        <h1 style="color:#2C2420;font-size:28px;margin:0;font-weight:500;">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:40px;">
        <p style="color:#6B5E55;line-height:1.8;font-size:17px;margin-bottom:30px;">${escapeHtml(excerpt)}</p>
        <a href="${link}" style="display:inline-block;background:#B07D55;color:#ffffff;padding:16px 40px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:16px;">Continua a leggere sul sito</a>
        <div style="margin-top:50px;padding-top:30px;border-top:1px solid #F5EFE6;">
          <p style="color:#6B5E55;line-height:1.7;font-size:15px;margin:0;">Un caro saluto,</p>
          <p style="color:#B07D55;font-size:17px;font-weight:bold;margin:5px 0 0 0;">Umberto Allasia</p>
        </div>
      </div>
      <div style="background:#FBF7F2;padding:20px;text-align:center;border-top:1px solid #E2D8CC;">
        <p style="font-size:11px;color:#A8998F;margin:0;">Ricevi questa comunicazione perché sei iscritto alla newsletter di Il Fisioterapista · San Marino.<br>
        Per non ricevere più queste email rispondi a questo messaggio scrivendo "cancellami".</p>
      </div>
    </div>
  </div>`
}

async function brevo(path: string, method: string, body?: unknown) {
  const key = Deno.env.get("BREVO_API_KEY")
  if (!key) throw new Error("Missing BREVO_API_KEY secret")
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: { accept: "application/json", "api-key": key, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data: unknown = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { ok: res.ok, status: res.status, data }
}

// --- Resend (alternativa a Brevo) ---
// Se il secret RESEND_API_KEY è impostato si usa Resend, altrimenti Brevo.
// Senza dominio verificato su Resend il mittente è onboarding@resend.dev e si può
// scrivere solo all'email del proprietario dell'account Resend (va bene per i test).
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || ""
const PROVIDER = RESEND_KEY ? "resend" : "brevo"
const RESEND_FROM = Deno.env.get("RESEND_FROM") || `${SENDER.name} <onboarding@resend.dev>`

async function resend(path: string, method: string, body?: unknown) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data: unknown = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { ok: res.ok, status: res.status, data }
}

// Invia la stessa email a ciascun destinatario separatamente.
async function sendToEach(emails: string[], subject: string, html: string) {
  let sent = 0
  if (PROVIDER === "resend") {
    for (let i = 0; i < emails.length; i += 100) {
      const chunk = emails.slice(i, i + 100)
      const r = await resend("/emails/batch", "POST",
        chunk.map((e) => ({ from: RESEND_FROM, to: [e], subject, html })))
      if (!r.ok) return { ok: false, sent, error: r.data }
      sent += chunk.length
    }
  } else {
    for (let i = 0; i < emails.length; i += 900) {
      const chunk = emails.slice(i, i + 900)
      const r = await brevo("/smtp/email", "POST", {
        sender: SENDER, subject, htmlContent: html,
        messageVersions: chunk.map((e) => ({ to: [{ email: e }] })),
      })
      if (!r.ok) return { ok: false, sent, error: r.data }
      sent += chunk.length
    }
  }
  return { ok: true, sent }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405)

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  )

  try {
    const payload = await req.json().catch(() => ({}))
    const action = payload?.action

    // --- Verifica configurazione (non invia email) ---
    if (action === "health") {
      if (PROVIDER === "resend") {
        const r = await resend("/domains", "GET")
        // Le chiavi "solo invio" rispondono 401 "restricted": la chiave è comunque valida
        const restricted = JSON.stringify(r.data ?? "").includes("restricted")
        return json({ provider: "resend", keyValid: r.ok || restricted, from: RESEND_FROM })
      }
      const acc = await brevo("/account", "GET")
      const snd = await brevo("/senders", "GET")
      const senders = (snd.data as { senders?: { email: string; active: boolean }[] })?.senders ?? []
      const s = senders.find((x) => x.email?.toLowerCase() === SENDER.email)
      return json({
        provider: "brevo",
        brevoKeyValid: acc.ok,
        senderFound: !!s,
        senderActive: !!s?.active,
      })
    }

    // --- Iscrizione: contatto Brevo + email di benvenuto ---
    if (action === "subscribe") {
      const email = String(payload?.email ?? "").trim().toLowerCase()
      if (!isEmail(email)) return json({ error: "Email non valida" }, 400)

      // Si invia solo a chi è davvero nella lista iscritti (evita usi impropri)
      const { data: sub, error } = await admin
        .from("subscribers").select("email").ilike("email", email).maybeSingle()
      if (error) throw error
      if (!sub) return json({ error: "Email non iscritta" }, 404)

      if (PROVIDER === "brevo") {
        await brevo("/contacts", "POST", { email, updateEnabled: true }).catch(() => null)
      }
      const r = await sendToEach([email], "Benvenuto! Grazie per esserti iscritto", welcomeHtml())
      return json({ ok: r.ok, provider: PROVIDER, error: r.ok ? undefined : r.error }, r.ok ? 200 : 502)
    }

    // --- Newsletter: solo amministratori ---
    if (action === "newsletter") {
      const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "")
      const { data: userData } = await admin.auth.getUser(token)
      const userEmail = userData?.user?.email?.toLowerCase()
      if (!userEmail) return json({ error: "Accesso richiesto" }, 401)

      const { data: isAdmin } = await admin
        .from("admins").select("email").ilike("email", userEmail).maybeSingle()
      if (!isAdmin) return json({ error: "Non autorizzato" }, 403)

      const title = String(payload?.title ?? "").slice(0, 300)
      const excerpt = String(payload?.excerpt ?? "").slice(0, 2000)
      if (!title) return json({ error: "Titolo mancante" }, 400)

      const { data: subs, error } = await admin.from("subscribers").select("email")
      if (error) throw error
      const emails = (subs ?? []).map((s) => s.email).filter(isEmail)
      if (emails.length === 0) return json({ ok: true, sent: 0 })

      const r = await sendToEach(emails, "Nuova storia pubblicata: " + title,
        newsletterHtml(title, excerpt, payload?.articleId ?? null))
      return json({ ok: r.ok, sent: r.sent, provider: PROVIDER, error: r.ok ? undefined : r.error }, r.ok ? 200 : 502)
    }

    return json({ error: "Azione non valida" }, 400)
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
