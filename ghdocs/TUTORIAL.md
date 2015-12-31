# Fabric Tutorial Part 1

### Contents

- [Overview](#overview)
- [Components Overview](#components-overview)
- [Step 1 – Setting up your project](#setting-up-your-project)
- [Step 2 – Adding Fabric to a project](#adding-to-a-project)
- [Step 3 – Prepping your app](#prepping-your-app)
- [Step 4 – Using Fabric components](#using-fabric-components)
- [Step 5 – Using Fabric typography](#using-fabric-typography)
- [Step 6 – Adding more complex components](#adding-complex-components)

## Overview

Fabric is an HTML and CSS toolkit that works like a skin to help your experiences look and feel like Office and Office 365. To demonstrate how to use Fabric, let's build a simple ToDo application. For this tutorial, we will focus mainly on using Fabric components to get our app looking solid as quickly as possible.

###Using Fabric with Office Add-ins
If you're building an Office Add-in, you can find simple instructions for using the compiled version right away in the article [Using Fabric with Office Add-ins](https://msdn.microsoft.com/EN-US/library/office/6f46dd69-2ba3-4b0f-9735-7d7394ca2731.aspx).  

## Components Overview

Components are snippets of HTML and CSS that can be used in any application as a skin for common UI elements like Textfields, Toggle Switches, Lists, and People Pickers. Fabric's components exist in Microsoft products today and are used by millions of customers. Components can be manipulated fairly easily, and, in this tutorial, we will be tweaking a few of them.

Now, let's get started building our application.

## Step 1 – Setting up your project

Let's set up our project folder to look like the following:

```
todo/
|-- css/
```

Now open up your favorite text editor or IDE and create a new file called index.html in the root directory (todo/), then add the following to it:

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  
  <body>
  </body>
</html>
```

## Step 2 – Adding Fabric to a project

Go [here to download the latest .zip of Fabric  (the first zip "office-ui-fabrc-[version].zip")](https://github.com/OfficeDev/Office-UI-Fabric/releases/latest), and then extract the contents. Then go into `/dist/css` and copy **fabric.css** and **fabric.components.css** into your `todo/css/` project folder. Then add the following lines to the `<head>` section of your index.html document:


```html
<link href="css/fabric.css" type="text/css" rel="stylesheet" />
<link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
```

The first file includes the core Fabric styles (typography, colors, animations, etc.), while the second includes styles for all of Fabric's components. Note that Fabric comes with several other CSS files that can be used to improve or optimize your application. These include .rtl.css versions for right-to-left languages, as well as individual CSS files for each component, so you can use only the components your application needs. There are also .min.css versions of each of these, which should be used in production to save bandwidth. For now, we will use the full versions of the core Fabric styles and components for simpler debugging and quicker development.

After linking to the Fabric CSS files, your page will now have access to all of the colors, fonts, animations, and component styles that Fabric offers.

### Create a new style sheet for our application

We will now create a CSS file for your application, which we'll use to add custom styles and to override Fabric component styles where necessary.  Create a new file titled **app.css** in your `todo/css/` directory and add a link to it _after_ fabric.components.css in index.html:

```html
<link href="css/fabric.css" type="text/css" rel="stylesheet" />
<link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
<link href="css/app.css" type="text/css" rel="stylesheet" />
```

**_NOTE_**: It's important that app.css goes _after_ Fabric's CSS files to ensure that any application-specific styles there will have a high enough specificity to override Fabric styles if necessary. While Fabric does have a lot great pre-existing styles, you may need tweak them to fit your application's specific requirements. 

At this point, your directory should look like this:

```
todo/
|-- css/
  |--fabric.css
  |--fabric.components.css
  |--app.css
|--index.html
```

And index.html should look like this:

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

## Step 3 – Prepping your app

Let's start adding Fabric Components to our ToDo app. Below is a preview of what our app will look like when we're finished:

![Third screenshot of ToDo app](http://odux.azurewebsites.net/github/img/tutorials/intro/ThirdAppLook.png)

At the top we have a TextField and Button component that we will eventually use to add new tasks. Underneath, we have our List component that contains ListItems, which will hold each of the user's pending tasks.

Let's start by creating containers that will hold the Fabric components for our two main sections. Add the following elements to `<body>`:

```html
<div class="TodoBar"></div>
<div class="TodoList"></div>
```

Now let's add styles for these elements. Open up app.css and add two CSS rules: one for our TodoBar container and one for our TodoList container.

```css
.TodoBar {
  position: fixed; /* This bar should always be fixed to the top */
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #000000;
  z-index: 2;
}

.TodoList {
  width: 100%;
  height: auto;
  background-color: #cdcdcd;
  z-index: 1;
  min-height: 200px;
}
```

Save and then open up index.html in your browser. You should see something like this:

![First screenshot of ToDo app](http://odux.azurewebsites.net/github/img/tutorials/intro/FirstAppLook.png)

If you don't see this, double-check your CSS paths and make sure you followed the first part of this tutorial correctly.

Next, you'll notice extra spacing around `<div class="TodoList"></div>`. This is because of margins that browsers add to `<body>` and `<html>` elements by default. Let's remove the margin on these elements by adding the following to the top of app.css:

```css
html, 
body {
  margin: 0;
}
```

Go ahead and refresh—the extra white space along the top and sides should go away, and `.TodoList` should now expand 100% across the screen.

## Step 4 – Using Fabric components

Fabric includes a responsive grid system, similar to those seen in other UI toolkits, that we will be using for our TodoBar section. Let's add the following HTML inside  `<div class="TodoBar"></div>`:

```html
<div class="ms-Grid">
  <div class="ms-Grid-row">
    <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10"></div> <!-- First Column -->
    <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2"></div> <!-- Second Column -->
  </div>
</div>
```

Now for the fun part: let's add some component HTML into our ToDo app. Navigate to where you extracted Fabric, then open the following component files in your code editor:

```
dist/components/Button/Button.html
dist/components/TextField/TextField.html
```

First, copy all the contents from TextField.html and paste it inside of the first column `<div class="ms-Grid-col"></div> <!-- First Column -->`, then remove the `<label class="ms-Label">Name</label>` element and `<span class="ms-TextField-description">This should be your first and last name.</span>`.  At this point your second column HTML should look like this:

```html
<div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">
    <div class="ms-TextField">
        <input class="ms-TextField-field">
    </div>
</div> <!-- First Column -->
```

**_NOTE_**: We are removing the `<label>` and `<span>` elements because we don't need them in this example.

Copy all the contents from Button.html and paste it into our second column `<div class="ms-Grid-col"></div> <!-- Second Column -->`. Now change the text inside of the button `<span class="ms-Button-label">` from **Create account** to **Add Todo**. We should also remove `<span class="ms-Button-description"></span>` After the past few edits, your **index.html** should look like the following:

```html
<!DOCTYPE html>
<html>
  <head>
      <link href="css/fabric.css" type="text/css" rel="stylesheet" />
      <link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
      <link href="css/app.css" type="text/css" rel="stylesheet" />
  </head>

  <body>
      <div class="TodoBar">
        <div class="ms-Grid">
            <div class="ms-Grid-row">
                <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">
                    <div class="ms-TextField">
                        <input class="ms-TextField-field">
                    </div>
                </div> <!-- First Column -->
                <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">
                    <button class="ms-Button">
                        <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
                        <span class="ms-Button-label">Add Todo</span>
                    </button>
                </div> <!-- Second Column -->
            </div>
        </div>
      </div>
      <div class="TodoList"></div>
  </body>
</html>
```

## Step 5 – Using Fabric typography

Let's create a title for our application using Fabric font classes. First, add the following HTML right after `<div class="TodoBar"></div>`:

```html
<div class="ListHeader">Todo List</div>
```

Now, let's add some styles to app.css to position the ListHeader:

```css
.ListHeader {
  width: 100%;
  height: auto;
  margin-top: 60px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
```

Now we should have a simple title inside a white strip. Let's change that with a few Fabric typography classes: add `ms-font-xxl` and `ms-fontWeight-light` after the ListHeader class on   our  `<div class="ListHeader">Todo List</div>` element. This element should now look like the following:

```html
<div class="ListHeader ms-font-xxl ms-fontWeight-light">Todo List</div>
```

**_NOTE_**: `.ms-font-xxl` is a "base" typography class, each of which sets a size, color, font-family, and weight. `.ms-fontWeight-light` is one of several helper classes that override a single property and should usually be combined with a base typography class.

## Step 6 – Adding more complex components

Now, let's get our list up and running using some hard-coded content. In Part 2, we will use JavaScript to add real data and interactions.

Go ahead and open up `dist/components/List/List.html` from your extracted Fabric .zip into your text editor, then copy all of the contents and paste it inside of `<div class="TodoList"></div>`. This div should now look like the following:

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

Now, let's remove the background colors ( `background-color: #000000;`, `background-color: #cdcdcd;`) we used to test `<div class="TodoBar"></div>` and `<div class="TodoList></div>`. Your **app.css** file should look like the following:

```css
html, 
body {
  margin: 0;
}

.TodoBar {
  position: fixed; /* This bar should always be fixed to the top */
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 2;
}

.TodoList {
  width: 100%;
  height: auto;
  z-index: 1;
  min-height: 200px;
}

.ListHeader {
  width: 100%;
  height: auto;
  margin-top: 60px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
```


 And here is what your HTML should look like:
```html
<!DOCTYPE html>
<html>
  <head>
      <link href="css/fabric.css" type="text/css" rel="stylesheet" />
      <link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
      <link href="css/app.css" type="text/css" rel="stylesheet" />
  </head>

  <body>
      <div class="TodoBar">
        <div class="ms-Grid">
            <div class="ms-Grid-row">
                <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">
                    <div class="ms-TextField">
                        <input class="ms-TextField-field">
                        <span class="ms-TextField-description">This should be your first and last name.</span>
                    </div>
                </div> <!-- First Column -->
                <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">
                    <button class="ms-Button">
                        <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
                        <span class="ms-Button-label">Add ToDo</span>
                        <span class="ms-Button-description">Description of the action this button takes</span>
                    </button>
                </div> <!-- Second Column -->
            </div>
        </div>
      </div>
      <div class="ListHeader ms-font-xxl ms-fontWeight-light">Todo List</div>
      <div class="TodoList">
          <ul class="ms-List">
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-selected is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-secondaryText">Meeting notes</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--flag"></i></div>
                <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--pinLeft"></i></div>
                </div>
            </div>
         </ul>
      </div>
  </body>
</html>
```
 

Here is a screenshot of what your app should look like at this moment:

![Second screenshot of ToDo app](http://odux.azurewebsites.net/github/img/tutorials/intro/SecondAppLook.png)

It's starting to look pretty good! It still needs something more, so let's add a background color and adjust the padding and margins of our TextField and Button components.

**_NOTE_**: Fabric comes with a large assortment of colors that can be referenced on our [Styles Section](http://dev.office.com/fabric/styles#color).

To accomplish this, let's add the following new styles to app.css below our `.TodoBar` block of styles:

```css

.TodoBar {
  position: fixed; /* This bar should always be fixed to the top */
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 2;
  background-color: #0078D7; /* New Background Color */
}

... styles hidden

.ms-TextField .ms-TextField-field {
  margin-top: 14px;
}

.ms-Button {
  margin-top: 14px;
  width: 100%;
}
```

These styles are going to override the default component styling and will help our TextField and Button stand out with some minor positioning adjustments.

**Hang on, this part gets a bit tricky!**

But now we'd really like to tweak our component by adding a title and a description along with icons for an x and a checkmark. Since we don't need the paper clip and flag, go ahead and remove all `<div class="ms-ListItem is-selectable"></div>` elements **except the first one** so we have one element to work with.

Inside of the first `.ms-ListItem` remove the elements` <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--mail"></i></div>`,  `<div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--trash"></i></div>`, and `<span class="ms-ListItem-secondaryText">Meeting notes</span>`. Then change the icons to the x and the check: replace `ms-Icon ms-Icon--flag` with `ms-Icon ms-Icon--x` and `ms-Icon ms-Icon--pinLeft` with `ms-Icon ms-Icon--check`. Our new list HTML should look like the following:

```html
   <div class="TodoList">
        <ul class="ms-List">
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                    <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                    <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
        </ul>
    </div>
```

Now let's copy this new list item code and paste it at least 10 times inside of `<ul class="ms-List"></ul>` to fill out the UI of the app. With this final step, you just completed the tutorial! Below is the complete HTML and CSS:

### Final HTML
```html
<!DOCTYPE html>
<html>
  <head>
      <link href="css/fabric.css" type="text/css" rel="stylesheet" />
      <link href="css/fabric.components.css" type="text/css" rel="stylesheet" />
      <link href="css/app.css" type="text/css" rel="stylesheet" />
  </head>

  <body>
      <div class="TodoBar">
        <div class="ms-Grid">
            <div class="ms-Grid-row">
                <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">
                    <div class="ms-TextField">
                        <input class="ms-TextField-field">
                        <span class="ms-TextField-description">This should be your first and last name.</span>
                    </div>
                </div> <!-- First Column -->
                <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">
                    <button class="ms-Button">
                        <span class="ms-Button-icon"><i class="ms-Icon ms-Icon--plus"></i></span>
                        <span class="ms-Button-label">Add ToDo</span>
                        <span class="ms-Button-description">Description of the action this button takes</span>
                    </button>
                </div> <!-- Second Column -->
            </div>
        </div>
      </div>
      <div class="ListHeader ms-font-xxl ms-fontWeight-light">Todo List</div>
      <div class="TodoList">
        <ul class="ms-List">
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            <div class="ms-ListItem is-unread is-selectable">
                <span class="ms-ListItem-primaryText">Alton Lafferty</span>
                <span class="ms-ListItem-tertiaryText">Today we discussed the importance of a, b, and c in regards to d.</span>
                <span class="ms-ListItem-metaText">2:42p</span>
                <div class="ms-ListItem-selectionTarget js-toggleSelection"></div>
                <div class="ms-ListItem-actions">
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--x"></i></div>
                   <div class="ms-ListItem-action"><i class="ms-Icon ms-Icon--check"></i></div>
                </div>
            </div>
            
         </ul>
      </div>
  </body>
</html>
```

```css
html, 
body {
  margin: 0;
}

.TodoBar {
  position: fixed; /* This bar should always be fixed to the top */
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 2;
  background-color: #0078D7;
}

.TodoList {
  width: 100%;
  height: auto;
  z-index: 1;
  min-height: 200px;
}

.ListHeader {
  width: 100%;
  height: auto;
  margin-top: 60px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}

.ms-TextField .ms-TextField-field {
  margin-top: 14px;
}

.ms-Button {
  margin-top: 14px;
  width: 100%;
}
```


Your app should look exactly like this:

![Third screenshot of ToDo app](http://odux.azurewebsites.net/github/img/tutorials/intro/ThirdAppLook.png)

Check out the next part in the series, where we will integrate functionality, animations, and more awesomeness.
