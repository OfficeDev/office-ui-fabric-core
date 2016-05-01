// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../SearchBox/SearchBox"/>
/// <reference path="../CommandButton/CommandButton"/>
/// <reference path="../ContextualHost/ContextualHost"/>

/**
 * CommandBar
 *
 * Commanding and navigational surface
 *
 */

namespace fabric {
  "use strict";

  interface WindowSize {
    x: number;
    y: number;
  }

  interface CommandBarElements {
    mainArea: Element;
    sideCommandArea?: Element;
    overflowCommand?: Element;
    contextMenu?: Element;
    searchBox?:  Element;
    searchBoxClose?: Element;
  }

  interface ItemCollection {
    item: Element;
    label: string;
    icon: string;
    isCollapsed: boolean;
    commandButtonRef: CommandButton;
  }

  const CONTEXTUAL_MENU = ".ms-ContextualMenu";
  const CONTEXTUAL_MENU_ITEM = ".ms-ContextualMenu-item";
  const CONTEXTUAL_MENU_LINK = ".ms-ContextualMenu-link";
  const CB_SEARCH_BOX = ".ms-SearchBox";
  const CB_MAIN_AREA = ".ms-CommandBar-mainArea";
  const CB_SIDE_COMMAND_AREA = ".ms-CommandBar-sideCommands";
  const CB_ITEM_OVERFLOW = ".ms-CommandBar-overflowButton";
  const CB_NO_LABEL_CLASS = "ms-CommandButton--noLabel";
  const SEARCH_BOX_CLOSE = ".ms-SearchBox-closeField";
  const COMMAND_BUTTON = ".ms-CommandButton";
  const COMMAND_BUTTON_LABEL = ".ms-CommandButton-label";
  const ICON = ".ms-Icon";
  const OVERFLOW_WIDTH = 41.5;

  export class CommandBar {

    private responsiveSizes: Object = {
      "sm-min": 320,
      "md-min": 480,
      "lg-min": 640,
      "xl-min": 1024,
      "xxl-min": 1366,
      "xxxl-min": 1920
    };

    private visibleCommands: Array<ItemCollection> = [];
    private commandWidths: Array<number> = [];
    private overflowCommands: Array<ItemCollection> = [];
    private itemCollection: Array<ItemCollection> = [];
    private _sideAreaCollection: Array<ItemCollection> = [];
    private contextualItemContainerRef: Node;
    private contextualItemLink: Node;
    private contextualItemIcon: Node;
    private breakpoint: string = "sm";
    private _elements: CommandBarElements;
    private activeCommand: Element;
    private searchBoxInstance: SearchBox;
    private _container: Element;
    private _commandButtonInstance: CommandButton;
    
    private _uiStateEvents: Array<Function> = [];

    constructor(container: Element) {

      this._container = container;
      this.responsiveSizes["sm-max"] = this.responsiveSizes["md-min"] - 1;
      this.responsiveSizes["md-max"] = this.responsiveSizes["lg-min"] - 1;
      this.responsiveSizes["lg-max"] = this.responsiveSizes["xl-min"] - 1;
      this.responsiveSizes["xl-max"] = this.responsiveSizes["xxl-min"] - 1;
      this.responsiveSizes["xxl-max"] = this.responsiveSizes["xxxl-min"] - 1;

      this._setElements();
      this._setBreakpoint();
      
      // If the overflow exists then run the overflow resizing
      if(this._elements.overflowCommand) {
        this._initOverflow();
      }
      this._setUIState();
    }
    
    private _runsSearchBox(reInit: boolean = true, state: string = "add") {
      this._changeSearchState("is-collapsed", state);
      if(reInit) {
        this.searchBoxInstance = this._createSearchInstance();
      }
    }
    
    private _runOverflow() {
      if(this._elements.overflowCommand) {
        this._saveCommandWidths();
        this._redrawMenu();
        this._updateCommands();
        this._drawCommands();
        this._checkOverflow();
      }
    }
    
    private _initOverflow() {
      this._createContextualRef();
      this._createItemCollection(this.itemCollection, CB_MAIN_AREA);
      this._createItemCollection(this._sideAreaCollection, CB_SIDE_COMMAND_AREA);
      this._saveCommandWidths();
      this._updateCommands();
      this._drawCommands();
      this._setWindowEvent();
      this._checkOverflow();
    }

    private _hasClass(element, cls): boolean {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    }

    private _getScreenSize(): WindowSize {
      // First we need to set what the screen is doing, check screen size
      let w = window;
      let wSize = {
        x: 0,
        y: 0
      };
      let d = document,
          e = d.documentElement,
          g = d.getElementsByTagName("body")[0];

      wSize.x = w.innerWidth || e.clientWidth || g.clientWidth;
      wSize.y = w.innerHeight || e.clientHeight || g.clientHeight;

      return wSize;
    }

