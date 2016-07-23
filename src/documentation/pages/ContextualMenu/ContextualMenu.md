# Contextual Menu
Presents options associated with an object. Often opened via a right-click or overflow button.

## Variants

### Default
A standard menu of commands. Should close when a command is invoked.

<!---
{{> ContextualMenuExample props=ContextualMenuExampleModel.basic }}
--->

### Multiselect
Allows for multiple options to be set. Remains opened until the user clicks or taps outside of the menu.

<!---
{{> ContextualMenuMultiselectExample props=ContextualMenuExampleModel.multiselect }}
--->

## Optional functionality

### SubMenu
You can nest a ContextualMenu inside another ContextualMenu, resulting in a submenu.

<!---
{{> ContextualMenuSubmenuExample props=ContextualMenuExampleModel.submenu }}
--->

### Dividers
Dividers can be added to create distinct sections of options or commands.

<!---
{{> ContextualMenuDividersExample props=ContextualMenuExampleModel.dividers }}
--->

## States

State | Applied to | Result
 --- | --- | ---
`.is-open` | `.ms-ContextualMenu` | The ContextualMenu is hidden by default. Toggle this class to show or hide it.
`.is-selected` | `.ms-ContextualMenu-link` | Marks that item as selected. Only available for the multiselect variant.
`.is-disabled` | `.ms-ContextualMenu-link` | Disables that item in the menu.

## Dependencies
ContextualHost

## Accessibility
More details will be added here.
