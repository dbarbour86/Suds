import type { Profile } from "../../data/profiles";

export type ProfileErrors = Record<string, string>;

export function cloneProfile(profile: Profile): Profile {
  return {
    ...profile,
    about: { ...profile.about },
    stats: profile.stats.map((stat) => ({ ...stat })),
    services: profile.services.map((service) => ({ ...service })),
    galleryImages: profile.galleryImages.map((image) => ({ ...image })),
    socials: profile.socials.map((social) => ({ ...social })),
  };
}

export function appendListItem<T>(items: readonly T[], item: T): T[] {
  return [...items, item];
}

export function removeListItem<T>(items: readonly T[], index: number): T[] {
  return items.length <= 1 ? [...items] : items.filter((_, itemIndex) => itemIndex !== index);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^[+\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function requireValue(errors: ProfileErrors, path: string, value: string, label: string) {
  if (!value.trim()) errors[path] = `${label} is required.`;
}

export function validateProfile(profile: Profile): ProfileErrors {
  const errors: ProfileErrors = {};

  requireValue(errors, "businessName", profile.businessName, "Business name");
  requireValue(errors, "location", profile.location, "Location");
  requireValue(errors, "about.heroEyebrow", profile.about.heroEyebrow, "Hero eyebrow");
  requireValue(errors, "about.serviceLabel", profile.about.serviceLabel, "Service label");
  requireValue(errors, "about.heroBlurb", profile.about.heroBlurb, "Hero blurb");
  requireValue(errors, "about.heading", profile.about.heading, "About heading");
  requireValue(errors, "about.body", profile.about.body, "About body");

  if (!isValidPhone(profile.phone)) errors.phone = "Enter a valid phone number.";
  if (!isValidPhone(profile.textNumber)) errors.textNumber = "Enter a valid text number.";
  if (!isHttpUrl(profile.bookingUrl)) errors.bookingUrl = "Enter a valid http or https URL.";

  profile.services.forEach((service, index) => {
    requireValue(errors, `services.${index}.title`, service.title, "Service title");
    requireValue(errors, `services.${index}.description`, service.description, "Service description");
    requireValue(errors, `services.${index}.price`, service.price, "Service price");
    requireValue(errors, `services.${index}.imageUrl`, service.imageUrl, "Service image URL");
  });

  profile.stats.forEach((stat, index) => {
    requireValue(errors, `stats.${index}.value`, stat.value, "Stat value");
    requireValue(errors, `stats.${index}.label`, stat.label, "Stat label");
  });

  profile.socials.forEach((social, index) => {
    requireValue(errors, `socials.${index}.label`, social.label, "Social label");
    if (!isHttpUrl(social.url)) errors[`socials.${index}.url`] = "Enter a valid http or https URL.";
  });

  return errors;
}
