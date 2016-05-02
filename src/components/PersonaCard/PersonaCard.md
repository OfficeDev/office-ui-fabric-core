# Persona Card
The visualization of details of an individual including Skype contact details, email, location information, and location within the hierarchy of an organization. Within Office 365, PersonaCards often appear when a user hovers, taps, or clicks on a Persona.

## Variants

### Default
@@include('PersonaCard.html')

### Square
@@include('PersonaCard.Square.html')

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
3. Add the following `<script>` tag to your page, below the references to jQuery and Fabric's JS, to instantiate all Persona Card components on the page:
    ```
    <script>
        $(document).ready(function() {
            if ($.fn.PersonaCard) {
                $('.ms-PersonaCard').PersonaCard();
            }
        });
    </script>
    ```
4. Verify that the component is working the same as in the sample above.
5. Replace the sample HTML content with your content.

## Dependencies
This component uses a Persona component to present the person, an OrgChart to present the persona's position within the organization, and a Link for navigation.
