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
    }

    public removeListeners(): void {
      this._container.removeEventListener("click", this._selectTab.bind(this));
    }

    private _addListeners(): void {
      this._container.addEventListener("click", this._selectTab.bind(this), false);
    }

    private _selectTab(event: MouseEvent): void {
      event.preventDefault();
      let selectedTab = <HTMLElement>event.target;
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
      }
    }
  }
}
