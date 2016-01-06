// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Command Bar Plugin
 */

(function ($) {
  $.fn.CommandBar = function () {

    var createMenuItem = function(text, icon, link) {
      var item = '<li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link"" href="#">';
        item += text;
        item += '</a></li>';
        
      return item;
    }

    var saveCommands = function($commands, $commandWidth, $commandarea) {
      var commands = [];
      $commands.each(function(index) {
        var $Item = $(this);
        var $rightOffset = ($Item.position().left + $Item.outerWidth() + $commandWidth + 10) - $commandarea.position().left; // Added padding of 10
        commands.push({ jquery: $Item, rightOffset: $rightOffset});
        console.log($Item.outerWidth(), index, $commandarea.position().left, $Item.position().left);
      });

      return commands;
    }

    var processCommands = function(commands, width, overflowwidth) {
        var overFlowCommands = [];

        for(var i=0; i < commands.length; i++) {
          var $Item = commands[i].jquery;
          var rightOffset = commands[i].rightOffset;
          
          // If the command is outside the right boundaries add to overflow items
          if(!$Item.hasClass('ms-CommandBarItem-overflow')) {
            if((rightOffset + overflowwidth) > width) {
              overFlowCommands.push($Item);
            } else {
              // Make sure item is displayed
              $Item.removeClass('is-hidden');
            }
          }
        }
        return overFlowCommands;
    }

    var processOverflow = function(overFlowCommands, $oCommand, $menu) {
        var overflowStrings = '';

        if(overFlowCommands.length > 0) {
          $oCommand.addClass("is-visible");
          // Empty menu
          $menu.html('');

          // Add overflowed commands to ContextualMenu
          for(i = 0; i < overFlowCommands.length; i++) {
            var $Item = $(overFlowCommands[i]);
            // Hide Element in CommandBar
            $Item.addClass('is-hidden');
            var commandBarItemText = $Item.find('.ms-CommandBarItem-commandText').text();
            overflowStrings += createMenuItem(commandBarItemText);
          }
          $menu.html(overflowStrings);
        } else {
          $oCommand.removeClass("is-visible");
        }
    }

    /** Go through each CommandBar we've been given. */
    return this.each(function () {
      var $CommandBar = $(this);
      var $CommandMainArea = $CommandBar.find('.ms-CommandBar-mainArea');
      var $CommandBarItems = $CommandMainArea.find('.ms-CommandBarItem').not('.ms-CommandBarItem-overflow');
      var $OverflowCommand = $CommandBar.find('.ms-CommandBarItem-overflow');
      var $OverflowCommandWidth = $CommandBar.find('.ms-CommandBarItem-overflow').outerWidth();
      var $OverflowMenu = $CommandBar.find('.ms-CommandBar-overflowMenu');
      var $SearchBox = $CommandBar.find('.ms-CommandBarSearch');
      var mobileSwitch = false;
      var overFlowCommands;
      var allCommands;

      // Go through process and save commands
      allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

      // Initiate process commands and add commands to overflow on load
      overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
      processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

      // Set Search Behavior
      if($(window).width() < 640) { 

        $('.ms-CommandBarSearch-iconSearchWrapper').click(function() {
          $(this).closest('.ms-CommandBarSearch').addClass('is-active');
        });

      }

      // Add resize event handler on commandBar
      $(window).resize(function() {
        var overFlowCommands;

        if($(window).width() < 640 && mobileSwitch == false) {

          console.log("Switching to mobile");

          // Go through process and save commands
          allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);
         
          mobileSwitch = true;

          // Search Behavior
          $('.ms-CommandBarSearch-iconSearchWrapper').unbind();
          $('.ms-CommandBarSearch-iconSearchWrapper').click(function() {
            $(this).closest('.ms-CommandBarSearch').addClass('is-active');
          });

        } else if($(window).width() > 639 && mobileSwitch == true) {

          console.log("Switching to Desktop");

          // Go through process and save commands
          allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

          mobileSwitch = false;
          $('.ms-CommandBarSearch').unbind();

        } 

        console.log(allCommands, $CommandMainArea.innerWidth());

        // Initiate process commands and add commands to overflow on load
        overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
        processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);
      
      });

      // Hook up contextual menu
      $OverflowCommand.click(function() {
        $OverflowMenu.toggleClass('is-open');
      });

      $OverflowCommand.focusout(function() {
        $OverflowMenu.removeClass('is-open');
      });

      $SearchBox.find('.ms-CommandBarSearch-input').click(function() {
        $(this).closest('.ms-CommandBarSearch').addClass('is-active');
      });

      $SearchBox.find('.ms-CommandBarSearch-input').on('focus', function() {
        $(this).closest('.ms-CommandBarSearch').addClass('is-active');
      });

       // When clicking the x clear the SearchBox and put state back to normal
      $SearchBox.find('.ms-CommandBarSearch-iconClearWrapper').click(function() {
        var $input = $(this).parent().find('.ms-CommandBarSearch-input');
        $input.val('');
        $input.parent().removeClass('is-active');
      });

      $SearchBox.parent().find('.ms-CommandBarSearch-input').blur(function() {
        var $input = $(this);
        $input.val('');
        $input.parent().removeClass('is-active');
      });

    });
  };
})(jQuery);