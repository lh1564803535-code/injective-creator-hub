/**
 * API utilities
 */

import { AppError, NetworkError } from "./error-handling";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, timeout = 10000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData.message || `HTTP ${response.status}`,
        "API_ERROR",
        response.status
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new NetworkError("Request timeout");
    }

    throw new NetworkError("Network request failed");
  }
}

export async function apiGet<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "GET" });
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  return apiRequest<T>(url, { method: "POST", body });
}

export async function apiPut<T>(url: string, body: unknown): Promise<T> {
  return apiRequest<T>(url, { method: "PUT", body });
}

export async function apiDelete<T>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "DELETE" });
}
