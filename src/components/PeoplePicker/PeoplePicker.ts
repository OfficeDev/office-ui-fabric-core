// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Overlay/Overlay.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>

namespace fabric {
  /**
   * People Picker
   *
   * People picker control
   *
   */
  const MODAL_POSITION = "bottom";
  // const TOKEN_CLASS = "ms-Persona--token";

  export class PeoplePicker {

    private _container: Element;
    private _contextualHostView: ContextualHost;
    private _peoplePickerMenu: Element;
    private _peoplePickerResults: NodeListOf<Element>;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of People Picker
     * @constructor
     */
    constructor(container: Element) {
      this._container = container;
      this._assignClicks();
      this._peoplePickerMenu = this._container.querySelector(".ms-PeoplePicker-results");

      if (this._peoplePickerMenu) {
        this._peoplePickerMenu.setAttribute("style", "display: none;");
      }
    }

    private _createModalHost() {
      this._peoplePickerMenu.setAttribute("style", "display: block;");
      this._contextualHostView = new fabric.ContextualHost(
        <HTMLElement>this._peoplePickerMenu,
        MODAL_POSITION,
        this._container,
        true
      );
    }

    private _clickHandler(e) {
      this._createModalHost();

      this._peoplePickerResults = this._peoplePickerMenu.querySelectorAll(".ms-PeoplePicker-result");

      for (let i = 0; i < this._peoplePickerResults.length; i++) {
        this._peoplePickerResults[i].addEventListener("click", this._selectResult.bind(this), true);
      }
    }

    private _selectResult(e) {
      // let currentResult = this._findPersona(e.target);
      let tokenResult = this._findPersona(e.target);
      // let tokenResult: Element = <Element>currentResult.cloneNode(true);
      let searchBox = this._container.querySelector(".ms-PeoplePicker-searchBox");
      let textField = searchBox.querySelector(".ms-TextField");
      tokenResult.classList.add("ms-Persona--token", "ms-PeoplePicker-persona");
      if (tokenResult.classList.contains("ms-Persona--sm")) {
        tokenResult.classList.remove("ms-Persona--sm");
        tokenResult.classList.add("ms-Persona--xs");
      }
      searchBox.insertBefore(tokenResult, textField);
    }

    private _findPersona(childObj: Element) {
      let currentElement: Element = <Element>childObj.parentNode;

      while (!currentElement.classList.contains("ms-Persona")) {
          currentElement = <Element>currentElement.parentNode;
      }
      return currentElement;
    }

    private _assignClicks() {
      this._container.addEventListener("click", this._clickHandler.bind(this), true);
      this._container.addEventListener("focus", this._clickHandler.bind(this), true);
      this._container.addEventListener("keyup", this._clickHandler.bind(this), true);
    }
  }
}
