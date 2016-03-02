// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {


  /**
   * SearchBox Plugin
   *
   * Adds basic demonstration functionality to .ms-SearchBox components.
   *
   * @param  {jQuery Object}  One or more .ms-SearchBox components
   * @return {jQuery Object}  The same components (allows for chaining)
   */
  export class SearchBox {
    constructor(container) {

      let $searchBox = $(container);

      // Set cancel to false
      let cancel = false;
      let $searchField = $searchBox.find(".ms-SearchBox-field");

      /** SearchBox focus - hide label and show cancel button */
      $searchField.on("focus", function() {
        /** Hide the label on focus. */
        $(this).siblings(".ms-SearchBox-label").hide();
        // Show cancel button by adding is-active class
        $(this).parent(".ms-SearchBox").addClass("is-active");
      });

      /** "hovering" class allows for more fine grained control of hover state */
      $searchField.on("mouseover", function() {
        $searchField.addClass("hovering");
      });

      $searchField.on("mouseout", function() {
        $searchField.removeClass("hovering");
      });

      // If cancel button is selected, change cancel value to true
      $searchBox.find(".ms-SearchBox-closeButton").on("mousedown", function() {
        cancel = true;
      });

      /** Show the label again when leaving the field. */
      $searchBox.find(".ms-SearchBox-field").on("blur", function() {

        // If cancel button is selected remove the text and show the label
        if (cancel) {
          $(this).val("");
          $searchField.addClass("hovering");
        }

        // Prevents inputfield from gaining focus too soon
        setTimeout(function() {
          // Remove is-active class - hides cancel button
          $searchBox.removeClass("is-active");
        }, 10);

        /** Only do this if no text was entered. */
        if ($(this).val().length === 0 ) {
          $(this).siblings(".ms-SearchBox-label").show();
        }

        // Reset cancel to false
        cancel = false;
      });
    }
  }
}
