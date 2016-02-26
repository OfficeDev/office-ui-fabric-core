// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

// @TODO - we can add this once jquery is removed
// "use strict";

// @TODO - this could be done through nuget, but may not be needed since this should be temporary until we remove jquery completely
/// <reference path="../../../typings/jquery.d.ts"/>

module fabric {

  /**
   * Command Bar Plugin
   */
  export class CommandBar {
    public createMenuItem(text) {
      let item = "<li class='ms-ContextualMenu-item'><a class='ms-ContextualMenu-link' href='#'>";
      item += text;
      item += "</a></li>";
      return item;
    }

    public saveCommands($commands, $commandWidth, $commandarea) {
      let commands = [];
      $commands.each(function() {
        let $Item = $(this);
        // Added padding of 10
        let $rightOffset = ($Item.position().left + $Item.outerWidth() + $commandWidth + 10) - $commandarea.position().left;
        commands.push({ jquery: $Item, rightOffset: $rightOffset});
      });

      return commands;
    }

    public processCommands(commands, width, overflowwidth) {
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

    public processOverflow(overFlowCommands, $oCommand, $menu) {
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
          overflowStrings += this.createMenuItem(commandBarItemText);
        }
        $menu.html(overflowStrings);
      } else {
        $oCommand.removeClass("is-visible");
      }
    }

    constructor(container: any) {
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
      allCommands = this.saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

      // Initiate process commands and add commands to overflow on load
      overFlowCommands = this.processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
      this.processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

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
          allCommands = this.saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

          mobileSwitch = true;

          // Search Behavior
          $(".ms-CommandBarSearch-iconSearchWrapper").unbind();
          $(".ms-CommandBarSearch-iconSearchWrapper").click(function() {
            $(this).closest(".ms-CommandBarSearch").addClass("is-active");
          });

        } else if ($(window).width() > 639 && mobileSwitch === true) {
          // Go through process and save commands
          allCommands = this.saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

          mobileSwitch = false;
          $(".ms-CommandBarSearch").unbind();

        }

        // Initiate process commands and add commands to overflow on load
        let newOverFlowCommands = this.processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
        this.processOverflow(newOverFlowCommands, $OverflowCommand, $OverflowMenu);
      });

      // Hook up contextual menu
      $OverflowCommand.click(function() {
        $OverflowMenu.toggleClass("is-open");
      });

      $OverflowCommand.focusout(function() {
        $OverflowMenu.removeClass("is-open");
      });

      $SearchBox.find(".ms-CommandBarSearch-input").click(function() {
        $(this).closest(".ms-CommandBarSearch").addClass("is-active");
      });

      $SearchBox.find(".ms-CommandBarSearch-input").on("focus", function() {
        $(this).closest(".ms-CommandBarSearch").addClass("is-active");
      });

       // When clicking the x clear the SearchBox and put state back to normal
      $SearchBox.find(".ms-CommandBarSearch-iconClearWrapper").click(function() {
        let $input = $(this).parent().find(".ms-CommandBarSearch-input");
        $input.val("");
        $input.parent().removeClass("is-active");
      });

      $SearchBox.parent().find(".ms-CommandBarSearch-input").blur(function() {
        let $input = $(this);
        $input.val("");
        $input.parent().removeClass("is-active");
      });
    }
  }
} // end fabric namespace
