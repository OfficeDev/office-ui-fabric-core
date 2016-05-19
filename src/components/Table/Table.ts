// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * @namespace fabric
 */
namespace fabric {
  "use strict";

  export class Table {
    public container: HTMLElement;

    constructor(container: HTMLElement) {
      this.container = container;

      // Is the table selectable?
      if (this.container.className.indexOf("ms-Table--selectable") !== -1) {
        this._addListeners();
      }
    }

    /**
     * Add event listeners
     */
    private _addListeners(): void {
      this.container.addEventListener("click", this._toggleRowSelection.bind(this), false);
    }

    /**
     * Select or deselect a row
     */
    private _toggleRowSelection(event: MouseEvent): void {
      let selectedRow = (<HTMLElement>event.target).parentElement;
      let selectedStateClass = "is-selected";

      // Toggle the selected state class
      if (selectedRow.className === selectedStateClass) {
        selectedRow.className = "";
      } else {
        selectedRow.className = selectedStateClass;
      }

    }

  }
}
