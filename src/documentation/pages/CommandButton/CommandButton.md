# Command Button
Allows users to take action, such as submitting a form or dismissing a message. Primary use is in command bar or in Callout.

## Variants

### Default
<!--- 
{{> CommandButton props=CommandButtonExampleModel.props}} 
--->

### Action Button
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsActionButton}} 
--->

### Disabled
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsDisabled}} 
--->

### Dropdown
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsDropdown}} 
--->

### Inline
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsInline}} 
--->

### No Label
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsNoLabel}} 
--->

### No Label Split
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsNoLabelSplit}} 
--->

### Pivot
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsPivot}} 
--->

### Split
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsSplit}} 
--->

### Text Only
<!--- 
{{> CommandButton props=CommandButtonExampleModel.propsTextOnly}} 
--->

## States
State | Applied to | Result
 --- | --- | ---
`.is-disabled` | `.ms-Button` | When using an `<a>` element, apply this class to disable the button. When using a `<button>`, the `disabled` attribute can be used instead.

## Dependencies
ContextualMenu, ContextualHost

## Accessibility
Focus styles are included for keyboard navigation.

<!---
{{> CommandButtonExampleJS }}
--->
