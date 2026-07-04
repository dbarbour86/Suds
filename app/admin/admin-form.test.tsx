import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { profiles } from "../../data/profiles";
import { AdminForm } from "./admin-form";

describe("AdminForm", () => {
  it("renders the complete Tyrees editing workflow", () => {
    const html = renderToStaticMarkup(createElement(AdminForm, { defaultProfile: profiles.tyrees }));

    for (const content of [
      "Edit Tyrees",
      "Business basics",
      "About",
      "Images",
      "Logo image",
      "Hero image",
      "Gallery images",
      "Remove logo preview",
      "Remove hero preview",
      "Services",
      "Stats",
      "Social links",
      "Save changes",
      "Reset to defaults",
      "View profile",
      "Add service",
      "Add stat",
      "Add social link",
      'role="status"',
    ]) {
      expect(html).toContain(content);
    }
  });
});
