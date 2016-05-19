
/// <reference path="../ContextualHost/ContextualHost.ts"/>

  /**
   * Facepile
   *
   * A host for Facepile
   *
   */

namespace fabric {

  // const CONTEXTUAL_HOST_CLASS = ".ms-ContextualHost";
  const MODAL_POSITION = "top";

  export class Persona {

    private _persona: Element;
    private _personaCard: Element;
    private _contextualHostInstance: ContextualHost;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Facepile
     * @constructor
     */
    constructor(container: Element) {
      this._persona = container;
      // If Persona Card and Contextual host exist continue
      // this._contextualHost = this._persona.querySelector(CONTEXTUAL_HOST_CLASS);
      this._personaCard = this._persona.querySelector(".ms-PersonaCard");

      if (this._personaCard) {
        this._assignEvents();
        this._personaCard.setAttribute("style", "display: none;");
      }
    }

    private _createContextualHostInstance() {
      this._personaCard.setAttribute("style", "display: block;");
      this._contextualHostInstance = new fabric.ContextualHost(
        <HTMLElement>this._personaCard, 
        MODAL_POSITION, 
        this._persona
      );
    }

    private _personaEventHandler() {
      this._createContextualHostInstance();
    }

    private _assignEvents() {
      this._persona.addEventListener("click", this._personaEventHandler.bind(this), false);
    }
  }
}
