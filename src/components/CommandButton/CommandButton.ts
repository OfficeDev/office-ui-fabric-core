// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

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
  const CONTEXT_CLASS = ".ms-ModalHost";
  const CB_SPLIT_CLASS = ".ms-CommandButton-splitIcon";
  const CB_BUTTON_CLASS = ".ms-CommandButton-button";
  const MODAL_POSITION = "bottom";

  export class CommandButton {

    private _command;
    private _commandButton;
    private _splitButton;
    private _modalHost;
    private _modalHostView;
    private _container: HTMLElement;

    constructor(container: HTMLElement) {
      this._container = container;
      this._setDOMRefs();
      this._checkForMenu();
    }

    private _setDOMRefs() {
      this._command = this._container;
      this._commandButton = this._command.querySelector(CB_BUTTON_CLASS);
      this._splitButton = this._command.querySelector(CB_SPLIT_CLASS);
      this._modalHost = this._command.querySelector(CONTEXT_CLASS);
    }

    private _createModalHostView() {
      this._modalHostView = new fabric.ModalHost(this._modalHost, MODAL_POSITION, this._command);
    }

    private _setClick() {
      if (this._splitButton) {
        this._splitButton.addEventListener("click", this._createModalHostView.bind(this), false);
      } else {
        this._commandButton.addEventListener("click", this._createModalHostView.bind(this), false);
      }
    }

    private _checkForMenu() {
      if (this._modalHost) {
        this._setClick();
      }
    }
  }
}
