// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../CheckBox/CheckBox.ts"/>
"use strict";

namespace fabric {
  /**
   * RadioButton Plugin
   *
   * Adds basic demonstration functionality to .ms-RadioButton components.
   *
   */
  export class RadioButton extends CheckBox {

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of RadioButton
     * @constructor
     */
    constructor(container: HTMLElement) {
      super(container);
      if (this._choiceFieldLI.getAttribute("role") === "radio") {
          this._choiceFieldLI.classList.add("ms-Choice-type--radio");
      }
    }

    public removeListeners(): void {
      super.removeListeners();
      this._choiceFieldLI.removeEventListener("click", this._RadioClickHandler.bind(this));
      this._choiceFieldLI.addEventListener("keydown", this._RadioKeydownHandler.bind(this));
    }

    protected _addListeners(): void {
      super._addListeners({ignore: ["keydown", "click"]});
      this._choiceFieldLI.addEventListener("click", this._RadioClickHandler.bind(this), false);
      this._choiceFieldLI.addEventListener("keydown", this._RadioKeydownHandler.bind(this), false);
    }

    private _RadioClickHandler(event: MouseEvent): void {
      event.stopPropagation();
      event.preventDefault();
      this._dispatchSelectEvent();
    }

    private _dispatchSelectEvent(): void {
      let objDict = {
        bubbles : true,
        cancelable : true,
        detail : {
          name: this._choiceFieldLI.getAttribute("name"),
          item: this
        }
      };
      this._choiceFieldLI.dispatchEvent(new CustomEvent("msChoicefield", objDict));
    }

    private _RadioKeydownHandler(event: KeyboardEvent): void {
      if (event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._choiceFieldLI.classList.contains("is-disabled")) {
            this._dispatchSelectEvent();
        }
      }
    }
  }
}
