// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed

/// <reference path="../Overlay/Overlay.ts"/>

namespace fabric {

  export class Dialog {

    private _dialog: HTMLElement;
    private _overlay: Overlay;
    private _closeButtonElement: HTMLButtonElement;
    private _actionButtonElements: NodeListOf<Element>;

    constructor(dialog: HTMLElement) {
      this._dialog = dialog;
      this._closeButtonElement = <HTMLButtonElement>this._dialog.querySelector(".ms-Dialog-buttonClose");
      this._actionButtonElements = this._dialog.querySelectorAll(".ms-Dialog-action");
      if (this._closeButtonElement) {
        this._closeButtonElement.addEventListener("click", this.close.bind(this), false);
      }
      for (let i: number = 0; i < this._actionButtonElements.length; i++) {
        this._actionButtonElements[i].addEventListener("click", this.close.bind(this), false);
      }
    }

    public close(): void {
      this._overlay.remove();
      this._dialog.classList.remove("is-open");
      this._overlay.overlayElement.removeEventListener("click", this.close.bind(this));
    }

    public open(): void {
      this._dialog.classList.add("is-open");
      this._overlay = new fabric.Overlay();
      if (!this._dialog.classList.contains("ms-Dialog--blocking")) {
        this._overlay.overlayElement.addEventListener("click", this.close.bind(this), false);
        this._overlay.show();
      }
      this._dialog.parentElement.appendChild(this._overlay.overlayElement);
    }
  }
}
