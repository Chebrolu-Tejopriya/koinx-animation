# Feature Highlights mobile audit

Reference: Figma `DkwXaFDRFSM5J0XJ0GZRXV`, frame `65:19682` (390 × 930).

Figma design context and image export endpoints timed out or returned internal errors. The read-only Plugin API successfully returned node geometry, typography, layout spacing, and fills. These measurements are saved in `features-mobile-figma-measurements.json`. This is a property-level audit with browser visual verification, not an image-diff comparison against a Figma export.

| Property | Updated design | Applied |
| --- | --- | --- |
| Header side padding | 24px | 24px |
| Header top padding | 48px | 48px below the demo tabs |
| Heading | Space Grotesk Bold, 24px / 32px | Matched |
| Subtitle | Space Grotesk Regular, 14px, 36px over two lines | 14px / 18px |
| Header text gap | 10px | 10px |
| Gap before illustration | 34px | 34px at the start of the section |
| Illustration layout | 258.86px × 620px | 258.86px × 619.54px, using existing artwork scaled to 90.51% |
| Detail panel | Full width, minimum 92px high | Matched, grows for longer copy |
| Detail padding and gap | 12px vertical, 24px horizontal, 6px gap | Matched, with bottom safe-area support |
| Detail title | Medium, 16px / 22px | Matched |
| Detail description | Regular, 14px / 20px | Matched |
| Detail fill | #101728 | Matched |

Removed the old inset border framing on mobile. The detail panel is fixed to the viewport bottom even before the heading scrolls away. The illustration moves smoothly into the available area's center as the heading leaves; native page scrolling updates the selection in both directions. Existing SVG assets and desktop interaction are reused.

Verification:

- At 390 × 930, the reference typography and panel height match measured values; illustration scale is 0.90511.
- At 320 × 568, the longer fourth description expands the panel to 112px without overflow. Selected tile center differs from the available illustration area's center by less than 1px.
- Forward selection, final selection, and reverse native scrolling update the detail text correctly.
- Rendered image assets load successfully and retain nonzero dimensions.
- At 1280px, the copy remains beside the illustration in normal flow and the desktop grid is preserved.
- No horizontal overflow or browser console errors in the checked viewports.
- JavaScript syntax checks pass for `features.js` and `tabs.js`.

Browser preview: `features-mobile-audit.jpg`.
