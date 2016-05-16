# Link
Used to create a hyperlink to another location.

## Variants

### Default
@@include('Link.html')

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
2. Copy the HTML from one of the samples above into your page. For example:
    ```
    <div class="ms-font-m">
        <a href="#" class="ms-Link">Link to a webpage</a>
    </div>
    ```
3. Replace the sample text with the text of your link.

## Dependencies
This component has no dependencies on other components.

## Accessibility
Use the `title` attribute to provide additional text describing the link, if the link text itself is not descriptive enough.

## Notes
The Link inherits the font family, size, and weight of its parent element. This is why we have placed it within `.ms-font-m` wrapper in the sample above.
