import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { profileStorageKey } from "../../data/profile-storage";
import { profiles } from "../../data/profiles";
import { ProfileView } from "./profile-view";

describe("ProfileView", () => {
  it("server-renders typed defaults and identifies its storage key", () => {
    const profile = profiles.tyrees;
    const html = renderToStaticMarkup(createElement(ProfileView, { defaultProfile: profile }));

    expect(html).toContain(profile.businessName);
    expect(html).toContain(profile.about.heroBlurb);
    expect(html).toContain(`data-profile-storage-key="${profileStorageKey(profile.username)}"`);
  });
});