    private _setBreakpoint(): void {
      let screenSize = this._getScreenSize().x;

      switch (true) {
        case (screenSize <= this.responsiveSizes["sm-max"]):
          this.breakpoint = "sm";
          break;
        case (screenSize >= this.responsiveSizes["md-min"] && screenSize <= this.responsiveSizes["md-max"]):
          this.breakpoint = "md";
          break;
        case (screenSize >= this.responsiveSizes["lg-min"] && screenSize <= this.responsiveSizes["lg-max"]):
          this.breakpoint = "lg";
          break;
        case (screenSize >= this.responsiveSizes["xl-min"] && screenSize <= this.responsiveSizes["xl-max"]):
          this.breakpoint = "xl";
          break;
        case (screenSize >= this.responsiveSizes["xxl-min"] && screenSize <= this.responsiveSizes["xxl-max"]):
          this.breakpoint = "xxl";
          break;
        case (screenSize >= this.responsiveSizes["xxxl-min"]):
          this.breakpoint = "xxxl";
          break;
      }
    }
      
    private _createSearchInstance(): any {
      if(this._elements.searchBox) {
        return new fabric.SearchBox(<HTMLElement>this._elements.searchBox);
      } else {
        return false;
      }
    }
    
    private _changeSearchState(state: string, action: string) {
      if(this._elements.searchBox) {
        switch (action) {
          case "remove":
            this._elements.searchBox.classList.remove(state);
            break;
          case "add":
            this._elements.searchBox.classList.add(state);
          default:
            break;
        } 
      }
    }
      
