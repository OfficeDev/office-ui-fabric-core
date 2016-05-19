# Breadcrumb
Breadcrumbs should be used as a navigational aid in your app or site. They indicate the current page’s location within a hierarchy and help the user understand where they are in relation to the rest of that hierarchy. They also afford one-click access to higher levels of that hierarchy. Breadcrumbs are typically placed, in horizontal form, under the masthead or navigation of an experience, above the primary content area.

### Best Practices
Do | Don't
--- | ---
Place Breadcrumbs at the top of a page, above a list of items, or above the main content of a page.  |  Don't use Breadcrumbs as a primary way to navigate an app or site.

## Variants

### Default
@@include('Breadcrumb.html')

## States

State | Applied to | Result
 --- | --- | ---
`.is-overflow` | `.ms-Breadcrumb` | Use this class to show an ellipsis, which opens a Contextual Menu of additional breadcrumbs. Without this class items that do not fit will be unavailable.
`.is-open` | `.ms-Breadcrumb-overflowMenu` | Displays the overflow menu.

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
2. Copy the HTML from the sample above into your page. For example:
    ```
    <div class="ms-Breadcrumb">
        <div class="ms-Breadcrumb-overflow">
            <div class="ms-Breadcrumb-overflowButton ms-Icon ms-Icon--ellipsis" tabindex="1"></div>
            <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            <div class="ms-Breadcrumb-overflowMenu">
                <ul class="ms-ContextualMenu is-open"></ul>
            </div>
        </div>
        <ul class="ms-Breadcrumb-list">
            <li class="ms-Breadcrumb-listItem">
                <a class="ms-Breadcrumb-itemLink" href="#" tabindex="2">Files</a>
                <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            </li>
            <li class="ms-Breadcrumb-listItem">
                <a class="ms-Breadcrumb-itemLink" href="#" tabindex="3">Folder 1</a>
                <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            </li>
            <li class="ms-Breadcrumb-listItem">
                <a class="ms-Breadcrumb-itemLink" href="#" tabindex="4">Folder 2</a>
                <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            </li>
            <li class="ms-Breadcrumb-listItem">
                <a class="ms-Breadcrumb-itemLink" href="#" tabindex="5">Folder 3</a>
                <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            </li>
            <li class="ms-Breadcrumb-listItem">
                <a class="ms-Breadcrumb-itemLink" href="#" tabindex="6">Folder 4</a>
                <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            </li>
            <li class="ms-Breadcrumb-listItem">
                <a class="ms-Breadcrumb-itemLink" href="#" tabindex="7">Folder 5</a>
                <i class="ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight"></i>
            </li>
        </ul>
    </div>
    ```
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Breadcrumbs on the page:
    ```
    <script>
        $(document).ready(function() {
            if (typeof fabric !== "undefined") {
                if ('Breadcrumb' in fabric) {
                    var elements = document.querySelectorAll('.ms-Breadcrumb');
                    var i = elements.length;
                    var component;
                    while(i--) {
                        component = new fabric['Breadcrumb'](elements[i]);
                    }
                }
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as the `.ms-Breadcrumb-listItem` elements) with your content.

## Dependencies
This component uses a **Contextual Menu** for the overflow menu.

## Accessibility
The component's JavaScript will apply the correct `tabindex` values to ensure keyboard accessibility.
