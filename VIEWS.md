# Preview views

The top-right tabs switch between:

- **Books flow** (`#books`): the existing animated transaction-to-statement scene, with adaptive connector routing and responsive layout.
- **Feature highlights** (`#features`): a four-step interaction using the exact default/selected component variants from Figma section `11277:86872`.

The tabs support clicks, Left/Right arrows, Home, and End. Only the selected panel is exposed to assistive technology. Hidden panels pause CSS animations, and the Books layout recalculates when revealed.

Books flow also includes an **Aligned / Scattered** icon-layout switch below its heading. Aligned uses evenly spaced rows and columns; Scattered restores the original arrangement, with a responsive scattered variant on phones. Both recalculate all twelve connectors and retain the synchronized processor motion.

Verified asset loading and page overflow at 320, 375, 700, 1024, 1399, 1440, and 1920px; click and keyboard switching; and browser console errors.

## Feature Highlights behavior

- Initial: component 1 selected at the center, component 2 default below, no component above.
- Scroll only over the center column to move through 1 → 2 → 3 → 4. Reverse scrolling returns to earlier features. Each wheel gesture advances one state; momentum is consumed to prevent accidental skips.
- Only the centered component uses its selected artwork. Its immediate neighbors use default artwork; more distant components are hidden.
- Hover adds a brightness highlight and never changes selection. The left heading stays fixed while the stack and matching right-hand copy change.
- Arrow keys, Page Up/Down, Home/End, and touch swipes are supported. Reduced-motion preferences remove transitions.
- Component 2 retains the original analytics copy. Draft copy for 1, 3, and 4 was authorized by the user and lives in `features.js`.
- Verified wheel progression through all four states and backward, unchanged selection on hover, a stationary desktop heading, one selected tile per state, and component asset loading. Responsive checks at 320, 375, 700, 1000, 1024, and 1440px passed without horizontal overflow or browser errors. Touch support is implemented but was not tested on a physical touch device.
