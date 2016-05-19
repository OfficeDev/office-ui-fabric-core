// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../ContextualMenu/ContextualMenu.ts"/>

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
  const CONTEXT_CLASS = ".ms-ContextualHost";
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
    private _contextualHost: Element;
    private _ftl = new FabricTemplateLibrary();
    private _dropdown: any;
    private _contextualMenu: Element;
    private _contextualMenuItem: Node;

    constructor(container: HTMLElement, dropdown?: any) {
      this._container = container;
      this._checkForMenu();
      this._command = this._container;
      this._commandButton = this._command.querySelector(CB_BUTTON_CLASS);
      this._splitButton = this._command.querySelector(CB_SPLIT_CLASS);
      this._modalHost = this._command.querySelector(CONTEXT_CLASS);
      this._dropdown = dropdown;

      if (dropdown) {
        this._createContextualMenu();
      }
    }

    private _createContextualMenu() {
      this._contextualMenu = this._ftl.ContextualHost();
      this._contextualMenuItem = this._contextualMenu.querySelector(".ms-ContextualMenu-item").cloneNode(true);

      // Clear contextual menu
      this._contextualMenu.innerHTML = "";

      // Construct the menu
      for (let i = 0; i < this._dropdown.items.length; i++) {
        // let item = this._dropdown.items[i];
        // let text = item.title;
        // let state = item.state;
        // let newItem = this._contextualMenuItem.cloneNode(true);
        // newItem.innerText = text;
        // newItem.style

        this._contextualHost.appendChild(this._contextualMenuItem);
      }
    }

    private _createModalHostView() {
      // Create Contextual menu
      this._modalHostView = new fabric.ContextualHost(this._modalHost, MODAL_POSITION, this._command);
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
