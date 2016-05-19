// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../../../dist/js/fabric.templates.ts"/>

/**
 * ContextualHost
 *
 * Hosts contextual menus and callouts
 * NOTE: Position bottom only works if html is set to max-height 100%, overflow hidden
 * and body is set to overflow scroll, body is set to height 100%
 *
 */

/**
 * @namespace fabric
 */
namespace fabric {
  /**
   *
   * @constructor
   */

  const CONTEXT_STATE_CLASS = "is-open";
  const MODAL_STATE_POSITIONED = "is-positioned";

  export class ContextualHost {

    private _contextualHost;
    private _modalClone;
    private _modalWidth;
    private _modalHeight;
    private _teWidth;
    private _teHeight;
    private _direction;
    private _container;
    private _targetElement;
    private _matchTargetWidth;
    private _ftl = new FabricTemplateLibrary();
    private _contextualHostMain: Element;

    constructor(content: HTMLElement, direction: string, targetElement: Element, matchTargetWidth?: boolean) {
      this._resizeAction = this._resizeAction.bind(this);
      this._disMissAction = this._disMissAction.bind(this);
      this._matchTargetWidth = matchTargetWidth || false;
      this._direction = direction;
      this._container = this._ftl.ContextualHost();
      this._contextualHost = this._container;
      this._contextualHostMain = this._contextualHost.querySelector(".ms-ContextualHost-main");
      this._contextualHostMain.appendChild(content);
      
      this._targetElement = targetElement;
      this._cloneModal();
      this._openModal();
      this._setResizeDisposal();
    }

    public disposeModal(): void {
      window.removeEventListener("resize", this._resizeAction, false);
      document.removeEventListener("click", this._disMissAction, true);
      this._modalClone.parentNode.removeChild(this._modalClone);
    }

    private _openModal(): void {
      this._copyModalToBody();
      this._saveModalSize();
      this._findAvailablePosition();
      this._showModal();

      // Delay the click setting
      setTimeout( () => { this._setDismissClick(); }, 100);
    }

    private _findAvailablePosition(): void {
      let _posOk;

      switch (this._direction) {
        case "left":
          // Try the right side
          _posOk = this._positionOk(
            this._tryPosModalLeft.bind(this),
            this._tryPosModalRight.bind(this),
            this._tryPosModalBottom.bind(this),
            this._tryPosModalTop.bind(this)
          );
          this._setPosition(_posOk);
          break;
        case "right":
          _posOk = this._positionOk(
            this._tryPosModalRight.bind(this),
            this._tryPosModalLeft.bind(this),
            this._tryPosModalBottom.bind(this),
            this._tryPosModalTop.bind(this)
          );
          this._setPosition(_posOk);
          break;
        case "top":
          _posOk = this._positionOk(
            this._tryPosModalTop.bind(this),
            this._tryPosModalBottom.bind(this)
          );
          this._setPosition(_posOk);
        break;
        case "bottom":
          _posOk = this._positionOk(
            this._tryPosModalBottom.bind(this),
            this._tryPosModalTop.bind(this)
          );
          this._setPosition(_posOk);
        break;
        default:
        this._setPosition();
      }
    }

    private _showModal(): void {
      this._modalClone.classList.add(CONTEXT_STATE_CLASS);
    }

    private _positionOk(pos1, pos2, pos3?, pos4?) {
      let _posOk;
      _posOk = pos1();

      if (!_posOk) {
        _posOk = pos2();
        if (!_posOk && pos3) {
          _posOk = pos3();
          if (!_posOk && pos4) {
            _posOk = pos4();
          }
        }
      }
      return _posOk;
    }

    private _calcLeft(mWidth, teWidth, teLeft): number {
      let mHalfWidth = mWidth / 2;
      let teHalf = teWidth / 2;
      let mHLeft = (teLeft + teHalf) - mHalfWidth;
      mHLeft = (mHLeft < mHalfWidth) ? teLeft : mHLeft;
      return mHLeft;
    }

    private _calcTop(mHeight, teHeight, teTop): number {
      let mHalfWidth = mHeight / 2;
      let teHalf = teHeight / 2;
      let mHLeft = (teTop + teHalf) - mHalfWidth;
      mHLeft = (mHLeft < mHalfWidth) ? teTop : mHLeft;
      return mHLeft;
    }

