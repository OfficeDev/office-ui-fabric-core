// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>
/// <reference path="../Button/Button.ts"/>


namespace fabric {

  const CONTEXT_CLASS = ".ms-ContextualHost";
  const CB_SPLIT_CLASS = ".ms-CommandButton-splitIcon";
  const CB_BUTTON_CLASS = ".ms-CommandButton-button";
  const MODAL_POSITION = "bottom";
  const SUBMENU_POSITION = "right";

  export class ContextualMenu {

    private _container: HTMLElement;
    private _hostTarget: HTMLElement;
    private _position: string;
    private _host: ContextualHost;

    constructor(container: HTMLElement, hostTarget: HTMLElement, position?: string) {
      this._container = container;
      this._hostTarget = hostTarget;
      this._position = position ? position : MODAL_POSITION;
      this._setOpener(hostTarget);
    }
    
    public getHost(): ContextualHost {
      return this._host;
    }

    private _setOpener(hostTarget: HTMLElement): void {
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
    
    private _checkForSubmenus(container: HTMLElement): void {
      const submenus: NodeListOf<Element> = container.querySelectorAll(".ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu");
      let i: number = submenus.length;
      if (submenus.length) {
        while (i--) {
          console.log('do submenu');
          const button: HTMLElement = <HTMLElement>submenus[i].querySelector(".ms-ContextualMenu-link");
          const menu: HTMLElement = <HTMLElement>submenus[i].querySelector(".ms-ContextualMenu");
          if (menu) {
            const contextualMenu: ContextualMenu = new fabric.ContextualMenu(menu, button, SUBMENU_POSITION);
            menu.addEventListener("hostAdded", () => {
              this._host.setChildren(contextualMenu.getHost());
            });
          }
          
        }
      }
    }

    private _createModalHostView(container: HTMLElement, position: string, hostTarget: HTMLElement) {
      //Create Contextual menu
      container.classList.remove("is-hidden");
      this._host = new fabric.ContextualHost(container, position, hostTarget);
      container.dispatchEvent(new Event("hostAdded"));
    }
  }
}
