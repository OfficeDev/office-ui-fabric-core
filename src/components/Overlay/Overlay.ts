// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

namespace fabric {
  /**
   * Panel Host
   *
   * A host for Panel
   *
   */
  const OVERLAY_CLASS = "ms-Overlay";

  export class Overlay {
    public overlayEl: Element;
    private _modifier: string;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Panel
     * @constructor
     */
    constructor(modifier?: string) {
      this._createElements();
      this._modifier = modifier || "";
    }

    public remove() {
      this.overlayEl.parentElement.removeChild(this.overlayEl);
    }

    private _createElements() {
      this.overlayEl = document.createElement("div");
      this.overlayEl.classList.add(OVERLAY_CLASS);
      this.overlayEl.classList.add(this._modifier);
    }
  }
}
