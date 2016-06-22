// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>
/// <reference path="../../../typings/pickadate.d.ts"/>

namespace fabric {
  /**
   * DatePicker Plugin
   */
  export class DatePicker {

    constructor(container, options) {
      /** Set up letiables and run the Pickadate plugin. */
      let $datePicker = $(container);
      let $dateField: any = $datePicker.find(".ms-TextField-field").pickadate($.extend({
        // Strings and translations.
        weekdaysShort: ["S", "M", "T", "W", "T", "F", "S"],

        // Don't render the buttons
        clear: "",
        close: "",
        today: "",

        // Events
        onStart: () => {
          this.initCustomView($datePicker);
        },

        // Classes
        klass: {

          // The element states
          input: "ms-DatePicker-input",
          active: "ms-DatePicker-input--active",

          // The root picker and states
          picker: "ms-DatePicker-picker",
          opened: "ms-DatePicker-picker--opened",
          focused: "ms-DatePicker-picker--focused",

          // The picker holder
          holder: "ms-DatePicker-holder",

          // The picker frame, wrapper, and box
          frame: "ms-DatePicker-frame",
          wrap: "ms-DatePicker-wrap",
          box: "ms-DatePicker-dayPicker",

          // The picker header
          header: "ms-DatePicker-header",

          // Month & year labels
          month: "ms-DatePicker-month",
          year: "ms-DatePicker-year",

          // Table of dates
          table: "ms-DatePicker-table",

          // Weekday labels
          weekdays: "ms-DatePicker-weekday",

          // Day states
          day: "ms-DatePicker-day",
          disabled: "ms-DatePicker-day--disabled",
          selected: "ms-DatePicker-day--selected",
          highlighted: "ms-DatePicker-day--highlighted",
          now: "ms-DatePicker-day--today",
          infocus: "ms-DatePicker-day--infocus",
          outfocus: "ms-DatePicker-day--outfocus"
        }
      }, options || {}));
      let $picker = $dateField.pickadate("picker");

      /** Respond to built-in picker events. */
      $picker.on({
        render: () => {
          this.updateCustomView($datePicker);
        },
        open: () => {
          this.scrollUp($datePicker);
        }
      });
    }

    /**
     * After the Pickadate plugin starts, this function
     * adds additional controls to the picker view.
     */
    public initCustomView($datePicker) {

      /** Get some letiables ready. */
      let $monthControls = $datePicker.find(".ms-DatePicker-monthComponents");
      let $goToday = $datePicker.find(".ms-DatePicker-goToday");
      let $monthPicker = $datePicker.find(".ms-DatePicker-monthPicker");
      let $yearPicker = $datePicker.find(".ms-DatePicker-yearPicker");
      let $pickerWrapper = $datePicker.find(".ms-DatePicker-wrap");
      let $picker = $datePicker.find(".ms-TextField-field").pickadate("picker");

      /** Move the month picker into position. */
      $monthControls.appendTo($pickerWrapper);
      $goToday.appendTo($pickerWrapper);
      $monthPicker.appendTo($pickerWrapper);
      $yearPicker.appendTo($pickerWrapper);

      /** Update the custom view. */
      this.updateCustomView($datePicker);

      /** dispatch click on document so anything listening can be notified */
      $picker.on("open", function(e) {
        let evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        document.dispatchEvent(evt);
      });

      /** Move back one month. */
      $monthControls.on("click", ".js-prevMonth", (event) => {
        event.preventDefault();
        let newMonth = $picker.get("highlight").month - 1;
        this.changeHighlightedDate($picker, null, newMonth, null);
      });

      /** Move ahead one month. */
      $monthControls.on("click", ".js-nextMonth", (event) => {
        event.preventDefault();
        let newMonth = $picker.get("highlight").month + 1;
        this.changeHighlightedDate($picker, null, newMonth, null);
      });

      /** Move back one year. */
      $monthPicker.on("click", ".js-prevYear", (event) => {
        event.preventDefault();
        let newYear = $picker.get("highlight").year - 1;
        this.changeHighlightedDate($picker, newYear, null, null);
      });

      /** Move ahead one year. */
      $monthPicker.on("click", ".js-nextYear", (event) => {
        event.preventDefault();
        let newYear = $picker.get("highlight").year + 1;
        this.changeHighlightedDate($picker, newYear, null, null);
      });

      /** Move back one decade. */
      $yearPicker.on("click", ".js-prevDecade", (event) => {
        event.preventDefault();
        let newYear = $picker.get("highlight").year - 10;
        this.changeHighlightedDate($picker, newYear, null, null);
      });

      /** Move ahead one decade. */
      $yearPicker.on("click", ".js-nextDecade", (event) => {
        event.preventDefault();
        let newYear = $picker.get("highlight").year + 10;
        this.changeHighlightedDate($picker, newYear, null, null);
      });

      /** Go to the current date, shown in the day picking view. */
      $goToday.click((event) => {
        event.preventDefault();

        /** Select the current date, while keeping the picker open. */
        let now = new Date();
        $picker.set("select", [now.getFullYear(), now.getMonth(), now.getDate()]);

        /** Switch to the default (calendar) view. */
        $datePicker.removeClass("is-pickingMonths").removeClass("is-pickingYears");

      });

      /** Change the highlighted month. */
      $monthPicker.on("click", ".js-changeDate", (event) => {
        event.preventDefault();

        let $changeDate = $(event.toElement);

        /** Get the requested date from the data attributes. */
        let newYear = $changeDate.attr("data-year");
        let newMonth = $changeDate.attr("data-month");
        let newDay = $changeDate.attr("data-day");

        /** Update the date. */
        this.changeHighlightedDate($picker, newYear, newMonth, newDay);

        /** If we"ve been in the "picking months" state on mobile, remove that state so we show the calendar again. */
        if ($datePicker.hasClass("is-pickingMonths")) {
          $datePicker.removeClass("is-pickingMonths");
        }
      });

      /** Change the highlighted year. */
      $yearPicker.on("click", ".js-changeDate", (event) => {
        event.preventDefault();
        let $changeDate = $(event.toElement);

        /** Get the requested date from the data attributes. */
        let newYear = $changeDate.attr("data-year");
        let newMonth = $changeDate.attr("data-month");
        let newDay = $changeDate.attr("data-day");

        /** Update the date. */
        this.changeHighlightedDate($picker, newYear, newMonth, newDay);

        /** If we"ve been in the "picking years" state on mobile, remove that state so we show the calendar again. */
        if ($datePicker.hasClass("is-pickingYears")) {
          $datePicker.removeClass("is-pickingYears");
        }
      });

      /** Switch to the default state. */
      $monthPicker.on("click", ".js-showDayPicker", function() {
        $datePicker.removeClass("is-pickingMonths");
        $datePicker.removeClass("is-pickingYears");
      });

      /** Switch to the is-pickingMonths state. */
      $monthControls.on("click", ".js-showMonthPicker", function() {
        $datePicker.toggleClass("is-pickingMonths");
      });

      /** Switch to the is-pickingYears state. */
      $monthPicker.on("click", ".js-showYearPicker", function() {
        $datePicker.toggleClass("is-pickingYears");
      });
    }

