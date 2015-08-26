![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#Getting started

##Contents

- [Build Fabric](#building-fabric)
- [Add Fabric to your project](#add-to-your-project)
- [Fabric starter template](#starter-template)
- [Supported browsers](#supported-browsers)

##Build Fabric

Use one of the following procedures to build Fabric.

On a Windows computer:

1. Install Node.js via [http://nodejs.org](http://nodejs.org).
2. Install git via [https://git-scm.com/](https://git-scm.com/).
3. Clone the Fabric repo.
4. Go to the folder that contains the gulpfile.js file (the Fabric root file).
5. Run the following:
	- npm install -g gulp
	- npm install -g typescript
	- npm install

On a Mac:

1. Install Node.js via [http://nodejs.org](http://nodejs.org).
2. Install git via [https://git-scm.com/](https://git-scm.com/).
3. Clone the repo.
4. Go to the folder containing the gulpfile.js file (the Fabric root file).
5. Run the following:
	- sudo npm install -g gulp
	- sudo npm install -g typescript
	- npm install

##Add Fabric to your project

You don't have to rethink your front-end architecture to start using Fabric in your existing app or add-in, but some simple setup is required. Follow these steps to get started:

1. If you downloaded Fabric, unpack it and move the Fabric folder to a location within your project. We recommend placing Fabric either at the project root or within a lib folder.
2. Add a reference to fabric.css in the `<head>` tag of your HTML file before any application-specific CSS. This ensures that you can specify overrides and additional styles with application-specific stylesheets.
3. If you're using Fabric components, add a reference to fabric.components.css in the `<head>` after fabric.css.

Optionally, you might choose to include the JavaScript code for Fabric components. We do not recommend that you do this because the code is not production-ready; it is demonstration-only for the Component Picker has not been extensively tested. If you do want to include it, add a `<script>` tag with a reference to fabric.components-.min.js at the end of the `<body>` tag on your page.

##Fabric starter template

The following starter template represents the minimum recommended HTML structure for an app or add-in that uses Fabric. Copy the code into your project to start working with a basic Fabric document.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Application Name</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Fabric core -->
		<link rel="stylesheet" href="css/fabric.min.css">
		<link rel="stylesheet" href="css/fabric.components.min.css">    <!-- Application-specific CSS -->
		<link rel="stylesheet" href="/css/[your application].css">
	</head>
	<body>
		<!-- Application content goes here -->
		<h1 class="ms-font-su">Why, hello, world.</h1>    <!-- jQuery - Needed for Fabric Components JS -->
		<script type="text/javascript" src="js/jquery.js"></script>
	</body>
</html>
```

##Supported browsers

Fabric meets the Office 365 browser support requirements for desktop and mobile devices. This includes support for the latest versions of Chrome, Firefox, Safari, and Internet Explorer.

|          | **Chrome (latest stable)** | **Firefox (last two versions)** | **Safari (latest)** | **Internet Explorer 8** | **Internet Explorer 9** | **Internet Explorer 10** |
|:--------:|:------------------------:|:---------------------------:|:-----------------:|:-----:|:-----:|:-------:|
|  Windows | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![x](http://odux.azurewebsites.net/github/img/x.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|
| Mac OS   | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)| -     | -     | -       |
| iOS (6+) | -                         | -                        |![check](http://odux.azurewebsites.net/github/img/check.png)| -     | -     | -       |
| Android (4.4+)| ![check](http://odux.azurewebsites.net/github/img/check.png)| -                   | -                        | -     | -     | -       |
| Windows Phone | -                    | -                        | -                        | -     | -     |![check](http://odux.azurewebsites.net/github/img/check.png)|