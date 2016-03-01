# Choice Field
Allows selection from one or more options.

## Variants

### Checkbox
Used to indicate a simple yes or no choice.

[ Example here: ChoiceField.Checkbox.html ]

### Radio button group
Used to indicate a single choice from multiple options.

[ Example here: ChoiceField.ChoiceFieldGroup.html ]

## States
State | Applied to | Result
 --- | --- | ---
`disabled` attribute | `.ms-ChoiceField-input` | Disables the input.
`checked` attribute | `.ms-ChoiceField-input` | Fills in the checkbox or radio button.

## Using this component
<!-- @todo Create a page showing how to import fabric.css, fabric.components.css, and jquery.fabric.js onto a page. -->
1. Confirm that you have [references to Fabric's CSS]() on your page. No JavaScript is required for this component.
2. Copy the HTML from one of the samples above into your page.
3. Replace the sample HTML content (such as the content of `.ms-Label`) with your content.

## Dependencies
This component uses a Label to label each checkbox, radio button, and group.

## Accessibility
Focus styles are included for these fields. Ensure that you use descriptive labels.
