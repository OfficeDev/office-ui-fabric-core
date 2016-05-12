# Nav Bar
Provides a means of navigating to different areas within an application. On small screens, the navigation items are placed inside a hamburger menu.

## Variants

### Default
@@include('NavBar.html')

## States
State | Applied to | Result
 --- | --- | ---
`.is-selected` | `.ms-NavBar-item` | Marks that item in the Nav Bar as selected.
`.is-disabled` | `.ms-NavBar-item` | Disables that item.
`.is-open` | `.ms-NavBar` | On small screens, a panel is used to display the Nav Bar. This class opens the panel.

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
            if ($.fn.NavBar) {
                $('.ms-NavBar').NavBar();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content with your content.

## Dependencies
This component has dependencies on ContextualMenu and Overlay.
