// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * SearchBox component
 *
 * Allows you to search the world.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of SearchBox
 * @constructor
 *
 */
fabric.SearchBox = function(context) {
  
  var SB = '.ms-SearchBox';
  var SB_FIELD = '.ms-SearchBox-field';
  var SB_CLOSE_BUTTON = '.ms-SearchBox-closeButton';
  var SB_HAS_TEXT = 'has-text';
  var SB_IS_ACTIVE = 'is-active';
  
  var _searchBoxField;
  var _searchBox;
  var _searchBoxCloseButton;
  
  var _cancel = false;
  
  var _saveDOMRefs = function(context) {
    _searchBox = context;
    _searchBoxField = _searchBox.querySelector(SB_FIELD);
    _searchBoxCloseButton = _searchBox.querySelector(SB_CLOSE_BUTTON);
  };
  
  var _setHasText = function () {
    if(_searchBoxField.value.length > 0) {
      _searchBox.classList.add(SB_HAS_TEXT);
    } else {
      _searchBox.classList.remove(SB_HAS_TEXT);
    }
  };
  
  var _setFocusAction = function (context) {
    _searchBoxField.onfocus = function() {
      _setHasText();
      _searchBox.classList.add(SB_IS_ACTIVE);
    };
  };
  
  var _setCloseButtonAction = function() {
    _searchBoxCloseButton.addEventListener("mousedown", function() {
      _cancel = true;
    }, false);
  };
  
  var _setBlurAction = function() {
    _searchBoxField.addEventListener("blur", function() {
      if(_cancel) {
        _searchBoxField.value = "";
      }
      
      setTimeout(function() {
        _searchBox.classList.remove(SB_IS_ACTIVE);
      }, 10);
      
      _setHasText();
      _cancel = false;      
    }, false);
  };
  
  /**
   * initializes component
   */
  var _init = function() {
    _saveDOMRefs(context);
    _setHasText();
    _setFocusAction(context);
    _setCloseButtonAction();
    _setBlurAction();
  };
  
  _init();

  return {
  };
};