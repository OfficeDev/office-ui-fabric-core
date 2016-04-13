// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * ModalHost
 *
 * Hosts contextual menus and callouts
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

fabric.ModalHost = function(context, direction) {
  
  var _modalHost;
  var _menuVisible;
  var _curX = 0;
  var _curY = 0;
  
  function openMenu(direction) {
    
    _showMenu();
    
    // Position the menu first
    positionMenu(direction);
    
  }
  
  function positionMenu(direction) {
     switch (direction) {
      case "left":a
      default:
      break;
    }
  }
  
  function update() {
    if(_menuVisible) {
      _modalHost.style.display = "block";
    } else {
      _modalHost.style.display = "none";
    }
    
    // Update positioning
  }
  
   function toggleMenu() {
    if(_contextualMenu.classList.contains(CONTEXT_STATE_CLASS)) {
      _contextualMenu.classList.remove(CONTEXT_STATE_CLASS);
    } else {
      _contextualMenu.classList.add(CONTEXT_STATE_CLASS);
    }
  }
  
  function _showMenu() {
    _menuVisible = false;
  }
  
  function _saveDOMRefs(context) {
    _modalHost = context;
  }
  
  function _init() {
   _saveDOMRefs();
  }
  
  _init();

  return {
    redrawCommands: redrawCommands
  };

};