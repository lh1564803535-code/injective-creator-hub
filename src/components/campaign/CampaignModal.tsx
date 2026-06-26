"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { AlertTriangle } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  requirements: string;
}

interface CampaignModalProps {
  /** Create Campaign Modal */
  create?: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Campaign, "id">) => void;
    loading?: boolean;
  };
  /** Edit Campaign Modal */
  edit?: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Campaign) => void;
    campaign: Campaign;
    loading?: boolean;
  };
  /** Delete Confirmation Modal */
  delete?: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    campaignTitle: string;
    loading?: boolean;
  };
}

/* ------------------------------------------------------------------ */
/*  Create Campaign Modal                                              */
/* ------------------------------------------------------------------ */

function CreateCampaignBody({
  onSubmit,
  loading,
  onClose,
}: {
  onSubmit: (data: Omit<Campaign, "id">) => void;
  loading?: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Campaign title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.budget.trim()) e.budget = "Budget is required";
    if (!form.deadline.trim()) e.deadline = "Deadline is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Create Campaign"
      description="Launch a new content campaign for creators"
      size="lg"
      actions={[
        { label: "Cancel", onClick: onClose, variant: "ghost" },
        {
          label: "Create Campaign",
          onClick: handleSubmit,
          variant: "primary",
          loading,
        },
      ]}
    >
      <div className="space-y-4">
        <Input
          label="Campaign Title"
          placeholder="e.g. Summer DeFi Content Challenge"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={errors.title}
        />
        <Textarea
          label="Description"
          placeholder="Describe your campaign goals and what content you're looking for..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          error={errors.description}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Budget (INJ)"
            placeholder="e.g. 1000"
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            error={errors.budget}
          />
          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            error={errors.deadline}
          />
        </div>
        <Textarea
          label="Requirements"
          placeholder="List any specific requirements for submissions..."
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
        />
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit Campaign Modal                                                */
/* ------------------------------------------------------------------ */

function EditCampaignBody({
  campaign,
  onSubmit,
  loading,
  onClose,
}: {
  campaign: Campaign;
  onSubmit: (data: Campaign) => void;
  loading?: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState(campaign);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Campaign title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.budget.trim()) e.budget = "Budget is required";
    if (!form.deadline.trim()) e.deadline = "Deadline is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit Campaign"
      description={`Editing "${campaign.title}"`}
      size="lg"
      actions={[
        { label: "Cancel", onClick: onClose, variant: "ghost" },
        {
          label: "Save Changes",
          onClick: handleSubmit,
          variant: "primary",
          loading,
        },
      ]}
    >
      <div className="space-y-4">
        <Input
          label="Campaign Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={errors.title}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          error={errors.description}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Budget (INJ)"
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            error={errors.budget}
          />
          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            error={errors.deadline}
          />
        </div>
        <Textarea
          label="Requirements"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
        />
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation Modal                                          */
/* ------------------------------------------------------------------ */

function DeleteCampaignBody({
  campaignTitle,
  onConfirm,
  loading,
  onClose,
}: {
  campaignTitle: string;
  onConfirm: () => void;
  loading?: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Delete Campaign"
      size="sm"
      actions={[
        { label: "Cancel", onClick: onClose, variant: "ghost" },
        {
          label: "Delete Campaign",
          onClick: onConfirm,
          variant: "danger",
          loading,
        },
      ]}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="text-sm text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-medium text-white">{campaignTitle}</span>?
          </p>
          <p className="mt-1 text-xs text-gray-500">
            This action cannot be undone. All associated submissions and rewards
            will be permanently removed.
          </p>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Wrapper                                                   */
/* ------------------------------------------------------------------ */

export function CampaignModal({ create, edit, delete: del }: CampaignModalProps) {
  return (
    <>
      {create && (
        <CreateCampaignBody
          onSubmit={create.onSubmit}
          loading={create.loading}
          onClose={create.onClose}
        />
      )}
      {edit && (
        <EditCampaignBody
          campaign={edit.campaign}
          onSubmit={edit.onSubmit}
          loading={edit.loading}
          onClose={edit.onClose}
        />
      )}
      {del && (
        <DeleteCampaignBody
          campaignTitle={del.campaignTitle}
          onConfirm={del.onConfirm}
          loading={del.loading}
          onClose={del.onClose}
        />
      )}
    </>
  );
}
