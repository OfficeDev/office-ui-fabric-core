var path = require('path');
var config = require('./Config');
var pkg = require('../../package.json');

var Config = function() {
    //Debug Mode
    this.debugMode = true;
    
	// Define paths.
	this.distPath = 'dist';
	this.srcPath = 'src';
	this.paths = {
		distPath: this.distPath,
		distComponents: this.distPath + '/components',
		distLess: this.distPath + '/less',
		distCSS: this.distPath + '/css',
		distSamples: this.distPath + '/samples',
		distSampleComponents: this.distPath + '/samples/' +  '/Components',
		distJS: this.distPath + '/js',
		distPackages: this.distPath + '/packages',
		srcPath: this.srcPath,
		srcSamples: this.srcPath + '/samples',
		componentsPath : 'src/components',
		srcLess: this.srcPath + '/less',
		templatePath : this.srcPath + '/templates'
	};
	// Server Configuration
	this.port =  process.env.PORT || 2020;
	this.projectURL =  "http://localhost";
	this.projectDirectory =  path.resolve(__dirname, '../' + this.paths.distSamples);
	this.servePaths = [
        {
            'urlPath': '/css',
            'folderPath': '../css'
        }
    ]
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
		{src: this.paths.componentsPath, dest: "/content/components/"},
		{src: this.paths.distCSS, dest: "/content/css/"},
		{src: this.paths.distJS, dest: "/content/scripts/"},
		{src: this.paths.distLess, dest: "/content/less/"}
	];
    
    // Build Messsages
    this.componentSamplesUpdate = "Components Samples updated successfully! Yay!";
    this.componentSamplesFinished = ' Component Samples build was successful! Yay!';
	
}

module.exports = new Config();