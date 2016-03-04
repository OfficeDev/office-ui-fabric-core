# Command Bar
Commanding surface for panels, pages, and applications. Unlike the NavBar, this component should not navigate to other pages.

## Variants

### Standard
@@include('CommandBar.html')

## States
State | Applied to | Result
 --- | --- | ---
`.is-hidden` | `.ms-CommandBarItem` | Hides a Command Bar item from view.
`.is-active` | `.ms-CommandBarSearch` | Expands the search field for use.

## Using this component
<!-- @todo Create a page showing how to import fabric.css, fabric.components.css, and jquery.fabric.js onto a page. -->
1. Confirm that you have [references to Fabric's CSS and JavaScript]() on your page.
2. Copy the HTML from the sample above into your page.
3. Add the following `<script>` tag to your page to instantiate the component using jQuery:
<!-- @todo Can we simplify the code block below? -->
```
<script>
    $(document).ready(function() {
        if ($.fn.CommandBar) {
            $('.ms-CommandBar').CommandBar();
        }
    });
</script>
```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content (such as `.ms-CommandBarItem` elements) with your content.

## Dependencies
Icons are used within the command bar items.

## Accessibility
Refer to the sample code to see how `tabindex` attributes should be set to support keyboard navigation.
