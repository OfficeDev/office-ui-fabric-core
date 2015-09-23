// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

(function ($) {

  /**
   * @param {object} options DatePicker options
   * @param {array} options.optionMonths An array of month abbreviations for the options grid
   * @param {string} options.label A label for the DatePicker
   * @param {string} options.placeholderText Placeholder text for the DatePicker textfield
   */
  $.fn.DatePicker = function (options) {

    var datePicker;
    var self = this;
    var optionMonths = options && options.optionMonths || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var label = options && options.label || "Start Date";
    var placeholderText = options && options.placeholderText || "Select a date";

    /** check if the PickaDate plugin exists, if not load the plugin */
    if (!$().pickadate) {
      var firstScript = document.getElementsByTagName("script")[0];
      var script = document.createElement("script");
      script.onload = returnDatePicker;
      script.src = "PickaDate.js";
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      datePicker = returnDatePicker();
    }

    function returnDatePicker() {
      /** Iterate through each date picker provided. */
      return self.each(function () {

        var $datePicker = $(this);

        /**create the body of the datepicker */
        appendElements($datePicker, optionMonths);

        /** insert label and placeholder text */
        $datePicker.find('.ms-Label').text(label);
        $datePicker.find('.ms-TextField-field').attr("placeholder", placeholderText + "...");

        /** Set up variables and run the Pickadate plugin. */
        var $dateField = $datePicker.find('.ms-TextField-field').pickadate({
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
            now: 'ms-DatePicker-day--today',
            infocus: 'ms-DatePicker-day--infocus',
            outfocus: 'ms-DatePicker-day--outfocus'
          }
        });
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
    }

    return datePicker;
  };

  /**
   * Create the body of the DatePicker plugin and
   * append it to the date picker element
   * @param {object} $datePicker JQuery object
   * @param {array} optionMonths
   */
  function appendElements($datePicker, optionMonths) {
    var elements = '<div class="ms-TextField">';
    elements += '<label class="ms-Label"></label>';
    elements += '<i class="ms-DatePicker-event ms-Icon ms-Icon--event"></i>';
    elements += '<input class="ms-TextField-field" type="text">';
    elements += '</div>';
    elements += '<div class="ms-DatePicker-monthComponents">';
    elements += '<span class="ms-DatePicker-nextMonth js-nextMonth"><i class="ms-Icon ms-Icon--chevronRight"></i></span>';
    elements += '<span class="ms-DatePicker-prevMonth js-prevMonth"><i class="ms-Icon ms-Icon--chevronLeft"></i></span>';
    elements += '<div class="ms-DatePicker-headerToggleView js-showMonthPicker"></div>';
    elements += '</div>';
    elements += '<span class="ms-DatePicker-goToday js-goToday">Go to today</span>';
    elements += '<div class="ms-DatePicker-monthPicker">';
    elements += '<div class="ms-DatePicker-header">';
    elements += '<div class="ms-DatePicker-yearComponents">';
    elements += '<span class="ms-DatePicker-nextYear js-nextYear"><i class="ms-Icon ms-Icon--chevronRight"></i></span>';
    elements += '<span class="ms-DatePicker-prevYear js-prevYear"><i class="ms-Icon ms-Icon--chevronLeft"></i></span>';
    elements += '</div>';
    elements += '<div class="ms-DatePicker-currentYear js-showYearPicker"></div>';
    elements += '</div>';
    elements += '<div class="ms-DatePicker-optionGrid">';
    elements += '</div></div>';
    elements += '<div class="ms-DatePicker-yearPicker">';
    elements += '<div class="ms-DatePicker-decadeComponents">';
    elements += '<span class="ms-DatePicker-nextDecade js-nextDecade"><i class="ms-Icon ms-Icon--chevronRight"></i></span>';
    elements += '<span class="ms-DatePicker-prevDecade js-prevDecade"><i class="ms-Icon ms-Icon--chevronLeft"></i></span>';
    elements += '</div></div>';
    $datePicker.append(elements);
    $datePicker.find('.ms-DatePicker-optionGrid').append(createMonthOptions(optionMonths));
  }
  /**
   * creates month elements for the month grid
   * @param {array} optionMonths
   * @returns {string}
   */
  function createMonthOptions(optionMonths) {
    var i = 0;
    var content = "";
    for(i; i < 12; i++) {
      content += '<span class="ms-DatePicker-monthOption js-changeDate" data-month="' + i + '">' + optionMonths[i] + '</span>';
    }
    return content;
  }
  /**
   * After the Pickadate plugin starts, this function
   * adds additional controls to the picker view.
   */
  function initCustomView($datePicker) {

    /** Get some variables ready. */
    var $monthControls = $datePicker.find('.ms-DatePicker-monthComponents');
    var $goToday = $datePicker.find('.ms-DatePicker-goToday');
    var $dayPicker = $datePicker.find('.ms-DatePicker-dayPicker');
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
    $monthPicker.on('click', '.js-showDayPicker', function(event) {
      $datePicker.removeClass('is-pickingMonths');
      $datePicker.removeClass('is-pickingYears');
    });

    /** Switch to the is-pickingMonths state. */
    $monthControls.on('click', '.js-showMonthPicker', function(event) {
      $datePicker.toggleClass('is-pickingMonths');
    });

    /** Switch to the is-pickingYears state. */
    $monthPicker.on('click', '.js-showYearPicker', function(event) {
      $datePicker.toggleClass('is-pickingYears');
    });

  }

  /** Change the highlighted date. */
  function changeHighlightedDate($picker, newYear, newMonth, newDay) {

    /** All variables are optional. If not provided, default to the current value. */
    if (newYear == null) {
      newYear = $picker.get('highlight').year;
    }
    if (newMonth == null) {
      newMonth = $picker.get('highlight').month;
    }
    if (newDay == null) {
      newDay = $picker.get('highlight').date;
    }

    /** Update it. */
    $picker.set('highlight', [newYear, newMonth, newDay]);

  }

  /** Whenever the picker renders, do our own rendering on the custom controls. */
  function updateCustomView($datePicker) {
    /** Get some variables ready. */
    var $monthPicker = $datePicker.find('.ms-DatePicker-monthPicker');
    var $yearPicker = $datePicker.find('.ms-DatePicker-yearPicker');
    var $pickerWrapper = $datePicker.find('.ms-DatePicker-wrap');
    var $picker = $datePicker.find('.ms-TextField-field').pickadate('picker');

    /** Set the correct year. */
    $monthPicker.find('.ms-DatePicker-currentYear').text($picker.get('view').year);

    /** Highlight the current month. */
    $monthPicker.find('.ms-DatePicker-monthOption').removeClass('is-highlighted')
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
    for (year = startingYear; year < (startingYear + 12); year++) {
      output += '<span class="ms-DatePicker-yearOption js-changeDate" data-year="' + year + '">' + year +'</span>';
    }
    output += '</div>';

    // Output the title and grid of years generated above.
    $yearPicker.append(output);

    /** Highlight the current year. */
    $yearPicker.find('.ms-DatePicker-yearOption').removeClass('is-highlighted')
    $yearPicker.find('.ms-DatePicker-yearOption[data-year="' + $picker.get('highlight').year + '"]').addClass('is-highlighted');
  }

  /** Scroll the page up so that the field the date picker is attached to is at the top. */
  function scrollUp($datePicker) {
    $('html, body').animate({
      scrollTop: $datePicker.offset().top
    }, 367);
  }

})(jQuery);