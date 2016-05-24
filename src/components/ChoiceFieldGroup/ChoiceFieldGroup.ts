// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../RadioButton/RadioButton.ts"/>
"use strict";

namespace fabric {
  /**
   * ChoiceFieldGroup Plugin
   *
   * Adds basic demonstration functionality to .ms-ChoiceFieldGroup components.
   *
  */
  export class ChoiceFieldGroup {

    private _choiceFieldGroup: HTMLElement;
    private _choiceFieldComponents: RadioButton[];

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of ChoiceFieldGroup
     * @constructor
     */
    constructor(container: HTMLElement) {
      this._choiceFieldGroup = container;
      this._choiceFieldComponents = [];
      this._initalSetup();
      this._addListeners();
    }

    public removeListeners(): void {
      this._choiceFieldGroup.removeEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this));
    }

    private _initalSetup(): void {
        let choiceFieldElements: NodeListOf<Element> = this._choiceFieldGroup.querySelectorAll(".ms-RadioButton");
        for (let i: number = 0; i < choiceFieldElements.length; i++) {
            this._choiceFieldComponents[i] =  new fabric.RadioButton(<HTMLElement>choiceFieldElements[i]);
        }
    }

    private _addListeners(): void {
      document.addEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this), false);
    }

    private _ChoiceFieldHandler(event: CustomEvent): void {
        let name: string = event.detail.name;
        let selectedChoice: RadioButton = <RadioButton>event.detail.item;
        if ( this._choiceFieldGroup.id === name) {
            for (let i: number = 0; i < this._choiceFieldComponents.length; i++) {
                this._choiceFieldComponents[i].unCheck();
            }
            selectedChoice.check();
        }
    }
  }
}
