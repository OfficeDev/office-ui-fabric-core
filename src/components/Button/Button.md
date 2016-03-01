# Button
Allows users to take action, such as submitting a form or dismissing a message.

## Variants

### Standard
[ Example here: Button.html ]

### Primary
Where multiple buttons are presented together, this is the default action when submitting the form.

[ Example here: Button.Primary.html ]

### Command
Includes an icon.

[ Example here: Button.Command.html ]

### Compound
Provides a second line of text to explain the action the button takes.

[ Example here: Button.Compound.html ]

### Hero
Similar to the Command variant, but with a larger size to draw attention to important actions.

[Example here: Button.Hero.html]

## States

State | Applied to | Result
 --- | --- | ---
`.is-disabled` | `.ms-Button` | When using an `<a>` element, apply this class to disable the button. When using a `<button>`, the `disabled` attribute can be used instead.

## Using this component
<!-- @todo Create a page showing how to import fabric.css, fabric.components.css, and jquery.fabric.js onto a page. -->
1. Confirm that you have [references to Fabric's CSS]() on your page. No JavaScript is required for this component.
2. Copy the HTML from one of the samples above into your page.
5. Replace the sample HTML content (such as the content of `.ms-Button-label`) with your content.

## Dependencies
This component has no dependencies.

## Accessibility
Focus styles are included for keyboard navigation.
