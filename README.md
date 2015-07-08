![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

#####The front-end framework for building experiences for Office 365.

Fabric is a responsive, mobile-first, front-end framework, designed to make it simple to quickly create web experiences using the Office Design Language. It’s simple and familiar to get up and running with Fabric—whether you’re creating a new app from scratch or adding new features to an existing one.

##Contents

- [Why Office UI Fabric?](#why-office-ui-fabric)
- [Getting started](#getting-started)
	- [Building Fabric](#building-fabric)
	- [Add to your project](#add-to-your-project)
	- [Starter template](#starter-template)
	- [Supported browsers](#supported-browsers)
- [Features](#features)
	- [Typography](#typography)
	- [Color](#color)
	- [Icons](#icons)
	- [Animations](#animations)
	- [Responsive Grid](#responsive-grid)
		- [How to use](#how-to-use)
		- [Inheritance](#inheritance)
		- [Push and pull](#push-and-pull)
	- [Localization](#localization)
		- [Right-to-left support](#right-to-left-support)
		- [Language-optimized fonts](#language-optimized-fonts)
- [Components](#components)
	- [Inputs](#inputs)
	- [Layout](#layout)
	- [Navigation](#navigation)
	- [Content](#content)
- [Changelog](#changelog)
- [Frequently asked questions](#frequently-asked-questions)


##Why Office UI Fabric?

- Fabric is just like other popular frameworks, but built from the ground up for O365 so there's no excessive overriding.
- Fabric is all about styling instead of JavaScript so you can focus on your look and feel.
- Pick your icons to reduce the size of Fabric.
- Built with **LESS** for powerful customization. 
- Components help you nail down common elements like buttons, dropdowns, and lists.
- Fabric plays well with other frameworks like Bootstrap with uniquely namespaced classes to prevent conflicts.
- Full breadth of language support (including Right-to-Left behavior) help take the guesswork out of localization.


##Getting started

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

On a Mac:

1. Install Node.js via http://nodejs.org
2. Install git via https://git-scm.com/
3. Clone the repo
4. Navigate to the folder containing Fabric's gulpfile.js (Fabric's root)
5. sudo npm install -g gulp
6. sudo npm install -g typescript
7. npm install

#####Add to your project

You don't have to rethink your front-end architecture to start using Fabric in your existing app, but some simple setup is required. Follow these steps to get started:

1. If using a downloaded copy: After downloading and unpacking, move the Fabric folder to a location within your project. We recommend placing Fabric either at the project root or within a "lib" type of folder.
2. Add a reference to fabric.css in the `<head>` tag of your HTML file before any application-specific CSS. This ensures that you can specify overrides and additional styles with application-specific stylesheets.
3. If you‘re using Fabric components, add a reference to fabric.components.css in the `<head>` after fabric.css.
4. Optionally, you may choose to include Fabric Components' JavaScript, which is demonstration-only and should not be considered production-ready. We generally reccommend against doing this, since the code is not extensively tested and is used only for demonstration on the Component Picker. If you'd still like to include it, add a `<script>` tag with a reference to fabric.components-.min.js at the end of your page‘s `<body>` tag.

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

#####Supported browsers

Fabric meets the Office 365 browser support requirements for desktop and mobile devices. This includes support for the latest versions of Chrome, Firefox, Safari, and IE 9 and greater.

|          | **Chrome (latest stable)** | **Firefox (last 2 versions)** | **Safari (latest)** | **IE8** | **IE9** | **IE10+** |
|:--------:|:------------------------:|:---------------------------:|:-----------------:|:-----:|:-----:|:-------:|
|  Windows | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![x](http://odux.azurewebsites.net/github/img/x.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|
| Mac OS   | ![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)|![check](http://odux.azurewebsites.net/github/img/check.png)| -     | -     | -       |
| iOS (6+) | -                         | -                        |![check](http://odux.azurewebsites.net/github/img/check.png)| -     | -     | -       |
| Android (4.4+)| ![check](http://odux.azurewebsites.net/github/img/check.png)| -                   | -                        | -     | -     | -       |
| Windows Phone | -                    | -                        | -                        | -     | -     |![check](http://odux.azurewebsites.net/github/img/check.png)|


##Features

#####Typography

Fabric includes 10 **base** font classes representing the type ramp for the Office Design Language. Each base class sets a default size, weight, and color:

![Type Ramp](http://odux.azurewebsites.net/github/img/TypeRamp.png)


Fabric also includes several **helper** font classes to easily change text weight:

![Helper Type](http://odux.azurewebsites.net/github/img/HelperType.png)

#####Color

Fabric includes 9 theme colors and 11 neutral colors. Each has helper classes for text, border, background, and hover states. These color classes will serve as hooks into the suite-wide theming system, and will pick up the user‘s chosen theme when the system is enabled and your app is consuming the suite navigation.

**Theme colors** should be used in wayfinding, navigation, and key interactions like primary actions, current or selected indicators, etc.

![Theme Colors](http://odux.azurewebsites.net/github/img/ThemeColors.png)

**Neutral colors** are Fabric's black, gray, and white colors. Use darker shades of gray for primary content, such as text and titles. Use black sparingly for high-impact strings (labels, names) and hover states. Use lighter shades of gray for supporting graphic elements and page areas.

Fabric also contains other **accent** colors:

![Accent Colors](http://odux.azurewebsites.net/github/img/AccentColors.png)

#####Icons

Fabric uses a custom font for its iconography, containing glyphs that can be infinitely scaled, colored, styled, and even flipped for right-to-left localization.

Icons are straightforward to use. Simply combine the base `ms-Icon` class with a modifier class for the specific icon:
```html
<i class="ms-Icon ms-Icon--mail" aria-hidden="true"></i>
```
Note the `aria-hidden` attribute, which prevents screen readers from reading the icon. In cases where meaning is conveyed *only* through the icon, such as an icon-only navigation bar, be sure to apply an `aria-label` to the button for accessibility.

#####Animations

Motion adds delight to an experience, and it can help increase a user‘s understanding by tying experiences together, adding continuity and clarity. Motion should feel responsive to a user‘s input, but shouldn‘t be distracting. Fabric includes many different common animations:

|CSS class    |description  |cubic bezier |timing       |
|:-----------:|:-----------:|:-----------:|:-----------:|
|ms-u-slideRightIn40|Slide right 40px and fade in|0.1, 0.9, 0.2, 1|0.367s|
|ms-u-slideLeftIn40|Slide left 40px and fade in|0.1, 0.9, 0.2, 1|0.367s|
|ms-u-slideUpIn20| Slide up 20px and fade in| 0.1, 0.9, 0.2, 1| 0.367s|
|ms-u-slideUpIn10| Slide up 10px and fade in| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideDownIn20| Slide down 20px and fade in| 0.1, 0.9, 0.2, 1| 0.367s|
|ms-u-slideDownIn10| Slide down 10px and fade in| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideRightOut40| Slide right 40px and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideLeftOut40| Slide left 40px and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideUpOut20| Slide up 20px and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideUpOut10| Slide up 10px and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideDownOut20| Slide down 20px and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-slideDownOut10| Slide down 10px and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-scaleUpIn100| Scale up to 100% and fade in| 0.1, 0.9, 0.2, 1| 0.367s|
|ms-u-scaleDownIn100| Scale down to 100% and fade in| 0.1, 0.9, 0.2, 1| 0.367s|
|ms-u-scaleUpOut103| Scale up to 103% and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-scaleDownOut98| Scale down to 98% and fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-fadeIn100| Fade in| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-fadeIn200| Fade in| 0.1, 0.25, 0.75, 0.9| 0.267s|
|ms-u-fadeIn400| Fade in| 0.1, 0.25, 0.75, 0.9| 0.367s|
|ms-u-fadeIn500| Fade in| 0.1, 0.25, 0.75, 0.9| 0.467s|
|ms-u-fadeOut100| Fade out| 0.1, 0.25, 0.75, 0.9| 0.167s|
|ms-u-fadeOut200| Fade out| 0.1, 0.25, 0.75, 0.9| 0.267s|
|ms-u-fadeOut400| Fade out| 0.1, 0.25, 0.75, 0.9| 0.367s|
|ms-u-fadeOut500| Fade out| 0.1, 0.25, 0.75, 0.9| 0.467s|

#####Responsive Grid

Forget serving static, device-specific layouts. Fabric comes with a mobile-first, 12-column, responsive grid that allows you to easily create flexible layouts for a variety of common screen sizes and device types.

![Responsive grid](http://odux.azurewebsites.net/github/img/ResponsiveGrid.png)

######How to use
A grid (`.ms-Grid`) can contain multiple rows (`.ms-Grid-row`), each of which has one or more columns (`.ms-Grid-col`). Utility classes (`.ms-u-sm6`) specify how large each column should be on small, medium, and large devices. The columns in a row should add up to 12 for each device size.

```html
<div class="ms-Grid">
  <div class="ms-Grid-row">
    <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">First</div>
    <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">Second</div>
  </div>
</div>
```

Would result in:

![ResultGrid](http://odux.azurewebsites.net/github/img/ResultGrid.png)

######Inheritance
Fabric is mobile-first, meaning that any layout defined for small screens will automatically be inherited by medium and large screens. The small size utilities (`.ms-u-sm6`) are required and, if you wish to change the layout on larger screens, the other utility classes can be applied.

######Push and pull
There may be times when you want the source order of columns to differ from the display order, or to change the display order based on the screen size. The push and pull utilities make this possible. Push moves a column to the right, while pull moves it to the left.

#####Localization

######Right-to-left support
Fabric comes with an alternate CSS file for pages written in right-to-left (RTL) languages, such as Arabic and Hebrew. This reverses the order of columns in the responsive grid, making it easy to create an RTL layout without writing additional templates. Future versions of Fabric will also reverse some icons and provide additional helper utilities.

Apply the “dir” attribute to the HTML tag, and reference the RTL version of Fabric:
```html
<html dir="rtl">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="fabric-[version].rtl.min.css">
  </head>
  ...
</html>
```

######Language-optimized fonts
By default, Fabric presents all text using the Western European character set of Segoe UI. For languages with other characters, Fabric will either serve a version of Segoe UI with a different character set or use a system font.

The HTML “lang” attribute specifies the language of the element's content. This is typically applied to the root HTML element, where it will be inherited by the entire page. In this example the entire page is in Thai.
```html
<html lang="th-TH">...</html>
```

For pages with content in multiple languages, the “lang” attribute can be applied to individual elements. In this example, a page that is mostly Thai also contains some Vietnamese.
```html
<html lang="th-TH">
  ...
  <section lang="vi-VN">...</section>
</html>
```

Fabric supports XX language codes, which utilize the following font stacks:

|language|code|font stack|
|:-----:|:-----:|:------:|
|Western European (default)| N/A| 'Segoe UI Web Regular', 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif|
|Japanese| ja-JP| YuGothic, "Meiryo UI", Meiryo, "MS Pgothic", Osaka, "Segoe UI", Tahoma, Arial, sans-serif|
| Korean                          | ko-KR    | "Malgun Gothic", Gulim,   "Segoe UI", Tahoma, Arial, sans-serif                               |
| Chinese   (simplified)          | ch-ZHS   | "Microsoft Yahei",   Verdana, Simsun, "Segoe UI", Tahoma, Arial, sans-serif                   |
| Chinese   (traditional)         | ch-ZHT   | "Microsoft Jhenghei",   Pmingliu, "Segoe UI", Tahoma, Arial, sans-serif                       |
| Hindi                           | hi-IN    | "Nirmala UI",   "Segoe UI", Tahoma, Arial, sans-serif                                         |
| Thai                            | th-TH    | 'Leelawadee UI Regular', 'Kmer   UI', 'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif       |
| Arabic                          | ar       | 'Segoe UI Regular Arabic', 'Segoe   UI', 'Segoe WP', Tahoma, Arial, sans-serif                |
| Bulgarian                       | bg-BG    | 'Segoe UI Regular Cyrillic',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif              |
| Czech                           | cs-CZ    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Estonian                        | et-EE    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Croatian                        | hr-HR    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Hungarian                       | hu-HU    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Lithuanian                      | lt-LT    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Latvian   (Lettish)             | lv-LV    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Polish                          | pl-PL    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Serbian                         | lt-sr-SP | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Russian                         | ru-RU    | 'Segoe UI Regular Cyrillic',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif              |
| Ukrainian                       | uk-UA    | 'Segoe UI Regular Cyrillic',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif              |
| Turkish                         | tr-TR    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Slovak                          | sk-SK    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Kazakh                          | kk-KZ    | 'Segoe UI Regular EastEuropean',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif          |
| Greek                           | el-GR    | 'Segoe UI Regular Greek', 'Segoe   UI', 'Segoe WP', Tahoma, Arial, sans-serif                 |
| Hebrew                          | he-IL    | 'Segoe UI Regular Hebrew', 'Segoe   UI', 'Segoe WP', Tahoma, Arial, sans-serif                |
| Vietnamese                      | vi-VN    | 'Segoe UI Regular Vietnamese',   'Segoe UI', 'Segoe WP', Tahoma, Arial, sans-serif            |


##Changelog
- V1 Release!


##Components

Fabric contains many common components such as buttons, dropdowns, radio buttons, and toggle switches. It also contains more specialized components such as dialogs (with overlays), people pickers, persona, and navigation bars.

#####Inputs

######Buttons

![Buttons](http://odux.azurewebsites.net/github/img/buttons.png)

######Choice fields

![Choice fields](http://odux.azurewebsites.net/github/img/Choice.png)

######Form field label

![Form field label](http://odux.azurewebsites.net/github/img/Label.png)

######Search box

![Search box](http://odux.azurewebsites.net/github/img/Search.png)

######Toggle

![Toggle](http://odux.azurewebsites.net/github/img/Toggle.png)

######Text field
![Text field](http://odux.azurewebsites.net/github/img/TextFields.png)

#####Layout

######List

![List](http://odux.azurewebsites.net/github/img/List.png)

######Dialog

![Dialog](http://odux.azurewebsites.net/github/img/Dialog.png)

######Callout

![Callout](http://odux.azurewebsites.net/github/img/Callout.png)

#####Navigation

######Nav bar

![Nav bar](http://odux.azurewebsites.net/github/img/NavBar.png)

######Pivots

![Pivots](http://odux.azurewebsites.net/github/img/Pivots.png)

#####Content

######Persona

![Persona](http://odux.azurewebsites.net/github/img/Persona.png)

######Persona card

![Persona card](http://odux.azurewebsites.net/github/img/PersonaCard.png)

######List item

![List item](http://odux.azurewebsites.net/github/img/ListItem.png)

######Table

![Table](http://odux.azurewebsites.net/github/img/Table.png)


##Frequently asked questions

#####How does Fabric compare to frameworks like Bootstrap and Foundation?
Fabric solves many of the same problems as other front-end frameworks, in a way that is specific to the needs of Microsoft. We have our own design language and interaction patterns that all Microsoft apps share. Fabric speeds up development like the other frameworks, while ensuring that apps use standard typography, colors, icons, and more. This reduces the time that developers must spend overriding the styles of other frameworks. It also includes components the other frameworks don’t have.

#####Can Fabric co-exist with other frameworks? Existing styles?
Yes, Fabric applies styles on an opt-in basis only. It does not style standard HTML elements, like headings and form elements. Namespaced classes prevent conflicts with other frameworks. So you can safely add Fabric to an existing app or use it alongside another framework of your choice.

#####A feature I'm using is deprecated. When will it be removed?
Typically, we remove deprecated features in the third release after we announce the deprecation. For example, you can expect that a feature that is deprecated in version 0.6.0 will no longer be available in version 0.9.0.

#####How often do you release Fabric?
We add new features in minor versions (e.g. x.**Y**.z), typically released every month. Bug fixes and minor tweaks may be included in patch versions (e.g. x.y.**z**) which are released as necessary. Whenever we put out a new release, be sure to visit the changelog to see the details of what’s new. This may include breaking changes that you should be aware of.