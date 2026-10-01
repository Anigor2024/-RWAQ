/**
 * Resolves a configured public origin from APP_URL.
 * - Valid public HTTP(S) APP_URL => normalized origin (without trailing slash)
 * - Missing APP_URL, MY_APP_URL placeholder, or localhost/loopback => null
 * Never returns a localhost fallback for published structured data.
 */
export function getConfiguredPublicOrigin(): string | null {
  const rawUrl = process.env.APP_URL?.trim();
  if (!rawUrl || rawUrl === 'MY_APP_URL') {
    return null;
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1'
    ) {
      return null;
    }

    return parsed.origin.replace(/\/+$/, '');
  } catch {
    return null;
  }
}

/**
 * Checks whether a candidate URL is already an absolute public HTTP(S) URL
 * (excluding localhost / loopback addresses).
 */
export function isAbsolutePublicHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return (
      host !== 'localhost' &&
      host !== '127.0.0.1' &&
      host !== '0.0.0.0' &&
      host !== '::1'
    );
  } catch {
    return false;
  }
}
