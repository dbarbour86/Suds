# Suds.to Tyrees Profile Design

## Goal

Create a polished, mobile-first Next.js profile page at `/tyrees` for Tyrees Mobile Detailing. The page should closely follow the supplied ChatGPT-generated reference: a premium link-in-bio profile with a black, white, and electric-blue visual system.

## Scope

- One public route: `/tyrees`.
- Static presentation for this first version; action controls do not need live integrations.
- Regular CSS or CSS Modules only. Do not use Tailwind.
- Responsive from narrow mobile phones through desktop displays.
- Placeholder car-detailing photography and placeholder business details that can be replaced easily.

## Visual Direction

Use the reference image as the primary visual target. Preserve its major composition: white brand bar, dramatic dark automotive hero, circular brand mark overlapping the hero, white content region, blue section labels, dark service cards, compact gallery, and black footer. The desktop view should feel close to the reference while the mobile view should become a clean single-column profile rather than a compressed desktop page.

Typography should be modern, bold, and highly legible. Electric blue is the only strong accent. Surfaces use restrained shadows, thin neutral borders, and moderate corner radii. Photography should carry most of the atmosphere.

## Page Structure

1. Top bar with the `suds.to` wordmark, profile path, and share icon.
2. Hero image featuring a detailed dark vehicle.
3. Overlapping circular Tyrees logo placeholder.
4. Business identity block with name, tagline, summary, and Atlanta service area.
5. Four static action controls: Call, Text, Book Now, and More.
6. About copy and a four-item stats row.
7. Three services and pricing cards with image, description, and starting price.
8. Eight-image detailing gallery.
9. Dark connection area with social links, service area, and Google review call to action.
10. Compact legal and “Built with suds.to” footer.

## Responsive Behavior

On mobile, the top bar remains compact, the hero is vertically cropped for impact, business details sit below the overlapping logo, and action controls use a two-column grid. Stats become a two-column grid, services stack vertically, and the gallery uses two columns. On wider screens, content expands into the reference-inspired horizontal arrangements: four action controls, four stats, three services, and a four-column gallery.

## Implementation Shape

Use the Next.js App Router. Keep page content in small local data arrays for actions, stats, services, gallery items, and social links. Render repeated items through focused components or clear mapped sections. Use a standard icon package for interface and social icons; do not draw icons manually. Use accessible semantic elements, descriptive alternative text, visible focus styles, and sufficient color contrast.

## Interaction And Data

All content is local and static. Buttons may use inert button elements or placeholder anchors while retaining hover, focus, and pressed styling. No booking provider, phone number, CMS, database, authentication, or analytics is included.

## Verification

- Install dependencies and complete a production build successfully.
- Run the page locally and inspect `/tyrees` at mobile and desktop widths.
- Confirm there is no horizontal overflow, broken image layout, unreadable text, or collapsed spacing.
- Compare the rendered page against the supplied reference for hierarchy, density, color, radius, typography, and image cropping.

## Out Of Scope

- Live call, SMS, booking, sharing, social, maps, or review integrations.
- Admin editing tools or user accounts.
- Additional profile routes or a Suds.to marketing homepage.
- Custom final photography or production-ready Tyrees brand assets.
