# List
Presents a number of related items, either as a vertical list or in a grid.

## Variants

### Default
A standard vertical list of items.

@@include('List.html')

### Grid
Places the list items in a grid, with the number of columns adjusting based on the screen size.

@@include('List.Grid.html')

## States
This component has only the default state.

## Using this component
1. Confirm that you have references to Fabric's CSS on your page:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
    </head>
    ```
2. Copy the HTML from one of the samples above into your page.
3. Replace the content with whatever you'd like to display as a list. The samples use `.ms-ListItem` components, but you can place any content within `.ms-List`.

## Dependencies
This component has no dependencies on other components, although it does often contain ListItem components.

## Accessibility
You can use a `ul` element if your content is unordered, or `ol` if the order of the content is important.
