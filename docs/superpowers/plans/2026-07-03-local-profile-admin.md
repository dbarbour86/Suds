# Local Profile Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an unauthenticated `/admin` editor that persists a complete Tyrees `Profile` override in localStorage and hydrates it safely into `/tyrees`.

**Architecture:** A shared storage module validates versioned unknown JSON against the full `Profile` contract. The public route keeps its server-rendered default and passes it to a client renderer; the admin manages the same complete profile shape while exposing only the currently requested fields.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, localStorage, Lucide React, Vitest.

---

### Task 1: Versioned Profile Storage Adapter

**Files:**
- Create: `data/profile-storage.ts`
- Create: `data/profile-storage.test.ts`

- [ ] Write failing tests for `profileStorageKey`, valid parsing, malformed JSON fallback, version rejection, incomplete-profile fallback, save, and reset using a small in-memory `Storage` implementation.
- [ ] Run `node node_modules/vitest/vitest.mjs run data/profile-storage.test.ts` and confirm failure because the adapter does not exist.
- [ ] Implement runtime guards for every `Profile` field and nested typed array, plus `readStoredProfile`, `saveStoredProfile`, and `resetStoredProfile` using `{ version: 1, profile }`.
- [ ] Run the adapter test and confirm every storage behavior passes.

### Task 2: Server Defaults With Client Hydration

**Files:**
- Create: `app/[username]/profile-view.tsx`
- Create: `app/[username]/profile-view.test.tsx`
- Modify: `app/[username]/page.tsx`

- [ ] Write a failing renderer test that verifies the client view accepts a full default `Profile` and exposes the storage key contract without changing server markup.
- [ ] Move the current visual markup and icon maps into a `"use client"` `ProfileView` component receiving `defaultProfile: Profile`.
- [ ] Add an effect that reads a valid local override after hydration and listens for matching `storage` events; keep the default for invalid data.
- [ ] Reduce the server route to username resolution, 404 behavior, static params, and `<ProfileView defaultProfile={profile} />`.
- [ ] Run the full profile tests and confirm the existing rendered content and live-link expectations still pass.

### Task 3: Admin Form Helpers

**Files:**
- Create: `app/admin/profile-form.ts`
- Create: `app/admin/profile-form.test.ts`

- [ ] Write failing tests for full-profile cloning, required-field validation, permissive international phone validation, HTTP URL validation, repeated-row validation, and immutable add/remove helpers.
- [ ] Implement pure helpers that operate on the complete `Profile`, preserving hidden `logoUrl`, `heroImageUrl`, and `galleryImages` fields.
- [ ] Run the helper tests and confirm valid profiles pass while malformed basics, services, stats, and socials return field-specific messages.

### Task 4: Interactive Admin Page

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/admin-form.tsx`
- Create: `app/admin/admin.module.css`
- Create: `app/admin/admin-form.test.tsx`

- [ ] Write a failing structural test requiring the Tyrees form headings, Save, Reset to defaults, View profile, repeatable-section controls, and accessible status region.
- [ ] Build a server page that passes `profiles.tyrees` into a client `AdminForm`.
- [ ] Build controlled fields for business basics and the grouped `about` fields.
- [ ] Build repeatable service, stat, and social rows with typed icon selects and add/remove controls that retain at least one row.
- [ ] On Save, run validation, focus the first invalid native field, store the full profile with `saveStoredProfile`, dispatch a same-tab custom event, and show confirmation.
- [ ] On Reset, request confirmation, clear storage, restore a cloned typed default, dispatch the custom event, and show defaults-restored feedback.
- [ ] Style the page with the existing white, near-black, gray, and blue tokens; preserve one-column mobile behavior and a restrained desktop form width.
- [ ] Run all admin and storage tests and confirm they pass.

### Task 5: End-To-End Verification

**Files:**
- Modify: `design-qa.md` only if a new admin QA note is useful.

- [ ] Run `node node_modules/vitest/vitest.mjs run` and confirm zero failures.
- [ ] Run `node node_modules/next/dist/bin/next build` and confirm `/admin` and `/tyrees` compile successfully.
- [ ] Start the production server and confirm HTTP 200 for both routes.
- [ ] In the in-app browser, save a visible business-name edit in `/admin`, open `/tyrees`, and confirm the saved name appears.
- [ ] Return to `/admin`, reset defaults, reload `/tyrees`, and confirm `Tyrees` returns.
- [ ] Confirm invalid URLs produce a visible validation message and do not overwrite storage.
