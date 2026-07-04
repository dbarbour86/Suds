import { describe, expect, it, vi } from "vitest";
import {
  emptyImagePreviewState,
  isAcceptedImageFile,
  removeGalleryPreview,
  removeSinglePreview,
  replaceGalleryPreviews,
  replaceSinglePreview,
  revokePreviewState,
} from "./image-previews";

const file = (name: string, type: string) => ({ name, type } as File);

describe("image preview helpers", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s files", (type) => {
    expect(isAcceptedImageFile(file("photo", type))).toBe(true);
  });

  it("rejects unsupported file types", () => {
    expect(isAcceptedImageFile(file("vector.svg", "image/svg+xml"))).toBe(false);
    expect(isAcceptedImageFile(file("notes.txt", "text/plain"))).toBe(false);
  });

  it("replaces and revokes a single preview", () => {
    const createUrl = vi.fn(() => "blob:new-logo");
    const revokeUrl = vi.fn();
    const current = { ...emptyImagePreviewState(), logoUrl: "blob:old-logo" };

    const next = replaceSinglePreview(current, "logoUrl", file("logo.png", "image/png"), createUrl, revokeUrl);

    expect(next.logoUrl).toBe("blob:new-logo");
    expect(revokeUrl).toHaveBeenCalledWith("blob:old-logo");
  });

  it("replaces a gallery set and revokes every previous URL", () => {
    const createUrl = vi.fn()
      .mockReturnValueOnce("blob:one")
      .mockReturnValueOnce("blob:two");
    const revokeUrl = vi.fn();
    const current = { ...emptyImagePreviewState(), galleryUrls: ["blob:old-one", "blob:old-two"] };

    const next = replaceGalleryPreviews(current, [file("one.jpg", "image/jpeg"), file("two.webp", "image/webp")], createUrl, revokeUrl);

    expect(next.galleryUrls).toEqual(["blob:one", "blob:two"]);
    expect(revokeUrl.mock.calls.flat()).toEqual(["blob:old-one", "blob:old-two"]);
  });

  it("removes individual previews and revokes all previews on cleanup", () => {
    const revokeUrl = vi.fn();
    const current = { logoUrl: "blob:logo", heroUrl: "blob:hero", galleryUrls: ["blob:a", "blob:b"] };
    const withoutLogo = removeSinglePreview(current, "logoUrl", revokeUrl);
    const withoutGalleryItem = removeGalleryPreview(withoutLogo, 0, revokeUrl);

    revokePreviewState(withoutGalleryItem, revokeUrl);

    expect(withoutLogo.logoUrl).toBeNull();
    expect(withoutGalleryItem.galleryUrls).toEqual(["blob:b"]);
    expect(revokeUrl.mock.calls.flat()).toEqual(["blob:logo", "blob:a", "blob:hero", "blob:b"]);
  });
});
