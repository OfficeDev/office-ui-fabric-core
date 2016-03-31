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
  
  var _getScreenSize = function() {
    // First we need to set what the screen is doing, check screen size
    var w = window,
    var window = {};
    var d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
        
    window.x = w.innerWidth || e.clientWidth || g.clientWidth,
    window.y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return w
  };
  
  var visibleCommands = [];
  var commandWidths = [];
  var overflowCommands = [];
  
  var _elements = {
    container: this.container,
    mainArea: document.querySelector('.ms-CommandBar-mainArea'),
    mainItems: [],
    overflowCommand: document.querySelector('.ms-CommandBarItem-overflow')
  };
  
  var _getElementWidth = function(element) {
    var width;
    if(element.offsetParent === null) {
      element.setAttribute('style', 'opacity: 0, display: block;');
    }
    width = element.getBoundingClientRect().width;
    element.setAttribute('style', '');
    return width;
  }

  var _createItemCollection = function() {
    var items = document.querySelectorAll('.ms-CommandBar-mainArea .ms-Button :not(.ms-CommandBar-overflowButton)');
    for(var i = 0; i < items.length; i++) {
      var item = items[i];
      var label = item.querySelector(".ms-Button-label").textContent;
      var iconClass = item.querySelector(".ms-Icon").className;;
    }
  };
  
  var _saveCommandWidths = function() {
    for (var i = 0; i < mainItems.length; i++) {
      commandWidths[i] = mainItems[i].getBoundingClientRect().width;
    }
  };
  
  var _updateCommands = function() {
    var overflowCommandWidth = _elements.overflowCommand.getBoundingClientRect().width;
    var mainCommandSurfaceAreaWidth = _elements.mainArea.getBoundingClientRect().width;
    var totalAreaWidth = mainCommandSurfaceAreaWidth - overflowCommandWidth;
    var totalCommandWidth = 0;
    
    for (var i = 0; i < mainItems.length; i++) {
      totalCommandWidth += _getElementWidth(commandWidths[i]);
      
      if (totalCommandWidth < totalAreaWidth) {
        visibleCommands.push(mainItems[i]);
      } else {
        overflowCommands.push(mainItems[i]);  
      }
    }
  };
  
  var _drawCommands = function() {
    // Hide commands
    for (var i = 0; i < overflowCommands.length; i++) {
      overflowCommands.classList.add('is-hidden');
    }
    
    // Show visible commands
    for (var i = 0; i < visibleCommands.length; i++) {
      visibleCommands.classList.remove('is-visible');
    }
    
  };
  
  /**
   * initializes component
   */
  var init = function() {
    return CommandBar;
  };

  return {
    init: init
  };

}());