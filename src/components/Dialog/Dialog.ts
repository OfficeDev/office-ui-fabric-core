// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed

namespace fabric {

  export class Dialog {

    public dialog: HTMLElement;

    constructor(dialog: HTMLElement) {
      this.dialog = dialog;
      this.dialog.addEventListener("click", this._closeDialog.bind(this), false);
    }

    private _closeDialog(event): void {
      // @TODO: We only want to close the dialog if we've
      //        clicked on a close/cancel button. Right now
      //        it closes if we click anywhere.
      this.dialog.classList.remove("is-open");
    }
  }
}
