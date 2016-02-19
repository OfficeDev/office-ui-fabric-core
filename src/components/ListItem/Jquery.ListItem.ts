// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

// @TODO - this could be done through nuget, but may not be needed since this should be temporary until we remove jquery completely
/// <reference path="../../jquery.d.ts"/>

namespace fabric {
  /**
   * List Item Plugin
   *
   * Adds basic demonstration functionality to .ms-ListItem components.
   *
   * @param  {jQuery Object}  One or more .ms-ListItem components
   * @return {jQuery Object}  The same components (allows for chaining)
   */
  export class ListItem {
    constructor(container) {
      /** Detect clicks on selectable list items. */
      $(container).on("click", ".js-toggleSelection", function() {
        $(this).parents(".ms-ListItem").toggleClass("is-selected");
      });
    }
  }
}

(function (fabric, $) {
  $.fn.ListItem = function () {

    /** Go through each panel we've been given. */
    return this.each(function () {
      return new fabric.ListItem(this);
    });
  };
})(fabric, jQuery);
