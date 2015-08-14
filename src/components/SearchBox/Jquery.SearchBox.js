/**
 * SearchBox Plugin
 *
 * Adds basic demonstration functionality to .ms-SearchBox components.
 *
 * @param  {jQuery Object}  One or more .ms-SearchBox components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.SearchBox = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {
      // Set cancel to false
      var cancel = false;

      /** SearchBox focus - hide label and show cancel button */
      $(this).find('.ms-SearchBox-field').on('focus', function() {
        /** Hide the label on focus. */
        $(this).siblings('.ms-SearchBox-label').hide();
        // Show cancel button by adding is-active class
        $(this).parent('.ms-SearchBox').addClass('is-active');
      });


      // If cancel button is selected, change cancel value to true
      $(this).find('.ms-SearchBox-closeButton').on('mousedown', function() {
        cancel = true;
      });

      /** Show the label again when leaving the field. */
      $(this).find('.ms-SearchBox-field').on('blur', function() {

        // If cancel button is selected remove the text and show the label
        if ( cancel == true ) {
          $(this).val('');
          $(this).siblings('.ms-SearchBox-label').show();
        }

        // Remove is-active class - hides cancel button
        $(this).parent('.ms-SearchBox').removeClass('is-active');

        /** Only do this if no text was entered. */
        if ($(this).val().length === 0 ) {
          $(this).siblings('.ms-SearchBox-label').show();
        }

        // Reset cancel to false
        cancel = false;
      });


    });

  };
})(jQuery);
