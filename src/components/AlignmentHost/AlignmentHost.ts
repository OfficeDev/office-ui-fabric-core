// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * ContextualHost
 *
 * Hosts contextual menus and callouts
 * NOTE: Position bottom only works if html is set to max-height 100%, overflow hidden and body is set to overflow scroll, body is set to height 100%
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
  const ALIGNMENT_STATE_POSITIONED = "is-positioned";
  const ALIGNMENT_CLASS = "ms-AlignmentHost";
  const ALIGNMENT_INNER_CLASS = "ms-AlignmentHost-inner";

  export class AlignmentHost {

    private _contextualHost;
    private _alignmentClone;
    private _alignmentWidth;
    private _alignmentHeight;
    private _teWidth;
    private _teHeight;
    private _direction;
    private _container;
    private _targetElement;
    private _matchTargetWidth;
    private _children;
    
    constructor(children: Element, direction: string, targetElement: Element, matchTargetWidth?: boolean) {
      this._resizeAction = this._resizeAction.bind(this);
      this._disMissAction = this._disMissAction.bind(this);
      this._matchTargetWidth = matchTargetWidth || false;
      this._direction = direction;
      
      this._children = children;
      this._container = this._createAlignmentContainer();
      
      this._targetElement = targetElement;
      
      this._openalignment();
      this._setResizeDisposal();
    }

    public disposealignment(): void {
      window.removeEventListener("resize", this._resizeAction, false);
      document.removeEventListener("click", this._disMissAction, true);
      this._alignmentClone.parentNode.removeChild(this._alignmentClone);
    }
    
    private _createAlignmentContainer(): Element {
      let _aContainer = document.createElement("div");
      _aContainer.setAttribute("class", ALIGNMENT_CLASS);
      let _aInnerContainer = document.createElement("div");
      _aInnerContainer.setAttribute("class", ALIGNMENT_INNER_CLASS);
      _aInnerContainer.appendChild(this._children);
      _aContainer.appendChild(_aInnerContainer);
      return _aContainer;
    }

    private _openalignment(): void {
      this._renderAlignment();
      
      this._savealignmentSize();
      this._findAvailablePosition();
      this._showalignment();

      // Delay the click setting
      setTimeout( () => { this._setDismissClick(); }, 100);
    }

    private _findAvailablePosition(): void {
      let _posOk;

      switch (this._direction) {
        case "left":
          // Try the right side
          _posOk = this._positionOk(
            this._tryPosalignmentLeft.bind(this),
            this._tryPosalignmentRight.bind(this),
            this._tryPosalignmentBottom.bind(this),
            this._tryPosalignmentTop.bind(this)
          );
          this._setPosition(_posOk);
          break;
        case "right":
          _posOk = this._positionOk(
            this._tryPosalignmentRight.bind(this),
            this._tryPosalignmentLeft.bind(this),
            this._tryPosalignmentBottom.bind(this),
            this._tryPosalignmentTop.bind(this)
          );
          this._setPosition(_posOk);
          break;
        case "top":
          _posOk = this._positionOk(
            this._tryPosalignmentTop.bind(this),
            this._tryPosalignmentBottom.bind(this)
          );
          this._setPosition(_posOk);
        break;
        case "bottom":
          _posOk = this._positionOk(
            this._tryPosalignmentBottom.bind(this),
            this._tryPosalignmentTop.bind(this)
          );
          this._setPosition(_posOk);
        break;
        default:
        this._setPosition();
      }
    }

    private _showalignment(): void {
      this._alignmentClone.classList.add(CONTEXT_STATE_CLASS);
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
      
      if(this._matchTargetWidth) {
        mWidth = "width: " + this._alignmentWidth + 'px;';
      }

      switch (curDirection) {
        case "left":
          mHLeft = teLeft - this._alignmentWidth;
          mHTop = this._calcTop(this._alignmentHeight, teHeight, teTop);
          this._alignmentClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._alignmentClone.classList.add(alignment_STATE_POSITIONED);
        break;
        case "right":
          mHTop = this._calcTop(this._alignmentHeight, teHeight, teTop);
          mHLeft = teRight;
          this._alignmentClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._alignmentClone.classList.add(alignment_STATE_POSITIONED);
        break;
        case "top":
          mHLeft = this._calcLeft(this._alignmentWidth, this._teWidth, teLeft);
          mHTop = teTop - this._alignmentHeight;
          // mHTop += this._targetElement.offsetParent ? this._targetElement.offsetParent.scrollTop : 0;
          mHTop += window.scrollY ? window.scrollY : 0;
          this._alignmentClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._alignmentClone.classList.add(alignment_STATE_POSITIONED);
        break;
        case "bottom":
          mHLeft = mHLeft = this._calcLeft(this._alignmentWidth, this._teWidth, teLeft);
          mHTop = teTop + teHeight;
          // mHTop += this._targetElement.offsetParent ? this._targetElement.offsetParent.scrollTop : 0;
          mHTop += window.scrollY ? window.scrollY : 0;
          this._alignmentClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._alignmentClone.classList.add(alignment_STATE_POSITIONED);
        break;
        default:
          this._alignmentClone.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
      }
    }

    private _tryPosalignmentLeft(): boolean | string {

      let teLeft = this._targetElement.getBoundingClientRect().left;

      if (teLeft < this._alignmentWidth) {
        return false;
      } else {
        return "left";
      }
    }

    private _tryPosalignmentRight(): boolean | string {

      let teRight = this._targetElement.getBoundingClientRect().right;
      let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

      if ((w - teRight) < this._alignmentWidth) {
      return false;
      } else {
      return "right";
      }
    }

    private _tryPosalignmentBottom(): boolean | string {

      let teBottom = window.innerHeight - this._targetElement.getBoundingClientRect().bottom;

      if (teBottom < this._alignmentHeight) {
        return false;
      } else {
        return "bottom";
      }
    }

    private _tryPosalignmentTop(): boolean | string {

      let teTop = this._targetElement.getBoundingClientRect().top;

      if (teTop < this._alignmentHeight) {
        return false;
      } else {
        return "top";
      }
    }

    private _renderAlignment(): void {
      document.body.appendChild(this._alignmentClone);
    }
    
    private _savealignmentSize(): void {
      let _alignmentStyles = window.getComputedStyle(this._alignmentClone);
      this._alignmentClone.setAttribute("style", "opacity: 0; z-index: -1");
      this._alignmentClone.classList.add(alignment_STATE_POSITIONED);
      this._alignmentClone.classList.add(CONTEXT_STATE_CLASS);
      
      if(this._matchTargetWidth) {
        let teStyles = window.getComputedStyle(this._targetElement);
        this._alignmentWidth = this._targetElement.getBoundingClientRect().width
          + (parseInt(teStyles.marginLeft, 10)
          + parseInt(teStyles.marginLeft, 10));
        // Set the ContextualHost width
       
      } else {
        this._alignmentWidth = this._alignmentClone.getBoundingClientRect().width
          + (parseInt(_alignmentStyles.marginLeft, 10)
          + parseInt(_alignmentStyles.marginRight, 10));
         this._alignmentClone.setAttribute("style", "");
      }
      
      this._alignmentHeight = this._alignmentClone.getBoundingClientRect().height
        + (parseInt(_alignmentStyles.marginTop, 10)
        + parseInt(_alignmentStyles.marginBottom, 10));
     
      this._alignmentClone.classList.remove(ALIGNMENT_STATE_POSITIONED);
      this._alignmentClone.classList.remove(CONTEXT_STATE_CLASS);
      this._teWidth = this._targetElement.getBoundingClientRect().width;
      this._teHeight = this._targetElement.getBoundingClientRect().height;
    }

    private _disMissAction(e): void {
      // If the elemenet clicked is not INSIDE of searchbox then close seach
      if (!this._alignmentClone.contains(e.target) && e.target !== this._alignmentClone) {
        this.disposealignment();
      }
    }

    private _setDismissClick() {
      document.addEventListener("click", this._disMissAction, true);
    }

    private _resizeAction() {
      this.disposealignment();
    }

    private _setResizeDisposal() {
      window.addEventListener("resize", this._resizeAction, false);
    }
  }
}
