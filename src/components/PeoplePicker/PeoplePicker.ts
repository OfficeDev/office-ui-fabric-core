// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Overlay/Overlay.ts"/>

namespace fabric {
  /**
   * People Picker
   *
   * People picker control
   *
   */
  const PEOPLE_PICKER_CLASS = "ms-PanelHost";
  const CONTEXT_CLASS = ".ms-ContextualHost";
  const MODAL_POSITION = "bottom";
  
  export class PeoplePicker {
    
    private _container: Element;
    private _modalHostView: ContextualHost;
    private _modalHost: Element;
    
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of People Picker
     * @constructor
     */
    constructor(container: Element) {
      this._container = container;
      this._assignClicks();
      this._modalHost = this._container.querySelector(CONTEXT_CLASS);
    }
    
    private _createModalHost() {
      this._modalHostView = new fabric.ContextualHost(this._modalHost, MODAL_POSITION, this._container);
    }
    
    private _clickHandler() {
      this._createModalHost();
    }
    
    private _assignClicks() {
      this._container.addEventListener("click", this._clickHandler, true);
    }
  }
}
