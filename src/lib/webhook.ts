/**
 * Webhook utilities
 */

interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
}

interface WebhookPayload {
  event: string;
  data: unknown;
  timestamp: number;
  signature?: string;
}

class WebhookManager {
  private webhooks: Map<string, WebhookConfig> = new Map();

  register(id: string, config: WebhookConfig): void {
    this.webhooks.set(id, config);
  }

  unregister(id: string): void {
    this.webhooks.delete(id);
  }

  async notify(event: string, data: unknown): Promise<void> {
    const payload: WebhookPayload = {
      event,
      data,
      timestamp: Date.now(),
    };

    const promises = Array.from(this.webhooks.entries())
      .filter(([, config]) => config.active && config.events.includes(event))
      .map(([id, config]) => this.send(id, config, payload));

    await Promise.allSettled(promises);
  }

  private async send(id: string, config: WebhookConfig, payload: WebhookPayload): Promise<void> {
    try {
      const body = JSON.stringify(payload);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Webhook-ID": id,
      };

      if (config.secret) {
        const signature = await this.sign(body, config.secret);
        headers["X-Webhook-Signature"] = signature;
      }

      const response = await fetch(config.url, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        console.error(`Webhook ${id} failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`Webhook ${id} error:`, error);
    }
  }

  private async sign(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  getWebhook(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id);
  }

  getAll(): WebhookConfig[] {
    return Array.from(this.webhooks.values());
  }

  getActive(): WebhookConfig[] {
    return this.getAll().filter((c) => c.active);
  }

  clear(): void {
    this.webhooks.clear();
  }
}

export function createWebhookManager(): WebhookManager {
  return new WebhookManager();
}

export function createWebhookPayload(event: string, data: unknown): WebhookPayload {
  return {
    event,
    data,
    timestamp: Date.now(),
  };
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBuffer = Uint8Array.from(signature.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  return crypto.subtle.verify("HMAC", key, sigBuffer, encoder.encode(payload));
}
