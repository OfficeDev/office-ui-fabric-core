# Dialog
Displays content that temporarily blocks interactions with the application. It is primarily used for confirmation tasks, light-weight creation or edit tasks, and simple management tasks.

## Variants

### Default
Includes a content area and two buttons.

@@include('Dialog.html')

### Multiline
Includes multiple large buttons, each with a title and description.

@@include('Dialog.Multiline.html')

### Large Header
Provides a large, styled header followed by a content area and two buttons.

@@include('Dialog.LgHeader.html')

### Blocking
The overlay for this variant does not dismiss the Dialog.

@@include('Dialog.Blocking.html')

### Close
Includes a close button at the top right, as an additional way to dismiss the dialog.

@@include('Dialog.Close.html')

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
2. Copy the HTML from one of the samples above into your page. For example:
    ```
    <button class="ms-Button js-DialogAction--open" data-target=".ms-Dialog--sample">
        <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
        <span class="ms-Button-label">Open Dialog</span>
        <span class="ms-Button-description">Opens the Sample Dialog</span>
    </button>

    <div class="ms-Dialog ms-Dialog--sample">
        <div class="ms-Overlay ms-Overlay--dark js-DialogAction--close"></div>
        <div class="ms-Dialog-main">
            <button class="ms-Dialog-button ms-Dialog-button--close js-DialogAction--close">
            <i class="ms-Icon ms-Icon--x"></i>
            </button>
            <div class="ms-Dialog-header">
            <p class="ms-Dialog-title">All emails together</p>
            </div>
            <div class="ms-Dialog-inner">
            <div class="ms-Dialog-content">
                <p class="ms-Dialog-subText">Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.</p>
                <div class="ms-ChoiceField">
                    <input id="demo-checkbox-unselected1" class="ms-ChoiceField-input" type="checkbox">
                    <label for="demo-checkbox-unselected1" class="ms-ChoiceField-field"><span class="ms-Label">Option1</span></label>
                </div>
                <div class="ms-ChoiceField">
                    <input id="demo-checkbox-unselected2" class="ms-ChoiceField-input" type="checkbox">
                    <label for="demo-checkbox-unselected2" class="ms-ChoiceField-field"><span class="ms-Label">Option2</span></label>
                </div>
            </div>
            <div class="ms-Dialog-actions">
                <div class="ms-Dialog-actionsRight">
                <button class="ms-Dialog-action ms-Button ms-Button--primary">
                    <span class="ms-Button-label">Save</span>
                </button>
                <button class="ms-Dialog-action ms-Button">
                    <span class="ms-Button-label">Cancel</span>
                </button>
                </div>
            </div>
            </div>
        </div>
    </div>
    ```
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Dialog components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.Dialog) {
                $('.ms-Dialog').Dialog();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as the content of `.ms-Dialog-content`) with your content.

## Dependencies
This component has no dependencies on other components.

## Accessibility
More details will be added here.
