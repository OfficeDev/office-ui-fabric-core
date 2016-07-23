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
  const CONTEXT_HOST_MAIN_CLASS = ".ms-ContextualHost-main";
  const CONTEXT_HOST_BEAK_CLASS = ".ms-ContextualHost-beak";
  const ARROW_LEFT_CLASS = "ms-ContextualHost--arrowLeft";
  const ARROW_TOP_CLASS = "ms-ContextualHost--arrowTop";
  const ARROW_BOTTOM_CLASS = "ms-ContextualHost--arrowBottom";
  const ARROW_RIGHT_CLASS = "ms-ContextualHost--arrowRight";
  const MODIFIER_BASE = "ms-ContextualHost--";
  const HAS_SUBMENU = "ms-ContextualMenu-item--hasMenu";
  const ARROW_SIZE = 28;
  const ARROW_OFFSET = 8;

  export class ContextualHost {

    // tracks all contextualhosts to dismiss them when submenus are dismissed
    public static hosts: Array<ContextualHost>;

    private _contextualHost;
    private _modalWidth;
    private _modalHeight;
    private _teWidth;
    private _teHeight;
    private _direction;
    private _container;
    private _disposalCallback: Function;
    private _targetElement;
    private _matchTargetWidth;
    private _ftl = new FabricTemplateLibrary();
    private _contextualHostMain: Element;
    private _children: Array<ContextualHost>;
    private _hasArrow: boolean;
    private _arrow: Element;

    constructor(
        content: HTMLElement,
        direction: string,
        targetElement: Element,
        hasArrow: boolean = true,
        modifiers?: Array<string>,
        matchTargetWidth?: boolean,
        disposalCallback?: Function
      ) {
      this._resizeAction = this._resizeAction.bind(this);
      this._dismissAction = this._dismissAction.bind(this);
      this._matchTargetWidth = matchTargetWidth || false;
      this._direction = direction;
      this._container = this._ftl.ContextualHost();
      this._contextualHost = this._container;
      this._contextualHostMain = this._contextualHost.querySelector(CONTEXT_HOST_MAIN_CLASS);
      this._contextualHostMain.appendChild(content);
      this._hasArrow = hasArrow;
      this._arrow = this._container.querySelector(CONTEXT_HOST_BEAK_CLASS);

      this._targetElement = targetElement;
      this._openModal();
      this._setResizeDisposal();

      if (disposalCallback) {
        this._disposalCallback = disposalCallback;
      }

      if (modifiers) {
        for (let i = 0; i < modifiers.length; i++) {
          this._container.classList.add(MODIFIER_BASE + modifiers[i]);
        }
      }

      if (!ContextualHost.hosts) {
        ContextualHost.hosts = [];
      }

      ContextualHost.hosts.push(this);
    }

    public disposeModal(): void {
      if (ContextualHost.hosts.length > 0) {
        window.removeEventListener("resize", this._resizeAction, false);
        document.removeEventListener("click", this._dismissAction, true);
        this._container.parentNode.removeChild(this._container);
        if (this._disposalCallback) {
          this._disposalCallback();
        }

        // Dispose of all ContextualHosts
        let index: number = ContextualHost.hosts.indexOf(this);
        ContextualHost.hosts.splice(index, 1);

        let i: number = ContextualHost.hosts.length;
        while (i--) {
          ContextualHost.hosts[i].disposeModal();
          ContextualHost.hosts.splice(i, 1);
        }
      }
    }

    public setChildren(value: ContextualHost): void {
      if (!this._children) {
        this._children = [];
      }
      this._children.push(value);
    }

    public contains(value: HTMLElement): boolean {
      return this._container.contains(value);
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
      this._container.classList.add(CONTEXT_STATE_CLASS);
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
      let arrowTop;
      let windowY = window.scrollY ? window.scrollY : 0;
      let arrowSpace = (this._hasArrow) ? ARROW_SIZE : 0;

      if (this._matchTargetWidth) {
        mWidth = "width: " + this._modalWidth + "px;";
      }

      switch (curDirection) {
        case "left":
          mHLeft = (teLeft - this._modalWidth) + arrowSpace;
          mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
          mHTop += window.scrollY ? window.scrollY : 0;
          this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._container.classList.add(MODAL_STATE_POSITIONED);

          if (this._hasArrow) {
            this._container.classList.add(ARROW_RIGHT_CLASS);
            arrowTop = ((teTop + windowY) - mHTop) + ARROW_OFFSET;
            this._arrow.setAttribute("style", "top: " + arrowTop + "px;");
          }
        break;
        case "right":
          mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
          mHTop += windowY;
          mHLeft = teRight + arrowSpace;
          this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._container.classList.add(MODAL_STATE_POSITIONED);

          if (this._hasArrow) {
            arrowTop = ((windowY + teTop) - mHTop) + ARROW_OFFSET;
            this._arrow.setAttribute("style", "top: " + arrowTop + "px;");
            this._container.classList.add(ARROW_LEFT_CLASS);
          }
        break;
        case "top":
          mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
          mHTop = (teTop - this._modalHeight) + arrowSpace;
          mHTop += windowY;
          this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._container.classList.add(MODAL_STATE_POSITIONED);

          if (this._hasArrow) {
            this._container.classList.add(ARROW_BOTTOM_CLASS);
          }
        break;
        case "bottom":
          mHLeft = mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
          mHTop = teTop + teHeight + arrowSpace;
          mHTop += window.scrollY ? window.scrollY : 0;
          this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
          this._container.classList.add(MODAL_STATE_POSITIONED);

          if (this._hasArrow) {
            this._container.classList.add(ARROW_TOP_CLASS);
          }
        break;
        default:
          this._container.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
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
      document.body.appendChild(this._container);
    }

    private _saveModalSize(): void {
      let _modalStyles = window.getComputedStyle(this._container);
      this._container.setAttribute("style", "opacity: 0; z-index: -1");
      this._container.classList.add(MODAL_STATE_POSITIONED);
      this._container.classList.add(CONTEXT_STATE_CLASS);

      if (this._matchTargetWidth) {
        let teStyles = window.getComputedStyle(this._targetElement);
        this._modalWidth = this._targetElement.getBoundingClientRect().width
          + (parseInt(teStyles.marginLeft, 10)
          + parseInt(teStyles.marginLeft, 10));
        // Set the ContextualHost width

      } else {
        this._modalWidth = this._container.getBoundingClientRect().width
          + (parseInt(_modalStyles.marginLeft, 10)
          + parseInt(_modalStyles.marginRight, 10));
        this._container.setAttribute("style", "");
      }
      this._modalHeight = this._container.getBoundingClientRect().height
        + (parseInt(_modalStyles.marginTop, 10)
        + parseInt(_modalStyles.marginBottom, 10));

      this._container.classList.remove(MODAL_STATE_POSITIONED);
      this._container.classList.remove(CONTEXT_STATE_CLASS);
      this._teWidth = this._targetElement.getBoundingClientRect().width;
      this._teHeight = this._targetElement.getBoundingClientRect().height;
    }

    private _dismissAction(e): void {
      // If the element clicked is not INSIDE of contextualHost then close contextualHost
      if (!this._container.contains(e.target) && e.target !== this._container) {
        if (this._children !== undefined) {
          let isChild: boolean = false;
          this._children.map((child: ContextualHost) => {
            if (child !== undefined) {
              isChild = child.contains(e.target);
            }
          });
          if (!isChild) {
            this.disposeModal();
          }
        } else {
          this.disposeModal();
        }
      } else {
        if (!e.target.parentElement.classList.contains(HAS_SUBMENU)) {
          this.disposeModal();
        }
      }
    }

    private _setDismissClick() {
      document.addEventListener("click", this._dismissAction, true);
      document.addEventListener("focus", this._dismissAction, true);
      document.addEventListener("keyup", (e: KeyboardEvent) => {
        if (e.keyCode === 32 || e.keyCode === 27) {
          this._dismissAction(e);
        }
      }, true);
    }

    private _resizeAction() {
      this.disposeModal();
    }

    private _setResizeDisposal() {
      window.addEventListener("resize", this._resizeAction, false);
    }
  }
}
