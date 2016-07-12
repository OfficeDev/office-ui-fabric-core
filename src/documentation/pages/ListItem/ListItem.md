# List Item
Suitable for presenting a summary of an item with associated actions. Most often used within a List component. It was designed to represent an email message on desktop computers and is not currently touch friendly.

## Variants

### Default
<!---
{{> ListItemElem props=ListItemModels.basic }}
--->

### Image
The same as the default variant, with a thumbnail image added.

<!---
{{> ListItemElem props=ListItemModels.image }}
--->

### Document
Showcases a document by providing a thumbnail, title, and some metadata.
<!---
{{> ListItemElem props=ListItemModels.document }}
--->

## States

### Selectable
Apply the `is-selectable` class to make it possible to select the item.
<!---
{{> ListItemElem props=ListItemModels.selectable }}
--->

### Selected
When applied alongside the `is-selectable` class, `is-selected` will mark it as selected.
<!---
{{> ListItemElem props=ListItemModels.selected }}
--->

### Unseen
Use `is-unseen` to indicate that the item has not been seen.
<!---
{{> ListItemElem props=ListItemModels.unseen }}
--->

### Unread
Use `is-unread` to indicate that the item has not been read.
<!---
{{> ListItemElem props=ListItemModels.unread }}
--->

## Dependencies
List

<!---
{{> ListItemJS }}
--->
