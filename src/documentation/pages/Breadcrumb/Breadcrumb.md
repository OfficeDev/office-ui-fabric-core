# Breadcrumb
Breadcrumbs should be used as a navigational aid in your app or site. They indicate the current page’s location within a hierarchy and help the user understand where they are in relation to the rest of that hierarchy. They also afford one-click access to higher levels of that hierarchy. Breadcrumbs are typically placed, in horizontal form, under the masthead or navigation of an experience, above the primary content area.

## Best Practices
Do | Don't
--- | ---
Place Breadcrumbs at the top of a page, above a list of items, or above the main content of a page.  |  Don't use Breadcrumbs as a primary way to navigate an app or site.

## Variants

### Default
<!---
{{> BreadcrumbExample props=BreadcrumbExampleModel }}
--->
<!---
<pre>
  <code>
    {{renderPartialPre "Breadcrumb" "BreadcrumbExample" BreadcrumbExampleModel false}}
  </code>
</pre>
--->

## States

State | Applied to | Result
 --- | --- | ---
`.is-overflow` | `.ms-Breadcrumb` | Use this class to show an ellipsis, which opens a Contextual Menu of additional breadcrumbs. Without this class items that do not fit will be unavailable.
`.is-open` | `.ms-Breadcrumb-overflowMenu` | Displays the overflow menu.

## Dependencies
ContextualMenu

## Accessibility
The component's JavaScript will apply the correct `tabindex` values to ensure keyboard accessibility.
