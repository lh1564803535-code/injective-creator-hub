"use client";

import { useState } from "react";
import { Send, Eye, ExternalLink, Check, AlertCircle } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  reward: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "1", title: "Injective Summer Art Contest", reward: "500 USDC" },
  { id: "2", title: "DeFi Explainer Video Challenge", reward: "1,000 USDC" },
  { id: "3", title: "Community Meme Campaign", reward: "200 USDC" },
  { id: "4", title: "Developer Tutorial Series", reward: "2,000 USDC" },
];

interface FormData {
  campaignId: string;
  title: string;
  description: string;
  contentUrl: string;
}

interface FormErrors {
  campaignId?: string;
  title?: string;
  description?: string;
  contentUrl?: string;
}

export function SubmissionForm() {
  const [form, setForm] = useState<FormData>({
    campaignId: "",
    title: "",
    description: "",
    contentUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.campaignId) newErrors.campaignId = "Please select a campaign";
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (form.title.length > 100) newErrors.title = "Title must be under 100 characters";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.description.length > 500) newErrors.description = "Description must be under 500 characters";
    if (!form.contentUrl.trim()) {
      newErrors.contentUrl = "Content URL is required";
    } else if (!/^https?:\/\/.+/.test(form.contentUrl)) {
      newErrors.contentUrl = "Please enter a valid URL starting with http:// or https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Mock submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ campaignId: "", title: "", description: "", contentUrl: "" });
    setErrors({});
    setShowPreview(false);
    setSubmitted(false);
  };

  const selectedCampaign = MOCK_CAMPAIGNS.find((c) => c.id === form.campaignId);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <Check className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Submission Successful!</h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Your work has been submitted to <span className="text-cyan-400">{selectedCampaign?.title}</span>.
            You will be notified once it is reviewed.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 rounded-xl bg-white/[0.06] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.1]"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
          <Send className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Submit Your Work</h3>
          <p className="text-sm text-gray-500">Submit content to an active campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campaign Select */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Select Campaign <span className="text-red-400">*</span>
          </label>
          <select
            value={form.campaignId}
            onChange={(e) => setForm({ ...form, campaignId: e.target.value })}
            className={`w-full rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition ${
              errors.campaignId ? "border-red-500/50" : "border-white/[0.06] focus:border-cyan-500/30"
            }`}
          >
            <option value="" className="bg-[#1a1a1a]">Choose a campaign...</option>
            {MOCK_CAMPAIGNS.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                {c.title} ({c.reward})
              </option>
            ))}
          </select>
          {errors.campaignId && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" /> {errors.campaignId}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="My awesome creation"
            maxLength={100}
            className={`w-full rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 ${
              errors.title ? "border-red-500/50" : "border-white/[0.06] focus:border-cyan-500/30"
            }`}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.title ? (
              <p className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" /> {errors.title}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-600">{form.title.length}/100</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your work, inspiration, and creative process..."
            maxLength={500}
            rows={4}
            className={`w-full resize-none rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 ${
              errors.description ? "border-red-500/50" : "border-white/[0.06] focus:border-cyan-500/30"
            }`}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.description ? (
              <p className="flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="h-3 w-3" /> {errors.description}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-600">{form.description.length}/500</span>
          </div>
        </div>

        {/* Content URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Content URL <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={form.contentUrl}
            onChange={(e) => setForm({ ...form, contentUrl: e.target.value })}
            placeholder="https://your-content-link.com"
            className={`w-full rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 ${
              errors.contentUrl ? "border-red-500/50" : "border-white/[0.06] focus:border-cyan-500/30"
            }`}
          />
          {errors.contentUrl && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" /> {errors.contentUrl}
            </p>
          )}
        </div>

        {/* Preview Toggle */}
        {(form.title || form.description || form.contentUrl) && (
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        )}

        {/* Preview Panel */}
        {showPreview && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-1 text-xs text-gray-500 uppercase tracking-wider">Preview</p>
            <h4 className="text-base font-semibold text-white">{form.title || "Untitled"}</h4>
            {selectedCampaign && (
              <p className="mt-1 text-xs text-cyan-400">For: {selectedCampaign.title}</p>
            )}
            <p className="mt-2 text-sm text-gray-400">{form.description || "No description"}</p>
            {form.contentUrl && (
              <a
                href={form.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                <ExternalLink className="h-3 w-3" />
                {form.contentUrl}
              </a>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Work
            </>
          )}
        </button>
      </form>
    </div>
  );
}
