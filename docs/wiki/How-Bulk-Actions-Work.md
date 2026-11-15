# How bulk actions work

BulkOperation scans supported DOM row patterns and adds selection checkboxes. It inspects selected rows for visible actions and offers actions shared by all selected rows.

Before execution, it displays the selected items for review. After confirmation, it invokes the selected control on one row at a time and reports each result.

It does not use private site APIs or bypass access controls. If an action cannot be identified with confidence, it is not offered.
