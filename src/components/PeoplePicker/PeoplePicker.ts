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
  const CONTEXT_CLASS = ".ms-ContextualHost";
  const MODAL_POSITION = "bottom";

  export class PeoplePicker {

    private _container: Element;
    private _contextualHostView: ContextualHost;
    private _contextualHost: Element;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of People Picker
     * @constructor
     */
    constructor(container: Element) {
      this._container = container;
      this._assignClicks();
      this._contextualHost = this._container.querySelector(CONTEXT_CLASS);
    }

    private _createModalHost() {
      this._contextualHostView = new fabric.ContextualHost(
        <HTMLElement>this._contextualHost,
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
    }
  }
}
