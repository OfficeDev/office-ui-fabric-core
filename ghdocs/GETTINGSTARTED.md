![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

##Getting started

###Contents

- [Building Fabric](#building-fabric)
- [Add to your project](#add-to-your-project)
- [Starter template](#starter-template)
- [Supported browsers](#supported-browsers)

#####Building Fabric

After you've cloned Fabric, you can take the following steps to build Fabric:

On a Windows Machine:

1. Install Node.js via http://nodejs.org
2. Install git via https://git-scm.com/
3. Clone the repo
4. Navigate to the folder containing Fabric's gulpfile.js (Fabric's root)
5. npm install -g gulp
6. npm install -g typescript
7. npm install
8. gulp
9. The built files will be in dist/

On a Mac:

1. Install Node.js via http://nodejs.org
2. Install git via https://git-scm.com/
3. Clone the repo
4. Navigate to the folder containing Fabric's gulpfile.js (Fabric's root)
5. sudo npm install -g gulp
6. sudo npm install -g typescript
7. npm install
8. gulp
9. The built files will be in dist/

#####Add to your project

You don't have to rethink your front-end architecture to start using Fabric in your existing app, but some simple setup is required. Follow these steps to get started:

1. If using a downloaded copy: After downloading and unpacking, move the Fabric folder to a location within your project. We recommend placing Fabric either at the project root or within a "lib" type of folder.
2. Add a reference to fabric.css in the `<head>` tag of your HTML file before any application-specific CSS. This ensures that you can specify overrides and additional styles with application-specific stylesheets.
3. If you're using Fabric components, add a reference to fabric.components.css in the `<head>` after fabric.css.
4. Optionally, you may choose to include Fabric Components' JavaScript, which is demonstration-only and should not be considered production-ready. We generally recommend against doing this, since the code is not extensively tested and is used only for demonstration on the Component Picker. If you'd still like to include it, add a `<script>` tag with a reference to fabric.components.min.js at the end of your page's `<body>` tag.

#####Starter template

The starter template below represents the minimal recommended HTML structure for an app using Fabric. Copy the code into your project to start working with a basic Fabric document.

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Application Name</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Fabric core -->
		<link rel="stylesheet" href="css/fabric.min.css">
		<link rel="stylesheet" href="css/fabric.components.min.css">
		<!-- Application-specific CSS -->
		<link rel="stylesheet" href="/css/[your application].css">
	</head>
	<body>
		<!-- Application content goes here -->
		<h1 class="ms-font-su">Why, hello, world.</h1>
		<!-- optionally include jQuery to use Fabric Component's jQuery plugins -->
		<script type="text/javascript" src="js/jquery.js"></script>
	</body>
</html>
```

#####Supported browsers

Fabric meets the Office 365 browser support requirements for desktop and mobile devices. This includes support for the latest versions of Chrome, Firefox, Safari, and IE 9 and greater.

|| **Chrome (latest stable)** | **Firefox (last 2 versions)** | **Safari (latest)** | **IE8** | **IE9** | **IE10** | **IE11** | **Edge** |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Windows | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![x](http://odux.azurewebsites.net/github/img/x.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|
| Mac OS | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)| - | - | - | - | - |
| iOS (6+) | - | - |![check](http://odux.azurewebsites.net/github/img/check.png)| - | - | - | - | - |
| Android (4.4+)| ![check](http://odux.azurewebsites.net/github/img/check.png)| - | - | - | - | - | - | - |
| Windows Phone | - | - | - | - | - |![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|