    /** Change the highlighted date. */
    public changeHighlightedDate($picker, newYear, newMonth, newDay) {

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
      $picker.set("highlight", [newYear, newMonth, newDay]);
    }


    /** Whenever the picker renders, do our own rendering on the custom controls. */
    public updateCustomView($datePicker) {

      /** Get some letiables ready. */
      let $monthPicker = $datePicker.find(".ms-DatePicker-monthPicker");
      let $yearPicker = $datePicker.find(".ms-DatePicker-yearPicker");
      let $picker = $datePicker.find(".ms-TextField-field").pickadate("picker");

      /** Set the correct year. */
      $monthPicker.find(".ms-DatePicker-currentYear").text($picker.get("view").year);

      /** Highlight the current month. */
      $monthPicker.find(".ms-DatePicker-monthOption").removeClass("is-highlighted");
      $monthPicker.find(".ms-DatePicker-monthOption[data-month='" + $picker.get("highlight").month + "']").addClass("is-highlighted");

      /** Generate the grid of years for the year picker view. */

        // Start by removing any existing generated output. */
      $yearPicker.find(".ms-DatePicker-currentDecade").remove();
      $yearPicker.find(".ms-DatePicker-optionGrid").remove();

      // Generate the output by going through the years.
      let startingYear = $picker.get("highlight").year - 11;
      let decadeText = startingYear + " - " + (startingYear + 11);
      let output = "<div class='ms-DatePicker-currentDecade'>" + decadeText + "</div>";
      output += "<div class='ms-DatePicker-optionGrid'>";
      for (let year = startingYear; year < (startingYear + 12); year++) {
        output += "<span class='ms-DatePicker-yearOption js-changeDate' data-year='" + year + "'>" + year + "</span>";
      }
      output += "</div>";

      // Output the title and grid of years generated above.
      $yearPicker.append(output);

      /** Highlight the current year. */
      $yearPicker.find(".ms-DatePicker-yearOption").removeClass("is-highlighted");
      $yearPicker.find(".ms-DatePicker-yearOption[data-year='" + $picker.get("highlight").year + "']").addClass("is-highlighted");
    }

    /** Scroll the page up so that the field the date picker is attached to is at the top. */
    public scrollUp($datePicker) {
      $("html, body").animate({
        scrollTop: $datePicker.offset().top
      }, 367);
    }
  }
}
