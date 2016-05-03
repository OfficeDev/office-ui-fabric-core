// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {

  /**
   * Contextual Menu Plugin
   */
  export class ContextualMenu {

    /**
     *
     * @param {HTMLDivElement} container - the target container for an instance of ContextualMenu
     * @constructor
     */
    constructor(container: HTMLElement) {
      let $contextualMenu = $(container);
      // Set selected states.
      $contextualMenu.on("click", ".ms-ContextualMenu-link:not(.is-disabled)", function(event) {
        event.preventDefault();

        // Check if multiselect - set selected states
        if ( $contextualMenu.hasClass("ms-ContextualMenu--multiselect") ) {

          // If already selected, remove selection; if not, add selection
          if ( $(this).hasClass("is-selected") ) {
            $(this).removeClass("is-selected");
          } else {
            $(this).addClass("is-selected");
          }
        } else { // All other contextual menu variants
          // Deselect all of the items and close any menus.
          $(".ms-ContextualMenu-link")
              .removeClass("is-selected")
              .siblings(".ms-ContextualMenu")
              .removeClass("is-open");

          // Select this item.
          $(this).addClass("is-selected");

          // If this item has a menu, open it.
          if ($(this).hasClass("ms-ContextualMenu-link--hasMenu")) {
            $(this).siblings(".ms-ContextualMenu:first").addClass("is-open");

            // Open the menu without bubbling up the click event,
            // which can cause the menu to close.
            event.stopPropagation();
          }

        }
      });
    }
  }
}
