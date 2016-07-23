// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>
/// <reference path="../Button/Button.ts"/>


namespace fabric {

  const MODAL_POSITION = "bottom";
  const SUBMENU_POSITION = "right";

  export class ContextualMenu {

    private _container: Element;
    private _hostTarget: Element;
    private _position: string;
    private _host: ContextualHost;

    constructor(container: Element, hostTarget: Element, position?: string) {
      this._container = container;
      this._hostTarget = hostTarget;
      this._position = position ? position : MODAL_POSITION;
      this._setOpener(hostTarget);
      this._init();
    }

    public getHost(): ContextualHost {
      return this._host;
    }

    private _init(): void {
      this._container.addEventListener("click", this._onContextualMenuClick.bind(this), true);
    }

    private _onContextualMenuClick(event: Event): void {
      const target: HTMLElement = <HTMLElement>event.target;
      const classList: DOMTokenList = target.classList;
      if (classList.contains("ms-ContextualMenu-link") && !classList.contains("is-disabled")) {
        if (this._container.classList.contains("ms-ContextualMenu--multiselect")) {
          this._multiSelect(target);
        } else {
          this._singleSelect(target);
        }
      }
    }

    private _multiSelect(target: HTMLElement): void {
      if (target.classList.contains("is-selected")) {
        target.classList.remove("is-selected");
      } else {
        target.classList.add("is-selected");
      }
    }

    private _singleSelect(target: Element): void {
      const selecteds: NodeListOf<Element> = this._container.querySelectorAll(".is-selected");
      let i: number = selecteds.length;
      while (i--) {
        selecteds[i].classList.remove("is-selected");
      }
      target.classList.add("is-selected");
    }

    private _setOpener(hostTarget: Element): void {
      hostTarget.addEventListener("click", (event) => {
          event.preventDefault();
          this._openContextMenu(event);
        }
      );
    }

    private _openContextMenu(event) {
      this._createModalHostView(this._container, this._position, this._hostTarget);
      this._checkForSubmenus(this._container);
    }

    private _checkForSubmenus(container: Element): void {
      const submenus: NodeListOf<Element> = container.querySelectorAll(".ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu");
      let i: number = submenus.length;
      if (submenus.length) {
        while (i--) {
          const button: Element = submenus[i].querySelector(".ms-ContextualMenu-link");
          const menu: Element = submenus[i].querySelector(".ms-ContextualMenu");
          if (menu) {
            const contextualMenu: ContextualMenu = new fabric.ContextualMenu(menu, button, SUBMENU_POSITION);
            menu.addEventListener("hostAdded", () => {
              this._host.setChildren(contextualMenu.getHost());
            });
          }
        }
      }
    }

    private _createModalHostView(container: Element, position: string, hostTarget: Element) {
      container.classList.remove("is-hidden");
      this._host = new fabric.ContextualHost(<HTMLElement>container, position, hostTarget, false);
      let event: Event = document.createEvent("Event");
      event.initEvent("hostAdded", true, true);
      container.dispatchEvent(event);
    }
  }
}
