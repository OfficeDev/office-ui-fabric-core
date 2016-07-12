// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../../../dist/js/fabric.templates.ts"/>

namespace fabric {

  export class Overlay {
    public overlayElement: HTMLElement;
    private _ftl = new FabricTemplateLibrary();

    constructor(overlayElement?: HTMLElement) {
      if (overlayElement) {
        this.overlayElement = overlayElement;
      } else {
        this.overlayElement = this._ftl.Overlay();
      }
      this.overlayElement.addEventListener("click", this.hide.bind(this), false);
    }

    public remove() {
      this.overlayElement.parentElement.removeChild(this.overlayElement);
    }

    public show(): void {
      this.overlayElement.classList.add("is-visible");
    }

    public hide(): void {
      this.overlayElement.classList.remove("is-visible");
    }
  }
}
