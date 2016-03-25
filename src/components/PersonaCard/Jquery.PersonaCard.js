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
    function toggleDetails(target, $personaCard){		
        if('undefined' === typeof target){
            var targetIds = [];
            $('.ms-PersonaCard-action.is-active').each(function(){
                target = $(this).attr('data-detailsTargetName');
		        if('undefined' !== typeof target){
                    targetIds.push(target);
                }
            });
            targetIds.forEach(function(a){toggleDetails(a, $personaCard);});
        }
        else{
            var actionUrl = $personaCard.find("li[data-detailsTargetName='" + target + "']").attr('data-actionUrl');
            if("undefined" === typeof actionUrl){
                var t = $personaCard.find("ul[data-Name='" + target + "']");
                t.parent().children().removeClass('is-active').hide();
		        t.addClass('is-active').show();
            }
            else{
                document.location.href=actionUrl;
            }
        }
	}    
  
    $.fn.PersonaCard = function () {
    

    /** Go through each PersonaCard  we've been given. */
    return this.each(function () {

      var $personaCard = $(this);
      toggleDetails(undefined, $personaCard);
      /** Register action click handler */
      $personaCard.on('click', '.ms-PersonaCard-action', handleActionClick);
      $personaCard.on('click', '.ms-PersonaCard-overflow', handleActionClick);
      
      /** When clicking an action, show its details. */
      function handleActionClick() {

        /** Select the correct tab. */
        $personaCard.find('.ms-PersonaCard-action').removeClass('is-active');
        $(this).addClass('is-active');
        var target = $(this).attr('data-detailsTargetName');
        toggleDetails(target, $personaCard);        
      }
      
      /** Toggle more details. */
      $personaCard.on('click', '.ms-PersonaCard-detailExpander', function() {
        $(this).parent('.ms-PersonaCard-actionDetails').toggleClass('is-collapsed');
      });

    });

      
    
  };
})(jQuery);
