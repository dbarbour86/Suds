import { describe, expect, it } from "vitest";
import { profiles, type ProfileService } from "../../data/profiles";
import {
  appendListItem,
  cloneProfile,
  removeListItem,
  validateProfile,
} from "./profile-form";

describe("profile form helpers", () => {
  it("clones the full profile including currently hidden image fields", () => {
    const clone = cloneProfile(profiles.tyrees);

    expect(clone).toEqual(profiles.tyrees);
    expect(clone).not.toBe(profiles.tyrees);
    expect(clone.about).not.toBe(profiles.tyrees.about);
    expect(clone.galleryImages).not.toBe(profiles.tyrees.galleryImages);
    expect(clone.logoUrl).toBe(profiles.tyrees.logoUrl);
    expect(clone.heroImageUrl).toBe(profiles.tyrees.heroImageUrl);
  });

  it("accepts the typed default profile", () => {
    expect(validateProfile(profiles.tyrees)).toEqual({});
  });

  it("returns field-specific errors for invalid basics and repeated rows", () => {
    const invalid = cloneProfile(profiles.tyrees);
    invalid.businessName = "";
    invalid.phone = "abc";
    invalid.bookingUrl = "ftp://example.com";
    invalid.about.body = "";
    invalid.services[0].title = "";
    invalid.stats[0].value = "";
    invalid.socials[0].url = "not-a-url";

    expect(validateProfile(invalid)).toMatchObject({
      businessName: "Business name is required.",
      phone: "Enter a valid phone number.",
      bookingUrl: "Enter a valid http or https URL.",
      "about.body": "About body is required.",
      "services.0.title": "Service title is required.",
      "stats.0.value": "Stat value is required.",
      "socials.0.url": "Enter a valid http or https URL.",
    });
  });

  it("adds rows immutably and keeps at least one row when removing", () => {
    const service: ProfileService = { title: "New", description: "Description", price: "$1", imageUrl: "/image.png" };
    const added = appendListItem(profiles.tyrees.services, service);
    const removed = removeListItem(added, 0);
    const protectedSingle = removeListItem([service], 0);

    expect(added).toHaveLength(profiles.tyrees.services.length + 1);
    expect(added).not.toBe(profiles.tyrees.services);
    expect(removed).toHaveLength(added.length - 1);
    expect(protectedSingle).toEqual([service]);
  });
});
