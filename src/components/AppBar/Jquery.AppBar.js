/**
 * App Bar Plugin
 *
 * Adds basic demonstration functionality to .ms-AppBar components.
 *
 * @param  {jQuery Object}  One or more .ms-AppBar components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.AppBar = function () {

    /** Go through each app bar we've been given. */
    return this.each(function () {

      var $AppBar = $(this);

      $AppBar.on('click', '.js-toggleOverflow', function(event) {

        $AppBar.toggleClass('is-open');

      });

    });

  };
})(jQuery);
