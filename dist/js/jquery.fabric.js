//Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Breadcrumb component
 *
 * Shows the user's current location in a hierarchy and provides a means of navigating upward.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of Breadcrumb
 * @constructor
 *
 * If dynamically populating a list run the constructor after the list has been populated
 * in the DOM.
 */
fabric.Breadcrumb = function(container) {
  this.breadcrumb = container;
  this.breadcrumbList = container.querySelector('.ms-Breadcrumb-list');
  this.listItems = container.querySelectorAll('.ms-Breadcrumb-listItem');
  this.contextMenu = container.querySelector('.ms-ContextualMenu');
  this.overflowButton = container.querySelector('.ms-Breadcrumb-overflowButton');
  this.overflowMenu = container.querySelector('.ms-Breadcrumb-overflowMenu');
  this.itemCollection = [];
  this.currentMaxItems = 0;
  this.init();

};

fabric.Breadcrumb.prototype = (function() {

  //medium breakpoint
  var MEDIUM = 639;

  /**
   * initializes component
   */
  var init = function() {
    _setListeners.call(this);
    _createItemCollection.call(this);
    _onResize.call(this, null);
  };

  /**
   * Adds a breadcrumb item to a breadcrumb
   * @param itemLabel {String} the item's text label
   * @param itemLink {String} the item's href link
   * @param tabIndex {number} the item's tabIndex
   */
  var addItem = function(itemLabel, itemLink, tabIndex) {
    this.itemCollection.push({text: itemLabel, link: itemLink, tabIndex: tabIndex});
    _updateBreadcrumbs.call(this);
  };

  /**
   * Removes a breadcrumb item by item label in the breadcrumbs list
   * @param itemLabel {String} the item's text label
   */
  var removeItemByLabel = function(itemLabel) {
    var i = this.itemCollection.length;
    while (i--) {
      if (this.itemCollection[i].text === itemLabel) {
        this.itemCollection.splice(i, 1);
      }
    }
    _updateBreadcrumbs.call(this);
  };

  /**
   * removes a breadcrumb item by position in the breadcrumbs list
   * index starts at 0
   * @param itemLabel {String} the item's text label
   * @param itemLink {String} the item's href link
   * @param tabIndex {number} the item's tabIndex
   */
  var removeItemByPosition = function(value) {
    this.itemCollection.splice(value, 1);
    _updateBreadcrumbs.call(this);
  };

  /**
   * create internal model of list items from DOM
   */
  var _createItemCollection = function() {
    var length = this.listItems.length;
    var i = 0;
    var item;
    var text;
    var link;
    var tabIndex;

    for (i; i < length; i++) {
      item = this.listItems[i].querySelector('.ms-Breadcrumb-itemLink');
      text = item.textContent;
      link = item.getAttribute('href');
      tabIndex = parseInt(item.getAttribute('tabindex'), 10);
      this.itemCollection.push({text: text, link: link, tabIndex: tabIndex});
    }
  };

  /**
   * Re-render lists on resize
   *
   */
  var _onResize = function() {
    _closeOverflow.call(this, null);
    _renderListOnResize.call(this);
  };

  /**
   * render breadcrumbs and overflow menus on resize
   */
  var _renderListOnResize = function() {
    var maxItems = window.innerWidth > MEDIUM ? 4 : 2;
    if (maxItems !== this.currentMaxItems) {
      _updateBreadcrumbs.call(this);
    }

    this.currentMaxItems = maxItems;
  };

  /**
   * creates the overflow menu
   */
  var _addItemsToOverflow = function(maxItems) {
    _resetList.call(this, this.contextMenu);
    var end = this.itemCollection.length - maxItems;
    var overflowItems = this.itemCollection.slice(0, end);
    var contextMenu = this.contextMenu;
    overflowItems.forEach(function(item) {
      var li = document.createElement('li');
      li.className = 'ms-ContextualMenu-item';
      if(!isNaN(item.tabIndex)) {
        li.setAttribute('tabindex', item.tabIndex);
      }
      var a = document.createElement('a');
      a.className = 'ms-ContextualMenu-link';
      if (item.link !== null) {
        a.setAttribute('href', item.link);
      }
      a.textContent = item.text;
      li.appendChild(a);
      contextMenu.appendChild(li);
    });
  };

  /**
   * creates the breadcrumbs
   */
  var _addBreadcrumbItems = function(maxItems) {
    _resetList.call(this, this.breadcrumbList);
    var i = this.itemCollection.length - maxItems;
    i = i < 0 ? 0 : i;
    if (i >= 0) {
      for (i; i < this.itemCollection.length; i++) {
        var listItem = document.createElement('li');
        var item = this.itemCollection[i];
        var a = document.createElement('a');
        var chevron = document.createElement('i');
        listItem.className = 'ms-Breadcrumb-listItem';
        a.className = 'ms-Breadcrumb-itemLink';
        if (item.link !== null) {
          a.setAttribute('href', item.link);
        }
        if (!isNaN(item.tabIndex)) {
          a.setAttribute('tabindex', item.tabIndex);
        }
        a.textContent = item.text;
        chevron.className = 'ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight';
        listItem.appendChild(a);
        listItem.appendChild(chevron);
        this.breadcrumbList.appendChild(listItem);
      }
    }
  };

  /**
   * resets a list by removing its children
   */
  var _resetList = function(list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  };

  /**
   * opens the overflow menu
   */
  var _openOverflow = function(event) {
    if (this.overflowMenu.className.indexOf(' is-open') === -1) {
      this.overflowMenu.className += ' is-open';
      removeOutlinesOnClick.call(this, event);
      // force focus rect onto overflow button
      this.overflowButton.focus();
    }
  };

  var _overflowKeyPress = function(event) {
    if (event.keyCode === 13) {
      _openOverflow.call(this, event);
    }
  };

  /**
   * closes the overflow menu
   */
  var _closeOverflow = function(event) {
    if (!event || event.target !== this.overflowButton) {
      _removeClass.call(this, this.overflowMenu, ' is-open');
    }
  };

  /**
   * utility that removes a class from an element
   */
  var _removeClass = function (element, value) {
    var index = element.className.indexOf(value);
    if (index > -1) {
      element.className = element.className.substring(0, index);
    }
  };

  /**
   * sets handlers for resize and button click events
   */
  var _setListeners = function() {
    window.addEventListener('resize', _onResize.bind(this), false);
    document.addEventListener('click', _closeOverflow.bind(this), false);
    this.overflowButton.addEventListener('click', _openOverflow.bind(this), false);
    this.overflowButton.addEventListener('keypress', _overflowKeyPress.bind(this), false);
    this.breadcrumbList.addEventListener('click', removeOutlinesOnClick.bind(this), false);
  };

  /**
   * removes focus outlines so they don't linger after click
   */
  var removeOutlinesOnClick = function(event) {
    event.target.blur();
  };

  /**
   * updates the breadcrumbs and overflow menu
   */
  var _updateBreadcrumbs = function() {
    var maxItems = window.innerWidth > MEDIUM ? 4 : 2;
    if (this.itemCollection.length > maxItems) {
      this.breadcrumb.className += ' is-overflow';
    } else {
      _removeClass.call(this, this.breadcrumb, ' is-overflow');
    }

    _addBreadcrumbItems.call(this, maxItems);
    _addItemsToOverflow.call(this, maxItems);
  };

  return {
    init: init,
    addItem: addItem,
    removeItemByLabel: removeItemByLabel,
    removeItemByPosition: removeItemByPosition
  };

}());


// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Command Bar Plugin
 */

