# Fabric Roadmap

## Planned Work
- **Create TypeScript implementations of each component.** This will remove our dependency on jQuery, which most teams are not in favor of, and standardize our code samples. Of course you are always free to write your own JavaScript or use whatever framework you prefer to interact with Fabric styles and components.
- **Card component.** We're identifying the most common scenarios and getting design support to have this added. See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/152).
- **Searchable dropdown component.** See [this issue](https://github.com/OfficeDev/Office-UI-Fabric/issues/130) for the original request.
- **Improved component documentation.** Our website will be updated with more details on what each component should be used for, and how to make it work in your project.
- **Simple pagination component.** As requested in [this issue](https://github.com/OfficeDev/Office-UI-Fabric/issues/131).

## Possible Future Improvements
- **Provide standard layouts for building full-page apps.** We've received a [request for this feature](https://github.com/OfficeDev/Office-UI-Fabric/issues/284) and it's something we'd like to add once we have a more clearly-defined set of UI patterns. For now, please send us screenshots of your full-page apps so that we can understand what common layouts we could provide.
- **Additional samples of Fabric classes and components in use.** We currently provide a basic form example and the video portal example. These are a start, but we've [received requests](https://github.com/OfficeDev/Office-UI-Fabric/issues/301#issuecomment-184346264) for additional samples that show Fabric being used to build simple apps.
- **TreeView component.** See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/238) for details.
- **Code snippets for Visual Studio.** This would be nice to have but is not a priority for us at this time. See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/233) for details.
- **Custom HTML elements for components,** using something like [Polymer](https://www.polymer-project.org/). See the [original request](https://github.com/OfficeDev/Office-UI-Fabric/issues/223).
- **Single components file with both left-to-right and right-to-left.** We've had [one request](https://github.com/OfficeDev/Office-UI-Fabric/issues/210) for this so far and it's something we could consider adding if more people show interest. Right now it seems that most teams are okay with swapping out the CSS file depending on whether the page is being displayed as LTR or RTL.
- **Typeahead / Autocomplete component.** We've had a [request for this component](https://github.com/OfficeDev/Office-UI-Fabric/issues/504) and are currently investigating the styling for it. No timeframe at the moment, though.
- **Increment/decrement component.** We've had a [request for this component](https://github.com/OfficeDev/Office-UI-Fabric/issues/196) but have no need for it in product at this time. If anyone wants to build it and submit a pull request we can review the design and implementation and consider adding it.
- **File upload component.** This was [requested](https://github.com/OfficeDev/Office-UI-Fabric/issues/134) and is something we can see the value in, but do not have designs for at this time.
- **Input masks**. We've had a [request for this feature](https://github.com/OfficeDev/Office-UI-Fabric/issues/133) but do not have any plans to build it at this time.
- **Timer component.** This was [requested](https://github.com/OfficeDev/Office-UI-Fabric/issues/132) but is not something we plan to work on at this time.
- **Vertical navbar component.** See [the request](https://github.com/OfficeDev/Office-UI-Fabric/issues/122).
- **Icon requests.** Please submit an issue for any icons you'd like to see included with Fabric. Currently we have requests for:
 - [Pint](https://github.com/OfficeDev/Office-UI-Fabric/issues/113)
 - [Beer](https://github.com/OfficeDev/Office-UI-Fabric/issues/113)
 - [Tea](https://github.com/OfficeDev/Office-UI-Fabric/issues/113)
 - [Question mark inside of circle](https://github.com/OfficeDev/Office-UI-Fabric/issues/494)
- **App launcher component.** This was [requested](https://github.com/OfficeDev/Office-UI-Fabric/issues/81) and may be included in a future release of Fabric.
- **Slider component.** See [the request](https://github.com/OfficeDev/Office-UI-Fabric/issues/360).
- **Generic ListItem styles.** Our current ListItem component is for an email item, and contains many icons and pieces of text that developers are unlikely to need. We want to replace this with a small set of generic list items that can be used for most scenarios. We might also add list items specific to content, such as for showing a file.
- **Hosting JavaScript on CDN** See [the request](https://github.com/OfficeDev/Office-UI-Fabric/issues/496).
