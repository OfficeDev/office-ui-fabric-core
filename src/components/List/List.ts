// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../ListItem/ListItem.ts"/>
"use strict";

namespace fabric {
  /**
   * List Item Plugin
   *
   * Adds basic demonstration functionality to .ms-List components.
   *
   */
  export class List {

    private _container: HTMLElement;
    private _listItemComponents: ListItem[];

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of List
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._container = container;
      this._listItemComponents = [];
      let choiceFieldElements: NodeListOf<Element> = this._container.querySelectorAll(".ms-ListItem");
      for (let i: number = 0; i < choiceFieldElements.length; i++) {
            this._listItemComponents[i] =  new fabric.ListItem(<HTMLElement>choiceFieldElements[i]);
        }
    }
  }
}
