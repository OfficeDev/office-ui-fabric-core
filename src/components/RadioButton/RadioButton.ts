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
  export class RadioButton {

    protected _choiceField: HTMLElement;
    protected _choiceInput: HTMLInputElement;
    private _container: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of RadioButton
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._choiceField = <HTMLElement>this._container.querySelector(".ms-RadioButton-field");
      this._choiceInput = <HTMLInputElement>this._container.querySelector(".ms-RadioButton-input");
      if (this._choiceField.getAttribute("aria-checked") === "true") {
        this._choiceField.classList.add("is-checked");
      }
      this._addListeners();
    }

    public getValue(): boolean {
      return this._choiceField.getAttribute("aria-checked") === "true" ? true : false;
    }

    public toggle(): void {
      if (this.getValue()) {
        this.unCheck();
      } else {
        this.check();
      }
    }

    public check(): void {
      this._choiceField.setAttribute("aria-checked", "true");
      this._choiceField.classList.add("is-checked");
      this._choiceInput.checked = true;
    }

    public unCheck(): void {
      this._choiceField.setAttribute("aria-checked", "false");
      this._choiceField.classList.remove("is-checked");
      this._choiceInput.checked = false;
    }

    public removeListeners(): void {
      this._choiceField.removeEventListener("focus", this._FocusHandler.bind(this));
      this._choiceField.removeEventListener("blur", this._BlurHandler.bind(this));
      this._choiceField.removeEventListener("click", this._RadioClickHandler.bind(this));
      this._choiceField.addEventListener("keydown", this._RadioKeydownHandler.bind(this));
    }

    protected _addListeners(): void {
      this._choiceField.addEventListener("focus", this._FocusHandler.bind(this), false);
      this._choiceField.addEventListener("blur", this._BlurHandler.bind(this), false);
      this._choiceField.addEventListener("click", this._RadioClickHandler.bind(this), false);
      this._choiceField.addEventListener("keydown", this._RadioKeydownHandler.bind(this), false);
    }

    private _RadioClickHandler(event: MouseEvent): void {
      event.stopPropagation();
      event.preventDefault();
      if (!this._choiceField.classList.contains("is-disabled")) {
        this._dispatchSelectEvent();
      }
    }

    private _dispatchSelectEvent(): void {
      let objDict = {
        bubbles : true,
        cancelable : true,
        detail : {
          name: this._choiceField.getAttribute("name"),
          item: this
        }
      };
      this._choiceField.dispatchEvent(new CustomEvent("msChoicefield", objDict));
    }

    private _RadioKeydownHandler(event: KeyboardEvent): void {
      if (event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._choiceField.classList.contains("is-disabled")) {
          this._dispatchSelectEvent();
        }
      }
    }

    private _FocusHandler(): void {
      this._choiceField.classList.add("in-focus");
    }

    private _BlurHandler(): void {
      this._choiceField.classList.remove("in-focus");
    }
  }
}
