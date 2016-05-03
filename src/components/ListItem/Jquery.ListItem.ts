// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {
  /**
   * List Item Plugin
   *
   * Adds basic demonstration functionality to .ms-ListItem components.
   *
   */
  export class ListItem {

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of ListItem
     * @constructor
     */
    constructor(container: HTMLElement) {
      /** Detect clicks on selectable list items. */
      $(container).on("click", ".js-toggleSelection", function() {
        $(this).parents(".ms-ListItem").toggleClass("is-selected");
      });
    }
  }
}
