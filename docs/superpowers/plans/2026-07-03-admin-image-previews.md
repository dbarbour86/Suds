# Admin Image Previews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add temporary logo, hero, and gallery upload previews to `/admin` without persisting selected files.

**Architecture:** Pure image-file helpers validate MIME types and manage preview-state transitions. The client admin owns object URLs separately from `Profile`, revokes them at every replacement/removal/unmount boundary, and renders a dedicated Images card.

**Tech Stack:** React, TypeScript, CSS Modules, browser File API, object URLs, Vitest.

---

### Task 1: File And Preview Helpers

**Files:**
- Create: `app/admin/image-previews.ts`
- Create: `app/admin/image-previews.test.ts`

- [ ] Write failing tests for JPEG, PNG, and WebP acceptance; non-image rejection; single-preview replacement; gallery replacement; removal; and URL revocation callbacks.
- [ ] Run `node node_modules/vitest/vitest.mjs run app/admin/image-previews.test.ts` and confirm failure because the helper module does not exist.
- [ ] Implement `ImagePreviewState`, MIME validation, single/gallery replacement helpers, individual removal, and `revokePreviewState` using injected create/revoke functions so behavior is deterministic in tests.
- [ ] Run the helper test and confirm all lifecycle cases pass.

### Task 2: Admin Upload Controls

**Files:**
- Modify: `app/admin/admin-form.test.tsx`
- Modify: `app/admin/admin-form.tsx`
- Modify: `app/admin/admin.module.css`

- [ ] Extend the structural test to require an Images heading, Logo image, Hero image, and Gallery images file inputs, current previews, and remove controls.
- [ ] Run the structural test and confirm it fails before UI implementation.
- [ ] Add separate `ImagePreviewState` and error state to `AdminForm`; initialize with no temporary URLs so typed or saved profile assets remain the display fallback.
- [ ] Wire accepted single files to logo and hero object URL previews and accepted multiple files to the gallery preview grid.
- [ ] Reject unsupported files with picker-specific inline messages without changing current previews.
- [ ] Add Replace/Choose and Remove controls; Remove returns to `profile.logoUrl`, `profile.heroImageUrl`, or `profile.galleryImages` as appropriate.
- [ ] Revoke temporary URLs on replacement, removal, Reset, and component unmount.
- [ ] Keep `handleSubmit` unchanged so Save serializes only `profile`, never preview state.
- [ ] Style circular logo, wide hero, gallery grid, file-picker buttons, and preview errors responsively within the existing admin design.
- [ ] Run the complete admin test set and confirm it passes.

### Task 3: Verification

**Files:**
- No additional production files.

- [ ] Run `node node_modules/vitest/vitest.mjs run` and confirm zero failures.
- [ ] Run `node node_modules/next/dist/bin/next build` and confirm `/admin` and `/tyrees` compile.
- [ ] In the in-app browser, choose valid local logo, hero, and gallery image files and confirm each preview updates.
- [ ] Remove a temporary preview and confirm the typed/default asset returns.
- [ ] Select an unsupported file and confirm an inline error appears without replacing the current preview.
- [ ] Refresh `/admin` and confirm temporary uploaded previews disappear while existing URL-based profile data remains intact.
