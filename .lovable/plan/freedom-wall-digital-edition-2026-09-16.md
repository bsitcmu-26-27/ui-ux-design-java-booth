# Freedom Wall — Digital Edition

## Goal
Build a polished, responsive CMU student freedom wall prototype where visitors can browse, post, react to, and explore colorful notes in both grid and interactive canvas views. All prototype data remains on the current device.

## Pages and navigation
- Create a shared responsive header with Freedom Wall branding, a CMU label, mobile navigation, links to Home, Wall, Canvas, About, Booth Mode, and Admin Demo, plus a prominent “Share Your Thought” action.
- Build `/` as the welcoming home page with the “Your Voice. Your Story. Your Wall.” headline, layered floating sample notes, concise community framing, and clear actions to post or browse.
- Build `/wall` as the main searchable, filterable responsive grid.
- Build `/canvas` as a corkboard-style free exploration view with drag-to-pan, zoom controls, wheel/pinch-friendly zoom behavior, and reset.
- Build `/about` with the CMU IT student CISC booth story, community values, and prototype context.
- Build `/booth` as a simplified kiosk presentation with reduced chrome, larger controls and notes, strong readability, and a quick exit back to the regular site.
- Build `/admin` as a clearly labeled prototype moderation workspace.
- Add distinct page titles and social metadata for every page.

## Visual direction
- Use a warm campus editorial style: deep CMU green, warm paper neutrals, soft gold accents, and a balanced set of pastel note colors.
- Establish semantic design tokens and a distinctive friendly type pairing; preserve accessible contrast and visible focus states.
- Give notes subtle deterministic rotations, pin or paper-tape details, restrained paper texture, and soft layered shadows without making the interface visually noisy.
- Add small purposeful transitions for note entrances, filters, reactions, modal states, and success confirmation, with reduced-motion support.
- Keep layouts stable and responsive across phone, tablet, desktop, and kiosk displays.

## Shared data model and local persistence
- Add typed post, category, note-color, media, reaction, moderation-status, and canvas-position models.
- Seed 12–15 realistic student posts covering humor, appreciation, study tips, campus moments, reflections, ideas, dreams, and experiences; include varied dates, names/anonymous authors, reactions, colors, and moderation states.
- Initialize LocalStorage only when no saved dataset exists, then persist user posts, moderation changes, deletions, and one-reaction-per-device state.
- Centralize storage access behind SSR-safe helpers and a shared React provider so all views stay synchronized in the same browser.
- Include clear comments at the storage boundary showing where a production database and authenticated moderation service would replace the prototype store.

## Posting experience
- Add a reusable responsive compose dialog/slide-over opened from all “Share Your Thought” actions.
- Include a 500-character textarea with live counter, optional category selection, pastel note-color swatches, and optional display name defaulting to “Anonymous yarn?”.
- Support one photo or video with client-side file validation, embedded preview, removal, and Data URL persistence; communicate a practical prototype file-size limit to avoid exhausting browser storage.
- Show the etiquette reminder before submission.
- Validate non-empty text, length, recent duplicate submissions, rapid repeat posting, and a configurable basic safety/profanity keyword list.
- Publish clean submissions immediately; store flagged submissions as pending and show a friendly review message rather than displaying them publicly.
- Show a warm success toast and a short note-posted animation.

## Wall browsing and reactions
- Add search across message and display name.
- Add category filter pills including an “All” state and sorting for Newest, Oldest, and Most Reacted.
- Render a 1-column mobile, 2-column tablet, and 3–4-column desktop note grid with embedded image/video where supplied.
- Add heart reactions with a small count animation and prevent repeat reactions to the same post on the current device.
- Provide a friendly resettable empty state when search/filter combinations have no matches.

## Canvas interaction
- Arrange approved notes across a large virtual corkboard with seeded stable positions.
- Implement pointer drag to pan, wheel/buttons to zoom within safe limits, and reset-to-fit.
- Keep note controls usable without accidentally dragging the canvas; support touch interaction and keyboard-accessible zoom/reset controls.
- Reuse the same search/filter/sort state where useful while preserving a clean whiteboard feel.

## Prototype moderation
- Show all posts in a compact, readable moderation table/list with status filters and counts.
- Allow pending items to be approved or rejected and user/test entries to be deleted behind confirmation prompts.
- Persist moderation actions locally and update the public wall/canvas immediately.
- Clearly mark the screen as a non-secure prototype admin demo; do not imply real authentication or server-side enforcement.

## Quality checks
- Verify posting, flagged-post handling, filtering, sorting, reaction locking, media previews, persistence after reload, moderation actions, canvas zoom/pan/reset, navigation, mobile menu, and booth mode.
- Check desktop and mobile layouts for clipped text, overlapping controls, inaccessible contrast, and unintended horizontal scrolling.
- Confirm every page renders correctly in the live preview and that the starter placeholder is fully removed.
