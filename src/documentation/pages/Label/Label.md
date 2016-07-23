# Label
Used to label form elements such as TextField and Dropdown.

## Variants

### Default
<!---
{{> LabelExample props=LabelExampleModel.props }}
--->

### Required
<!---
{{> LabelExampleRequired props=LabelExampleModel.propsRequired }}
--->

### Disabled
<!---
{{> LabelExampleDisabled props=LabelExampleModel.propsDisabled }}
--->

## States
State | Applied to | Result
 --- | --- | ---
`.is-required` | `.ms-Label` | Marks the form element as required.
`.is-disabled` | `.ms-Label` | Marks the form element as disabled.

## Dependencies
This component has no dependencies on other components.

## Accessibility
When used with a form element, add a `for` attribute that matches the `id` attribute of the field.
