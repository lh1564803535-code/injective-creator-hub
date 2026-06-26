/**
 * URL utilities
 */

export function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getPathname(): string {
  if (typeof window !== "undefined") return window.location.pathname;
  return "/";
}

export function getSearchParams(): URLSearchParams {
  if (typeof window !== "undefined") return new URLSearchParams(window.location.search);
  return new URLSearchParams();
}

export function getSearchParam(key: string): string | null {
  return getSearchParams().get(key);
}

export function setSearchParam(key: string, value: string): string {
  const params = getSearchParams();
  params.set(key, value);
  return `${getPathname()}?${params.toString()}`;
}

export function removeSearchParam(key: string): string {
  const params = getSearchParams();
  params.delete(key);
  const search = params.toString();
  return search ? `${getPathname()}?${search}` : getPathname();
}

export function buildUrl(
  base: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return base;

  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function parseUrl(url: string): {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
} | null {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
    };
  } catch {
    return null;
  }
}

export function isExternalUrl(url: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const parsed = new URL(url);
    return parsed.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function addTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

export function removeTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      if (index === 0) return removeTrailingSlash(path);
      if (index === paths.length - 1) return removeLeadingSlash(path);
      return removeLeadingSlash(removeTrailingSlash(path));
    })
    .join("/");
}

export function removeLeadingSlash(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path;
}

export function addLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
