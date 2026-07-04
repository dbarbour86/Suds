# Suds.to Tyrees Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Next.js showcase profile at `/tyrees` that faithfully adapts the supplied detailing-business reference.

**Architecture:** Use the App Router with one route component, a colocated CSS Module, and typed local content arrays. Keep global styles limited to normalization and shared page tokens; keep Tyrees-specific presentation inside the route module so the page can later become a reusable profile template.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules, React Icons, Vitest, Testing Library.

---

## File Map

- `package.json`: project scripts and dependencies.
- `app/layout.tsx`: root document metadata and font setup.
- `app/globals.css`: reset, tokens, and global body treatment.
- `app/page.tsx`: lightweight redirect/link to the showcase profile.
- `app/tyrees/page.tsx`: profile content, typed data, and semantic section markup.
- `app/tyrees/page.module.css`: mobile-first profile layout and responsive styling.
- `app/tyrees/page.test.tsx`: route content and semantic structure checks.
- `public/images/*`: locally stored placeholder automotive imagery.
- `vitest.config.ts`, `vitest.setup.ts`: DOM test environment.
- `design-qa.md`: reference-to-build comparison and final gate.

### Task 1: Scaffold And Route Contract

- [ ] Create the Next.js TypeScript package files and Vitest configuration.
- [ ] Write a failing route test that expects the Suds.to wordmark, Tyrees business name, four action labels, stats, three services, gallery, social area, review CTA, and footer.
- [ ] Run `npm test -- --run` and confirm failure because `app/tyrees/page.tsx` does not exist.
- [ ] Add the root layout, global CSS, home link, and minimal `/tyrees` semantic page needed to pass the contract.
- [ ] Run `npm test -- --run` and confirm the route test passes.

### Task 2: Local Image Assets

- [ ] Create a coordinated set of dark, premium automotive placeholder images for the hero, three service cards, gallery, and circular brand mark.
- [ ] Store optimized assets under `public/images/tyrees/` with descriptive filenames and use appropriate crops for each slot.
- [ ] Add descriptive alternative text for every informative image and empty alternative text only where an image is decorative.

### Task 3: Reference-Faithful Mobile Layout

- [ ] Implement the white top bar, dark hero, overlapping circular logo, identity copy, service area, and two-column mobile action grid.
- [ ] Implement the about block, two-column stats, stacked service cards, two-column gallery, social/review area, and compact footer.
- [ ] Add visible hover, focus, and pressed states while keeping the requested controls static.
- [ ] Run `npm test -- --run` and confirm the content contract remains green.

### Task 4: Wide Responsive Layout

- [ ] Add breakpoints that expand actions and stats to four columns, services to three columns, gallery to four columns, and the dark connection area to three columns.
- [ ] Match the reference’s desktop density, hero crop, section rhythm, radii, thin borders, shadows, blue accent, and dark footer.
- [ ] Prevent horizontal overflow and preserve usable spacing at 320px, 768px, and wide desktop viewports.

### Task 5: Verification And Design QA

- [ ] Run `npm test -- --run` and confirm zero failures.
- [ ] Run `npm run build` and confirm a successful production build including `/tyrees`.
- [ ] Start the local app and capture `/tyrees` at mobile and desktop widths in the in-app browser.
- [ ] Compare captures to the supplied reference, record findings in `design-qa.md`, and fix all P0-P2 mismatches.
- [ ] Repeat the capture and comparison until `design-qa.md` contains `final result: passed`.
- [ ] Keep the verified local preview running and hand off its clickable URL.
