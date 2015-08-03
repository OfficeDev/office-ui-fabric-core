/**
 * Nav Bar Plugin
 */
(function ($) {
  $.fn.NavBar = function () {

    /** Go through each nav bar we've been given. */
    return this.each(function () {

      var $navBar = $(this);

      // Open the nav bar on mobile.
      $navBar.on('click', '.js-openMenu', function(event) {
        event.stopPropagation();
        $navBar.toggleClass('is-open');
      });

      // Close the nav bar on mobile.
      $navBar.click(function() {
        if ($navBar.hasClass('is-open')) {
          $navBar.removeClass('is-open');
        }
      });

      // Set selected states and open/close menus.
      $navBar.on('click', '.ms-NavBar-item:not(.is-disabled)', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Deselect all of the items.
        $(this).siblings('.ms-NavBar-item').removeClass('is-selected');

        // Does the selected item have a menu?
        if ($(this).hasClass('ms-NavBar-item--hasMenu')) {

          // Toggle 'is-open' to open or close it.
          $(this).children('.ms-ContextualMenu:first').toggleClass('is-open');

          // Toggle 'is-selected' to indicate whether it is active.
          $(this).toggleClass('is-selected');

        } else {

          // Doesn't have a menu, so just select the item.
          $(this).addClass('is-selected');

        }

        // Is this the search box? Open it up and focus on the search field.
        if ($(this).hasClass('ms-NavBar-item--search')) {
          $(this).addClass('is-open');
          $(this).find('.ms-TextField-field').focus();
        }
      });

    });
  };
})(jQuery);
