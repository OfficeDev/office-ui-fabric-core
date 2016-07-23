# Command Bar
Commanding surface for panels, pages, and applications. Unlike the NavBar, this component should not navigate to other pages.

## Variants

### Default
<!---
{{> CommandBar props=CommandBarExampleModel.props}}
--->

### Dropdowns
<!---
{{> CommandBar props=CommandBarExampleModel.propsDropdown}}
--->

### NavBar
Provides a means of navigating to different areas within an application. On small screens, the navigation items are placed inside a hamburger menu.
<!---
{{> CommandBar props=CommandBarExampleModel.propsNavBar}}
--->

## States
State | Applied to | Result
 --- | --- | ---
`.is-hidden` | `.ms-CommandBarItem` | Hides a Command Bar item from view.
`.is-active` | `.ms-CommandBarSearch` | Expands the search field for use.

## Dependencies
ContextualMenu, Button, Label, SearchBox, CommandButton, ContextualHost

## Accessibility
Refer to the sample code to see how `tabindex` attributes should be set to support keyboard navigation.

<!---
{{> CommandBarExampleJS }}
--->
