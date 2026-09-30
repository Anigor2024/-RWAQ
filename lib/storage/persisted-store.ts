/**
 * Post-hydration client storage subscription helper.
 * Ensures server rendering and initial client hydration always use deterministic
 * default values, then loads and validates persisted localStorage state on the client.
 * When a storage event clears or invalidates a key in another tab, resets state to `defaultValue`.
 */
export function hydrateAndSubscribeStorage<T>(
  storageKey: string,
  parser: (rawValue: string | null, key: string) => T | null,
  defaultValue: T,
  onHydratedValue: (value: T) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw !== null) {
      const parsed = parser(raw, storageKey);
      onHydratedValue(parsed !== null ? parsed : defaultValue);
    }
  } catch {
    // Ignore storage read errors in restricted contexts
  }

  const handleStorage = (event: StorageEvent) => {
    // localStorage.clear() dispatches a StorageEvent with key === null
    if (event.key === null) {
      onHydratedValue(defaultValue);
      return;
    }

    if (event.key !== storageKey) return;

    // Key was removed in another tab
    if (event.newValue === null) {
      onHydratedValue(defaultValue);
      return;
    }

    try {
      const parsed = parser(event.newValue, storageKey);
      onHydratedValue(parsed !== null ? parsed : defaultValue);
    } catch {
      onHydratedValue(defaultValue);
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}
