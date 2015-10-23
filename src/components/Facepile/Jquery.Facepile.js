// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Facepile Plugin
 *
 * Adds basic demonstration functionality to .ms-FacePile components.
 *
 * @param  {jQuery Object}  One or more .ms-FacePile components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.FacePile = function () {

    /** Iterate through each Facepile provided. */
    return this.each(function () {
      
      var $facePile = $(this);        
      var $n = $(".ms-FacePile-members-withOverflow > button").length;      

      /** Add person when button clicked */
      $facePile.on("click", ".js-addPerson", function(event) {
        $(this).parent().next().children(":first").clone().prependTo(".ms-FacePile-members-withOverflow");  

        /** Increment person count by one */
        $n += 1;
        $(".ms-FacePile-overflow").text("+" + $n);

        /** Display a maxiumum of 6 people */
        $(".ms-FacePile-members-withOverflow").children(":gt(4)").hide();

        /** Display counter when 5 people are present */
        if ($n > 4) {
          $("span.ms-FacePile-overflow").removeClass("is-hidden");
          $("i.ms-FacePile-chevronThickDown").addClass("is-hidden");
        }

        /** Re-position counter when double digits reached */
        if ($n > 9) {
          $(".ms-FacePile-overflow").addClass("ms-FacePile-doubleDigits");
        }

      });

      /** Display person count on page load */
      $(document).ready(function() {
        $(".ms-FacePile-overflow").text("+" + $n);
      });  

    });

  };
})(jQuery);
