# Button
Buttons are best used to enable a user to commit a change or complete steps in a task. They are typically found inside forms, dialogs, panels or pages. An example of their usage is confirming the deletion of a file in a confirmation dialog. When considering their place in a layout, contemplate the order in which a user will flow through the UI. As an example, in a form, the individual will need to read and interact with the form fields before submiting the form. Therefore, as a general rule, the button should be placed at the bottom of the UI container (a dialog, panel, or page) which holds the related UI elements. While buttons can technically be used to navigate a user to another part of the experience, this is not recommended - unless that navigation is part of an action or their flow.

### Best Practices  
Do | Don't  
--- | ---  
Make sure the label conveys a clear purpose of the button to the user. | Don't use generic labels like "Ok," especially in the case of an error; errors are never "Ok."
Button labels must describe the action the button will perform and should include a verb. Use concise, specific, self-explanatory labels, usually a single word. | Don’t place the default focus on a button that destroys data. Instead, place the default focus on the button that performs the "safe act" and retains the content (i.e. "Save") or cancels the action (i.e. "Cancel").
Buttons should always include a noun if there is any room for interpretation about what the verb operates on. | Don’t use a button to navigate to another place, use a link instead. The exception is in a wizard where "Back" and "Next" buttons may be used.
Consider the affect localization will have on the button and what will happen to components around it. | Don’t put too much text in a button - try to keep the length of your text to a minimum.
If the button’s label content is dynamic, consider how the button will resize and what will happen to components around it. | Don't put anything other than text in a button.
Use only a single line of text in the label of the button. | 
Expose only one or two buttons to the user at a time, for example, "Accept" and "Cancel". If you need to expose more actions to the user, consider using checkboxes or radio buttons from which the user can select actions, with a single command button to trigger those actions. |
Show only one primary button that inherits theme color at rest state. In the event there are more than two buttons with equal priority, all buttons should have neutral backgrounds. |
"Submit", "OK", and "Apply" buttons should always be styled as primary buttons. When "Reset" or "Cancel" buttons appear alongside one of the above, they should be styled as secondary buttons. |
Default buttons should always perform safe operations. For example, a default button should never delete. |
Use task buttons to cause actions that complete a task or cause a transitional task. Do not use buttons to toggle other UX in the same context. For example, a button may be used to open an interface area but should not be used to open an additional set of components in the same interface. |

## Variants

### Default
@@include('Button.html')

### Primary
Where multiple buttons are presented together, this is the default action when submitting the form.

@@include('Button.Primary.html')

### Command
Includes an icon.

@@include('Button.Command.html')

### Compound
Provides a second line of text to explain the action the button takes.

@@include('Button.Compound.html')

### Hero
Similar to the Command variant, but with a larger size to draw attention to important actions.

@@include('Button.Hero.html')

## States

State | Applied to | Result
 --- | --- | ---
`.is-disabled` | `.ms-Button` | When using an `<a>` element, apply this class to disable the button. When using a `<button>`, the `disabled` attribute can be used instead.

## Using this component
1. Confirm that you have references to Fabric's CSS on your page:
    ```
    <head>
        <link rel="stylesheet" href="fabric.min.css">
        <link rel="stylesheet" href="fabric.components.min.css">
    </head>
    ```
2. Copy the HTML from one of the samples above into your page. For example:
    ```
    <button class="ms-Button">
        <span class="ms-Button-label">Create account</span>
    </button>
    ```
3. Replace the sample HTML content (such as the content of `.ms-Button-label`) with your content.

## Dependencies
This component has no dependencies.

## Accessibility
Focus styles are included for keyboard navigation.
