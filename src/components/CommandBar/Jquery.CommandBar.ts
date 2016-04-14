// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

module fabric {

  class CommandItem {
    public jquery: JQuery;
    public rightOffset: number;

    constructor(jquery, rightOffset) {
      this.jquery = jquery;
      this.rightOffset = rightOffset;
    }
  }

  /**
   * Command Bar Plugin
   */
  export class CommandBar {

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of CommandBar
     * @constructor
     */
    constructor(container: HTMLElement) {
      let $CommandBar = $(container);
      let $CommandMainArea = $CommandBar.find(".ms-CommandBar-mainArea");
      let $CommandBarItems = $CommandMainArea.find(".ms-CommandBarItem").not(".ms-CommandBarItem-overflow");
      let $OverflowCommand = $CommandBar.find(".ms-CommandBarItem-overflow");
      let $OverflowCommandWidth = $CommandBar.find(".ms-CommandBarItem-overflow").outerWidth();
      let $OverflowMenu = $CommandBar.find(".ms-CommandBar-overflowMenu");
      let $SearchBox = $CommandBar.find(".ms-CommandBarSearch");
      let mobileSwitch = false;
      let overFlowCommands;
      let allCommands;

      // Go through process and save commands
      allCommands = this._saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

      // Initiate process commands and add commands to overflow on load
      overFlowCommands = this._processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
      this._processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

      // Set Search Behavior
      if ($(window).width() < 640) {

        $(".ms-CommandBarSearch-iconSearchWrapper").click(function() {
          $(this).closest(".ms-CommandBarSearch").addClass("is-active");
        });

      }

      // Add resize event handler on commandBar
      $(window).resize(() => {
        if ($(window).width() < 640 && mobileSwitch === false) {
          // Go through process and save commands
          allCommands = this._saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

          mobileSwitch = true;

          // Search Behavior
          $(".ms-CommandBarSearch-iconSearchWrapper").unbind();
          $(".ms-CommandBarSearch-iconSearchWrapper").click(function() {
            $(this).closest(".ms-CommandBarSearch").addClass("is-active");
          });

        } else if ($(window).width() > 639 && mobileSwitch === true) {
          // Go through process and save commands
          allCommands = this._saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

          mobileSwitch = false;
          $(".ms-CommandBarSearch").unbind();

        }

        // Initiate process commands and add commands to overflow on load
        let newOverFlowCommands = this._processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
        this._processOverflow(newOverFlowCommands, $OverflowCommand, $OverflowMenu);
      });

      // Hook up contextual menu
      $OverflowCommand.click(function(): void {
        $OverflowMenu.toggleClass("is-open");
      });

      $OverflowCommand.focusout(function(): void {
        $OverflowMenu.removeClass("is-open");
      });

      $SearchBox.find(".ms-CommandBarSearch-input").click(function(): void {
        $(this).closest(".ms-CommandBarSearch").addClass("is-active");
      });

      $SearchBox.find(".ms-CommandBarSearch-input").on("focus", function(): void {
        $(this).closest(".ms-CommandBarSearch").addClass("is-active");
      });

       // When clicking the x clear the SearchBox and put state back to normal
      $SearchBox.find(".ms-CommandBarSearch-iconClearWrapper").click(function(): void {
        let $input = $(this).parent().find(".ms-CommandBarSearch-input");
        $input.val("");
        $input.parent().removeClass("is-active");
      });

      $SearchBox.parent().find(".ms-CommandBarSearch-input").blur(function(): void {
        let $input = $(this);
        $input.val("");
        $input.parent().removeClass("is-active");
      });
    }

    private _createMenuItem(text: string): string {
      let item = "<li class='ms-ContextualMenu-item'><a class='ms-ContextualMenu-link' href='#'>";
      item += text;
      item += "</a></li>";
      return item;
    }

    private _saveCommands($commands: JQuery, $commandWidth: number, $commandarea: JQuery): Array<CommandItem> {
      let commands = [];
      $commands.each(function() {
        let $Item = $(this);
        // Added padding of 10
        let $rightOffset = ($Item.position().left + $Item.outerWidth() + $commandWidth + 10) - $commandarea.position().left;
        commands.push( new CommandItem( $Item, $rightOffset) );
      });

      return commands;
    }

    private _processCommands(commands: Array<CommandItem>, width: number, overflowwidth: number): Array<JQuery> {
      let overFlowCommands = [];

      for (let i = 0; i < commands.length; i++) {
        let $Item = commands[i].jquery;
        let rightOffset = commands[i].rightOffset;

        // If the command is outside the right boundaries add to overflow items
        if (!$Item.hasClass("ms-CommandBarItem-overflow")) {
          if ((rightOffset + overflowwidth) > width) {
            overFlowCommands.push($Item);
          } else {
            // Make sure item is displayed
            $Item.removeClass("is-hidden");
          }
        }
      }
      return overFlowCommands;
    }

    private _processOverflow(overFlowCommands: Array<JQuery>, $oCommand: JQuery, $menu: JQuery): void {
      let overflowStrings = "";

      if (overFlowCommands.length > 0) {
        $oCommand.addClass("is-visible");
        // Empty menu
        $menu.html("");

        // Add overflowed commands to ContextualMenu
        for (let i = 0; i < overFlowCommands.length; i++) {
          let $Item = $(overFlowCommands[i]);
          // Hide Element in CommandBar
          $Item.addClass("is-hidden");
          let commandBarItemText = $Item.find(".ms-CommandBarItem-commandText").text();
          overflowStrings += this._createMenuItem(commandBarItemText);
        }
        $menu.html(overflowStrings);
      } else {
        $oCommand.removeClass("is-visible");
      }
    }
  } // end CommandBar
} // end fabric namespace
