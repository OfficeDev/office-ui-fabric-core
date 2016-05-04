var htmlparser = require("htmlparser2");
var fs = require("fs");
var path = require("path");

var createElementTree = [];
var directories = getDirectories('./components');
var currentDirectory = 1; // Counter for current directory
var parserHolder = [];
var createString = "";
var loadDoms = [];

function parseElement(element, elementName, parentElement, parentElementName, isRoot) {
  
  if(element.type == "text") {
    var someText = element.data.replace(/(\r\n|\n|\r)/gm,"");
    createString += parentElementName + '.innerHTML += "' + someText + '";' + "\r\n";
  } else {
    
    createString += 'var ' + elementName + ' = document.createElement("' + element.name + '");'  + "\r\n";
    var attributes = element.attribs || {};
    
    //Set Attribute
    var keys = Object.keys(element.attribs);
    
    for(var x = 0; x < keys.length; x++) {
      var attribName = keys[x];
      var attribValue = element.attribs[attribName];
      createString += elementName + '.setAttribute("' + attribName + '", "' + attribValue + '");'  + "\r\n";
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
      createString += parentElementName + '.appendChild(' + elementName + ');'  + "\r\n";
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
  
  if (dom.length > 1) {
    // Add a root element
    console.log("error! There must be a root element");
  } else {
    var cAttr = dom[0].attribs.class;
    rootName = purifyClassName(cAttr); // This would be passed in by folder
  }
  
  var children = dom.children;  
  createString += "function " + rootName + "() {";
   
  for (var i = 0; i < dom.length; i++) {
    var newName = rootName + i;
    createString += 'var ' + newName + ' = document.createElement("' + dom[i].name + '");';
    
    parseElement(dom[i], newName, {
      children: [],
      attribs:  {class: "document"}
    }, "document", true);
  }
 
  createString += "return " + newName; 
  createString += "}"
  fs.writeFileSync('./components/' + rootName + '/' + rootName + '.js', createString);
}

var handler = new htmlparser.DomHandler(function (error, dom) {
    if (error) {
       console.log(error);
    }
    
    loadDoms.push(dom);

    if (currentDirectory >= directories.length) {
      createComponents();
    } else {
      currentDirectory++;
    }
});

for (var x = 0; x < directories.length; x++) {
  var file = directories[x];
  var fileContents = fs.readFileSync('./components/' + file + '/' + file + '.html');
  parserHolder[x] = new htmlparser.Parser(handler);
  parserHolder[x].write(fileContents);
  parserHolder[x].end();
  parserHolder[x].reset();
}

function createComponents() {
  for (var x = 0; x < loadDoms.length; x++) {
    processDOM(loadDoms[x]);
  }
}
