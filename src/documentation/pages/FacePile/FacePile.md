# FacePile
Displays several people with the option to add additional people or view the details of a person.

## Variants

### Default
<!---
{{> FacePileElem props=FacePileModels.basic }}
--->

## States
State | Applied to | Result
 --- | --- | ---
`.is-active` | `.ms-PersonaCard` | Makes the PersonaCard for a person visible.
`.is-active` | `.ms-FacePile-itemBtn--overflow` | Makes the overflow item for additional people visible.

## Dependencies
Overlay, Link, Panel, PeoplePicker, Persona, PersonaCard, Spinner, ContextualHost

<!---
{{> FacePileJS }}
--->
