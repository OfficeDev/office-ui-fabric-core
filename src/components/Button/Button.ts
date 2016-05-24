// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Button
 *
 * Mostly just a click handler
 *
 */
namespace fabric {
  "use strict";

  export class Button {

    private _container: Element;
    private _clickHandler: EventListener;

    constructor(container: Element, clickHandler?: EventListener) {
      this._container = container;

      if (clickHandler) {
        this._clickHandler = clickHandler;
        this._setClick();
      }
    }

    public disposeEvents() {
      this._container.removeEventListener("click", this._clickHandler, false);
    }

    private _setClick() {
      this._container.addEventListener("click", this._clickHandler, false);
    }
  }
}
