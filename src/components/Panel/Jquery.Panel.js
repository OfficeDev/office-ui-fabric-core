/**
 * Panel Plugin
 *
 * Adds basic demonstration functionality to .ms-Panel components.
 *
 * @param  {jQuery Object}  One or more .ms-Panel components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Panel = function () {

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
