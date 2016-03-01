# Breadcrumb
Shows the current location in a hierarchy and provides a means of navigating upward.

## Variants

### Standard

[ Example here: Breadcrumb.html ]

## States

State | Applied to | Result
 --- | --- | ---
`.is-overflow` | `.ms-Breadcrumb` | Use this class to show an ellipsis, which opens a Contextual Menu of additional breadcrumbs. Without this class items that do not fit will be unavailable.
`.is-open` | `.ms-Breadcrumb-overflowMenu` | Displays the overflow menu.

## Using this component
<!-- @todo Create a page showing how to import fabric.css, fabric.components.css, and jquery.fabric.js onto a page. -->
1. Confirm that you have [references to Fabric's CSS and JavaScript]() on your page.
2. Copy the HTML from the sample above into your page.
3. Add the following `<script>` tag to your page to instantiate the component:
<!-- @todo Can we simplify the code block below? -->
```
<script>
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
</script>
```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as the `.ms-Breadcrumb-listItem` elements) with your content.

## Dependencies
This component uses a **Contextual Menu** for the overflow menu.

## Accessibility
The component's JavaScript will apply the correct `tabindex` values to ensure keyboard accessibility.
