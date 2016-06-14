// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Overlay/Overlay.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>

namespace fabric {
  /**
   * People Picker
   *
   * People picker control
   *
   */
  const MODAL_POSITION = "bottom";
  const TOKEN_CLASS = "ms-Persona--token";

  export class PeoplePicker {

    private _container: Element;
    private _contextualHostView: ContextualHost;
    private _peoplePickerMenu: Element;
    private _peoplePickerSearch: Element;
    private _peoplePickerSearchBox: Element;
    private _peoplePickerResults: NodeListOf<Element>;
    private _isContextualMenuOpen: Boolean;
    private _selectedPeople: NodeListOf<Element>;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of People Picker
     * @constructor
     */
    constructor(container: Element) {
      this._container = container;
      this._peoplePickerMenu = this._container.querySelector(".ms-PeoplePicker-results");
      this._peoplePickerSearch = this._container.querySelector(".ms-TextField-field");
      this._peoplePickerSearchBox = this._container.querySelector(".ms-PeoplePicker-searchBox");
      this._selectedPeople = this._container.querySelectorAll(".ms-PeoplePicker-selectedPeople");
      this._assignClicks();

      if (this._peoplePickerMenu) {
        this._peoplePickerMenu.setAttribute("style", "display: none;");
      }
    }

    private _createModalHost(e) {
      e.stopPropagation();
      this._peoplePickerMenu.setAttribute("style", "display: block;");
      this._contextualHostView = new fabric.ContextualHost(
        <HTMLElement>this._peoplePickerMenu,
        MODAL_POSITION,
        this._peoplePickerSearchBox,
        false,
        [""],
        true,
        this._contextHostCallBack.bind(this)
      );
      this._peoplePickerSearchBox.classList.add("is-active");
      this._isContextualMenuOpen = true;
    }

    private _clickHandler(e) {
      this._createModalHost(e);

      // Select all results and remove event listeners by cloning
      let peoplePickerResults = this._peoplePickerMenu.querySelector(".ms-PeoplePicker-result");
      let resultsParent = peoplePickerResults.parentNode;
      let resultsClone = resultsParent.cloneNode(true);
      resultsParent.parentNode.replaceChild(resultsClone, resultsParent);

      // Get all results
      this._peoplePickerResults = this._peoplePickerMenu.querySelectorAll(".ms-PeoplePicker-result");

      // Add _selectResult listeners to each result
      for (let i = 0; i < this._peoplePickerResults.length; i++) {
        this._peoplePickerResults[i].addEventListener("click", this._selectResult.bind(this), true);
      }
    }

    private _selectResult(e) {
      e.stopPropagation();

      let currentResult = this._findElement(e.target, "ms-Persona");
      let clonedResult: Element = <Element>currentResult.cloneNode(true);
      let openHost = document.querySelector(".ms-ContextualHost.is-open");

      // if facePile - add to members list / else tokenize
      if (this._container.classList.contains("ms-PeoplePicker--facePile")) {
        this._addResultToMembers(clonedResult);
      } else {
        this._tokenizeResult(clonedResult);
      }

      // Close the open contextual host
      openHost.classList.remove("is-open");
    }

    private _findElement(childObj: Element, className: string ) {
      let currentElement: Element = <Element>childObj.parentNode;

      while (!currentElement.classList.contains(className)) {
          currentElement = <Element>currentElement.parentNode;
      }
      return currentElement;
    }

    private _addRemoveBtn(persona: Element, token?: Boolean) {
      let actionBtn;
      let actionIcon = document.createElement("i");

      if (token) {
        actionBtn = document.createElement("div");
        actionBtn.classList.add("ms-Persona-actionIcon");
        actionBtn.addEventListener("click", this._removeToken.bind(this), true);
      } else {
        actionBtn = document.createElement("button");
        actionBtn.classList.add("ms-PeoplePicker-resultAction");
        actionBtn.addEventListener("click", this._removeResult.bind(this), true);
      }

      actionIcon.classList.add("ms-Icon", "ms-Icon--x");

      actionBtn.appendChild(actionIcon);

      persona.appendChild(actionBtn);
    }

    private _removeToken(e) {
      let currentToken = this._findElement(e.target, "ms-Persona");
      currentToken.remove();
    }

    private _removeResult(e) {
      let currentResult = this._findElement(e.target, "ms-PeoplePicker-selectedPerson");
      currentResult.remove();
    }

    private _tokenizeResult(tokenResult: Element) {
      let searchBox = this._container.querySelector(".ms-PeoplePicker-searchBox");
      let textField = searchBox.querySelector(".ms-TextField");

      // Add token classes to persona
      tokenResult.classList.add(TOKEN_CLASS, "ms-PeoplePicker-persona");

      // Add the remove button to the token
      this._addRemoveBtn(tokenResult, true);

      // Use persona xs variant for token
      if (tokenResult.classList.contains("ms-Persona--sm")) {
        tokenResult.classList.remove("ms-Persona--sm");
        tokenResult.classList.add("ms-Persona--xs");
      }

      // Prepend the token before the search field
      searchBox.insertBefore(tokenResult, textField);
    }

    private _addResultToMembers(persona: Element) {
      let membersList = this._container.querySelector(".ms-PeoplePicker-selectedPeople");
      let firstMember = membersList.querySelector(".ms-PeoplePicker-selectedPerson");
      let selectedItem = document.createElement("li");

      // Create the selectedPerson list item
      selectedItem.classList.add("ms-PeoplePicker-selectedPerson");
      selectedItem.tabIndex = 1;

      // Append the result persona to list item
      selectedItem.appendChild(persona);

      // Add the remove button to the persona
      this._addRemoveBtn(selectedItem, false);

      // Add removeResult event to resultAction
      selectedItem.querySelector(".ms-PeoplePicker-resultAction").addEventListener("click", this._removeResult.bind(this), true);

      membersList.insertBefore(selectedItem, firstMember);
    }

    private _assignClicks() {
      this._peoplePickerSearch.addEventListener("click", this._clickHandler.bind(this), true);
      this._peoplePickerSearch.addEventListener("keyup", (e: KeyboardEvent) => {
        if (e.keyCode !== 27 && !this._isContextualMenuOpen) {
          this._clickHandler(e);
        }}, true);
    }

    private _contextHostCallBack() {
      this._peoplePickerSearchBox.classList.remove("is-active");
      this._isContextualMenuOpen = false;
    }
  }
}
