import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

// Basic in-memory rate limiter (per-IP). For production, replace with a shared store (Redis).
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max submissions per window
const ipBuckets: Map<string, Array<number>> = new Map();

async function verifyTurnstile(token?: string) {
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return false;
  try {
    const resp = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      }
    );
    const json = await resp.json();
    return json.success === true;
  } catch (e) {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    email,
    message,
    "cf-turnstile-response": turnstileToken,
  } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Verify Turnstile if configured
  if (process.env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(turnstileToken);
    if (!ok) return res.status(403).json({ error: "Bot verification failed" });
  }

  // Rate limiting by IP
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const bucket = ipBuckets.get(String(ip)) || [];
  // remove old timestamps
  const recent = bucket.filter((ts) => ts > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Too many requests" });
  }
  recent.push(now);
  ipBuckets.set(String(ip), recent);

  // Configure your SMTP transport here
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    secure: false, // Use STARTTLS
    requireTLS: true,
  });

  try {
    await transporter.sendMail({
      from: `Contact Form <${process.env.SMTP_USER}>`,
      to: "hello@itsmichal.dev",
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send email" });
  }
}
