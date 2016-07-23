// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

/// <reference path="../../utilities/Animate.ts"/>
/// <reference path="../../utilities/Ease.ts"/>

namespace fabric {

  /**
   *
   * Adds basic demonstration functionality to .ms-PersonaCard components.
   *
   */
  export class PersonaCard {

    private _container: Element;
    private _actions: Element;
    private _expander: Element;
    private _actionDetailBox: HTMLElement;
    private _boundOnActionClick;
    private _boundOnExpanderClick;
    private _boundOnTab;

    /**
     *
     * @param {Element} container - the target container for an instance of PersonaCard
     * @constructor
     */
    constructor(container: Element) {
      this._container = container;
      const activeElement: Element = <Element>this._container.querySelector(".ms-PersonaCard-action.is-active");
      const activeId = activeElement.getAttribute("data-action-id");
      this._actions = <Element>this._container.querySelector(".ms-PersonaCard-actions");
      this._expander = <Element>this._container.querySelector(".ms-PersonaCard-detailExpander");
      this._actionDetailBox = <HTMLElement>this._container.querySelector(".ms-PersonaCard-actionDetailBox");
      this._setDetail(activeId);
      this._boundOnActionClick = this._onActionClick.bind(this);
      this._boundOnExpanderClick = this._onExpanderClick.bind(this);
      this._boundOnTab = this._onTab.bind(this);
      this._addListeners();
    }

    public removeListeners(): void {
      this._actions.removeEventListener("click", this._boundOnActionClick);
      this._expander.removeEventListener("click", this._boundOnExpanderClick);
      this._container.removeEventListener("keydown", this._boundOnTab);
    }

    private _addListeners(): void {
      this._actions.addEventListener("click", this._boundOnActionClick, false);
      this._expander.addEventListener("click", this._boundOnExpanderClick, false);
      this._container.addEventListener("keydown", this._boundOnTab, false);
    }

    private _onTab(event: KeyboardEvent): void {
      const target: Element = <Element>event.target;
      if (event.keyCode === 9 && target.classList.contains("ms-PersonaCard-action")) {
        this._onActionClick(event);
      }
    }

    private _onExpanderClick(event: Event): void {
      const parent: Element = (<Element>event.target).parentElement;
      if (parent.classList.contains("is-collapsed")) {
        parent.classList.remove("is-collapsed");
      } else {
        parent.classList.add("is-collapsed");
      }
      const parentHeight: number = parent.clientHeight;
      this._animateDetail(parentHeight);
    }

    private _onActionClick(event: Event): void {
      const target: Element = <Element>event.target;
      const actionId: string = target.getAttribute("data-action-id");
      if (actionId && target.className.indexOf("is-active") === -1) {
        this._setAction(target);
        this._setDetail(actionId);
      }
    }

    private _setAction(target: Element): void {
      const activeElement: Element = <Element>this._container.querySelector(".ms-PersonaCard-action.is-active");
      activeElement.classList.remove("is-active");
      target.classList.add("is-active");
    }

    private _setDetail(activeId: string): void {
      const selector: string = ".ms-PersonaCard-details[data-detail-id='" + activeId + "']";
      const lastDetail: Element = <Element>this._container.querySelector(".ms-PersonaCard-details.is-active");
      const activeDetail: Element = <Element>this._container.querySelector(selector);

      if (lastDetail) {
        lastDetail.classList.remove("is-active");
      }

      activeDetail.classList.add("is-active");
      const detailHeight: number = activeDetail.clientHeight;
      this._animateDetail(detailHeight);
    }

    private _animateDetail(height: number): void {
      this._actionDetailBox.style.overflowY = "hidden";
      fabric.Animate.transition(this._actionDetailBox, {
        height: height,
        duration: 0.25,
        ease: Ease.SINE_EASE_OUT,
        onEnd: () => {
            this._actionDetailBox.style.overflowY = "auto";
          }
        });
    }
  }
}
