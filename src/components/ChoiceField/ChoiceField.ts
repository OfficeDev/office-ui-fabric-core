// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {
  /**
   * To observe change of an attribute on a given target. 
   * Used to get value of attributes who do not have a change event. 
   */
  module AttributeObserver {
    let _mObserver: MutationObserver;
    export function observer(target: HTMLElement, attribute: string, callback: (value: any) => void) {
      _mObserver = new MutationObserver(function(mutations) {
        for (let i = 0, mutation; mutation = mutations[i]; i++) {
          if (mutation.attributeName === attribute) {
            callback (mutation.target.disabled);
          }
        };
      });
      return _mObserver.observe(target, {attributes: true});
    }
    export function stopObserver() {
      _mObserver.disconnect();
    }
  }

  /**
   * ChoiceField Plugin
   *
   * Adds basic demonstration functionality to .ms-ChoiceField components.
   *
   */
  export class ChoiceField {

    private _container: HTMLElement;
    private _choiceFieldInput: HTMLInputElement;
    private _choiceField: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of ChoiceField
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._choiceFieldInput = <HTMLInputElement>this._container.querySelector(".ms-ChoiceField-input");
      this._choiceField = <HTMLElement>this._container.querySelector(".ms-ChoiceField-field");
      this._initalSetup();
      this._addListeners();
      this._addObservers();
    }

    public removeListeners(): void {
      this._choiceFieldInput.removeEventListener("focus", this._ChoiceFieldFocusHandler.bind(this));
      this._choiceFieldInput.removeEventListener("blur", this._ChoiceFieldBlurHandler.bind(this));
      this._choiceFieldInput.removeEventListener("change", this._ChoiceFieldChangeHandler.bind(this));
    }

    public removeObservers(): void {
      AttributeObserver.stopObserver();
    }

    private _initalSetup(): void {
      if (this._choiceFieldInput.disabled) {
          this._choiceField.classList.add("is-disabled");
      }
      if (this._choiceFieldInput.checked) {
          this._choiceField.classList.add("is-checked");
      }
      if (this._choiceFieldInput.type === "checkbox") {
          this._choiceField.classList.add("ms-ChoiceField-type--checkbox");
      }
    }

    private _addListeners(): void {
      this._choiceFieldInput.addEventListener("focus", this._ChoiceFieldFocusHandler.bind(this), false);
      this._choiceFieldInput.addEventListener("blur", this._ChoiceFieldBlurHandler.bind(this), false);
      this._choiceFieldInput.addEventListener("change", this._ChoiceFieldChangeHandler.bind(this), false);
    }

    private _addObservers(): void {
      // Observe change of disabled on the input field.
      AttributeObserver.observer(this._choiceFieldInput, "disabled", (value: boolean) => {
        if (value) {
          this._choiceField.classList.add("is-disabled");
        } else {
          this._choiceField.classList.remove("is-disabled");
        }
      });
    }

    private _ChoiceFieldFocusHandler(): void {
      if (!this._choiceFieldInput.disabled) {
        this._choiceField.classList.add("in-focus");
      }
    }

    private _ChoiceFieldBlurHandler(): void {
      this._choiceField.classList.remove("in-focus");
    }

    private _ChoiceFieldChangeHandler(): void {
      if (this._choiceFieldInput.checked) {
        this._choiceField.classList.add("is-checked");
      } else {
        this._choiceField.classList.remove("is-checked");
      }
    }
  }
}
