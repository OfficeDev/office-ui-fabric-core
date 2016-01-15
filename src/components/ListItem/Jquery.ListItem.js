// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * List Item Plugin
 *
 * Adds basic demonstration functionality to .ms-ListItem components.
 *
 * @param  {jQuery Object}  One or more .ms-ListItem components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.ListItem = function () {

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $listItem = $(this);

      /** Detect clicks on selectable list items. */
      $listItem.on('click', '.js-toggleSelection', function() {
        $(this).parents('.ms-ListItem').toggleClass('is-selected');
      });

    });

  };
})(jQuery);
