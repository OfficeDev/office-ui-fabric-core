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

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $panel = $(this);
      var $panelMain = $panel.find(".ms-Panel-main");

      /** Hook to open the panel. */
      $(".js-togglePanel").on("click", function() {
        // Panel must be set to display "block" in order for animations to render
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open");
      });

      $panelMain.on("animationend webkitAnimationEnd MSAnimationEnd", function(event) {
        if (event.originalEvent.animationName === "fadeOut") {
          // Hide and Prevent ms-Panel-main from being interactive
          $(this).css({display: "none"});
        }
      });

    });

  };
})(jQuery);
