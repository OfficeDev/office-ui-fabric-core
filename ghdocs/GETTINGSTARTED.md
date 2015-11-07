![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#Getting started

##Contents

- [Getting Fabric](#getting-fabric)
- [Building Fabric](#building-fabric)
- [Add Fabric to your project](#add-to-your-project)
- [Fabric samples](#fabric-samples)
- [Introductory tutorial](#introductory-tutorial)
- [Supported browsers](#supported-browsers)

##Getting Fabric

####Download Fabric
Uncompressed, minified, uncompressed right-to-left, and minified right-to-left versions of Fabric and Fabric Components CSS are available in the `dist/` folder of the [Office UI Fabric .zip](https://github.com/OfficeDev/Office-UI-Fabric/archive/1.0.0.zip). Use minified versions of the files in production; use uncompressed versions for development or debugging. On pages that use right-to-left languages, load right-to-left versions instead of non-right-to-left versions of files.

####Reference Fabric from a CDN
To reference Fabric CSS from a CDN, include a link in the `<head>` element on the page using Fabric:

```html
<link rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.min.css">
```

The uncompressed, minified, and right-to-left CSS files are also available on the CDN.

##Building and testing Fabric

For information about how to build and tweak Fabric and use its gulp tasks, see [Building Fabric](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/BUILDING.md).

##Add Fabric to your project

You don't have to rethink your front-end architecture to start using Fabric in your existing app or add-in, but some simple setup is required. Follow these steps to get started:

1. If using a downloaded copy: After downloading and unpacking, move the Fabric folder to a location within your project. We recommend placing Fabric either at the project root or within a "css" type of folder.
2. Add a reference to fabric.css in the `<head>` tag of your HTML file before any application-specific CSS. This ensures that you can specify overrides and additional styles with application-specific stylesheets.
3. If you're using Fabric components, add a reference to fabric.components.css in the `<head>` after fabric.css.
4. Optionally, you can choose to include Fabric Components' JavaScript, which is demonstration-only and should not be considered production-ready. We generally recommend against doing this because the code is not extensively tested and is used only for demonstration purposes in our documentation. If you'd still like to include it, add a `<script>` tag with a reference to `jquery.fabric.js` or `jquery.fabric.min.js` at the end of your page's `<body>` tag. Note that each plugin will need to be invoked in order to run.

##Fabric samples

To see several examples of Fabric in use, check out the sample HTML projects under `dist/samples`. The following samples are included:
- **Office Add-in**. A simple Office add-in that showcases the use of Fabric and some of its components. This sample has [its own project](https://github.com/OfficeDev/Office-Add-in-Fabric-UI-Sample). 
- **Form**: A simple sign-up form which uses Fabric's typography and color classes as well as various form elements.
- **VideoPortal**: A mock "video portal" application, which makes use of Fabric's responsive grid, components, typography & color classes, and LESS variables & mixins.
- **Icons**: A page demonstrating each icon font glyph available in Fabric.
- **Components**: Each component includes an HTML file demonstrating its usage and visual variants, as well as standalone uncompressed and minified CSS files that include only the styles necessary to render that component. This is useful for reducing page weight, since you can include only the CSS for components you actually intend to use.
  - **Note**: Some components depend on other components' styles to render properly. For example, TextField depends on Label for its text labels. Those style dependencies are included in the standalone CSS files, so be aware that using several standalone files together can result in duplicate CSS being served when the page is loaded.

To see how to build and watch the samples, check out the detailed instructions [here](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/BUILDING.md#gulp-tasks)

##Introductory tutorial

We provide a [Fabric tutorial](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/TUTORIAL.md) that explains the essentials of how to set up and use Fabric and Fabric Components in a simple ToDo application. 

If you're building an Office Add-in, you can find simple instructions for using the compiled version right away in the article [Using Fabric with Office Add-ins](https://msdn.microsoft.com/EN-US/library/office/6f46dd69-2ba3-4b0f-9735-7d7394ca2731.aspx).

##Supported browsers

Fabric meets the Office 365 browser support requirements for desktop and mobile devices. This includes support for the latest versions of Chrome, Firefox, Safari, and Internet Explorer.

|| **Chrome (latest stable)** | **Firefox (last 2 versions)** | **Safari (latest)** | **Internet Explorer 8** | **Internet Explorer 9** | **Internet Explorer 10** | **Internet Explorer 11** | **Edge** |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Windows | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![x](http://odux.azurewebsites.net/github/img/x.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|
| Mac OS | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)| - | - | - | - | - |
| iOS (6+) | - | - |![check](http://odux.azurewebsites.net/github/img/check.png)| - | - | - | - | - |
| Android (4.4+)| ![check](http://odux.azurewebsites.net/github/img/check.png)| - | - | - | - | - | - | - |
| Windows Phone | - | - | - | - | - |![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|
