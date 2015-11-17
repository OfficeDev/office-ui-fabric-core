// Build and bundling configuration options

module.exports = {
  "bundles": [
    {
      "name": "fabric-full",
      "description": "A bundle containing all of Fabric's core and Component CSS.",
      "excludes": [],
      "options": {
        // Log helpful messages about the bundles being built. 
        "verbose": true,

        // Log warnings about the bundles being built. 
        "logWarnings": false
      }
    },
    {
      "name": "custom-bundle",
      "description": "A custom bundle including a handful of modules.",
      "includes": [
        "_Fabric.Color.Variables",
        "_Fabric.Color.Mixins",
        "_Fabric.Typography.Variables",
        "_Fabric.Typography",
        "_Fabric.Typography.Fonts",
        "_Fabric.Typography.Languageoverrides",
        "_Fabric.Utilities",
        "Button",
        "PersonaCard"
      ],
      "options": {
        "verbose": true,
        "logWarnings": false
      }
    }
  ]
};
