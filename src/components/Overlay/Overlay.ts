// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

namespace fabric {

  export class Overlay {
    public overlayElement: HTMLElement;

    constructor(overlayElement: HTMLElement) {
      this.overlayElement = overlayElement;
      this.overlayElement.addEventListener("click", this.hide.bind(this), false);
    }

    public show(): void {
      this.overlayElement.classList.add("is-visible");
    }

    public hide(): void {
      this.overlayElement.classList.remove("is-visible");
    }

  }
}
