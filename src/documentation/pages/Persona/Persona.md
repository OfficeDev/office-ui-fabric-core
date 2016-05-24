# Persona
Represents a person, complete with a profile image and additional details. Where a profile image is not available, the user's initials can be shown instead.

## Variants

### Circle (default)
Six sizes are available: tiny, extraSmall, small, default, large, and extraLarge
<!---
{{> Persona props=PersonaExampleProps.tiny}}
{{> Persona props=PersonaExampleProps.extraSmall}}
{{> Persona props=PersonaExampleProps.small}}
{{> Persona props=PersonaExampleProps.default}}
{{> Persona props=PersonaExampleProps.large}}
{{> Persona props=PersonaExampleProps.extraLarge}}
--->

### Square
For every size, you can apply the `.ms-Persona--square` class to change it to a square.
<!---
{{> Persona props=PersonaExampleProps.squareTiny}}
{{> Persona props=PersonaExampleProps.squareExtraSmall}}
{{> Persona props=PersonaExampleProps.squareSmall}}
{{> Persona props=PersonaExampleProps.squareDefault}}
{{> Persona props=PersonaExampleProps.squareLarge}}
{{> Persona props=PersonaExampleProps.squareExtraLarge}}
--->

### Initials
Don't have a profile image for the user? Provide the person's initials as an alternative.
<!---
{{> Persona props=PersonaExampleProps.initials}}
--->

### Presence indicators
A persona can have one of seven presences: available, away, blocked, busy, do not disturb, and offline.
<!---
{{> Persona props=PersonaExampleProps.presenceAvailable}}
{{> Persona props=PersonaExampleProps.presenceAway}}
{{> Persona props=PersonaExampleProps.presenceBlocked}}
{{> Persona props=PersonaExampleProps.presenceBusy}}
{{> Persona props=PersonaExampleProps.presenceDND}}
{{> Persona props=PersonaExampleProps.presenceOffline}}
--->

### Token
<!---
{{> Persona props=PersonaExampleProps.token}}
{{> Persona props=PersonaExampleProps.token}}
{{> Persona props=PersonaExampleProps.token}}
--->

### FacePile
<!---
{{> Persona props=PersonaExampleProps.facePile}}
{{> Persona props=PersonaExampleProps.facePile}}
{{> Persona props=PersonaExampleProps.facePile}}
--->

## Using this component
1. Confirm that you have references to Fabric's CSS on your page:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
    </head>
    ```
2. Copy the HTML from one of the samples above into your page.
3. Replace the sample HTML content (such as the name within `.ms-Persona-primaryText`) with your content.

## Dependencies
This component has no dependencies.

<!---
{{> PersonaExampleJS}}
--->
