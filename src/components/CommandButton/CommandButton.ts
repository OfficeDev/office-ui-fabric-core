// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>

/**
 * CommandButton
 *
 * Buttons used primarily in the command bar
 *
 */

/**
 * @namespace fabric
 */
namespace fabric {
  /**
   *
   * @constructor
   */
  const CONTEXT_CLASS = ".ms-ContextualMenu";
  const CB_SPLIT_CLASS = ".ms-CommandButton-splitIcon";
  const CB_BUTTON_CLASS = ".ms-CommandButton-button";
  const MODAL_POSITION = "bottom";

  export class CommandButton {

    private _command;
    private _commandButton;
    private _splitButton;
    private _modalHostView;
    private _container: HTMLElement;
    private _contextualMenu: HTMLElement;

    constructor(container: HTMLElement, contextMenu?: HTMLElement) {
      this._container = container;
      this._command = this._container;
      this._commandButton = this._command.querySelector(CB_BUTTON_CLASS);
      this._splitButton = this._command.querySelector(CB_SPLIT_CLASS);

      if (contextMenu) {
        this._contextualMenu = contextMenu;
      } else {
        this._contextualMenu = <HTMLElement>this._container.querySelector(CONTEXT_CLASS);
      }

      this._checkForMenu();
    }

    private _createModalHostView() {
      this._modalHostView = new fabric.ContextualHost(this._contextualMenu, MODAL_POSITION, this._command, false);
    }

    private _setClick() {
      if (this._splitButton) {
        this._splitButton.addEventListener("click", this._createModalHostView.bind(this), false);
      } else {
        this._commandButton.addEventListener("click", this._createModalHostView.bind(this), false);
      }
    }

    private _checkForMenu() {
      if (this._contextualMenu) {
        this._setClick();
      }
    }
  }
}
