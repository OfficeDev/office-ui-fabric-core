# Search Box
A special form field that allows for the input of search text.

## Variants

### Default
@@include('SearchBox.html')

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
2. Copy the HTML from one of the samples above into your page.
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all SearchBox components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.SearchBox) {
                $('.ms-SearchBox').SearchBox();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.

## Dependencies
This component has a dependency on the Label component.
