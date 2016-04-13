// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * CommandButton
 *
 * Buttons used primarily in the command bar
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

fabric.CommandButton = function(context) {
  
  var CONTEXT_CLASS = ".ms-ModalHost";
  var CONTEXT_STATE_CLASS = "is-open";
  var CB_SPLIT_CLASS = ".ms-CommmandButton-splitIcon";
  
  var _commandButton;
  var _splitButton;
  var _modalHost;
  var _modalHostView;
  
  function _setDOMRefs() {
    _commandButton = context;
    _splitButton = _commandButton.querySelector(CB_SPLIT_CLASS);
    _modalHost = _commandButton.querySelector(CONTEXT_CLASS);
  }
  
  function _createModalHostView() {
    _modalHostView = new fabric["ModalHost"](_modalHost);
  }
  
  function _setClick() {
    if(_splitButton) {
      _splitButton.addEventListener("click", _toggleMenu, false);
    } else {
      _commandButton.addEventListener("click", _toggleMenu, false);
    }
  }
  
  function _checkForMenu() {
    if(_contextualMenu) {
      _createContextualMenu();
      _setClick();
    }
  }
  
  function _init() {
    _setDOMRefs();
    _checkForMenu();
  }
  
  _init();

  return {
  };

};