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

  export class PeoplePicker {

    private _container: Element;
    private _contextualHostView: ContextualHost;
    private _peoplePickerMenu: Element;

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
    }

    private _assignClicks() {
      this._container.addEventListener("click", this._clickHandler.bind(this), true);
      this._container.addEventListener("focus", this._clickHandler.bind(this), true);
      // if (!this._contextualHostView) {
      //   this._container.addEventListener("keyup", (e: KeyboardEvent) => (e.keyCode != 27) ? this._clickHandler(e) : null, true);
      // }
    }
  }
}
