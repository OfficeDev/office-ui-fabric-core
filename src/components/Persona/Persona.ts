
/// <reference path="../ContextualHost/ContextualHost"/>

  /**
   * Facepile
   *
   * A host for Facepile
   *
   */

namespace fabric {

  const PERSONA_CLASS = ".ms-Persona";
  const CONTEXTUAL_HOST_CLASS = ".ms-ContextualHost";
  const MODAL_POSITION = "top";
  
  export class Persona {
    
    _persona: Element;
    _contextualHost: Element;
    _contextualHostInstance: ContextualHost;
    
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Facepile
     * @constructor
     */
    constructor(container: Element) {
      this._persona = container;
      //If Persona Card and Contextual host exist continue
      this._contextualHost = this._persona.querySelector(CONTEXTUAL_HOST_CLASS);
      
      if(this._contextualHost) {
        this._assignEvents();
      }
    }
    
    private _createContextualHostInstance() {
      this._contextualHostInstance = new fabric.ContextualHost(<HTMLElement>this._contextualHost, MODAL_POSITION, this._persona);
    }
    
    private _personaEventHandler() {
      this._createContextualHostInstance();
    }
    
    private _assignEvents() {
      this._persona.addEventListener("click", this._personaEventHandler.bind(this), false);
    }
  }
}
