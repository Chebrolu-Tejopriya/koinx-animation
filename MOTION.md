# KoinX animation

- Connector curves recalculate from the actual exchange-tile and processor bounds on resize. All twelve exchange tiles feed a single junction and one shared dotted line enters the processor. The shared input follows the floating processor in horizontal and vertical layouts; the source SVG assets remain intact.
- The outgoing dashed connector moves toward Unified Statement.
- Two processor base plates, four surrounding icon tiles, and the center KoinX logo plate lift and lower together on a synchronized 4.8-second loop, with identical easing, zero delay, and a 15px lift. The original isometric transforms and spacing remain intact.
- The right statement window continuously scrolls upward through Cash Flow, Reports, and Reconciliation. Reconciliation is the third panel present below the original Figma crop. Two identical groups produce a seamless 36-second loop.
- Reduced-motion preferences restore a static scene.
- Below 390px, icons reflow into a four-column grid and their lines route downward to the processor, followed by the statement. From 390px through 999px the icons and processor share a row with the statement below. At 1000px and above all three regions sit horizontally. The page keeps readable typography instead of shrinking the entire artboard.
- ResizeObserver recalculates connector endpoints when the flow container changes size, including scrollbar width changes.
- Verified live at 320, 375, 389, 390, 430, 768, 999, 1000, 1440, and 1920px: all twelve source anchors match their tile bounds, no horizontal overflow, and no console errors.

Run `node server.cjs`, then open http://127.0.0.1:4173/.
