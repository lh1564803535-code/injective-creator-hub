/**
 * Share utilities
 */

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export async function share(data: ShareData): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch {
      return false;
    }
  }

  // Fallback: copy to clipboard
  const shareText = [data.title, data.text, data.url].filter(Boolean).join("\n");
  return copyToClipboard(shareText);
}

export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

// Share campaign
export async function shareCampaign(campaignId: string, title: string): Promise<boolean> {
  const url = `${window.location.origin}/campaign/${campaignId}`;
  return share({
    title: `Check out this campaign: ${title}`,
    text: `I found an interesting campaign on Injective Creator Hub: ${title}`,
    url,
  });
}

// Share achievement
export async function shareAchievement(achievement: string): Promise<boolean> {
  return share({
    title: "Achievement Unlocked!",
    text: `I just unlocked "${achievement}" on Injective Creator Hub!`,
    url: window.location.origin,
  });
}

// Share referral link
export async function shareReferral(referralCode: string): Promise<boolean> {
  const url = `${window.location.origin}?ref=${referralCode}`;
  return share({
    title: "Join Injective Creator Hub",
    text: "Create content, earn USDC rewards on Injective!",
    url,
  });
}

// Copy to clipboard helper (internal)
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
