// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

namespace fabric {
  /**
   * Facepile
   *
   * A host for Facepile
   *
   */
  const PERSONA_CLASS = ".ms-Persona";
  
  export class Facepile {
    
    _personaCollection: Array<Element> = [];
    _facePile: Element;
    
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Facepile
     * @constructor
     */
    constructor(container: Element) {
      this._facePile = container;
    }
    
    _createPersonaCollection() {
     //  let _personas = document.querySelector();
    }
    _createElements() {
      
    }
  }
}
