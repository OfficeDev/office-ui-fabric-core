var path = require('path');
var Config = function() {
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
		lessPath: this.srcPath + '/less',
		templatePath : this.srcPath + '/templates'
	};
	// Server Configuration
	this.port =  process.env.PORT || 2020;
	this.projectURL =  "http://localhost";
	this.projectDirectory =  path.resolve(__dirname, '../' + this.paths.distSamples);
}

module.exports = new Config();