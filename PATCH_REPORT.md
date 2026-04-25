# Finance Terminal Patch Report

## Root cause

The header dropdowns were rendered as `position: absolute` inside the header bar.
That header bar uses `backdrop-blur` / `backdrop-filter`, which creates a new stacking context.
Below it, the ticker and other animated sections also create stacking contexts because the ticker animation uses `transform`.
As a result, the dropdowns could not escape the header's stacking context even with a higher local `z-index`, so lower sections were able to paint above them.

## Fix applied

- Moved the top-bar dropdowns into a portal mounted on `document.body`
- Positioned them with `position: fixed` from the trigger button's bounding rect
- Kept alignment to the trigger button
- Preserved the current visual styling
- Added outside-click and Escape handling that still works with portaled menus
- Preserved hover-open and click-lock behavior for header dropdowns

## Changed files

### Replaced
- `components/terminal/executive-overview-client.tsx`
- `components/terminal/hover-dropdown.tsx`
- `components/terminal/settings-menu.tsx`

### New
- `components/terminal/finance-news-section.tsx`
- `components/ui/anchored-portal.tsx`
- `lib/data/finance-news-fallback.ts`
- `lib/server/finance-news.ts`
- `lib/types/finance-news.ts`
- `app/api/terminal/finance-news/route.ts`

## Notes

- No environment variables were required
- No unrelated components were rewritten
- Existing visual design was kept intact except for the dropdown layering fix and the added finance news section
