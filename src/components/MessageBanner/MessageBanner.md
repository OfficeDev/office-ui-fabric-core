# Message Banner
Presents a message to the user, with an optional call to action. The message is typically an error, update, or alert.

## Variants

### Default
@@include('MessageBanner.html')

## States
This component has only the default state.

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
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Breadcrumbs on the page:
    ```
    <script>
        $(document).ready(function() {
            if (typeof fabric !== "undefined") {
                if ('MessageBanner' in fabric) {
                    var elements = document.querySelectorAll('.ms-MessageBanner');
                    var i = elements.length;
                    var component;
                    while(i--) {
                        component = new fabric['MessageBanner'](elements[i]);
                    }
                }
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as the text in `.ms-MessageBanner-action`) with your content.

## Dependencies
This component has a dependency on Button.

