// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * MessageBanner component
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
 * @param {HTMLElement} container - the target container for an instance of MessageBanner
 * @constructor
 */
fabric.MessageBanner = function(container) {
    this.container = container;
    this.init();
};

fabric.MessageBanner.prototype = (function() {

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
    var _bufferElementsWidthSmall = 35;
    var SMALL_BREAK_POINT = 480;

    /**
     * sets styles on resize
     */
    var _onResize = function() {
        _clientWidth = _errorBanner.offsetWidth;
        if(window.innerWidth >= SMALL_BREAK_POINT ) {
            _resizeRegular();
        } else {
            _resizeSmall();
        }
    };

    /**
     * resize above 480 pixel breakpoint
     */
    var _resizeRegular = function() {
        if ((_clientWidth - _bufferSize) > _initTextWidth && _initTextWidth < _textContainerMaxWidth) {
            _textWidth = "auto";
            _chevronButton.className = "ms-MessageBanner-expand";
            _collapse();
        } else {
            _textWidth = Math.min((_clientWidth - _bufferSize), _textContainerMaxWidth) + "px";
            if(_chevronButton.className.indexOf("is-visible") === -1) {
                _chevronButton.className += " is-visible";
            }
        }
        _clipper.style.width = _textWidth;
    };

    /**
     * resize below 480 pixel breakpoint
     */
    var _resizeSmall = function() {
        if (_clientWidth - (_bufferElementsWidthSmall + _closeButton.offsetWidth) > _initTextWidth) {
            _textWidth = "auto";
            _collapse();
        } else {
            _textWidth = (_clientWidth - (_bufferElementsWidthSmall + _closeButton.offsetWidth)) + "px";
        }
        _clipper.style.width = _textWidth;
    };
    /**
     * caches elements and values of the component
     */
    var _cacheDOM = function(context) {
        _errorBanner = context.container;
        _clipper = context.container.querySelector('.ms-MessageBanner-clipper');
        _chevronButton = context.container.querySelector('.ms-MessageBanner-expand');
        _actionButton = context.container.querySelector('.ms-MessageBanner-action');
        _bufferSize = _actionButton.offsetWidth + _bufferElementsWidth;
        _closeButton = context.container.querySelector('.ms-MessageBanner-close');
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
     * collapses component to only show truncated message
     */
    var _collapse = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className = "ms-MessageBanner";
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
        if(_errorBanner.className.indexOf("hide") === -1) {
            _errorBanner.className += " hide";
            setTimeout(function() {
                _errorBanner.className = "ms-MessageBanner is-hidden";
            }, 500);
        }
    };

    /**
     * shows banner if the banner is hidden
     */
    var _showBanner = function() {
        _errorBanner.className = "ms-MessageBanner";
    };

    /**
     * sets handlers for resize and button click events
     */
    var _setListeners = function() {
        window.addEventListener('resize', _onResize, false);
        _chevronButton.addEventListener("click", _toggleExpansion, false);
        _closeButton.addEventListener("click", _hideBanner, false);
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
        init: init,
        showBanner: _showBanner
    };
}());
