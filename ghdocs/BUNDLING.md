# Custom Bundling
## What are bundles and why are they useful?
"Bundles" are simply preconfigured CSS files that are made up of only the pieces of Fabric you specify. This allows you to tailor Fabric to the needs of your app and reduce the impact of including all of Fabric or Fabric's components. The end result is similar to the output of something like `src/sass/Fabric.scss`

For example, if your web app or add-in uses only Fabric's Typography styles and Button component, you can configure a bundle that includes only the styles for those elements, and nothing more. However, if a component depends on other components to render properly, those would also be included in the bundle. For example, the HTML for PersonaCard depends on the Persona, OrgChart, and Link components, so a bundle including the PersonaCard would also include the styles for those components.

## Usage
Bundling is a build process that depends on Fabric's gulp build tools to work, so first, make sure you've followed the [instructions for Building Fabric](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/BUILDING.md#building-fabric) to set up a local clone of Fabric that is ready for compiling.

Then, configure your bundle in `gulp/Config.js` in the `bundlesConfig` property. A bundle is simply a JavaScript object with a name, description, and list of file names to include or exclude from the final output. 

### Exclude vs include
#### `excludes`
If you list your files in "excludes", the bundle will be comprised of each .scss file in `src/sass` and `src/components` **except** for the files specified. For now, component dependencies are not included when in "exclude" mode. Partial .scss files, whose filenames begin with '_' (minus the quotes), are always excluded from bundles, since they produce no output.

Here's an example "excludes" bundle that excludes the Language Overrides styles:
```javascript
"bundles": [
  {
    "name": "excludes-bundle", // Becomes excludes-bundle.css/.min.css
    "description": "A custom bundle including a handful of modules.",
    "excludes": [
      "_Fabric.Typography.Languageoverrides"
    ]
  } 
]
```

This will produce the following:

```scss
//
// Office UI Fabric
// --------------------------------------------------
// SCSS template for building a bundle of Fabric and Fabric Components CSS.

@import '../../../src/sass/_Fabric.Common.scss';

@import '../../../src/components/Breadcrumb/Breadcrumb.scss';
@import '../../../src/components/Button/Button.scss';
@import '../../../src/components/Callout/Callout.scss';
@import '../../../src/components/ChoiceField/ChoiceField.scss';
@import '../../../src/components/CommandBar/CommandBar.scss';
@import '../../../src/components/ContextualMenu/ContextualMenu.scss';
@import '../../../src/components/DatePicker/DatePicker.scss';
@import '../../../src/components/Dialog/Dialog.scss';
@import '../../../src/components/Dropdown/Dropdown.scss';
@import '../../../src/components/Facepile/Facepile.scss';
@import '../../../src/components/Label/Label.scss';
@import '../../../src/components/Link/Link.scss';
@import '../../../src/components/List/List.scss';
@import '../../../src/components/ListItem/ListItem.scss';
@import '../../../src/components/MessageBanner/MessageBanner.scss';
@import '../../../src/components/NavBar/NavBar.scss';
@import '../../../src/components/OrgChart/OrgChart.scss';
@import '../../../src/components/Overlay/Overlay.scss';
@import '../../../src/components/Panel/Panel.scss';
@import '../../../src/components/PeoplePicker/PeoplePicker.scss';
@import '../../../src/components/Persona/Persona.scss';
@import '../../../src/components/PersonaCard/PersonaCard.scss';
@import '../../../src/components/Pivot/Pivot.scss';
@import '../../../src/components/ProgressIndicator/ProgressIndicator.scss';
@import '../../../src/components/SearchBox/SearchBox.scss';
@import '../../../src/components/Spinner/Spinner.scss';
@import '../../../src/components/Table/Table.scss';
@import '../../../src/components/TextField/TextField.scss';
@import '../../../src/components/Toggle/Toggle.scss';
@import '../../../src/sass/Fabric.Animations.Output.scss';
@import '../../../src/sass/Fabric.Color.Mixins.Output.scss';
@import '../../../src/sass/Fabric.Grid.Output.scss';
@import '../../../src/sass/Fabric.Icons.Font.Output.scss';
@import '../../../src/sass/Fabric.Icons.Output.scss';
@import '../../../src/sass/Fabric.Responsive.Utilities.Output.scss';
@import '../../../src/sass/Fabric.Typography.Fonts.Output.scss';
@import '../../../src/sass/Fabric.Typography.Language.Overrides.Output.scss';
@import '../../../src/sass/Fabric.Typography.Output.scss';
@import '../../../src/sass/Fabric.Utilities.Output.scss';
```

#### `includes`
If instead you use "includes", the bundle will include only the files specified. If the file is a component that has dependencies, like mentioned above, those will also be included. If you aren't sure what a component's dependencies are, look for the "dependencies" property in that component's JSON file in `src/{ComponentName}/{ComponentName}.json`. Note that the build looks for dependencies two children deep, or in other words, dependencies of dependencies. Also, as noted in `exludes` above, partial .scss files beginning with '_' will not be included in bundles, even if they are explicitly listed.

Here's an example "include" bundle that includes only the Button and PersonaCard components:
```javascript
"bundles": [
  {
    "name": "includes-bundle", // Becomes includes-bundle.css/.min.css
    "description": "A custom bundle including a handful of modules.",
    "includes": [
      "Button",
      "PersonaCard" // Will also include Link, OrgChart, and Persona components as dependencies
    ]
  } 
]
```

This will produce the following:

```scss
//
// Office UI Fabric
// --------------------------------------------------
// SCSS template for building a bundle of Fabric and Fabric Components CSS.

@import '../../../src/sass/_Fabric.Common.scss';

@import '../../../src/components/Button/Button.scss';
@import '../../../src/components/Link/Link.scss';
@import '../../../src/components/OrgChart/OrgChart.scss';
@import '../../../src/components/Persona/Persona.scss';
@import '../../../src/components/PersonaCard/PersonaCard.scss';
```

#### Neither excludes nor includes
If neither "excludes" nor "includes" are specified, the bundle will include all of Fabric's CSS.


### `gulp Bundles`
Then, open a Command Prompt or Terminal window and navigate to the root of your cloned Fabric folder, then run `gulp Bundles`. Each bundle object will build into a full and minified CSS file in `dist/bundles/{name}`. To see the .scss file that makes up the bundle, check `dist/bundles/{name}.scss`.
