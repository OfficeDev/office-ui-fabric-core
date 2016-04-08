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
  var SB_CLOSE_BUTTON = '.ms-CommandButton';
  var SB_HAS_TEXT = 'has-text';
  var SB_IS_ACTIVE = 'is-active';
  var SB_IS_COLLAPSED = 'is-collapsed';
  
  var _searchBoxField;
  var _searchBox;
  var _searchBoxCloseButton;
  
  var _cancel = false;
  
  function setCollapsedListeners() {
    _disposeListeners();
    _searchBox.addEventListener("click", _expandSearchHandler, false);
    _searchBoxField.addEventListener('focus', _expandSearchHandler, true);
  }
  
  function _saveDOMRefs(context) {
    _searchBox = context;
    _searchBoxField = _searchBox.querySelector(SB_FIELD);
    _searchBoxCloseButton = _searchBox.querySelector(SB_CLOSE_BUTTON);
  }
  
  function _hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
  
  function _disposeListeners() {
     _searchBox.removeEventListener("click", _expandSearchHandler, false);
     _searchBoxField.removeEventListener('focus', _expandSearchHandler, true);
  }
  
  function _handleOutsideSearchClick(e) {
    // If the elemenet clicked is not INSIDE of searchbox then close seach
    if(!_searchBox.contains(e.target) && e.target !== _searchBox) {
      _collapseSearchBox();
      document.removeEventListener("click", _handleOutsideSearchClick, false);
      setCollapsedListeners();
    }
  }
  
  function _collapseSearchBox() {
    _searchBox.classList.remove("is-active");
  }
  
  function _expandSearchHandler() {
    _disposeListeners();
    _searchBox.classList.add('is-active');
    _searchBoxField.focus();
    console.log("mehrr");
    _searchBoxCloseButton.addEventListener('click', _collapseSearchBox, false);
    document.addEventListener('click', _handleOutsideSearchClick, false);
  }
  
  function _setHasText() {
    if(_searchBoxField.value.length > 0) {
      _searchBox.classList.add(SB_HAS_TEXT);
    } else {
      _searchBox.classList.remove(SB_HAS_TEXT);
    }
  }
  
  function _setFocusAction(context) {
    _searchBoxField.addEventListener("focus", function() {
      console.log(document.activeElement);
      _setHasText();
      _searchBox.classList.add(SB_IS_ACTIVE);
    }, true);
  }
  
  function _setCloseButtonAction() {
    _searchBoxCloseButton.addEventListener("mousedown", function() {
      _cancel = true;
    }, false);
  }
  
  function _handleBlur() {
    if(_cancel) {
      _searchBoxField.value = "";
    }
    setTimeout(function() {
      console.log(_searchBox.contains(document.activeElement));
      if(!_searchBox.contains(document.activeElement)) {
        _searchBox.classList.remove(SB_IS_ACTIVE);
      }
    }, 10);
    _setHasText();
    _cancel = false;
  }
  
  function _setBlurAction() {
    _searchBoxField.addEventListener("blur", _handleBlur, true);
    _searchBoxCloseButton.addEventListener("blur", _handleBlur, true);
  }
  
  function _checkState() {
    if(_hasClass(_searchBox, "is-collapsed")) {
      setCollapsedListeners();
    }
  }
  
  /**
   * initializes component
   */
  function _init() {
    _saveDOMRefs(context);
    _setHasText();
    _setFocusAction(context);
    _setCloseButtonAction();
    _setBlurAction();
    _checkState();
  };
  
  _init();

  return {
    setCollapsedListeners: setCollapsedListeners
  };
};