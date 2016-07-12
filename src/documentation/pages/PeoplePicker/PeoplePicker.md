# People Picker
A form input that allows for the choice of one or more people.

## Variants

### Default
Uses the standard sized Persona component.
<!---
{{> PeoplePicker props=PeoplePickerExampleProps.default}}
--->

### Compact
Use the extra small Persona component to fit more results.
<!---
{{> PeoplePicker props=PeoplePickerExampleProps.compact}}
--->

### Face pile
Presents the selected people in a list below the search field, rather than inline.
<!---
{{> PeoplePicker props=PeoplePickerExampleProps.facePile}}
--->

## More options

### Disconnected
If the network is unavailable, you can present an error message in the search more area.
@@include('PeoplePicker.Disconnected.html')

## Dependencies
Label, Persona, PersonaCard, Spinner, TextField, ContextualHost, OrgChart

<!---
{{> PeoplePickerExampleJS}}
--->
