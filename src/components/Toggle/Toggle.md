# Toggle
Allows for turning on or off a setting. This is best suited for simple, singular configuration (e.g. application level settings) whereas the ChoiceField is better suited when there is a longer list of individual choices or in a form (e.g. signing up for different newsletters during registration for an event).

## Variants

### Label above (default)
@@include('Toggle.html')

### Label on left
@@include('Toggle.TextLeft.html')

## Using this component
1. Confirm that you have references to Fabric's CSS on your page:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
    </head>
    ```
2. Copy the HTML from one of the samples above into your page.
3. Update the `.ms-Label` to contain your label text.

## Dependencies
This component has a dependency on the Label component.
