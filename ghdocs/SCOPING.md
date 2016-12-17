# Version scoping
"Version-scoping" is a variation of Fabric Core which provides a wrapped or "scoped" version of every Fabric class under a modifier of the `.ms-Fabric` base class, which is tied to the current version. If the version is `5.1.0`, this "scope class" would take the form `.ms-Fabric--v5-1-0`.

## Why is this useful?
Version scoping is targeted at the scenario where multiple versions of Fabric Core may live on a single web page, whose differences between major versions could potentially introduce regressions or conflicts.

A practical example of this is the SharePoint Web Parts used for publishing articles. Web Parts are effectively miniature applications, each of which can depend on their own version of Fabric. To ensure that they can continue to exist on the same publishing page without:
1. Risking regressions from other web parts that might be using an older version of Fabric, and 
2. Forcing them to consume the latest (which would likely require work to update), 

the Web Part developer can scope the Fabric styles for their entire Web Part to the particular version that was used during development.  

## Usage
Usage of version scoping is straightforward. Simply append the "versioned class" to the container element you wish to scope, then use Fabric Core classes as you normally would.

Here's a minimal HTML page demonstrating this: 

```html
<html>
    <head>
        <!-- Link to the scoped styles for the current version of Fabric Core -->
        <link rel="stylesheet" href="/fabric-5.1.0.scoped.css">
    </head>
    <body>
        <!-- Add the scoping class -->
        <div class="ms-Fabric--v5-1-0">
            <!-- 
                Use Fabric as usual. These styles will be unaffected
                by other versions of Fabric. They also cannot be used
                outside of a scoped class.
            -->
            <h1 class="ms-font-su">Some scoped title <i class="ms-Icon ms-Icon--Info"></i></h1>
        </div>
    </body>
</html>
```

## Notes on fonts
Icon `@font-face` definitions (including the `font-family` name) and their font files are only scoped to **major versions** of Fabric. What this means is that all of the normal, additive changes to icon font files that occur within a major version's lifetime will be applied to a single font file, rather than maintaining separate font files for each minor or patch release. What this means is that there will not be `fabricmdl2icons-5.1.0.ttf`, `fabricmdl2icons-5.2.0.ttf`, etc. There will simply be `fabricmdl2icons-5.ttf`.

This is because generally icon font changes are purely additive, and rarely change significantly even between minor versions. However, the CSS classes for those icons (e.g. `ms-Icon--X`) *are* version scoped like normal classes. Also, note that the "unscoped" version of the icon font file as used today will still be available.

Finally, the standard, "unscoped" `@font-face` definitions to the Segoe UI webfonts are included in scoped Fabric unchanged. These fonts almost never change appreciably and are not considered risky to depend on between major releases.