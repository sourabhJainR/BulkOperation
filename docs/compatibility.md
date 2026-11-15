# Compatibility

## Supported page patterns

BulkOperation looks for:
- Native HTML table rows.
- ARIA grid and treegrid rows.
- Common interactive list items.
- Visible buttons, links, menu items, and common custom button controls.
- Action names exposed through visible text, ARIA labels, linked label/description elements, tooltip attributes, SVG titles, icon classes, and data attributes.
- Common menu, dropdown, popover, and context-menu containers, including newly opened portal-rendered menus.

## GitHub branches

The GitHub adapter targets repository branch listing pages. It uses visible branch links and visible row controls. The adapter excludes `main`, `master`, `gh-pages`, and rows marked default or protected. It looks for a clear Delete/Remove action and confirms that the branch disappears from the listing.

GitHub can change its page structure. If the adapter cannot identify a row or delete control with confidence, it stops rather than guessing.

## Known limitations

- Canvas-rendered controls are not discoverable through normal DOM inspection.
- Closed shadow roots hide their internal controls.
- Unlabeled controls with no useful metadata cannot be safely classified.
- Hover-only menus may not be discovered.
- Highly virtualized lists may only expose a subset of rows at a time.
- Some page actions navigate away or replace the page before completion can be verified.
- Site-specific confirmation dialogs may require manual handling.
- Similar action labels can be ambiguous; review the selected action and target list.

A site-specific adapter may be needed for unsupported pages. Do not weaken the fail-closed behavior to make an unsupported control appear to work.
