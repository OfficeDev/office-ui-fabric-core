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
  var _dirX = 1;
  
  function continueParsing() {
    if(_dirX < directories.length) {
      var _file = directories[_dirX];
      var _fileContents;
      var _srcFolderName = Config.paths.componentsPath + '/' + _file;
      var _manifest = Utilities.parseManifest(_srcFolderName + '/' + _file + '.json');
       console.log("Hruuurr");
      
      gulp.src(src + '/' + _file + '/' + _file + '.html')
      .pipe(Plugins.handlebars(_manifest, Config.handleBarsConfig))
      .pipe(Plugins.tap(function(file, t) {
         _fileContents = file.contents.toString();
        }.bind(this)
      ))
      .on('end', function() {
        // console.log("Finishsss", _fileContents);
        // this.emit("end");
        // console.log(_fileContents);
        _parserHolder[_dirX] = new htmlparser.Parser(this.handler);
        _parserHolder[_dirX].write(_fileContents);
        _parserHolder[_dirX].done();
        // console.log(_parserHolder.length);
        _parserHolder[_dirX].reset();
        console.log(_dirX);
        _dirX++;
        continueParsing();
      }.bind(this));
    }
  };
  
  this.init = function() {
    continueParsing();
  };
  
  function parseElement(element, elementName, parentElement, parentElementName, isRoot) {
  
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

  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  };

  function purifyClassName(className) {
    return className.replace("ms-", "");
  };

  function processDOM(dom) {
    
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
      console.log("lkasdjflak;sdjf;salkdfj");
      if (error) {
        console.log(error);
      }
      console.log("Ayyy");
      _loadDoms.push(dom);
      console.log(_dirX >= directories.length, _dirX, directories.length);
     
      if (_dirX >= directories.length) {
        createComponents();
        // console.log("Creating Directory");
      } else {
        _dirX++;
      }
  }.bind(this));

  function createComponents() {
    console.log("Create components");
    
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

module.exports = Template;