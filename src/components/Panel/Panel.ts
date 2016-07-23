// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../PanelHost/PanelHost.ts"/>

namespace fabric {
  /**
   * Panel Host
   *
   * A host for the panel control
   *
   */
  const ANIMATE_IN_STATE = "animate-in";
  const ANIMATE_OUT_STATE = "animate-out";
  const ANIMATION_END = 400;

  export class Panel {

    private _panel: Element;
    private _panelHost: PanelHost;
    private _direction: string;
    private _animateOverlay: boolean;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Panel
     * @constructor
     */
    constructor(panel: Element,  direction?: string, animateOverlay?: boolean) {
      this._panel = panel;
      this._direction = direction || "right";
      this._animateOverlay = animateOverlay || true;
      this._panelHost = new fabric.PanelHost(this._panel, this._animateInPanel);
      this._setEvents();

      // Set body height to 100% and overflow hidden while panel is open
      document.body.setAttribute("style", "height: 100%; overflow: hidden;");
    }

    public dismiss(callBack?: Function) {
      this._panel.classList.add(ANIMATE_OUT_STATE);
      setTimeout(() => {
        this._panel.classList.remove(ANIMATE_OUT_STATE);
        this._panel.classList.remove("is-open");
        this._panelHost.dismiss();
        if (callBack) {
          callBack();
        }

        // Remove temporary body styles
        document.body.setAttribute("style", "");
      }, ANIMATION_END);
    }

    private _setEvents() {
      this._panelHost._overlay.overlayElement.addEventListener("click", () => {
        this.dismiss();
      });

      let closeButton = this._panel.querySelector(".ms-PanelAction-close");
      if (closeButton !== null) {
        closeButton.addEventListener("click", () => {
          this.dismiss();
        });
      }
    }

    private _animateInPanel(layer: Element) {
      layer.classList.add(ANIMATE_IN_STATE);
      layer.classList.add("is-open");
      setTimeout(() => {
        layer.classList.remove(ANIMATE_IN_STATE);
      }, ANIMATION_END);
    }
  }
}
