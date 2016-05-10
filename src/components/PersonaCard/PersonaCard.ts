// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";

namespace fabric {


  /**
   *
   * Adds basic demonstration functionality to .ms-PersonaCard components.
   *
   */
  export class PersonaCard {

    private _container: HTMLElement;
    private _actions: HTMLElement;
    private _expander: HTMLElement;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of PersonaCard
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      const activeElement: HTMLElement = <HTMLElement>this._container.querySelector(".ms-PersonaCard-action.is-active");
      const activeId = activeElement.getAttribute("data-action-id");
      this._actions = <HTMLElement>this._container.querySelector(".ms-PersonaCard-actions");
      this._expander = <HTMLElement>this._container.querySelector(".ms-PersonaCard-detailExpander");
      this._actions.addEventListener("click", this._onActionClick.bind(this), false);
      this._expander.addEventListener("click", this._onExpanderClick.bind(this), false);
      this._setDetail(activeId);
    }

    public removeListeners(): void {
      this._actions.removeEventListener("click", this._onActionClick.bind(this));
      this._expander.removeEventListener("click", this._onExpanderClick.bind(this));
    }
    
    private _onExpanderClick(event: Event): void {
      const parent: HTMLElement = (<HTMLElement>event.target).parentElement;
      if (parent.classList.contains("is-collapsed")) {
        parent.classList.remove("is-collapsed");
      } else {
        parent.classList.add("is-collapsed");
      }
    }

    private _onActionClick(event: Event): void {
      const target: HTMLElement = <HTMLElement>event.target;
      const actionId: string = target.getAttribute("data-action-id");
      if (actionId && target.className.indexOf("is-active") === -1) {
        this._setAction(target);
        this._setDetail(actionId);
      }
    }

    private _setAction(target: HTMLElement): void {
      const activeElement: HTMLElement = <HTMLElement>this._container.querySelector(".ms-PersonaCard-action.is-active");
      activeElement.classList.remove("is-active");
      target.classList.add("is-active");
    }

    private _setDetail(activeId: string): void {
      const selector: string = ".ms-PersonaCard-details[data-detail-id='" + activeId + "']";
      const lastDetail: HTMLElement = <HTMLElement>this._container.querySelector(".ms-PersonaCard-details.is-active");
      const activeDetail: HTMLElement = <HTMLElement>this._container.querySelector(selector);
      if (lastDetail) {
        lastDetail.classList.remove("is-active");
      }
      activeDetail.classList.add("is-active");
    }
  }
}
