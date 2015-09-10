![Office UI Fabric](http://odux.azurewebsites.net/github/img/OfficeUIFabricLogoBluePadSm-01.png)

##Features

###Contents

- [Typography](#typography)
- [Color](#color)
- [Icons](#icons)
- [Animations](#animations)
- [Responsive grid](#responsive-grid)
- [Localization support](#localization)

For simple instructions for using Fabric features in Office Add-ins, see the article [Using Fabric with Office Add-ins](https://msdn.microsoft.com/EN-US/library/office/6f46dd69-2ba3-4b0f-9735-7d7394ca2731.aspx).
###Typography

####Base font classes

Fabric includes 10 **base** font classes that represent the type ramp for the Office Design Language. Each base class sets a default size, weight, and color.

![Type Ramp](http://odux.azurewebsites.net/github/img/TypeRamp.png)


####Helper font classes

Use one of several **helper** font classes to easily change the text weight.

![Helper Type](http://odux.azurewebsites.net/github/img/HelperType.png)

###Color

Fabric includes 9 theme colors and 11 neutral colors. Each has helper classes for text, border, background, and hover states. These color classes act as hooks into the suite-wide theming system. When the theming system is enabled and your app or add-in is consuming the suite navigation, these classes pick up the user's chosen theme.

Use **theme colors** in wayfinding, navigation, and key interactions like primary actions and current or selected indicators.

![Theme Colors](http://odux.azurewebsites.net/github/img/ThemeColors.png)

**Neutral colors** include black, gray, and white. Use darker shades of gray for primary content, such as text and titles. Use black sparingly for high-impact strings (labels, names) and hover states. Use lighter shades of gray for supporting graphic elements and page areas.

Fabric also includes **accent** colors.

![Accent Colors](http://odux.azurewebsites.net/github/img/AccentColors.png)

###Icons

Fabric uses a custom font for its iconography. This font contains glyphs that you can scale, color, and style in any way. You can even flip them for right-to-left localization.

To use the icons, combine the base `ms-Icon` class with a modifier class for the specific icon.
```html
<i class="ms-Icon ms-Icon--mail" aria-hidden="true"></i>
```
Note the `aria-hidden` attribute, which prevents screen readers from reading the icon. In cases where meaning is conveyed *only* through the icon, such as an icon-only navigation bar, be sure to apply an `aria-label` to the button for accessibility.

###Animations

Use the animation library to create web experiences that integrate with Office 365. You can use the animation CSS classes for navigation, panels, dialogs, and more. Animations include **directionality** (up, down, left, right relating to origin and completion of tasks), **enter/exit** (fade in, fade out, zoom in, zoom out), and **duration** (speed of enter/exit relating to urgency or content type).

When choosing a motion for side panels, consider the origin of the triggering element. Use the motion to create a link between the action and the resulting UI. For example, if the triggering element is on the right side of the interface, consider having the panel move in from the right.

When choosing a motion for dialogs, consider the origin and tone of the content. For a warning or error dialog, a quick fade in might be appropriate. If the dialog appears when a user chooses an item to get more information, a scale-up might be appropriate.


|CSS class    |Description  |Cubic bezier |Timing       |
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

###Responsive grid

Forget serving static, device-specific layouts. Fabric comes with a mobile-first, 12-column, responsive grid that you can use to create flexible layouts for a variety of screen sizes and device types.

![Responsive grid](http://odux.azurewebsites.net/github/img/ResponsiveGrid.png)

####Using the responsive grid
A grid (`.ms-Grid`) can contain multiple rows (`.ms-Grid-row`), each of which has one or more columns (`.ms-Grid-col`). Utility classes (`.ms-u-sm6`) specify how large each column should be on small, medium, and large devices. The columns in a row should add up to 12 for each device size. The following:

```html
<div class="ms-Grid">
  <div class="ms-Grid-row">
    <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg2">First</div>
    <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg10">Second</div>
  </div>
</div>
```

Results in:

![ResultGrid](http://odux.azurewebsites.net/github/img/ResultGrid.png)

####Inheritance
Because Fabric is mobile-first, any layout defined for small screens is automatically inherited by medium and large screens. The small size utilities (`.ms-u-sm6`) are required. If you want to change the layout on larger screens, you can apply the other utility classes.

####Push and pull
You might want your column source order to differ from the display order, or to change the column display order based on the screen size. The push and pull utilities make this possible. Push moves a column to the right; pull moves it to the left.

###Localization support

####Right-to-left support
Fabric comes with an alternate CSS file for pages written in right-to-left (RTL) languages, such as Arabic and Hebrew. This reverses the order of columns in the responsive grid, which makes it easy to create an RTL layout without writing additional templates. Future versions of Fabric will also reverse some icons and provide additional helper utilities.

Apply the **dir** attribute to the HTML tag, and reference the RTL version of Fabric.
```html
<html dir="rtl">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="fabric-[version].rtl.min.css">
  </head>
  ...
</html>
```

####Language-optimized fonts
By default, Fabric presents all text using the Western European character set of Segoe UI. For languages with other characters, Fabric will either serve a version of Segoe UI with a different character set or use a system font.

The HTML **lang** attribute specifies the language of the element's content. This is typically applied to the root HTML element, where it will be inherited by the entire page. In this example the entire page is in Thai.
```html
<html lang="th-TH">...</html>
```

For pages with content in multiple languages, the **lang** attribute can be applied to individual elements. In this example, a page that is mostly Thai also contains some Vietnamese.
```html
<html lang="th-TH">
  ...
  <section lang="vi-VN">...</section>
</html>
```

Fabric supports 24 language codes. These codes use the font stacks listed in the following table.

|Language|Code|Font stack|
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
