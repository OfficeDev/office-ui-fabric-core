![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#Building Fabric, Gulp Tasks, and the Starter Template

Office UI Fabric uses gulp to compile its LESS, build and serve demos, and generate/watch other parts of the framework for changes. Use it to customize Fabric to suit your project, or to test out changes you might want to make to specific aspects of the toolkit.

##Contents

- [Building Fabric](#building-fabric)
- [Gulp Tasks](#gulp-tasks)
- [Starter Template](#starter-template)

##Building Fabric

Before you get started, make sure you have [node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed.

1. Clone the repo
2. Navigate to the folder containing Fabric's gulpfile.js (Fabric's root)
3. npm install
4. gulp
5. The built files will be in `/dist/`

##Gulp Tasks

There are lots of ways to test and work with Fabric locally. Check out the tasks below to see how:

###gulp

This task will build all parts of Fabric once, and move all build/changed files into `/dist/`. Every time you make changes, you will need to re-run this task.

**Best used for building Fabric once after making changes.**

###gulp watch

This task will build all parts of Fabric, and then rerun every time you make a change to any of the following folders: 
- `/src/components/`
- `/src/less/`
- `/src/samples/`
- `/src/templates/`

**Best used for building all of Fabric when you make any changes.**

###gulp watch:components-samples

This task will build only component samples and watch for changes within `/src/components/`. After the build runs, you can test your components by opening the `index.html` file located in any component inside `/dist/samples/Components/`.

**Best used for tweaking and testing components.**

**NOTE:** This task does not update `/dist/components/`, it just updates `/dist/samples/Components/`.

###gulp watch:fabric-components

This task watches `/src/components/` and builds the big fabric.components.css file that goes in `/dist/css/`. It also updates `/dist/components/`.

**Best used for seeing your component changes in fabric.components.css.**

###gulp watch:samples

This task watches the samples within `/src/samples/`, builds them, and moves them to `/dist/samples/`.

**Best used when you are working on samples and want to test them.**

###gulp watch:fabric

This task builds all `/src/less/` files and outputs them together in `/dist/css/`.

**Best used when you are working on fonts, mixins, colors, terse, etc. (core Fabric).**

##Starter Template

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