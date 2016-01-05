#Building Fabric, gulp tasks, and the starter template

Office UI Fabric uses gulp to compile its LESS, build and serve demos, and generate or watch other parts of the framework for changes. Use it to customize Fabric for your project, or to test changes you make to specific aspects of the toolkit.

##Contents

- [Building Fabric](#building-fabric)
- [Gulp tasks](#gulp-tasks)
- [Starter template](#starter-template)

##Building Fabric

Before you get started, make sure you have [node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed. To build Fabric:

1. Clone the repo.
2. Navigate to the folder that contains the gulpfile.js file (Fabric's root).
3. npm install
4. gulp

The built files will be in the `/dist/` folder.

##Gulp tasks

You can test and work with Fabric locally in a number of ways. 

###gulp

Use this task to build Fabric once after you've made changes. This task will build all parts of Fabric and move all changed files into `/dist/`. Every time you make changes, re-run this task.

###gulp watch

Use this tak to build Fabric after you make any changes. This task will build all parts of Fabric, and then rerun every time you make a change to any of the following folders: 
- `/src/components/`
- `/src/less/`
- `/src/samples/`
- `/src/templates/`

###gulp watch:components-samples

Use this task to tweak and test components. This task will build only component samples and watch for changes within `/src/components/`. After the build runs, you can test your components by opening the `index.html` file located in any component inside `/dist/samples/Components/`.

**NOTE:** This task updates `/dist/samples/Components/`; it does not update `/dist/components/`.

###gulp watch:fabric-components

Use this task to see your component changes in fabric.components.css. This task watches `/src/components/` and builds the big fabric.components.css file that goes in `/dist/css/`. It also updates `/dist/components/`.

###gulp watch:samples

Use this task to test the samples that come with Fabric including the video portal and a simple form. This task watches the samples within `/src/samples/`, builds them, and moves them to `/dist/samples/`.

###gulp watch:fabric

Use this task when you're working on core Fabric elements (fonts, mixins, colors, terse). This task builds all `/src/less/` files and outputs them together in `/dist/css/`.

##Starter template

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
