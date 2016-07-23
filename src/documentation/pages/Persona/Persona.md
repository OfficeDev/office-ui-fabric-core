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

## Dependencies
PersonaCard, ContextualHost

<!---
{{> PersonaExampleJS}}
--->
