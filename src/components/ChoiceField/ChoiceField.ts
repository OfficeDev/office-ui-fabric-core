// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {
  /**
   * ChoiceField Plugin
   *
   * Adds basic demonstration functionality to .ms-ChoiceField components.
   *
   */
  export class ChoiceField {

    private _container: HTMLElement;
    private _choiceFieldLI: HTMLLIElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of ChoiceField
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._choiceFieldLI = <HTMLLIElement>this._container.querySelector(".ms-ChoiceField-field");
      this._initalSetup();
      this._addListeners();
    }

    public choiceFieldToggle(): void {
        if (this._choiceFieldLI.getAttribute("aria-checked") === "true") {
          this.choiceFieldUnCheck();
        } else {
          this.choiceFieldCheck();
        }
    }

    public choiceFieldCheck(): void {
      this._choiceFieldLI.setAttribute("aria-checked", "true");
      this._choiceFieldLI.classList.add("is-checked");
    }

    public choiceFieldUnCheck(): void {
      this._choiceFieldLI.setAttribute("aria-checked", "false");
      this._choiceFieldLI.classList.remove("is-checked");
    }

    public removeListeners(): void {
      this._choiceFieldLI.removeEventListener("focus", this._ChoiceFieldFocusHandler.bind(this));
      this._choiceFieldLI.removeEventListener("blur", this._ChoiceFieldBlurHandler.bind(this));
      this._choiceFieldLI.removeEventListener("click", this._ChoiceFieldClickHandler.bind(this));
      this._choiceFieldLI.addEventListener("keydown", this._ChoiceFieldKeydownHandler.bind(this));
    }

    private _initalSetup(): void {
      if (this._choiceFieldLI.getAttribute("aria-checked") === "true") {
          this._choiceFieldLI.classList.add("is-checked");
      }
      if (this._choiceFieldLI.getAttribute("role") === "checkbox") {
          this._choiceFieldLI.classList.add("ms-ChoiceField-type--checkbox");
      }
    }

    private _addListeners(): void {
      this._choiceFieldLI.addEventListener("focus", this._ChoiceFieldFocusHandler.bind(this), false);
      this._choiceFieldLI.addEventListener("blur", this._ChoiceFieldBlurHandler.bind(this), false);
      this._choiceFieldLI.addEventListener("click", this._ChoiceFieldClickHandler.bind(this), false);
      this._choiceFieldLI.addEventListener("keydown", this._ChoiceFieldKeydownHandler.bind(this), false);
    }

    private _ChoiceFieldFocusHandler(): void {
      // if (!this._choiceFieldLI.disabled) {
      //    this._choiceFieldLI.classList.add("in-focus");
      // }
    }

    private _ChoiceFieldBlurHandler(): void {
      this._choiceFieldLI.classList.remove("in-focus");
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

    private _ChoiceFieldClickHandler(event: MouseEvent): void {
      event.stopPropagation();
      event.preventDefault();
      if (this._choiceFieldLI.getAttribute("role") === "checkbox") {
        this.choiceFieldToggle();
      } else {
        this._dispatchSelectEvent();
      }
    }

    private _ChoiceFieldKeydownHandler(event: KeyboardEvent): void {
      if (event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._choiceFieldLI.classList.contains("is-disabled")) {
          if (this._choiceFieldLI.getAttribute("role") === "checkbox") {
            this.choiceFieldToggle();
          } else {
            this._dispatchSelectEvent();
          }
        }
      }
    }
  }
}
