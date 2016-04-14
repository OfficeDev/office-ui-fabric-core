// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * @namespace fabric
 */
namespace fabric {
  "use strict";

  /**
   * Breadcrumb component
   *
   * Shows the user"s current location in a hierarchy and provides a means of navigating upward.
   *
   */
  export class Breadcrumb {
    // medium breakpoint
    private static MEDIUM: number = 639;

    public container: HTMLElement;

    // cached DOM elements
    private _breadcrumb: HTMLElement;
    private _listItems: NodeListOf<HTMLElement>;
    private _contextMenu: HTMLElement;
    private _overflowButton: HTMLElement;
    private _overflowMenu: HTMLElement;
    private _breadcrumbList: HTMLElement;

    private _currentMaxItems: number = 0;
    private _itemCollection: Array<any> = [];

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Breadcrumb
     * @constructor
     *
     * If dynamically populating a list run the constructor after the list has been populated
     * in the DOM.
     */
    constructor(container: HTMLElement) {
      this.container = container;
      this.init();
    }

    /**
     *  removes focus outlines so they don"t linger after click
     */
    public removeOutlinesOnClick(): void {
      this._breadcrumbList.blur();
    }

    /**
     * initializes component
     */
    public init(): void {
      this._cacheDOM();
      this._setListeners();
      this._createItemCollection();
      this._onResize();
    }

    /**
     * create internal model of list items from DOM
     */
    private _createItemCollection(): void {
      let length = this._listItems.length;
      let i = 0;
      let item;
      let text;
      let link;
      let tabIndex;

      for (i; i < length; i++) {
        item = this._listItems[i].querySelector(".ms-Breadcrumb-itemLink");
        text = item.textContent;
        link = item.getAttribute("href");
        tabIndex = parseInt(item.getAttribute("tabindex"), 10);
        this._itemCollection.push({link: link, tabIndex: tabIndex, text: text});
      }
    }

    /**
     * Re-render lists on resize
     *
     */
    private _onResize(): void {
      this._closeOverflow(null);
      this._renderList();
    }

    /**
     * render breadcrumbs and overflow menus
     */
    private _renderList(): void {
      let maxItems = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;

      if (maxItems !== this._currentMaxItems) {
        if (this._itemCollection.length > maxItems) {
          this._breadcrumb.className += " is-overflow";
        } else {
          this._removeClass(this._breadcrumb, " is-overflow");
        }
        this._addBreadcrumbItems(maxItems);
        this._addItemsToOverflow(maxItems);
      }

      this._currentMaxItems = maxItems;
    }

    /**
     * creates the overflow menu
     */
    private _addItemsToOverflow(maxItems: number): void {
      this._resetList(this._contextMenu);
      let end = this._itemCollection.length - maxItems;
      let overflowItems = this._itemCollection.slice(0, end);

      overflowItems.forEach( (item) => {
        let li = document.createElement("li");
        li.className = "ms-ContextualMenu-item";
        if (!isNaN(item.tabIndex)) {
          li.setAttribute("tabindex", item.tabIndex);
        }
        let a = document.createElement("a");
        a.className = "ms-ContextualMenu-link";
        if (item.link !== null) {
          a.setAttribute("href", item.link);
        }
        a.textContent = item.text;
        li.appendChild(a);
        this._contextMenu.appendChild(li);
      });
    }

    /**
     * creates the breadcrumbs
     */
    private _addBreadcrumbItems(maxItems: number): void {
      this._resetList(this._breadcrumbList);
      let i = this._itemCollection.length - maxItems;

      i = i < 0 ? 0 : i;
      if (i >= 0) {
        for (i; i < this._itemCollection.length; i++) {
          let listItem = document.createElement("li");
          let item = this._itemCollection[i];
          let a = document.createElement("a");
          let chevron = document.createElement("i");
          listItem.className = "ms-Breadcrumb-listItem";
          a.className = "ms-Breadcrumb-itemLink";
          if (item.link !== null) {
              a.setAttribute("href", item.link);
          }
          if (!isNaN(item.tabIndex)) {
            a.setAttribute("tabindex", item.tabIndex);
          }
          a.textContent = item.text;
          chevron.className = "ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight";
          listItem.appendChild(a);
          listItem.appendChild(chevron);
          this._breadcrumbList.appendChild(listItem);
        }
      }
    }

    /**
     * resets a list by removing its children
     */
    private _resetList(list: HTMLElement): void {
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
    }

    /**
     * opens the overflow menu
     */
    private _openOverflow(event: KeyboardEvent): void {
      if (this._overflowMenu.className.indexOf(" is-open") === -1) {
        this._overflowMenu.className += " is-open";
        this.removeOutlinesOnClick();
        // force focus rect onto overflow button
        this._overflowButton.focus();
      }
    }

    private _overflowKeyPress(event: KeyboardEvent): void {
      if (event.keyCode === 13) {
        this._openOverflow(event);
      }
    }

    /**
     * closes the overflow menu
     */
    private _closeOverflow(event: Event): void {
      if (!event || event.target !== this._overflowButton) {
        this._removeClass(this._overflowMenu, " is-open");
      }
    }

    /**
     * utility that removes a class from an element
     */
    private _removeClass(element: HTMLElement, value: string): void {
      let index = element.className.indexOf(value);
      if (index > -1) {
        element.className = element.className.substring(0, index);
      }
    }

    /**
     * caches elements and values of the component
     */
    private _cacheDOM(): void {
      this._breadcrumb = this.container;
      this._breadcrumbList = <HTMLElement>this._breadcrumb.querySelector(".ms-Breadcrumb-list");
      this._listItems = <NodeListOf<HTMLElement>>this._breadcrumb.querySelectorAll(".ms-Breadcrumb-listItem");
      this._contextMenu = <HTMLElement>this._breadcrumb.querySelector(".ms-ContextualMenu");
      this._overflowButton = <HTMLElement>this._breadcrumb.querySelector(".ms-Breadcrumb-overflowButton");
      this._overflowMenu = <HTMLElement>this._breadcrumb.querySelector(".ms-Breadcrumb-overflowMenu");
    }

    /**
     * sets handlers for resize and button click events
     */
    private _setListeners(): void {
      window.addEventListener("resize", this._onResize.bind(this));
      this._overflowButton.addEventListener("click", this._openOverflow.bind(this), false);
      this._overflowButton.addEventListener("keypress", this._overflowKeyPress.bind(this), false);
      document.addEventListener("click", this._closeOverflow.bind(this), false);
      this._breadcrumbList.addEventListener("click", this.removeOutlinesOnClick, false);
    }
  }
} // end fabric namespace
