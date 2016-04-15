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
  var CB_SPLIT_CLASS = ".ms-CommmandButton-splitIcon";
  var MODAL_POSITION = "bottom";
  
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
    _modalHostView = new fabric["ModalHost"](_modalHost, MODAL_POSITION, _commandButton);
  }
  
  function _setClick() {
    if(_splitButton) {
      _splitButton.addEventListener("click", _createModalHostView.bind(this), false);
    } else {
      _commandButton.addEventListener("click", _createModalHostView.bind(this), false);
    }
  }
  
  function _checkForMenu() {
    if(_modalHost) {
      _createModalHostView();
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