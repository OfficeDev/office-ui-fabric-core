# Label
Used to label form elements such as TextField and Dropdown.

## Variants

### Default
@@include('Label.html')

## States
State | Applied to | Result
 --- | --- | ---
`.is-required` | `.ms-Label` | Marks the form element as required.
`.is-disabled` | `.ms-Label` | Marks the form element as disabled.

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
    <label class="ms-Label">
        Name
    </label>
    ```
3. Replace the sample HTML content (such as the content of `.ms-Label`) with your content.

## Dependencies
This component has no dependencies on other components.

## Accessibility
When used with a form element, add a `for` attribute that matches the `id` attribute of the field.
