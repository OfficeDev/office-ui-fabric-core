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

/**
 * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
 */

fabric.Spinner = function(target) {

    var _target = target;
    var eightSize = 0.2;
    var circleObjects = [];
    var animationSpeed = 90;
    var interval;
    var spinner;
    var numCircles;
    var offsetSize;
    var fadeIncrement = 0;
    var parentSize = 20;

    /**
     * @function start - starts or restarts the animation sequence
     * @memberOf fabric.Spinner
     */
    function start() {
        stop();
        interval = setInterval(function() {
            var i = circleObjects.length;
            while(i--) {
                _fade(circleObjects[i]);
            }
        }, animationSpeed);
    }

    /**
     * @function stop - stops the animation sequence
     * @memberOf fabric.Spinner
     */
    function stop() {
        clearInterval(interval);
    }

    //private methods

    function _init() {
        _setTargetElement();
        _setPropertiesForSize();
        _createCirclesAndArrange();
        _initializeOpacities();
        start();
    }

    function _initializeOpacities() {
        var i = 0;
        var j = 1;
        var opacity;
        fadeIncrement = 1 / numCircles;

        for (i; i < numCircles; i++) {
            var circleObject = circleObjects[i];
            opacity = (fadeIncrement * j++);
            _setOpacity(circleObject.element, opacity);
        }
    }

    function _fade(circleObject) {
        var opacity = _getOpacity(circleObject.element) - fadeIncrement;

        if (opacity <= 0) {
            opacity = 1;
        }

        _setOpacity(circleObject.element, opacity);
    }

    function _getOpacity(element) {
        return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    }

    function _setOpacity(element, opacity) {
        element.style.opacity = opacity;
    }

    function _createCircle() {
        var circle = document.createElement('div');
        circle.className = "ms-Spinner-circle";
        circle.style.width = circle.style.height = parentSize * offsetSize + "px";
        return circle;
    }

    function _createCirclesAndArrange() {

        var angle = 0;
        var offset = parentSize * offsetSize;
        var step = (2 * Math.PI) / numCircles;
        var i = numCircles;
        var circleObject;
        var radius = (parentSize - offset) * 0.5;

        while (i--) {
            var circle = _createCircle();
            var x = Math.round(parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
            var y = Math.round(parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
            spinner.appendChild(circle);
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            angle += step;
            circleObject = { element:circle, j:i };
            circleObjects.push(circleObject);
        }
    }

    function _setPropertiesForSize() {
        if (spinner.className.indexOf("large") > -1) {
            parentSize = 28;
            eightSize = 0.179;
        }

        offsetSize = eightSize;
        numCircles = 8;
    }

    function _setTargetElement() {
        //for backwards compatibility
        if (_target.className.indexOf("ms-Spinner") === -1) {
            spinner = document.createElement("div");
            spinner.className = "ms-Spinner";
            _target.appendChild(spinner);
        } else {
            spinner = _target;
        }
    }

    _init();

    return {
        start:start,
        stop:stop
    };
};
