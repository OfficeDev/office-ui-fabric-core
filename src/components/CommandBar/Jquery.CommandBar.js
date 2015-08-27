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
	  		var $rightOffset = ($Item.offset().left + $Item.outerWidth() + $commandWidth + 10) - $commandarea.offset().left; // Added padding of 10
		  	commands.push({ jquery: $Item, rightOffset: $rightOffset});
	  	});
	  	return commands;
  	}

  	var processCommands = function(commands, width) {
  		var overFlowCommands = [];
  		for(var i=0; i < commands.length; i++) {
  			var $Item = commands[i].jquery;
	  		var rightOffset = commands[i].rightOffset;
  			// If the command is outside the right boundaries add to overflow items
	  		if(!$Item.hasClass('ms-CommandBarItem-overflow')) {
		  		if(rightOffset > width) {
		  			overFlowCommands.push($Item);
		  		} else {
		  			// Make sure item is displayed
		  			$Item.removeClass('hideCommand');
		  		}
		  	}
  		}
	  	return overFlowCommands;
  	}

  	var processOverflow = function(overFlowCommands, $oCommand, $menu) {
  		var overflowStrings = '';
  		if(overFlowCommands.length > 0) {
  			$oCommand.addClass("showOverflow");
  			// Empty menu
  			$menu.html('');
  			// Add overflowed commands to ContextualMenu
  			for(i=0; i < overFlowCommands.length; i++) {
  				var $Item = $(overFlowCommands[i]);
  				// Hide Element in CommandBar
  				$Item.addClass('hideCommand');
  				var commandBarItemText = $Item.find('.ms-CommandBarItem-commandText').text();
  				overflowStrings += createMenuItem(commandBarItemText);
  			}
  			$menu.html(overflowStrings);
  		} else {
  			$oCommand.removeClass("showOverflow");
  		}
  	}

    /** Go through each CommandBar we've been given. */
    return this.each(function () {
	    var $CommandBar = $(this);
	    var $CommandMainArea = $CommandBar.find('.ms-CommandBar-mainArea');
	    var $CommandBarItems = $CommandMainArea.find('.ms-CommandBarItem');
	    var $OverflowCommand = $CommandBar.find('.ms-CommandBarItem-overflow');
	    var $OverflowCommandWidth = $CommandBar.find('.ms-CommandBarItem-overflow').outerWidth();
	    var $OverflowMenu = $CommandBar.find('.ms-CommandBar-overflowMenu');
	    var $SearchBox = $CommandBar.find('.ms-CommandSearch');
	    var mobileSwitch = false;
	    var overFlowCommands;
	    var allCommands;

	    // Go through process and save commands
	    allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

	    // Initiate process commands and add commands to overflow on load
	    overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth());
	    processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

	    // Add resize event handler on commandBar
	    $(window).resize(function() {
	    	var overFlowCommands;
	    	overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth());
	    	processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);
	    	if($(window).width() < 640 && mobileSwitch == false) {
	    		allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);
	    		mobileSwitch = true;
	    	} else if($(window).width() > 639 && mobileSwitch == true) {
	    		allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);
	    		mobileSwitch = false;
	    	}
	    });

	    // Hook up contextual menu
	    $OverflowCommand.click(function() {
	    	$OverflowMenu.toggleClass('is-open');
	    });

	    $SearchBox.find('.ms-CommandSearch-input').click(function() {
	    	$(this).closest('.ms-CommandSearch').addClass('ms-CommandSearch--active');
	    });

	     $SearchBox.keypress(function() {
	     	//Get Search Field
	     	var $input = $(this).find('.ms-CommandSearch-input');
	    	if($input.val()) {
	    		$(this).addClass('ms-CommandSearch--hasText');
	    	} else {
	    		$(this).removeClass('ms-CommandSearch--hasText');
	    	}
	    });

	    $SearchBox.find('.ms-CommandSearch-iconClearWrapper').click(function() {
	     	var $input = $(this).parent().find('.ms-CommandSearch-input');
	     	$input.val('');
	     	$input.parent().removeClass('ms-CommandSearch--hasText ms-CommandSearch--active');
	    });
		
    });
  };
})(jQuery);