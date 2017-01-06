# Code conventions

## Naming
When naming classes, animation keyframes, variables, and mixins, please follow these conventions:

- Everything in the global scope is prefixed with "ms-".
- CSS classes follow [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md).
    - `ms-Grid-col`
    - `ms-Icon--Airplane`
    - _Exception: Pascal case is used for the icon names:_ `ms-Icon--EraseTool`
- Animation keyframes all match their corresponding CSS class.
    - `@keyframes ms-slideRightIn10`
- Variables are kebab case.
    - `$ms-animation-duration-3`
    - `$ms-screen-min-xl`
    - _Exception: camel case is used for colors to match class names:_ `$ms-color-themeLighterAlt`
- Mixins are usually kebab case.
    - `ms-focus-border()`
    - `ms-drop-shadow()`
    - _Exception: If the mixin maps directly to a CSS class, we match the class name:_
        - `ms-u-borderBox()` outputs to `.ms-u-borderBox`
        - `ms-fontSize-s()` outputs to `.ms-fontSize-s`
