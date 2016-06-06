// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Persona/Persona.ts"/>
/// <reference path="../Panel/Panel.ts"/>

namespace fabric {
  /**
   * FacePile
   *
   * A host for FacePile
   *
   */
  const FACEPILE_ADD_BUTTON_CLASS = ".ms-FacePile-addButton--addPerson";
  const PERSONA_CLASS = ".ms-Persona--facePile";
  const PERSONA_INITIALS = ".ms-Persona-initials";
  const PERSONA_IMAGE = ".ms-Persona-image";
  const PERSONA_PRIMARY_CLASS = ".ms-Persona-primaryText";
  const PERSONA_SECONDARY_CLASS = ".ms-Persona-secondaryText";
  const PANEL_CLASS = ".ms-Panel";

  interface PersonaCollection {
    item: Element;
    initials: string;
    image: string;
    primaryText: string;
    secondaryText: string;
    personaInstance: Persona;
  }

  export class FacePile {

    private _personaCollection: Array<PersonaCollection> = [];
    private _facePile: Element;
    private _addButton: Element;
    private _panel: Node;
    private _panelInstance: Panel;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of FacePile
     * @constructor
     */
    constructor(container: Element) {
      this._facePile = container;
      this._createPersonaCollection();
      this._addButton = this._facePile.querySelector(FACEPILE_ADD_BUTTON_CLASS);
      this._panel = this._facePile.querySelector(PANEL_CLASS);
      this._setOpenPanelClick();
    }

    private _setOpenPanelClick() {
      // var PanelDefaultExamplePanel = document.querySelector(".ms-PanelDefaultExample .ms-Panel");
      this._addButton.addEventListener("click", function() {
        this._panel = new fabric['Panel'](this._panel);
        // console.log(this._panel);
      }.bind(this), false);
    }

    private _createPersonaCollection() {
      let _personas = document.querySelectorAll(PERSONA_CLASS);
      for (let i = 0; i < _personas.length; i++) {
        let _thisPersona = _personas[i];
        this._personaCollection.push({
          item: _thisPersona,
          initials: _thisPersona.querySelector(PERSONA_INITIALS).textContent,
          image:  _thisPersona.querySelector(PERSONA_IMAGE) ?
          _thisPersona.querySelector(PERSONA_IMAGE).getAttribute("src") : null,
          primaryText: _thisPersona.querySelector(PERSONA_PRIMARY_CLASS) ?
          _thisPersona.querySelector(PERSONA_PRIMARY_CLASS).textContent : "",
          secondaryText: _thisPersona.querySelector(PERSONA_SECONDARY_CLASS) ?
          _thisPersona.querySelector(PERSONA_SECONDARY_CLASS).textContent : "",
          personaInstance: new Persona(_thisPersona)
        });
      }
    }
  }
}
