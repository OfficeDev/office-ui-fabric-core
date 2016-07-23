# Dialog
Displays content that temporarily blocks interactions with the application. It is primarily used for confirmation tasks, light-weight creation or edit tasks, and simple management tasks.

## Variants

### Default
Includes a content area and two buttons.

<!---
<div class="docs-DialogExample-default">
  {{> Dialog props=DialogExampleModel.default }}
  <button class="ms-Button docs-DialogExample-button">Open Dialog</button>
  <label class="docs-DialogExample-label"></label>
</div> 
{{> DialogExampleDefaultJS }}
--->

### Multiline
Includes multiple large buttons, each with a title and description.

<!---
<div class="docs-DialogExample-multiline">
  {{> Dialog props=DialogExampleModel.multiline }}
  <button class="ms-Button docs-DialogExample-button">Open Dialog</button>
  <label class="docs-DialogExample-label"></label>
</div>
{{> DialogExampleMultilineJS }}
--->

### Large Header
Provides a large, styled header followed by a content area and two buttons.

<!---
<div class="docs-DialogExample-lgHeader">
  {{> Dialog props=DialogExampleModel.lgHeader }}
  <button class="ms-Button docs-DialogExample-button">Open Dialog</button>
  <label class="docs-DialogExample-label"></label>
</div>
{{> DialogExampleLgHeaderJS }}
--->

### Blocking
The overlay for this variant does not dismiss the Dialog.

<!---
<div class="docs-DialogExample-blocking">
  {{> Dialog props=DialogExampleModel.blocking }}
  <button class="ms-Button docs-DialogExample-button">Open Dialog</button>
  <label class="docs-DialogExample-label"></label>
</div>
{{> DialogExampleBlockingJS }}
--->

### Close
Includes a close button at the top right, as an additional way to dismiss the dialog.

<!---
<div class="docs-DialogExample-close">
  {{> Dialog props=DialogExampleModel.close }}
  <button class="ms-Button docs-DialogExample-button">Open Dialog</button>
  <label class="docs-DialogExample-label"></label>
</div>
{{> DialogExampleCloseJS }}
--->

## States
This component has only the default state.

## Dependencies
Button, CheckBox, Overlay, ContextualHost

## Accessibility
More details will be added here.
