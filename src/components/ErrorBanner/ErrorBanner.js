// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * ErrorBanner component
 *
 * A component to display error messages
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of ErrorBanner
 * @constructor
 */
fabric.ErrorBanner = function(container) {
    this.container = container;
    this.init();
};

fabric.ErrorBanner.prototype = (function() {

    var _clipper;
    var _bufferSize;
    var _textContainerMaxWidth = 700;
    var _clientWidth;
    var _textWidth;
    var _initTextWidth;
    var _chevronButton;
    var _errorBanner;
    var _actionButton;
    var _closeButton;
    var _bufferElementsWidth = 88;

    /**
     * sets styles on resize
     */
    var _onResize = function(event) {
        _clientWidth = _errorBanner.offsetWidth;
        if ((_clientWidth - _bufferSize) > _initTextWidth && _initTextWidth < _textContainerMaxWidth) {
            _textWidth = "auto";
            _chevronButton.style.display = "none";
            _collapse();
        } else {
            _textWidth = Math.min((_clientWidth - _bufferSize), _textContainerMaxWidth) + "px";
            _chevronButton.style.display = "inline-block";
        }
        _clipper.style.width = _textWidth;
    };

    /**
     * caches elements and values of the component
     */
    var _cacheDOM = function(context) {
        _errorBanner = context.container;
        _clipper = context.container.querySelector('.ms-ErrorBanner-clipper');
        _chevronButton = context.container.querySelector('.ms-ErrorBanner-expand');
        _actionButton = context.container.querySelector('.ms-ErrorBanner-action');
        _bufferSize = _actionButton.offsetWidth + _bufferElementsWidth;
        _closeButton = context.container.querySelector('.ms-ErrorBanner-close');
    };

    /**
     * expands component to show full error message
     */
    var _expand = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className += " is-expanded";
        icon.className = "ms-Icon ms-Icon--chevronsUp";
    };

    /**
     * collapses component to only show truncated mesage
     */
    var _collapse = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className = "ms-ErrorBanner";
        icon.className = "ms-Icon ms-Icon--chevronsDown";
    };

    var _toggleExpansion = function() {
        if (_errorBanner.className.indexOf("is-expanded") > -1) {
            _collapse();
        } else {
            _expand();
        }
    };

    /**
     * hides banner when close button is clicked
     */
    var _hideBanner = function() {
        _errorBanner.className += " is-hidden";
        setTimeout(function() {
            _errorBanner.style.display = "none";
        }, 500);
    };

    /**
     * sets handlers for resize and button click events
     */
    var _setListeners = function() {
        window.addEventListener('resize', _onResize);
        _chevronButton.addEventListener("click", _toggleExpansion);
        _closeButton.addEventListener("click", _hideBanner);
    };

    /**
     * initializes component
     */
    var init = function() {
        _cacheDOM(this);
        _setListeners();
        _clientWidth = _errorBanner.offsetWidth;
        _initTextWidth = _clipper.offsetWidth;
        _onResize(null);
    };

    return {
        init: init
    }
}());
