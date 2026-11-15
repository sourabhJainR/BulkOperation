# Compatibility

BulkOperation supports native table rows, ARIA grids/treegrids, and common interactive list items. It discovers controls using visible text, accessible names, linked ARIA labels, tooltip metadata, SVG titles, icon classes, data attributes, and common menu patterns.

Known limitations include canvas controls, closed shadow roots, controls without useful metadata, hover-only menus, and highly virtualized grids. These may need a site-specific adapter.

The GitHub adapter targets repository branch listing pages and excludes default/protected branches. It fails closed if it cannot identify a clear delete action.
