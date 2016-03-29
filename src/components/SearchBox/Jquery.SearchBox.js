// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * SearchBox Plugin
 *
 * Adds basic demonstration functionality to .ms-SearchBox components.
 *
 * @param  {jQuery Object}  One or more .ms-SearchBox components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.SearchBox = function () {
    
    function setHasText($sbox, $field) {
      // Show cancel button by adding is-active class
      if ($field.val().length > 0 ) {
        $sbox.addClass('has-text');
      } else {
        $sbox.removeClass('has-text');
        console.log("has tex");
      }
    }
    
    /** Iterate through each text field provided. */
    return this.each(function () {
      // Set cancel to false
      var cancel = false;
      var $thisSearchBox = $(this);
      var $searchField = $thisSearchBox.find('.ms-SearchBox-field');
      
      setHasText($thisSearchBox, $searchField);
      
      /** SearchBox focus - hide label and show cancel button */
      $searchField.on('focus', function() {
        setHasText($thisSearchBox, $searchField);
        /** Hide the label on focus. */
        $thisSearchBox.addClass('is-active');
      });
      
      $searchField.on('keydown', function() {
        setHasText($thisSearchBox, $searchField);
      });

      // If cancel button is selected, change cancel value to true
      $thisSearchBox.find('.ms-SearchBox-closeButton').on('mousedown', function() {
        cancel = true;
      });

      /** Show the label again when leaving the field. */
      $thisSearchBox.find('.ms-SearchBox-field').on('blur', function() {

        // If cancel button is selected remove the text and show the label
        if (cancel) {
          $(this).val('');
        }
   
        // Prevents inputfield from gaining focus too soon
        setTimeout(function() {
          // Remove is-active class - hides cancel button
          $thisSearchBox.removeClass('is-active');
        }, 10);
        
        /** Only do this if no text was entered. */
        setHasText($thisSearchBox, $searchField);

        // Reset cancel to false
        cancel = false;
      });
    });

  };
})(jQuery);
