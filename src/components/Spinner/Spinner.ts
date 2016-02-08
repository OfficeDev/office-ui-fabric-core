// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Spinner Component
 *
 * An animating activity indicator.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};

class CircleObject {
    public element: HTMLElement;
    public j: number;

    constructor(element, j) {
        this.element = element;
        this.j = j;
    }
}

class Spinner {

    private _target: HTMLElement;

    public eightSize: number = 0.179;
    public circleObjects: Array<CircleObject> = [];
    public animationSpeed: number = 90;
    public interval: number;
    public spinner: HTMLElement;
    public numCircles: number;
    public offsetSize: number;
    public fadeIncrement: number = 0;

    //private methods

    private _init() {
        this.offsetSize = this.eightSize;
        this.numCircles = 8;
        this._createCirclesAndArrange();
        this._initializeOpacities();
        this.start();
    }

    private _initializeOpacities() {
        var i = 0;
        var j = 1;
        var opacity;
        this.fadeIncrement = 1 / this.numCircles;

        for (i; i < this.numCircles; i++) {
            var circleObject = this.circleObjects[i];
            opacity = (this.fadeIncrement * j++);
            this._setOpacity(circleObject.element, opacity);
        }
    }

    private _fade(circleObject) {
        var opacity = this._getOpacity(circleObject.element) - this.fadeIncrement;

        if (opacity <= 0) {
            opacity = 1;
        }

        this._setOpacity(circleObject.element, opacity);
    }

    private _getOpacity(element) {
        return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    }

    private _setOpacity(element, opacity) {
        element.style.opacity = opacity;
    }

    private _createCircle() {
        var circle = document.createElement('div');
        var parentWidth = parseInt(window.getComputedStyle(this.spinner).getPropertyValue("width"), 10);
        circle.className = "ms-Spinner-circle";
        circle.style.width = circle.style.height = parentWidth * this.offsetSize + "px";
        return circle;
    }

    private _createCirclesAndArrange() {
        //for backwards compatibility
        if (this._target.className.indexOf("ms-Spinner") === -1) {
            this.spinner = document.createElement("div");
            this.spinner.className = "ms-Spinner";
            this._target.appendChild(this.spinner);
        } else {
            this.spinner = this._target;
        }

        var width = this.spinner.clientWidth;
        var height = this.spinner.clientHeight;
        var angle = 0;
        var offset = width * this.offsetSize;
        var step = (2 * Math.PI) / this.numCircles;
        var i = this.numCircles;
        var circleObject;
        var radius = (width- offset) * 0.5;

        while (i--) {
            var circle = this._createCircle();
            var x = Math.round(width * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
            var y = Math.round(height * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
            this.spinner.appendChild(circle);
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            angle += step;
            circleObject = new CircleObject(circle, i);
            this.circleObjects.push(circleObject);
        }
    }

    private _fadeCircles() {
        var i = this.circleObjects.length;
        while(i--) {
            this._fade(this.circleObjects[i]);
        }
    }

    /**
     * @function start - starts or restarts the animation sequence
     * @memberOf fabric.Spinner
     */
    public start() {
        this.interval = setInterval(this._fadeCircles.bind(this), this.animationSpeed);
    }

    /**
     * @function stop - stops the animation sequence
     * @memberOf fabric.Spinner
     */
    public stop() {
        clearInterval(this.interval);
    }

    /**
     * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
     */
    constructor (target) {
        this._target = target;
        this._init();
    }
}

fabric.Spinner = Spinner;
