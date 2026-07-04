import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./page.module.css", import.meta.url), "utf8");

describe("profile CSS module", () => {
  it("scopes reduced-motion selectors to the local page shell", () => {
    expect(css).not.toContain("\n  *, *::before, *::after");
    expect(css).toContain(".shell, .shell *");
  });

  it("styles live action and social anchors like controls", () => {
    expect(css).toContain("text-decoration: none");
    expect(css).toContain(".socials a");
    expect(css).toContain(".review:focus-visible");
  });
});
