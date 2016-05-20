// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Button/Button.ts"/>
/// <reference path="../Button/IButton.ts"/>
/// <reference path="../../../dist/js/fabric.templates.ts"/>

/**
 * Callout
 *
 * Add callouts to things and stuff
 *
 */

/// <reference path="../ContextualHost/ContextualHost.ts"/>
const STATE_HIDDEN = "is-hidden";
const CLOSE_BUTTON_CLASS = ".ms-Callout-close";
const MODIFIER_OOBE_CLASS = "ms-Callout--OOBE";

namespace fabric {
  "use strict";

  export class Callout {

    private _container: Element;
    private _addTarget: Element;
    private _closeButton: Element;
    private _position: string;
    private _contextualHost: ContextualHost;

    constructor(container: Element, addTarget: Element, position: string) {
      this._container = container;
      this._addTarget = addTarget;
      this._position = position;
      this._closeButton = document.querySelector(CLOSE_BUTTON_CLASS);
      this._setOpener();
    }

    private _setOpener() {
      this._addTarget.addEventListener("click", this._clickHandler.bind(this), true);
    }

    private _openContextMenu() {

      let modifiers = [];
      if (this._hasModifier(MODIFIER_OOBE_CLASS)) {
        modifiers.push("primaryArrow");
      }

      this._container.classList.remove(STATE_HIDDEN);
      this._contextualHost = new fabric.ContextualHost(
        <HTMLElement>this._container,
        this._position,
        this._addTarget,
        true,
        modifiers
      );

      if (this._closeButton) {
        this._closeButton.addEventListener("click", this._closeHandler.bind(this), false);
      }
    }

    private _hasModifier(modifierClass) {
      return this._container.classList.contains(modifierClass);
    }

    private _closeHandler(e) {
      this._contextualHost.disposeModal();
    }

    private _clickHandler(e) {
      this._openContextMenu();
    }
  }
}
