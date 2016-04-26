# Spinner
Displays the progress of an operation when the percentage complete can not be determined. Do you know how much of the operation is complete? Use a ProgressIndicator instead.

## Variants

### Default
@@include('Spinner.html')

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
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Spinners on the page:
    ```
    <script>
        $(document).ready(function() {
            if (typeof fabric !== "undefined") {
                if ('Spinner' in fabric) {
                    var elements = document.querySelectorAll('.ms-Spinner');
                    var i = elements.length;
                    var component;
                    while(i--) {
                        component = new fabric['Spinner'](elements[i]);
                    }
                }
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.

## Dependencies
This component has no dependency on other components.
