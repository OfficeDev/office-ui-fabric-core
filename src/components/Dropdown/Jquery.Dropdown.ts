// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {

  /**
   * Dropdown Plugin
   * 
   * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
   * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
   * 
   */
  export class Dropdown {

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Dropdown
     * @constructor
     */
    constructor(container: HTMLElement) {
      let $dropdownWrapper = $(container),
        $originalDropdown = $dropdownWrapper.children(".ms-Dropdown-select"),
        $originalDropdownOptions = $originalDropdown.children("option"),
        newDropdownTitle = "",
        newDropdownItems = "",
        newDropdownSource = "";

      /** Go through the options to fill up newDropdownTitle and newDropdownItems. */
      $originalDropdownOptions.each(function (index, option: any) {

        /** If the option is selected, it should be the new dropdown's title. */
        if (option.selected) {
          newDropdownTitle = option.text;
        }

        /** Add this option to the list of items. */
        newDropdownItems += "<li class='ms-Dropdown-item" + ( (option.disabled) ? " is-disabled'" : "'" );
        newDropdownItems += ">" + option.text + "</li>";
      });

      /** Insert the replacement dropdown. */
      newDropdownSource = "<span class='ms-Dropdown-title'>" + newDropdownTitle + "</span>";
      newDropdownSource += "<ul class='ms-Dropdown-items'>" + newDropdownItems + "</ul>";
      $dropdownWrapper.append(newDropdownSource);

      function _openDropdown(evt: Event): void {
        if (!$dropdownWrapper.hasClass("is-disabled")) {

          /** First, let"s close any open dropdowns on this page. */
          $dropdownWrapper.find(".is-open").removeClass("is-open");

          /** Stop the click event from propagating, which would just close the dropdown immediately. */
          evt.stopPropagation();

          /** Before opening, size the items list to match the dropdown. */
          let dropdownWidth = $(this).parents(".ms-Dropdown").width();
          $(this).next(".ms-Dropdown-items").css("width", dropdownWidth + "px");

          /** Go ahead and open that dropdown. */
          $dropdownWrapper.toggleClass("is-open");
          $(".ms-Dropdown").each(function(){
            if ($(this)[0] !== $dropdownWrapper[0]) {
              $(this).removeClass("is-open");
            }
          });

          /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
          $(document).bind("click.dropdown", function() {
            $dropdownWrapper.removeClass("is-open");
            $(document).unbind("click.dropdown");
          });
        }
      }

      /** Toggle open/closed state of the dropdown when clicking its title. */
      $dropdownWrapper.on("click", ".ms-Dropdown-title", function(event) {
        _openDropdown(event);
      });

        /** Keyboard accessibility */
      $dropdownWrapper.on("keyup", function(event) {
        let keyCode = event.keyCode || event.which;
        // Open dropdown on enter or arrow up or arrow down and focus on first option
        if (!$(this).hasClass("is-open")) {
          if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
             _openDropdown(event);
             if (!$(this).find(".ms-Dropdown-item").hasClass("is-selected")) {
            $(this).find(".ms-Dropdown-item:first").addClass("is-selected");
             }
          }
        } else if ($(this).hasClass("is-open")) {
          // Up arrow focuses previous option
          if (keyCode === 38) {
            if ($(this).find(".ms-Dropdown-item.is-selected").prev().siblings().length > 0) {
              $(this).find(".ms-Dropdown-item.is-selected").removeClass("is-selected").prev().addClass("is-selected");
            }
          }
          // Down arrow focuses next option
          if (keyCode === 40) {
            if ($(this).find(".ms-Dropdown-item.is-selected").next().siblings().length > 0) {
              $(this).find(".ms-Dropdown-item.is-selected").removeClass("is-selected").next().addClass("is-selected");
            }
          }
          // Enter to select item
          if (keyCode === 13) {
            if (!$dropdownWrapper.hasClass("is-disabled")) {

              // Item text
              let selectedItemText = $(this).find(".ms-Dropdown-item.is-selected").text();

              $(this).find(".ms-Dropdown-title").html(selectedItemText);

              /** Update the original dropdown. */
              $originalDropdown.find("option").each(function(key, value: any) {
                if (value.text === selectedItemText) {
                  $(this).prop("selected", true);
                } else {
                  $(this).prop("selected", false);
                }
              });
              $originalDropdown.change();

              $(this).removeClass("is-open");
            }
          }
        }

        // Close dropdown on esc
        if (keyCode === 27) {
          $(this).removeClass("is-open");
        }
      });

      /** Select an option from the dropdown. */
      $dropdownWrapper.on("click", ".ms-Dropdown-item", function () {
        if (!$dropdownWrapper.hasClass("is-disabled") && !$(this).hasClass("is-disabled")) {

          /** Deselect all items and select this one. */
          $(this).siblings(".ms-Dropdown-item").removeClass("is-selected");
          $(this).addClass("is-selected");

          /** Update the replacement dropdown's title. */
          $(this).parents().siblings(".ms-Dropdown-title").html($(this).text());

          /** Update the original dropdown. */
          let selectedItemText = $(this).text();
          $originalDropdown.find("option").each(function(key, value: any) {
            if (value.text === selectedItemText) {
              $(this).prop("selected", true);
            } else {
              $(this).prop("selected", false);
            }
          });
          $originalDropdown.change();
        }
      });
    }
  }
}
