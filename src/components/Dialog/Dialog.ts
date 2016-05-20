// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed

namespace fabric {

  export class Dialog {

    public dialog: HTMLElement;
    private _closeButtonElement: HTMLButtonElement;
    private _actionButtonElements: NodeListOf<Element>;

    constructor(dialog: HTMLElement) {
      this.dialog = dialog;
      this._closeButtonElement = <HTMLButtonElement>this.dialog.querySelector(".ms-Dialog-buttonClose");
      this._actionButtonElements = this.dialog.querySelectorAll(".ms-Dialog-action");
      if (this._closeButtonElement) {
        this._closeButtonElement.addEventListener("click", this._closeDialog.bind(this), false);
      }
      for (let i: number = 0; i < this._actionButtonElements.length; i++) {
        this._actionButtonElements[i].addEventListener("click", this._closeDialog.bind(this), false);
      }
    }

    private _closeDialog(event): void {
      // @TODO: We only want to close the dialog if we've
      //        clicked on a close/cancel button. Right now
      //        it closes if we click anywhere.
      this.dialog.classList.remove("is-open");
    }
  }
}
