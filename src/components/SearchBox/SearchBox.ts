// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * SearchBox component
 *
 * Allows you to search the world.
 *
 */

/**
 * @namespace fabric
 */
namespace fabric {
  /**
   *
   * @param {HTMLElement} container - the target container for an instance of SearchBox
   * @constructor
   *
   */

  const SB_FIELD = ".ms-SearchBox-field";
  const SB_CLOSE_BUTTON = ".ms-CommandButton";
  const SB_HAS_TEXT = "has-text";
  const SB_IS_ACTIVE = "is-active";

  export class SearchBox {

    private _searchBoxField;
    private _searchBox;
    private _searchBoxCloseButton;
    private _container: HTMLElement;
    private _cancel = false;

    constructor(container: HTMLElement) {
      this._container = container;
      this._saveDOMRefs(this._container);
      this._setHasText();
      this._setFocusAction(this._container);
      this._setCloseButtonAction();
      this._setBlurAction();
      this._checkState();
    }

    public setCollapsedListeners() {
      this._disposeListeners();
      this. _searchBox.addEventListener("click", this._expandSearchHandler, false);
      this._searchBoxField.addEventListener("focus", this._expandSearchHandler, true);
    }

    private _saveDOMRefs(context) {
      this._searchBox = context;
      this._searchBoxField = this._searchBox.querySelector(SB_FIELD);
      this._searchBoxCloseButton = this._searchBox.querySelector(SB_CLOSE_BUTTON);
    }

    private _hasClass(element, cls) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    }

    private _disposeListeners() {
      this._searchBox.removeEventListener("click", this._expandSearchHandler, false);
      this._searchBoxField.removeEventListener("focus", this._expandSearchHandler, true);
    }

    private _handleOutsideSearchClick(e) {
      // If the elemenet clicked is not INSIDE of searchbox then close seach
      if (!this._searchBox.contains(e.target) && e.target !== this._searchBox) {
        this._collapseSearchBox();
        document.removeEventListener("click", this._handleOutsideSearchClick, false);
        this.setCollapsedListeners();
      }
    }

    private _collapseSearchBox() {
      this._searchBox.classList.remove("is-active");
    }

    private _expandSearchHandler() {
      this._disposeListeners();
      this._searchBox.classList.add("is-active");
      this._searchBoxField.focus();
      this._searchBoxCloseButton.addEventListener("click", this._collapseSearchBox, false);
      document.addEventListener("click", this. _handleOutsideSearchClick, false);
    }

    private _setHasText() {
      if (this._searchBoxField.value.length > 0) {
        this._searchBox.classList.add(SB_HAS_TEXT);
      } else {
        this._searchBox.classList.remove(SB_HAS_TEXT);
      }
    }

    private _setFocusAction(context) {
      this._searchBoxField.addEventListener("focus", function() {
        console.log(document.activeElement);
        this._setHasText();
        this._searchBox.classList.add(SB_IS_ACTIVE);
      }, true);
    }

    private _clearSearchBox() {
      this._searchBoxField.value = "";
      this._searchBox.classList.remove(SB_IS_ACTIVE);
      this._setHasText();
      this._cancel = false;
    }

    private _setCloseButtonAction() {
      this._searchBoxCloseButton.addEventListener("mousedown", () => {
        this._clearSearchBox();
      }, false);
      this._searchBoxCloseButton.addEventListener("keydown", (e) => {
        let keyCode = e.keyCode;
        if (keyCode === 13) {
          this._clearSearchBox();
        }
      }, false);
    }

    private _handleBlur() {
      setTimeout(() => {
        if (!this._searchBox.contains(document.activeElement)) {
          this._clearSearchBox();
        }
      }, 10);
    }

    private _setBlurAction() {
      this._searchBoxField.addEventListener("blur", this._handleBlur, true);
      this._searchBoxCloseButton.addEventListener("blur", this._handleBlur, true);
    }

    private _checkState() {
      if (this._hasClass(this._searchBox, "is-collapsed")) {
        this.setCollapsedListeners();
      }
    }
  }
}
