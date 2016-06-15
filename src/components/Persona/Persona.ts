
/// <reference path="../ContextualHost/ContextualHost.ts"/>
/// <reference path="../PersonaCard/PersonaCard.ts"/>

  /**
   * FacePile
   *
   * A host for FacePile
   *
   */

namespace fabric {

  // const CONTEXTUAL_HOST_CLASS = ".ms-ContextualHost";
  const MODAL_POSITION = "top";

  export class Persona {

    private _persona: Element;
    private _personaCard: Element;
    private _contextualHostInstance: ContextualHost;
    private _personaCardInstance: PersonaCard;

    /**
     *
     * @param {HTMLElement} container - the target container for an instance of FacePile
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
        this._createPersonaCard();
      }
    }

    private _createPersonaCard() {
      this._personaCardInstance = new fabric.PersonaCard(this._personaCard);
    }

    private _createContextualHostInstance(): void {
      this._personaCard.setAttribute("style", "display: block;");
      this._contextualHostInstance = new fabric.ContextualHost(
        <HTMLElement>this._personaCard,
        MODAL_POSITION,
        this._persona
      );
    }

    private _personaEventHandler(): void {
      this._createContextualHostInstance();
    }

    private _assignEvents(): void {
      this._persona.addEventListener("click", this._personaEventHandler.bind(this), false);
      this._persona.addEventListener("keyup", (e: KeyboardEvent) => (e.keyCode === 32) ? this._personaEventHandler() : null, false);
    }
  }
}
