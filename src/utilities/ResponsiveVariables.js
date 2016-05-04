// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Responsive Variables
 *
 * All fabric breakpoints used in fabric
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @constructor
 */
fabric.ResponsiveVariables = function() {
  this.init();
};

fabric.ResponsiveVariables.prototype = (function() {
  
  var ResponsiveVariables = {
    "sm-min": 320,
    "md-min": 480,
    "lg-min": 640,
    "xl-min": 1024,
    "xxl-min": 1366,
    "xxxl-min": 1920
  };
  
  ResponsiveVariables["sm-max"] = minVariables["md-min"] - 1;
  ResponsiveVariables["md-max"] = minVariables["lg-min"] - 1;
  ResponsiveVariables["lg-max"] = minVariables["xl-min"] - 1;
  ResponsiveVariables["xl-max"] = minVariables["xxl-min"] - 1;
  ResponsiveVariables["xxl-max"] = minVariables["xxxl-min"] - 1;
  
  /**
   * initializes component
   */
  var init = function() {
    return ResponsiveVariables;
  };

  return {
    init: init
  };

}());