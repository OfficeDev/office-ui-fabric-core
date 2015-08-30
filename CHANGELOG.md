# Changelog

All noteworthy changes to Office UI Fabric will be documented in this file. Office UI Fabric adheres to [Semantic Versioning](http://semver.org/).

## 1.0.0 - 8-31-2015

- Initial release!

There have been a number of changes from the previous 0.10.3 release. These include:

### Breaking changes
  - Removed all deprecated variables, class names, and components.
    - FilePicker and AppBar have been removed. FilePicker is receiving significant design updates, and will be returning soon. AppBar has been deprecated in favor of CommandBar.

### Added
  - Added CDN hosting for Segoe UI and Office 365 icon fonts, and updated @font-face definitions within Fabric to point to this CDN by default
  - Added CommandBar, a new component for executing commands within a page or Panel
    - Updated Panel to use CommandBar rather than a custom Panel-commands element
  - Added several sample HTML projects to demonstrate various aspects of using Fabric
  - Added an optional ms-TextField-description element to TextField, for adding a description to a text input

### Fixed
  - Fixed an issue with PersonaCard's primary text, where long names would overflow the card without being truncated
  - Fixed an issue with ListItem's secondary and tertiary text, where long strings would overlap list item actions
  - Fixed an ugly issue on ListItem when combining is-selected and is-unseen classes
  - Fixed up ChoiceFields to handle long strings in Labels, as well as properly include Label dependency when used as standalone CSS file
  
### Changed
  - Updated all components to snap to a 4px grid. Many component's LESS files were refactored for consistency in the process
  - Lots of code cleanup and normalization
  - Refactored gulp build to better split out and optimize tasks
  - Numerous documentation tweaks, adjustments, and additions
    - Added a Getting Started tutorial explaining the basics of getting up and running with Fabric
