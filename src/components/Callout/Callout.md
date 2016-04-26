# Callout
Notification area that provides a detailed description or set of actions on an object.

## Variants

### Default
@@include('Callout.html')

### Close
Includes an icon to dismiss the callout.

@@include('Callout.Close.html')

### Action text
Includes buttons to take action.

@@include('Callout.ActionText.html')

### OOBE (Out Of the Box Experience)
Draws attention to one aspect of the application during a product tour.

@@include('Callout.Oobe.html')

### Peek
A smaller callout with an action.

@@include('Callout.Peek.html')

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
    <div class="ms-Callout ms-Callout--arrowLeft">
        <div class="ms-Callout-main">
            <div class="ms-Callout-header">
                <p class="ms-Callout-title">All of your favorite people</p>
            </div>
            <div class="ms-Callout-inner">
                <div class="ms-Callout-content">
                    <p class="ms-Callout-subText">Message body is optional. If help documentation is available, consider adding a link to learn more at the bottom.</p>
                </div>
                <div class="ms-Callout-actions">
                    <a href="#" class="ms-Callout-link ms-Link ms-Link--hero">Learn more</a>
                </div>
            </div>    
        </div>
    </div>
    ```
3. Replace the sample HTML content (such as the content of `.ms-Callout-title`) with your content.

## Dependencies
This component has no dependencies.

## Accessibility
Focus styles are included for all of the actions (links and buttons) included within a Callout.
