# Fabric Roadmap

## Planned Work
- **Create TypeScript implementations of each component.** This will remove our dependency on jQuery, which most teams are not in favor of, and standardize our code samples. Of course you are always free to write your own JavaScript or use whatever framework you prefer to interact with Fabric styles and components.

## Possible Future Improvements
- **Provide standard layouts for building full-page apps.** We've received a [request for this feature](https://github.com/OfficeDev/Office-UI-Fabric/issues/284) and it's something we'd like to add once we have a more clearly-defined set of UI patterns. For now, please send us screenshots of your full-page apps so that we can understand what common layouts we could provide.
- **TreeView component.** See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/238) for details.
- **Code snippets for Visual Studio.** This would be nice to have but is not a priority for us at this time. See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/233) for details.
- **Custom HTML elements for components,** using something like [Polymer](https://www.polymer-project.org/). See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/223).
- **Single components file with both left-to-right and right-to-left.** We've had [one request](https://github.com/OfficeDev/Office-UI-Fabric/issues/210) for this so far and it's something we could consider adding if more people show interest. Right now it seems that most teams are okay with swapping out the CSS file depending on whether the page is being displayed as LTR or RTL.
- **Increment/decrement component.** We've had a [request for this component](https://github.com/OfficeDev/Office-UI-Fabric/issues/196) but have no need for it in product at this time. If anyone wants to build it and submit a pull request we can review the design and implementation and consider adding it.
