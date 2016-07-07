// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {
  /**
   * CheckBox Plugin
   *
   * Adds basic demonstration functionality to .ms-CheckBox components.
   *
   */
  export class CheckBox {

    protected _choiceField: HTMLElement;
    protected _choiceInput: HTMLInputElement;
    private _container: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of CheckBox
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._choiceField = <HTMLElement>this._container.querySelector(".ms-CheckBox-field");
      this._choiceInput = <HTMLInputElement>this._container.querySelector(".ms-CheckBox-input");
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
      this._choiceField.removeEventListener("click", this._ClickHandler.bind(this));
      this._choiceField.addEventListener("keydown", this._KeydownHandler.bind(this));
    }

    protected _addListeners(events?): void {
      let ignore: string[] = events && events.ignore;
      if (!ignore || !(ignore.indexOf("focus") > -1)) {
        this._choiceField.addEventListener("focus", this._FocusHandler.bind(this), false);
      }
      if (!ignore || !(ignore.indexOf("blur") > -1)) {
        this._choiceField.addEventListener("blur", this._BlurHandler.bind(this), false);
      }
      if (!ignore || !(ignore.indexOf("click") > -1)) {
        this._choiceField.addEventListener("click", this._ClickHandler.bind(this), false);
      }
      if (!ignore || !(ignore.indexOf("keydown") > -1)) {
        this._choiceField.addEventListener("keydown", this._KeydownHandler.bind(this), false);
      }
    }

    private _FocusHandler(): void {
      this._choiceField.classList.add("in-focus");
    }

    private _BlurHandler(): void {
      this._choiceField.classList.remove("in-focus");
    }

    private _ClickHandler(event: MouseEvent): void {
      event.stopPropagation();
      event.preventDefault();
      if (!this._choiceField.classList.contains("is-disabled")) {
          this.toggle();
      }
    }

    private _KeydownHandler(event: KeyboardEvent): void {
      if (event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._choiceField.classList.contains("is-disabled")) {
            this.toggle();
        }
      }
    }
  }
}
