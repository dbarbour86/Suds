import type {
  Profile,
  ProfileAbout,
  ProfileGalleryImage,
  ProfileService,
  ProfileSocial,
  ProfileStat,
  SocialIconName,
  StatIconName,
} from "./profiles";

export const PROFILE_STORAGE_VERSION = 1;
export const PROFILE_STORAGE_EVENT = "suds:profile-storage";

const statIcons = new Set<StatIconName>(["car", "star", "shield", "clock"]);
const socialIcons = new Set<SocialIconName>(["instagram", "facebook", "tiktok", "google"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isAbout(value: unknown): value is ProfileAbout {
  return isRecord(value)
    && isString(value.heroEyebrow)
    && isString(value.serviceLabel)
    && isString(value.heroBlurb)
    && isString(value.heading)
    && isString(value.body);
}

function isStat(value: unknown): value is ProfileStat {
  return isRecord(value)
    && isString(value.value)
    && isString(value.label)
    && isString(value.icon)
    && statIcons.has(value.icon as StatIconName);
}

function isService(value: unknown): value is ProfileService {
  return isRecord(value)
    && isString(value.title)
    && isString(value.description)
    && isString(value.price)
    && isString(value.imageUrl);
}

function isGalleryImage(value: unknown): value is ProfileGalleryImage {
  return isRecord(value) && isString(value.url) && isString(value.alt);
}

function isSocial(value: unknown): value is ProfileSocial {
  return isRecord(value)
    && isString(value.label)
    && isString(value.url)
    && isString(value.icon)
    && socialIcons.has(value.icon as SocialIconName);
}

export function isProfile(value: unknown): value is Profile {
  return isRecord(value)
    && isString(value.username)
    && isString(value.businessName)
    && isString(value.logoUrl)
    && isString(value.heroImageUrl)
    && isAbout(value.about)
    && isString(value.phone)
    && isString(value.textNumber)
    && isString(value.bookingUrl)
    && isString(value.location)
    && Array.isArray(value.stats)
    && value.stats.length > 0
    && value.stats.every(isStat)
    && Array.isArray(value.services)
    && value.services.length > 0
    && value.services.every(isService)
    && Array.isArray(value.galleryImages)
    && value.galleryImages.length > 0
    && value.galleryImages.every(isGalleryImage)
    && Array.isArray(value.socials)
    && value.socials.length > 0
    && value.socials.every(isSocial)
    && isString(value.reviewUrl);
}

export function profileStorageKey(username: string) {
  return `suds.profile.${username}`;
}

export function readStoredProfile(storage: Storage, defaultProfile: Profile): Profile {
  try {
    const raw = storage.getItem(profileStorageKey(defaultProfile.username));
    if (!raw) return defaultProfile;

    const envelope: unknown = JSON.parse(raw);
    if (!isRecord(envelope)
      || envelope.version !== PROFILE_STORAGE_VERSION
      || !isProfile(envelope.profile)
      || envelope.profile.username !== defaultProfile.username) {
      return defaultProfile;
    }

    return envelope.profile;
  } catch {
    return defaultProfile;
  }
}

export function saveStoredProfile(storage: Storage, profile: Profile) {
  storage.setItem(profileStorageKey(profile.username), JSON.stringify({
    version: PROFILE_STORAGE_VERSION,
    profile,
  }));
}

export function resetStoredProfile(storage: Storage, username: string) {
  storage.removeItem(profileStorageKey(username));
}
