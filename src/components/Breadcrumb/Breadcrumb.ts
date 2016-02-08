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

class Breadcrumb {
  public container: HTMLElement;

  //medium breakpoint
  private MEDIUM: number = 639;

  //cached DOM elements
  private _breadcrumb: HTMLElement;
  private _listItems: NodeListOf<HTMLElement>;
  private _contextMenu: HTMLElement;
  private _overflowButton: HTMLElement;
  private _overflowMenu: HTMLElement;
  private _breadcrumbList: HTMLElement;

  private _currentMaxItems: number = 0;
  private _itemCollection: Array<any> = [];

  /**
   * create internal model of list items from DOM
   */
  private _createItemCollection() {
    var length = this._listItems.length;
    var i = 0;
    var item;
    var text;
    var link; 
    var tabIndex;

    for(i; i < length; i++) {
      item = this._listItems[i].querySelector('.ms-Breadcrumb-itemLink');
      text = item.textContent;
      link = item.getAttribute('href');
      tabIndex = parseInt(item.getAttribute('tabindex'), 10);
      this._itemCollection.push({text: text, link: link, tabIndex: tabIndex});
    }
  }

  /**
   * Re-render lists on resize
   *
   */
  private _onResize() {
    this._closeOverflow(null);
    this._renderList();
  }

  /**
   * render breadcrumbs and overflow menus
   */
  private _renderList() {
    var maxItems = window.innerWidth > this.MEDIUM ? 4 : 2;

    if(maxItems !== this._currentMaxItems) {
      if(this._itemCollection.length > maxItems) {
        this._breadcrumb.className += ' is-overflow';
      } else {
        this._removeClass(this._breadcrumb, ' is-overflow');
      }
      this._addBreadcrumbItems(maxItems);
      this._addItemsToOverflow(maxItems);
    }

    this._currentMaxItems = maxItems;
  }

  /**
   * creates the overflow menu
   */
  private _addItemsToOverflow(maxItems) {
    this._resetList(this._contextMenu);
    var end = this._itemCollection.length - maxItems;
    var overflowItems = this._itemCollection.slice(0, end);

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
      this._contextMenu.appendChild(li);
    });
  }

  /**
   * creates the breadcrumbs
   */
  private _addBreadcrumbItems(maxItems) {
    this._resetList(this._breadcrumbList);
    var i = this._itemCollection.length - maxItems;

    if(i >= 0) {
      for(i; i < this._itemCollection.length; i++) {
        var listItem = document.createElement('li');
        var item = this._itemCollection[i];
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
        this._breadcrumbList.appendChild(listItem);
      }
    }
  }

  /**
   * resets a list by removing its children
   */
  private _resetList(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  /**
   * opens the overflow menu
   */
  private _openOverflow(event) {
    if(this._overflowMenu.className.indexOf(' is-open') === -1) {
      this._overflowMenu.className += ' is-open';
      this.removeOutlinesOnClick(event);
      // force focus rect onto overflow button
      this._overflowButton.focus();
    }
  }

  private _overflowKeyPress(event) {
    if(event.keyCode === 13) {
      this._openOverflow(event);
    }
  }

  /**
   * closes the overflow menu
   */
  private _closeOverflow(event) {
    if(!event || event.target !== this._overflowButton) {
      this._removeClass(this._overflowMenu, ' is-open');
    }
  }

  /**
   * utility that removes a class from an element
   */
  private _removeClass(element, value) {
    var index = element.className.indexOf(value);
    if(index > -1) {
      element.className = element.className.substring(0, index);
    }
  }

  /**
   * caches elements and values of the component
   */
  private _cacheDOM() {
    this._breadcrumb = this.container;
    this._breadcrumbList = <HTMLElement>this._breadcrumb.querySelector('.ms-Breadcrumb-list');
    this._listItems = <NodeListOf<HTMLElement>>this._breadcrumb.querySelectorAll('.ms-Breadcrumb-listItem');
    this._contextMenu = <HTMLElement>this._breadcrumb.querySelector('.ms-ContextualMenu');
    this._overflowButton = <HTMLElement>this._breadcrumb.querySelector('.ms-Breadcrumb-overflowButton');
    this._overflowMenu = <HTMLElement>this._breadcrumb.querySelector('.ms-Breadcrumb-overflowMenu');
  }

  /**
   * sets handlers for resize and button click events
   */
  private _setListeners() {
    window.addEventListener('resize', this._onResize.bind(this));
    this._overflowButton.addEventListener('click', this._openOverflow, false);
    this._overflowButton.addEventListener('keypress', this._overflowKeyPress, false);
    document.addEventListener('click', this._closeOverflow.bind(this), false);
    this._breadcrumbList.addEventListener('click', this.removeOutlinesOnClick, false);
  }

  /**
   * removes focus outlines so they don't linger after click
   */
  public removeOutlinesOnClick(event) {
    event.target.blur();
  }

  /**
   * initializes component
   */
  public init() {
    this._cacheDOM();
    this._setListeners();
    this._createItemCollection();
    this._onResize();
  }

  /**
   *
   * @param {HTMLElement} container - the target container for an instance of Breadcrumb
   * @constructor
   *
   * If dynamically populating a list run the constructor after the list has been populated
   * in the DOM.
   */
  constructor(container: any) {
    this.container = container;
    this.init();
  }
}

fabric.Breadcrumb = Breadcrumb;
