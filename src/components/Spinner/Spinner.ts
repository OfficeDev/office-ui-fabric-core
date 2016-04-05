// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * @namespace fabric
 */
namespace fabric {

  class CircleObject {
    public element: HTMLElement;
    public j: number;

    constructor(element, j) {
      this.element = element;
      this.j = j;
    }
  }

  /**
   * Spinner Component
   *
   * An animating activity indicator.
   *
   */
  export class Spinner {

    public eightSize: number = 0.2;
    public animationSpeed: number = 90;
    public interval: number;
    public spinner: HTMLElement;
    public numCircles: number;
    public offsetSize: number;
    public parentSize: number = 20;
    public fadeIncrement: number = 0;

    private circleObjects: Array<CircleObject> = [];
    private _target: HTMLElement;

    /**
     * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
     */
    constructor(container: HTMLElement) {
      this._target = container;
      this._init();
    }

    /**
     * @function start - starts or restarts the animation sequence
     * @memberOf fabric.Spinner
     */
    public start(): void {
      this.stop();
      this.interval = setInterval(() => {
        let i = this.circleObjects.length;
        while (i--) {
          this._fade(this.circleObjects[i]);
        }
      }, this.animationSpeed);
    }

    /**
     * @function stop - stops the animation sequence
     * @memberOf fabric.Spinner
     */
    public stop(): void {
      clearInterval(this.interval);
    }

    // private methods

    private _init(): void {
      this._setTargetElement();
      this._setPropertiesForSize();
      this._createCirclesAndArrange();
      this._initializeOpacities();
      this.start();
    }

    private _setPropertiesForSize(): void {
      if (this.spinner.className.indexOf("large") > -1) {
        this.parentSize = 28;
        this.eightSize = 0.179;
      }

      this.offsetSize = this.eightSize;
      this.numCircles = 8;
    }

    private _setTargetElement(): void {
      // for backwards compatibility
      if (this._target.className.indexOf("ms-Spinner") === -1) {
        this.spinner = document.createElement("div");
        this.spinner.className = "ms-Spinner";
        this._target.appendChild(this.spinner);
      } else {
        this.spinner = this._target;
      }
    }

    private _initializeOpacities(): void {
      let i = 0;
      let j = 1;
      let opacity;
      this.fadeIncrement = 1 / this.numCircles;

      for (i; i < this.numCircles; i++) {
        let circleObject = this.circleObjects[i];
        opacity = (this.fadeIncrement * j++);
        this._setOpacity(circleObject.element, opacity);
      }
    }

    private _fade(circleObject: CircleObject): void {
      let opacity = this._getOpacity(circleObject.element) - this.fadeIncrement;

      if (opacity <= 0) {
        opacity = 1;
      }

      this._setOpacity(circleObject.element, opacity);
    }

    private _getOpacity(element: HTMLElement): number {
      return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    }

    private _setOpacity(element: HTMLElement, opacity: number): void {
      element.style.opacity = opacity.toString();
    }

    private _createCircle(): HTMLElement {
      let circle = document.createElement("div");
      circle.className = "ms-Spinner-circle";
      circle.style.width = circle.style.height = this.parentSize * this.offsetSize + "px";
      return circle;
    }

    private _createCirclesAndArrange(): void {

      let angle = 0;
      let offset = this.parentSize * this.offsetSize;
      let step = (2 * Math.PI) / this.numCircles;
      let i = this.numCircles;
      let circleObject;
      let radius = (this.parentSize - offset) * 0.5;

      while (i--) {
        let circle = this._createCircle();
        let x = Math.round(this.parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
        let y = Math.round(this.parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
        this.spinner.appendChild(circle);
        circle.style.left = x + "px";
        circle.style.top = y + "px";
        angle += step;
        circleObject = new CircleObject(circle, i);
        this.circleObjects.push(circleObject);
      }
    }
  }
}