    private _setElements() {
      this._elements = {
        mainArea: this._container.querySelector(CB_MAIN_AREA)
      };
      
      if(this._container.querySelector(CB_SIDE_COMMAND_AREA)) {
        this._elements.sideCommandArea = this._container.querySelector(CB_SIDE_COMMAND_AREA);
      }
      
      if(this._container.querySelector(CB_ITEM_OVERFLOW)) {
        this._elements.overflowCommand = this._container.querySelector(CB_ITEM_OVERFLOW);
        this._elements.contextMenu = this._container.querySelector(CB_ITEM_OVERFLOW).querySelector(CONTEXTUAL_MENU);
      }
      
      if(this._container.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX)) {
         this._elements.searchBox = this._container.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX);
         this._elements.searchBoxClose = this._container.querySelector(SEARCH_BOX_CLOSE);
         this.searchBoxInstance = this._createSearchInstance();
      }
    }
    
    private _createItemCollection(iCollection: Array<ItemCollection>, areaClass: string) {
      let item,
          label,
          iconClasses,
          splitClasses,
          icon,
          items = this._container.querySelectorAll(areaClass + " " + COMMAND_BUTTON + ":not(" + CB_ITEM_OVERFLOW + ")");

      // Initiate the overflow command
      this._commandButtonInstance = new fabric.CommandButton(<HTMLElement>this._elements.overflowCommand);

      for (let i = 0; i < items.length; i++) {
        item = items[i];
        label = item.querySelector(COMMAND_BUTTON_LABEL).textContent;
        let icon = item.querySelector(ICON);
        
        if(icon) {
            iconClasses = icon.className;
            splitClasses = iconClasses.split(" ");
        }

        for (let o = 0; o < splitClasses.length; o++) {
          if (splitClasses[o].indexOf(ICON.replace(".", "") + "--") > -1) {
              icon =  splitClasses[o];
              break;
          }
        }

        iCollection.push({
          item: item,
          label: label,
          icon: icon,
          isCollapsed: (item.classList.contains(CB_NO_LABEL_CLASS)) ? true : false,
          commandButtonRef: new fabric.CommandButton(<HTMLElement>item)
        });
      }
      return;
    }

    private _createContextualRef() {
      this.contextualItemContainerRef = this._elements.contextMenu.querySelector(CONTEXTUAL_MENU_ITEM).cloneNode(true);
      this.contextualItemLink = this._elements.contextMenu.querySelector(CONTEXTUAL_MENU_LINK).cloneNode(false);
      this.contextualItemIcon = this._elements.contextMenu.querySelector(".ms-Icon").cloneNode(false);
      this._elements.contextMenu.innerHTML = "";
    }

    private _getElementWidth(element) {
      let width,
          styles;

      if (element.offsetParent === null) {
        element.setAttribute("style", "position: absolute; opacity: 0; display: block;");
      }

      width = element.getBoundingClientRect().width;
      styles = window.getComputedStyle(element);
      width += parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
      element.setAttribute("style", "");
      return width;
    }

    private _saveCommandWidths() {

      for (let i = 0; i < this.itemCollection.length; i++) {
        let item = this.itemCollection[i].item;
        let width = this._getElementWidth(item);
        this.commandWidths[i] = width;
      }
    }

    private _updateCommands() {
      let searchCommandWidth = 0;
      let mainCommandSurfaceAreaWidth = this._elements.mainArea.getBoundingClientRect().width;
      let totalAreaWidth = mainCommandSurfaceAreaWidth;

      if (this._elements.searchBox) {
        searchCommandWidth =  this._getElementWidth(this._elements.searchBox);
      }

      let totalCommandWidth = searchCommandWidth + OVERFLOW_WIDTH; // Start with searchbox width

      // Reset overflow and visible
      this.visibleCommands = [];
      this.overflowCommands = [];

      for (let i = 0; i < this.itemCollection.length; i++) {
        totalCommandWidth += this.commandWidths[i];

        if (totalCommandWidth < totalAreaWidth) {
          this.visibleCommands.push(this.itemCollection[i]);
        } else {
          this.overflowCommands.push(this.itemCollection[i]);
        }
      }
    }

    private _drawCommands() {
      // Remove existing commands
      this._elements.contextMenu.innerHTML = "";

      for (let i = 0; i < this.overflowCommands.length; i++) {

        this.overflowCommands[i].item.classList.add("is-hidden");
        // Add all items to contextual menu.
        let newCItem: HTMLElement = <HTMLElement>this.contextualItemContainerRef.cloneNode(false);
        let newClink: HTMLElement = <HTMLElement>this.contextualItemLink.cloneNode(false);
        let newIcon: HTMLElement = <HTMLElement>this.contextualItemIcon.cloneNode(false);
        let iconClass =  this.overflowCommands[i].icon;

        newClink.innerText = this.overflowCommands[i].label;
        newCItem.appendChild(newClink);
        newIcon.className = ICON.replace(".", "") + " " + iconClass;
        newCItem.appendChild(newIcon);
        this._elements.contextMenu.appendChild(newCItem);
      }

      // Show visible commands
      for (let x = 0; x < this.visibleCommands.length; x++) {
        this.visibleCommands[x].item.classList.remove("is-hidden");
      }
    }

    private _setWindowEvent() {
      window.addEventListener("resize", () => {
        this._doResize();
      }, false);
    }

    private _processColapsedClasses(type) {
      for (let i = 0; i < this.itemCollection.length; i++) {
        let thisItem = this.itemCollection[i];
        if (!thisItem.isCollapsed) {
          if (type === "add") {
            thisItem.item.classList.add(CB_NO_LABEL_CLASS);
          } else {
            thisItem.item.classList.remove(CB_NO_LABEL_CLASS);
          }
        }
      }      
      for (let i = 0; i < this._sideAreaCollection.length; i++) {
        let thisItem = this._sideAreaCollection[i];
        if (!thisItem.isCollapsed) {
          if (type === "add") {
            thisItem.item.classList.add(CB_NO_LABEL_CLASS);
          } else {
            thisItem.item.classList.remove(CB_NO_LABEL_CLASS);
          }
        }
      }
    }

    private _setUIState() {
      switch (this.breakpoint) {
        case "sm":
          this._runsSearchBox();
          this._processColapsedClasses("add");
          this._runOverflow();
          break;
        case "md":
          this._runsSearchBox();
          // Add collapsed classes to commands
          this._processColapsedClasses("add");
          this._runOverflow();
          break;
        case "lg":
          this._runsSearchBox();
          this._processColapsedClasses("remove");
          this._runOverflow();
          break;
        case "xl":
          this._runsSearchBox(false, "remove");
          this._processColapsedClasses("remove");
          this._runOverflow();
          break;
        default:
          this._runsSearchBox(false, "remove");
          this._processColapsedClasses("remove");
          this._runOverflow();
          break;
      }
    }

    private _checkOverflow() {
      if ( this.overflowCommands.length > 0) {
        this._elements.overflowCommand.classList.remove("is-hidden");
      } else {
        this._elements.overflowCommand.classList.add("is-hidden");
        if (this.activeCommand === this._elements.overflowCommand) {
          this._elements.contextMenu.classList.remove("is-open");
        }
      }
    }

    private _redrawMenu() {
      let left;

      if (this._hasClass(this._elements.contextMenu, "is-open")) {
        left = this.activeCommand.getBoundingClientRect().left;
        this._drawOverflowMenu(left);
      }
    }

    private _drawOverflowMenu(left) {
      this._elements.contextMenu.setAttribute("style", "left: " + left + "px; transform: translateX(-50%)");
    }

    private _doResize() {
      this._setBreakpoint();
      this._setUIState();
    }
  }
}
