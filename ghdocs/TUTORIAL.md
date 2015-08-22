# Fabric Tutorial Part 1

TODO: ADD TOC

## Overview

Fabric is an HTML and CSS framework that works like a skin to help your experiences look like Office and O365. To help explain how to use Fabric, let's build a simple ToDo app. For this tutorial, we will focus mainly on using Fabric components to get our app looking solid as fast as possible.

## Components Overview

Components are snippets of HTML and CSS that are ready to be used in any application as a skin for common controls like Textfields, Toggle Switches, Lists, and People Pickers. Fabric's components exist in Microsoft products today and are used by millions of customers. Components can be manipulated fairly easily and, in this tutorial, we will be tweaking a few of them.

## Getting Started

### Step 1 – Setting up your project

Let's setup our project folder to look like the following

```
todo/
|-- css/
```

Now open up your favorite text editor or IDE, create a new file called index.html in the root directory (todo/), and add the following to it:

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  
  <body>
  </body>
</html>
```

### Step 2 - Adding Fabric to a project

Download Fabric, unzip it, and copy **fabric.css** and **fabric.components.css** into your **css/** folder. Then add the following lines to the `<head>` section of your index.html document:

NOTE: Fabric comes with several other css files that can be used for your application. For right now we will be focusing on the core fabric styles. Please read our documentation for more information.

```html
<link href="css/fabric.css" type="text/css" rel="stylesheet" />
<link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
```

After successfully linking to our fabric CSS files, your HTML page will now have access to all of the colors, fonts, animations, and component styles that Fabric offers.

We now want to create an app.css file that we will use to add custom styles and to override Fabric component styles when necessary.  Create a new file titled app.css in your css/ directory and add a link to it _under_ fabric.components.css in your index.html document:

```html
<link href="css/fabric.css" type="text/css" rel="stylesheet" />
<link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
<link href="css/app.css" type="text/css" rel="stylesheet" />
```

NOTE: It's important that app.css goes _after_ Fabric CSS to ensure that anything we place in app.css will override anything in Fabric. While Fabric does have a lot great pre-existing styles, you may need to tweak them to fit your specific needs.

At this point your directory should look like:

```
todo/
|-- css/
  |--fabric.css
  |--fabric.components.css
  |--app.css
|--index.html
```
And your html file should now look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <link href="css/fabric.css" type="text/css" rel="stylesheet" />
    <link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
    <link href="css/app.css" type="text/css" rel="stylesheet" />
  </head>
  
  <body>
  </body>
</html>
```

### Step 3 – Prepping your app

Let's begin adding Fabric Components to our ToDo App. Below is a wireframe of what we want our app to look like where each rectangle has the name of the corresponding Fabric component inside it:

<!-- Image for application state 1 -->

At the top we have a TextField and Button component that will eventually allow us to add new tasks. Underneath, we have our List component that contains ListItems that will hold each of the pending tasks.

Let's start by creating containers that will hold the Fabric components for our two main sections. Add the following elements to your index.html's body element:

```html
<div class="TodoBar"></div>
<div class="TodoList"></div>
```

Now let's add styles for these elements. Open up app.css and add two CSS rules - one for our TodoBar container and one for our TodoList container:

```css
.TodoBar {
  position: fixed; /* We want this at the top always */
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #000000;
  z-index: 2;
}

.TodoList {
  float: left;
  width: 100%;
  height: auto;
  background-color: #cdcdcd;
  z-index: 1;
  min-height: 200px;
}
```

Save and open up index.html in your browser. After that, you should see something like this:

<!--  -->

If you don't see this, double check your CSS paths and make sure you have followed the first part of this tutorial correctly.

Next, we have some strange spacing around our `<div class="TodoList"></div>`. This spacing  is coming from our `<body>` and `<html>` elements. Let's go ahead and remove the margin on the body and html by adding the following styling to the top of your app.css file:

```css
html, 
body {
  margin: 0;
}
```

Go ahead and refresh and that spacing should go away and .TodoList should now expand 100% across the screen and that white space along the sides will disappear.

### Step 4 – Using Fabric components

Fabric has a built in responsive grid system that we are going to use for our TodoBar section. Let's add the following html inside our `<div class="TodoBar"></div>`:

```html
<div class="ms-Grid">
  <div class="ms-Grid-row">
    <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10"></div>
    <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2"></div>
  </div>
</div>
```

Now for the fun part: let's open up some component HTML files and copy the HTML into our ToDo app. Travel over to where you  extracted your .zip of Fabric, and go into the components/ folder. Open the following component files in your code editor:

```
/components/TextField/TextField.html
/components/Button/Button.html
```

