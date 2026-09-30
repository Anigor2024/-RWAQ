import { getDownloadURL, ref } from 'firebase/storage';
import { getFirebaseStorage, isFirebaseConfigured } from './client';

/**
 * Resolves a media storage path or returns the static asset path when in Portfolio Demo Mode.
 */
export async function resolveStorageAssetUrl(
  pathOrUrl: string
): Promise<string> {
  if (
    pathOrUrl.startsWith('/') ||
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://')
  ) {
    return pathOrUrl;
  }

  if (!isFirebaseConfigured()) {
    return pathOrUrl;
  }

  const storage = getFirebaseStorage();
  if (!storage) {
    return pathOrUrl;
  }

  try {
    const storageRef = ref(storage, pathOrUrl);
    return await getDownloadURL(storageRef);
  } catch {
    return pathOrUrl;
  }
}
