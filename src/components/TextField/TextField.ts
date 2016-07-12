// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

"use strict";

namespace fabric {

  module TextFieldConsts {
    export enum Type {
        Placeholder,
        Underlined
    }
  }

  /**
   * Text Field Plugin
   *
   * Adds basic demonstration functionality to .ms-TextField components.
   */
  export class TextField {

    private _container: HTMLElement;
    private _textField: HTMLInputElement;
    private _textFieldLabel: HTMLElement;
    private _type: TextFieldConsts.Type[];

    /**
     *
     * @param {HTMLDivElement} container - the target container for an instance of TextField
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._type = [];
      this._textField = <HTMLInputElement>this._container.querySelector(".ms-TextField-field");
      this._textFieldLabel = <HTMLElement>this._container.querySelector(".ms-Label");
      this._setTextFieldType();
      this._addListeners();
    }

    /** Populate _type with various kinds of text fields */
    private _setTextFieldType(): void {
      if (this._container.classList.contains("ms-TextField--placeholder")) {
        this._type.push(TextFieldConsts.Type.Placeholder);
      }
      if (this._container.classList.contains("ms-TextField--underlined")) {
        this._type.push(TextFieldConsts.Type.Underlined);
      }
    }

    /** Add event listeners according to the type(s) of text field */
    private _addListeners(): void {
      /** Placeholder - hide/unhide the placeholder  */
      if (this._type.indexOf(TextFieldConsts.Type.Placeholder) >= 0) {
        this._textField.addEventListener("click", (event: MouseEvent) => {
          this._textFieldLabel.style.display = "none";
        });
        this._textField.addEventListener("blur", (event: MouseEvent) => {
          // Show only if no value in the text field
          if (this._textField.value.length === 0) {
            this._textFieldLabel.style.display = "block";
          }
        });
      }
      /** Underlined - adding/removing a focus class  */
      if (this._type.indexOf(TextFieldConsts.Type.Underlined) >= 0) {
        this._textField.addEventListener("focus", (event: MouseEvent) => {
          this._container.classList.add("is-active");
        });
        this._textField.addEventListener("blur", (event: MouseEvent) => {
          this._container.classList.remove("is-active");
        });
      }
    }
  }
}
