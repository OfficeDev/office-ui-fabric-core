// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * @namespace fabric
 */
namespace fabric {
  "use strict";

  /**
   * MessageBanner component
   *
   * A component to display error messages
   *
   */
  export class MessageBanner {
    public container: HTMLElement;

    private _clipper: HTMLElement;
    private _bufferSize: number;
    private _textContainerMaxWidth: number = 700;
    private _clientWidth: number;
    private _textWidth: string;
    private _initTextWidth: number;
    private _chevronButton: HTMLElement;
    private _errorBanner: HTMLElement;
    private _actionButton: HTMLElement;
    private _closeButton: HTMLElement;
    private _bufferElementsWidth: number = 88;
    private _bufferElementsWidthSmall: number = 35;
    private SMALL_BREAK_POINT: number = 480;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of MessageBanner
     * @constructor
     */
    constructor(container: HTMLElement) {
      this.container = container;
      this.init();
    }

    /**
     * initializes component
     */
    public init(): void {
      this._cacheDOM();
      this._setListeners();
      this._clientWidth = this._errorBanner.offsetWidth;
      this._initTextWidth = this._clipper.offsetWidth;
      this._onResize();
    }

    /**
     * shows banner if the banner is hidden
     */
    public showBanner(): void {
      this._errorBanner.className = "ms-MessageBanner";
    }

    /**
     * sets styles on resize
     */
    private _onResize(): void {
      this._clientWidth = this._errorBanner.offsetWidth;
      if (window.innerWidth >= this.SMALL_BREAK_POINT ) {
        this._resizeRegular();
      } else {
        this._resizeSmall();
      }
    }

    /**
     * resize above 480 pixel breakpoint
     */
    private _resizeRegular(): void {
      if ((this._clientWidth - this._bufferSize) > this._initTextWidth && this._initTextWidth < this._textContainerMaxWidth) {
        this._textWidth = "auto";
        this._chevronButton.className = "ms-MessageBanner-expand";
        this._collapse();
      } else {
        this._textWidth = Math.min((this._clientWidth - this._bufferSize), this._textContainerMaxWidth) + "px";
        if (this._chevronButton.className.indexOf("is-visible") === -1) {
          this._chevronButton.className += " is-visible";
        }
      }
      this._clipper.style.width = this._textWidth;
    }

    /**
     * resize below 480 pixel breakpoint
     */
    private _resizeSmall(): void {
      if (this._clientWidth - (this._bufferElementsWidthSmall + this._closeButton.offsetWidth) > this._initTextWidth) {
        this._textWidth = "auto";
        this._collapse();
      } else {
        this._textWidth = (this._clientWidth - (this._bufferElementsWidthSmall + this._closeButton.offsetWidth)) + "px";
      }
      this._clipper.style.width = this._textWidth;
    }

    /**
     * caches elements and values of the component
     */
    private _cacheDOM(): void {
      this._errorBanner = this.container;
      this._clipper = <HTMLElement>this.container.querySelector(".ms-MessageBanner-clipper");
      this._chevronButton = <HTMLElement>this.container.querySelector(".ms-MessageBanner-expand");
      this._actionButton = <HTMLElement>this.container.querySelector(".ms-MessageBanner-action");
      this._bufferSize = this._actionButton.offsetWidth + this._bufferElementsWidth;
      this._closeButton = <HTMLElement>this.container.querySelector(".ms-MessageBanner-close");
    }

    /**
     * expands component to show full error message
     */
    private _expand(): void {
      let icon = this._chevronButton.querySelector(".ms-Icon");
      this._errorBanner.className += " is-expanded";
      icon.className = "ms-Icon ms-Icon--chevronsUp";
    }

    /**
     * collapses component to only show truncated message
     */
    private _collapse(): void {
      let icon = this._chevronButton.querySelector(".ms-Icon");
      this._errorBanner.className = "ms-MessageBanner";
      icon.className = "ms-Icon ms-Icon--chevronsDown";
    }

    private _toggleExpansion(): void {
      if (this._errorBanner.className.indexOf("is-expanded") > -1) {
        this._collapse();
      } else {
        this._expand();
      }
    }

    private _hideMessageBanner(): void {
      this._errorBanner.className = "ms-MessageBanner is-hidden";
    }

    /**
     * hides banner when close button is clicked
     */
    private _hideBanner(): void {
      if (this._errorBanner.className.indexOf("hide") === -1) {
        this._errorBanner.className += " hide";
        setTimeout(this._hideMessageBanner.bind(this), 500);
      }
    }

    /**
     * sets handlers for resize and button click events
     */
    private _setListeners(): void {
      window.addEventListener("resize", this._onResize.bind(this), false);
      this._chevronButton.addEventListener("click", this._toggleExpansion.bind(this), false);
      this._closeButton.addEventListener("click", this._hideBanner.bind(this), false);
    }
  }
} // end fabric namespace
