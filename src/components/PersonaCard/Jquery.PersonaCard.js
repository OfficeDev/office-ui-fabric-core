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
    /* Show/Hide the appropriate details for the selected Action */
    function toggleDetails(target){		
        if('undefined' === typeof target){
            var targetIds = [];
            $('.ms-PersonaCard-action.is-active').each(function(){
                target = $(this).attr('data-detailsTargetId');
		        if('undefined' !== typeof target){
                    targetIds.push(target);
                }
            });
            targetIds.forEach(toggleDetails);
        }
        else{
            var actionUrl = $("li[data-detailsTargetId='" + target + "']").attr('data-actionUrl');
            if("undefined" === typeof actionUrl){
                $('#' + target).parent().children().removeClass('is-active').hide();
		        $('#' + target).addClass('is-active').show();
            }
            else{
                document.location.href=actionUrl;
            }
        }
	}    
  
    $.fn.PersonaCard = function () {
    toggleDetails();

    /** Go through each PersonaCard  we've been given. */
    return this.each(function () {

      var $personaCard = $(this);

      /** Register action click handler */
      $personaCard.on('click', '.ms-PersonaCard-action', handleActionClick);
      $personaCard.on('click', '.ms-PersonaCard-overflow', handleActionClick);
      
      /** When clicking an action, show its details. */
      function handleActionClick() {

        /** Select the correct tab. */
        $personaCard.find('.ms-PersonaCard-action').removeClass('is-active');
        $(this).addClass('is-active');
        var target = $(this).attr('data-detailsTargetId');
        toggleDetails(target);        
      }
      
      /** Toggle more details. */
      /** --(DM) NOT USED?   */
      $personaCard.on('click', '.ms-PersonaCard-detailExpander', function() {
        $(this).parent('.ms-PersonaCard-actionDetails').toggleClass('is-collapsed');
      });

    });

      
    
  };
})(jQuery);
