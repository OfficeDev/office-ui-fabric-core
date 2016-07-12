// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {

  /**
   * Pivot Plugin
   *
   * Adds basic demonstration functionality to .ms-Pivot components.
   *
   */
  export class Pivot {

    private _container: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Pivot
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._addListeners();

      // Show the first pivot's content
      let firstContent = <HTMLElement>this._container.querySelector(".ms-Pivot-content");
      firstContent.style.display = "block";
    }

    public removeListeners(): void {
      this._container.removeEventListener("click", this._selectTab.bind(this));
    }

    private _addListeners(): void {
      this._container.addEventListener("click", this._selectTabMouse.bind(this), false);
      this._container.addEventListener("keyup", (event: KeyboardEvent) => {
        if (event.keyCode === 13) {
          this._selectTabKeyboard(event);
        }
      }, true);
    }

    private _selectTab(selectedTab: HTMLElement): void {
      // Only if its a pivot link and if it doesn't have ellipsis
      if (selectedTab.classList.contains("ms-Pivot-link") && !selectedTab.querySelector(".ms-Pivot-ellipsis")) {
        // Iterate over siblings and un-select them
        let sibling = selectedTab.parentElement.firstElementChild;
        while (sibling) {
          sibling.classList.remove("is-selected");
          sibling = sibling.nextElementSibling;
        }
        // Select the clicked tab
        selectedTab.classList.add("is-selected");

        // Hide all of the content
        let containers = this._container.querySelectorAll(".ms-Pivot-content");
        Array.prototype.forEach.call(containers, function(el, i){
          el.style.display = "none";
        });

        // Show the content that corresponds to the selected tab
        let selectedContentName = selectedTab.getAttribute("data-content");
        let selectedContent = <HTMLElement>this._container.querySelector(".ms-Pivot-content[data-content='" + selectedContentName + "']");
        selectedContent.style.display = "block";
      }
    }

    private _selectTabMouse(event: MouseEvent): void {
      event.preventDefault();
      let selectedTab = <HTMLElement>event.target;
      this._selectTab(selectedTab);
    }

    private _selectTabKeyboard(event: KeyboardEvent): void {
      event.preventDefault();
      let selectedTab = <HTMLElement>event.target;
      this._selectTab(selectedTab);
    }
  }
}
