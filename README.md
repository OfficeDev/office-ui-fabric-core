![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#####The front-end framework for building experiences for Office 365.

Fabric is a responsive, mobile-first, front-end framework, designed to make it simple to quickly create web experiences using the Office Design Language. It’s simple and familiar to get up and running with Fabric—whether you’re creating a new app from scratch or adding new features to an existing one.

##Contents

- [Why Office UI Fabric?](#why-office-ui-fabric)
- [Changelog](#changelog)
- [Frequently asked questions](#frequently-asked-questions)
- [Getting started](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md)
	- [Building Fabric](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#building-fabric)
	- [Add to your project](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#add-to-your-project)
	- [Starter template](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#starter-template)
	- [Introductory tutorial](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#starter-template#introductory-tutorial)
	- [Supported browsers](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#supported-browsers)
- [Features](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md)
	- [Typography](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#typography)
	- [Color](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#color)
	- [Icons](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#icons)
	- [Animations](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#animations)
	- [Responsive Grid](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#responsive-grid)
		- [How to use](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#how-to-use)
		- [Inheritance](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#inheritance)
		- [Push and pull](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#push-and-pull)
	- [Localization](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#localization)
		- [Right-to-left support](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#right-to-left-support)
		- [Language-optimized fonts](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#language-optimized-fonts)
- [Components](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md)
	- [Inputs](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#inputs)
	- [Layout](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#layout)
	- [Navigation](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#navigation)
	- [Content](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#content)
- [Contributing](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/CONTRIBUTING.md)


##Why Office UI Fabric?

- Fabric is just like other popular frameworks, but built from the ground up for O365 so there's no excessive overriding.
- Fabric is all about styling instead of JavaScript so you can focus on your look and feel.
- Pick your icons to reduce the size of Fabric.
- Built with [**LESS**](http://lesscss.org/) for powerful customization. 
- Components help you nail down common elements like buttons, dropdowns, and lists.
- Fabric plays well with other frameworks like Bootstrap with uniquely namespaced classes to prevent conflicts.
- Full breadth of language support (including Right-to-Left behavior) help take the guesswork out of localization.


##Changelog
- View a complete list of additions, fixes, and changes in the [changelog](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/CHANGELOG.md).


##Frequently asked questions

#####How does Fabric compare to frameworks like Bootstrap and Foundation?
Fabric solves many of the same problems as other front-end frameworks, in a way that is specific to the needs of Microsoft. We have our own design language and interaction patterns that all Microsoft apps share. Fabric speeds up development like the other frameworks, while ensuring that apps use standard typography, colors, icons, and more. This reduces the time that developers must spend overriding the styles of other frameworks. It also includes components the other frameworks don’t have.

#####Can Fabric co-exist with other frameworks? Existing styles?
Yes, Fabric applies styles on an opt-in basis only. It does not style standard HTML elements, like headings and form elements. Namespaced classes prevent conflicts with other frameworks. So you can safely add Fabric to an existing app or use it alongside another framework of your choice.

#####A feature I'm using is deprecated. When will it be removed?
Typically, we remove deprecated features from the subsequent major release after we announce the deprecation. For example, you can expect that a feature that is deprecated in version 1.6.0 will no longer be available in version 2.0.

#####How often do you release Fabric?
We add new features in minor versions (e.g. x.**Y**.z), typically released every month. Bug fixes and minor tweaks may be included in patch versions (e.g. x.y.**z**) which are released as necessary. Whenever we put out a new release, be sure to visit the [changelog](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/CHANGELOG.md) to see the details of what’s new. This may include breaking changes that you should be aware of.
