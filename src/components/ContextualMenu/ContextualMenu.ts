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
    private _subId: number;
    private _subMenuLookup:{ [key: number]: HTMLElement};

    constructor(container: HTMLElement, hostTarget: HTMLElement, position?: string) {
      this._container = container;
      this._hostTarget = hostTarget;
      this._position = position ? position : MODAL_POSITION;
      this._subId = 0;
      this._subMenuLookup = {};
      this._setOpener(hostTarget);
    }

    private _setOpener(hostTarget: HTMLElement): void {
      hostTarget.addEventListener("click", (event) => {
          event.preventDefault();
          this._openContextMenu(event);
        }
      );
    }
    
    private _setSubmenuOpener(hostTarget: HTMLElement): void {
      console.log('hsttarget: ', hostTarget);
      hostTarget.addEventListener("click", (event) => {
          event.preventDefault();
          console.log(event.target);
          //this._openSubContextMenu(event);
        }
      );
    }

    private _openContextMenu(event) {
      this._createModalHostView(this._container, MODAL_POSITION, this._hostTarget);
      this._checkForSubmenus(this._container);
    }
    
    private _openSubContextMenu(event) {
      const subId: number = event.target.getAttribute("data-sub-id").toString();
      const container: HTMLElement = this._subMenuLookup[subId];
      this._createModalHostView(container, SUBMENU_POSITION, event.target);
      this._checkForSubmenus(container);
    }
    
    private _checkForSubmenus(container: HTMLElement): void {
      const submenus: NodeListOf<Element> = container.querySelectorAll(".ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu");
      let i: number = submenus.length;
      while (i--) {
        this._subId++;
        const button: HTMLElement = <HTMLElement>submenus[i].querySelector(".ms-ContextualMenu-link");
        submenus[i].setAttribute("data-sub-id", this._subId.toString());
        const menu: HTMLElement = <HTMLElement>submenus[i].querySelector(".ms-ContextualMenu");
        this._subMenuLookup[this._subId] = menu;
        this._setSubmenuOpener(<HTMLElement>submenus[i]);
      }
    }

    private _createModalHostView(container: HTMLElement, position: string, hostTarget: HTMLElement) {
      //Create Contextual menu
      const containerCopy = <HTMLElement>container.cloneNode(true);
      containerCopy.classList.remove("is-hidden");
      new fabric.ContextualHost(containerCopy, position, hostTarget);
    }
  }
}
