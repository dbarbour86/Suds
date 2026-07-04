import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { profiles } from "../../data/profiles";
import ProfilePage, { generateStaticParams } from "./page";

describe("dynamic profile page", () => {
  it("generates a root-level path for every registered username", () => {
    expect(generateStaticParams()).toEqual([{ username: "tyrees" }]);
  });

  it("renders Tyrees content and live destinations from the registry", async () => {
    const profile = profiles.tyrees;
    const page = await ProfilePage({ params: Promise.resolve({ username: profile.username }) });
    const html = renderToStaticMarkup(page);

    for (const content of [
      profile.username,
      profile.businessName,
      profile.about.heroBlurb,
      profile.about.body,
      profile.location,
      profile.stats[0].value,
      profile.services[0].title,
      profile.galleryImages[0].alt,
    ]) {
      const escapedContent = content.replaceAll("&", "&amp;").replaceAll("'", "&#x27;");
      expect(html).toContain(escapedContent);
    }

    expect(html).toContain(`href="tel:${profile.phone}"`);
    expect(html).toContain(`href="sms:${profile.textNumber}"`);
    expect(html).toContain(`href="${profile.bookingUrl}"`);
    expect(html).toContain(`href="${profile.socials[0].url}"`);
    expect(html).toContain(`href="${profile.reviewUrl}"`);
  });
});
