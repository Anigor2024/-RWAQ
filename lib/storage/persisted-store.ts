/**
 * Post-hydration client storage subscription helper.
 * Ensures server rendering and initial client hydration always use deterministic
 * default values, then loads and validates persisted localStorage state on the client.
 */
export function hydrateAndSubscribeStorage<T>(
  storageKey: string,
  parser: (rawValue: string | null, key: string) => T | null,
  onHydratedValue: (value: T) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = parser(raw, storageKey);
    if (parsed !== null) {
      onHydratedValue(parsed);
    }
  } catch {
    // Ignore storage read errors in restricted contexts
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    try {
      const parsed = parser(event.newValue, storageKey);
      if (parsed !== null) {
        onHydratedValue(parsed);
      }
    } catch {
      // Ignore storage event errors
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}
