"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h3 className="mb-2 text-xl font-bold text-white">You're In!</h3>
        <p className="text-sm text-gray-400">
          We'll notify you about new campaigns, features, and updates.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
          <Mail className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
          <p className="text-sm text-gray-500">Get notified about new campaigns and features</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-500/30"
          required
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Subscribe
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-600">
        No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  );
}
