// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {
  /**
   * List Item Plugin
   *
   * Adds basic demonstration functionality to .ms-ListItem components.
   *
   */
  export class ListItem {

    private _container: HTMLElement;
    private _toggleElement: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of ListItem
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._toggleElement = <HTMLElement>this._container.querySelector(".ms-ListItem-selectionTarget");
      this._addListeners();
    }

    public removeListeners(): void {
      this._toggleElement.removeEventListener("click", this._toggleHandler.bind(this));
    }

    private _addListeners(): void {
      this._toggleElement.addEventListener("click", this._toggleHandler.bind(this), false);
    }

    private _toggleHandler(): void {
      this._container.classList.toggle("is-selected");
    }
  }
}
