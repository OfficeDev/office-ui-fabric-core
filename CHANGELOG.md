# Changelog

All noteworthy changes to Office UI Fabric will be documented in this file.

## 1.1.0 - 9-25-2015

### New
* https://github.com/OfficeDev/Office-UI-Fabric/pull/127: Add ProgressIndicator component
* https://github.com/OfficeDev/Office-UI-Fabric/pull/125: Add local testing server

### Fixed
* https://github.com/OfficeDev/Office-UI-Fabric/pull/139: Remove extra "\" character on .ms-borderColor-themeLighterAlt--hover CSS class
* https://github.com/OfficeDev/Office-UI-Fabric/pull/111: DatePicker on top of other DatePicker with correct z-index
* https://github.com/OfficeDev/Office-UI-Fabric/pull/105: Changed margin-left on image if is-selectable state
* https://github.com/OfficeDev/Office-UI-Fabric/pull/103: Update persona presence size. Clean up persona markup in all applicable components.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/92: Fixed DatePicker bug where navigating to a previous month fails
* https://github.com/OfficeDev/Office-UI-Fabric/pull/91: Clean up and restructure choicefield Less. Update and rename templates.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/90: Command Bar Fixes
* https://github.com/OfficeDev/Office-UI-Fabric/pull/87: Fix spacing between dropdown list items and dropdown list container
* https://github.com/OfficeDev/Office-UI-Fabric/pull/85: Fix filename case sensitivity
* https://github.com/OfficeDev/Office-UI-Fabric/pull/82: Simplify bower path in postinstall script.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/70: Update links to CDN license for fonts and icons to a dynamic URL

### Changed
* https://github.com/OfficeDev/Office-UI-Fabric/pull/151: NavBar - Replaced overlay pseudo element with Fabric Overlay component
* https://github.com/OfficeDev/Office-UI-Fabric/pull/149: Improved vanilla JS Consistency
* https://github.com/OfficeDev/Office-UI-Fabric/pull/146: Merge "develop" into "master" cla-not-required
* https://github.com/OfficeDev/Office-UI-Fabric/pull/137: Separated PickaDate from DatePicker
* https://github.com/OfficeDev/Office-UI-Fabric/pull/117: Removed non-existing icon "ppt-icon.png" from ListItem.less
* https://github.com/OfficeDev/Office-UI-Fabric/pull/115: Simplified DatePicker Markup

### Documentation/Samples
* https://github.com/OfficeDev/Office-UI-Fabric/pull/142: Fixed typo
* https://github.com/OfficeDev/Office-UI-Fabric/pull/126: Update download link in Getting Started
* https://github.com/OfficeDev/Office-UI-Fabric/pull/97: Remove protocol from CDN reference to avoid cross HTTP/HTTPS requests
* https://github.com/OfficeDev/Office-UI-Fabric/pull/80: Remove non-existent icons.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/84: Update CONTRIBUTING with note about which branches to use
* https://github.com/OfficeDev/Office-UI-Fabric/pull/83: Remove extra period.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/77: Fix broken anchors in COMPONENTS.md
* https://github.com/OfficeDev/Office-UI-Fabric/pull/69: Clean up component demos
* https://github.com/OfficeDev/Office-UI-Fabric/pull/68: Add reference to Office Add-Ins resources
* https://github.com/OfficeDev/Office-UI-Fabric/pull/61: Add button variant html files for demo.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/62: Add/update dialog variant html files for demo.
* https://github.com/OfficeDev/Office-UI-Fabric/pull/63: Add disabled state template file for dropdown



## 1.0.0 - 8-31-2015

- Initial release!

There have been a number of changes from the previous 0.10.3 release. These include:

### Breaking changes
  - Removed all deprecated variables, class names, and components.
    - **Variables:** All LESS variables have been prefixed with `ms-`, and all old variables without the prefix have been removed. If you're using Fabric's LESS files, be sure that variables are updated the prefixed versions, otherwise you will likely experience build breaks.
    - **Class names:** Many of the core typography and color class names were updated to better match the casing conventions of other classes within Fabric. The old, dash-separated class names have now been removed for simplicity. Be sure to update any references to those class names to the new, camelCased classes illustrated below. Class names affected include:
      - all `ms-bg-color-*` classes removed in favor of `ms-bgColor-*`
      - all `ms-border-color-*` classes removed in favor of `ms-borderColor-*`
      - all `ms-font-color-*` classes removed in favor of `ms-fontColor-*`
      - all `ms-font-size-*` classes removed in favor of `ms-fontSize-*`
      - all `ms-font-weight-*` classes removed in favor of `ms-fontWeight-*`
    - **Components:** FilePicker and AppBar have been removed. FilePicker is receiving significant design updates, and will be returning soon. AppBar has been deprecated in favor of CommandBar.
  - Removed several icons in PeoplePicker that were previously being generated with CSS.Make sure to add `<i class='ms-Icon--search'>` within the `.ms-PeoplePicker-searchMoreIcon` element, and `<i class='ms-Icon--alert'>` for the `--disconnected` variant so these continue to work.

### Added
  - Added CDN hosting for Segoe UI and Office 365 icon fonts, and updated @font-face definitions within Fabric to point to this CDN by default.
  - Added CommandBar, a new component for executing commands within a page or Panel.
    - Updated Panel to use CommandBar rather than a custom Panel-commands element.
  - Added Spinner, a new JavaScript component for representing indeterminate progress.
  - Added several sample HTML projects to demonstrate various aspects of using Fabric. These incude:
    - **Form**: A simple sign-up form which uses Fabric's typography and color classes as well as various form elements.
    - **VideoPortal**: A mock "video portal" application, which makes use of Fabric's responsive grid, components, typography & color classes, and LESS variables & mixins.
    - **Icons**: A page demonstrating each icon font glyph available in Fabric.
    - **Components**: Each component includes an HTML file demonstrating its usage and visual variants, as well as standalone uncompressed and minified CSS files that include only the styles necessary to render that component. This is useful for reducing page weight, since you can include only the CSS for components you actually intend to use.
  - Added & updated several "status" color classes (warning, error, success, informational).
  - Added an optional ms-TextField-description element to TextField, for adding a description to a text input.

### Fixed
  - Fixed an issue with PersonaCard's primary text, where long names would overflow the card without being truncated.
  - Fixed an issue with ListItem's secondary and tertiary text, where long strings would overlap list item actions.
  - Fixed an ugly issue on ListItem when combining is-selected and is-unseen classes.
  - Fixed up ChoiceFields to handle long strings in Labels, as well as properly include Label dependency when used as standalone CSS file.
  - Fixed numerous behavioral and visual issues with NavBar.
  - Fixed inconsistent/inaccurate animations with Panels.
  
### Changed
  - Updated all components to snap to a 4px grid. Many component's LESS files were refactored for consistency in the process.
  - Lots of code cleanup and normalization.
  - Refactored gulp build to better split out and optimize tasks.
  - Numerous documentation tweaks, adjustments, and additions.
    - Added a Getting Started tutorial explaining the basics of getting up and running with Fabric.