First, copy all the contents from TextField.html and paste it into our first column div and remove the `<label>` element to make it look like this:

```html
<div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">
  <div class="ms-TextField">
    <input class="ms-TextField-field">
  </div>
</div>
```

NOTE: We are removing the label element because we don't need it in this example. Fabric components can be customized fairly easily.

Copy all the contents from Button.html and paste it into our second column. Let's tweak the text as well by changing **Create account** to **Add Todo** and changing the description to say **Add a todo task to the list**. After all that it should look like the following:

```html
<div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">
  <button class="ms-Button">
    <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
    <span class="ms-Button-label">Add Todo</span>
    <span class="ms-Button-description">Add a todo task to the list</span>
  </button>
</div>
```

### Step 5 – Using fabric typography

Let's create a title for our application using fabric font classes. First, create the following `<div>` and add it right after our `<div class="TodoBar"></div>`.

```html
<div class="ListHeader">Todo List</div>
```

Now let's create some styles to position this ListHeader, go ahead and add the following to app.css

```css
.ListHeader {
  float: left;
  width: 100%;
  height: auto;
  margin-top: 60px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
```

After that we should have just a boring looking title inside a white strip. Let's change that by adding a magical Fabric Typography class. Copy ms-font-xl and paste it next to ListHeader class. Our List Header should now look like the following.

```html
<div class="ListHeader ms-font-xxl">Todo List</div>
```

### Step 6 – Adding more complex components

Now we want to get our list up and running. For the time being, our list will have fake data until Part 2 when we add JavaScript functionality.

Let's get our list up and running using some fake data – in Part 2 we will add JavaScript functionality that allows us to use real data.

Go ahead and open up components/List/List.html from your extracted Fabric .zip in your IDE.

Copy all contents of List.html and paste it inside of `<div class="TodoList"></div>` now your code should look like the following:


```html
<div class="TodoList">
  <ul class="ms-List">
   <li class="ms-List-item">
     <div class="ms-ListItem is-unread">
       <span class="ms-ListItem-primaryText">Alton Lafferty</span>
       <span class="ms-ListItem-secondaryText">Meeting notes</span>
       <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
       <span class="ms-ListItem-metaText">2:42p</span>
       <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
       <div class="ms-ListItem-actions">
         <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--attachment"></i></div>
         <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
         <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
       </div>
     </div>
   </li>
   <li class="ms-List-item">
     <div class="ms-ListItem is-unread">
       <span class="ms-ListItem-primaryText">Alton Lafferty</span>
       <span class="ms-ListItem-secondaryText">Meeting notes</span>
       <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
       <span class="ms-ListItem-metaText">2:42p</span>
       <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
       <div class="ms-ListItem-actions">
         <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--attachment"></i></div>
         <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
         <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
       </div>
     </div>
   </li>
  </ul>
  …
</div>
```


Let's remove the background colors we used to test our two container `<divs>` (`.TodoList`, `.TodoBar`) so now their styles will look like the following:


```css
.TodoBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 2;
  background-color: #000000;
}

.TodoList {
  float: left;
  margin-top: 60px;
  width: 100%;
  height: auto;
  z-index: 1;
  min-height: 200px;
  background-color: #000000;
}
```


Here is what your app should look like at this moment:

<!-- TODO: Add image of app in progress -->


It's starting to look pretty good! It still needs something more, so let's add a background color and adjust the padding and margins of our TextField and Button components.

To accomplish this, let's add the following new styles to app.css:

```css
.TodoBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 2;
  background-color: #0078D7;
}

.ms-TextField .ms-TextField-field {
  margin-top: 14px;
}

.ms-Button {
  margin-top: 14px;
  width: 100%;
}
```

These styles are going to override the default component styling and will help our TextField and Button stand out with some minor positioning adjustments.

Now let's tweak our list a bit. For our purposes, we really want to just have a title and description with the x and checkmark. Since we don't need the paper clip and flag, let's modify one list item to look like the following.

```html
<li class="ms-List-item">
  <div class="ms-ListItem is-unread">
    <span class="ms-ListItem-primaryText">Alton Lafferty</span>
    <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
    <span class="ms-ListItem-metaText">2:42p</span>
    <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
    <div class="ms-ListItem-actions">
      <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
      <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
    </div>
  </div>
</li>
```

Now let's copy this new list item code and paste it at least 10 times inside of `<ul class="ms-List"></ul>` and make sure to remove the old list item code.

Your app should look exactly like this:

<!-- Add image of finished app -->

Check out our next part in the series where we integrate functionality, animations, and more awesomeness.