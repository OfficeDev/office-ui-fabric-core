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

  export class SearchBox {

    private _searchBoxField;
    private _searchBox;
    private _searchBoxClearButton;
    private _searchBoxExitButton;
    private _container: HTMLElement;
    private _boundHandleOutsideSearchClick;
    private _boundExpandSearchHandler;
    private _boundEnableClose;
    private _boundCollapseSearchBox;
    private _boundClearSearchBox;
    private _boundHandleBlur;
    private _boundExistSearchBox;

    constructor(container: HTMLElement) {
      this._container = container;
      this._saveDOMRefs(this._container);
      this._boundHandleOutsideSearchClick = this._handleOutsideSearchClick.bind(this);
      this._boundExpandSearchHandler = this._expandSearchHandler.bind(this);
      this._boundEnableClose = this._enableClose.bind(this);
      this._boundCollapseSearchBox = this._collapseSearchBox.bind(this);
      this._boundClearSearchBox = this._clearSearchBox.bind(this);
      this._boundHandleBlur = this._handleBlur.bind(this);
      this._boundExistSearchBox = this._exitSearchBox.bind(this);
      this._setHasText();
      this._setFocusAction(this._container);
      this._setClearButtonAction();
      this._setBlurAction();
      this._checkState();
    }

    public setCollapsedListeners(): void {
      this._disposeListeners();
      this._searchBox.addEventListener("click", this._boundExpandSearchHandler, false);
      this._searchBoxField.addEventListener("focus", this._boundExpandSearchHandler, true);
    }

    public getInputField(): Element {
      return this._searchBoxField;
    }

    public dispose(): void {
      console.log('disposing...');
      this._disposeListeners();
    }

    private _saveDOMRefs(context): void {
      this._searchBox = context;
      this._searchBoxField = this._searchBox.querySelector(SB_FIELD);
      this._searchBoxClearButton = this._searchBox.querySelector(SB_CLEAR_BUTTON);
      this._searchBoxExitButton = this._searchBox.querySelector(SB_EXIT_BUTTON);
    }

    private _hasClass(element, cls): boolean {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
    }

    private _disposeListeners(): void {
      this._searchBox.removeEventListener("click", this._boundExpandSearchHandler);
      this._searchBoxField.removeEventListener("focus", this._boundExpandSearchHandler);
      this._searchBox.removeEventListener("keyup", this._boundEnableClose);
      this._searchBoxExitButton.removeEventListener("click", this._boundExistSearchBox);
      document.removeEventListener("click", this._boundHandleOutsideSearchClick);
      this._searchBoxField.removeEventListener("blur", this._boundHandleBlur);
      this._searchBoxClearButton.removeEventListener("blur", this._boundHandleBlur);
    }

    private _handleOutsideSearchClick(e): void {
      // If the elemenet clicked is not INSIDE of searchbox then close seach
      if (!this._searchBox.contains(e.target) && e.target !== this._searchBox) {
        this._collapseSearchBox();
        document.removeEventListener("click", this._boundHandleOutsideSearchClick);
        this._searchBoxExitButton.removeEventListener("click", this._boundExistSearchBox);
        this.setCollapsedListeners();
      }
    }

    private _exitSearchBox(event): void {
      event.stopPropagation();
      this._collapseSearchBox();
      this._handleBlur();
      document.removeEventListener("click", this._boundHandleOutsideSearchClick);
      this._searchBoxExitButton.removeEventListener("click", this._boundExistSearchBox);
      this.setCollapsedListeners();
    }

    private _collapseSearchBox(): void {
      this._searchBox.classList.remove("is-active");
      console.log('dispatchEvent');
      this._searchBoxField.dispatchEvent(new Event("searchCollapse"));
    }

    private _expandSearchHandler(): void {
      this._disposeListeners();
      this._searchBox.classList.add("is-active");
      this._searchBoxField.focus();
      this._searchBoxExitButton.removeEventListener("click", this._boundExistSearchBox);
      document.addEventListener("click", this._boundHandleOutsideSearchClick, false);
      this._searchBoxExitButton.addEventListener("click", this._boundExistSearchBox, false);
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
      }, true);
    }

    private _clearSearchBox(): void {
      this._searchBoxField.value = "";
      this._setHasText();
    }

    private _setClearButtonAction() {
      this._searchBoxClearButton.addEventListener("mousedown", this._boundClearSearchBox, false);
      this._searchBoxClearButton.addEventListener("keydown", (e) => {
        let keyCode = e.keyCode;
        if (keyCode === 13) {
          this._clearSearchBox();
        }
      }, false);
    }

    private _handleBlur(): void {
      this._searchBox.removeEventListener("keyup", () => { this._enableClose(); });
      setTimeout(() => {
        if (!this._searchBox.contains(document.activeElement)) {
          this._clearSearchBox();
        }
      }, 10);
    }

    private _setBlurAction(): void {
      this._searchBoxField.addEventListener("blur", this._boundHandleBlur, true);
      this._searchBoxClearButton.addEventListener("blur", this._boundHandleBlur, true);
    }

    private _checkState(): void {
      if (this._hasClass(this._searchBox, "is-collapsed")) {
        this.setCollapsedListeners();
      }
    }
  }
}
