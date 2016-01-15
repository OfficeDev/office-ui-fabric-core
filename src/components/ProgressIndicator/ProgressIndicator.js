// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * ProgressIndicator component
 *
 * A component for outputting determinate progress
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLDivElement} container - the target container for an instance of ProgressIndicator
 * @constructor
 */
fabric.ProgressIndicator = function(container) {
  this.container = container;
  this.cacheDOM();
};

fabric.ProgressIndicator.prototype = (function() {

  var _progress;
  var _width;
  var _itemName;
  var _total;
  var _itemDescription;
  var _progressBar;

  /**
   * Sets the progress percentage for a determinate
   * operation. Either use this or setProgress
   * and setTotal as setProgressPercent assumes
   * you've done a percentage calculation before
   * injecting it into the function
   * @param {number} percent - a floating point number from 0 to 1
   */
  var setProgressPercent = function(percent) {
    _progressBar.style.width = Math.round(_width * percent) + "px";
  };

  /**
   * Sets the progress for a determinate operation.
   * Use this in combination with setTotal.
   * @param {number} progress
   */
  var setProgress = function(progress) {
    _progress = progress;
    var percentage = _progress / _total;
    this.setProgressPercent(percentage);
  };

  /**
   * Sets the total file size, etc. for a
   * determinate operation. Use this in
   * combination with setProgress
   * @param {number} total
   */
  var setTotal = function(total) {
    _total = total;
  };

  /**
   * Sets the text for the title or label
   * of an instance
   * @param {string} name
   */
  var setName = function(name) {
    _itemName.innerHTML = name;
  };

  /**
   * Sets the text for a description
   * of an instance
   * @param {string} name
   */
  var setDescription = function(description) {
    _itemDescription.innerHTML = description;
  };

  /**
   * caches elements and values of the component
   *
   */
  var cacheDOM = function() {
    _itemName = this.container.querySelector('.ms-ProgressIndicator-itemName') || null; //an itemName element is optional
    _itemDescription = this.container.querySelector('.ms-ProgressIndicator-itemDescription') || null; //an itemDescription element is optional
    _progressBar = this.container.querySelector('.ms-ProgressIndicator-progressBar');
    _width = this.container.querySelector('.ms-ProgressIndicator-itemProgress').offsetWidth;
  };

  return {
    setProgressPercent: setProgressPercent,
    setName: setName,
    setDescription: setDescription,
    setProgress: setProgress,
    setTotal: setTotal,
    cacheDOM: cacheDOM
  };
}());
