// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {
  /**
   * Toggle Plugin
   *
   * Adds basic demonstration functionality to .ms-Toggle components.
   *
   */
  export class Toggle {

    private _container: HTMLElement;
    private _toggleField: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Toggle
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._toggleField = <HTMLElement>this._container.querySelector(".ms-Toggle-field");
      this._addListeners();
    }

    public removeListeners(): void {
      this._toggleField.removeEventListener("click", this._toggleHandler.bind(this));
    }

    private _addListeners(): void {
      this._toggleField.addEventListener("click", this._toggleHandler.bind(this), false);
      this._toggleField.addEventListener("keyup", (e: KeyboardEvent) => (e.keyCode === 32) ? this._toggleHandler() : null, false);
    }

    private _toggleHandler(): void {
      this._toggleField.classList.toggle("is-selected");
    }
  }
}
