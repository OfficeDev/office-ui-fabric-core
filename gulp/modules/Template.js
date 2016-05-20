"use strict";

var htmlparser = require("htmlparser2");
var Handlebars = require('handlebars');
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var Config = require('./Config');
var Plugins = require('./Plugins');
var Utilities = require('./Utilities');
var mkdirp = require('mkdirp');
var gutil = require('gulp-util');
var ErrorHandling = require('./ErrorHandling');
var sys = require('sys')
var exec = require('child_process').exec;


// Prep handlebars
  // Register all helper
  
var Template = function(directories, dist, src, callback) {
  var _currentDirectory = 1; // Counter for current directory
  var _parserHolder = [];
  var _createString = "class FabricTemplateLibrary {";
  var _loadDoms = [];
  var _dirX = 0;
  var _errorNoRoot = "error! There must be no more than two root elements, all components must have ONE root element";
  var _errorNoElements = "error! You must have atleast one element in the component that is not a comment!";
  var _existingElements = [];
  
  var _handler = new htmlparser.DomHandler(function (error, dom) {
    if (error) {
      console.log(error);
    }
    
    _loadDoms.push(dom);
    
    if (_dirX >= directories.length - 1) {
      createComponents();
    } else {
      _dirX++;
    }
  });
  
  function configHandlebars() {
    var _file;
    var _openFile;
  
    Handlebars.registerHelper("renderPartial",  function(partial, props) {
      var fileContents = Plugins.fs.readFileSync(Config.paths.componentsPath + '/' + partial + '/' + partial +'.hbs',  "utf8");
      var template = Handlebars.compile(fileContents);
      var thisProps = {props: props};
      return new Handlebars.SafeString(template(thisProps));
    });
    
    for (var i = 0; i < directories.length; i++) {
      _file = directories[i];
      _openFile = fs.readFileSync(src + '/' + _file + '/' + _file + '.hbs', "utf8");
      Handlebars.registerPartial(_file, _openFile);
    }
  }
  
  function startParsing() {

    for (var x = 0; x < directories.length; x++) {
      var _file = directories[x];
      var _srcFolderName = Config.paths.componentsPath + '/' + _file;
      var _manifest = Utilities.parseManifest(_srcFolderName + '/' + _file + '.json');
      var _openFile = fs.readFileSync(src + '/' + _file + '/' + _file + '.hbs', "utf8");
      
      var _hbsTemplate = Handlebars.compile(_openFile);
      var _hbsCompiled = _hbsTemplate(_manifest);
      
      _parserHolder[x] = new htmlparser.Parser(_handler);
      
      _parserHolder[x].write(_hbsCompiled);
      _parserHolder[x].end();
      _parserHolder[x].reset();
    }
  }
  
  function parseElement(element, elementName, parentElement, parentElementName, isRoot) {
    
      if(element.type == "comment") {
          // DO nothing
      } else if(element.type == "text") {
        var someText = element.data.replace(/(\r\n|\n|\r)/gm, "");
        _createString += parentElementName + '.innerHTML += "' + someText + '";' + "\r\n";
      } else {
        
        _createString += 'let ' + elementName + ' = document.createElement("' + element.name + '");'  + "\r\n";
        var attributes = element.attribs || {};
        
        //Set Attribute
        var keys = Object.keys(element.attribs);
        
        for(var x = 0; x < keys.length; x++) {
          var attribName = keys[x];
          var attribValue = element.attribs[attribName].replace(/(\r\n|\n|\r)/gm,"");
          _createString += elementName + '.setAttribute("' + attribName + '", "' + attribValue + '");'  + "\r\n";
        }
        
        for(var i = 0; i < element.children.length; i++) {
          var newName = elementName + "c" + i;
          var child = element.children[i];
          parseElement(child, newName, element, elementName);
        }
        
        if(isRoot) {
          // Dont do anything
        } else {
          // Append this element to the parent element
          _createString += parentElementName + '.appendChild(' + elementName + ');'  + "\r\n";
        }
      }
  }

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }

  function purifyClassName(className) {
    return className.replace("ms-", "");
  }

  function processDOM(dom) {
    var _newDom = [];
    
    // Go through and remove any comment tags
    for (var i = 0; i < dom.length; i++) {
      if(dom[i].type != "comment" && dom[i].type != "text") {
        _newDom.push(dom[i]);
      }
    }
    
    if(_newDom.length > 1) {
      ErrorHandling.generatePluginError("Fabric Super Templating Engine 9000", _errorNoRoot);
      ErrorHandling.generateBuildError(JSON.stringify(dom));
    } else if(_newDom.length < 1) {
      ErrorHandling.generatePluginError("Fabric Super Templating Engine 9000", _errorNoElements);
      ErrorHandling.generateBuildError(JSON.stringify(dom));
    } else {
      
      var _thisDom = _newDom[0];
      var cAttr = _newDom[0].attribs.class.split(" ")[0].replace(/(\r\n|\n|\r)/gm,"");
      var rootName = purifyClassName(cAttr); // This would be passed in by folder
      var newName = rootName + "0";
      
      if(!(rootName in _existingElements)) {
        _existingElements.push(rootName);
        
        _createString += "public " + rootName + "() {";
        
        parseElement(_thisDom, newName, {
          children: [],
          attribs:  {class: "document"}
        }, "document", true);

        _createString += " return " + newName; 
        _createString += "}";
        
      }
    }
  }

  function createComponents() {
    var _jsPath = dist + '/' + 'fabric.templates' + '.ts';
    for (var x = 0; x < _loadDoms.length; x++) {
      processDOM(_loadDoms[x]);
    }
    _createString += "}"
    
    mkdirp.sync(dist);
    fs.writeFileSync(_jsPath, _createString);
    
    //Completed
    if(callback) {
      callback();
    }
  }
  
  this.init = function() {
    configHandlebars();
    startParsing();
  };
  
};

module.exports = Template;