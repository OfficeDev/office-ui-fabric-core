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
      var $panel = $('.ms-Panel.ms-Panel--facePile');
      var $panelMain = $panel.find(".ms-Panel-main");
      var $picker = $('.ms-PeoplePicker.ms-PeoplePicker--facePile');
      var $pickerResults = $picker.find(".ms-PeoplePicker-results");
      var $pickerMembers = $picker.find('.ms-PeoplePicker-selectedPeople');
      var $pickerMembersCount = $picker.find(".ms-PeoplePicker-selectedCount");
      var $pickerSearchField = $picker.find(".ms-PeoplePicker-searchField");


      /** Increment member count and show/hide overflow text */
      var incrementMembers = function() {
        /** Increment person count by one */
        $membersCount += 1;
        // $(".ms-FacePile-overflowText").text("+" + $membersCount);

        /** Display a maxiumum of 6 people */
        $(".ms-FacePile-members").children(":gt(4)").hide();

        /** Display counter after 5 people are present */
        if ($membersCount > 5) {
          $(".ms-FacePile-overflowText").removeClass("is-hidden");
          $(".ms-FacePile-expandIcon").addClass("is-hidden");

          var remainingMembers = $membersCount - 5;
          $(".ms-FacePile-overflowText").text("+" + remainingMembers);
        }
      };

      /** Add person when button clicked */
      $facePile.on("click", ".js-addPerson", function(event) {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open");

        /** Stop the click event from propagating, which would just close the dropdown immediately. */
        event.stopPropagation();

        /** Before opening, size the results panel to match the people picker. */
        $pickerResults.width($picker.width() - 2);

        /** Show the $results by setting the people picker to active. */
        $picker.addClass("is-active");

        /** Temporarily bind an event to the document that will close the people picker when clicking anywhere. */
        $(document).bind("click.peoplepicker", function(event) {
            $picker.removeClass('is-active');
            $(document).unbind('click.peoplepicker');
            isActive = false;
        });

      });

      /** Toggle members panel. */
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

        var facePileItem = 
          '<button class="ms-FacePile-itemBtn" title="' + name + '">' +
            '<div class="ms-Persona ms-Persona--xs">' +
              '<div class="ms-Persona-imageArea">' +
                '<div class="ms-Persona-initials ms-Persona-initials--blue">' + selectedInitials + '</div>' +
                '<img class="ms-Persona-image" src="../persona/Persona.Person2.png">' +
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
        }
      });


    });
  };
})(jQuery);
