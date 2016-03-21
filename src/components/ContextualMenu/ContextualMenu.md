# Contextual Menu
Presents options associated with an object. Often opened via a right-click or overflow button.

## Variants

### Default
A standard menu of commands. Should close when a command is invoked.

@@include('ContextualMenu.html')

### Multiselect
Allows for multiple options to be set. Remains opened until the user clicks or taps outside of the menu.

@@include('ContextualMenu.Multiselect.html')

## Optional functionality

### SubMenu
You can nest a ContextualMenu inside another ContextualMenu, resulting in a submenu.

@@include('ContextualMenu.SubMenu.html')

### Dividers
Dividers can be added to create distinct sections of options or commands.

@@include('ContextualMenu.Dividers.html')

## States

State | Applied to | Result
 --- | --- | ---
`.is-open` | `.ms-ContextualMenu` | The ContextualMenu is hidden by default. Toggle this class to show or hide it.
`.is-selected` | `.ms-ContextualMenu-link` | Marks that item as selected. Only available for the multiselect variant.
`.is-disabled` | `.ms-ContextualMenu-link` | Disables that item in the menu.

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
2. Copy the HTML from one of the samples above into your page. For example:
    ```
    <ul class="ms-ContextualMenu is-open">
        <li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link" href="#">Animals</a></li>
        <li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link" href="#">Books</a></li>
        <li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link is-selected" href="#">Education</a></li>
        <li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link" href="#">Music</a></li>
        <li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link is-disabled" href="#">Sports</a></li>
    </ul>
    ```
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all ContextualMenu components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.ContextualMenu) {
                $('.ms-ContextualMenu').ContextualMenu();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as the `.ms-ContextualMenu-link` elements) with your content.

## Dependencies
This component has no dependencies.

## Accessibility
More details will be added here.
