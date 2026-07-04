# Admin Image Previews Design

## Goal

Extend `/admin` with temporary browser-only upload previews for the profile logo, hero image, and gallery. Do not upload, persist, or serialize selected files.

## Interface

Add an Images card between About and Services. It contains:

- A logo picker with a circular preview.
- A hero picker with a wide landscape preview.
- A gallery picker accepting multiple files with a responsive thumbnail grid.

Existing typed assets appear initially. Selecting a valid file replaces the corresponding admin preview with a browser object URL. Gallery selection replaces the temporary gallery preview set with the selected files. Each preview area exposes clear Replace/Choose and Remove controls. Removing a temporary preview returns that area to its typed or locally saved URL-based asset.

## File Rules

Accept JPEG, PNG, and WebP images. Reject other file types with an inline message attached to the relevant picker. File inputs use native browser controls and accessible labels. There is no database, API route, server action, filesystem write, localStorage write, sessionStorage write, or data-URL conversion for uploaded files.

## Lifecycle

Keep temporary preview URLs in component state separate from the full editable `Profile`. This separation ensures the existing Save operation serializes only the typed URL-based profile and never serializes `blob:` URLs.

Create object URLs with `URL.createObjectURL`. Revoke a previous URL when it is replaced or removed, and revoke every remaining temporary URL when the admin component unmounts. Refreshing or leaving `/admin` discards all uploaded previews by design.

## Future Compatibility

Use a small `ImagePreviewState` structure with `logoUrl`, `heroUrl`, and `galleryUrls`. Keep picker callbacks isolated from profile text editing. A later persistent upload implementation can replace the object-URL creation step and then write returned permanent URLs into the already existing `logoUrl`, `heroImageUrl`, and `galleryImages` profile fields without restructuring the form.

## Testing

Add test-first coverage for accepted/rejected MIME types and object-URL cleanup helpers. Update the admin structural test to require the Images section, labeled logo/hero/gallery file inputs, preview content, and clear controls. Run the full unit suite and production build. In the in-app browser, upload representative local images, confirm all previews render, remove one, and confirm the preview returns to its default asset without changing localStorage-backed profile data.

## Scope Boundaries

- Admin preview only; `/tyrees` does not display selected temporary files.
- No image cropping, compression, reordering, captions, alt-text editing, or upload progress.
- No persistence across refreshes or navigation.
