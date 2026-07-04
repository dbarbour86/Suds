import { describe, expect, it } from "vitest";
import { profiles } from "./profiles";

describe("profiles registry", () => {
  it("contains a complete, link-ready Tyrees profile", () => {
    const profile = profiles.tyrees;

    expect(Object.keys(profile).sort()).toEqual([
      "about",
      "bookingUrl",
      "businessName",
      "galleryImages",
      "heroImageUrl",
      "location",
      "logoUrl",
      "phone",
      "reviewUrl",
      "services",
      "socials",
      "stats",
      "textNumber",
      "username",
    ]);
    expect(profile.username).toBe("tyrees");
    expect(profile.stats.length).toBeGreaterThan(0);
    expect(profile.services.length).toBeGreaterThan(0);
    expect(profile.galleryImages.length).toBeGreaterThan(0);
    expect(profile.socials.length).toBeGreaterThan(0);
    expect(`tel:${profile.phone}`).toMatch(/^tel:\+\d+$/);
    expect(`sms:${profile.textNumber}`).toMatch(/^sms:\+\d+$/);
    expect(profile.bookingUrl).toMatch(/^https:\/\//);
    expect(profile.reviewUrl).toMatch(/^https:\/\//);
    for (const social of profile.socials) {
      expect(social.url).toMatch(/^https:\/\//);
    }
  });
});
