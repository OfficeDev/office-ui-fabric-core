// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Breadcrumb component
 *
 * Shows the user's current location in a hierarchy and provides a means of navigating upward.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of Breadcrumb
 * @constructor
 *
 * If dynamically populating a list run the constructor after the list has been populated
 * in the DOM.
 */
fabric.Breadcrumb = function(container) {
  this.container = container;
  this.init();
};

fabric.Breadcrumb.prototype = (function() {

  //medium breakpoint
  var MEDIUM = 639;

  //cached DOM elements
  var _breadcrumb;
  var _listItems;
  var _contextMenu;
  var _overflowButton;
  var _overflowMenu;
  var _breadcrumbList;

  var _currentMaxItems = 0;
  var _itemCollection = [];

  /**
   * create internal model of list items from DOM
   */
  var _createItemCollection = function() {
    var length = _listItems.length;
    var i = 0;
    var item;
    var text;
    var link; 
    var tabIndex;

    for(i; i < length; i++) {
      item = _listItems[i].querySelector('.ms-Breadcrumb-itemLink');
      text = item.textContent;
      link = item.getAttribute('href');
      tabIndex = parseInt(item.getAttribute('tabindex'), 10);
      _itemCollection.push({text: text, link: link, tabIndex: tabIndex});
    }
  };

  /**
   * Re-render lists on resize
   *
   */
  var _onResize = function() {
    _closeOverflow(null);
    _renderList();
  }; 

  /**
   * render breadcrumbs and overflow menus
   */
  var _renderList = function() {
    var maxItems = window.innerWidth > MEDIUM ? 4 : 2;

    if(maxItems !== _currentMaxItems) {
      if(_itemCollection.length > maxItems) {
        _breadcrumb.className += ' is-overflow';
      } else {
        _removeClass(_breadcrumb, ' is-overflow');
      }
      _addBreadcrumbItems(maxItems);
      _addItemsToOverflow(maxItems);
    }

    _currentMaxItems = maxItems;
  };

  /**
   * creates the overflow menu
   */
  var _addItemsToOverflow = function(maxItems) {
    _resetList(_contextMenu);
    var end = _itemCollection.length - maxItems;
    var overflowItems = _itemCollection.slice(0, end);

    overflowItems.forEach(function(item) {
      var li = document.createElement('li');
      li.className = 'ms-ContextualMenu-item';
      if(!isNaN(item.tabIndex)) {
        li.setAttribute('tabindex', item.tabIndex);
      }
      var a = document.createElement('a');
      a.className = 'ms-ContextualMenu-link';
      a.setAttribute('href', item.link);
      a.textContent = item.text;
      li.appendChild(a);
      _contextMenu.appendChild(li);
    });
  };

  /**
   * creates the breadcrumbs
   */
  var _addBreadcrumbItems = function(maxItems) {
    _resetList(_breadcrumbList);
    var i = _itemCollection.length - maxItems;

    if(i >= 0) {
      for(i; i < _itemCollection.length; i++) {
        var listItem = document.createElement('li');
        var item = _itemCollection[i];
        var a = document.createElement('a');
        var chevron = document.createElement('i');
        listItem.className = 'ms-Breadcrumb-listItem';
        a.className = 'ms-Breadcrumb-itemLink';
        a.setAttribute('href', item.link);
        if(!isNaN(item.tabIndex)) {
          a.setAttribute('tabindex', item.tabIndex);
        }
        a.textContent = item.text;
        chevron.className = 'ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight';
        listItem.appendChild(a);
        listItem.appendChild(chevron);
        _breadcrumbList.appendChild(listItem);
      }
    }
  };

  /**
   * resets a list by removing its children
   */
  var _resetList = function(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  };

  /**
   * opens the overflow menu
   */
  var _openOverflow = function(event) {
    if(_overflowMenu.className.indexOf(' is-open') === -1) {
      _overflowMenu.className += ' is-open';
      removeOutlinesOnClick(event);
      // force focus rect onto overflow button
      _overflowButton.focus();
    }
  };

  var _overflowKeyPress = function(event) {
    if(event.keyCode === 13) {
      _openOverflow(event);
    }
  };

  /**
   * closes the overflow menu
   */
  var _closeOverflow = function(event) {
    if(!event || event.target !== _overflowButton) {
      _removeClass(_overflowMenu, ' is-open');
    }
  };

  /**
   * utility that removes a class from an element
   */
  var _removeClass = function (element, value) {
    var index = element.className.indexOf(value);
    if(index > -1) {
      element.className = element.className.substring(0, index);
    }
  };

  /**
   * caches elements and values of the component
   */
  var _cacheDOM = function(context) {
    _breadcrumb = context.container;
    _breadcrumbList = _breadcrumb.querySelector('.ms-Breadcrumb-list');
    _listItems = _breadcrumb.querySelectorAll('.ms-Breadcrumb-listItem');
    _contextMenu = _breadcrumb.querySelector('.ms-ContextualMenu');
    _overflowButton = _breadcrumb.querySelector('.ms-Breadcrumb-overflowButton');
    _overflowMenu = _breadcrumb.querySelector('.ms-Breadcrumb-overflowMenu');
  };

  /**
   * sets handlers for resize and button click events
   */
  var _setListeners = function() {
    window.addEventListener('resize', _onResize);
    _overflowButton.addEventListener('click', _openOverflow, false);
    _overflowButton.addEventListener('keypress', _overflowKeyPress, false);
    document.addEventListener('click', _closeOverflow, false);
    _breadcrumbList.addEventListener('click', removeOutlinesOnClick, false);
  };

  /**
   * removes focus outlines so they don't linger after click
   */
  var removeOutlinesOnClick = function(event) {
    event.target.blur();
  };

  /**
   * initializes component
   */
  var init = function() {
    _cacheDOM(this);
    _setListeners();
    _createItemCollection();
    _onResize(null);
  };

  return {
    init: init
  };

}());
