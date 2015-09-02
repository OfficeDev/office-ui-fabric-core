![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#####The front-end framework for building experiences for Office and Office 365.

Fabric is a responsive, mobile-first, front-end framework, designed to make it quick and simple for you to create web experiences using the Office Design Language. It’s easy to get up and running with Fabric—whether you’re creating a new Office experience from scratch or adding new features to an existing one.

##Contents

- [Why Office UI Fabric?](#why-office-ui-fabric)
- [Why open source?](#why-open-source)
- [Support](#support)
- [Frequently asked questions](#frequently-asked-questions)
- [Documentation](#documentation)
- [Changelog](#changelog)


##Why Office UI Fabric?
- Fabric embodies the Microsoft Design Language. You get to use the same design language used in Microsoft products, so your experiences feel tightly integrated into Office.  
- Fabric is just like other popular frameworks so it's easy to use. CSS classes, HTML, and JavaScript samples - everything you need to get going building great looking experiences.
- Fabric is built from the ground up for Office so there is no excessive overriding of pre-existing frameworks.
- Fabric integrates with other frameworks like Bootstrap. Uniquely namespaced classes prevent conflicts.
- Fabric is built with **LESS** for powerful customization.
- Full language support (including right-to-left behavior) helps take the guesswork out of localization.
- Full access to the source code and samples. You can tailor Fabric to your own specific needs. 

##Why open source?

The Office UI Fabric project is developed and maintained by the **OneDrive and SharePoint Design Studio** in order to...
- Help the broader development community build add-ins and applications for Office 365.
- Provide a point of reference for the evolving Office 365 Design Language.
- Create a community around the Office 365 UI/UX that contributes to better experiences for everyone who builds for Office.

We will do our best to release frequently and keep the community up-to-date with changes to the Design Language, components, and other assets. We also have to evolve quickly. This means that everyone gets the latest designs, but that features and assets can change often. Deprecated features will be marked in our changelog, and will be removed from the next major release following the deprecation announcement.

##Support

If you have any issues, we will do our best to respond but we can't guarantee timely responses. Support is limited.

If you have a specific bug, feature request, or question, post it via the [issue tracker](https://github.com/OfficeDev/Office-UI-Fabric/issues). For more info and labels, see our [contributing](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/CONTRIBUTING.md) section.

##Frequently asked questions

#####How does Fabric compare to frameworks like Bootstrap and Foundation?
Fabric solves many of the same problems that other front-end frameworks do, in a way that is specific to Microsoft. We have our own design language and interaction patterns that all Microsoft apps share. Like other frameworks, Fabric speeds up development by ensuring that your add-ins use standard typography, colors, icons, and more. You don't have to spend time overriding the styles of other frameworks. Fabric also includes components the other frameworks don’t have.

#####Can Fabric co-exist with other frameworks or existing styles?
Yes, Fabric applies styles on an opt-in basis only. It does not style standard HTML elements, like headings and form elements. Namespaced classes prevent conflicts with other frameworks. You can safely add Fabric to an existing add-in or use it alongside another framework of your choice.

#####A feature I'm using is deprecated. When will it be removed?
Typically, we remove deprecated features from the subsequent major release after we announce the deprecation. For example, you can expect that a feature that is deprecated in version 1.6.0 will no longer be available in version 2.0.

#####How often do you release Fabric?
We add new features in minor versions (for example, x.**Y**.z), which we typically release approximately every two weeks. Bug fixes and minor tweaks might be included in patch versions (for example, x.y.**Z**) which we release as necessary. Whenever we put out a new release, be sure to visit the change log for details about what’s new. This might include breaking changes that you should be aware of.

#####How is Fabric Licensed?

- All files on the Office UI Fabric GitHub repository are subject to the MIT license. Please read the License file at the root of the project. 
- Usage of the fonts referenced on Office UI Fabric files is subject to the terms listed [here](http://aka.ms/fabric-font-license) 

##Documentation

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
	- [Localization](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/FEATURES.md#localization)
- [Components](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md)
	- [Inputs](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#inputs)
	- [Layout](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#layout)
	- [Navigation](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#navigation)
	- [Content](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/COMPONENTS.md#content)
- [Contributing](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/CONTRIBUTING.md)

##Changelog
- View a complete list of additions, fixes, and changes in the [changelog](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/CHANGELOG.md).
