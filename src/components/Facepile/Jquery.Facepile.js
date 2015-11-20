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
      var $pickerMembersArea = $picker.find('.ms-PeoplePicker-selected');
      var $pickerMembers = $picker.find('.ms-PeoplePicker-selectedPeople');
      var $pickerMembersCount = $picker.find(".ms-PeoplePicker-selectedCount");
      var $pickerSearchField = $picker.find(".ms-PeoplePicker-searchField");
      var $personaCard = $('.ms-FacePile').find('.ms-PersonaCard');


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

      /** Open panel with people picker */
      $facePile.on("click", ".js-addPerson", function(event) {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open")
              .removeClass('ms-FacePile-panel--overflow ms-Panel--right')
              .addClass('ms-FacePile-panel--addPerson');

        /** Close any open persona cards */
        $personaCard.removeClass('is-active').hide();
      });

      $panel.on("click", ".js-togglePanel", function() {
        $panel.toggleClass("is-open");
      });

      /** Open oveflow panel with list of members */
      $facePile.on("click", ".js-overflowPanel", function(event) {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open")
              .removeClass('ms-FacePile-panel--addPerson')
              .addClass('ms-FacePile-panel--overflow ms-Panel--right');
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
          } else {
            var remainingMembers = $membersCount - 5;
            $(".ms-FacePile-overflowText").text("+" + remainingMembers);
          }
        }
      });

      /** Show persona card when selecting a facepile item */
      $membersList.on('click', '.ms-FacePile-itemBtn', function() {
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

        /** Close any open persona cards */
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

        /** Align persona card on md and above screens */
        if ($(window).width() > 480) {
          var itemPosition = $(this).offset().left;
          var correctedPosition = itemPosition - 26;

          $personaCard.css({'left': correctedPosition});          
        } else {
          $personaCard.css({'left': 0, 'top': 'auto', 'position': 'fixed'});
        }
      });

      /** Dismiss persona card when clicking on the document */
      $(document).on('click', function(e) {
        var $memberBtn = $('.ms-FacePile-itemBtn--member');

        if (!$memberBtn.is(e.target) && $memberBtn.has(e.target).length === 0 && !$personaCard.is(e.target) && $personaCard.has(e.target).length === 0) {
          $personaCard.removeClass('is-active');
          $personaCard.removeAttr('style');
        } else {
          $personaCard.addClass('is-active');
        }
      });

    });
  };
})(jQuery);