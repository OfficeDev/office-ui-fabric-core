![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#####The front-end framework for building experiences for Office 365.

Fabric is a responsive, mobile-first, front-end framework, designed to make it quick and simple for you to create web experiences using the Office Design Language. It’s easy to get up and running with Fabric—whether you’re creating a new Office Add-in from scratch or adding new features to an existing one.

##Contents

- [Why Office UI Fabric?](#why-office-ui-fabric)
- [Why open source?](#why-open-source)
- [Frequently asked questions](#frequently-asked-questions)
- [Documentation](#Documentation)
- [Change log](#change-log)


##Why Office UI Fabric?

- Fabric is just like other popular frameworks, but built from the ground up for Office 365 so there's no excessive overriding.
- Fabric is all about styling instead of JavaScript so you can focus on your look and feel.
- You can pick your icons to control the size of your UI.
- Fabric is built with **LESS** for powerful customization. 
- Components help you create common elements like buttons, form fields, and lists.
- Fabric integrates with other frameworks like Bootstrap. Uniquely namespaced classes prevent conflicts.
- Full language support (including right-to-left behavior) helps take the guesswork out of localization.

##Why open source?

The Office UI Fabric project was developed by the **OneDrive and SharePoint Design Studio** in order to…
- Help the broader development community build add-ins and applications for Office 365.
- Provide a point of reference for the evolving Office 365 Design Language.
- Create a community around the Office 365 UI/UX that contributes to better experiences for everyone who builds for Office 365.

We will do our best to release frequently and keep the community up-to-date with changes to the Design Language, components, and other assets. We also have to evolve quickly. This means that everyone gets the latest designs, but that features and assets can change often. Deprecated features will be marked in our change log, and will be removed from the third release following the deprecation announcement.

##Frequently asked questions

#####How does Fabric compare to frameworks like Bootstrap and Foundation?
Fabric solves many of the same problems that other front-end frameworks do, in a way that is specific to Microsoft. We have our own design language and interaction patterns that all Microsoft apps share. Like other frameworks, Fabric speeds up development by ensuring that your add-ins use standard typography, colors, icons, and more. You don't have to spend time overriding the styles of other frameworks. Fabric also includes components the other frameworks don’t have.

#####Can Fabric co-exist with other frameworks or existing styles?
Yes, Fabric applies styles on an opt-in basis only. It does not style standard HTML elements, like headings and form elements. Namespaced classes prevent conflicts with other frameworks. You can safely add Fabric to an existing add-in or use it alongside another framework of your choice.

#####A feature I'm using is deprecated. When will it be removed?
Typically, we remove deprecated features in the third release after we announce the deprecation. For example, you can expect that a feature that is deprecated in version 0.6.0 will no longer be available in version 0.9.0.

#####How often do you release Fabric?
We add new features in minor versions (for example, x.**Y**.z), which we typically release every month. Bug fixes and minor tweaks might be included in patch versions (for example, x.y.**Z**) which we release as necessary. Whenever we put out a new release, be sure to visit the change log for details about what’s new. This might include breaking changes that you should be aware of.

##Documentation

- [Getting started](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md)
	- [Building Fabric](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#building-fabric)
	- [Add to your project](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#add-to-your-project)
	- [Starter template](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/GETTINGSTARTED.md#starter-template)
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

##Change log
- V1 release.
