// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

// @TODO - this could be done through nuget, but may not be needed since this should be temporary until we remove jquery completely
/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {

  /**
   * Pivot Plugin
   *
   * Adds basic demonstration functionality to .ms-Pivot components.
   *
   * @param  {jQuery Object}  One or more .ms-Pivot components
   * @return {jQuery Object}  The same components (allows for chaining)
   */
  export class Pivot {
    constructor(container) {
      let $pivotContainer = $(container);

      /** When clicking/tapping a link, select it. */
      $pivotContainer.on("click", ".ms-Pivot-link", function(event) {
        event.preventDefault();
        /** Check if current selection has elipses child element **/
        let $elipsisCheck = $(this).find(".ms-Pivot-ellipsis");

        /** Only execute when no elipses element can be found **/
        if ($elipsisCheck.length === 0) {

          $(this).siblings(".ms-Pivot-link").removeClass("is-selected");
          $(this).addClass("is-selected");
        }
      });
    }
  }
}
