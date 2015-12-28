#Contributing

Office UI Fabric is an evolving snapshot of the Office 365 Design Language - from one of the Microsoft Design Studios that works with it. This means that it is updated frequently, and exists as a source of truth to help everyone build consistent Office 365 experiences.

For this reason, some of the fundamental elements - iconography, typography, animations, and color - aren't intended to be modified unless the official Design Language changes. You should feel free to modify them for your own projects, but pull requests (PRs) that propose modifications or additions to these elements will likely not be accepted. Otherwise, we will review all PRs, but not all may be accepted.

Missing a glyph in the icon font? Though we don't officially support them, you can use alternative icon font solutions like [Fontello](http://fontello.com/), [Icomoon](https://icomoon.io/app/#/select), or [Fontastic](http://fontastic.me/) to fill in those gaps.

**Don't modify CSS (this is just the output of our LESS) or anything in `dist/`.**

### Pull Requests
We gladly welcome PRs regarding…
- Bug fixes (of course!)
- Variants on components
- Documentation updates
- Things we haven't thought of yet :-)

### Feature Requests
Please be sure to open an issue before starting a hefty PR so we can let you know if we're likely to consider your request--and to make sure we aren't already planning on doing the work.

### Contribution License Agreement
For pull requests affecting fewer than 15 lines of code, you will need to sign a [Contribution License Agreement (CLA)](https://cla.microsoft.com/) before your contribution can be incorporated. To complete the CLA, you will need to submit the request via the form and then electronically sign the CLA when you receive the email containing the link to the document.

This needs to only be done once for any Microsoft open source project.

### Labels for Issue Tracker

We track community issues via Github's issue tracker. To help us keep track of the different areas, please use the following labels:

- `question` - Feel free to ask questions via the question tag.
- `browser` - Issues that pertain to a specific browser. Screenshots and details are much appreciated!
- `docs` - Issues pertaining to our documentation.
- `feature` - Issues requesting a new feature to be added or extended from an existing feature.
- `gulp` - Issues with our included gulpfile.
- `js` - Issues that result from the example JavaScript referenced or included within Office UI Fabric.
- `meta` - issues with the overall project or the Github repository.
- `components` - Issues specific to our CSS components.
- `grid` - Issues pertaining to the responsive grid.
- `type` - Issues pertaining to our typography and related classes.
- `icons` - Issues pertaining to our iconography and icon related classes.
