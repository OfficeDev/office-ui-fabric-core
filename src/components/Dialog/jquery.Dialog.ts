// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

// @TODO - this could be done through nuget, but may not be needed since this should be temporary until we remove jquery completely
/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {
  /**
   * Dialog Plugin
   *
   * Adds basic demonstration functionality to .ms-Dialog components.
   *
   * @param  {jQuery Object}  One or more .ms-Dialog components
   * @return {jQuery Object}  The same components (allows for chaining)
   */
  export class Dialog {
    constructor(container) {
      let dialog = container;

      /** Have the dialogs hidden for their initial state */
      $(dialog).hide();

      /** Have the close buttons close the Dialog. */
      $(dialog).find(".js-DialogAction--close").each(function() {
        $(this).on("click", function () {
          $(dialog).hide();
        });
      });

      /** Have the action buttons close the Dialog, though you would usually do some specific action per button. */
      $(dialog).find(".ms-Dialog-action").on("click", function () {
        $(dialog).hide();
      });
    }
  }
}

$(document).ready(function() {
    /** Iterate through the sample buttons, which can be used to open the Dialogs. */
    $(".js-DialogAction--open").each(function () {
        /** Open the associated dialog on click. */
        $(this).on("click", function () {
          let target = $(this).data("target");
          $(target).show();
        });
    });
});
