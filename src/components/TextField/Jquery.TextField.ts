// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

// @TODO - this could be done through nuget, but may not be needed since this should be temporary until we remove jquery completely
/// <reference path="../../jquery.d.ts"/>

namespace fabric {

  /**
   * Text Field Plugin
   *
   * Adds basic demonstration functionality to .ms-TextField components.
   *
   * @param  {jQuery Object}  One or more .ms-TextField components
   * @return {jQuery Object}  The same components (allows for chaining)
   */
  export class TextField {
    constructor(container) {
      let $textField = $(container);

      /** Does it have a placeholder? */
      if ($textField.hasClass("ms-TextField--placeholder")) {

        /** Hide the label on click. */
        $textField.on("click", function () {
          $textField.find(".ms-Label").hide();
        });

        /** Show the label again when leaving the field. */
        $textField.find(".ms-TextField-field").on("blur", function () {

          /** Only do this if no text was entered. */
          if ($textField.val().length === 0) {
            $(this).siblings(".ms-Label").show();
          }
        });
      }

      /** Underlined - adding/removing a focus class */
      if ($textField.hasClass("ms-TextField--underlined")) {

        /** Add is-active class - changes border color to theme primary */
        $textField.find(".ms-TextField-field").on("focus", function() {
          $(this).parent(".ms-TextField--underlined").addClass("is-active");
        });

        /** Remove is-active on blur of textfield */
        $textField.find(".ms-TextField-field").on("blur", function() {
          $(this).parent(".ms-TextField--underlined").removeClass("is-active");
        });
      }
    }
  }
}

(function ($) {
  $.fn.TextField = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {
      return new fabric.TextField(this);
    });
  };
})(jQuery);
