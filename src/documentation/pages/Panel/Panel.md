# Panel
Presents content by sliding over the rest of the application, which is covered by a partially-transparent overlay. Best used for experiences that do not require explicit context for heavy-weight creation/edit/management tasks such as settings, multi-field forms, and permissions. For containers used for complex tasks that requires context, use a separate Pane alongside the existing experience such as a List/Details layout.

## Variants

### Default
<!---
{{> PanelDefaultExample}}
--->

### Medium
<!---
{{> PanelMediumExample}}
--->

### Large
<!---
{{> PanelLargeExample}}
--->

### Large, fixed
<!---
{{> PanelLargeFixedExample}}
--->

### Extra Large
<!---
{{> PanelExtraLargeExample}}
--->

### Extra extra large
<!---
{{> PanelExtraExtraLargeExample}}
--->

### Left aligned
You can add the `ms-Panel--left` modifier to any panel to attach it to the left side of the screen.
<!---
{{> PanelLeftExample}}
--->

## States
State | Applied to | Result
 --- | --- | ---
`.is-open` | `.ms-Panel` | The panel is closed by default. Apply this class to open it.