    private _setPosition(curDirection?: string): void {
      let teBR = this._targetElement.getBoundingClientRect();
      let teLeft = teBR.left;
      let teRight = teBR.right;
      let teTop = teBR.top;
      let teHeight = teBR.height;

      let mHLeft;
      let mHTop;
      let mWidth = "";

      if (this._matchTargetWidth) {
        mWidth = "width: " + this._modalWidth + "px;";
      }

      switch (curDirection) {
        case "left":
          mHLeft = teLeft - this._modalWidth;
          mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
          this._modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._modalClone.classList.add(MODAL_STATE_POSITIONED);
        break;
        case "right":
          mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
          mHLeft = teRight;
          this._modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._modalClone.classList.add(MODAL_STATE_POSITIONED);
        break;
        case "top":
          mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
          mHTop = teTop - this._modalHeight;
          // mHTop += this._targetElement.offsetParent ? this._targetElement.offsetParent.scrollTop : 0;
          mHTop += window.scrollY ? window.scrollY : 0;
          this._modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._modalClone.classList.add(MODAL_STATE_POSITIONED);
        break;
        case "bottom":
          mHLeft = mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
          mHTop = teTop + teHeight;
          // mHTop += this._targetElement.offsetParent ? this._targetElement.offsetParent.scrollTop : 0;
          mHTop += window.scrollY ? window.scrollY : 0;
          this._modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._modalClone.classList.add(MODAL_STATE_POSITIONED);
        break;
        default:
          this._modalClone.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
      }
    }

    private _tryPosModalLeft(): boolean | string {

      let teLeft = this._targetElement.getBoundingClientRect().left;

      if (teLeft < this._modalWidth) {
        return false;
      } else {
        return "left";
      }
    }

    private _tryPosModalRight(): boolean | string {

      let teRight = this._targetElement.getBoundingClientRect().right;
      let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

      if ((w - teRight) < this._modalWidth) {
      return false;
      } else {
      return "right";
      }
    }

    private _tryPosModalBottom(): boolean | string {

      let teBottom = window.innerHeight - this._targetElement.getBoundingClientRect().bottom;

      if (teBottom < this._modalHeight) {
        return false;
      } else {
        return "bottom";
      }
    }

    private _tryPosModalTop(): boolean | string {

      let teTop = this._targetElement.getBoundingClientRect().top;

      if (teTop < this._modalHeight) {
        return false;
      } else {
        return "top";
      }
    }

    private _copyModalToBody(): void {
      document.body.appendChild(this._modalClone);
    }

    private _cloneModal(): void {
      this._modalClone = this._contextualHost.cloneNode(true);
    }

    private _saveModalSize(): void {
      let _modalStyles = window.getComputedStyle(this._modalClone);
      this._modalClone.setAttribute("style", "opacity: 0; z-index: -1");
      this._modalClone.classList.add(MODAL_STATE_POSITIONED);
      this._modalClone.classList.add(CONTEXT_STATE_CLASS);

      if (this._matchTargetWidth) {
        let teStyles = window.getComputedStyle(this._targetElement);
        this._modalWidth = this._targetElement.getBoundingClientRect().width
          + (parseInt(teStyles.marginLeft, 10)
          + parseInt(teStyles.marginLeft, 10));
        // Set the ContextualHost width

      } else {
        this._modalWidth = this._modalClone.getBoundingClientRect().width
          + (parseInt(_modalStyles.marginLeft, 10)
          + parseInt(_modalStyles.marginRight, 10));
         this._modalClone.setAttribute("style", "");
      }
      this._modalHeight = this._modalClone.getBoundingClientRect().height
        + (parseInt(_modalStyles.marginTop, 10)
        + parseInt(_modalStyles.marginBottom, 10));

      this._modalClone.classList.remove(MODAL_STATE_POSITIONED);
      this._modalClone.classList.remove(CONTEXT_STATE_CLASS);
      this._teWidth = this._targetElement.getBoundingClientRect().width;
      this._teHeight = this._targetElement.getBoundingClientRect().height;
    }

    private _disMissAction(e): void {
      // If the element clicked is not INSIDE of searchbox then close seach
      if (!this._modalClone.contains(e.target) && e.target !== this._modalClone) {
        this.disposeModal();
      }
    }

    private _setDismissClick() {
      document.addEventListener("click", this._disMissAction, true);
      document.addEventListener("keyup", (e: KeyboardEvent) => (e.keyCode === 32 || e.keyCode === 27) ? this._disMissAction(e) : null, true);
    }

    private _resizeAction() {
      this.disposeModal();
    }

    private _setResizeDisposal() {
      window.addEventListener("resize", this._resizeAction, false);
    }
  }
}
