# Pivot
A layout component that allows a user to switch between different sets of content or filters on the content currently visible. This is in contrast to a purely navigational UI element such as NavBar or a commanding element such as CommandBar. An example would be Read vs. Unread items in the Outlook Web App.

## Variants

### Default
<!---
{{> PivotExample props=PivotExampleModel}}
--->

### Large
<!---
{{> PivotLargeExample props=PivotLargeExampleModel}}
--->

### Tabs
<!---
{{> PivotTabsExample props=PivotTabsExampleModel}}
--->

### Large tabs
<!---
{{> PivotLargeTabsExample props=PivotLargeTabsExampleModel}}
--->

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
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Pivot components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.Pivot) {
                $('.ms-Pivot').Pivot();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content with your content.

## Dependencies
This component has no dependency on other components.
