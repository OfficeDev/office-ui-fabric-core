# Facepile
Displays several people with the option to add additional people or view the details of a person.

## Variants

### Default
@@include('Facepile.html')

## States
State | Applied to | Result
 --- | --- | ---
`.is-active` | `.ms-PersonaCard` | Makes the PersonaCard for a person visible.
`.is-active` | `.ms-Facepile-itemBtn--overflow` | Makes the overflow item for additional people visible.

## Using this component
1. Confirm that you have references to Fabric's CSS and JavaScript on your page, as well as jQuery:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
        <script src="jquery-2.2.1.min.js"></script>
        <script src="jquery.fabric.min.js"></script>
    </head>
    ```
2. Copy the HTML from the sample above into your page.
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Dialog components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.Facepile) {
                $('.ms-Facepile').Facepile();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content with your content.

## Dependencies
This component has dependencies on Overlay, Link, Panel, PeoplePicker, Persona, PersonaCard, and Spinner.

## Accessibility
More details will be added here.
