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

fabric.CommandBar = function(context) {
  
  var CONTEXTUAL_MENU = ".ms-ContextualMenu";
  var CONTEXTUAL_MENU_ITEM = ".ms-ContextualMenu-item";
  var CONTEXTUAL_MENU_LINK = ".ms-ContextualMenu-link";
  var CB_SEARCH_BOX = ".ms-SearchBox";
  var CB_MAIN_AREA = ".ms-CommandBar-mainArea";
  var CB_SIDE_COMMAND_AREA = ".ms-CommandBar-mainArea";
  var CB_ITEM_OVERFLOW = ".ms-CommandBar-overflowButton";
  var SEARCH_BOX_FIELD = ".ms-SearchBox-field";
  var SEARCH_BOX_CLOSE = ".ms-SearchBox-closeField";
  var COMMAND_BUTTON = ".ms-CommandButton";
  var COMMAND_BUTTON_LABEL = ".ms-CommandButton-label";
  var ICON = '.ms-Icon';
  
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
  
  function processCommands() {
    _updateCommands();
    _drawCommands();
    _checkOverflow();
  }
  
  function _hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function _getScreenSize() {
    // First we need to set what the screen is doing, check screen size
    var w = window;
    var wSize = {};
    var d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        
    wSize.x = w.innerWidth || e.clientWidth || g.clientWidth;
    wSize.y = w.innerHeight || e.clientHeight || g.clientHeight;
    
    return wSize;
  }
  
  function _setBreakpoint() {
    var screenSize = _getScreenSize().x;
    
    switch(true) {
      case (screenSize <= ResponsiveVariables['sm-max']):
        if(breakpoint !== "sm") { _saveCommandWidths(); }
        breakpoint = "sm";
        break;
      case (screenSize >= ResponsiveVariables['md-min'] && screenSize <= ResponsiveVariables['md-max']):
        if(breakpoint !== "md") { _saveCommandWidths(); }
        breakpoint = "md";
        break;
      case (screenSize >= ResponsiveVariables['lg-min'] && screenSize <= ResponsiveVariables['lg-max']):
        if(breakpoint !== "lg") { _saveCommandWidths(); }
        breakpoint = "lg";
        break;
      case (screenSize >= ResponsiveVariables['xl-min'] && screenSize <= ResponsiveVariables['xl-max']):
        if(breakpoint !== "xl") { _saveCommandWidths(); }
        breakpoint = "xl";
        break;
      case (screenSize >= ResponsiveVariables['xxl-min'] && screenSize <= ResponsiveVariables['xxl-max']):
        if(breakpoint !== "xxl") { _saveCommandWidths(); }
        breakpoint = "xxl";
        break;
      case (screenSize >= ResponsiveVariables['xxxl-min']):
        if(breakpoint !== "xxxl") { _saveCommandWidths(); }
        breakpoint = "xxxl";
        break;
    }
  }
  
  function _setElements() {
    _elements = {
      container: context.container,
      mainArea: document.querySelector(CB_MAIN_AREA),
      sideCommandArea: document.querySelector(CB_SIDE_COMMAND_AREA),
      mainItems: [],
      overflowCommand: document.querySelector(CB_ITEM_OVERFLOW),
      contextMenu: document.querySelector(CONTEXTUAL_MENU),
      searchBox:  document.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX),
      searchBoxClose: document.querySelector(SEARCH_BOX_CLOSE)
    };
  }
  
  function _createItemCollection() {
    var item,
        label,
        iconClasses,
        splitClasses,
        icon,
        items = document.querySelectorAll(CB_MAIN_AREA + ' ' + COMMAND_BUTTON +':not('+ CB_ITEM_OVERFLOW +')');
    
    for (var i = 0; i < items.length; i++) {
      item = items[i];
      label = item.querySelector(COMMAND_BUTTON_LABEL).textContent;
      iconClasses = item.querySelector(ICON).className;
      splitClasses = iconClasses.split(' ');
      
      for(var o = 0; o < splitClasses.length; o++) {
       if (splitClasses[o].indexOf(ICON.replace('.', '') + '--') > -1) {
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
  }
  
  function _createContextualRef() {
   contextualItemContainerRef = _elements.contextMenu.querySelector(CONTEXTUAL_MENU_ITEM).cloneNode(true);
   contextualItemLink = contextualItemContainerRef.querySelector(CONTEXTUAL_MENU_LINK).cloneNode(false);
   contextualItemIcon = contextualItemContainerRef.querySelector('.ms-Icon').cloneNode(false);
   contextualItemContainerRef.innerHTML = '';
  }

  function _getElementWidth(element) {
    var width,
        styles;
    
    if (element.offsetParent === null) {
      element.setAttribute('style', 'position: absolute; opacity: 0; display: block;');
    }
    
    width = element.getBoundingClientRect().width;
    styles = window.getComputedStyle(element);
    width += parseInt(styles.marginLeft) + parseInt(styles.marginRight);
    element.setAttribute('style', '');
    return width;
  }
  
  function _saveCommandWidths() {
    
    for (var i = 0; i < itemCollection.length; i++) {
      var item = itemCollection[i].item;
      var width = _getElementWidth(item);
      commandWidths[i] = width;
    }
  }
  
  function _updateCommands() {
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
  }
  
  function _drawCommands() {
    // Remove existing commands
    _elements.contextMenu.innerHTML = "";
    
    for (var i = 0; i < overflowCommands.length; i++) {
      
      overflowCommands[i].item.classList.add('is-hidden');
      // Add all items to contextual menu.
      var newCItem = contextualItemContainerRef.cloneNode(false);
      var newClink = contextualItemLink.cloneNode(false);
      var newIcon = contextualItemIcon.cloneNode(false);
      var iconClass =  overflowCommands[i].icon;
      
      newClink.innerText = overflowCommands[i].label;
      newCItem.appendChild(newClink);
      newIcon.className = ICON.replace('.', "") + " " + iconClass;
      newCItem.appendChild(newIcon);
      _elements.contextMenu.appendChild(newCItem);
    }
    
    // Show visible commands
    for (var x = 0; x < visibleCommands.length; x++) {
      visibleCommands[x].item.classList.remove('is-hidden'); 
    }
  }
  
  function _setWindowEvent() {
    window.onresize = _doResize;
  }
  
  function _removeSearchEvent() {
     _elements.searchBox.removeEventListener("click", _handleSearchClick, false);
  }
  
  function _handleSearchClick(e) {
    // If the target is NOT the searchbox field then make it active, and 
    // add document event click
    if(!_hasClass(e.target, SEARCH_BOX_FIELD.replace(".", ""))) {
      _removeSearchEvent();
      _elements.searchBoxClose.addEventListener('click', _handleOutsideSearchClick, false);
      document.addEventListener('click', _handleOutsideSearchClick, false);
    }
  }
  
  function _setSmSearchClick() {
    _removeSearchEvent();
    _elements.searchBox.addEventListener("click", _handleSearchClick, false);
  }
  
  function _handleOutsideSearchClick(e) {
    if(e.target) {
      // If the click isnt the searchbox or a child of, remove active state
      if(!_elements.searchBox.contains(e.target) || e.target !== _elements.searchBox) {
         _elements.searchBox.classList.add('is-active');
        document.removeEventListener("click", _handleOutsideSearchClick, false);
      }
    }
  }

  function _setUIState() {
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
  }
  
  function _checkOverflow() {
    if(overflowCommands.length > 0) {
      _elements.overflowCommand.classList.remove('is-hidden');
    } else {
      _elements.overflowCommand.classList.add('is-hidden');
      if(activeCommand === _elements.overflowCommand) {
        _elements.contextMenu.classList.remove('is-open');
      }
    }
  }
  
  function _toggleOverflowMenu() {
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
     
  }
  
  function _redrawMenu() {
    var left;
    
    if(_hasClass(_elements.contextMenu, "is-open")) {
       left = activeCommand.getBoundingClientRect().left;
       _drawOverflowMenu(left);
    }
  }
  
  function _drawOverflowMenu(left) {
    _elements.contextMenu.setAttribute("style", "left: " + left + "px; transform: translateX(-50%)");
  }
  
  function _setOverflowAction() {
    _elements.overflowCommand.addEventListener("click", _toggleOverflowMenu.bind(this));
  }
  
  function _doResize() {
    _setBreakpoint();
    _setUIState();
    _redrawMenu();
    processCommands();
  }
  
  /**
   * initializes component
   */
  function _init() {
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
  }
  
  _init();

  return {
    processCommands: processCommands
  };

};