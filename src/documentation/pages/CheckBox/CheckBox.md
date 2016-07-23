# Check Box
Allows selection from one or more options.

## Variants

### Default
Used to indicate a simple yes or no choice, typically as part of a form.

<!---
{{> CheckBoxElem props=CheckBoxModels.basic }}
{{> CheckBoxElem props=CheckBoxModels.checkboxDisabled }}
{{> CheckBoxElem props=CheckBoxModels.checkboxSelected }}
--->

## States
State | Applied to | Result
 --- | --- | ---
`disabled` attribute | `.ms-CheckBox-input` | Disables the input.
`checked` attribute | `.ms-CheckBox-input` | Fills in the checkbox or radio button.

## Dependencies
Label

## Accessibility
Focus styles are included for these fields. Ensure that you use descriptive labels.

<!---
{{> CheckBoxJS }}
--->
