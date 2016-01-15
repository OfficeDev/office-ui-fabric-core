// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Persona Card Plugin
 *
 * Adds basic demonstration functionality to .ms-PersonaCard components.
 *
 * @param  {jQuery Object}  One or more .ms-PersonaCard components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.PersonaCard = function () {

    /** Go through each file picker we've been given. */
    return this.each(function () {

      var $personaCard = $(this);

      /** When selecting an action, show its details. */
      $personaCard.on('click', '.ms-PersonaCard-action', function() {

        /** Select the correct tab. */
        $personaCard.find('.ms-PersonaCard-action').removeClass('is-active');
        $(this).addClass('is-active');

        /** Function for switching selected item into view by adding a class to ul. */
        var updateForItem = function(wrapper, item) {
          var previousItem = wrapper.className + "";
          var detail = item.charAt(0).toUpperCase() + item.slice(1);
          var nextItem = "ms-PersonaCard-detail" + detail;
          if (previousItem !== nextItem){
            wrapper.classList.remove(previousItem);
            wrapper.classList.add(nextItem);
          }
        };

        /** Get id of selected item */
        var el = $(this).attr('id');
        /** Add detail class to ul to switch it into view. */
        updateForItem($(this).parent().next().find('#detailList')[0], el);

        /** Display the corresponding details. */
        var requestedAction = $(this).attr('id');
        $personaCard.find('.ms-PersonaCard-actionDetails').removeClass('is-active');
        $personaCard.find('#' + requestedAction + '.ms-PersonaCard-actionDetails').addClass('is-active');

      });

      /** Toggle more details. */
      $personaCard.on('click', '.ms-PersonaCard-detailExpander', function() {
        $(this).parent('.ms-PersonaCard-actionDetails').toggleClass('is-collapsed');
      });

    });

  };
})(jQuery);
