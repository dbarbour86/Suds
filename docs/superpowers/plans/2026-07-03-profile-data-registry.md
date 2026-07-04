# Profile Data Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all client-specific profile content into a typed registry and render each entry at the root-level `suds.to/username` route.

**Architecture:** `data/profiles.ts` owns the typed content model and the `profiles` registry. `app/[username]/page.tsx` resolves a registry entry from route params, statically generates known usernames, returns a 404 for unknown usernames, and maps data icon identifiers to Lucide components.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, Lucide React, Vitest.

---

### Task 1: Typed Profile Registry

**Files:**
- Create: `data/profiles.ts`
- Create: `data/profiles.test.ts`

- [ ] **Step 1: Write a failing data-contract test**

Create assertions that import `profiles`, read `profiles.tyrees`, and require the exact top-level keys `username`, `businessName`, `logoUrl`, `heroImageUrl`, `about`, `phone`, `textNumber`, `bookingUrl`, `location`, `stats`, `services`, `galleryImages`, `socials`, and `reviewUrl`. Assert the username is `tyrees`, all typed collections are non-empty, and every link field contains the expected protocol.

- [ ] **Step 2: Verify the data-contract test fails**

Run: `node node_modules/vitest/vitest.mjs run data/profiles.test.ts`

Expected: FAIL because `data/profiles.ts` does not exist.

- [ ] **Step 3: Implement the typed registry**

Define string-union icon types, nested interfaces for `ProfileAbout`, `ProfileStat`, `ProfileService`, `ProfileGalleryImage`, `ProfileSocial`, and the complete `Profile`. Export `profiles` with a `tyrees` record using the current page content and local image URLs. Use valid sample destinations for phone, SMS, booking, socials, and review.

- [ ] **Step 4: Verify the registry test passes**

Run: `node node_modules/vitest/vitest.mjs run data/profiles.test.ts`

Expected: one passing test file with zero failures.

### Task 2: Dynamic Username Route

**Files:**
- Create: `app/[username]/page.tsx`
- Move: `app/tyrees/page.module.css` to `app/[username]/page.module.css`
- Modify: `app/tyrees/page.test.tsx`, then move it to `app/[username]/page.test.tsx`
- Delete: `app/tyrees/page.tsx`

- [ ] **Step 1: Write failing route-rendering assertions**

Update the rendering test to await `ProfilePage({ params: Promise.resolve({ username: "tyrees" }) })`, render the returned element, and assert that values and destinations read from `profiles.tyrees` appear in the HTML. Require exact `tel:`, `sms:`, booking, social, and review `href` values.

- [ ] **Step 2: Verify the route test fails**

Run: `node node_modules/vitest/vitest.mjs run app/[username]/page.test.tsx`

Expected: FAIL because the dynamic route implementation does not exist yet.

- [ ] **Step 3: Implement registry-driven rendering**

Add `generateStaticParams()` from `Object.keys(profiles)`. Resolve `params.username`, call `notFound()` for a missing entry, and replace every business-specific literal with the corresponding profile field. Keep interface-only labels in the component. Use local icon maps keyed by the registry's typed icon identifiers.

- [ ] **Step 4: Make profile controls live**

Render Call and Text as `tel:` and `sms:` anchors, Book Now from `bookingUrl`, each social from its data URL, and the Google review CTA from `reviewUrl`. Use `target="_blank" rel="noreferrer"` for web destinations and keep More as a static button.

- [ ] **Step 5: Preserve existing appearance**

Move the existing CSS Module unchanged, then extend the shared action/social/review selectors so anchors inherit the existing button visuals and focus states.

- [ ] **Step 6: Verify route tests pass**

Run: `node node_modules/vitest/vitest.mjs run`

Expected: all profile registry, route rendering, and CSS purity tests pass.

### Task 3: Production Verification

**Files:**
- Modify: `app/page.tsx` only if its `/tyrees` link needs adjustment

- [ ] **Step 1: Run the full production build**

Run: `node node_modules/next/dist/bin/next build`

Expected: successful type checking and a statically generated `/[username]` route that includes `/tyrees`.

- [ ] **Step 2: Verify the public path**

Start the production server and request `http://127.0.0.1:3019/tyrees`. Expect HTTP 200 and the Tyrees profile. Request an unknown username and expect HTTP 404.

- [ ] **Step 3: Verify in the in-app browser**

Reload `/tyrees`, confirm the current visual layout remains intact, and inspect representative live links for destinations sourced from the registry.
