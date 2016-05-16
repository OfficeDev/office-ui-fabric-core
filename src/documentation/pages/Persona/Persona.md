# Persona
Represents a person, complete with a profile image and additional details. Where a profile image is not available, the user's initials can be shown instead.

## Variants

### Profile image shape

#### Circle (default)
@@include('Persona.Tiny.html')
@@include('Persona.ExtraSmall.html')
@@include('Persona.Small.html')
@@include('Persona.html')
@@include('Persona.Large.html')
@@include('Persona.ExtraLarge.html')

#### Square
Apply the `.ms-Persona--square` class to any persona to change it to a square.
@@include('Persona.Square.Tiny.html')
@@include('Persona.Square.ExtraSmall.html')
@@include('Persona.Square.Small.html')
@@include('Persona.Square.html')
@@include('Persona.Square.Large.html')
@@include('Persona.Square.ExtraLarge.html')

### Initials
Where no profile image is available, you can use the person's initials.
@@include('Persona.Initials.html')

### Presence indicators

#### Available
@@include('Persona.Presence.Square.Available.html')
@@include('Persona.Presence.Available.html')

#### Away
@@include('Persona.Presence.Square.Away.html')
@@include('Persona.Presence.Away.html')

#### Blocked
@@include('Persona.Presence.Square.Blocked.html')
@@include('Persona.Presence.Blocked.html')

#### Busy
@@include('Persona.Presence.Square.Busy.html')
@@include('Persona.Presence.Busy.html')

#### Do not disturb
@@include('Persona.Presence.Square.Dnd.html')
@@include('Persona.Presence.Dnd.html')

#### Offline
@@include('Persona.Presence.Square.Offline.html')
@@include('Persona.Presence.Offline.html')

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




