// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {
  /**
   * Dialog Plugin
   *
   * Adds basic demonstration functionality to .ms-Dialog components.
   */
  export class Dialog {

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Dialog
     * @constructor
     */
    constructor(container: HTMLElement) {
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
  } // end Dialog
} // end Fabric namespace


/* presentation code for the samples - 
   configure any sample buttons so that they open the associated Dialog */
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
