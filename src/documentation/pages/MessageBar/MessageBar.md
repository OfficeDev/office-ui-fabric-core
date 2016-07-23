# Message Bar

## Variants

### Default
Lowest level of caution. Use when you want to present timely, concise information that accelerates a workflow, or to provide key information or actions that avoid a dead end in the experience.

<!---
{{> MessageBar props=MessageBarExampleProps.default }}
--->

### Warning
Use in exceptional situations where the use should be mindful of some sort of temporary condition.  Notably, yellow is the most visible color to the human eye.

<!---
{{> MessageBar props=MessageBarExampleProps.warning }}
--->

### Severe Warning
Use for a situation that is not harmful or destructive yet but could easily turn into one. (e.g. You're about to run out of storage space).

<!---
{{> MessageBar props=MessageBarExampleProps.severeWarning }}
--->

### Error
Use when a serious failure or error has occured and information may have been lost or some actions are impossible.

<!---
{{> MessageBar props=MessageBarExampleProps.error }}
--->

### Blocked
Use when the user is explicitly forbidden from a particular action not because of an error, but because of security restrictions or policy enforcements.

<!---
{{> MessageBar props=MessageBarExampleProps.blocked }}
--->

### Success
Use sparingly when there's an exceptional need to tell the use that something went right. The preferred way to show success is to show, not tell (e.g. by navigating to show the result of the user action and letting users continue working on it or elsewhere).

<!---
{{> MessageBar props=MessageBarExampleProps.success }}
--->

## Dependencies
Link
