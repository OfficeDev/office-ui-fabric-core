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

    protected _choiceFieldLI: HTMLLIElement;
    private _container: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of CheckBox
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._choiceFieldLI = <HTMLLIElement>this._container.querySelector(".ms-CheckBox-field");
      if (this._choiceFieldLI.getAttribute("aria-checked") === "true") {
          this._choiceFieldLI.classList.add("is-checked");
      }
      this._addListeners();
    }

    public getValue(): boolean {
      return this._choiceFieldLI.getAttribute("aria-checked") === "true" ? true : false;
    }

    public toggle(): void {
        if (this.getValue()) {
          this.unCheck();
        } else {
          this.check();
        }
    }

    public check(): void {
      this._choiceFieldLI.setAttribute("aria-checked", "true");
      this._choiceFieldLI.classList.add("is-checked");
    }

    public unCheck(): void {
      this._choiceFieldLI.setAttribute("aria-checked", "false");
      this._choiceFieldLI.classList.remove("is-checked");
    }

    public removeListeners(): void {
      this._choiceFieldLI.removeEventListener("focus", this._FocusHandler.bind(this));
      this._choiceFieldLI.removeEventListener("blur", this._BlurHandler.bind(this));
      this._choiceFieldLI.removeEventListener("click", this._ClickHandler.bind(this));
      this._choiceFieldLI.addEventListener("keydown", this._KeydownHandler.bind(this));
    }

    protected _addListeners(events?): void {
      let ignore: string[] = events && events.ignore;
      if (!ignore || !(ignore.indexOf("focus") > -1)) {
        this._choiceFieldLI.addEventListener("focus", this._FocusHandler.bind(this), false);
      }
      if (!ignore || !(ignore.indexOf("blur") > -1)) {
        this._choiceFieldLI.addEventListener("blur", this._BlurHandler.bind(this), false);
      }
      if (!ignore || !(ignore.indexOf("click") > -1)) {
        this._choiceFieldLI.addEventListener("click", this._ClickHandler.bind(this), false);
      }
      if (!ignore || !(ignore.indexOf("keydown") > -1)) {
        this._choiceFieldLI.addEventListener("keydown", this._KeydownHandler.bind(this), false);
      }
    }

    private _FocusHandler(): void {
      this._choiceFieldLI.classList.add("in-focus");
    }

    private _BlurHandler(): void {
      this._choiceFieldLI.classList.remove("in-focus");
    }

    private _ClickHandler(event: MouseEvent): void {
      event.stopPropagation();
      event.preventDefault();
      this.toggle();
    }

    private _KeydownHandler(event: KeyboardEvent): void {
      if (event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._choiceFieldLI.classList.contains("is-disabled")) {
            this.toggle();
        }
      }
    }
  }
}
