// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/// <reference path="../Button/Button.ts"/>
/// <reference path="../Button/IButton.ts"/>
/// <reference path="../../../dist/js/fabric.templates.ts"/>

/**
 * Callout
 *
 * Add callouts to things and stuff
 *
 */

namespace fabric {
  "use strict";

  export class Callout {

    private _container: Element;
    private _ftl = new FabricTemplateLibrary();

    constructor(container: Element, actions?: Array<IButton>) {
      this._container = container;

      if (actions) {
        this._processActions(actions);
      }
    }

    private _processActions(actions: Array<IButton>) {
      let _action;
      let _container;

      for (let i = 0; i < actions.length; i++) {
        _action = actions[i];
        
        
        if (_action.container) {
          _container = _action.container;
        } else {
          _container = this._ftl.Button();
          // _container.querySelector(this._ftl.Button.BUTTON_LABEL).html("text");
          // body.appendChild(_container);
        }
        
        //  var button = new fabric.Button(_container, { 
        //    "clickHandler": function(e) {
           
        //    }
        //   }
        //  );

      }
    }
  }
}
