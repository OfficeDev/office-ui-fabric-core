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

class ProgressIndicator {

  public container: HTMLElement;

  private _progress: number;
  private _width: number;
  private _itemName: HTMLElement;
  private _total: number;
  private _itemDescription: HTMLElement;
  private _progressBar: HTMLElement;

  /**
   * Sets the progress percentage for a determinate
   * operation. Either use this or setProgress
   * and setTotal as setProgressPercent assumes
   * you've done a percentage calculation before
   * injecting it into the function
   * @param {number} percent - a floating point number from 0 to 1
   */
  public setProgressPercent(percent) {
    this._progressBar.style.width = Math.round(this._width * percent) + "px";
  }

  /**
   * Sets the progress for a determinate operation.
   * Use this in combination with setTotal.
   * @param {number} progress
   */
  public setProgress = function(progress) {
    this._progress = progress;
    var percentage = this._progress / this._total;
    this.setProgressPercent(percentage);
  }

  /**
   * Sets the total file size, etc. for a
   * determinate operation. Use this in
   * combination with setProgress
   * @param {number} total
   */
  public setTotal (total) {
    this._total = total;
  }

  /**
   * Sets the text for the title or label
   * of an instance
   * @param {string} name
   */
  public setName(name) {
    this._itemName.innerHTML = name;
  }

  /**
   * Sets the text for a description
   * of an instance
   * @param {string} name
   */
  public setDescription(description) {
    this._itemDescription.innerHTML = description;
  }

  /**
   * caches elements and values of the component
   *
   */
  public cacheDOM = function() {
    this._itemName = this.container.querySelector('.ms-ProgressIndicator-itemName') || null; //an itemName element is optional
    this._itemDescription = this.container.querySelector('.ms-ProgressIndicator-itemDescription') || null; //an itemDescription element is optional
    this._progressBar = this.container.querySelector('.ms-ProgressIndicator-progressBar');
    this._width = this.container.querySelector('.ms-ProgressIndicator-itemProgress').offsetWidth;
  }

  /**
   *
   * @param {HTMLDivElement} container - the target container for an instance of ProgressIndicator
   * @constructor
   */
  constructor(container) {
    this.container = container;
    this.cacheDOM();
  }
}

fabric.ProgressIndicator = ProgressIndicator;
