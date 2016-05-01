// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";

/// <reference path="../../../typings/jquery.d.ts"/>

namespace fabric {


  /**
   * Facepile Plugin
   *
   * Adds basic demonstration functionality to .ms-Facepile components.
   *
   */
  export class Facepile {

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Facepile
     * @constructor
     */
    constructor(container: HTMLElement) {
      new fabric.PeoplePicker(<HTMLElement>document.querySelector(".ms-PeoplePicker"));
      // new fabric.Panel(<HTMLElement>document.querySelector(".ms-Panel"));

      let $Facepile = $(container);
      let $membersList = $(".ms-Facepile-members");
      let $membersCount = $(".ms-Facepile-members > .ms-Facepile-itemBtn").length;
      let $panel = $(".ms-Facepile-panel.ms-Panel");
      let $panelMain = $panel.find(".ms-Panel-main");
      let $picker = $(".ms-PeoplePicker.ms-PeoplePicker--Facepile");
      let $pickerMembers = $picker.find(".ms-PeoplePicker-selectedPeople");
      let $personaCard = $(".ms-Facepile").find(".ms-PersonaCard");


      /** Increment member count and show/hide overflow text */
      let incrementMembers = function() {
        /** Increment person count by one */
        $membersCount += 1;

        /** Display a maxiumum of 5 people */
        $(".ms-Facepile-members").children(":gt(4)").hide();

        /** Display counter after 5 people are present */
        if ($membersCount > 5) {
          $(".ms-Facepile-itemBtn--overflow").addClass("is-active");

          let remainingMembers = $membersCount - 5;
          $(".ms-Facepile-overflowText").text("+" + remainingMembers);
        }
      };

      /** Open panel with people picker */
      $Facepile.on("click", ".js-addPerson", function() {
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open")
              .addClass("ms-Panel-animateIn")
              .removeClass("ms-Facepile-panel--overflow ms-Panel--right")
              .addClass("ms-Facepile-panel--addPerson");

        /** Close any open persona cards */
        $personaCard.removeClass("is-active").hide();
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
              .removeClass("ms-Facepile-panel--addPerson")
              .addClass("ms-Facepile-panel--overflow ms-Panel--right");
      });

      /** Display person count on page load */
      $(document).ready(function() {
        $(".ms-Facepile-overflowText").text("+" + $membersCount);
      });

      /** Show selected members from PeoplePicker in the Facepile */
      $(".ms-PeoplePicker-result").on("click", function() {
        let $this = $(this);
        let name = $this.find(".ms-Persona-primaryText").html();
        let title = $this.find(".ms-Persona-secondaryText").html();
        let selectedInitials = (function() {
          let nameArray = name.split(" ");
          let nameInitials = "";
          for (let i = 0; i < nameArray.length; i++) {
            nameInitials += nameArray[i].charAt(0);
          }

          return nameInitials.substring(0, 2);
        })();
        let selectedClasses = $this.find(".ms-Persona-initials").attr("class");
        let selectedImage = (function() {
          if ($this.find(".ms-Persona-image").length) {
            let selectedImageSrc = $this.find(".ms-Persona-image").attr("src");
            return "<img class=\"ms-Persona-image\" src=\"" + selectedImageSrc + "\" alt=\"Persona image\">";
          } else {
            return "";
          }
        })();

        let FacepileItem =
          "<button class=\"ms-Facepile-itemBtn ms-Facepile-itemBtn--member\" title=\"" + name + "\">" +
            "<div class=\"ms-Persona ms-Persona--xs\">" +
              "<div class=\"ms-Persona-imageArea\">" +
                "<div class=\"" + selectedClasses + "\">" + selectedInitials + "</div>" +
                selectedImage +
              "</div>" +
              "<div class=\"ms-Persona-presence\"></div>" +
              "<div class=\"ms-Persona-details\">" +
                "<div class=\"ms-Persona-primaryText\">" + name + "</div>" +
                "<div class=\"ms-Persona-secondaryText\">" + title + "</div>" +
              "</div>" +
            "</div>" +
          "</button>";

        /** Add new item to members list in Facepile */
        $membersList.prepend(FacepileItem);

        /** Increment member count */
        incrementMembers();
      });

      /** Remove members in panel people picker */
      $pickerMembers.on("click", ".js-selectedRemove", function() {
        let memberText = $(this).parent().find(".ms-Persona-primaryText").text();

        let $FacepileMember = $membersList.find(".ms-Persona-primaryText:contains(" + memberText + ")").first();

        if ($FacepileMember) {
          $FacepileMember.parent().closest(".ms-Facepile-itemBtn").remove();

          $membersCount -= 1;

           /** Display a maxiumum of 5 people */
           $(".ms-Facepile-members").children(":lt(5)").show();

          /** Display counter after 5 people are present */
          if ($membersCount <= 5) {
            $(".ms-Facepile-itemBtn--overflow").removeClass("is-active");
          } else {
            let remainingMembers = $membersCount - 5;
            $(".ms-Facepile-overflowText").text("+" + remainingMembers);
          }
        }
      });

      /** Show persona card when selecting a Facepile item */
      $membersList.on("click", ".ms-Facepile-itemBtn", function() {
        let selectedName = $(this).find(".ms-Persona-primaryText").html();
        let selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
        let selectedInitials = (function() {
          let name = selectedName.split(" ");
          let nameInitials = "";
          for (let i = 0; i < name.length; i++) {
            nameInitials += name[i].charAt(0);
          }

          return nameInitials.substring(0, 2);
        })();
        let selectedClasses = $(this).find(".ms-Persona-initials").attr("class");
        let selectedImage = $(this).find(".ms-Persona-image").attr("src");
        let $card = $(".ms-PersonaCard");
        let $cardName = $card.find(".ms-Persona-primaryText");
        let $cardTitle = $card.find(".ms-Persona-secondaryText");
        let $cardInitials = $card.find(".ms-Persona-initials");
        let $cardImage = $card.find(".ms-Persona-image");

        /** Close any open persona cards */
        $personaCard.removeClass("is-active");

        /** Add data to persona card */
        $cardName.text(selectedName);
        $cardTitle.text(selectedTitle);
        $cardInitials.text(selectedInitials);
        $cardInitials.removeClass();
        $cardInitials.addClass(selectedClasses);
        $cardImage.attr("src", selectedImage);

        /** Show persona card */
        setTimeout(function() { $personaCard.addClass("is-active"); }, 100);

        /** Align persona card on md and above screens */
        if ($(window).width() > 480) {
          let itemPosition = $(this).offset().left;
          let correctedPosition = itemPosition - 26;

          $personaCard.css({"left": correctedPosition});
        } else {
          $personaCard.css({"left": 0, "top": "auto", "position": "fixed"});
        }
      });

      /** Dismiss persona card when clicking on the document */
      $(document).on("click", function(e) {
        let $memberBtn = $(".ms-Facepile-itemBtn--member");

        if (!$memberBtn.is(e.target) && $memberBtn.has(e.target).length === 0 &&
            !$personaCard.is(e.target) && $personaCard.has(e.target).length === 0) {
          $personaCard.removeClass("is-active");
          $personaCard.removeAttr("style");
        } else {
          $personaCard.addClass("is-active");
        }
      });

    }
  }
}
