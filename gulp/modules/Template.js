var htmlparser = require("htmlparser2");
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var Config = require('./Config');
var Plugins = require('./Plugins');
var Utilities = require('./Utilities');

var Template = function(directories, dist, src, callback) {
  var _currentDirectory = 1; // Counter for current directory
  var _parserHolder = [];
  var _createString = "";
  var _loadDoms = [];
  var _dirX = 0;
  
  this.continueParsing = function() {
    if(_dirX < directories.length) {
      var _file = directories[_dirX];
      var _fileContents;
      var _srcFolderName = Config.paths.componentsPath + '/' + _file;
      var _manifest = Utilities.parseManifest(_srcFolderName + '/' + _file + '.json');
       console.log("Hruuurr");
      
      gulp.src(src + '/' + _file + '/' + _file + '.html')
      .pipe(Plugins.handlebars(_manifest, Config.handleBarsConfig))
      .pipe(Plugins.tap(function(file, t) {
         _fileContents = file.contents;
        }.bind(this)
      ))
      .on('end', function() {
        console.log("Finishsss");
        // this.emit("end");
        _parserHolder[_dirX] = new htmlparser.Parser(this.handler, {
          onreset: function() {
            _dirX++;
            this.continueParsing();
          }.bind(this)
        });
        _parserHolder[_dirX].write(_fileContents);
        _parserHolder[_dirX].end();
        _parserHolder[_dirX].reset();
      }.bind(this));
    }
  };
  
  this.init = function() {
    this.continueParsing();
  };
  
  this.parseElement = function(element, elementName, parentElement, parentElementName, isRoot) {
  
    if(element.type == "text") {
      var someText = element.data.replace(/(\r\n|\n|\r)/gm,"");
      _createString += parentElementName + '.innerHTML += "' + someText + '";' + "\r\n";
    } else {
      
      _createString += 'var ' + elementName + ' = document.createElement("' + element.name + '");'  + "\r\n";
      var attributes = element.attribs || {};
      
      //Set Attribute
      var keys = Object.keys(element.attribs);
      
      for(var x = 0; x < keys.length; x++) {
        var attribName = keys[x];
        var attribValue = element.attribs[attribName];
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
  };

  this.getDirectories = function(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  };

  this.purifyClassName = function(className) {
    return className.replace("ms-", "");
  };

  this.processDOM = function(dom) {
    
    if (dom.length > 1) {
      // Add a root element
      console.log("error! There must be a root element");
    } else {
      var cAttr = dom[0].attribs.class;
      rootName = purifyClassName(cAttr); // This would be passed in by folder
    }
    
    var children = dom.children;  
    _createString += "function " + rootName + "() {";
    
    for (var i = 0; i < dom.length; i++) {
      var newName = rootName + i;
      _createString += 'var ' + newName + ' = document.createElement("' + dom[i].name + '");';
      
      parseElement(dom[i], newName, {
        children: [],
        attribs:  {class: "document"}
      }, "document", true);
    }
  
    _createString += "return " + newName; 
    _createString += "}"
      console.log("Creating file", dist + '/' + rootName + '/' + rootName + '.lib.js');
    fs.writeFileSync(dist + '/' + rootName + '/' + rootName + '.lib.js', _createString);
  };

  this.handler = new htmlparser.DomHandler(function (error, dom) {
      if (error) {
        console.log(error);
      }
      
      _loadDoms.push(dom);
       console.log(_currentDirectory >= directories.length, _currentDirectory, directories.length);
      if (_currentDirectory >= directories.length) {
        createComponents();
        onsole.log("Creating Directory");
      } else {
        _currentDirectory++;
      }
  });

  this.createComponents = function() {
    for (var x = 0; x < _loadDoms.length; x++) {
      processDOM(_loadDoms[x]);
    }
    
    //Completed
    if(callback) {
      callback();
    }
  }
  
  // this.init();
};

// module.exports = Template;