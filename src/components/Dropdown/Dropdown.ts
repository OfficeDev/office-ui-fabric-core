/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../Panel/Panel.ts"/>

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
let tomTest = true;

namespace fabric {

  class DropdownItems {
    public oldOption: HTMLOptionElement;
    public newItem: HTMLLIElement;
  }

  /**
   * Dropdown Plugin
   * 
   * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
   * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
   * 
   */
  export class Dropdown {

    private _container: HTMLElement;
    private _originalDropdown: HTMLSelectElement;
    private _newDropdownLabel: HTMLSpanElement;
    private _newDropdown: HTMLUListElement;
    private _dropdownItems: Array<DropdownItems>;
    private _ftl = new FabricTemplateLibrary();
    private _panelContainer: HTMLElement;
    private _panel: fabric.Panel;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Dropdown
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._newDropdownLabel = document.createElement("span");
      this._newDropdownLabel.classList.add("ms-Dropdown-title");

      this._newDropdown = document.createElement("ul");
      this._newDropdown.classList.add("ms-Dropdown-items");
      this._dropdownItems = [];

      this._originalDropdown = <HTMLSelectElement>container.querySelector(".ms-Dropdown-select");
      let _originalOptions = this._originalDropdown.querySelectorAll("option");

      // callbacks
      this._onCloseDropdown = this._onCloseDropdown.bind(this);
      this._onItemSelection = this._onItemSelection.bind(this);
      this._onOpenDropdown = this._onOpenDropdown.bind(this);

      // Create a new option as a list item, and add it to the replacement dropdown
      for (let i = 0; i < _originalOptions.length; ++i) {
        let option = <HTMLOptionElement>_originalOptions[i];
        if (option.selected) {
          this._newDropdownLabel.innerHTML = option.text;
        }

        let newItem = document.createElement("li");
        newItem.classList.add("ms-Dropdown-item");
        if (option.disabled) {
          newItem.classList.add("is-disabled");
        }
        newItem.innerHTML = option.text;
        newItem.addEventListener("click", this._onItemSelection);
        this._newDropdown.appendChild(newItem);

        this._dropdownItems.push( {
          oldOption: option,
          newItem: newItem
        });
      }

      // Add the new replacement dropdown
      container.appendChild(this._newDropdownLabel);
      container.appendChild(this._newDropdown); // temp disabled, to test in panel

      if (tomTest) {
        // @TODO - we are only going to use this on small breakpoints
        // this._panelContainer = this._ftl.Panel();
        this._panelContainer = document.createElement("div");
        this._panelContainer.classList.add("ms-Panel");
        this._panelContainer.classList.add("ms-Dropdown");
        this._panelContainer.classList.add("animate-in");

        this._panelContainer.appendChild(this._newDropdown);

        // Assign the script to the new panel, which creates a panel host and attaches it to the DOM
        this._panel = new fabric.Panel(this._panelContainer);
        // this._panel.dismiss();
      }

      /** Toggle open/closed state of the dropdown when clicking its title. */
      this._newDropdownLabel.addEventListener("click", this._onOpenDropdown );
    }

    private _onOpenDropdown(evt: any) {
      let isDisabled = this._container.classList.contains("is-disabled");
      let isOpen = this._container.classList.contains("is-open");
      if (!isDisabled && !isOpen) {
        /** Stop the click event from propagating, which would just close the dropdown immediately. */
        evt.stopPropagation();

        /** Go ahead and open that dropdown. */
        this._container.classList.add("is-open");

        /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
        document.addEventListener("click", this._onCloseDropdown);
      }
    }

    private _onCloseDropdown() {
      this._container.classList.remove("is-open");
      document.removeEventListener("click", this._onCloseDropdown);
    }

    private _onItemSelection(evt: any) {
      let item = <HTMLLIElement>evt.srcElement;
      let isDropdownDisabled = this._container.classList.contains("is-disabled");
      let isOptionDisabled = item.classList.contains("is-disabled");
      if (!isDropdownDisabled && !isOptionDisabled) {
          /** Deselect all items and select this one. */
          /** Update the original dropdown. */
          for (let i = 0; i < this._dropdownItems.length; ++i) {
            if (this._dropdownItems[i].newItem === item) {
              this._dropdownItems[i].newItem.classList.add("is-selected");
              this._dropdownItems[i].oldOption.selected = true;
            } else {
              this._dropdownItems[i].newItem.classList.remove("is-selected");
              this._dropdownItems[i].oldOption.selected = false;
            }
          }

          /** Update the replacement dropdown's title. */
          this._newDropdownLabel.innerHTML = item.textContent;

          /** Trigger any change event tied to the original dropdown. */
          let changeEvent = document.createEvent("HTMLEvents");
          changeEvent.initEvent("change", false, true);
          this._originalDropdown.dispatchEvent(changeEvent);
      }
    }
  }

}
