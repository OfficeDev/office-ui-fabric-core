# Code conventions

## Naming
When naming classes, animation keyframes, variables, and mixins, please follow these conventions:

- Everything in the global scope is prefixed with "ms-".
- CSS classes remain unchanged (following [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md)).
    - `ms-Grid-col`
- Animation keyframes all match their corresponding CSS class.
    - `@keyframes ms-slideRightIn10`
- Variables are kebab case.
    - `$ms-animation-duration-3`
    - `$ms-screen-min-xl`
    - `$ms-color-themeLighterAlt` (_Exception: camel case is used for colors to match class names_)
- Mixins are usually kebab case.
    - `ms-focus-border()`
    - `ms-drop-shadow()`
    - _Unless the mixin has a direct mapping to a CSS class_, in which case it matches the name:
        - `ms-u-borderBox()` outputs to `.ms-u-borderBox`
        - `ms-fontSize-s()` outputs to `.ms-fontSize-s`
