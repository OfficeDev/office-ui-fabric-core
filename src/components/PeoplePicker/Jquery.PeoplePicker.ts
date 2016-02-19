// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

// @TODO - this could be done through nuget, but may not be needed since this should be temporary until we remove jquery completely
/// <reference path="../../jquery.d.ts"/>
/// <reference path="../Spinner/Spinner"/>

namespace fabric {

  function resizeSearchField($peoplePicker) {

    let $searchBox = $peoplePicker.find(".ms-PeoplePicker-searchBox");

    // Where is the right edge of the search box?
    let searchBoxLeftEdge = $searchBox.position().left;
    let searchBoxWidth = $searchBox.outerWidth();
    let searchBoxRightEdge = searchBoxLeftEdge + searchBoxWidth;

    // Where is the right edge of the last persona component?
    let $lastPersona = $searchBox.find(".ms-PeoplePicker-persona:last");
    let lastPersonaLeftEdge = $lastPersona.offset().left;
    let lastPersonaWidth = $lastPersona.outerWidth();
    let lastPersonaRightEdge = lastPersonaLeftEdge + lastPersonaWidth;

    // Adjust the width of the field to fit the remaining space.
    let newFieldWidth: any = searchBoxRightEdge - lastPersonaRightEdge - 7;

    // Don"t let the field get too tiny.
    if (newFieldWidth < 100) {
      newFieldWidth = "100%";
    }

    $peoplePicker.find(".ms-PeoplePicker-searchField").outerWidth(newFieldWidth);
  }

  /**
   * People Picker Plugin
   *
   * Adds basic demonstration functionality to .ms-PeoplePicker components.
   * 
   * @param  {jQuery Object}  One or more .ms-PeoplePicker components
   * @return {jQuery Object}  The same components (allows for chaining)
   */

  export class PeoplePicker {

