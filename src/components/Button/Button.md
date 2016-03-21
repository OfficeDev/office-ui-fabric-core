# Button
Allows users to take action, such as submitting a form or dismissing a message.

## Variants

### Default
@@include('Button.html')

### Primary
Where multiple buttons are presented together, this is the default action when submitting the form.

@@include('Button.Primary.html')

### Command
Includes an icon.

@@include('Button.Command.html')

### Compound
Provides a second line of text to explain the action the button takes.

@@include('Button.Compound.html')

### Hero
Similar to the Command variant, but with a larger size to draw attention to important actions.

@@include('Button.Hero.html')

## States

State | Applied to | Result
 --- | --- | ---
`.is-disabled` | `.ms-Button` | When using an `<a>` element, apply this class to disable the button. When using a `<button>`, the `disabled` attribute can be used instead.

## Using this component
1. Confirm that you have references to Fabric's CSS on your page:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
    </head>
    ```
2. Copy the HTML from one of the samples above into your page. For example:
    ```
    <button class="ms-Button">
        <span class="ms-Button-label">Create account</span>
    </button>
    ```
3. Replace the sample HTML content (such as the content of `.ms-Button-label`) with your content.

## Dependencies
This component has no dependencies.

## Accessibility
Focus styles are included for keyboard navigation.
