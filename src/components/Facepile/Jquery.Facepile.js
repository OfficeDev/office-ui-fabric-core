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
      var $membersList = $(".ms-FacePile-members"); 
      var $membersCount = $(".ms-FacePile-members > .ms-FacePile-itemBtn").length;
      var $panel = $('.ms-FacePile-panel.ms-Panel');
      var $panelMain = $panel.find(".ms-Panel-main");
      var $picker = $('.ms-PeoplePicker.ms-PeoplePicker--facePile');
      var $pickerResults = $picker.find(".ms-PeoplePicker-results");
      var $pickerMembers = $picker.find('.ms-PeoplePicker-selectedPeople');
      var $pickerMembersCount = $picker.find(".ms-PeoplePicker-selectedCount");
      var $pickerSearchField = $picker.find(".ms-PeoplePicker-searchField");
      var $personaCard = $('.ms-PersonaCard');


      /** Increment member count and show/hide overflow text */
      var incrementMembers = function() {
        /** Increment person count by one */
        $membersCount += 1;

        /** Display a maxiumum of 5 people */
        $(".ms-FacePile-members").children(":gt(4)").hide();

        /** Display counter after 5 people are present */
        if ($membersCount > 5) {
          $(".ms-FacePile-itemBtn--overflow").addClass("is-active");

          var remainingMembers = $membersCount - 5;
          $(".ms-FacePile-overflowText").text("+" + remainingMembers);
        }
      };

      /** Open panel with active people picker */
      $facePile.on("click", ".js-addPerson", function(event) {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open");

        if ($panel.hasClass('ms-FacePile-panel--overflow') && !$panel.hasClass('ms-FacePile-panel--addPerson')) {
          $panel.removeClass('ms-FacePile-panel--overflow');
          $panel.addClass('ms-FacePile-panel--addPerson');
        }

        /** Close any open persona cards */
        $personaCard.removeClass('is-active').hide();

        /** Stop the click event from propagating, which would just close the dropdown immediately. */
        event.stopPropagation();

        /** Before opening, size the results panel to match the people picker. */
        $pickerResults.width($picker.width() - 2);

        /** Show the $results by setting the people picker to active. */
        $picker.addClass("is-active");

        $pickerSearchField.focus();

        /** Temporarily bind an event to the document that will close the people picker when clicking anywhere. */
        $(document).bind("click.peoplepicker", function(event) {
            $picker.removeClass('is-active');
            $(document).unbind('click.peoplepicker');
            isActive = false;
        });
      });

      /** Search people picker items */
      $pickerSearchField.on('keyup', function(evt) {
        var suggested = [];
        var newSuggestions = [];
        var $pickerResult = $pickerResults.find('.ms-Persona-primaryText');

        $pickerResult.each(function() { suggested.push($(this).text()) });

        for (var i = 0; i < suggested.length; i++) {
          var currentPersona = suggested[i].toLowerCase();
          var currentValue = evt.target.value.toLowerCase();

          if (currentPersona.indexOf(currentValue) > -1) {
            newSuggestions.push(suggested[i]);
          }

          console.log(newSuggestions);
        };

        for (var i = 0; i < newSuggestions.length; i++) {
          var name = newSuggestions[i];
          var currentSuggestion = newSuggestions[i].toLowerCase();
          var resultText = suggested[i].toLowerCase();
          if (currentSuggestion === resultText) {
            $pickerResults.find('.ms-Persona-primaryText').filter(function() { 
              return $(this).text().toLowerCase() === currentSuggestion;
            }).parents('.ms-PeoplePicker-result').addClass('ms-bgColor-red');

            // $('.ms-Persona-primaryText:contains("' + name + 
            //   '")').filter(function() {
            //   return $(this).text() == currentSuggestion;
            // }).first().addClass('ms-bgColor-red');
            // $('.ms-Persona-primaryText:contains("' + currentSuggestion + '")').parent().addClass('ms-bgColor-red');
            console.log($('.ms-Persona-primaryText:contains("' + name + '")'));
            console.log('true');
            console.log(resultText);
            console.log(currentSuggestion);
          } else {
            $pickerResults.find('.ms-Persona-primaryText').filter(function() { 
              return $(this).text().toLowerCase() != currentSuggestion;
            }).parents('.ms-PeoplePicker-result').removeClass('ms-bgColor-red');

            console.log('false');
            console.log(resultText);
            console.log(currentSuggestion);
          }
        };


        
      });

      /** Open oveflow panel with list of members */
      $facePile.on("click", ".js-overflowPanel", function(event) {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open");

        if ($panel.hasClass('ms-FacePile-panel--addPerson') && !$panel.hasClass('ms-FacePile-panel--overflow')) {
          $panel.removeClass('ms-FacePile-panel--addPerson');
          $panel.addClass('ms-FacePile-panel--overflow');
        }
      });

      /** Toggle panel. */
      $(".js-togglePanel").on("click", function() {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open");
      });

      /** Display person count on page load */
      $(document).ready(function() {
        $(".ms-FacePile-overflowText").text("+" + $membersCount);
      });

      /** Show selected members from PeoplePicker in the FacePile */
      $('.ms-PeoplePicker-result').on('click', function() {
        var name = $(this).find(".ms-Persona-primaryText").html();
        var title = $(this).find(".ms-Persona-secondaryText").html();
        var selectedInitials = (function() {
          var nameArray = name.split(' ');
          var nameInitials = '';
          for (i = 0; i < nameArray.length; i++) {
            nameInitials += nameArray[i].charAt(0);
          }

          return nameInitials.substring(0,2);
        })();
        var selectedClasses = $(this).find('.ms-Persona-initials').attr('class');
        var selectedImage = $(this).find('.ms-Persona-image').attr('src');

        var facePileItem = 
          '<button class="ms-FacePile-itemBtn ms-FacePile-itemBtn--member" title="' + name + '">' +
            '<div class="ms-Persona ms-Persona--xs">' +
              '<div class="ms-Persona-imageArea">' +
                '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                '<img class="ms-Persona-image" src="' + selectedImage + '">' +
              '</div>' +
              '<div class="ms-Persona-presence"></div>' +
              '<div class="ms-Persona-details">' +
                '<div class="ms-Persona-primaryText">' + name + '</div>' +
                '<div class="ms-Persona-secondaryText">' + title + '</div>' +
              '</div>' +
            '</div>' +
          '</button>';

        /** Add new item to members list in facepile */
        $membersList.prepend(facePileItem);

        /** Increment member count */
        incrementMembers();

      });

      /** Remove members in panel people picker */
      $pickerMembers.on('click', '.js-selectedRemove', function() {
        var memberText = $(this).parent().find('.ms-Persona-primaryText').text();

        var $facePileMember = $membersList.find(".ms-Persona-primaryText:contains(" + memberText + ")").first();

        if ($facePileMember) {
          $facePileMember.parent().closest('.ms-FacePile-itemBtn').remove();

          $membersCount -= 1;

           /** Display a maxiumum of 5 people */
           $(".ms-FacePile-members").children(":lt(5)").show();

          /** Display counter after 5 people are present */
          if ($membersCount <= 5) {
            $(".ms-FacePile-itemBtn--overflow").removeClass("is-active");

            var remainingMembers = $membersCount - 5;
            $(".ms-FacePile-overflowText").text("+" + remainingMembers);
          }
        }
      });

      /** Show persona card when selecting a facepile item */
      $facePile.on('click', '.ms-FacePile-itemBtn', function() {
        var selectedName = $(this).find(".ms-Persona-primaryText").html();
        var selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
        var selectedInitials = (function() {
          var name = selectedName.split(' ');
          var nameInitials = '';
          for (i = 0; i < name.length; i++) {
            nameInitials += name[i].charAt(0);
          }

          return nameInitials.substring(0,2);;
        })();
        var selectedClasses = $(this).find('.ms-Persona-initials').attr('class');
        var selectedImage = $(this).find('.ms-Persona-image').attr('src');
        var $card = $('.ms-PersonaCard')
        var $cardName = $card.find('.ms-Persona-primaryText');
        var $cardTitle = $card.find('.ms-Persona-secondaryText');
        var $cardInitials = $card.find('.ms-Persona-initials');
        var $cardImage = $card.find('.ms-Persona-image');

        $personaCard.removeClass('is-active');

        /** Add data to persona card */
        $cardName.text(selectedName);
        $cardTitle.text(selectedTitle);
        $cardInitials.text(selectedInitials);
        $cardInitials.removeClass();
        $cardInitials.addClass(selectedClasses);
        $cardImage.attr('src', selectedImage);

        /** Show persona card */
        setTimeout(function() { $personaCard.addClass('is-active'); }, 100);

        /** Align persona card */
        var itemPosition = $(this).offset().left;
        var correctedPosition = itemPosition - 26;

        $personaCard.css({'left': correctedPosition});
      });

      /** Dismiss persona card when clicking on the document */
      $(document).on('click', function(e) {
        var activePersonaCard = $('.ms-PersonaCard');
        var memberBtn = $('.ms-FacePile-itemBtn--member')

        if (!memberBtn.is(e.target) && memberBtn.has(e.target).length === 0 && !activePersonaCard.is(e.target) && activePersonaCard.has(e.target).length === 0) {
          activePersonaCard.hide();
        } else {
          activePersonaCard.show();
        }
      });


    });
  };
})(jQuery);