(function ($) {
  $.fn.CommandBar = function () {

    var createMenuItem = function(text) {
      var item = '<li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link"" href="#">';
        item += text;
        item += '</a></li>';
        
      return item;
    };

    var saveCommands = function($commands, $commandWidth, $commandarea) {
      var commands = [];
      $commands.each(function() {
        var $Item = $(this);
        var $rightOffset = ($Item.position().left + $Item.outerWidth() + $commandWidth + 10) - $commandarea.position().left; // Added padding of 10
        commands.push({ jquery: $Item, rightOffset: $rightOffset});
      });

      return commands;
    };

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
    };

    var processOverflow = function(overFlowCommands, $oCommand, $menu) {
        var overflowStrings = '';

        if(overFlowCommands.length > 0) {
          $oCommand.addClass("is-visible");
          // Empty menu
          $menu.html('');

          // Add overflowed commands to ContextualMenu
          for(var i = 0; i < overFlowCommands.length; i++) {
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
    };

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

        if($(window).width() < 640 && mobileSwitch === false) {
          // Go through process and save commands
          allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);
         
          mobileSwitch = true;

          // Search Behavior
          $('.ms-CommandBarSearch-iconSearchWrapper').unbind();
          $('.ms-CommandBarSearch-iconSearchWrapper').click(function() {
            $(this).closest('.ms-CommandBarSearch').addClass('is-active');
          });

        } else if($(window).width() > 639 && mobileSwitch === true) {
          // Go through process and save commands
          allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

          mobileSwitch = false;
          $('.ms-CommandBarSearch').unbind();

        }

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
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Contextual Menu Plugin
 */
(function ($) {
  $.fn.ContextualMenu = function () {

    /** Go through each nav bar we've been given. */
    return this.each(function () {

      var $contextualMenu = $(this);


      // Set selected states.
      $contextualMenu.on('click', '.ms-ContextualMenu-link:not(.is-disabled)', function(event) {
        event.preventDefault();

        // Check if multiselect - set selected states
        if ( $contextualMenu.hasClass('ms-ContextualMenu--multiselect') ) {

          // If already selected, remove selection; if not, add selection
          if ( $(this).hasClass('is-selected') ) {
            $(this).removeClass('is-selected');
          }
          else {
            $(this).addClass('is-selected');
          }

        }
        // All other contextual menu variants
        else {

          // Deselect all of the items and close any menus.
          $('.ms-ContextualMenu-link')
              .removeClass('is-selected')
              .siblings('.ms-ContextualMenu')
              .removeClass('is-open');

          // Select this item.
          $(this).addClass('is-selected');

          // If this item has a menu, open it.
          if ($(this).hasClass('ms-ContextualMenu-link--hasMenu')) {
            $(this).siblings('.ms-ContextualMenu:first').addClass('is-open');

            // Open the menu without bubbling up the click event,
            // which can cause the menu to close.
            event.stopPropagation();
          }

        }


      });

    });
  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

(function ($) {

  /**
   * DatePicker Plugin
   */

  $.fn.DatePicker = function (options) {

    return this.each(function () {

      /** Set up variables and run the Pickadate plugin. */
      var $datePicker = $(this);
      var $dateField = $datePicker.find('.ms-TextField-field').pickadate($.extend({
        // Strings and translations.
        weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

        // Don't render the buttons
        today: '',
        clear: '',
        close: '',

        // Events
        onStart: function() {
          initCustomView($datePicker);
        },

        // Classes
        klass: {

          // The element states
          input: 'ms-DatePicker-input',
          active: 'ms-DatePicker-input--active',

          // The root picker and states
          picker: 'ms-DatePicker-picker',
          opened: 'ms-DatePicker-picker--opened',
          focused: 'ms-DatePicker-picker--focused',

          // The picker holder
          holder: 'ms-DatePicker-holder',

          // The picker frame, wrapper, and box
          frame: 'ms-DatePicker-frame',
          wrap: 'ms-DatePicker-wrap',
          box: 'ms-DatePicker-dayPicker',

          // The picker header
          header: 'ms-DatePicker-header',

          // Month & year labels
          month: 'ms-DatePicker-month',
          year: 'ms-DatePicker-year',

          // Table of dates
          table: 'ms-DatePicker-table',

          // Weekday labels
          weekdays: 'ms-DatePicker-weekday',

          // Day states
          day: 'ms-DatePicker-day',
          disabled: 'ms-DatePicker-day--disabled',
          selected: 'ms-DatePicker-day--selected',
          highlighted: 'ms-DatePicker-day--highlighted',
          now: 'ms-DatePicker-day--today',
          infocus: 'ms-DatePicker-day--infocus',
          outfocus: 'ms-DatePicker-day--outfocus',

        }
      },options||{}));
      var $picker = $dateField.pickadate('picker');

      /** Respond to built-in picker events. */
      $picker.on({
        render: function() {
          updateCustomView($datePicker);
        },
        open: function() {
          scrollUp($datePicker);
        }
      });

    });
  };

  /**
   * After the Pickadate plugin starts, this function
   * adds additional controls to the picker view.
   */
  function initCustomView($datePicker) {

    /** Get some variables ready. */
    var $monthControls = $datePicker.find('.ms-DatePicker-monthComponents');
    var $goToday = $datePicker.find('.ms-DatePicker-goToday');
    var $monthPicker = $datePicker.find('.ms-DatePicker-monthPicker');
    var $yearPicker = $datePicker.find('.ms-DatePicker-yearPicker');
    var $pickerWrapper = $datePicker.find('.ms-DatePicker-wrap');
    var $picker = $datePicker.find('.ms-TextField-field').pickadate('picker');

    /** Move the month picker into position. */
    $monthControls.appendTo($pickerWrapper);
    $goToday.appendTo($pickerWrapper);
    $monthPicker.appendTo($pickerWrapper);
    $yearPicker.appendTo($pickerWrapper);

    /** Update the custom view. */
    updateCustomView($datePicker);

    /** Move back one month. */
    $monthControls.on('click', '.js-prevMonth', function(event) {
      event.preventDefault();
      var newMonth = $picker.get('highlight').month - 1;
      changeHighlightedDate($picker, null, newMonth, null);
    });

    /** Move ahead one month. */
    $monthControls.on('click', '.js-nextMonth', function(event) {
      event.preventDefault();
      var newMonth = $picker.get('highlight').month + 1;
      changeHighlightedDate($picker, null, newMonth, null);
    });

    /** Move back one year. */
    $monthPicker.on('click', '.js-prevYear', function(event) {
      event.preventDefault();
      var newYear = $picker.get('highlight').year - 1;
      changeHighlightedDate($picker, newYear, null, null);
    });

    /** Move ahead one year. */
    $monthPicker.on('click', '.js-nextYear', function(event) {
      event.preventDefault();
      var newYear = $picker.get('highlight').year + 1;
      changeHighlightedDate($picker, newYear, null, null);
    });

    /** Move back one decade. */
    $yearPicker.on('click', '.js-prevDecade', function(event) {
      event.preventDefault();
      var newYear = $picker.get('highlight').year - 10;
      changeHighlightedDate($picker, newYear, null, null);
    });

    /** Move ahead one decade. */
    $yearPicker.on('click', '.js-nextDecade', function(event) {
      event.preventDefault();
      var newYear = $picker.get('highlight').year + 10;
      changeHighlightedDate($picker, newYear, null, null);
    });

    /** Go to the current date, shown in the day picking view. */
    $goToday.click(function(event) {
      event.preventDefault();

      /** Select the current date, while keeping the picker open. */
      var now = new Date();
      $picker.set('select', [now.getFullYear(), now.getMonth(), now.getDate()]);

      /** Switch to the default (calendar) view. */
      $datePicker.removeClass('is-pickingMonths').removeClass('is-pickingYears');

    });

    /** Change the highlighted month. */
    $monthPicker.on('click', '.js-changeDate', function(event) {
      event.preventDefault();

      /** Get the requested date from the data attributes. */
      var newYear = $(this).attr('data-year');
      var newMonth = $(this).attr('data-month');
      var newDay = $(this).attr('data-day');

      /** Update the date. */
      changeHighlightedDate($picker, newYear, newMonth, newDay);

      /** If we've been in the "picking months" state on mobile, remove that state so we show the calendar again. */
      if ($datePicker.hasClass('is-pickingMonths')) {
        $datePicker.removeClass('is-pickingMonths');
      }
    });

    /** Change the highlighted year. */
    $yearPicker.on('click', '.js-changeDate', function(event) {
      event.preventDefault();

      /** Get the requested date from the data attributes. */
      var newYear = $(this).attr('data-year');
      var newMonth = $(this).attr('data-month');
      var newDay = $(this).attr('data-day');

      /** Update the date. */
      changeHighlightedDate($picker, newYear, newMonth, newDay);

      /** If we've been in the "picking years" state on mobile, remove that state so we show the calendar again. */
      if ($datePicker.hasClass('is-pickingYears')) {
        $datePicker.removeClass('is-pickingYears');
      }
    });

    /** Switch to the default state. */
    $monthPicker.on('click', '.js-showDayPicker', function() {
      $datePicker.removeClass('is-pickingMonths');
      $datePicker.removeClass('is-pickingYears');
    });

    /** Switch to the is-pickingMonths state. */
    $monthControls.on('click', '.js-showMonthPicker', function() {
      $datePicker.toggleClass('is-pickingMonths');
    });

    /** Switch to the is-pickingYears state. */
    $monthPicker.on('click', '.js-showYearPicker', function() {
      $datePicker.toggleClass('is-pickingYears');
    });

  }

  /** Change the highlighted date. */
  function changeHighlightedDate($picker, newYear, newMonth, newDay) {

    /** All letiables are optional. If not provided, default to the current value. */
    if (typeof newYear === "undefined" || newYear === null) {
      newYear = $picker.get("highlight").year;
    }
    if (typeof newMonth === "undefined" || newMonth === null) {
      newMonth = $picker.get("highlight").month;
    }
    if (typeof newDay === "undefined" || newDay === null) {
      newDay = $picker.get("highlight").date;
    }

    /** Update it. */
    $picker.set('highlight', [newYear, newMonth, newDay]);

  }


  /** Whenever the picker renders, do our own rendering on the custom controls. */
  function updateCustomView($datePicker) {

    /** Get some variables ready. */
    var $monthPicker = $datePicker.find('.ms-DatePicker-monthPicker');
    var $yearPicker = $datePicker.find('.ms-DatePicker-yearPicker');
    var $picker = $datePicker.find('.ms-TextField-field').pickadate('picker');

    /** Set the correct year. */
    $monthPicker.find('.ms-DatePicker-currentYear').text($picker.get('view').year);

    /** Highlight the current month. */
    $monthPicker.find('.ms-DatePicker-monthOption').removeClass('is-highlighted');
    $monthPicker.find('.ms-DatePicker-monthOption[data-month="' + $picker.get('highlight').month + '"]').addClass('is-highlighted');

    /** Generate the grid of years for the year picker view. */

      // Start by removing any existing generated output. */
    $yearPicker.find('.ms-DatePicker-currentDecade').remove();
    $yearPicker.find('.ms-DatePicker-optionGrid').remove();

    // Generate the output by going through the years.
    var startingYear = $picker.get('highlight').year - 11;
    var decadeText = startingYear + " - " + (startingYear + 11);
    var output = '<div class="ms-DatePicker-currentDecade">' + decadeText + '</div>';
    output += '<div class="ms-DatePicker-optionGrid">';
    for (var year = startingYear; year < (startingYear + 12); year++) {
      output += '<span class="ms-DatePicker-yearOption js-changeDate" data-year="' + year + '">' + year +'</span>';
    }
    output += '</div>';

    // Output the title and grid of years generated above.
    $yearPicker.append(output);

    /** Highlight the current year. */
    $yearPicker.find('.ms-DatePicker-yearOption').removeClass('is-highlighted');
    $yearPicker.find('.ms-DatePicker-yearOption[data-year="' + $picker.get('highlight').year + '"]').addClass('is-highlighted');
  }
  
  /** Scroll the page up so that the field the date picker is attached to is at the top. */
  function scrollUp($datePicker) {
    $('html, body').animate({
      scrollTop: $datePicker.offset().top
    }, 367);
  }

})(jQuery);

!function(a){"function"==typeof define&&define.amd?define("picker",["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):this.Picker=a(jQuery)}(function(a){function b(f,g,h,k){function l(){return b._.node("div",b._.node("div",b._.node("div",b._.node("div",w.component.nodes(r.open),t.box),t.wrap),t.frame),t.holder)}function m(){u.data(g,w).addClass(t.input).val(u.data("value")?w.get("select",s.format):f.value).on("focus."+r.id+" click."+r.id,p),s.editable||u.on("keydown."+r.id,function(a){var b=a.keyCode,c=/^(8|46)$/.test(b);return 27==b?(w.close(),!1):void((32==b||c||!r.open&&w.component.key[b])&&(a.preventDefault(),a.stopPropagation(),c?w.clear().close():w.open()))}),e(f,{haspopup:!0,expanded:!1,readonly:!1,owns:f.id+"_root"+(w._hidden?" "+w._hidden.id:"")})}function n(){w.$root.on({focusin:function(a){w.$root.removeClass(t.focused),a.stopPropagation()},"mousedown click":function(b){var c=b.target;c!=w.$root.children()[0]&&(b.stopPropagation(),"mousedown"!=b.type||a(c).is(":input")||"OPTION"==c.nodeName||(b.preventDefault(),f.focus()))}}).on("click","[data-pick], [data-nav], [data-clear], [data-close]",function(){var b=a(this),c=b.data(),d=b.hasClass(t.navDisabled)||b.hasClass(t.disabled),e=document.activeElement;e=e&&(e.type||e.href)&&e,(d||e&&!a.contains(w.$root[0],e))&&f.focus(),!d&&c.nav?w.set("highlight",w.component.item.highlight,{nav:c.nav}):!d&&"pick"in c?w.set("select",c.pick).close(!0):c.clear?w.clear().close(!0):c.close&&w.close(!0)}),e(w.$root[0],"hidden",!0)}function o(){var b;s.hiddenName===!0?(b=f.name,f.name=""):(b=["string"==typeof s.hiddenPrefix?s.hiddenPrefix:"","string"==typeof s.hiddenSuffix?s.hiddenSuffix:"_submit"],b=b[0]+f.name+b[1]),w._hidden=a('<input type=hidden name="'+b+'"'+(u.data("value")||f.value?' value="'+w.get("select",s.formatSubmit)+'"':"")+">")[0],u.on("change."+r.id,function(){w._hidden.value=f.value?w.get("select",s.formatSubmit):""}).after(w._hidden)}function p(a){a.stopPropagation(),"focus"==a.type&&w.$root.addClass(t.focused),w.open()}if(!f)return b;var q=!1,r={id:f.id||"P"+Math.abs(~~(Math.random()*new Date))},s=h?a.extend(!0,{},h.defaults,k):k||{},t=a.extend({},b.klasses(),s.klass),u=a(f),v=function(){return this.start()},w=v.prototype={constructor:v,$node:u,start:function(){return r&&r.start?w:(r.methods={},r.start=!0,r.open=!1,r.type=f.type,f.autofocus=f==document.activeElement,f.readOnly=!s.editable,f.id=f.id||r.id,"text"!=f.type&&(f.type="text"),w.component=new h(w,s),w.$root=a(b._.node("div",l(),t.picker,'id="'+f.id+'_root"')),n(),s.formatSubmit&&o(),m(),s.container?a(s.container).append(w.$root):u.after(w.$root),w.on({start:w.component.onStart,render:w.component.onRender,stop:w.component.onStop,open:w.component.onOpen,close:w.component.onClose,set:w.component.onSet}).on({start:s.onStart,render:s.onRender,stop:s.onStop,open:s.onOpen,close:s.onClose,set:s.onSet}),q=c(w.$root.children()[0]),f.autofocus&&w.open(),w.trigger("start").trigger("render"))},render:function(a){return a?w.$root.html(l()):w.$root.find("."+t.box).html(w.component.nodes(r.open)),w.trigger("render")},stop:function(){return r.start?(w.close(),w._hidden&&w._hidden.parentNode.removeChild(w._hidden),w.$root.remove(),u.removeClass(t.input).removeData(g),setTimeout(function(){u.off("."+r.id)},0),f.type=r.type,f.readOnly=!1,w.trigger("stop"),r.methods={},r.start=!1,w):w},open:function(c){return r.open?w:(u.addClass(t.active),e(f,"expanded",!0),setTimeout(function(){w.$root.addClass(t.opened),e(w.$root[0],"hidden",!1)},0),c!==!1&&(r.open=!0,q&&j.css("overflow","hidden").css("padding-right","+="+d()),u.trigger("focus"),i.on("click."+r.id+" focusin."+r.id,function(a){var b=a.target;b!=f&&b!=document&&3!=a.which&&w.close(b===w.$root.children()[0])}).on("keydown."+r.id,function(c){var d=c.keyCode,e=w.component.key[d],g=c.target;27==d?w.close(!0):g!=f||!e&&13!=d?a.contains(w.$root[0],g)&&13==d&&(c.preventDefault(),g.click()):(c.preventDefault(),e?b._.trigger(w.component.key.go,w,[b._.trigger(e)]):w.$root.find("."+t.highlighted).hasClass(t.disabled)||w.set("select",w.component.item.highlight).close())})),w.trigger("open"))},close:function(a){return a&&(u.off("focus."+r.id).trigger("focus"),setTimeout(function(){u.on("focus."+r.id,p)},0)),u.removeClass(t.active),e(f,"expanded",!1),setTimeout(function(){w.$root.removeClass(t.opened+" "+t.focused),e(w.$root[0],"hidden",!0)},0),r.open?(r.open=!1,q&&j.css("overflow","").css("padding-right","-="+d()),i.off("."+r.id),w.trigger("close")):w},clear:function(a){return w.set("clear",null,a)},set:function(b,c,d){var e,f,g=a.isPlainObject(b),h=g?b:{};if(d=g&&a.isPlainObject(c)?c:d||{},b){g||(h[b]=c);for(e in h)f=h[e],e in w.component.item&&(void 0===f&&(f=null),w.component.set(e,f,d)),("select"==e||"clear"==e)&&u.val("clear"==e?"":w.get(e,s.format)).trigger("change");w.render()}return d.muted?w:w.trigger("set",h)},get:function(a,c){if(a=a||"value",null!=r[a])return r[a];if("value"==a)return f.value;if(a in w.component.item){if("string"==typeof c){var d=w.component.get(a);return d?b._.trigger(w.component.formats.toString,w.component,[c,d]):""}return w.component.get(a)}},on:function(b,c,d){var e,f,g=a.isPlainObject(b),h=g?b:{};if(b){g||(h[b]=c);for(e in h)f=h[e],d&&(e="_"+e),r.methods[e]=r.methods[e]||[],r.methods[e].push(f)}return w},off:function(){var a,b,c=arguments;for(a=0,namesCount=c.length;namesCount>a;a+=1)b=c[a],b in r.methods&&delete r.methods[b];return w},trigger:function(a,c){var d=function(a){var d=r.methods[a];d&&d.map(function(a){b._.trigger(a,w,[c])})};return d("_"+a),d(a),w}};return new v}function c(a){var b,c="position";return a.currentStyle?b=a.currentStyle[c]:window.getComputedStyle&&(b=getComputedStyle(a)[c]),"fixed"==b}function d(){if(j.height()<=h.height())return 0;var b=a('<div style="visibility:hidden;width:100px" />').appendTo("body"),c=b[0].offsetWidth;b.css("overflow","scroll");var d=a('<div style="width:100%" />').appendTo(b),e=d[0].offsetWidth;return b.remove(),c-e}function e(b,c,d){if(a.isPlainObject(c))for(var e in c)f(b,e,c[e]);else f(b,c,d)}function f(a,b,c){a.setAttribute(("role"==b?"":"aria-")+b,c)}function g(b,c){a.isPlainObject(b)||(b={attribute:c}),c="";for(var d in b){var e=("role"==d?"":"aria-")+d,f=b[d];c+=null==f?"":e+'="'+b[d]+'"'}return c}var h=a(window),i=a(document),j=a(document.documentElement);return b.klasses=function(a){return a=a||"picker",{picker:a,opened:a+"--opened",focused:a+"--focused",input:a+"__input",active:a+"__input--active",holder:a+"__holder",frame:a+"__frame",wrap:a+"__wrap",box:a+"__box"}},b._={group:function(a){for(var c,d="",e=b._.trigger(a.min,a);e<=b._.trigger(a.max,a,[e]);e+=a.i)c=b._.trigger(a.item,a,[e]),d+=b._.node(a.node,c[0],c[1],c[2]);return d},node:function(b,c,d,e){return c?(c=a.isArray(c)?c.join(""):c,d=d?' class="'+d+'"':"",e=e?" "+e:"","<"+b+d+e+">"+c+"</"+b+">"):""},lead:function(a){return(10>a?"0":"")+a},trigger:function(a,b,c){return"function"==typeof a?a.apply(b,c||[]):a},digits:function(a){return/\d/.test(a[1])?2:1},isDate:function(a){return{}.toString.call(a).indexOf("Date")>-1&&this.isInteger(a.getUTCDate())},isInteger:function(a){return{}.toString.call(a).indexOf("Number")>-1&&a%1===0},ariaAttr:g},b.extend=function(c,d){a.fn[c]=function(e,f){var g=this.data(c);return"picker"==e?g:g&&"string"==typeof e?b._.trigger(g[e],g,[f]):this.each(function(){var f=a(this);f.data(c)||new b(this,c,d,e)})},a.fn[c].defaults=d.defaults},b}),function(a){"function"==typeof define&&define.amd?define(["picker","jquery"],a):"object"==typeof exports?module.exports=a(require("./picker.js"),require("jquery")):a(Picker,jQuery)}(function(a,b){function c(a,b){var c=this,d=a.$node[0],e=d.value,f=a.$node.data("value"),g=f||e,h=f?b.formatSubmit:b.format,i=function(){return d.currentStyle?"rtl"==d.currentStyle.direction:"rtl"==getComputedStyle(a.$root[0]).direction};c.settings=b,c.$node=a.$node,c.queue={min:"measure create",max:"measure create",now:"now create",select:"parse create validate",highlight:"parse navigate create validate",view:"parse create validate viewset",disable:"deactivate",enable:"activate"},c.item={},c.item.clear=null,c.item.disable=(b.disable||[]).slice(0),c.item.enable=-function(a){return a[0]===!0?a.shift():-1}(c.item.disable),c.set("min",b.min).set("max",b.max).set("now"),g?c.set("select",g,{format:h}):c.set("select",null).set("highlight",c.item.now),c.key={40:7,38:-7,39:function(){return i()?-1:1},37:function(){return i()?1:-1},go:function(a){var b=c.item.highlight,d=new Date(Date.UTC(b.year,b.month,b.date+a));c.set("highlight",d,{interval:a}),this.render()}},a.on("render",function(){a.$root.find("."+b.klass.selectMonth).on("change",function(){var c=this.value;c&&(a.set("highlight",[a.get("view").year,c,a.get("highlight").date]),a.$root.find("."+b.klass.selectMonth).trigger("focus"))}),a.$root.find("."+b.klass.selectYear).on("change",function(){var c=this.value;c&&(a.set("highlight",[c,a.get("view").month,a.get("highlight").date]),a.$root.find("."+b.klass.selectYear).trigger("focus"))})},1).on("open",function(){var d="";c.disabled(c.get("now"))&&(d=":not(."+b.klass.buttonToday+")"),a.$root.find("button"+d+", select").attr("disabled",!1)},1).on("close",function(){a.$root.find("button, select").attr("disabled",!0)},1)}var d=7,e=6,f=a._;c.prototype.set=function(a,b,c){var d=this,e=d.item;return null===b?("clear"==a&&(a="select"),e[a]=b,d):(e["enable"==a?"disable":"flip"==a?"enable":a]=d.queue[a].split(" ").map(function(e){return b=d[e](a,b,c)}).pop(),"select"==a?d.set("highlight",e.select,c):"highlight"==a?d.set("view",e.highlight,c):a.match(/^(flip|min|max|disable|enable)$/)&&(e.select&&d.disabled(e.select)&&d.set("select",e.select,c),e.highlight&&d.disabled(e.highlight)&&d.set("highlight",e.highlight,c)),d)},c.prototype.get=function(a){return this.item[a]},c.prototype.create=function(a,c,d){var e,g=this;return c=void 0===c?a:c,c==-1/0||1/0==c?e=c:b.isPlainObject(c)&&f.isInteger(c.pick)?c=c.obj:b.isArray(c)?(c=new Date(Date.UTC(c[0],c[1],c[2])),c=f.isDate(c)?c:g.create().obj):c=f.isInteger(c)?g.normalize(new Date(c),d):f.isDate(c)?g.normalize(c,d):g.now(a,c,d),{year:e||c.getUTCFullYear(),month:e||c.getUTCMonth(),date:e||c.getUTCDate(),day:e||c.getUTCDay(),obj:e||c,pick:e||c.getTime()}},c.prototype.createRange=function(a,c){var d=this,e=function(a){return a===!0||b.isArray(a)||f.isDate(a)?d.create(a):a};return f.isInteger(a)||(a=e(a)),f.isInteger(c)||(c=e(c)),f.isInteger(a)&&b.isPlainObject(c)?a=[c.year,c.month,c.date+a]:f.isInteger(c)&&b.isPlainObject(a)&&(c=[a.year,a.month,a.date+c]),{from:e(a),to:e(c)}},c.prototype.withinRange=function(a,b){return a=this.createRange(a.from,a.to),b.pick>=a.from.pick&&b.pick<=a.to.pick},c.prototype.overlapRanges=function(a,b){var c=this;return a=c.createRange(a.from,a.to),b=c.createRange(b.from,b.to),c.withinRange(a,b.from)||c.withinRange(a,b.to)||c.withinRange(b,a.from)||c.withinRange(b,a.to)},c.prototype.now=function(a,b,c){return b=new Date,c&&c.rel&&b.setUTCDate(b.getUTCDate()+c.rel),this.normalize(b,c)},c.prototype.navigate=function(a,c,d){var e,f,g,h,i=b.isArray(c),j=b.isPlainObject(c),k=this.item.view;if(i||j){for(j?(f=c.year,g=c.month,h=c.date):(f=+c[0],g=+c[1],h=+c[2]),d&&d.nav&&k&&k.month!==g&&(f=k.year,g=k.month),e=new Date(Date.UTC(f,g+(d&&d.nav?d.nav:0),1)),f=e.getUTCFullYear(),g=e.getUTCMonth();new Date(Date.UTC(f,g,h)).getUTCMonth()!==g;)h-=1;c=[f,g,h]}return c},c.prototype.normalize=function(a){return a.setUTCHours(0,0,0,0),a},c.prototype.measure=function(a,b){var c=this;return b?"string"==typeof b?b=c.parse(a,b):f.isInteger(b)&&(b=c.now(a,b,{rel:b})):b="min"==a?-1/0:1/0,b},c.prototype.viewset=function(a,b){return this.create([b.year,b.month,1])},c.prototype.validate=function(a,c,d){var e,g,h,i,j=this,k=c,l=d&&d.interval?d.interval:1,m=-1===j.item.enable,n=j.item.min,o=j.item.max,p=m&&j.item.disable.filter(function(a){if(b.isArray(a)){var d=j.create(a).pick;d<c.pick?e=!0:d>c.pick&&(g=!0)}return f.isInteger(a)}).length;if((!d||!d.nav)&&(!m&&j.disabled(c)||m&&j.disabled(c)&&(p||e||g)||!m&&(c.pick<=n.pick||c.pick>=o.pick)))for(m&&!p&&(!g&&l>0||!e&&0>l)&&(l*=-1);j.disabled(c)&&(Math.abs(l)>1&&(c.month<k.month||c.month>k.month)&&(c=k,l=l>0?1:-1),c.pick<=n.pick?(h=!0,l=1,c=j.create([n.year,n.month,n.date+(c.pick===n.pick?0:-1)])):c.pick>=o.pick&&(i=!0,l=-1,c=j.create([o.year,o.month,o.date+(c.pick===o.pick?0:1)])),!h||!i);)c=j.create([c.year,c.month,c.date+l]);return c},c.prototype.disabled=function(a){var c=this,d=c.item.disable.filter(function(d){return f.isInteger(d)?a.day===(c.settings.firstDay?d:d-1)%7:b.isArray(d)||f.isDate(d)?a.pick===c.create(d).pick:b.isPlainObject(d)?c.withinRange(d,a):void 0});return d=d.length&&!d.filter(function(a){return b.isArray(a)&&"inverted"==a[3]||b.isPlainObject(a)&&a.inverted}).length,-1===c.item.enable?!d:d||a.pick<c.item.min.pick||a.pick>c.item.max.pick},c.prototype.parse=function(a,b,c){var d=this,e={};return b&&"string"==typeof b?(c&&c.format||(c=c||{},c.format=d.settings.format),d.formats.toArray(c.format).map(function(a){var c=d.formats[a],g=c?f.trigger(c,d,[b,e]):a.replace(/^!/,"").length;c&&(e[a]=b.substr(0,g)),b=b.substr(g)}),[e.yyyy||e.yy,+(e.mm||e.m)-1,e.dd||e.d]):b},c.prototype.formats=function(){function a(a,b,c){var d=a.match(/\w+/)[0];return c.mm||c.m||(c.m=b.indexOf(d)+1),d.length}function b(a){return a.match(/\w+/)[0].length}return{d:function(a,b){return a?f.digits(a):b.date},dd:function(a,b){return a?2:f.lead(b.date)},ddd:function(a,c){return a?b(a):this.settings.weekdaysShort[c.day]},dddd:function(a,c){return a?b(a):this.settings.weekdaysFull[c.day]},m:function(a,b){return a?f.digits(a):b.month+1},mm:function(a,b){return a?2:f.lead(b.month+1)},mmm:function(b,c){var d=this.settings.monthsShort;return b?a(b,d,c):d[c.month]},mmmm:function(b,c){var d=this.settings.monthsFull;return b?a(b,d,c):d[c.month]},yy:function(a,b){return a?2:(""+b.year).slice(2)},yyyy:function(a,b){return a?4:b.year},toArray:function(a){return a.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g)},toString:function(a,b){var c=this;return c.formats.toArray(a).map(function(a){return f.trigger(c.formats[a],c,[0,b])||a.replace(/^!/,"")}).join("")}}}(),c.prototype.isDateExact=function(a,c){var d=this;return f.isInteger(a)&&f.isInteger(c)||"boolean"==typeof a&&"boolean"==typeof c?a===c:(f.isDate(a)||b.isArray(a))&&(f.isDate(c)||b.isArray(c))?d.create(a).pick===d.create(c).pick:b.isPlainObject(a)&&b.isPlainObject(c)?d.isDateExact(a.from,c.from)&&d.isDateExact(a.to,c.to):!1},c.prototype.isDateOverlap=function(a,c){var d=this,e=d.settings.firstDay?1:0;return f.isInteger(a)&&(f.isDate(c)||b.isArray(c))?(a=a%7+e,a===d.create(c).day+1):f.isInteger(c)&&(f.isDate(a)||b.isArray(a))?(c=c%7+e,c===d.create(a).day+1):b.isPlainObject(a)&&b.isPlainObject(c)?d.overlapRanges(a,c):!1},c.prototype.flipEnable=function(a){var b=this.item;b.enable=a||(-1==b.enable?1:-1)},c.prototype.deactivate=function(a,c){var d=this,e=d.item.disable.slice(0);return"flip"==c?d.flipEnable():c===!1?(d.flipEnable(1),e=[]):c===!0?(d.flipEnable(-1),e=[]):c.map(function(a){for(var c,g=0;g<e.length;g+=1)if(d.isDateExact(a,e[g])){c=!0;break}c||(f.isInteger(a)||f.isDate(a)||b.isArray(a)||b.isPlainObject(a)&&a.from&&a.to)&&e.push(a)}),e},c.prototype.activate=function(a,c){var d=this,e=d.item.disable,g=e.length;return"flip"==c?d.flipEnable():c===!0?(d.flipEnable(1),e=[]):c===!1?(d.flipEnable(-1),e=[]):c.map(function(a){var c,h,i,j;for(i=0;g>i;i+=1){if(h=e[i],d.isDateExact(h,a)){c=e[i]=null,j=!0;break}if(d.isDateOverlap(h,a)){b.isPlainObject(a)?(a.inverted=!0,c=a):b.isArray(a)?(c=a,c[3]||c.push("inverted")):f.isDate(a)&&(c=[a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate(),"inverted"]);break}}if(c)for(i=0;g>i;i+=1)if(d.isDateExact(e[i],a)){e[i]=null;break}if(j)for(i=0;g>i;i+=1)if(d.isDateOverlap(e[i],a)){e[i]=null;break}c&&e.push(c)}),e.filter(function(a){return null!=a})},c.prototype.nodes=function(a){var b=this,c=b.settings,g=b.item,h=g.now,i=g.select,j=g.highlight,k=g.view,l=g.disable,m=g.min,n=g.max,o=function(a,b){return c.firstDay&&(a.push(a.shift()),b.push(b.shift())),f.node("thead",f.node("tr",f.group({min:0,max:d-1,i:1,node:"th",item:function(d){return[a[d],c.klass.weekdays,'scope=col title="'+b[d]+'"']}})))}((c.showWeekdaysFull?c.weekdaysFull:c.weekdaysShort).slice(0),c.weekdaysFull.slice(0)),p=function(a){return f.node("div"," ",c.klass["nav"+(a?"Next":"Prev")]+(a&&k.year>=n.year&&k.month>=n.month||!a&&k.year<=m.year&&k.month<=m.month?" "+c.klass.navDisabled:""),"data-nav="+(a||-1)+" "+f.ariaAttr({role:"button",components:b.$node[0].id+"_table"})+' title="'+(a?c.labelMonthNext:c.labelMonthPrev)+'"')},q=function(){var d=c.showMonthsShort?c.monthsShort:c.monthsFull;return c.selectMonths?f.node("select",f.group({min:0,max:11,i:1,node:"option",item:function(a){return[d[a],0,"value="+a+(k.month==a?" selected":"")+(k.year==m.year&&a<m.month||k.year==n.year&&a>n.month?" disabled":"")]}}),c.klass.selectMonth,(a?"":"disabled")+" "+f.ariaAttr({components:b.$node[0].id+"_table"})+' title="'+c.labelMonthSelect+'"'):f.node("div",d[k.month],c.klass.month)},r=function(){var d=k.year,e=c.selectYears===!0?5:~~(c.selectYears/2);if(e){var g=m.year,h=n.year,i=d-e,j=d+e;if(g>i&&(j+=g-i,i=g),j>h){var l=i-g,o=j-h;i-=l>o?o:l,j=h}return f.node("select",f.group({min:i,max:j,i:1,node:"option",item:function(a){return[a,0,"value="+a+(d==a?" selected":"")]}}),c.klass.selectYear,(a?"":"disabled")+" "+f.ariaAttr({components:b.$node[0].id+"_table"})+' title="'+c.labelYearSelect+'"')}return f.node("div",d,c.klass.year)};return f.node("div",(c.selectYears?r()+q():q()+r())+p()+p(1),c.klass.header)+f.node("table",o+f.node("tbody",f.group({min:0,max:e-1,i:1,node:"tr",item:function(a){var e=c.firstDay&&0===b.create([k.year,k.month,1]).day?-7:0;return[f.group({min:d*a-k.day+e+1,max:function(){return this.min+d-1},i:1,node:"td",item:function(a){a=b.create([k.year,k.month,a+(c.firstDay?1:0)]);var d=i&&i.pick==a.pick,e=j&&j.pick==a.pick,g=l&&b.disabled(a)||a.pick<m.pick||a.pick>n.pick;return[f.node("div",a.date,function(b){return b.push(k.month==a.month?c.klass.infocus:c.klass.outfocus),h.pick==a.pick&&b.push(c.klass.now),d&&b.push(c.klass.selected),e&&b.push(c.klass.highlighted),g&&b.push(c.klass.disabled),b.join(" ")}([c.klass.day]),"data-pick="+a.pick+" "+f.ariaAttr({role:"gridcell",selected:d&&b.$node.val()===f.trigger(b.formats.toString,b,[c.format,a])?!0:null,activedescendant:e?!0:null,disabled:g?!0:null})),"",f.ariaAttr({role:"presentation"})]}})]}})),c.klass.table,'id="'+b.$node[0].id+'_table" '+f.ariaAttr({role:"grid",components:b.$node[0].id,readonly:!0}))+f.node("div",f.node("button",c.today,c.klass.buttonToday,"type=button data-pick="+h.pick+(a&&!b.disabled(h)?"":" disabled")+" "+f.ariaAttr({components:b.$node[0].id}))+f.node("button",c.clear,c.klass.buttonClear,"type=button data-clear=1"+(a?"":" disabled")+" "+f.ariaAttr({components:b.$node[0].id}))+f.node("button",c.close,c.klass.buttonClose,"type=button data-close=true "+(a?"":" disabled")+" "+f.ariaAttr({components:b.$node[0].id})),c.klass.footer)},c.defaults=function(a){return{labelMonthNext:"Next month",labelMonthPrev:"Previous month",labelMonthSelect:"Select a month",labelYearSelect:"Select a year",monthsFull:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],weekdaysFull:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],today:"Today",clear:"Clear",close:"Close",format:"d mmmm, yyyy",klass:{table:a+"table",header:a+"header",navPrev:a+"nav--prev",navNext:a+"nav--next",navDisabled:a+"nav--disabled",month:a+"month",year:a+"year",selectMonth:a+"select--month",selectYear:a+"select--year",weekdays:a+"weekday",day:a+"day",disabled:a+"day--disabled",selected:a+"day--selected",highlighted:a+"day--highlighted",now:a+"day--today",infocus:a+"day--infocus",outfocus:a+"day--outfocus",footer:a+"footer",buttonClear:a+"button--clear",buttonToday:a+"button--today",buttonClose:a+"button--close"}}}(a.klasses().picker+"__"),a.extend("pickadate",c)});

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Dialog Plugin
 *
 * Adds basic demonstration functionality to .ms-Dialog components.
 *
 * @param  {jQuery Object}  One or more .ms-Dialog components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Dialog = function () {

    /** Iterate through the sample buttons, which can be used to open the Dialogs. */
    $(".js-DialogAction--open").each(function () {
        /** Open the associated dialog on click. */
        $(this).on('click', function () {
          var target = $(this).data("target");
          $(target).show();
        });
    });


    return this.each(function () {
      var dialog = this;

      /** Have the dialogs hidden for their initial state */
      $(dialog).hide();

      /** Have the close buttons close the Dialog. */
      $(dialog).find(".js-DialogAction--close").each(function() {
        $(this).on('click', function () {
          $(dialog).hide();
        });
      });

      /** Have the action buttons close the Dialog, though you would usually do some specific action per button. */
      $(dialog).find(".ms-Dialog-action").on('click', function () {
        $(dialog).hide();
      });

    });
  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Dropdown Plugin
 *
 * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
 * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
 *
 * @param  {jQuery Object}  One or more .ms-Dropdown containers, each with a dropdown (.ms-Dropdown-select)
 * @return {jQuery Object}  The same containers (allows for chaining)
 */
(function ($) {
    $.fn.Dropdown = function () {

        /** Go through each dropdown we've been given. */
        return this.each(function () {

            var $dropdownWrapper = $(this),
                $originalDropdown = $dropdownWrapper.children('.ms-Dropdown-select'),
                $originalDropdownOptions = $originalDropdown.children('option'),
                newDropdownTitle = '',
                newDropdownItems = '',
                newDropdownSource = '';

            /** Go through the options to fill up newDropdownTitle and newDropdownItems. */
            $originalDropdownOptions.each(function (index, option) {

                /** If the option is selected, it should be the new dropdown's title. */
                if (option.selected) {
                    newDropdownTitle = option.text;
                }

                /** Add this option to the list of items. */
                newDropdownItems += '<li class="ms-Dropdown-item' + ( (option.disabled) ? ' is-disabled"' : '"' ) + '>' + option.text + '</li>';

            });

            /** Insert the replacement dropdown. */
            newDropdownSource = '<span class="ms-Dropdown-title">' + newDropdownTitle + '</span><ul class="ms-Dropdown-items">' + newDropdownItems + '</ul>';
            $dropdownWrapper.append(newDropdownSource);

            function _openDropdown(evt) {
                if (!$dropdownWrapper.hasClass('is-disabled')) {

                    /** First, let's close any open dropdowns on this page. */
                    $dropdownWrapper.find('.is-open').removeClass('is-open');

                    /** Stop the click event from propagating, which would just close the dropdown immediately. */
                    evt.stopPropagation();

                    /** Before opening, size the items list to match the dropdown. */
                    var dropdownWidth = $(this).parents(".ms-Dropdown").width();
                    $(this).next(".ms-Dropdown-items").css('width', dropdownWidth + 'px');

                    /** Go ahead and open that dropdown. */
                    $dropdownWrapper.toggleClass('is-open');
                    $('.ms-Dropdown').each(function(){
                        if ($(this)[0] !== $dropdownWrapper[0]) {
                            $(this).removeClass('is-open');
                        }
                    });

                    /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
                    $(document).bind("click.dropdown", function() {
                        $dropdownWrapper.removeClass('is-open');
                        $(document).unbind('click.dropdown');
                    });
                }
            }

            /** Toggle open/closed state of the dropdown when clicking its title. */
            $dropdownWrapper.on('click', '.ms-Dropdown-title', function(event) {
                _openDropdown(event);
            });

            /** Keyboard accessibility */
            $dropdownWrapper.on('keyup', function(event) {
                var keyCode = event.keyCode || event.which;
                // Open dropdown on enter or arrow up or arrow down and focus on first option
                if (!$(this).hasClass('is-open')) {
                    if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
                       _openDropdown(event);
                       if (!$(this).find('.ms-Dropdown-item').hasClass('is-selected')) {
                        $(this).find('.ms-Dropdown-item:first').addClass('is-selected');
                       }
                    }
                }
                else if ($(this).hasClass('is-open')) {
                    // Up arrow focuses previous option
                    if (keyCode === 38) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').prev().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').prev().addClass('is-selected');
                        }
                    }
                    // Down arrow focuses next option
                    if (keyCode === 40) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').next().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').next().addClass('is-selected');
                        }
                    }
                    // Enter to select item
                    if (keyCode === 13) {
                        if (!$dropdownWrapper.hasClass('is-disabled')) {

                            // Item text
                            var selectedItemText = $(this).find('.ms-Dropdown-item.is-selected').text();

                            $(this).find('.ms-Dropdown-title').html(selectedItemText);

                            /** Update the original dropdown. */
                            $originalDropdown.find("option").each(function(key, value) {
                                if (value.text === selectedItemText) {
                                    $(this).prop('selected', true);
                                } else {
                                    $(this).prop('selected', false);
                                }
                            });
                            $originalDropdown.change();

                            $(this).removeClass('is-open');
                        }
                    }
                }

                // Close dropdown on esc
                if (keyCode === 27) {
                    $(this).removeClass('is-open');
                }
            });

            /** Select an option from the dropdown. */
            $dropdownWrapper.on('click', '.ms-Dropdown-item', function () {
                if (!$dropdownWrapper.hasClass('is-disabled') && !$(this).hasClass('is-disabled')) {

                    /** Deselect all items and select this one. */
                    $(this).siblings('.ms-Dropdown-item').removeClass('is-selected');
                    $(this).addClass('is-selected');

                    /** Update the replacement dropdown's title. */
                    $(this).parents().siblings('.ms-Dropdown-title').html($(this).text());

                    /** Update the original dropdown. */
                    var selectedItemText = $(this).text();
                    $originalDropdown.find("option").each(function(key, value) {
                        if (value.text === selectedItemText) {
                            $(this).prop('selected', true);
                        } else {
                            $(this).prop('selected', false);
                        }
                    });
                    $originalDropdown.change();
                }
            });

        });
    };
})(jQuery);
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Facepile Plugin
 *
 * Adds basic demonstration functionality to .ms-Facepile components.
 *
 * @param  {jQuery Object}  One or more .ms-Facepile components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Facepile = function () {

    /** Iterate through each Facepile provided. */
    return this.each(function () {
      $('.ms-PeoplePicker').PeoplePicker();
      $('.ms-Panel').Panel();

      var $Facepile = $(this);    
      var $membersList = $(".ms-Facepile-members"); 
      var $membersCount = $(".ms-Facepile-members > .ms-Facepile-itemBtn").length;
      var $panel = $('.ms-Facepile-panel.ms-Panel');
      var $panelMain = $panel.find(".ms-Panel-main");
      var $picker = $('.ms-PeoplePicker.ms-PeoplePicker--Facepile');
      var $pickerMembers = $picker.find('.ms-PeoplePicker-selectedPeople');
      var $personaCard = $('.ms-Facepile').find('.ms-PersonaCard');


      /** Increment member count and show/hide overflow text */
      var incrementMembers = function() {
        /** Increment person count by one */
        $membersCount += 1;

        /** Display a maxiumum of 5 people */
        $(".ms-Facepile-members").children(":gt(4)").hide();

        /** Display counter after 5 people are present */
        if ($membersCount > 5) {
          $(".ms-Facepile-itemBtn--overflow").addClass("is-active");

          var remainingMembers = $membersCount - 5;
          $(".ms-Facepile-overflowText").text("+" + remainingMembers);
        }
      };

      /** Open panel with people picker */
      $Facepile.on("click", ".js-addPerson", function() {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open")
              .addClass("ms-Panel-animateIn")
              .removeClass('ms-Facepile-panel--overflow ms-Panel--right')
              .addClass('ms-Facepile-panel--addPerson');

        /** Close any open persona cards */
        $personaCard.removeClass('is-active').hide();
      });

      $panel.on("click", ".js-togglePanel", function() {
        $panel.toggleClass("is-open")
              .addClass("ms-Panel-animateIn");
      });

      /** Open oveflow panel with list of members */
      $Facepile.on("click", ".js-overflowPanel", function() {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open")
              .addClass("ms-Panel-animateIn")
              .removeClass('ms-Facepile-panel--addPerson')
              .addClass('ms-Facepile-panel--overflow ms-Panel--right');
      });

      /** Display person count on page load */
      $(document).ready(function() {
        $(".ms-Facepile-overflowText").text("+" + $membersCount);
      });

      /** Show selected members from PeoplePicker in the Facepile */
      $('.ms-PeoplePicker-result').on('click', function() {
        var $this = $(this);
        var name = $this.find(".ms-Persona-primaryText").html();
        var title = $this.find(".ms-Persona-secondaryText").html();
        var selectedInitials = (function() {
          var nameArray = name.split(' ');
          var nameInitials = '';
          for (var i = 0; i < nameArray.length; i++) {
            nameInitials += nameArray[i].charAt(0);
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

        var FacepileItem = 
          '<button class="ms-Facepile-itemBtn ms-Facepile-itemBtn--member" title="' + name + '">' +
            '<div class="ms-Persona ms-Persona--xs">' +
              '<div class="ms-Persona-imageArea">' +
                '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                selectedImage +
              '</div>' +
              '<div class="ms-Persona-presence"></div>' +
              '<div class="ms-Persona-details">' +
                '<div class="ms-Persona-primaryText">' + name + '</div>' +
                '<div class="ms-Persona-secondaryText">' + title + '</div>' +
              '</div>' +
            '</div>' +
          '</button>';

        /** Add new item to members list in Facepile */
        $membersList.prepend(FacepileItem);

        /** Increment member count */
        incrementMembers();
      });

      /** Remove members in panel people picker */
      $pickerMembers.on('click', '.js-selectedRemove', function() {
        var memberText = $(this).parent().find('.ms-Persona-primaryText').text();

        var $FacepileMember = $membersList.find(".ms-Persona-primaryText:contains(" + memberText + ")").first();

        if ($FacepileMember) {
          $FacepileMember.parent().closest('.ms-Facepile-itemBtn').remove();

          $membersCount -= 1;

           /** Display a maxiumum of 5 people */
           $(".ms-Facepile-members").children(":lt(5)").show();

          /** Display counter after 5 people are present */
          if ($membersCount <= 5) {
            $(".ms-Facepile-itemBtn--overflow").removeClass("is-active");
          } else {
            var remainingMembers = $membersCount - 5;
            $(".ms-Facepile-overflowText").text("+" + remainingMembers);
          }
        }
      });

      /** Show persona card when selecting a Facepile item */
      $membersList.on('click', '.ms-Facepile-itemBtn', function() {
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
        var $memberBtn = $('.ms-Facepile-itemBtn--member');

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
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * MessageBanner component
 *
 * A component to display error messages
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of MessageBanner
 * @constructor
 */
fabric.MessageBanner = function(container) {
    this.container = container;
    this.init();
};

fabric.MessageBanner.prototype = (function() {

    var _clipper;
    var _bufferSize;
    var _textContainerMaxWidth = 700;
    var _clientWidth;
    var _textWidth;
    var _initTextWidth;
    var _chevronButton;
    var _errorBanner;
    var _actionButton;
    var _closeButton;
    var _bufferElementsWidth = 88;
    var _bufferElementsWidthSmall = 35;
    var SMALL_BREAK_POINT = 480;

    /**
     * sets styles on resize
     */
    var _onResize = function() {
        _clientWidth = _errorBanner.offsetWidth;
        if(window.innerWidth >= SMALL_BREAK_POINT ) {
            _resizeRegular();
        } else {
            _resizeSmall();
        }
    };

    /**
     * resize above 480 pixel breakpoint
     */
    var _resizeRegular = function() {
        if ((_clientWidth - _bufferSize) > _initTextWidth && _initTextWidth < _textContainerMaxWidth) {
            _textWidth = "auto";
            _chevronButton.className = "ms-MessageBanner-expand";
            _collapse();
        } else {
            _textWidth = Math.min((_clientWidth - _bufferSize), _textContainerMaxWidth) + "px";
            if(_chevronButton.className.indexOf("is-visible") === -1) {
                _chevronButton.className += " is-visible";
            }
        }
        _clipper.style.width = _textWidth;
    };

    /**
     * resize below 480 pixel breakpoint
     */
    var _resizeSmall = function() {
        if (_clientWidth - (_bufferElementsWidthSmall + _closeButton.offsetWidth) > _initTextWidth) {
            _textWidth = "auto";
            _collapse();
        } else {
            _textWidth = (_clientWidth - (_bufferElementsWidthSmall + _closeButton.offsetWidth)) + "px";
        }
        _clipper.style.width = _textWidth;
    };
    /**
     * caches elements and values of the component
     */
    var _cacheDOM = function(context) {
        _errorBanner = context.container;
        _clipper = context.container.querySelector('.ms-MessageBanner-clipper');
        _chevronButton = context.container.querySelector('.ms-MessageBanner-expand');
        _actionButton = context.container.querySelector('.ms-MessageBanner-action');
        _bufferSize = _actionButton.offsetWidth + _bufferElementsWidth;
        _closeButton = context.container.querySelector('.ms-MessageBanner-close');
    };

    /**
     * expands component to show full error message
     */
    var _expand = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className += " is-expanded";
        icon.className = "ms-Icon ms-Icon--chevronsUp";
    };

    /**
     * collapses component to only show truncated message
     */
    var _collapse = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className = "ms-MessageBanner";
        icon.className = "ms-Icon ms-Icon--chevronsDown";
    };

    var _toggleExpansion = function() {
        if (_errorBanner.className.indexOf("is-expanded") > -1) {
            _collapse();
        } else {
            _expand();
        }
    };

    /**
     * hides banner when close button is clicked
     */
    var _hideBanner = function() {
        if(_errorBanner.className.indexOf("hide") === -1) {
            _errorBanner.className += " hide";
            setTimeout(function() {
                _errorBanner.className = "ms-MessageBanner is-hidden";
            }, 500);
        }
    };

    /**
     * shows banner if the banner is hidden
     */
    var _showBanner = function() {
        _errorBanner.className = "ms-MessageBanner";
    };

    /**
     * sets handlers for resize and button click events
     */
    var _setListeners = function() {
        window.addEventListener('resize', _onResize, false);
        _chevronButton.addEventListener("click", _toggleExpansion, false);
        _closeButton.addEventListener("click", _hideBanner, false);
    };

    /**
     * initializes component
     */
    var init = function() {
        _cacheDOM(this);
        _setListeners();
        _clientWidth = _errorBanner.offsetWidth;
        _initTextWidth = _clipper.offsetWidth;
        _onResize(null);
    };

    return {
        init: init,
        showBanner: _showBanner
    };
}());

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * List Item Plugin
 *
 * Adds basic demonstration functionality to .ms-ListItem components.
 *
 * @param  {jQuery Object}  One or more .ms-ListItem components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.ListItem = function () {

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $listItem = $(this);

      /** Detect clicks on selectable list items. */
      $listItem.on('click', '.js-toggleSelection', function() {
        $(this).parents('.ms-ListItem').toggleClass('is-selected');
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Nav Bar Plugin
 */
(function ($) {
  $.fn.NavBar = function () {

    /** Go through each nav bar we've been given. */
    return this.each(function () {

      var $navBar = $(this);

      // Open the nav bar on mobile.
      $navBar.on('click', '.js-openMenu', function(event) {
        event.stopPropagation();
        $navBar.toggleClass('is-open');
      });

      // Close the nav bar on mobile.
      $navBar.click(function() {
        if ($navBar.hasClass('is-open')) {
          $navBar.removeClass('is-open');
        }
      });

      // Set selected states and open/close menus.
      $navBar.on('click', '.ms-NavBar-item:not(.is-disabled)', function(event) {
        var $searchBox = $navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field');
        event.stopPropagation();

        // Prevent default actions from firing if links are not found.
        if ($(this).children('.ms-NavBar-link').length === 0) {
          event.preventDefault();
        }

        // Deselect all of the items.
        $(this).siblings('.ms-NavBar-item').removeClass('is-selected');

        // Close and blur the search box if it doesn't have text.
        if ($searchBox.length > 0 && $searchBox.val().length === 0) {
          $('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
        }

        // Does the selected item have a menu?
        if ($(this).hasClass('ms-NavBar-item--hasMenu')) {
          
          // First, close any neighboring menus.
          $(this).siblings('.ms-NavBar-item--hasMenu').children('.ms-ContextualMenu:first').removeClass('is-open');
          
          // Toggle 'is-open' to open or close it.
          $(this).children('.ms-ContextualMenu:first').toggleClass('is-open');

          // Toggle 'is-selected' to indicate whether it is active.
          $(this).toggleClass('is-selected');
        } else {
          // Doesn't have a menu, so just select the item.
          $(this).addClass('is-selected');

          // Close the submenu and any open contextual menus.
          $navBar.removeClass('is-open').find('.ms-ContextualMenu').removeClass('is-open');
        }

        // Is this the search box? Open it up and focus on the search field.
        if ($(this).hasClass('ms-NavBar-item--search')) {
          $(this).addClass('is-open');
          $(this).find('.ms-TextField-field').focus();

          // Close any open menus.
          $navBar.find('.ms-ContextualMenu:first').removeClass('is-open');
        }
      });

      // Prevent contextual menus from being hidden when clicking on them.
      $navBar.on('click', '.ms-NavBar-item .ms-ContextualMenu', function(event) {
        event.stopPropagation();

        // Collapse the mobile "panel" for nav items.
        $(this).removeClass('is-open');
        $navBar.removeClass('is-open').find('.ms-NavBar-item--hasMenu').removeClass('is-selected');
      });

      // Hide any menus and close the search box when clicking anywhere in the document.
      $(document).on('click', 'html', function() {
		var $searchBox = $navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field');  
        $navBar.find('.ms-NavBar-item').removeClass('is-selected').find('.ms-ContextualMenu').removeClass('is-open');

        // Close and blur the search box if it doesn't have text.
        if ($searchBox.length > 0 && $searchBox.val().length === 0) {
          $navBar.find('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
        }
      });
    });
  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Panel Plugin
 *
 * Adds basic demonstration functionality to .ms-Panel components.
 *
 * @param  {jQuery Object}  One or more .ms-Panel components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Panel = function () {

    var pfx = ["webkit", "moz", "MS", "o", ""];

    // Prefix function
    function prefixedEvent(element, type, callback) {
      for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) { type = type.toLowerCase(); }
        element.addEventListener(pfx[p]+type, callback, false);
      }
    }

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $panel = $(this);
      var $panelMain = $panel.find(".ms-Panel-main");

      /** Hook to open the panel. */
      $(".ms-PanelAction-close").on("click", function() {

        // Display Panel first, to allow animations
        $panel.addClass("ms-Panel-animateOut");

      });

      $(".ms-PanelAction-open").on("click", function() {

        // Display Panel first, to allow animations
        $panel.addClass("is-open");

        // Add animation class
        $panel.addClass("ms-Panel-animateIn");

      });

      prefixedEvent($panelMain[0], 'AnimationEnd', function(event) {
        if (event.animationName.indexOf('Out') > -1) {

          // Hide and Prevent ms-Panel-main from being interactive
          $panel.removeClass('is-open');

          // Remove animating classes for the next time we open panel
          $panel.removeClass('ms-Panel-animateIn ms-Panel-animateOut');

        }
      });

      // Pivots for sample page to show variant panel sizes
      $(".panelVariant-item").on("click", function() {
        var className = $(this).find('span').attr('class');

        $(".panelVariant-item").removeClass('is-selected');
        $(this).addClass('is-selected');

        switch (className) {
          case 'is-default':
            $('.ms-Panel').removeClass().addClass('ms-Panel');
            break;
          case 'is-left':
            $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--left');
            break;
          case 'is-lightDismiss':
            $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--lightDismiss');
            break;
          case 'is-md':
            $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--md');
            break;
          case 'is-lgFixed':
            $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--lg ms-Panel--fixed');
            break;
          case 'is-lg':
            $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--lg');
            break;
          case 'is-xl':
            $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--xl');
            break;
        }
      });
    });

  };
})(jQuery);

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

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Persona Card Plugin
 *
 * Adds basic demonstration functionality to .ms-PersonaCard components.
 *
 * @param  {jQuery Object}  One or more .ms-PersonaCard components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.PersonaCard = function () {

    /** Go through each file picker we've been given. */
    return this.each(function () {

      var $personaCard = $(this);

      /** When selecting an action, show its details. */
      $personaCard.on('click', '.ms-PersonaCard-action', function() {

        /** Select the correct tab. */
        $personaCard.find('.ms-PersonaCard-action').removeClass('is-active');
        $(this).addClass('is-active');

        /** Function for switching selected item into view by adding a class to ul. */
        var updateForItem = function(wrapper, item) {
          var previousItem = wrapper.className + "";
          var detail = item.charAt(0).toUpperCase() + item.slice(1);
          var nextItem = "ms-PersonaCard-detail" + detail;
          if (previousItem !== nextItem){
            wrapper.classList.remove(previousItem);
            wrapper.classList.add(nextItem);
          }
        };

        /** Get id of selected item */
        var el = $(this).attr('id');
        /** Add detail class to ul to switch it into view. */
        updateForItem($(this).parent().next().find('#detailList')[0], el);

        /** Display the corresponding details. */
        var requestedAction = $(this).attr('id');
        $personaCard.find('.ms-PersonaCard-actionDetails').removeClass('is-active');
        $personaCard.find('#' + requestedAction + '.ms-PersonaCard-actionDetails').addClass('is-active');

      });

      /** Toggle more details. */
      $personaCard.on('click', '.ms-PersonaCard-detailExpander', function() {
        $(this).parent('.ms-PersonaCard-actionDetails').toggleClass('is-collapsed');
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * ProgressIndicator component
 *
 * A component for outputting determinate progress
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLDivElement} container - the target container for an instance of ProgressIndicator
 * @constructor
 */
fabric.ProgressIndicator = function(container) {
  this.container = container;
  this.cacheDOM();
};

fabric.ProgressIndicator.prototype = (function() {

  var _progress;
  var _width;
  var _itemName;
  var _total;
  var _itemDescription;
  var _progressBar;

  /**
   * Sets the progress percentage for a determinate
   * operation. Either use this or setProgress
   * and setTotal as setProgressPercent assumes
   * you've done a percentage calculation before
   * injecting it into the function
   * @param {number} percent - a floating point number from 0 to 1
   */
  var setProgressPercent = function(percent) {
    _progressBar.style.width = Math.round(_width * percent) + "px";
  };

  /**
   * Sets the progress for a determinate operation.
   * Use this in combination with setTotal.
   * @param {number} progress
   */
  var setProgress = function(progress) {
    _progress = progress;
    var percentage = _progress / _total;
    this.setProgressPercent(percentage);
  };

  /**
   * Sets the total file size, etc. for a
   * determinate operation. Use this in
   * combination with setProgress
   * @param {number} total
   */
  var setTotal = function(total) {
    _total = total;
  };

  /**
   * Sets the text for the title or label
   * of an instance
   * @param {string} name
   */
  var setName = function(name) {
    _itemName.innerHTML = name;
  };

  /**
   * Sets the text for a description
   * of an instance
   * @param {string} name
   */
  var setDescription = function(description) {
    _itemDescription.innerHTML = description;
  };

  /**
   * caches elements and values of the component
   *
   */
  var cacheDOM = function() {
    _itemName = this.container.querySelector('.ms-ProgressIndicator-itemName') || null; //an itemName element is optional
    _itemDescription = this.container.querySelector('.ms-ProgressIndicator-itemDescription') || null; //an itemDescription element is optional
    _progressBar = this.container.querySelector('.ms-ProgressIndicator-progressBar');
    _width = this.container.querySelector('.ms-ProgressIndicator-itemProgress').offsetWidth;
  };

  return {
    setProgressPercent: setProgressPercent,
    setName: setName,
    setDescription: setDescription,
    setProgress: setProgress,
    setTotal: setTotal,
    cacheDOM: cacheDOM
  };
}());

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Pivot Plugin
 *
 * Adds basic demonstration functionality to .ms-Pivot components.
 *
 * @param  {jQuery Object}  One or more .ms-Pivot components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Pivot = function () {

    /** Go through each pivot we've been given. */
    return this.each(function () {

      var $pivotContainer = $(this);

      /** When clicking/tapping a link, select it. */
      $pivotContainer.on('click', '.ms-Pivot-link', function(event) {
        event.preventDefault();
        /** Check if current selection has elipses child element **/
        var $elipsisCheck = $(this).find('.ms-Pivot-ellipsis');
        
        /** Only execute when no elipses element can be found **/
        if($elipsisCheck.length === 0){
  
          $(this).siblings('.ms-Pivot-link').removeClass('is-selected');
          $(this).addClass('is-selected');
        }
  
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * SearchBox Plugin
 *
 * Adds basic demonstration functionality to .ms-SearchBox components.
 *
 * @param  {jQuery Object}  One or more .ms-SearchBox components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.SearchBox = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {
      // Set cancel to false
      var cancel = false;
      var $searchField = $(this).find('.ms-SearchBox-field');

      /** SearchBox focus - hide label and show cancel button */
      $searchField.on('focus', function() {
        /** Hide the label on focus. */
        $(this).siblings('.ms-SearchBox-label').hide();
        // Show cancel button by adding is-active class
        $(this).parent('.ms-SearchBox').addClass('is-active');
      });

      /** 'hovering' class allows for more fine grained control of hover state */
      $searchField.on('mouseover', function() {
        $searchField.addClass('hovering');
      });

      $searchField.on('mouseout', function() {
        $searchField.removeClass('hovering');
      });

      // If cancel button is selected, change cancel value to true
      $(this).find('.ms-SearchBox-closeButton').on('mousedown', function() {
        cancel = true;
      });

      /** Show the label again when leaving the field. */
      $(this).find('.ms-SearchBox-field').on('blur', function() {

        // If cancel button is selected remove the text and show the label
        if (cancel) {
          $(this).val('');
          $searchField.addClass('hovering');
        }
        
        var $searchBox = $(this).parent('.ms-SearchBox');
        // Prevents inputfield from gaining focus too soon
        setTimeout(function() {
          // Remove is-active class - hides cancel button
          $searchBox.removeClass('is-active');
        }, 10);
        
        /** Only do this if no text was entered. */
        if ($(this).val().length === 0 ) {
          $(this).siblings('.ms-SearchBox-label').show();
        }

        // Reset cancel to false
        cancel = false;
      });
    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Spinner Component
 *
 * An animating activity indicator.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};

/**
 * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
 */

fabric.Spinner = function(target) {

    var _target = target;
    var eightSize = 0.2;
    var circleObjects = [];
    var animationSpeed = 90;
    var interval;
    var spinner;
    var numCircles;
    var offsetSize;
    var fadeIncrement = 0;
    var parentSize = 20;

    /**
     * @function start - starts or restarts the animation sequence
     * @memberOf fabric.Spinner
     */
    function start() {
        stop();
        interval = setInterval(function() {
            var i = circleObjects.length;
            while(i--) {
                _fade(circleObjects[i]);
            }
        }, animationSpeed);
    }

    /**
     * @function stop - stops the animation sequence
     * @memberOf fabric.Spinner
     */
    function stop() {
        clearInterval(interval);
    }

    //private methods

    function _init() {
        _setTargetElement();
        _setPropertiesForSize();
        _createCirclesAndArrange();
        _initializeOpacities();
        start();
    }

    function _initializeOpacities() {
        var i = 0;
        var j = 1;
        var opacity;
        fadeIncrement = 1 / numCircles;

        for (i; i < numCircles; i++) {
            var circleObject = circleObjects[i];
            opacity = (fadeIncrement * j++);
            _setOpacity(circleObject.element, opacity);
        }
    }

    function _fade(circleObject) {
        var opacity = _getOpacity(circleObject.element) - fadeIncrement;

        if (opacity <= 0) {
            opacity = 1;
        }

        _setOpacity(circleObject.element, opacity);
    }

    function _getOpacity(element) {
        return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    }

    function _setOpacity(element, opacity) {
        element.style.opacity = opacity;
    }

    function _createCircle() {
        var circle = document.createElement('div');
        circle.className = "ms-Spinner-circle";
        circle.style.width = circle.style.height = parentSize * offsetSize + "px";
        return circle;
    }

    function _createCirclesAndArrange() {

        var angle = 0;
        var offset = parentSize * offsetSize;
        var step = (2 * Math.PI) / numCircles;
        var i = numCircles;
        var circleObject;
        var radius = (parentSize - offset) * 0.5;

        while (i--) {
            var circle = _createCircle();
            var x = Math.round(parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
            var y = Math.round(parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
            spinner.appendChild(circle);
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            angle += step;
            circleObject = { element:circle, j:i };
            circleObjects.push(circleObject);
        }
    }

    function _setPropertiesForSize() {
        if (spinner.className.indexOf("large") > -1) {
            parentSize = 28;
            eightSize = 0.179;
        }

        offsetSize = eightSize;
        numCircles = 8;
    }

    function _setTargetElement() {
        //for backwards compatibility
        if (_target.className.indexOf("ms-Spinner") === -1) {
            spinner = document.createElement("div");
            spinner.className = "ms-Spinner";
            _target.appendChild(spinner);
        } else {
            spinner = _target;
        }
    }

    _init();

    return {
        start:start,
        stop:stop
    };
};

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Text Field Plugin
 *
 * Adds basic demonstration functionality to .ms-TextField components.
 *
 * @param  {jQuery Object}  One or more .ms-TextField components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.TextField = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {

      /** Does it have a placeholder? */
      if ($(this).hasClass("ms-TextField--placeholder")) {

        /** Hide the label on click. */
        $(this).on('click', function () {
          $(this).find('.ms-Label').hide();
        });
        
        /** Hide the label on focus. */
        $(this).find('.ms-TextField-field').on('focus', function () {
          $(this).siblings('.ms-Label').hide();
        });

        /** Show the label again when leaving the field. */
        $(this).find('.ms-TextField-field').on('blur', function () {

          /** Only do this if no text was entered. */
          if ($(this).val().length === 0) {
            $(this).siblings('.ms-Label').show();
          }
        });
      }

      /** Underlined - adding/removing a focus class */
      if ($(this).hasClass('ms-TextField--underlined')) {

        /** Add is-active class - changes border color to theme primary */
        $(this).find('.ms-TextField-field').on('focus', function() {
          $(this).parent('.ms-TextField--underlined').addClass('is-active');
        });

        /** Remove is-active on blur of textfield */
        $(this).find('.ms-TextField-field').on('blur', function() {
          $(this).parent('.ms-TextField--underlined').removeClass('is-active');
        });
      }

    });
  };
})(jQuery);
