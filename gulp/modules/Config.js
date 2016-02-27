var path = require('path');
var pkg = require('../../package.json');

/**
 * Configuration class containing all properties to be used throughout the build          
 */
var Config = function() {
  this.debugMode = false;
  this.sassExtension = "scss";
  this.buildSass = false;
  this.copyRightMessage = "Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.";
	var distPath = 'dist';
	var srcPath = 'src';
	this.paths = {
		distComponents: distPath + '/components',
    distSass: distPath + '/sass',
		distCSS: distPath + '/css',
		distSamples: distPath + '/samples',
		distSampleComponents: distPath + '/samples/' +  '/Components',
		distJS: distPath + '/js',
		distPackages: distPath + '/packages',
		bundlePath: distPath + '/bundles',
		srcPath: srcPath,
		srcSamples: srcPath + '/samples',
    srcSass: srcPath + '/sass',
		componentsPath : 'src/components',
		templatePath : srcPath + '/templates'
	};
	this.port =  process.env.PORT || 2020;
	this.projectURL =  "http://localhost";
	this.projectDirectory =  path.resolve(__dirname, '../../' + this.paths.distSamples);
	this.servePaths = [
        {
            'urlPath': '/css',
            'folderPath': '../css'
        }
    ];
	this.nugetConfig = {
		id: "OfficeUIFabric",
		title: "Office UI Fabric",
		version: pkg.version,
		authors: "Microsoft Corporation",
		owners: "Microsoft Corporation",
		description: "Fabric is a responsive, mobile-first, front-end framework, designed to make it quick and simple for you to create web experiences using the Office Design Language. It’s easy to get up and running with Fabric—whether you’re creating a new Office experience from scratch or adding new features to an existing one.",
		summary: "The front-end framework for building experiences for Office and Office 365.",
		language: "en-us",
		projectUrl: "https://github.com/OfficeDev/Office-UI-Fabric",
		licenseUrl: "https://github.com/OfficeDev/Office-UI-Fabric/blob/master/LICENSE",
		copyright: "Copyright (c) Microsoft Corporation",
		requireLicenseAcceptance: true,
		tags: "Microsoft UI Fabric CSS",
		outputDir: this.paths.distPackages
	};
	this.nugetPaths = [
		{src: this.paths.distCSS, dest: "/content/Content/"},
		{src: this.paths.distSass, dest: "/content/Content/sass/"},
		{src: this.paths.distJS, dest: "/content/Scripts/"}
	];
  this.componentSamplesUpdate = "Components Samples updated successfully! Yay!";
  this.componentSamplesFinished = ' Component Samples build was successful! Yay!';
  //JS Files to be ignored in the JS Linter for Components
  //NOTE: Only use this for third party files, do not add any Fabric JS files to this.
  this.ignoreComponentJSLinting = [{
        src: this.paths.componentsPath + '/DatePicker/PickaDate.js',
        dist: this.paths.distSampleComponents + '/DatePicker/'
  }];
  //Errors
  this.genericBuildError = "Hmm, something went wrong in the build... Here is the error dump";
	this.bundlesConfig = {
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
	}
};

module.exports = new Config();