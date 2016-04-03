// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Responsive Variables
 *
 * All fabric breakpoints used in fabric
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @constructor
 */
fabric.CommandBar = function(container) {
  this.container = container;
  this.init();
};

fabric.CommandBar.prototype = (function() {
  
  var CONTEXTUAL_MENU = ".ms-ContextualMenu";
  var CB_SEARCH_BOX = ".ms-SearchBox";
  var CB_MAIN_AREA = ".ms-CommandBar-mainArea";
  var CB_SIDE_COMMAND_AREA = ".ms-CommandBar-mainArea";
  var CB_ITEM_OVERFLOW = ".ms-CommandBar-overflowButton";
  var OVERFLOW_WIDTH = 41.5;
  
  var ResponsiveVariables = {
    "sm-min": 320,
    "md-min": 480,
    "lg-min": 640,
    "xl-min": 1024,
    "xxl-min": 1366,
    "xxxl-min": 1920
  };
  
  ResponsiveVariables["sm-max"] = ResponsiveVariables["md-min"] - 1;
  ResponsiveVariables["md-max"] = ResponsiveVariables["lg-min"] - 1;
  ResponsiveVariables["lg-max"] = ResponsiveVariables["xl-min"] - 1;
  ResponsiveVariables["xl-max"] = ResponsiveVariables["xxl-min"] - 1;
  ResponsiveVariables["xxl-max"] = ResponsiveVariables["xxxl-min"] - 1;

  var visibleCommands = [];
  var commandWidths = [];
  var overflowCommands = [];
  var itemCollection = [];
  var contextualItemContainerRef;
  var contextualItemLink;
  var contextualItemIcon;
  var breakpoint = "sm";
  var _elements = {};
  var activeCommand;
  
  var _hasClass = function(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  };

  var _getScreenSize = function() {
    // First we need to set what the screen is doing, check screen size
    var w = window;
    var wSize = {};
    var d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        
    wSize.x = w.innerWidth || e.clientWidth || g.clientWidth,
    wSize.y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    return wSize;
  };
  
  var _setBreakpoint = function() {
    var screenSize = _getScreenSize().x;
    
    switch(true) {
      case (screenSize <= ResponsiveVariables['sm-max']):
        if(breakpoint != "sm") { _saveCommandWidths(); }
        breakpoint = "sm";
        break;
      case (screenSize >= ResponsiveVariables['md-min'] && screenSize <= ResponsiveVariables['md-max']):
        if(breakpoint != "md") { _saveCommandWidths(); }
        breakpoint = "md";
        break;
      case (screenSize >= ResponsiveVariables['lg-min'] && screenSize <= ResponsiveVariables['lg-max']):
        if(breakpoint != "lg") { _saveCommandWidths(); }
        breakpoint = "lg";
        break;
      case (screenSize >= ResponsiveVariables['xl-min'] && screenSize <= ResponsiveVariables['xl-max']):
        if(breakpoint != "xl") { _saveCommandWidths(); }
        breakpoint = "xl";
        break;
      case (screenSize >= ResponsiveVariables['xxl-min'] && screenSize <= ResponsiveVariables['xxl-max']):
        if(breakpoint != "xxl") { _saveCommandWidths(); }
        breakpoint = "xxl";
        break;
      case (screenSize >= ResponsiveVariables['xxxl-min']):
        if(breakpoint != "xxxl") { _saveCommandWidths(); }
        breakpoint = "xxxl";
        break;
    }
  };
  
  var _setElements = function() {
    _elements = {
      container: this.container,
      mainArea: document.querySelector(CB_MAIN_AREA),
      sideCommandArea: document.querySelector(CB_SIDE_COMMAND_AREA),
      mainItems: [],
      overflowCommand: document.querySelector(CB_ITEM_OVERFLOW),
      contextMenu: document.querySelector(CONTEXTUAL_MENU),
      searchBox:  document.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX)
    }
  };
  
  var _createItemCollection = function() {
    var item,
        label,
        iconClasses,
        splitClasses,
        icon,
        href,
        items = document.querySelectorAll(CB_MAIN_AREA + ' .ms-Button:not(.ms-CommandBar-overflowButton)');
    
     
    console.log(items);
    for (var i = 0; i < items.length; i++) {
      item = items[i];
      label = item.querySelector(".ms-Button-label").textContent;
      iconClasses = item.querySelector(".ms-Icon").className;
      splitClasses = iconClasses.split(' ');
      
      for(var o = 0; o < splitClasses.length; o++) {
       if (splitClasses[o].indexOf('ms-Icon--') > -1) {
          icon =  splitClasses[o];
          break;
       }
      }
      
      itemCollection.push({
        item: item,
        label: label,
        icon: icon
      });
    }
    return;
  };
  
  var _createContextualRef = function() {
   contextualItemContainerRef = _elements.contextMenu.querySelector('.ms-ContextualMenu-item').cloneNode(true);
   contextualItemLink = contextualItemContainerRef.querySelector('.ms-ContextualMenu-link').cloneNode(false);
   contextualItemIcon = contextualItemContainerRef.querySelector('.ms-Icon').cloneNode(false);
   contextualItemContainerRef.innerHTML = '';
  };

  var _getElementWidth = function(element) {
    var width;
    
    if (element.offsetParent === null) {
      element.setAttribute('style', 'opacity: 0, display: block;');
    }
    
    width = element.getBoundingClientRect().width;
    styles = window.getComputedStyle(element);
    width += parseInt(styles.marginLeft) + parseInt(styles.marginRight);
    element.setAttribute('style', '');
    return width;
  }
  
  var _saveCommandWidths = function() {
    
    for (var i = 0; i < itemCollection.length; i++) {
      commandWidths[i] = _getElementWidth(itemCollection[i].item);
    }
  };
  
  var _updateCommands = function() {
    var searchCommandWidth = 0;
    var mainCommandSurfaceAreaWidth = _elements.mainArea.getBoundingClientRect().width; 
    var totalAreaWidth = mainCommandSurfaceAreaWidth;
    
    if(_elements.searchBox) {
      searchCommandWidth =  _getElementWidth(_elements.searchBox);
    }
    
    var totalCommandWidth = searchCommandWidth + OVERFLOW_WIDTH; // Start with searchbox width
    
    // Reset overflow and visible
    visibleCommands = [];
    overflowCommands = [];
    
    for (var i = 0; i < itemCollection.length; i++) {
      totalCommandWidth += commandWidths[i];
      
      if (totalCommandWidth < totalAreaWidth) {
        visibleCommands.push(itemCollection[i]);
      } else {
        overflowCommands.push(itemCollection[i]);  
      }
    }
  };
  
  var _drawCommands = function() {
    // Remove existing commands
    _elements.contextMenu.innerHTML = "";
    
    console.log(overflowCommands);
    for (var i = 0; i < overflowCommands.length; i++) {
      
      overflowCommands[i].item.classList.add('is-hidden');
      // Add all items to contextual menu.
      var newCItem = contextualItemContainerRef.cloneNode(false);
      var newClink = contextualItemLink.cloneNode(false);
      var newIcon = contextualItemIcon.cloneNode(false);
      var iconClass =  overflowCommands[i].icon;
      
      newClink.innerText = overflowCommands[i].label;
      newCItem.appendChild(newClink);
      newIcon.className = "ms-Icon " + iconClass;
      newCItem.appendChild(newIcon);
      _elements.contextMenu.appendChild(newCItem);
    }
    
    // Show visible commands
    for (var i = 0; i < visibleCommands.length; i++) {
      visibleCommands[i].item.classList.remove('is-hidden'); 
    }
  };
  
  var _setWindowEvent = function() {
    window.onresize = _doResize;
  };
  
  var _handleSearchClick = function(e) {
    if(!_hasClass(e.target, "ms-SearchBox-field")) {
      if(_hasClass(_elements.searchBox, "is-active")) {
        _elements.searchBox.classList.remove('is-active');
      } else {
        _elements.searchBox.classList.add('is-active');
      }
    }
  };
  
  var _setSmSearchClick = function() {
    _elements.searchBox.removeEventListener("click", _handleSearchClick, false);
    _elements.searchBox.addEventListener("click", _handleSearchClick, false);
    document.documentElement.addEventListener("click", function(e) {
      if(e.target.className.indexOf(CB_SEARCH_BOX.replace('.', '')) > -1) {
        e.stopPropagation();
      }
    }, false);
  };

  var _setUIState = function() {
    switch(breakpoint) {
      case "sm":
        _elements.searchBox.classList.add('is-collapsed');
        _setSmSearchClick();
        break;
      case "md":
        _elements.searchBox.classList.add('is-collapsed');
        _setSmSearchClick();
        break;
      case "lg":
        _elements.searchBox.classList.add('is-collapsed');
        _setSmSearchClick();
        break;
      case "xl":
        _elements.searchBox.classList.remove('is-collapsed');
        break;
      default:
        _elements.searchBox.classList.remove('is-collapsed');
        break;
    }
  };
  
  var _checkOverflow = function() {
    if(overflowCommands.length > 0) {
      _elements.overflowCommand.classList.remove('is-hidden');
    } else {
      _elements.overflowCommand.classList.add('is-hidden');
    }
  };
  
  var _toggleOverflowMenu = function() {
    var left;

    if(_hasClass(_elements.contextMenu, "is-open")) {
      _elements.contextMenu.setAttribute("style", "");
      _elements.contextMenu.classList.remove('is-open');
    } else {
      // Show contextual menu
      activeCommand = _elements.overflowCommand;
      left = activeCommand.getBoundingClientRect().left;
      _elements.contextMenu.classList.add('is-open');
      _redrawMenu();
    }
     
  };
  
  var _redrawMenu = function() {
    var left;
    
    if(_hasClass(_elements.contextMenu, "is-open")) {
       left = activeCommand.getBoundingClientRect().left;
       _drawOverflowMenu(left);
    }
  };
  
  var _drawOverflowMenu = function(left) {
    _elements.contextMenu.setAttribute("style", "left: " + left + "px; transform: translateX(-50%)");
  };
  
  var _setOverflowAction = function() {
    _elements.overflowCommand.addEventListener("click", _toggleOverflowMenu.bind(this));
  };
  
  var _doResize = function() {
    _setBreakpoint();
    _setUIState();
    _updateCommands();
    _drawCommands();
    _checkOverflow();
    _redrawMenu();
  };
  
  /**
   * initializes component
   */
  
  var init = function() {
    _setElements();
    _setBreakpoint();
    _setUIState();
    _createItemCollection();
    _createContextualRef();
    _saveCommandWidths();
    _updateCommands();
    _drawCommands();
    _setWindowEvent();
    _setOverflowAction();
    _checkOverflow();
  };

  return {
    init: init
  };

}());