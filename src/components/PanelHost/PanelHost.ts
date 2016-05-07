// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Overlay/Overlay.ts"/>

namespace fabric {
  /**
   * Panel Host
   *
   * A host for the panel control
   *
   */
  const PANEL_HOST_CLASS = "ms-PanelHost";
  const PANEL_HOST_INNER_CLASS = "ms-PanelHost-inner";
  const PANE_ANIMATEIN_HOST_CLASS = "ms-u-fadeIn100";
  const PANE_ANIMATEOUT_HOST_CLASS = "ms-u-fadeOut100";
  
  export class PanelHost {
    
    public panelHost: Element;
    private _innerPanel: Element;
    private _overlay: Overlay;
    private _direction: string;
    private _animateOverlay: boolean;
    private _layer: Node;
    private _callBack: Function;
    
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Panel
     * @constructor
     */
    constructor(layer: Node, callBack?: Function) {
      this._layer = layer;
      this._callBack = callBack;
      this._createElements();
      this._renderElements();
    }
    
    public dismiss() {
       document.removeChild(this.panelHost);
    }
    
    public update(layer: Node, callBack?: Function) {
      this.panelHost.replaceChild(layer, this._layer);
      
      if(callBack) {
        callBack();
      }
    }
    
    private _renderElements() {
      document.body.appendChild(this.panelHost);
      if (this._callBack) {
        this._callBack(this._layer);
      }
    }
    
    private _createElements() {
      this.panelHost = document.createElement("div");
      this.panelHost.classList.add(PANEL_HOST_CLASS)
      this.panelHost.appendChild(this._layer);
      this._overlay = new fabric.Overlay();
      
      // Append Elements
      this.panelHost.appendChild(this._overlay.overlayEl);
    }
  }
}
