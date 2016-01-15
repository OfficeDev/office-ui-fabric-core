// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

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
        var $searchBox = $navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field');
        event.stopPropagation();

        // Prevent default actions from firing if links are not found.
        if ($(this).children('.ms-NavBar-link').length === 0) {
          event.preventDefault();
        }

        // Deselect all of the items.
        $(this).siblings('.ms-NavBar-item').removeClass('is-selected');

        // Close and blur the search box if it doesn't have text.
        if ($searchBox.length > 0 && $searchBox.val().length === 0) {
          $('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
        }

        // Does the selected item have a menu?
        if ($(this).hasClass('ms-NavBar-item--hasMenu')) {
          
          // First, close any neighboring menus.
          $(this).siblings('.ms-NavBar-item--hasMenu').children('.ms-ContextualMenu:first').removeClass('is-open');
          
          // Toggle 'is-open' to open or close it.
          $(this).children('.ms-ContextualMenu:first').toggleClass('is-open');

          // Toggle 'is-selected' to indicate whether it is active.
          $(this).toggleClass('is-selected');
        } else {
          // Doesn't have a menu, so just select the item.
          $(this).addClass('is-selected');

          // Close the submenu and any open contextual menus.
          $navBar.removeClass('is-open').find('.ms-ContextualMenu').removeClass('is-open');
        }

        // Is this the search box? Open it up and focus on the search field.
        if ($(this).hasClass('ms-NavBar-item--search')) {
          $(this).addClass('is-open');
          $(this).find('.ms-TextField-field').focus();

          // Close any open menus.
          $navBar.find('.ms-ContextualMenu:first').removeClass('is-open');
        }
      });

      // Prevent contextual menus from being hidden when clicking on them.
      $navBar.on('click', '.ms-NavBar-item .ms-ContextualMenu', function(event) {
        event.stopPropagation();

        // Collapse the mobile "panel" for nav items.
        $(this).removeClass('is-open');
        $navBar.removeClass('is-open').find('.ms-NavBar-item--hasMenu').removeClass('is-selected');
      });

      // Hide any menus and close the search box when clicking anywhere in the document.
      $(document).on('click', 'html', function() {
		var $searchBox = $navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field');  
        $navBar.find('.ms-NavBar-item').removeClass('is-selected').find('.ms-ContextualMenu').removeClass('is-open');

        // Close and blur the search box if it doesn't have text.
        if ($searchBox.length > 0 && $searchBox.val().length === 0) {
          $navBar.find('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
        }
      });
    });
  };
})(jQuery);
