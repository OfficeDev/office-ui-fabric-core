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
  this.breadcrumb = container;
  this.breadcrumbList = container.querySelector('.ms-Breadcrumb-list');
  this.listItems = container.querySelectorAll('.ms-Breadcrumb-listItem');
  this.contextMenu = container.querySelector('.ms-ContextualMenu');
  this.overflowButton = container.querySelector('.ms-Breadcrumb-overflowButton');
  this.overflowMenu = container.querySelector('.ms-Breadcrumb-overflowMenu');
  this.itemCollection = [];
  this.currentMaxItems = 0;
  this.init();

};

fabric.Breadcrumb.prototype = (function() {

  //medium breakpoint
  var MEDIUM = 639;

  /**
   * initializes component
   */
  var init = function() {
    _setListeners.call(this);
    _createItemCollection.call(this);
    _onResize.call(this, null);
  };

  /**
   * Adds a breadcrumb item to a breadcrumb
   * @param itemLabel {String} the item's text label
   * @param itemLink {String} the item's href link
   * @param tabIndex {number} the item's tabIndex
   */
  var addItem = function(itemLabel, itemLink, tabIndex) {
    this.itemCollection.push({text: itemLabel, link: itemLink, tabIndex: tabIndex});
    _updateBreadcrumbs.call(this);
  };

  /**
   * Removes a breadcrumb item by item label in the breadcrumbs list
   * @param itemLabel {String} the item's text label
   */
  var removeItemByLabel = function(itemLabel) {
    var i = this.itemCollection.length;
    while (i--) {
      if (this.itemCollection[i].text === itemLabel) {
        this.itemCollection.splice(i, 1);
      }
    }
    _updateBreadcrumbs.call(this);
  };

  /**
   * removes a breadcrumb item by position in the breadcrumbs list
   * index starts at 0
   * @param itemLabel {String} the item's text label
   * @param itemLink {String} the item's href link
   * @param tabIndex {number} the item's tabIndex
   */
  var removeItemByPosition = function(value) {
    this.itemCollection.splice(value, 1);
    _updateBreadcrumbs.call(this);
  };

  /**
   * create internal model of list items from DOM
   */
  var _createItemCollection = function() {
    var length = this.listItems.length;
    var i = 0;
    var item;
    var text;
    var link;
    var tabIndex;

    for (i; i < length; i++) {
      item = this.listItems[i].querySelector('.ms-Breadcrumb-itemLink');
      text = item.textContent;
      link = item.getAttribute('href');
      tabIndex = parseInt(item.getAttribute('tabindex'), 10);
      this.itemCollection.push({text: text, link: link, tabIndex: tabIndex});
    }
  };

  /**
   * Re-render lists on resize
   *
   */
  var _onResize = function() {
    _closeOverflow.call(this, null);
    _renderListOnResize.call(this);
  };

  /**
   * render breadcrumbs and overflow menus on resize
   */
  var _renderListOnResize = function() {
    var maxItems = window.innerWidth > MEDIUM ? 4 : 2;
    if (maxItems !== this.currentMaxItems) {
      _updateBreadcrumbs.call(this);
    }

    this.currentMaxItems = maxItems;
  };

  /**
   * creates the overflow menu
   */
  var _addItemsToOverflow = function(maxItems) {
    _resetList.call(this, this.contextMenu);
    var end = this.itemCollection.length - maxItems;
    var overflowItems = this.itemCollection.slice(0, end);
    var contextMenu = this.contextMenu;
    overflowItems.forEach(function(item) {
      var li = document.createElement('li');
      li.className = 'ms-ContextualMenu-item';
      if(!isNaN(item.tabIndex)) {
        li.setAttribute('tabindex', item.tabIndex);
      }
      var a = document.createElement('a');
      a.className = 'ms-ContextualMenu-link';
      if (item.link !== null) {
        a.setAttribute('href', item.link);
      }
      a.textContent = item.text;
      li.appendChild(a);
      contextMenu.appendChild(li);
    });
  };

  /**
   * creates the breadcrumbs
   */
  var _addBreadcrumbItems = function(maxItems) {
    _resetList.call(this, this.breadcrumbList);
    var i = this.itemCollection.length - maxItems;
    i = i < 0 ? 0 : i;
    if (i >= 0) {
      for (i; i < this.itemCollection.length; i++) {
        var listItem = document.createElement('li');
        var item = this.itemCollection[i];
        var a = document.createElement('a');
        var chevron = document.createElement('i');
        listItem.className = 'ms-Breadcrumb-listItem';
        a.className = 'ms-Breadcrumb-itemLink';
        if (item.link !== null) {
          a.setAttribute('href', item.link);
        }
        if (!isNaN(item.tabIndex)) {
          a.setAttribute('tabindex', item.tabIndex);
        }
        a.textContent = item.text;
        chevron.className = 'ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight';
        listItem.appendChild(a);
        listItem.appendChild(chevron);
        this.breadcrumbList.appendChild(listItem);
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
    if (this.overflowMenu.className.indexOf(' is-open') === -1) {
      this.overflowMenu.className += ' is-open';
      removeOutlinesOnClick.call(this, event);
      // force focus rect onto overflow button
      this.overflowButton.focus();
    }
  };

  var _overflowKeyPress = function(event) {
    if (event.keyCode === 13) {
      _openOverflow.call(this, event);
    }
  };

  /**
   * closes the overflow menu
   */
  var _closeOverflow = function(event) {
    if (!event || event.target !== this.overflowButton) {
      _removeClass.call(this, this.overflowMenu, ' is-open');
    }
  };

  /**
   * utility that removes a class from an element
   */
  var _removeClass = function (element, value) {
    var index = element.className.indexOf(value);
    if (index > -1) {
      element.className = element.className.substring(0, index);
    }
  };

  /**
   * sets handlers for resize and button click events
   */
  var _setListeners = function() {
    window.addEventListener('resize', _onResize.bind(this), false);
    document.addEventListener('click', _closeOverflow.bind(this), false);
    this.overflowButton.addEventListener('click', _openOverflow.bind(this), false);
    this.overflowButton.addEventListener('keypress', _overflowKeyPress.bind(this), false);
    this.breadcrumbList.addEventListener('click', removeOutlinesOnClick.bind(this), false);
  };

  /**
   * removes focus outlines so they don't linger after click
   */
  var removeOutlinesOnClick = function(event) {
    event.target.blur();
  };

  /**
   * updates the breadcrumbs and overflow menu
   */
  var _updateBreadcrumbs = function() {
    var maxItems = window.innerWidth > MEDIUM ? 4 : 2;
    if (this.itemCollection.length > maxItems) {
      this.breadcrumb.className += ' is-overflow';
    } else {
      _removeClass.call(this, this.breadcrumb, ' is-overflow');
    }

    _addBreadcrumbItems.call(this, maxItems);
    _addItemsToOverflow.call(this, maxItems);
  };

  return {
    init: init,
    addItem: addItem,
    removeItemByLabel: removeItemByLabel,
    removeItemByPosition: removeItemByPosition
  };

}());

