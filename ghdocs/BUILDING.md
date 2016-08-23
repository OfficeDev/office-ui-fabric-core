#Building Fabric, gulp tasks, bundling, and the starter template

Office UI Fabric uses [gulp](http://gulpjs.com/) to compile its styles. Use it to customize Fabric for your project, or to test changes you make to specific aspects of the toolkit.

##Contents

- [Building Fabric](#building-fabric)
- [Gulp tasks](#gulp-tasks)
- [Starter template](#starter-template)

##Building Fabric

Before you get started, make sure you have [node.js](https://nodejs.org/), [gulp](http://gulpjs.com/), and [git](https://git-scm.com/) installed. To build Fabric:

1. Clone the repo.
2. Navigate to the folder that contains the gulpfile.js file (Fabric's root).
3. `npm install`
4. `gulp`

The built files will be in the `/dist/` folder.

##Gulp tasks

You can test and work with Fabric locally using the tasks below.

###gulp

Builds everything incrementally. This will run slowly the first time and very quickly on subsequent runs. This task will build all parts of Fabric and move all changed files into `/dist/`. Every time you make changes, re-run this task.

###gulp watch

Builds and watches everything. After running this once, your builds will be a lot faster. Now if you make a change anything anywhere in Fabric, only that area/section/file will get built/changed/moved.

###gulp watch-debug

This task is similar to `gulp watch` except you can now get a readout of what files are in the pipe. This will be helpful to make sure that the build is working properly. 

###gulp watch-sass

Builds and watches everything but builds only Sass versions of our core library files.

###gulp watch-sass-debug

Builds and watches everything but uses the Sass versions of the files and gives a readout of files in the pipe.

###gulp Bundles

Builds all bundles specified in `gulp/modules/Config.js`. View more details in the [Bundling](https://github.com/OfficeDev/Office-UI-Fabric/blob/master/ghdocs/BUNDLING.md)

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

    <!-- Fabric core -->
    <link rel="stylesheet" href="css/fabric.min.css">

    <!-- Application-specific CSS -->
    <link rel="stylesheet" href="/css/app.css">
  </head>
  <body>
    <!-- Application content goes here -->
    <h1 class="ms-font-su">Why, hello, world.</h1>
  </body>
</html>
```