    constructor(container) {
      let $peoplePicker = $(container);
      let $searchField = $peoplePicker.find(".ms-PeoplePicker-searchField");
      let $results = $peoplePicker.find(".ms-PeoplePicker-results");
      let $selected = $peoplePicker.find(".ms-PeoplePicker-selected");
      let $selectedPeople = $peoplePicker.find(".ms-PeoplePicker-selectedPeople");
      let $selectedCount = $peoplePicker.find(".ms-PeoplePicker-selectedCount");
      let isActive = false;
      let spinner;

      // Run when focused or clicked
      function peoplePickerActive(event) {
        /** Scroll the view so that the people picker is at the top. */
        $("html, body").animate({
          scrollTop: $peoplePicker.offset().top
        }, 367);

        /** Start by closing any open people pickers. */
        if ( $(".ms-PeoplePicker").hasClass("is-active") ) {
          $(".ms-PeoplePicker").removeClass("is-active");
        }

        isActive = true;

        /** Stop the click event from propagating, which would just close the dropdown immediately. */
        event.stopPropagation();

        /** Before opening, size the results panel to match the people picker. */
        $results.width($peoplePicker.width() - 2);

        /** Show the $results by setting the people picker to active. */
        $peoplePicker.addClass("is-active");

        /** Temporarily bind an event to the document that will close the people picker when clicking anywhere. */
        $(document).bind("click.peoplepicker", function() {
            $peoplePicker.removeClass("is-active");
            $(document).unbind("click.peoplepicker");
            isActive = false;
        });
      }

      /** Set to active when focusing on the input. */
      $peoplePicker.on("focus", ".ms-PeoplePicker-searchField", function(event) {
        peoplePickerActive(event);
      });

      /** Set to active when clicking on the input. */
      $peoplePicker.on("click", ".ms-PeoplePicker-searchField", function(event) {
        peoplePickerActive(event);
      });

      /** Keep the people picker active when clicking within it. */
      $(this).click(function (event) {
          event.stopPropagation();
      });

      /** Add the selected person to the text field or selected list and close the people picker. */
      $results.on("click", ".ms-PeoplePicker-result", function () {
          let selectedName = $(this).find(".ms-Persona-primaryText").html();
          let selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
          let personaHTML = "<div class=\"ms-PeoplePicker-persona\">" +
                "<div class=\"ms-Persona ms-Persona--xs ms-Persona--square\">" +
                                   "<div class=\"ms-Persona-imageArea\">" +
                                     "<i class=\"ms-Persona-placeholder ms-Icon ms-Icon--person\"></i>" +
                                     "<img class=\"ms-Persona-image\" src=\"../persona/Persona.Person2.png\">" +
                                   "</div>" +
                                   "<div class=\"ms-Persona-presence\"></div>" +
                                   "<div class=\"ms-Persona-details\">" +
                                     "<div class=\"ms-Persona-primaryText\">" + selectedName + "</div>" +
                                  " </div>" +
                                 "</div>" +
                                 "<button class=\"ms-PeoplePicker-personaRemove\">" +
                                   "<i class=\"ms-Icon ms-Icon--x\"></i>" +
                                " </button>" +
                               "</div>";
          let personaListItem = "<li class=\"ms-PeoplePicker-selectedPerson\">" +
            "<div class=\"ms-Persona ms-Persona--square\">" +
               "<div class=\"ms-Persona-imageArea\">" +
                 "<i class=\"ms-Persona-placeholder ms-Icon ms-Icon--person\"></i>" +
                  "<img class=\"ms-Persona-image\" src=\"../persona/Persona.Person2.png\"><div class=\"ms-Persona-presence\"></div>" +
               "</div>" +
               "<div class=\"ms-Persona-details\">" +
                  "<div class=\"ms-Persona-primaryText\">" + selectedName + "</div>" +
                  "<div class=\"ms-Persona-secondaryText\">" + selectedTitle + "</div>" +
                "</div>" +
              "</div>" +
              "<button class=\"ms-PeoplePicker-resultAction js-selectedRemove\"><i class=\"ms-Icon ms-Icon--x\"></i></button>" +
          "</li>";
          if (!$peoplePicker.hasClass("ms-PeoplePicker--facePile")) {
            $searchField.before(personaHTML);
            $peoplePicker.removeClass("is-active");
            resizeSearchField($peoplePicker);
          } else {
            if (!$selected.hasClass("is-active")) {
              $selected.addClass("is-active");
            }
            $selectedPeople.prepend(personaListItem);
            $peoplePicker.removeClass("is-active");

            let count: any = $peoplePicker.find(".ms-PeoplePicker-selectedPerson").length;
            $selectedCount.html(count);
          }
      });

      /** Remove the persona when clicking the personaRemove button. */
      $peoplePicker.on("click", ".ms-PeoplePicker-personaRemove", function() {
        $(this).parents(".ms-PeoplePicker-persona").remove();

        /** Make the search field 100% width if all personas have been removed */
        if ( $(".ms-PeoplePicker-persona").length === 0 ) {
          $peoplePicker.find(".ms-PeoplePicker-searchField").outerWidth("100%");
        } else {
          resizeSearchField($peoplePicker);
        }
      });

      /** Trigger additional searching when clicking the search more area. */
      $results.on("click", ".js-searchMore", function() {
        let $searchMore = $(this);
        let primaryLabel = $searchMore.find(".ms-PeoplePicker-searchMorePrimary");
        let originalPrimaryLabelText = primaryLabel.html();

        /** Change to searching state. */
        $searchMore.addClass("is-searching");
        primaryLabel.html("Searching for &ldquo;Sen&rdquo;");

        /** Attach Spinner */
        if (!spinner) {
          spinner = new fabric.Spinner($searchMore.get(0));
        } else {
          spinner.start();
        }

        /** Return the original state. */
        setTimeout(function() {
            $searchMore.removeClass("is-searching");
            primaryLabel.html(originalPrimaryLabelText);
            spinner.stop();
        }, 3000);
      });

      /** Remove a result using the action icon. */
      $results.on("click", ".js-resultRemove", function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-result").remove();
      });

      /** Expand a result if more details are available. */
      $results.on("click", ".js-resultExpand", function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-result").toggleClass("is-expanded");
      });

      /** Remove a selected person using the action icon. */
      $selectedPeople.on("click", ".js-selectedRemove", function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-selectedPerson").remove();
          let count: any = $peoplePicker.find(".ms-PeoplePicker-selectedPerson").length;
          $selectedCount.html(count);
          if ($peoplePicker.find(".ms-PeoplePicker-selectedPerson").length === 0) {
            $selected.removeClass("is-active");
          }
      });
    }
  }
}

(function (fabric, $) {
  $.fn.PeoplePicker = function () {

    /** Iterate through each people picker provided. */
    return this.each(function () {
      return new fabric.PeoplePicker(this);
    });
  };
})(fabric, jQuery);
