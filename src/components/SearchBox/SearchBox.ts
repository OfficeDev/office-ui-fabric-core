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
  const SB_CLEAR_BUTTON = ".ms-SearchBox-clear";
  const SB_EXIT_BUTTON = ".ms-SearchBox-exit";
  const SB_HAS_TEXT = "has-text";
  const SB_IS_ACTIVE = "is-active";
  const SB_IS_ANIMATED = "is-animated";

  export class SearchBox {

    private _searchBoxField;
    private _searchBox;
    private _searchBoxClearButton;
    private _searchBoxExitButton;
    private _container: HTMLElement;
    private _boundExpandSearchHandler;
    private _boundEnableClose;
    private _boundCollapseSearchBox;
    private _boundClearSearchBox;
    private _boundHandleBlur;
    private _boundExitSearchBox;
    private _clearOnly: boolean;

    constructor(container: HTMLElement) {
      this._container = container;
      this._saveDOMRefs(this._container);
      this._boundExpandSearchHandler = this._expandSearchHandler.bind(this);
      this._boundEnableClose = this._enableClose.bind(this);
      this._boundCollapseSearchBox = this._collapseSearchBox.bind(this);
      this._boundClearSearchBox = this._clearSearchBox.bind(this);
      this._boundHandleBlur = this._handleBlur.bind(this);
      this._boundExitSearchBox = this._exitSearchBox.bind(this);
      this._setHasText();
      this._setFocusAction(this._container);
      this._setClearButtonAction();
      this._setBlurAction();
      this._clearOnly = false;
      setTimeout(() => {
        this._checkState();
        this._addAnimation();
      }, 10);
    }

    public setCollapsedListeners(): void {
      this._disposeListeners();
      this._searchBox.addEventListener("click", this._boundExpandSearchHandler, false);
      this._searchBoxField.addEventListener("focus", this._boundExpandSearchHandler, true);
    }

    public getInputField(): Element {
      return this._searchBoxField;
    }

    private _saveDOMRefs(context): void {
      this._searchBox = context;
      this._searchBoxField = this._searchBox.querySelector(SB_FIELD);
      this._searchBoxClearButton = this._searchBox.querySelector(SB_CLEAR_BUTTON);
      this._searchBoxExitButton = this._searchBox.querySelector(SB_EXIT_BUTTON);
    }

    private _disposeListeners(): void {
      this._searchBox.removeEventListener("click", this._boundExpandSearchHandler);
      this._searchBoxField.removeEventListener("focus", this._boundExpandSearchHandler);
    }

    private _exitSearchBox(event): void {
      event.stopPropagation();
      event.target.blur();
      this._clearSearchBox();
      this._collapseSearchBox();
      this._searchBox.removeEventListener("keyup", this._boundEnableClose);
      this.setCollapsedListeners();
    }

    private _collapseSearchBox(): void {
      this._searchBox.classList.remove("is-active");
      const event = document.createEvent("Event");
      event.initEvent("searchCollapse", true, true);
      this._searchBoxField.dispatchEvent(event);
    }

    private _expandSearchHandler(): void {
      this._disposeListeners();
      this._searchBox.classList.add("is-active");
      this._searchBoxField.focus();
    }

    private _enableClose(): void {
      this._setHasText();
    }

    private _setHasText() {
      if (this._searchBoxField.value.length > 0) {
        this._searchBox.classList.add(SB_HAS_TEXT);
      } else {
        this._searchBox.classList.remove(SB_HAS_TEXT);
      }
    }

    private _setFocusAction(context): void {
      this._searchBoxField.addEventListener("focus", () => {
        this._setHasText();
        this._searchBox.addEventListener("keyup", this._boundEnableClose, false);
        this._searchBox.classList.add(SB_IS_ACTIVE);
        this._searchBox.classList.add(SB_IS_ACTIVE);
      }, true);
    }

    private _clearSearchBox(event?: any): void {
      this._clearOnly = true;
      this._searchBoxField.value = "";
      this._setHasText();
      setTimeout( () => {
        this._clearOnly = false;
      }, 10);
    }

    private _setClearButtonAction() {
      if (this._searchBoxExitButton) {
        this._searchBoxExitButton.addEventListener("click", this._boundExitSearchBox, false);
      }

      this._searchBoxClearButton.addEventListener("mousedown", this._boundClearSearchBox, false);
      this._searchBoxClearButton.addEventListener("keydown", (e) => {
        let keyCode = e.keyCode;
        if (keyCode === 13) {
          this._clearSearchBox(e);
        }
      }, false);
    }

    private _handleBlur(event): void {
      if (!this._clearOnly) {
        this._searchBox.removeEventListener("keyup", this._boundEnableClose);
        setTimeout(() => {
          if (!this._searchBox.contains(document.activeElement)) {
            this._clearSearchBox();
            this._collapseSearchBox();
            this.setCollapsedListeners();
          }
        }, 10);
      } else {
        this._searchBoxField.focus();
      }
      this._clearOnly = false;
    }

    private _setBlurAction(): void {
      this._searchBoxField.addEventListener("blur", this._boundHandleBlur, true);
      this._searchBoxClearButton.addEventListener("blur", this._boundHandleBlur, true);
    }

    private _checkState(): void {
      if (this._searchBox.classList.contains("is-collapsed")) {
        this.setCollapsedListeners();
      }
    }

    private _addAnimation(): void {
      this._container.classList.add(SB_IS_ANIMATED);
    }
  }
}
