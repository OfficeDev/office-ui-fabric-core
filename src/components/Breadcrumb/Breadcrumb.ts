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
     * Adds a breadcrumb item to a breadcrumb
     * @param itemLabel {String} the item's text label
     * @param itemLink {String} the item's href link
     * @param tabIndex {number} the item's tabIndex
    */
    public addItem(itemLabel: string, itemLink: string, tabIndex: number): void {
      this._itemCollection.push({text: itemLabel, link: itemLink, tabIndex: tabIndex});
      this._updateBreadcrumbs();
    }

    /**
     * Removes a breadcrumb item by item label in the breadcrumbs list
     * @param itemLabel {String} the item's text label
    */
    public removeItemByLabel(itemLabel: string ): void {
      let i: number = this._itemCollection.length;
      while (i--) {
        if (this._itemCollection[i].text === itemLabel) {
          this._itemCollection.splice(i, 1);
        }
      }
      this._updateBreadcrumbs();
    };

    /**
     * removes a breadcrumb item by position in the breadcrumbs list
     * index starts at 0
     * @param value {String} the item's index
    */
    public removeItemByPosition(value: number): void {
      this._itemCollection.splice(value, 1);
      this._updateBreadcrumbs();
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
      const length: number = this._listItems.length;
      let i: number = 0;
      let item: any;
      let text: string;
      let link: string;
      let tabIndex: number;

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
      const maxItems: number = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;

      if (maxItems !== this._currentMaxItems) {
        this._updateBreadcrumbs();
      }

      this._currentMaxItems = maxItems;
    }

    /**
     * updates the breadcrumbs and overflow menu
    */
    private _updateBreadcrumbs() {
      const maxItems: number = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;
      if (this._itemCollection.length > maxItems) {
        this._breadcrumb.classList.add("is-overflow");
      } else {
        this._breadcrumb.classList.remove("is-overflow");
      }

      this._addBreadcrumbItems(maxItems);
      this._addItemsToOverflow(maxItems);
    };

    /**
     * creates the overflow menu
    */
    private _addItemsToOverflow(maxItems: number): void {
      this._resetList(this._contextMenu);
      const end: number = this._itemCollection.length - maxItems;
      const overflowItems: Array<any> = this._itemCollection.slice(0, end);

      overflowItems.forEach( (item) => {
        const li: HTMLLIElement = document.createElement("li");
        li.className = "ms-ContextualMenu-item";
        if (!isNaN(item.tabIndex)) {
          li.setAttribute("tabindex", item.tabIndex);
        }
        const a: HTMLAnchorElement = document.createElement("a");
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
      let i: number  = this._itemCollection.length - maxItems;

      i = i < 0 ? 0 : i;
      if (i >= 0) {
        for (i; i < this._itemCollection.length; i++) {
          const listItem: HTMLLIElement = document.createElement("li");
          const item: any = this._itemCollection[i];
          const a: HTMLAnchorElement = document.createElement("a");
          const chevron: HTMLPhraseElement = document.createElement("i");
          listItem.className = "ms-Breadcrumb-listItem";
          a.className = "ms-Breadcrumb-itemLink";
          if (item.link !== null) {
              a.setAttribute("href", item.link);
          }
          if (!isNaN(item.tabIndex)) {
            a.setAttribute("tabindex", item.tabIndex);
          }
          a.textContent = item.text;
          chevron.className = "ms-Breadcrumb-chevron ms-Icon ms-Icon--ChevronRight";
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
        this._overflowMenu.classList.add("is-open");
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
        this._overflowMenu.classList.remove("is-open");
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
