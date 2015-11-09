// Build and bundling configuration options

module.exports = {
  // Use a custom namespace prefix for all CSS classes instead of ms-.
  // This results in classes like od-font-m, od-Button, etc.
  // This is useful for preventing style collisions if multiple versions of Fabric
  // are used on a single page.
  "classPrefix": "o365",

  // Choose whether to build Fabric with a custom class prefix.
  "useCustomClassPrefix": false,

  // Configure
  "bundles": [
    {
      "name": "sample-bundle",
      "excludes": [
        "Button",
        "Breadcrumb",
        "Callout",
        "_Fabric.Typography"
      ],
      "options": {
        // By default, bundles are created by excludes. Set this to true to create a bottom-up
        // bundle instead.
        "preferIncludes": false,

        // Include more verbose command-line messages about the bundles being built. 
        "verbose": true
      }
    }
  ]
};
