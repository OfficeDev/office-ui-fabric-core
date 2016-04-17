// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Text Field Plugin
 *
 * Adds basic demonstration functionality to .ms-TextField components.
 *
 * @param  {jQuery Object}  One or more .ms-TextField components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.TextField = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {

      /** Does it have a placeholder? */
      if ($(this).hasClass("ms-TextField--placeholder")) {

        /** Hide the label on click. */
        $(this).on('click', function () {
          $(this).find('.ms-Label').hide();
        });
        
        /** Hide the label on focus. */
        $(this).find('.ms-TextField-field').on('focus', function () {
          $(this).siblings('.ms-Label').hide();
        });

        /** Show the label again when leaving the field. */
        $(this).find('.ms-TextField-field').on('blur', function () {

          /** Only do this if no text was entered. */
          if ($(this).val().length === 0) {
            $(this).siblings('.ms-Label').show();
          }
        });
      }

      /** Underlined - adding/removing a focus class */
      if ($(this).hasClass('ms-TextField--underlined')) {

        /** Add is-active class - changes border color to theme primary */
        $(this).find('.ms-TextField-field').on('focus', function() {
          $(this).parent('.ms-TextField--underlined').addClass('is-active');
        });

        /** Remove is-active on blur of textfield */
        $(this).find('.ms-TextField-field').on('blur', function() {
          $(this).parent('.ms-TextField--underlined').removeClass('is-active');
        });
      }

    });
  };
})(jQuery);
