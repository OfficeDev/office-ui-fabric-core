#Get started with Fabric 2.6.1

The last stable version of Fabric that included components was 2.6.1, and, although we recommend [Fabric React](https://github.com/OfficeDev/office-ui-fabric-react) or the existing Fabric Core, 2.6.1 and previous versions are still available via the CDN, package managers, and GitHub for cloning or downloading.


###Download 
The simplest way to get started is to add a copy of Fabric to your project.

1. Download the source code zip file from the [2.6.1 release](https://github.com/OfficeDev/office-ui-fabric-core/releases/tag/2.6.1) (or earlier) on GitHub.
2. Unzip the file and copy the Fabric folder into your project.
3. Add a reference to `fabric.css` in the `<head>` of your page. Make sure the path is correct.
4. If you're using components, add a reference to `fabric.components.css` after the `fabric.css` reference.


###CDN
If you prefer to have your project's assets stored on an external server, Fabric is available from the apps for Office CDN. To use it, include the following references in the `<head>` of your page.
```html
<link rel="stylesheet" href="https://appsforoffice.microsoft.com/fabric/2.6.1/fabric.min.css">
<link rel="stylesheet" href="https://appsforoffice.microsoft.com/fabric/2.6.1/fabric.components.min.css">
```

All previous versions through to 2.6.1 are available on the CDN. To reference a specific version, update the version number in the URL to match the one you want.


###Package managers
Fabric 2.6.1 is available via Bower, npm, and NuGet.

####Install with Bower
To install Fabric using Bower, run the following command:
```
$ bower install office-ui-fabric
```

####Install with npm
To install Fabric using npm, run the following command:
```
$ npm install office-ui-fabric
```

####Install with NuGet Package Manager
To install Fabric's NuGet package, run the following command in the [package manager console](http://docs.nuget.org/consume/package-manager-console):
```
PM> Install-Package OfficeUIFabric
```

###Clone and build locally
Office UI Fabric uses [gulp](http://gulpjs.com/) to compile its styling, build and serve demos, and generate or watch other parts of the framework for changes. Use it to customize Fabric for your project, or to test changes you make to specific aspects of the toolkit.


####Building Fabric

Before you get started, make sure you have [node.js](https://nodejs.org/), [gulp](http://gulpjs.com/), and [git](https://git-scm.com/) installed. To build Fabric:

1. Clone the the Core project
2. Checkout the branch for the 2.6.1 release: `git checkout release/2.6.1` from the command line
3. Navigate to the folder that contains the gulpfile.js file (Fabric's root)
4. `npm install`
5. `gulp`

The built files will be in the `/dist/` folder.

####Gulp tasks

You can test and work with Fabric locally using the tasks below.

#####gulp

Builds everything incrementally. This will run slowly the first time and very quickly on subsequent runs. This task will build all parts of Fabric and move all changed files into `/dist/`. Every time you make changes, re-run this task.

#####gulp watch

Builds and watches everything. After running this once, your builds will be a lot faster. Now if you make a change anything anywhere in Fabric, only that area/section/file will get built/changed/moved.

Using this, you can also view the localhost documentation site with examples for all of the components.

#####gulp watch-debug

This task is similar to `gulp watch` except you can now get a readout of what files are in the pipe. This will be helpful to make sure that the build is working properly. 

#####gulp watch-sass

Builds and watches everything but builds only Sass versions of our core library files.

#####gulp watch-sass-debug

Builds and watches everything but uses the Sass versions of the files and gives a readout of files in the pipe.

#####gulp Bundles

Builds all bundles specified in `gulp/modules/Config.js`. View more details in the [Bundling](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/BUNDLING.md)


####Starter template

The following starter template represents the minimum recommended HTML structure for an app or add-in that uses Fabric. Copy the code into your project to start working with a basic Fabric document.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Application Name</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Optionally include jQuery to use Fabric's Component jQuery plugins -->
    <script type="text/javascript" src="js/jquery.js"></script>

    <!-- Fabric core -->
    <link rel="stylesheet" href="css/fabric.min.css">
    <link rel="stylesheet" href="css/fabric.components.min.css">

    <!-- Application-specific CSS -->
    <link rel="stylesheet" href="/css/app.css">
  </head>
  <body>
    <!-- Application content goes here -->
    <h1 class="ms-font-su">Why, hello, world.</h1>

    <!-- Optionally include Fabric's Component jQuery plugins -->
    <script type="text/javascript" src="js/jquery.fabric.min.js"></script>
  </body>
</html>
```
