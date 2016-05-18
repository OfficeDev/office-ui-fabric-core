# Table
Presents tabular data with multiple rows and columns. The table's width is flexible, but it does not have any advanced responsive behaviors.

## Variants

### Default
The column widths are determined by the content.
<!---
{{> Table props=TableExampleModel}}
--->

### Fixed
The columns are split evenly, regardless of their content.
<!---
{{> Table props=TableFixedExampleModel}}
--->

## Using this component
1. Confirm that you have references to Fabric's CSS on your page:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
    </head>
    ```
2. Copy the HTML from the sample above into your page.
3. Replace the content with your own data. You can add more rows or columns.

## Dependencies
This component has no dependency on other components.
