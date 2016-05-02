# People Picker
A form input that allows for the choice of one or more people.

## Variants

### Default
Uses the standard sized Persona component.
@@include('PeoplePicker.html')

### Compact
Use the extra small Persona component to fit more results.
@@include('PeoplePicker.Compact.html')

### Members List
Has a smaller search field.
@@include('PeoplePicker.MembersList.html')

### Facepile
Presents the selected people in a list below the search field, rather than inline.
@@include('PeoplePicker.Facepile.html')

## More options

### Disconnected
If the network is unavailable, you can present an error message in the search more area.
@@include('PeoplePicker.Disconnected.html')

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
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Dialog components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.PeoplePicker) {
                $('.ms-PeoplePicker').PeoplePicker();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content with your content.

## Dependencies
This component uses Persona and PersonaCard to display people and Label for the Members List variant. It also uses a Spinner when searching for results.
