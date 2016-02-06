// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

var fabric = fabric || {};

/**
 * People Picker Plugin
 *
 * Adds basic demonstration functionality to .ms-PeoplePicker components.
 * 
 * @param  {jQuery Object}  One or more .ms-PeoplePicker components
 * @return {jQuery Object}  The same components (allows for chaining)
 */

(function ($) {
  $.fn.PeoplePicker = function () {

    /** Iterate through each people picker provided. */
    return this.each(function () {

      var $peoplePicker = $(this);
      var $searchField = $peoplePicker.find(".ms-PeoplePicker-searchField");
      var $results = $peoplePicker.find(".ms-PeoplePicker-results");
      var $selected = $peoplePicker.find('.ms-PeoplePicker-selected');
      var $selectedPeople = $peoplePicker.find(".ms-PeoplePicker-selectedPeople");
      var $selectedCount = $peoplePicker.find(".ms-PeoplePicker-selectedCount");
      var $peopleList = $peoplePicker.find(".ms-PeoplePicker-peopleList");
      var isActive = false;
      var spinner;
      var $personaCard = $('.ms-PeoplePicker').find('.ms-PersonaCard');

      // Run when focused or clicked
      function peoplePickerActive(event) {
        /** Scroll the view so that the people picker is at the top. */
        $('html, body').animate({
          scrollTop: $peoplePicker.offset().top
        }, 367);

        /** Start by closing any open people pickers. */
        if ( $peoplePicker.hasClass('is-active') ) {
          $peoplePicker.removeClass("is-active");
        }

        /** Display a maxiumum of 5 people in Facepile variant */
        if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile') && $searchField.val() === "") {
          $peopleList.children(":gt(4)").hide();
        }

        /** Animate results and members in Facepile variant. */
        if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
          // $results.addClass('ms-u-slideDownIn20');
          $selectedPeople.addClass('ms-u-slideDownIn20');
          setTimeout(function() { $results.removeClass('ms-u-slideDownIn20'); $selectedPeople.removeClass('ms-u-slideDownIn20');}, 1000);
        }

        isActive = true;

        /** Stop the click event from propagating, which would just close the dropdown immediately. */
        event.stopPropagation();

        /** Before opening, size the results panel to match the people picker. */
        if (!$peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
          $results.width($peoplePicker.width() - 2);
        }

        /** Show the $results by setting the people picker to active. */
        $peoplePicker.addClass("is-active");

        /** Temporarily bind an event to the document that will close the people picker when clicking anywhere. */
        $(document).bind("click.peoplepicker", function() {
            $peoplePicker.removeClass('is-active');
            if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
              $peoplePicker.removeClass('is-searching');
              $('.ms-PeoplePicker-selected').show();
              $('.ms-PeoplePicker-searchMore').removeClass('is-active');
              $searchField.val("");
            }
            $(document).unbind('click.peoplepicker');
            isActive = false;
        });
      }
      
      /** Set to active when focusing on the input. */
      $peoplePicker.on('focus', '.ms-PeoplePicker-searchField', function(event) {
        peoplePickerActive(event);
      });

      /** Set to active when clicking on the input. */
      $peoplePicker.on('click', '.ms-PeoplePicker-searchField', function(event) {
        peoplePickerActive(event);
      });

      /** Keep the people picker active when clicking within it. */
      $(this).click(function (event) {
          event.stopPropagation();
      });

      /** Add the selected person to the text field or selected list and close the people picker. */
      $results.on('click', '.ms-PeoplePicker-result', function () {
          var $this = $(this); 
          var selectedName = $this.find(".ms-Persona-primaryText").html();
          var selectedTitle = $this.find(".ms-Persona-secondaryText").html();
          var selectedInitials = (function() {
            var name = selectedName.split(' ');
            var nameInitials = '';

            for (var i = 0; i < name.length; i++) {
              nameInitials += name[i].charAt(0);
            }

            return nameInitials.substring(0,2);
          })();
          var selectedClasses = $this.find('.ms-Persona-initials').attr('class');
          var selectedImage = (function() {
            if ($this.find('.ms-Persona-image').length) {
              var selectedImageSrc = $this.find('.ms-Persona-image').attr('src');
              return '<img class="ms-Persona-image" src="' + selectedImageSrc + '" alt="Persona image">';
            } else {
              return '';
            }
          })();

          /** Token html */
          var personaHTML = '<div class="ms-PeoplePicker-persona">' +
                              '<div class="ms-Persona ms-Persona--xs ms-Persona--square">' +
                               '<div class="ms-Persona-imageArea">' +
                                 '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                                 selectedImage +
                               '</div>' +
                               '<div class="ms-Persona-presence"></div>' +
                               '<div class="ms-Persona-details">' +
                                 '<div class="ms-Persona-primaryText">' + selectedName + '</div>' +
                              ' </div>' +
                             '</div>' +
                             '<button class="ms-PeoplePicker-personaRemove">' +
                               '<i class="ms-Icon ms-Icon--x"></i>' +
                            ' </button>' +
                           '</div>';
          /** List item html */
          var personaListItem = '<li class="ms-PeoplePicker-selectedPerson">' +
                                  '<div class="ms-Persona ms-Persona--sm">' +
                                     '<div class="ms-Persona-imageArea">' +
                                       '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                                       selectedImage +
                                     '</div>' +
                                     '<div class="ms-Persona-presence"></div>' +
                                     '<div class="ms-Persona-details">' +
                                        '<div class="ms-Persona-primaryText">' + selectedName + '</div>' +
                                        '<div class="ms-Persona-secondaryText">' + selectedTitle + '</div>' +
                                      '</div>' +
                                    '</div>' +
                                    '<button class="ms-PeoplePicker-resultAction js-selectedRemove"><i class="ms-Icon ms-Icon--x"></i></button>' +
                                '</li>';
          /** Tokenize selected persona if not Facepile or memberslist variants */
          if (!$peoplePicker.hasClass('ms-PeoplePicker--Facepile') && !$peoplePicker.hasClass('ms-PeoplePicker--membersList') ) {
            $searchField.before(personaHTML);
            $peoplePicker.removeClass("is-active");
            resizeSearchField($peoplePicker);
          }
          /** Add selected persona to a list if Facepile or memberslist variants */
          else {
            if (!$selected.hasClass('is-active')) {
              $selected.addClass('is-active');
            }
            /** Prepend persona list item html to selected people list */
            $selectedPeople.prepend(personaListItem);
            /** Close the picker */
            $peoplePicker.removeClass("is-active");
            /** Get the total amount of selected personas and display that number */
            var count = $peoplePicker.find('.ms-PeoplePicker-selectedPerson').length;
            $selectedCount.html(count);
            /** Return picker back to default state:
            - Show only the first five results in the people list for when the picker is reopened
            - Make searchMore inactive
            - Clear any search field text 
            */
            $peopleList.children().show();
            $peopleList.children(":gt(4)").hide();

            $('.ms-PeoplePicker-searchMore').removeClass('is-active');
            $searchField.val("");
          }
      });

      /** Remove the persona when clicking the personaRemove button. */
      $peoplePicker.on('click', '.ms-PeoplePicker-personaRemove', function() {
        $(this).parents('.ms-PeoplePicker-persona').remove();

        /** Make the search field 100% width if all personas have been removed */
        if ( $('.ms-PeoplePicker-persona').length === 0 ) {
          $peoplePicker.find('.ms-PeoplePicker-searchField').outerWidth('100%');
        } else {
          resizeSearchField($peoplePicker);
        }
      });

      /** Trigger additional searching when clicking the search more area. */
      $results.on('click', '.js-searchMore', function() {
        var $searchMore = $(this);
        var primaryLabel = $searchMore.find(".ms-PeoplePicker-searchMorePrimary");
        var originalPrimaryLabelText = primaryLabel.html();
        var searchFieldText = $searchField.val();

        /** Change to searching state. */
        $searchMore.addClass("is-searching");
        primaryLabel.html("Searching for " + searchFieldText);

        /** Attach Spinner */
        if (!spinner) {
          spinner = new fabric.Spinner($searchMore.get(0));
        } else {
          spinner.start();
        }

        /** Show all results in Facepile variant */
        if($peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
          setTimeout(function() {$peopleList.children().show();}, 1500);
        }
        
        /** Return the original state. */
        setTimeout(function() {
            $searchMore.removeClass("is-searching");
            primaryLabel.html(originalPrimaryLabelText);
            spinner.stop();
        }, 1500);
      });

      /** Remove a result using the action icon. */
      $results.on('click', '.js-resultRemove', function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-result").remove();
      });

      /** Expand a result if more details are available. */
      $results.on('click', '.js-resultExpand', function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-result").toggleClass("is-expanded");
      });

      /** Remove a selected person using the action icon. */
      $selectedPeople.on('click', '.js-selectedRemove', function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-selectedPerson").remove();
          var count = $peoplePicker.find('.ms-PeoplePicker-selectedPerson').length;
          $selectedCount.html(count);
          if ($peoplePicker.find('.ms-PeoplePicker-selectedPerson').length === 0) {
            $selected.removeClass('is-active');
          }
      });

      var filterResults = function(results, currentSuggestion, currentValueExists) {
        return results.find('.ms-Persona-primaryText').filter(function() {
          if (currentValueExists) {
            return $(this).text().toLowerCase() === currentSuggestion;
          } else {
            return $(this).text().toLowerCase() !== currentSuggestion;
          }
        }).parents('.ms-PeoplePicker-peopleListItem');
      };

      /** Search people picker items */
      $peoplePicker.on('keyup', '.ms-PeoplePicker-searchField', function(evt) {
        var suggested = [];
        var newSuggestions = [];
        var $pickerResult = $results.find('.ms-Persona-primaryText');

        $peoplePicker.addClass('is-searching');

        /** Hide members */
        $selected.hide();

        /** Show 5 results */
        $peopleList.children(":lt(5)").show();

        /** Show searchMore button */
        $('.ms-PeoplePicker-searchMore').addClass('is-active');

        /** Get array of suggested people */
        $pickerResult.each(function() { suggested.push($(this).text()); });

        /** Iterate over array to find matches and show matching items */
        for (var i = 0; i < suggested.length; i++) {
          var currentPersona = suggested[i].toLowerCase();
          var currentValue = evt.target.value.toLowerCase();
          var currentSuggestion;

          if (currentPersona.indexOf(currentValue) > -1) {
            currentSuggestion = suggested[i].toLowerCase();

            newSuggestions.push(suggested[i]);

            filterResults($results, currentSuggestion, true).show();
          } else {
            filterResults($results, currentSuggestion, false).hide();
          }
        }

        /** Show members and hide searchmore when field is empty */
        if ($(this).val() === "") {
          $peoplePicker.removeClass('is-searching');
          $selected.show();
          $('.ms-PeoplePicker-searchMore').removeClass('is-active');
          $selectedPeople.addClass('ms-u-slideDownIn20');
          setTimeout(function() { $selectedPeople.removeClass('ms-u-slideDownIn20');}, 1000);
          $peopleList.children(":gt(4)").hide();
        }
      });

      /** Show persona card when clicking a persona in the members list */
      $selectedPeople.on('click', '.ms-Persona', function() {
        var selectedName = $(this).find(".ms-Persona-primaryText").html();
        var selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
        var selectedInitials = (function() {
          var name = selectedName.split(' ');
          var nameInitials = '';

          for (var i = 0; i < name.length; i++) {
            nameInitials += name[i].charAt(0);
          }

          return nameInitials.substring(0,2);
        })();
        var selectedClasses = $(this).find('.ms-Persona-initials').attr('class');
        var selectedImage = $(this).find('.ms-Persona-image').attr('src');
        var $card = $('.ms-PersonaCard');
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
        setTimeout(function() { 
          $personaCard.addClass('is-active');
          setTimeout(function(){$personaCard.css({'animation-name': 'none'});}, 300);
        }, 100);

        /** Align persona card on md and above screens */
        if ($(window).width() > 480) {
          var itemPositionTop = $(this).offset().top;
          var correctedPositionTop = itemPositionTop + 10;

          $personaCard.css({'top': correctedPositionTop, 'left': 0});          
        } else {
          $personaCard.css({'top': 'auto'});
        }
      });

      /** Dismiss persona card when clicking on the document */
      $(document).on('click', function(e) {
        var $memberBtn = $('.ms-PeoplePicker-selectedPerson').find('.ms-Persona');

        if (!$memberBtn.is(e.target) && !$personaCard.is(e.target) && $personaCard.has(e.target).length === 0) {
          $personaCard.removeClass('is-active');
          setTimeout(function(){$personaCard.removeAttr('style');}, 300);
        } else {
          $personaCard.addClass('is-active');
        }
      });
    });
  };

  /** Resize the search field to match the search box */
  function resizeSearchField($peoplePicker) {
    var $searchBox = $peoplePicker.find('.ms-PeoplePicker-searchBox');

    // Where is the right edge of the search box?
    var searchBoxLeftEdge = $searchBox.position().left;
    var searchBoxWidth = $searchBox.outerWidth();
    var searchBoxRightEdge = searchBoxLeftEdge + searchBoxWidth;

    // Where is the right edge of the last persona component?
    var $lastPersona = $searchBox.find('.ms-PeoplePicker-persona:last');
    var lastPersonaLeftEdge = $lastPersona.offset().left;
    var lastPersonaWidth = $lastPersona.outerWidth();
    var lastPersonaRightEdge = lastPersonaLeftEdge + lastPersonaWidth;

    // Adjust the width of the field to fit the remaining space.
    var newFieldWidth = searchBoxRightEdge - lastPersonaRightEdge - 7;

    // Don't let the field get too tiny.
    if (newFieldWidth < 100) {
      newFieldWidth = "100%";
    }

    // Set the width of the search field
    $peoplePicker.find('.ms-PeoplePicker-searchField').outerWidth(newFieldWidth);
  }
})(jQuery);
