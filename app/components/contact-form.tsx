"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const COOLDOWN_SECONDS = 30;
  const [cooldown, setCooldown] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    else if (form.message.length > 1000)
      newErrors.message = "Message is too long.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (cooldown > 0) return;
    // If Turnstile is configured, require a token
    if (TURNSTILE_SITEKEY) {
      if (!turnstileToken) {
        setCaptchaError("Please complete the captcha to prove you're human.");
        return;
      }
      setCaptchaError(null);
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSending(true);
    try {
      const bodyPayload: any = { ...form };
      if (TURNSTILE_SITEKEY && turnstileToken)
        bodyPayload["cf-turnstile-response"] = turnstileToken;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out.",
          duration: 5000,
          className: "bg-green-900 text-white border-green-700",
        });
        setForm({ name: "", email: "", message: "" });
        // start cooldown and persist timestamp
        try {
          localStorage.setItem("contact_last_sent", String(Date.now()));
        } catch {}
        setCooldown(COOLDOWN_SECONDS);
        // start countdown
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
          setCooldown((c) => {
            if (c <= 1) {
              if (intervalRef.current)
                window.clearInterval(intervalRef.current);
              intervalRef.current = null;
              try {
                localStorage.removeItem("contact_last_sent");
              } catch {}
              // reset turnstile after cooldown finishes
              if (widgetIdRef.current && (window as any).turnstile?.reset) {
                try {
                  (window as any).turnstile.reset(widgetIdRef.current);
                } catch {}
                setTurnstileToken(null);
              }
              return 0;
            }
            return c - 1;
          });
        }, 1000);
        // reset widget immediately after successful send
        if (widgetIdRef.current && (window as any).turnstile?.reset) {
          try {
            (window as any).turnstile.reset(widgetIdRef.current);
          } catch {}
          setTurnstileToken(null);
        }
      }
      // Optionally handle error UI here
    } catch {
      // Optionally handle error UI here
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    // initialize cooldown from localStorage
    try {
      const ts = localStorage.getItem("contact_last_sent");
      if (ts) {
        const elapsed = Math.floor((Date.now() - Number(ts)) / 1000);
        if (elapsed < COOLDOWN_SECONDS) {
          setCooldown(COOLDOWN_SECONDS - elapsed);
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(() => {
            setCooldown((c) => {
              if (c <= 1) {
                if (intervalRef.current)
                  window.clearInterval(intervalRef.current);
                intervalRef.current = null;
                try {
                  localStorage.removeItem("contact_last_sent");
                } catch {}
                return 0;
              }
              return c - 1;
            });
          }, 1000);
        }
      }
    } catch {}

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  // Load and render Cloudflare Turnstile widget if sitekey is provided
  useEffect(() => {
    if (!TURNSTILE_SITEKEY) return;
    const renderWidget = () => {
      try {
        const t = (window as any).turnstile;
        if (!t || !widgetContainerRef.current) return;
        // render returns widget id
        widgetIdRef.current = t.render(widgetContainerRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (token: string) => setTurnstileToken(token),
          theme: "dark",
        });
      } catch (e) {}
    };

    if ((window as any).turnstile) {
      renderWidget();
      return;
    }

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = renderWidget;
    document.head.appendChild(s);

    return () => {
      // don't remove the script; leave it for other pages/components
    };
  }, [TURNSTILE_SITEKEY]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 rounded-xl shadow-2xl "
    >
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          rows={5}
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
        {TURNSTILE_SITEKEY && (
          <div className="mt-3">
            <div ref={widgetContainerRef} />
            {captchaError && (
              <p className="text-red-500 text-xs mt-1">{captchaError}</p>
            )}
          </div>
        )}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform ${
            sending || cooldown > 0 || (!!TURNSTILE_SITEKEY && !turnstileToken)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700 hover:translate-y-[-2px]"
          }`}
          disabled={
            sending || cooldown > 0 || (!!TURNSTILE_SITEKEY && !turnstileToken)
          }
        >
          {sending
            ? "Sending..."
            : cooldown > 0
            ? `Wait ${cooldown}s`
            : TURNSTILE_SITEKEY && !turnstileToken
            ? "Complete captcha"
            : "Send Message"}
        </button>
        {cooldown > 0 && (
          <p className="text-center text-sm text-blue-500 mt-2">
            Please wait {cooldown}s before sending another message.
          </p>
        )}
      </div>
      {/* No toast notifications. */}
    </form>
  );
}
