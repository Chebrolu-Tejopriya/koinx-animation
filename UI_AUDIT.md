# UI audit

Reference: Figma Desktop – 100, node `11250:186030`, 1440 × 769.

Fixed:
- Self-closing JSX conversion was closing unrelated wrappers, breaking the hierarchy and placing icons and panels outside their containers.
- Missing CSS border reset created extra borders inside the statement panel.
- Shadow conversion split the commas inside RGBA colors, producing invalid CSS.
- Variable font faces now declare their supported weight ranges.
- Source JSON is read as UTF-8, preserving the rupee symbol.
- The processor-to-statement connector now uses the exact dashed SVG from Figma.

Verified in the browser:
- Heading, sources, processor, and statement retain their Figma artboard coordinates.
- All 67 rendered image instances load and have nonzero geometry.
- No horizontal page overflow at the reference viewport.
- No browser console errors.
- Visual comparison completed against the full-size Figma reference.

Final desktop screenshot: `ui-audit-after.jpg`.
The static scene scales proportionally on narrower screens. Animation awaits the user's flow.
