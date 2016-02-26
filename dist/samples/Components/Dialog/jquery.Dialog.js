// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Dialog Plugin
 *
 * Adds basic demonstration functionality to .ms-Dialog components.
 *
 * @param  {jQuery Object}  One or more .ms-Dialog components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Dialog = function () {

    /** Iterate through the sample buttons, which can be used to open the Dialogs. */
    $(".js-DialogAction--open").each(function () {
        /** Open the associated dialog on click. */
        $(this).on('click', function () {
          var target = $(this).data("target");
          $(target).show();
        });
    });


    return this.each(function () {
      var dialog = this;

      /** Have the dialogs hidden for their initial state */
      $(dialog).hide();

      /** Have the close buttons close the Dialog. */
      $(dialog).find(".js-DialogAction--close").each(function() {
        $(this).on('click', function () {
          $(dialog).hide();
        });
      });

      /** Have the action buttons close the Dialog, though you would usually do some specific action per button. */
      $(dialog).find(".ms-Dialog-action").on('click', function () {
        $(dialog).hide();
      });

    });
  };
})(jQuery);
