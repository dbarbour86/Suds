# Local Profile Admin Design

## Goal

Add an unauthenticated `/admin` editor for the Tyrees profile. Changes persist locally in the browser and immediately feed the existing `/tyrees` page, while the typed registry remains the canonical default.

## User Flow

`/admin` opens with the Tyrees registry data. The user edits business basics, about content, phone and SMS numbers, booking URL, location, services, stats, and social links. Save validates and stores the edited record under `suds.profile.tyrees`, then shows a success confirmation. “View profile” opens `/tyrees` so the user can inspect the saved result. Reset removes the storage key and restores the form and public profile to registry defaults.

## Data And Storage

Create a shared typed browser-storage adapter that owns the key format, serialization, parsing, validation, save, and reset behavior. It accepts a typed default `Profile`, validates unknown stored JSON field by field, and returns the default record whenever data is absent, malformed, incomplete, or from an incompatible schema.

Store a small version envelope rather than a bare profile:

```ts
{
  version: 1,
  profile: Profile
}
```

The adapter uses `suds.profile.${username}` as its key. It never accesses `window` during server rendering.

## Public Profile Hydration

Keep `app/[username]/page.tsx` as the server route that resolves typed defaults and preserves static generation. Move its existing visual markup into a client renderer that receives the default profile as a prop. The initial render uses that prop exactly, preventing a blank or client-only page. After hydration, the renderer loads a valid local override and replaces the displayed profile. Invalid saved data is ignored without breaking the page.

Listen for the browser `storage` event so an already-open profile tab can react when another tab saves or resets the same username. A same-tab refresh also reflects the latest saved record.

## Admin Interface

Use the existing Suds.to black, white, gray, and electric-blue system. The desktop layout uses a compact sticky header and centered form column; mobile collapses naturally into one column.

Form sections:

- Business basics: business name, phone, text number, booking URL, location.
- About: hero eyebrow, service label, short hero blurb, about heading, and about body.
- Services: repeatable title, description, price, and image URL rows.
- Stats: repeatable value, label, and supported icon selection rows.
- Social links: repeatable label, URL, and supported icon selection rows.

Each repeatable section supports adding and removing rows while preserving at least one row. Gallery and image assets remain unchanged because the user did not request gallery editing in this admin scope.

The page includes Save, Reset to defaults, and View profile controls. Reset requires a lightweight confirmation because it discards local edits.

## Validation And Feedback

- Business name, location, about fields, and every repeated row’s visible fields are required.
- Phone and SMS values must use a permissive international phone format.
- Booking and social destinations must be valid `http` or `https` URLs.
- Service price remains free-form to support values such as `$75`, `From $99`, or `Contact us`.
- Inline messages identify invalid sections and the first invalid field receives focus through native form behavior.
- Successful Save shows a visible status message; Reset shows a defaults-restored message.

## Testing

Use test-first coverage for storage parsing, version rejection, malformed JSON, save, reset, and default fallback. Test admin form serialization and validation through pure helper functions where practical. Keep existing profile rendering tests and add coverage that the client renderer receives typed defaults. Run the full test suite, production build, HTTP route checks, and an in-app browser flow that saves an edit, verifies it on `/tyrees`, resets it, and confirms defaults return.

## Scope Boundaries

- No authentication, database, server action, API endpoint, file upload, or cross-device persistence.
- Admin edits Tyrees only in this iteration.
- Local changes are browser- and origin-specific and can be cleared with browser storage.
- Gallery images, logo, and hero image are not editable in this form.
