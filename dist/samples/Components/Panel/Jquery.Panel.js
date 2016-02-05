// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

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

    var pfx = ["webkit", "moz", "MS", "o", ""];

    // Prefix function
    function prefixedEvent(element, type, callback) {
      for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) { type = type.toLowerCase(); }
        element.addEventListener(pfx[p]+type, callback, false);
      }
    }

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $panel = $(this);
      var $panelMain = $panel.find(".ms-Panel-main");

      /** Hook to open the panel. */
      $(".ms-PanelAction-close").on("click", function() {

        // Display Panel first, to allow animations
        $panel.addClass("ms-Panel-animateOut");

      });

      $(".ms-PanelAction-open").on("click", function() {

        // Display Panel first, to allow animations
        $panel.addClass("is-open");

        // Add animation class
        $panel.addClass("ms-Panel-animateIn");

      });

      prefixedEvent($panelMain[0], 'AnimationEnd', function(event) {
        if (event.animationName.indexOf('Out') > -1) {

          // Hide and Prevent ms-Panel-main from being interactive
          $panel.removeClass('is-open');

          // Remove animating classes for the next time we open panel
          $panel.removeClass('ms-Panel-animateIn ms-Panel-animateOut');

        }
      });

    });

  };
})(jQuery);
