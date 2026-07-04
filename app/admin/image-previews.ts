export interface ImagePreviewState {
  logoUrl: string | null;
  heroUrl: string | null;
  galleryUrls: string[];
}

export type SinglePreviewKey = "logoUrl" | "heroUrl";
export type CreateObjectUrl = (file: File) => string;
export type RevokeObjectUrl = (url: string) => void;

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function emptyImagePreviewState(): ImagePreviewState {
  return { logoUrl: null, heroUrl: null, galleryUrls: [] };
}

export function isAcceptedImageFile(file: File) {
  return acceptedImageTypes.has(file.type);
}

export function replaceSinglePreview(
  state: ImagePreviewState,
  key: SinglePreviewKey,
  file: File,
  createUrl: CreateObjectUrl,
  revokeUrl: RevokeObjectUrl,
): ImagePreviewState {
  const previousUrl = state[key];
  if (previousUrl) revokeUrl(previousUrl);
  return { ...state, [key]: createUrl(file) };
}

export function replaceGalleryPreviews(
  state: ImagePreviewState,
  files: readonly File[],
  createUrl: CreateObjectUrl,
  revokeUrl: RevokeObjectUrl,
): ImagePreviewState {
  state.galleryUrls.forEach((url) => revokeUrl(url));
  return { ...state, galleryUrls: files.map((file) => createUrl(file)) };
}

export function removeSinglePreview(
  state: ImagePreviewState,
  key: SinglePreviewKey,
  revokeUrl: RevokeObjectUrl,
): ImagePreviewState {
  const previousUrl = state[key];
  if (previousUrl) revokeUrl(previousUrl);
  return { ...state, [key]: null };
}

export function removeGalleryPreview(
  state: ImagePreviewState,
  index: number,
  revokeUrl: RevokeObjectUrl,
): ImagePreviewState {
  const url = state.galleryUrls[index];
  if (url) revokeUrl(url);
  return { ...state, galleryUrls: state.galleryUrls.filter((_, itemIndex) => itemIndex !== index) };
}

export function revokePreviewState(state: ImagePreviewState, revokeUrl: RevokeObjectUrl) {
  if (state.logoUrl) revokeUrl(state.logoUrl);
  if (state.heroUrl) revokeUrl(state.heroUrl);
  state.galleryUrls.forEach((url) => revokeUrl(url));
}
