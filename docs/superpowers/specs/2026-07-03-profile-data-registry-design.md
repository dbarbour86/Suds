# Profile Data Registry Design

## Goal

Refactor the profile page so every profile-specific value comes from one typed object in `data/profiles.ts`, while preserving the current layout and making future profile additions available at `suds.to/username`.

## Data Architecture

Export a typed `profiles` registry keyed by username. The first entry is `profiles.tyrees`. Export reusable TypeScript types for profile records and nested arrays so invalid or incomplete profile entries fail type checking.

The Tyrees record contains these top-level fields:

- `username`
- `businessName`
- `logoUrl`
- `heroImageUrl`
- `about`
- `phone`
- `textNumber`
- `bookingUrl`
- `location`
- `stats`
- `services`
- `galleryImages`
- `socials`
- `reviewUrl`

`about` groups the short hero tagline, service label, and longer about heading/body so those business-specific strings remain in the single profile object. `stats`, `services`, `galleryImages`, and `socials` are typed arrays. Stats and socials use string icon identifiers that the page resolves through a local icon map; React components do not live in the data file.

## Routing And Page Rendering

Replace the fixed internal route with `app/[username]/page.tsx`. Next.js maps this folder to a single root-level path segment, so the public URL remains `suds.to/tyrees`; the brackets and internal folders never appear in the URL. Future entries such as `profiles.jessica` automatically render at `suds.to/jessica` without subdomains or extra path segments.

The route reads `params.username`, resolves `profiles[username]`, and returns Next.js `notFound()` for unknown usernames. It statically generates known profile paths from the registry. Business name, username, images, about content, location, stats, services, gallery, socials, copyright text, and all link destinations render from the resolved object.

Generic interface labels such as `Call`, `Text`, `Book Now`, `More`, `Services & pricing`, `Gallery`, `Connect`, and `Built with` remain in the page because they describe the Suds.to interface rather than one client.

## Live Links

- Call uses `tel:` with `profile.phone`.
- Text uses `sms:` with `profile.textNumber`.
- Book Now uses `profile.bookingUrl`.
- Social controls use each social entry's URL.
- Review CTA uses `profile.reviewUrl`.
- External destinations open in a new tab with safe `rel` attributes.
- More remains a static control because no matching profile-data field was requested.

The initial values may be plausible placeholders but must be valid destinations and must originate only from the profile object.

## Testing

Add a direct data-contract test that verifies the Tyrees record contains all required fields and valid typed collections. Update the page-rendering test to confirm representative profile values appear and that phone, SMS, booking, social, and review destinations match the registry data. Verify the route resolves `tyrees`, generates the known username path, and rejects unknown usernames. Run the complete test suite and production build after the refactor.

## Scope Boundaries

- Keep profiles at one root-level username segment; do not introduce subdomains or paths such as `/profiles/tyrees`.
- Do not add a database, CMS, API, admin editor, or profile lookup layer.
- Do not change the visual design except where anchors need the same styling as existing buttons.
- Do not add additional client profiles in this refactor.
