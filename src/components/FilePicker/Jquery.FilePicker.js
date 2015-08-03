/**
 * File Picker Plugin
 *
 * Adds basic demonstration functionality to .ms-FilePicker components.
 * 
 * @param  {jQuery Object}  One or more .ms-FilePicker components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.FilePicker = function () {

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $panel = $(this);

      /** Hook to open the panel. */
      $('.js-togglePanel').on('click', function() {
        $panel.toggleClass('is-open');
      });

    });


  };
})(jQuery);