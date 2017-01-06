#Contributing

Office UI Fabric is an evolving snapshot of the Office 365 Design Language, provided by one of the Microsoft Design Studios that works with it. This means that it is updated frequently and exists as a source of truth to help everyone build consistent Office 365 experiences.

For this reason, some of the fundamental elements - iconography, typography, animations, and color - aren't intended to be modified unless the official design language changes. You should feel free to modify them for your own projects, but pull requests (PRs) that propose modifications or additions to these elements will likely not be accepted. Otherwise, we will review all PRs, but not all may be accepted.

Missing a glyph in the icon font? Though we don't officially support them, you can use alternative icon font solutions like [Fontello](http://fontello.com/), [Icomoon](https://icomoon.io/app/#/select), or [Fontastic](http://fontastic.me/) to fill in those gaps.

**Don't modify CSS (this is just the output of our Sass) or anything in `dist/`.**

### Pull requests
We gladly welcome PRs regarding…
- Bug fixes (of course!)
- Variants on components
- Documentation updates
- Things we haven't thought of yet :-)

When creating a pull request, please describe in detail the problem you are solving and reference an [open issue](https://github.com/OfficeDev/Office-UI-Fabric/issues) if possible. Screenshots or a [demonstration on CodePen](http://codepen.io/pen?template=gPGzgX) are also appreciated. 

### Feature requests
Please be sure to open an issue before starting a hefty PR so we can let you know if we're likely to consider your request--and to make sure we aren't already planning on doing the work.

### Naming conventions
See the [code conventions](https://github.com/OfficeDev/office-ui-fabric-core/blob/master/ghdocs/CONVENTIONS.md) for details on what to name CSS classes, animation keyframes, variables, and mixins.

### Contribution license agreement
For pull requests affecting fewer than 15 lines of code, you will need to sign a [Contribution License Agreement (CLA)](https://cla.microsoft.com/) before your contribution can be incorporated. To complete the CLA, you will need to submit the request via the form and then electronically sign the CLA when you receive the email containing the link to the document.

This needs to only be done once for any Microsoft open source project.

### Issue tracker labels

We track community issues via GitHub's [issue tracker](https://github.com/OfficeDev/Office-UI-Fabric/issues). To help us keep track of the different areas, please use the following labels:

 - `accessibility` - Issues or PRs that pertain to keyboard support, high contrast mode, screen reader support, etc.
 - `bug` - Issues or PRs that address unexpected behavior or broken components.
 - `build-system` - Issues and PRs related to the build process.
 - `documentation` - Issues and PRs that pertain to the documentation included with the repository.
 - `enhancement` - Issues or PRs that address potential improvements to components.
 - `feature-request` - Issues or PRs that address, ask for, or add a major piece of functionality.
 - `needs-design` - Issues or PRs that need Design guidance.
 - `needs-discussion` - Issues or PRs that need discussion among the Fabric team.
 - `question` - Issues that don't necessarily require code and usually consist of clarifications.
 - `waiting-for-author` - Issues or PRs that are awaiting a repsonse from the original author.
 - `waiting-for-details` - Issues or PRs that need more details before they can be acted upon.
 - `waiting-to-merge` - PRs that are close to being merged in but are stalled.
