//Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";
var fabric;
(function (fabric) {
    var SCROLL_FRAME_RATE = 33;
    var Animate = (function () {
        function Animate() {
        }
        /**
        * @param {HTMLElement} element
        * @param {object} props Transition properties
        * @param {number} props.duration The duration of the transition in seconds
        * @param {number} props.delay A delay in seconds that occurs before the transition starts
        * @param {string} props.ease An easing equation applied to the transition
        * @param {function} props.onEnd A function that is called when the transition ends
        * @param {array} props.onEndArgs An array of parameters applied to the onEnd function
        * @param {number} props.x props.y props.left, props.opacity etc... CSS values to transition to
         */
        Animate.transition = function (element, props) {
            var obj = { element: element, props: props, transformations: {} };
            Animate._animationObjects.push(obj);
            Animate._parseProperties(obj);
            Animate._createTransition(obj);
            setTimeout(Animate._setProperties, 0, obj);
            Animate._setCallback(obj);
        };
        /**
         * @param {HTMLElement} element
         * @param {string} keyframes A name of a keyframe animation
         * @param {object} props Animation properties
         * @param {number} props.duration The duration of the animation in seconds
         * @param {number} props.delay A delay in seconds that occurs before the animation starts
         * @param {string} props.ease An easing equation applied to the animation
         * @param {function} props.onEnd A function that is called when the animation ends
         * @param {array} props.onEndArgs An array of parameters applied to the onEnd function
        */
        Animate.animation = function (element, keyframes, props) {
            var obj = { element: element, keyframes: keyframes, props: props };
            Animate._animationObjects.push(obj);
            Animate._parseProperties(obj);
            Animate._createAnimation(obj);
            Animate._setCallback(obj);
        };
        /**
         * @param {HTMLElement} element
         * @param {object} props Scroll animation properties
         * @param {number} props.duration The duration of the transition in seconds
         * @param {number} props.top The end scroll position of the element
         * @param {number} props.delay A delay in seconds that occurs before the scroll starts
         * @param {function} props.onEnd A function that is called when the scrolling animation ends
         * @param {array} props.onEndArgs An array of parameters applied to the onEnd function
        */
        Animate.scrollTo = function (element, props) {
            var obj = { element: element, props: props, step: 0 };
            Animate._setScrollProperties(obj);
            if (obj.props.delay) {
                setTimeout(Animate._animationObjects, obj.props.delay * 1000, obj);
            }
            else {
                Animate._animateScroll(obj);
            }
            Animate._animationObjects.push(obj);
        };
        Animate._setScrollProperties = function (obj) {
            obj.beginTop = obj.element.scrollTop;
            obj.change = obj.props.top - obj.beginTop;
            obj.props.duration = obj.props.duration * 1000;
        };
        Animate._parseProperties = function (obj) {
            var nonTweenProps = Animate._timeProps.concat(Animate._callbackProps);
            obj.tweenObj = {};
            for (var key in obj.props) {
                if (Animate._contains(nonTweenProps, key)) {
                    obj[key] = obj.props[key];
                }
                else {
                    obj.tweenObj[key] = obj.props[key];
                }
            }
        };
        Animate._animateScroll = function (obj) {
            var totalSteps = obj.props.duration / SCROLL_FRAME_RATE;
            var top = Animate._easeOutExpo(obj.step++, obj.beginTop, obj.change, totalSteps);
            obj.element.scrollTop = top;
            if (obj.step >= totalSteps) {
                obj.element.scrollTop = obj.props.top;
                Animate._executeCallback(obj.props);
                Animate._removeAnimationObject(obj);
            }
            else {
                setTimeout(function () {
                    requestAnimationFrame(function () {
                        Animate._animateScroll(obj);
                    });
                }, SCROLL_FRAME_RATE);
            }
        };
        Animate._createTransition = function (obj) {
            var duration = obj.duration || 0;
            var delay = obj.delay || 0;
            obj.element.style.transitionProperty = Animate._getTransitionProperties(obj.tweenObj);
            obj.element.style.transitionDuration = duration.toString() + "s";
            obj.element.style.transitionTimingFunction = obj.ease || "linear";
            obj.element.style.transitionDelay = delay.toString() + "s";
        };
        Animate._createAnimation = function (obj) {
            var duration = obj.duration || 0;
            var delay = obj.delay || 0;
            obj.element.style.animationName = obj.keyframes;
            obj.element.style.animationDuration = duration.toString() + "s";
            obj.element.style.animationTimingFunction = obj.ease || "linear";
            obj.element.style.animationDelay = delay.toString() + "s";
            obj.element.style.animationFillMode = "both";
        };
        Animate._getTransitionProperties = function (obj) {
            var hasTransform = false;
            var hasFilter = false;
            var properties = [];
            for (var key in obj) {
                if (Animate._contains(Animate._transformProps, key)) {
                    hasTransform = true;
                }
                else if (Animate._contains(Animate._filters, key)) {
                    hasFilter = true;
                }
                else {
                    properties.push(Animate._camelCaseToDash(key));
                }
            }
            if (hasTransform) {
                properties.push("transform");
            }
            if (hasFilter) {
                properties.push("-webkit-filter");
                properties.push("filter");
            }
            return properties.join(", ");
        };
        Animate._setProperties = function (obj) {
            for (var key in obj.tweenObj) {
                if (Animate._contains(Animate._transformProps, key)) {
                    Animate._setTransformValues(obj, key);
                }
                else if (Animate._contains(Animate._filters, key)) {
                    Animate._setFilterValues(obj, key);
                }
                else {
                    Animate._setRegularValues(obj, key);
                }
            }
            if (obj.transformations) {
                Animate._setTransformations(obj);
            }
        };
        Animate._setRegularValues = function (obj, key) {
            var value = obj.tweenObj[key];
            if (value.toString().indexOf("%") === -1) {
                value += (key !== "opacity") && (key !== "backgroundColor") && (key !== "boxShadow") ? "px" : "";
            }
            obj.element.style[key] = value;
        };
        Animate._setFilterValues = function (obj, key) {
            var value = obj.tweenObj[key];
            if (key === "hueRotate") {
                value = "(" + value + "deg)";
            }
            else {
                value = key === "blur" ? "(" + value + "px)" : "(" + value + "%)";
            }
            key = Animate._camelCaseToDash(key);
            obj.element.style.webkitFilter = key + value;
            obj.element.style.filter = key + value;
        };
        Animate._setTransformValues = function (obj, key) {
            if (/x|y|z|scaleX|scaleY|scaleZ|rotate|rotateX|rotateY|rotateZ|skewX|skewY/.test(key)) {
                obj.transformations[key] = obj.tweenObj[key];
            }
        };
        Animate._setTransformations = function (obj) {
            var rotate = "", scale = "", skew = "", translate = "";
            var trans = obj.transformations;
            translate += trans.x !== undefined && trans.x ? "translateX(" + trans.x + "px) " : "";
            translate += trans.y !== undefined && trans.y ? "translateY(" + trans.y + "px) " : "";
            translate += trans.z !== undefined && trans.z ? "translateZ(" + trans.z + "px) " : "";
            rotate += trans.rotate !== undefined && trans.rotate ? "rotate(" + trans.rotate + "deg) " : "";
            rotate += trans.rotateX !== undefined && trans.rotateX ? "rotateX(" + trans.rotateX + "deg) " : "";
            rotate += trans.rotateY !== undefined && trans.rotateY ? "rotate(" + trans.rotateY + "deg) " : "";
            rotate += trans.rotateZ !== undefined && trans.rotateZ ? "rotate(" + trans.rotateZ + "deg) " : "";
            scale += trans.scaleX !== undefined && trans.scaleX ? "scaleX(" + trans.scaleX + ") " : "";
            scale += trans.scaleY !== undefined && trans.scaleY ? "scaleY(" + trans.scaleY + ") " : "";
            scale += trans.scaleZ !== undefined && trans.scaleZ ? "scaleZ(" + trans.scaleZ + ") " : "";
            skew += trans.skewX !== undefined && trans.skewX ? "skewX(" + trans.skewX + "deg) " : "";
            skew += trans.skewY !== undefined && trans.skewY ? "skewY(" + trans.skewY + "deg) " : "";
            obj.element.style.transform = translate + rotate + scale + skew;
        };
        Animate._setCallback = function (obj) {
            obj.element.addEventListener("webkitTransitionEnd", Animate._complete, false);
            obj.element.addEventListener("transitionend", Animate._complete, false);
            obj.element.addEventListener("webkitAnimationEnd", Animate._complete, false);
            obj.element.addEventListener("animationend", Animate._complete, false);
        };
        Animate._complete = function (event) {
            event.target.removeEventListener("webkitTransitionEnd", Animate._complete);
            event.target.removeEventListener("transitionend", Animate._complete);
            event.target.removeEventListener("webkitAnimationEnd", Animate._complete);
            event.target.removeEventListener("animationend", Animate._complete);
            var obj = Animate._getAnimationObjByElement(event.target);
            Animate._executeCallback(obj);
            Animate._removeAnimationObject(obj);
        };
        Animate._getAnimationObjByElement = function (element) {
            var i = Animate._animationObjects.length;
            while (i--) {
                if (Animate._animationObjects[i].element === element) {
                    return Animate._animationObjects[i];
                }
            }
            return null;
        };
        Animate._removeAnimationObject = function (obj) {
            var i = Animate._animationObjects.length;
            while (i--) {
                if (Animate._animationObjects[i] === obj) {
                    Animate._animationObjects.splice(i, 1);
                }
            }
        };
        Animate._executeCallback = function (obj) {
            if (obj.onEnd) {
                var endArgs = obj.onEndArgs || [];
                obj.onEnd.apply(null, endArgs);
            }
        };
        Animate._contains = function (array, value) {
            var i = array.length;
            while (i--) {
                if (value === array[i]) {
                    return true;
                }
            }
            return false;
        };
        Animate._camelCaseToDash = function (value) {
            return value.replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
        };
        Animate._easeOutExpo = function (time, begin, change, duration) {
            return (time === duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
        };
        Animate._transformProps = [
            "x",
            "y",
            "z",
            "scaleX",
            "scaleY",
            "scaleZ",
            "rotate",
            "rotateX",
            "rotateY",
            "rotateZ",
            "skewX",
            "skewY"
        ];
        Animate._filters = [
            "blur",
            "brightness",
            "contrast",
            "dropShadow",
            "grayscale",
            "hueRotate",
            "invert",
            "saturate",
            "sepia"
        ];
        Animate._timeProps = ["duration", "ease", "delay"];
        Animate._callbackProps = ["onEnd", "onEndArgs"];
        Animate._animationObjects = [];
        return Animate;
    }());
    fabric.Animate = Animate;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";
var fabric;
(function (fabric) {
    var Ease = (function () {
        function Ease() {
        }
        Ease.QUAD_EASE_IN = Ease.CB + "(0.550, 0.085, 0.680, 0.530)";
        Ease.CUBIC_EASE_IN = Ease.CB + "(0.550, 0.055, 0.675, 0.190)";
        Ease.QUART_EASE_IN = Ease.CB + "(0.895, 0.030, 0.685, 0.220)";
        Ease.QUINT_EASE_IN = Ease.CB + "(0.755, 0.050, 0.855, 0.060)";
        Ease.SINE_EASE_IN = Ease.CB + "(0.470, 0, 0.745, 0.715)";
        Ease.EXPO_EASE_IN = Ease.CB + "(0.950, 0.050, 0.795, 0.035)";
        Ease.CIRC_EASE_IN = Ease.CB + "(0.600, 0.040, 0.980, 0.335)";
        Ease.BACK_EASE_IN = Ease.CB + "(0.600, 0.040, 0.980, 0.335)";
        Ease.QUAD_EASE_OUT = Ease.CB + "(0.250, 0.460, 0.450, 0.940)";
        Ease.CUBIC_EASE_OUT = Ease.CB + "(0.215, 0.610, 0.355, 1)";
        Ease.QUART_EASE_OUT = Ease.CB + "(0.165, 0.840, 0.440, 1)";
        Ease.QUINT_EASE_OUT = Ease.CB + "(0.230, 1, 0.320, 1)";
        Ease.SINE_EASE_OUT = Ease.CB + "(0.390, 0.575, 0.565, 1)";
        Ease.EXPO_EASE_OUT = Ease.CB + "(0.190, 1, 0.220, 1)";
        Ease.CIRC_EASE_OUT = Ease.CB + "(0.075, 0.820, 0.165, 1)";
        Ease.BACK_EASE_OUT = Ease.CB + "(0.175, 0.885, 0.320, 1.275)";
        Ease.QUAD_EASE_IN_OUT = Ease.CB + "(0.455, 0.030, 0.515, 0.955)";
        Ease.CUBIC_EASE_IN_OUT = Ease.CB + "(0.645, 0.045, 0.355, 1)";
        Ease.QUART_EASE_IN_OUT = Ease.CB + "(0.770, 0, 0.175, 1)";
        Ease.QUINT_EASE_IN_OUT = Ease.CB + "(0.860, 0, 0.070, 1)";
        Ease.SINE_EASE_IN_OUT = Ease.CB + "(0.445, 0.050, 0.550, 0.950)";
        Ease.EXPO_EASE_IN_OUT = Ease.CB + "(1, 0, 0, 1)";
        Ease.CIRC_EASE_IN_OUT = Ease.CB + "(0.785, 0.135, 0.150, 0.860)";
        Ease.BACK_EASE_IN_OUT = Ease.CB + "(0.680, -0.550, 0.265, 1.550)";
        Ease.CB = "cubic-bezier";
        return Ease;
    }());
    fabric.Ease = Ease;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    "use strict";
    /**
     * Breadcrumb component
     *
     * Shows the user"s current location in a hierarchy and provides a means of navigating upward.
     *
     */
    var Breadcrumb = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of Breadcrumb
         * @constructor
         *
         * If dynamically populating a list run the constructor after the list has been populated
         * in the DOM.
        */
        function Breadcrumb(container) {
            this._currentMaxItems = 0;
            this._itemCollection = [];
            this.container = container;
            this.init();
        }
        /**
         *  removes focus outlines so they don"t linger after click
        */
        Breadcrumb.prototype.removeOutlinesOnClick = function () {
            this._breadcrumbList.blur();
        };
        /**
         * Adds a breadcrumb item to a breadcrumb
         * @param itemLabel {String} the item's text label
         * @param itemLink {String} the item's href link
         * @param tabIndex {number} the item's tabIndex
        */
        Breadcrumb.prototype.addItem = function (itemLabel, itemLink, tabIndex) {
            this._itemCollection.push({ text: itemLabel, link: itemLink, tabIndex: tabIndex });
            this._updateBreadcrumbs();
        };
        /**
         * Removes a breadcrumb item by item label in the breadcrumbs list
         * @param itemLabel {String} the item's text label
        */
        Breadcrumb.prototype.removeItemByLabel = function (itemLabel) {
            var i = this._itemCollection.length;
            while (i--) {
                if (this._itemCollection[i].text === itemLabel) {
                    this._itemCollection.splice(i, 1);
                }
            }
            this._updateBreadcrumbs();
        };
        ;
        /**
         * removes a breadcrumb item by position in the breadcrumbs list
         * index starts at 0
         * @param value {String} the item's index
        */
        Breadcrumb.prototype.removeItemByPosition = function (value) {
            this._itemCollection.splice(value, 1);
            this._updateBreadcrumbs();
        };
        /**
         * initializes component
        */
        Breadcrumb.prototype.init = function () {
            this._cacheDOM();
            this._setListeners();
            this._createItemCollection();
            this._onResize();
        };
        /**
         * create internal model of list items from DOM
        */
        Breadcrumb.prototype._createItemCollection = function () {
            var length = this._listItems.length;
            var i = 0;
            var item;
            var text;
            var link;
            var tabIndex;
            for (i; i < length; i++) {
                item = this._listItems[i].querySelector(".ms-Breadcrumb-itemLink");
                text = item.textContent;
                link = item.getAttribute("href");
                tabIndex = parseInt(item.getAttribute("tabindex"), 10);
                this._itemCollection.push({ link: link, tabIndex: tabIndex, text: text });
            }
        };
        /**
         * Re-render lists on resize
         *
        */
        Breadcrumb.prototype._onResize = function () {
            this._closeOverflow(null);
            this._renderList();
        };
        /**
         * render breadcrumbs and overflow menus
        */
        Breadcrumb.prototype._renderList = function () {
            var maxItems = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;
            if (maxItems !== this._currentMaxItems) {
                this._updateBreadcrumbs();
            }
            this._currentMaxItems = maxItems;
        };
        /**
         * updates the breadcrumbs and overflow menu
        */
        Breadcrumb.prototype._updateBreadcrumbs = function () {
            var maxItems = window.innerWidth > Breadcrumb.MEDIUM ? 4 : 2;
            if (this._itemCollection.length > maxItems) {
                this._breadcrumb.classList.add("is-overflow");
            }
            else {
                this._breadcrumb.classList.remove("is-overflow");
            }
            this._addBreadcrumbItems(maxItems);
            this._addItemsToOverflow(maxItems);
        };
        ;
        /**
         * creates the overflow menu
        */
        Breadcrumb.prototype._addItemsToOverflow = function (maxItems) {
            var _this = this;
            this._resetList(this._contextMenu);
            var end = this._itemCollection.length - maxItems;
            var overflowItems = this._itemCollection.slice(0, end);
            overflowItems.forEach(function (item) {
                var li = document.createElement("li");
                li.className = "ms-ContextualMenu-item";
                if (!isNaN(item.tabIndex)) {
                    li.setAttribute("tabindex", item.tabIndex);
                }
                var a = document.createElement("a");
                a.className = "ms-ContextualMenu-link";
                if (item.link !== null) {
                    a.setAttribute("href", item.link);
                }
                a.textContent = item.text;
                li.appendChild(a);
                _this._contextMenu.appendChild(li);
            });
        };
        /**
         * creates the breadcrumbs
        */
        Breadcrumb.prototype._addBreadcrumbItems = function (maxItems) {
            this._resetList(this._breadcrumbList);
            var i = this._itemCollection.length - maxItems;
            i = i < 0 ? 0 : i;
            if (i >= 0) {
                for (i; i < this._itemCollection.length; i++) {
                    var listItem = document.createElement("li");
                    var item = this._itemCollection[i];
                    var a = document.createElement("a");
                    var chevron = document.createElement("i");
                    listItem.className = "ms-Breadcrumb-listItem";
                    a.className = "ms-Breadcrumb-itemLink";
                    if (item.link !== null) {
                        a.setAttribute("href", item.link);
                    }
                    if (!isNaN(item.tabIndex)) {
                        a.setAttribute("tabindex", item.tabIndex);
                    }
                    a.textContent = item.text;
                    chevron.className = "ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight";
                    listItem.appendChild(a);
                    listItem.appendChild(chevron);
                    this._breadcrumbList.appendChild(listItem);
                }
            }
        };
        /**
         * resets a list by removing its children
        */
        Breadcrumb.prototype._resetList = function (list) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
        };
        /**
         * opens the overflow menu
        */
        Breadcrumb.prototype._openOverflow = function (event) {
            if (this._overflowMenu.className.indexOf(" is-open") === -1) {
                this._overflowMenu.classList.add("is-open");
                this.removeOutlinesOnClick();
                // force focus rect onto overflow button
                this._overflowButton.focus();
            }
        };
        Breadcrumb.prototype._overflowKeyPress = function (event) {
            if (event.keyCode === 13) {
                this._openOverflow(event);
            }
        };
        /**
         * closes the overflow menu
        */
        Breadcrumb.prototype._closeOverflow = function (event) {
            if (!event || event.target !== this._overflowButton) {
                this._overflowMenu.classList.remove("is-open");
            }
        };
        /**
         * caches elements and values of the component
        */
        Breadcrumb.prototype._cacheDOM = function () {
            this._breadcrumb = this.container;
            this._breadcrumbList = this._breadcrumb.querySelector(".ms-Breadcrumb-list");
            this._listItems = this._breadcrumb.querySelectorAll(".ms-Breadcrumb-listItem");
            this._contextMenu = this._breadcrumb.querySelector(".ms-ContextualMenu");
            this._overflowButton = this._breadcrumb.querySelector(".ms-Breadcrumb-overflowButton");
            this._overflowMenu = this._breadcrumb.querySelector(".ms-Breadcrumb-overflowMenu");
        };
        /**
        * sets handlers for resize and button click events
        */
        Breadcrumb.prototype._setListeners = function () {
            window.addEventListener("resize", this._onResize.bind(this));
            this._overflowButton.addEventListener("click", this._openOverflow.bind(this), false);
            this._overflowButton.addEventListener("keypress", this._overflowKeyPress.bind(this), false);
            document.addEventListener("click", this._closeOverflow.bind(this), false);
            this._breadcrumbList.addEventListener("click", this.removeOutlinesOnClick, false);
        };
        // medium breakpoint
        Breadcrumb.MEDIUM = 639;
        return Breadcrumb;
    }());
    fabric.Breadcrumb = Breadcrumb;
})(fabric || (fabric = {})); // end fabric namespace

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * Button
 *
 * Mostly just a click handler
 *
 */
var fabric;
(function (fabric) {
    "use strict";
    var Button = (function () {
        function Button(container, clickHandler) {
            this._container = container;
            if (clickHandler) {
                this._clickHandler = clickHandler;
                this._setClick();
            }
        }
        Button.prototype.disposeEvents = function () {
            this._container.removeEventListener("click", this._clickHandler, false);
        };
        Button.prototype._setClick = function () {
            this._container.addEventListener("click", this._clickHandler, false);
        };
        return Button;
    }());
    fabric.Button = Button;
})(fabric || (fabric = {}));



var FabricTemplateLibrary = (function () {
    function FabricTemplateLibrary() {
    }
    FabricTemplateLibrary.prototype.Breadcrumb = function () {
        var Breadcrumb0 = document.createElement("div");
        Breadcrumb0.setAttribute("class", "ms-Breadcrumb ");
        Breadcrumb0.innerHTML += "  ";
        var Breadcrumb0c1 = document.createElement("div");
        Breadcrumb0c1.setAttribute("class", "ms-Breadcrumb-overflow");
        Breadcrumb0c1.innerHTML += "    ";
        var Breadcrumb0c1c1 = document.createElement("div");
        Breadcrumb0c1c1.setAttribute("class", "ms-Breadcrumb-overflowButton ms-Icon ms-Icon--ellipsis");
        Breadcrumb0c1c1.setAttribute("tabindex", "1");
        Breadcrumb0c1.appendChild(Breadcrumb0c1c1);
        Breadcrumb0c1.innerHTML += "    ";
        var Breadcrumb0c1c3 = document.createElement("div");
        Breadcrumb0c1c3.setAttribute("class", "ms-Breadcrumb-overflowMenu");
        Breadcrumb0c1c3.innerHTML += "      ";
        var Breadcrumb0c1c3c1 = document.createElement("ul");
        Breadcrumb0c1c3c1.setAttribute("class", "ms-ContextualMenu is-open");
        Breadcrumb0c1c3.appendChild(Breadcrumb0c1c3c1);
        Breadcrumb0c1c3.innerHTML += "    ";
        Breadcrumb0c1.appendChild(Breadcrumb0c1c3);
        Breadcrumb0c1.innerHTML += "  ";
        Breadcrumb0.appendChild(Breadcrumb0c1);
        Breadcrumb0.innerHTML += "  ";
        var Breadcrumb0c3 = document.createElement("ul");
        Breadcrumb0c3.setAttribute("class", "ms-Breadcrumb-list");
        Breadcrumb0c3.innerHTML += "  ";
        Breadcrumb0.appendChild(Breadcrumb0c3);
        Breadcrumb0.innerHTML += "";
        return Breadcrumb0;
    };
    FabricTemplateLibrary.prototype.Button = function () {
        var Button0 = document.createElement("button");
        Button0.setAttribute("class", "ms-Button         ");
        Button0.innerHTML += "  ";
        var Button0c1 = document.createElement("span");
        Button0c1.setAttribute("class", "ms-Button-label");
        Button0c1.innerHTML += "Create Account";
        Button0.appendChild(Button0c1);
        Button0.innerHTML += "";
        return Button0;
    };
    FabricTemplateLibrary.prototype.Callout = function () {
        var Callout0 = document.createElement("div");
        Callout0.setAttribute("class", "ms-Callout           ");
        Callout0.innerHTML += "  ";
        var Callout0c1 = document.createElement("div");
        Callout0c1.setAttribute("class", "ms-Callout-main");
        Callout0c1.innerHTML += "    ";
        var Callout0c1c1 = document.createElement("div");
        Callout0c1c1.setAttribute("class", "ms-Callout-header");
        Callout0c1c1.innerHTML += "      ";
        var Callout0c1c1c1 = document.createElement("p");
        Callout0c1c1c1.setAttribute("class", "ms-Callout-title");
        Callout0c1c1.appendChild(Callout0c1c1c1);
        Callout0c1c1.innerHTML += "    ";
        Callout0c1.appendChild(Callout0c1c1);
        Callout0c1.innerHTML += "    ";
        var Callout0c1c3 = document.createElement("div");
        Callout0c1c3.setAttribute("class", "ms-Callout-inner");
        Callout0c1c3.innerHTML += "      ";
        var Callout0c1c3c1 = document.createElement("div");
        Callout0c1c3c1.setAttribute("class", "ms-Callout-content");
        Callout0c1c3c1.innerHTML += "        ";
        var Callout0c1c3c1c1 = document.createElement("p");
        Callout0c1c3c1c1.setAttribute("class", "ms-Callout-subText ");
        Callout0c1c3c1.appendChild(Callout0c1c3c1c1);
        Callout0c1c3c1.innerHTML += "      ";
        Callout0c1c3.appendChild(Callout0c1c3c1);
        Callout0c1c3.innerHTML += "      ";
        var Callout0c1c3c3 = document.createElement("div");
        Callout0c1c3c3.setAttribute("class", "ms-Callout-actions");
        Callout0c1c3c3.innerHTML += "      ";
        Callout0c1c3.appendChild(Callout0c1c3c3);
        Callout0c1c3.innerHTML += "    ";
        Callout0c1.appendChild(Callout0c1c3);
        Callout0c1.innerHTML += "       ";
        Callout0.appendChild(Callout0c1);
        Callout0.innerHTML += "";
        return Callout0;
    };
    FabricTemplateLibrary.prototype.CheckBox = function () {
        var CheckBox0 = document.createElement("div");
        CheckBox0.setAttribute("class", "ms-CheckBox");
        CheckBox0.innerHTML += "   ";
        var CheckBox0c1 = document.createElement("li");
        CheckBox0c1.setAttribute("role", "");
        CheckBox0c1.setAttribute("class", "ms-Choice-field ");
        CheckBox0c1.setAttribute("tabindex", "0");
        CheckBox0c1.setAttribute("aria-checked", "");
        CheckBox0c1.setAttribute("name", "");
        CheckBox0c1.innerHTML += "      ";
        var CheckBox0c1c1 = document.createElement("span");
        CheckBox0c1c1.setAttribute("class", "ms-Label");
        CheckBox0c1.appendChild(CheckBox0c1c1);
        CheckBox0c1.innerHTML += "  ";
        CheckBox0.appendChild(CheckBox0c1);
        CheckBox0.innerHTML += "";
        return CheckBox0;
    };
    FabricTemplateLibrary.prototype.ChoiceFieldGroup = function () {
        var ChoiceFieldGroup0 = document.createElement("div");
        ChoiceFieldGroup0.setAttribute("class", "ms-ChoiceFieldGroup");
        ChoiceFieldGroup0.setAttribute("id", "");
        ChoiceFieldGroup0.setAttribute("role", "");
        ChoiceFieldGroup0.innerHTML += "  ";
        var ChoiceFieldGroup0c1 = document.createElement("div");
        ChoiceFieldGroup0c1.setAttribute("class", "ms-ChoiceFieldGroup-title");
        ChoiceFieldGroup0c1.innerHTML += "    ";
        var ChoiceFieldGroup0c1c1 = document.createElement("label");
        ChoiceFieldGroup0c1c1.setAttribute("class", "ms-Label  is-required ");
        ChoiceFieldGroup0c1c1.innerHTML += "Unselected";
        ChoiceFieldGroup0c1.appendChild(ChoiceFieldGroup0c1c1);
        ChoiceFieldGroup0c1.innerHTML += "  ";
        ChoiceFieldGroup0.appendChild(ChoiceFieldGroup0c1);
        ChoiceFieldGroup0.innerHTML += "  ";
        var ChoiceFieldGroup0c3 = document.createElement("ul");
        ChoiceFieldGroup0c3.setAttribute("class", "ms-ChoiceFieldGroup-list");
        ChoiceFieldGroup0c3.innerHTML += "    ";
        ChoiceFieldGroup0c3.innerHTML += "";
        var ChoiceFieldGroup0c3c3 = document.createElement("div");
        ChoiceFieldGroup0c3c3.setAttribute("class", "ms-CheckBox");
        ChoiceFieldGroup0c3c3.innerHTML += "   ";
        var ChoiceFieldGroup0c3c3c1 = document.createElement("li");
        ChoiceFieldGroup0c3c3c1.setAttribute("role", "radio");
        ChoiceFieldGroup0c3c3c1.setAttribute("class", "ms-Choice-field ");
        ChoiceFieldGroup0c3c3c1.setAttribute("tabindex", "0");
        ChoiceFieldGroup0c3c3c1.setAttribute("aria-checked", "false");
        ChoiceFieldGroup0c3c3c1.setAttribute("name", "choicefieldgroup");
        ChoiceFieldGroup0c3c3c1.innerHTML += "      ";
        var ChoiceFieldGroup0c3c3c1c1 = document.createElement("span");
        ChoiceFieldGroup0c3c3c1c1.setAttribute("class", "ms-Label");
        ChoiceFieldGroup0c3c3c1c1.innerHTML += "Option 1";
        ChoiceFieldGroup0c3c3c1.appendChild(ChoiceFieldGroup0c3c3c1c1);
        ChoiceFieldGroup0c3c3c1.innerHTML += "  ";
        ChoiceFieldGroup0c3c3.appendChild(ChoiceFieldGroup0c3c3c1);
        ChoiceFieldGroup0c3c3.innerHTML += "";
        ChoiceFieldGroup0c3.appendChild(ChoiceFieldGroup0c3c3);
        ChoiceFieldGroup0c3.innerHTML += "     ";
        ChoiceFieldGroup0c3.innerHTML += "";
        var ChoiceFieldGroup0c3c7 = document.createElement("div");
        ChoiceFieldGroup0c3c7.setAttribute("class", "ms-CheckBox");
        ChoiceFieldGroup0c3c7.innerHTML += "   ";
        var ChoiceFieldGroup0c3c7c1 = document.createElement("li");
        ChoiceFieldGroup0c3c7c1.setAttribute("role", "radio");
        ChoiceFieldGroup0c3c7c1.setAttribute("class", "ms-Choice-field ");
        ChoiceFieldGroup0c3c7c1.setAttribute("tabindex", "0");
        ChoiceFieldGroup0c3c7c1.setAttribute("aria-checked", "false");
        ChoiceFieldGroup0c3c7c1.setAttribute("name", "choicefieldgroup");
        ChoiceFieldGroup0c3c7c1.innerHTML += "      ";
        var ChoiceFieldGroup0c3c7c1c1 = document.createElement("span");
        ChoiceFieldGroup0c3c7c1c1.setAttribute("class", "ms-Label");
        ChoiceFieldGroup0c3c7c1c1.innerHTML += "Option 2";
        ChoiceFieldGroup0c3c7c1.appendChild(ChoiceFieldGroup0c3c7c1c1);
        ChoiceFieldGroup0c3c7c1.innerHTML += "  ";
        ChoiceFieldGroup0c3c7.appendChild(ChoiceFieldGroup0c3c7c1);
        ChoiceFieldGroup0c3c7.innerHTML += "";
        ChoiceFieldGroup0c3.appendChild(ChoiceFieldGroup0c3c7);
        ChoiceFieldGroup0c3.innerHTML += "     ";
        ChoiceFieldGroup0c3.innerHTML += "";
        var ChoiceFieldGroup0c3c11 = document.createElement("div");
        ChoiceFieldGroup0c3c11.setAttribute("class", "ms-CheckBox");
        ChoiceFieldGroup0c3c11.innerHTML += "   ";
        var ChoiceFieldGroup0c3c11c1 = document.createElement("li");
        ChoiceFieldGroup0c3c11c1.setAttribute("role", "radio");
        ChoiceFieldGroup0c3c11c1.setAttribute("class", "ms-Choice-field ");
        ChoiceFieldGroup0c3c11c1.setAttribute("tabindex", "0");
        ChoiceFieldGroup0c3c11c1.setAttribute("aria-checked", "false");
        ChoiceFieldGroup0c3c11c1.setAttribute("name", "choicefieldgroup");
        ChoiceFieldGroup0c3c11c1.innerHTML += "      ";
        var ChoiceFieldGroup0c3c11c1c1 = document.createElement("span");
        ChoiceFieldGroup0c3c11c1c1.setAttribute("class", "ms-Label");
        ChoiceFieldGroup0c3c11c1c1.innerHTML += "Option 3";
        ChoiceFieldGroup0c3c11c1.appendChild(ChoiceFieldGroup0c3c11c1c1);
        ChoiceFieldGroup0c3c11c1.innerHTML += "  ";
        ChoiceFieldGroup0c3c11.appendChild(ChoiceFieldGroup0c3c11c1);
        ChoiceFieldGroup0c3c11.innerHTML += "";
        ChoiceFieldGroup0c3.appendChild(ChoiceFieldGroup0c3c11);
        ChoiceFieldGroup0c3.innerHTML += "     ";
        ChoiceFieldGroup0c3.innerHTML += "";
        var ChoiceFieldGroup0c3c15 = document.createElement("div");
        ChoiceFieldGroup0c3c15.setAttribute("class", "ms-CheckBox");
        ChoiceFieldGroup0c3c15.innerHTML += "   ";
        var ChoiceFieldGroup0c3c15c1 = document.createElement("li");
        ChoiceFieldGroup0c3c15c1.setAttribute("role", "radio");
        ChoiceFieldGroup0c3c15c1.setAttribute("class", "ms-Choice-field ");
        ChoiceFieldGroup0c3c15c1.setAttribute("tabindex", "0");
        ChoiceFieldGroup0c3c15c1.setAttribute("aria-checked", "false");
        ChoiceFieldGroup0c3c15c1.setAttribute("name", "choicefieldgroup");
        ChoiceFieldGroup0c3c15c1.innerHTML += "      ";
        var ChoiceFieldGroup0c3c15c1c1 = document.createElement("span");
        ChoiceFieldGroup0c3c15c1c1.setAttribute("class", "ms-Label");
        ChoiceFieldGroup0c3c15c1c1.innerHTML += "Option 4";
        ChoiceFieldGroup0c3c15c1.appendChild(ChoiceFieldGroup0c3c15c1c1);
        ChoiceFieldGroup0c3c15c1.innerHTML += "  ";
        ChoiceFieldGroup0c3c15.appendChild(ChoiceFieldGroup0c3c15c1);
        ChoiceFieldGroup0c3c15.innerHTML += "";
        ChoiceFieldGroup0c3.appendChild(ChoiceFieldGroup0c3c15);
        ChoiceFieldGroup0c3.innerHTML += "   ";
        ChoiceFieldGroup0.appendChild(ChoiceFieldGroup0c3);
        ChoiceFieldGroup0.innerHTML += "";
        return ChoiceFieldGroup0;
    };
    FabricTemplateLibrary.prototype.CommandBar = function () {
        var CommandBar0 = document.createElement("div");
        CommandBar0.setAttribute("class", "ms-CommandBar ");
        CommandBar0.innerHTML += "  ";
        var CommandBar0c1 = document.createElement("div");
        CommandBar0c1.setAttribute("class", "ms-CommandBar-mainArea");
        CommandBar0c1.innerHTML += "  ";
        CommandBar0.appendChild(CommandBar0c1);
        CommandBar0.innerHTML += "";
        return CommandBar0;
    };
    FabricTemplateLibrary.prototype.CommandButton = function () {
        var CommandButton0 = document.createElement("div");
        CommandButton0.setAttribute("class", "ms-CommandButton    ");
        CommandButton0.innerHTML += "  ";
        var CommandButton0c1 = document.createElement("button");
        CommandButton0c1.setAttribute("class", "ms-CommandButton-button");
        CommandButton0c1.innerHTML += "      ";
        var CommandButton0c1c1 = document.createElement("span");
        CommandButton0c1c1.setAttribute("class", "ms-CommandButton-icon ms-fontColor-themePrimary");
        var CommandButton0c1c1c0 = document.createElement("i");
        CommandButton0c1c1c0.setAttribute("class", "ms-Icon ms-Icon--circleFill");
        CommandButton0c1c1.appendChild(CommandButton0c1c1c0);
        CommandButton0c1.appendChild(CommandButton0c1c1);
        var CommandButton0c1c2 = document.createElement("span");
        CommandButton0c1c2.setAttribute("class", "ms-CommandButton-label");
        CommandButton0c1c2.innerHTML += "Command";
        CommandButton0c1.appendChild(CommandButton0c1c2);
        CommandButton0c1.innerHTML += "  ";
        CommandButton0.appendChild(CommandButton0c1);
        CommandButton0.innerHTML += "";
        return CommandButton0;
    };
    FabricTemplateLibrary.prototype.ContextualHost = function () {
        var ContextualHost0 = document.createElement("div");
        ContextualHost0.setAttribute("class", "ms-ContextualHost              ");
        ContextualHost0.innerHTML += "  ";
        var ContextualHost0c1 = document.createElement("div");
        ContextualHost0c1.setAttribute("class", "ms-ContextualHost-main");
        ContextualHost0c1.innerHTML += "        ";
        ContextualHost0.appendChild(ContextualHost0c1);
        ContextualHost0.innerHTML += "  ";
        var ContextualHost0c3 = document.createElement("div");
        ContextualHost0c3.setAttribute("class", "ms-ContextualHost-beak");
        ContextualHost0.appendChild(ContextualHost0c3);
        ContextualHost0.innerHTML += "";
        return ContextualHost0;
    };
    FabricTemplateLibrary.prototype.ContextualMenu = function () {
        var ContextualMenu0 = document.createElement("ul");
        ContextualMenu0.setAttribute("class", "ms-ContextualMenu  is-open ");
        ContextualMenu0.innerHTML += "      ";
        var ContextualMenu0c1 = document.createElement("li");
        ContextualMenu0c1.setAttribute("class", "ms-ContextualMenu-item ");
        ContextualMenu0c1.innerHTML += "        ";
        var ContextualMenu0c1c1 = document.createElement("a");
        ContextualMenu0c1c1.setAttribute("class", "ms-ContextualMenu-link ");
        ContextualMenu0c1c1.setAttribute("tabindex", "1");
        ContextualMenu0c1c1.innerHTML += "Animals";
        ContextualMenu0c1.appendChild(ContextualMenu0c1c1);
        ContextualMenu0c1.innerHTML += "              ";
        ContextualMenu0.appendChild(ContextualMenu0c1);
        ContextualMenu0.innerHTML += "      ";
        var ContextualMenu0c3 = document.createElement("li");
        ContextualMenu0c3.setAttribute("class", "ms-ContextualMenu-item ");
        ContextualMenu0c3.innerHTML += "        ";
        var ContextualMenu0c3c1 = document.createElement("a");
        ContextualMenu0c3c1.setAttribute("class", "ms-ContextualMenu-link ");
        ContextualMenu0c3c1.setAttribute("tabindex", "1");
        ContextualMenu0c3c1.innerHTML += "Books";
        ContextualMenu0c3.appendChild(ContextualMenu0c3c1);
        ContextualMenu0c3.innerHTML += "              ";
        ContextualMenu0.appendChild(ContextualMenu0c3);
        ContextualMenu0.innerHTML += "      ";
        var ContextualMenu0c5 = document.createElement("li");
        ContextualMenu0c5.setAttribute("class", "ms-ContextualMenu-item ");
        ContextualMenu0c5.innerHTML += "        ";
        var ContextualMenu0c5c1 = document.createElement("a");
        ContextualMenu0c5c1.setAttribute("class", "ms-ContextualMenu-link  is-selected ");
        ContextualMenu0c5c1.setAttribute("tabindex", "1");
        ContextualMenu0c5c1.innerHTML += "Education";
        ContextualMenu0c5.appendChild(ContextualMenu0c5c1);
        ContextualMenu0c5.innerHTML += "              ";
        ContextualMenu0.appendChild(ContextualMenu0c5);
        ContextualMenu0.innerHTML += "      ";
        var ContextualMenu0c7 = document.createElement("li");
        ContextualMenu0c7.setAttribute("class", "ms-ContextualMenu-item ");
        ContextualMenu0c7.innerHTML += "        ";
        var ContextualMenu0c7c1 = document.createElement("a");
        ContextualMenu0c7c1.setAttribute("class", "ms-ContextualMenu-link ");
        ContextualMenu0c7c1.setAttribute("tabindex", "1");
        ContextualMenu0c7c1.innerHTML += "Music";
        ContextualMenu0c7.appendChild(ContextualMenu0c7c1);
        ContextualMenu0c7.innerHTML += "              ";
        ContextualMenu0.appendChild(ContextualMenu0c7);
        ContextualMenu0.innerHTML += "      ";
        var ContextualMenu0c9 = document.createElement("li");
        ContextualMenu0c9.setAttribute("class", "ms-ContextualMenu-item ");
        ContextualMenu0c9.innerHTML += "        ";
        var ContextualMenu0c9c1 = document.createElement("a");
        ContextualMenu0c9c1.setAttribute("class", "ms-ContextualMenu-link  is-disabled ");
        ContextualMenu0c9c1.setAttribute("tabindex", "1");
        ContextualMenu0c9c1.innerHTML += "Sports";
        ContextualMenu0c9.appendChild(ContextualMenu0c9c1);
        ContextualMenu0c9.innerHTML += "              ";
        ContextualMenu0.appendChild(ContextualMenu0c9);
        ContextualMenu0.innerHTML += "";
        return ContextualMenu0;
    };
    FabricTemplateLibrary.prototype.DatePicker = function () {
        var DatePicker0 = document.createElement("div");
        DatePicker0.setAttribute("class", "ms-DatePicker");
        DatePicker0.innerHTML += "  ";
        var DatePicker0c1 = document.createElement("div");
        DatePicker0c1.setAttribute("class", "ms-TextField");
        DatePicker0c1.innerHTML += "    ";
        var DatePicker0c1c1 = document.createElement("label");
        DatePicker0c1c1.setAttribute("class", "ms-Label");
        DatePicker0c1c1.innerHTML += "Start date";
        DatePicker0c1.appendChild(DatePicker0c1c1);
        DatePicker0c1.innerHTML += "    ";
        var DatePicker0c1c3 = document.createElement("i");
        DatePicker0c1c3.setAttribute("class", "ms-DatePicker-event ms-Icon ms-Icon--event");
        DatePicker0c1.appendChild(DatePicker0c1c3);
        DatePicker0c1.innerHTML += "    ";
        var DatePicker0c1c5 = document.createElement("input");
        DatePicker0c1c5.setAttribute("class", "ms-TextField-field");
        DatePicker0c1c5.setAttribute("type", "text");
        DatePicker0c1c5.setAttribute("placeholder", "Select a date&hellip;");
        DatePicker0c1.appendChild(DatePicker0c1c5);
        DatePicker0c1.innerHTML += "  ";
        DatePicker0.appendChild(DatePicker0c1);
        DatePicker0.innerHTML += "  ";
        var DatePicker0c3 = document.createElement("div");
        DatePicker0c3.setAttribute("class", "ms-DatePicker-monthComponents");
        DatePicker0c3.innerHTML += "    ";
        var DatePicker0c3c1 = document.createElement("span");
        DatePicker0c3c1.setAttribute("class", "ms-DatePicker-nextMonth js-nextMonth");
        var DatePicker0c3c1c0 = document.createElement("i");
        DatePicker0c3c1c0.setAttribute("class", "ms-Icon ms-Icon--chevronRight");
        DatePicker0c3c1.appendChild(DatePicker0c3c1c0);
        DatePicker0c3.appendChild(DatePicker0c3c1);
        DatePicker0c3.innerHTML += "    ";
        var DatePicker0c3c3 = document.createElement("span");
        DatePicker0c3c3.setAttribute("class", "ms-DatePicker-prevMonth js-prevMonth");
        var DatePicker0c3c3c0 = document.createElement("i");
        DatePicker0c3c3c0.setAttribute("class", "ms-Icon ms-Icon--chevronLeft");
        DatePicker0c3c3.appendChild(DatePicker0c3c3c0);
        DatePicker0c3.appendChild(DatePicker0c3c3);
        DatePicker0c3.innerHTML += "    ";
        var DatePicker0c3c5 = document.createElement("div");
        DatePicker0c3c5.setAttribute("class", "ms-DatePicker-headerToggleView js-showMonthPicker");
        DatePicker0c3.appendChild(DatePicker0c3c5);
        DatePicker0c3.innerHTML += "  ";
        DatePicker0.appendChild(DatePicker0c3);
        DatePicker0.innerHTML += "  ";
        var DatePicker0c5 = document.createElement("span");
        DatePicker0c5.setAttribute("class", "ms-DatePicker-goToday js-goToday");
        DatePicker0c5.innerHTML += "Go to today";
        DatePicker0.appendChild(DatePicker0c5);
        DatePicker0.innerHTML += "  ";
        var DatePicker0c7 = document.createElement("div");
        DatePicker0c7.setAttribute("class", "ms-DatePicker-monthPicker");
        DatePicker0c7.innerHTML += "    ";
        var DatePicker0c7c1 = document.createElement("div");
        DatePicker0c7c1.setAttribute("class", "ms-DatePicker-header");
        DatePicker0c7c1.innerHTML += "      ";
        var DatePicker0c7c1c1 = document.createElement("div");
        DatePicker0c7c1c1.setAttribute("class", "ms-DatePicker-yearComponents");
        DatePicker0c7c1c1.innerHTML += "        ";
        var DatePicker0c7c1c1c1 = document.createElement("span");
        DatePicker0c7c1c1c1.setAttribute("class", "ms-DatePicker-nextYear js-nextYear");
        var DatePicker0c7c1c1c1c0 = document.createElement("i");
        DatePicker0c7c1c1c1c0.setAttribute("class", "ms-Icon ms-Icon--chevronRight");
        DatePicker0c7c1c1c1.appendChild(DatePicker0c7c1c1c1c0);
        DatePicker0c7c1c1.appendChild(DatePicker0c7c1c1c1);
        DatePicker0c7c1c1.innerHTML += "        ";
        var DatePicker0c7c1c1c3 = document.createElement("span");
        DatePicker0c7c1c1c3.setAttribute("class", "ms-DatePicker-prevYear js-prevYear");
        var DatePicker0c7c1c1c3c0 = document.createElement("i");
        DatePicker0c7c1c1c3c0.setAttribute("class", "ms-Icon ms-Icon--chevronLeft");
        DatePicker0c7c1c1c3.appendChild(DatePicker0c7c1c1c3c0);
        DatePicker0c7c1c1.appendChild(DatePicker0c7c1c1c3);
        DatePicker0c7c1c1.innerHTML += "      ";
        DatePicker0c7c1.appendChild(DatePicker0c7c1c1);
        DatePicker0c7c1.innerHTML += "      ";
        var DatePicker0c7c1c3 = document.createElement("div");
        DatePicker0c7c1c3.setAttribute("class", "ms-DatePicker-currentYear js-showYearPicker");
        DatePicker0c7c1.appendChild(DatePicker0c7c1c3);
        DatePicker0c7c1.innerHTML += "    ";
        DatePicker0c7.appendChild(DatePicker0c7c1);
        DatePicker0c7.innerHTML += "    ";
        var DatePicker0c7c3 = document.createElement("div");
        DatePicker0c7c3.setAttribute("class", "ms-DatePicker-optionGrid");
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c1 = document.createElement("span");
        DatePicker0c7c3c1.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c1.setAttribute("data-month", "0");
        DatePicker0c7c3c1.innerHTML += "Jan";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c1);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c3 = document.createElement("span");
        DatePicker0c7c3c3.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c3.setAttribute("data-month", "1");
        DatePicker0c7c3c3.innerHTML += "Feb";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c3);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c5 = document.createElement("span");
        DatePicker0c7c3c5.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c5.setAttribute("data-month", "2");
        DatePicker0c7c3c5.innerHTML += "Mar";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c5);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c7 = document.createElement("span");
        DatePicker0c7c3c7.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c7.setAttribute("data-month", "3");
        DatePicker0c7c3c7.innerHTML += "Apr";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c7);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c9 = document.createElement("span");
        DatePicker0c7c3c9.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c9.setAttribute("data-month", "4");
        DatePicker0c7c3c9.innerHTML += "May";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c9);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c11 = document.createElement("span");
        DatePicker0c7c3c11.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c11.setAttribute("data-month", "5");
        DatePicker0c7c3c11.innerHTML += "Jun";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c11);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c13 = document.createElement("span");
        DatePicker0c7c3c13.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c13.setAttribute("data-month", "6");
        DatePicker0c7c3c13.innerHTML += "Jul";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c13);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c15 = document.createElement("span");
        DatePicker0c7c3c15.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c15.setAttribute("data-month", "7");
        DatePicker0c7c3c15.innerHTML += "Aug";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c15);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c17 = document.createElement("span");
        DatePicker0c7c3c17.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c17.setAttribute("data-month", "8");
        DatePicker0c7c3c17.innerHTML += "Sep";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c17);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c19 = document.createElement("span");
        DatePicker0c7c3c19.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c19.setAttribute("data-month", "9");
        DatePicker0c7c3c19.innerHTML += "Oct";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c19);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c21 = document.createElement("span");
        DatePicker0c7c3c21.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c21.setAttribute("data-month", "10");
        DatePicker0c7c3c21.innerHTML += "Nov";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c21);
        DatePicker0c7c3.innerHTML += "      ";
        var DatePicker0c7c3c23 = document.createElement("span");
        DatePicker0c7c3c23.setAttribute("class", "ms-DatePicker-monthOption js-changeDate");
        DatePicker0c7c3c23.setAttribute("data-month", "11");
        DatePicker0c7c3c23.innerHTML += "Dec";
        DatePicker0c7c3.appendChild(DatePicker0c7c3c23);
        DatePicker0c7c3.innerHTML += "    ";
        DatePicker0c7.appendChild(DatePicker0c7c3);
        DatePicker0c7.innerHTML += "  ";
        DatePicker0.appendChild(DatePicker0c7);
        DatePicker0.innerHTML += "  ";
        var DatePicker0c9 = document.createElement("div");
        DatePicker0c9.setAttribute("class", "ms-DatePicker-yearPicker");
        DatePicker0c9.innerHTML += "    ";
        var DatePicker0c9c1 = document.createElement("div");
        DatePicker0c9c1.setAttribute("class", "ms-DatePicker-decadeComponents");
        DatePicker0c9c1.innerHTML += "      ";
        var DatePicker0c9c1c1 = document.createElement("span");
        DatePicker0c9c1c1.setAttribute("class", "ms-DatePicker-nextDecade js-nextDecade");
        var DatePicker0c9c1c1c0 = document.createElement("i");
        DatePicker0c9c1c1c0.setAttribute("class", "ms-Icon ms-Icon--chevronRight");
        DatePicker0c9c1c1.appendChild(DatePicker0c9c1c1c0);
        DatePicker0c9c1.appendChild(DatePicker0c9c1c1);
        DatePicker0c9c1.innerHTML += "      ";
        var DatePicker0c9c1c3 = document.createElement("span");
        DatePicker0c9c1c3.setAttribute("class", "ms-DatePicker-prevDecade js-prevDecade");
        var DatePicker0c9c1c3c0 = document.createElement("i");
        DatePicker0c9c1c3c0.setAttribute("class", "ms-Icon ms-Icon--chevronLeft");
        DatePicker0c9c1c3.appendChild(DatePicker0c9c1c3c0);
        DatePicker0c9c1.appendChild(DatePicker0c9c1c3);
        DatePicker0c9c1.innerHTML += "    ";
        DatePicker0c9.appendChild(DatePicker0c9c1);
        DatePicker0c9.innerHTML += "  ";
        DatePicker0.appendChild(DatePicker0c9);
        DatePicker0.innerHTML += "";
        return DatePicker0;
    };
    FabricTemplateLibrary.prototype.Dialog = function () {
        var Dialog0 = document.createElement("div");
        Dialog0.setAttribute("class", "ms-Dialog  ms-Dialog--sample ");
        Dialog0.innerHTML += "        ";
        var Dialog0c1 = document.createElement("button");
        Dialog0c1.setAttribute("class", "ms-Dialog-button ms-Dialog-buttonClose");
        Dialog0c1.innerHTML += "          ";
        var Dialog0c1c1 = document.createElement("i");
        Dialog0c1c1.setAttribute("class", "ms-Icon ms-Icon--x");
        Dialog0c1.appendChild(Dialog0c1c1);
        Dialog0c1.innerHTML += "        ";
        Dialog0.appendChild(Dialog0c1);
        Dialog0.innerHTML += "    ";
        var Dialog0c3 = document.createElement("div");
        Dialog0c3.setAttribute("class", "ms-Dialog-title");
        Dialog0c3.innerHTML += "All emails together";
        Dialog0.appendChild(Dialog0c3);
        Dialog0.innerHTML += "    ";
        var Dialog0c5 = document.createElement("div");
        Dialog0c5.setAttribute("class", "ms-Dialog-content");
        Dialog0c5.innerHTML += "        ";
        var Dialog0c5c1 = document.createElement("p");
        Dialog0c5c1.setAttribute("class", "ms-Dialog-subText");
        Dialog0c5c1.innerHTML += "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.";
        Dialog0c5.appendChild(Dialog0c5c1);
        Dialog0c5.innerHTML += "          ";
        Dialog0c5.innerHTML += "";
        var Dialog0c5c5 = document.createElement("div");
        Dialog0c5c5.setAttribute("class", "ms-CheckBox");
        Dialog0c5c5.innerHTML += "   ";
        var Dialog0c5c5c1 = document.createElement("li");
        Dialog0c5c5c1.setAttribute("role", "checkbox");
        Dialog0c5c5c1.setAttribute("class", "ms-Choice-field ");
        Dialog0c5c5c1.setAttribute("tabindex", "0");
        Dialog0c5c5c1.setAttribute("aria-checked", "false");
        Dialog0c5c5c1.setAttribute("name", "checkboxa");
        Dialog0c5c5c1.innerHTML += "      ";
        var Dialog0c5c5c1c1 = document.createElement("span");
        Dialog0c5c5c1c1.setAttribute("class", "ms-Label");
        Dialog0c5c5c1c1.innerHTML += "Option1";
        Dialog0c5c5c1.appendChild(Dialog0c5c5c1c1);
        Dialog0c5c5c1.innerHTML += "  ";
        Dialog0c5c5.appendChild(Dialog0c5c5c1);
        Dialog0c5c5.innerHTML += "";
        Dialog0c5.appendChild(Dialog0c5c5);
        Dialog0c5.innerHTML += "           ";
        Dialog0c5.innerHTML += "";
        var Dialog0c5c9 = document.createElement("div");
        Dialog0c5c9.setAttribute("class", "ms-CheckBox");
        Dialog0c5c9.innerHTML += "   ";
        var Dialog0c5c9c1 = document.createElement("li");
        Dialog0c5c9c1.setAttribute("role", "checkbox");
        Dialog0c5c9c1.setAttribute("class", "ms-Choice-field ");
        Dialog0c5c9c1.setAttribute("tabindex", "0");
        Dialog0c5c9c1.setAttribute("aria-checked", "false");
        Dialog0c5c9c1.setAttribute("name", "checkboxa");
        Dialog0c5c9c1.innerHTML += "      ";
        var Dialog0c5c9c1c1 = document.createElement("span");
        Dialog0c5c9c1c1.setAttribute("class", "ms-Label");
        Dialog0c5c9c1c1.innerHTML += "Option2";
        Dialog0c5c9c1.appendChild(Dialog0c5c9c1c1);
        Dialog0c5c9c1.innerHTML += "  ";
        Dialog0c5c9.appendChild(Dialog0c5c9c1);
        Dialog0c5c9.innerHTML += "";
        Dialog0c5.appendChild(Dialog0c5c9);
        Dialog0c5.innerHTML += "     ";
        Dialog0.appendChild(Dialog0c5);
        Dialog0.innerHTML += "      ";
        var Dialog0c7 = document.createElement("div");
        Dialog0c7.setAttribute("class", "ms-Dialog-actions");
        Dialog0c7.innerHTML += "          ";
        Dialog0c7.innerHTML += "";
        var Dialog0c7c3 = document.createElement("button");
        Dialog0c7c3.setAttribute("class", "ms-Button     ms-Button--primary      ");
        Dialog0c7c3.innerHTML += "  ";
        var Dialog0c7c3c1 = document.createElement("span");
        Dialog0c7c3c1.setAttribute("class", "ms-Button-label");
        Dialog0c7c3c1.innerHTML += "Save";
        Dialog0c7c3.appendChild(Dialog0c7c3c1);
        Dialog0c7c3.innerHTML += "";
        Dialog0c7.appendChild(Dialog0c7c3);
        Dialog0c7.innerHTML += "          ";
        Dialog0c7.innerHTML += "";
        var Dialog0c7c7 = document.createElement("button");
        Dialog0c7c7.setAttribute("class", "ms-Button         ");
        Dialog0c7c7.innerHTML += "  ";
        var Dialog0c7c7c1 = document.createElement("span");
        Dialog0c7c7c1.setAttribute("class", "ms-Button-label");
        Dialog0c7c7c1.innerHTML += "Cancel";
        Dialog0c7c7.appendChild(Dialog0c7c7c1);
        Dialog0c7c7.innerHTML += "";
        Dialog0c7.appendChild(Dialog0c7c7);
        Dialog0c7.innerHTML += "      ";
        Dialog0.appendChild(Dialog0c7);
        Dialog0.innerHTML += "";
        return Dialog0;
    };
    FabricTemplateLibrary.prototype.DialogHost = function () {
        var DialogHost0 = document.createElement("div");
        DialogHost0.setAttribute("class", "ms-DialogHost      ");
        DialogHost0.innerHTML += "  ";
        var DialogHost0c1 = document.createElement("div");
        DialogHost0c1.setAttribute("class", "ms-DialogHost-main");
        DialogHost0c1.innerHTML += "        ";
        DialogHost0.appendChild(DialogHost0c1);
        DialogHost0.innerHTML += "";
        return DialogHost0;
    };
    FabricTemplateLibrary.prototype.Dropdown = function () {
        var Dropdown0 = document.createElement("div");
        Dropdown0.setAttribute("class", "ms-Dropdown  ");
        Dropdown0.setAttribute("tabindex", "0");
        Dropdown0.innerHTML += "  ";
        var Dropdown0c1 = document.createElement("label");
        Dropdown0c1.setAttribute("class", "ms-Label");
        Dropdown0c1.innerHTML += "Dropdown label";
        Dropdown0.appendChild(Dropdown0c1);
        Dropdown0.innerHTML += "  ";
        var Dropdown0c3 = document.createElement("i");
        Dropdown0c3.setAttribute("class", "ms-Dropdown-caretDown ms-Icon ms-Icon--caretDown");
        Dropdown0.appendChild(Dropdown0c3);
        Dropdown0.innerHTML += "  ";
        var Dropdown0c5 = document.createElement("select");
        Dropdown0c5.setAttribute("class", "ms-Dropdown-select");
        Dropdown0c5.innerHTML += "      ";
        var Dropdown0c5c1 = document.createElement("option");
        Dropdown0c5c1.innerHTML += "Choose a sound&amp;hellip;";
        Dropdown0c5.appendChild(Dropdown0c5c1);
        Dropdown0c5.innerHTML += "      ";
        var Dropdown0c5c3 = document.createElement("option");
        Dropdown0c5c3.innerHTML += "Dog barking";
        Dropdown0c5.appendChild(Dropdown0c5c3);
        Dropdown0c5.innerHTML += "      ";
        var Dropdown0c5c5 = document.createElement("option");
        Dropdown0c5c5.innerHTML += "Wind blowing";
        Dropdown0c5.appendChild(Dropdown0c5c5);
        Dropdown0c5.innerHTML += "      ";
        var Dropdown0c5c7 = document.createElement("option");
        Dropdown0c5c7.innerHTML += "Duck quacking";
        Dropdown0c5.appendChild(Dropdown0c5c7);
        Dropdown0c5.innerHTML += "      ";
        var Dropdown0c5c9 = document.createElement("option");
        Dropdown0c5c9.innerHTML += "Cow mooing";
        Dropdown0c5.appendChild(Dropdown0c5c9);
        Dropdown0c5.innerHTML += "  ";
        Dropdown0.appendChild(Dropdown0c5);
        Dropdown0.innerHTML += "";
        return Dropdown0;
    };
    FabricTemplateLibrary.prototype.FacePile = function () {
        var FacePile0 = document.createElement("div");
        FacePile0.setAttribute("class", "ms-FacePile");
        FacePile0.innerHTML += "  ";
        var FacePile0c1 = document.createElement("button");
        FacePile0c1.setAttribute("class", "ms-FacePile-addButton ms-FacePile-addButton--addPerson js-addPerson");
        FacePile0c1.innerHTML += "    ";
        var FacePile0c1c1 = document.createElement("i");
        FacePile0c1c1.setAttribute("class", "ms-FacePile-addPersonIcon ms-Icon ms-Icon--personAdd");
        FacePile0c1.appendChild(FacePile0c1c1);
        FacePile0c1.innerHTML += "  ";
        FacePile0.appendChild(FacePile0c1);
        FacePile0.innerHTML += "        ";
        FacePile0.innerHTML += "            ";
        var FacePile0c5 = document.createElement("div");
        FacePile0c5.setAttribute("class", "ms-Persona      ");
        FacePile0c5.innerHTML += "        ";
        var FacePile0c5c1 = document.createElement("div");
        FacePile0c5c1.setAttribute("class", "ms-Persona-imageArea");
        FacePile0c5c1.innerHTML += "        ";
        FacePile0c5.appendChild(FacePile0c5c1);
        FacePile0c5.innerHTML += "        ";
        var FacePile0c5c3 = document.createElement("div");
        FacePile0c5c3.setAttribute("class", "ms-Persona-presence");
        FacePile0c5c3.innerHTML += "        ";
        FacePile0c5.appendChild(FacePile0c5c3);
        FacePile0c5.innerHTML += "        ";
        var FacePile0c5c5 = document.createElement("div");
        FacePile0c5c5.setAttribute("class", "ms-Persona-details");
        FacePile0c5c5.innerHTML += "        ";
        FacePile0c5.appendChild(FacePile0c5c5);
        FacePile0c5.innerHTML += "      ";
        FacePile0.appendChild(FacePile0c5);
        FacePile0.innerHTML += "      ";
        FacePile0.innerHTML += "            ";
        var FacePile0c9 = document.createElement("div");
        FacePile0c9.setAttribute("class", "ms-Persona      ");
        FacePile0c9.innerHTML += "        ";
        var FacePile0c9c1 = document.createElement("div");
        FacePile0c9c1.setAttribute("class", "ms-Persona-imageArea");
        FacePile0c9c1.innerHTML += "        ";
        FacePile0c9.appendChild(FacePile0c9c1);
        FacePile0c9.innerHTML += "        ";
        var FacePile0c9c3 = document.createElement("div");
        FacePile0c9c3.setAttribute("class", "ms-Persona-presence");
        FacePile0c9c3.innerHTML += "        ";
        FacePile0c9.appendChild(FacePile0c9c3);
        FacePile0c9.innerHTML += "        ";
        var FacePile0c9c5 = document.createElement("div");
        FacePile0c9c5.setAttribute("class", "ms-Persona-details");
        FacePile0c9c5.innerHTML += "        ";
        FacePile0c9.appendChild(FacePile0c9c5);
        FacePile0c9.innerHTML += "      ";
        FacePile0.appendChild(FacePile0c9);
        FacePile0.innerHTML += "      ";
        FacePile0.innerHTML += "            ";
        var FacePile0c13 = document.createElement("div");
        FacePile0c13.setAttribute("class", "ms-Persona      ");
        FacePile0c13.innerHTML += "        ";
        var FacePile0c13c1 = document.createElement("div");
        FacePile0c13c1.setAttribute("class", "ms-Persona-imageArea");
        FacePile0c13c1.innerHTML += "        ";
        FacePile0c13.appendChild(FacePile0c13c1);
        FacePile0c13.innerHTML += "        ";
        var FacePile0c13c3 = document.createElement("div");
        FacePile0c13c3.setAttribute("class", "ms-Persona-presence");
        FacePile0c13c3.innerHTML += "        ";
        FacePile0c13.appendChild(FacePile0c13c3);
        FacePile0c13.innerHTML += "        ";
        var FacePile0c13c5 = document.createElement("div");
        FacePile0c13c5.setAttribute("class", "ms-Persona-details");
        FacePile0c13c5.innerHTML += "        ";
        FacePile0c13.appendChild(FacePile0c13c5);
        FacePile0c13.innerHTML += "      ";
        FacePile0.appendChild(FacePile0c13);
        FacePile0.innerHTML += "    ";
        var FacePile0c15 = document.createElement("button");
        FacePile0c15.setAttribute("class", "ms-FacePile-addButton ms-FacePile-addButton--overflow js-overflowPanel");
        FacePile0c15.innerHTML += "    ";
        var FacePile0c15c1 = document.createElement("span");
        FacePile0c15c1.setAttribute("class", "ms-FacePile-overflowText");
        FacePile0c15c1.innerHTML += "+3";
        FacePile0c15.appendChild(FacePile0c15c1);
        FacePile0c15.innerHTML += "  ";
        FacePile0.appendChild(FacePile0c15);
        FacePile0.innerHTML += "";
        return FacePile0;
    };
    FabricTemplateLibrary.prototype.Label = function () {
        var Label0 = document.createElement("label");
        Label0.setAttribute("class", "ms-Label  ");
        Label0.innerHTML += "Name";
        return Label0;
    };
    FabricTemplateLibrary.prototype.Link = function () {
        var Link0 = document.createElement("a");
        Link0.setAttribute("class", "ms-Link  ");
        Link0.innerHTML += "Example Link";
        return Link0;
    };
    FabricTemplateLibrary.prototype.List = function () {
        var List0 = document.createElement("ul");
        List0.setAttribute("class", "ms-List ");
        List0.innerHTML += "    ";
        List0.innerHTML += "        ";
        var List0c3 = document.createElement("li");
        List0c3.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c3.setAttribute("tabindex", "0");
        List0c3.innerHTML += "            ";
        var List0c3c1 = document.createElement("span");
        List0c3c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c3c1.innerHTML += "Alton Lafferty";
        List0c3.appendChild(List0c3c1);
        List0c3.innerHTML += "      ";
        var List0c3c3 = document.createElement("span");
        List0c3c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c3c3.innerHTML += "Meeting notes";
        List0c3.appendChild(List0c3c3);
        List0c3.innerHTML += "      ";
        var List0c3c5 = document.createElement("span");
        List0c3c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c3c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c3.appendChild(List0c3c5);
        List0c3.innerHTML += "      ";
        var List0c3c7 = document.createElement("span");
        List0c3c7.setAttribute("class", "ms-ListItem-metaText");
        List0c3c7.innerHTML += "2:42p";
        List0c3.appendChild(List0c3c7);
        List0c3.innerHTML += "            ";
        var List0c3c9 = document.createElement("div");
        List0c3c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c3.appendChild(List0c3c9);
        List0c3.innerHTML += "      ";
        var List0c3c11 = document.createElement("div");
        List0c3c11.setAttribute("class", "ms-ListItem-actions");
        List0c3c11.innerHTML += "                ";
        var List0c3c11c1 = document.createElement("div");
        List0c3c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c3c11c1c0 = document.createElement("i");
        List0c3c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c3c11c1.appendChild(List0c3c11c1c0);
        List0c3c11.appendChild(List0c3c11c1);
        List0c3c11.innerHTML += "        ";
        var List0c3c11c3 = document.createElement("div");
        List0c3c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c3c11c3c0 = document.createElement("i");
        List0c3c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c3c11c3.appendChild(List0c3c11c3c0);
        List0c3c11.appendChild(List0c3c11c3);
        List0c3c11.innerHTML += "        ";
        var List0c3c11c5 = document.createElement("div");
        List0c3c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c3c11c5c0 = document.createElement("i");
        List0c3c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c3c11c5.appendChild(List0c3c11c5c0);
        List0c3c11.appendChild(List0c3c11c5);
        List0c3c11.innerHTML += "        ";
        var List0c3c11c7 = document.createElement("div");
        List0c3c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c3c11c7c0 = document.createElement("i");
        List0c3c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c3c11c7.appendChild(List0c3c11c7c0);
        List0c3c11.appendChild(List0c3c11c7);
        List0c3c11.innerHTML += "      ";
        List0c3.appendChild(List0c3c11);
        List0c3.innerHTML += "    ";
        List0.appendChild(List0c3);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c7 = document.createElement("li");
        List0c7.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c7.setAttribute("tabindex", "0");
        List0c7.innerHTML += "            ";
        var List0c7c1 = document.createElement("span");
        List0c7c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c7c1.innerHTML += "Alton Lafferty";
        List0c7.appendChild(List0c7c1);
        List0c7.innerHTML += "      ";
        var List0c7c3 = document.createElement("span");
        List0c7c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c7c3.innerHTML += "Meeting notes";
        List0c7.appendChild(List0c7c3);
        List0c7.innerHTML += "      ";
        var List0c7c5 = document.createElement("span");
        List0c7c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c7c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c7.appendChild(List0c7c5);
        List0c7.innerHTML += "      ";
        var List0c7c7 = document.createElement("span");
        List0c7c7.setAttribute("class", "ms-ListItem-metaText");
        List0c7c7.innerHTML += "2:42p";
        List0c7.appendChild(List0c7c7);
        List0c7.innerHTML += "            ";
        var List0c7c9 = document.createElement("div");
        List0c7c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c7.appendChild(List0c7c9);
        List0c7.innerHTML += "      ";
        var List0c7c11 = document.createElement("div");
        List0c7c11.setAttribute("class", "ms-ListItem-actions");
        List0c7c11.innerHTML += "                ";
        var List0c7c11c1 = document.createElement("div");
        List0c7c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c7c11c1c0 = document.createElement("i");
        List0c7c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c7c11c1.appendChild(List0c7c11c1c0);
        List0c7c11.appendChild(List0c7c11c1);
        List0c7c11.innerHTML += "        ";
        var List0c7c11c3 = document.createElement("div");
        List0c7c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c7c11c3c0 = document.createElement("i");
        List0c7c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c7c11c3.appendChild(List0c7c11c3c0);
        List0c7c11.appendChild(List0c7c11c3);
        List0c7c11.innerHTML += "        ";
        var List0c7c11c5 = document.createElement("div");
        List0c7c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c7c11c5c0 = document.createElement("i");
        List0c7c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c7c11c5.appendChild(List0c7c11c5c0);
        List0c7c11.appendChild(List0c7c11c5);
        List0c7c11.innerHTML += "        ";
        var List0c7c11c7 = document.createElement("div");
        List0c7c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c7c11c7c0 = document.createElement("i");
        List0c7c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c7c11c7.appendChild(List0c7c11c7c0);
        List0c7c11.appendChild(List0c7c11c7);
        List0c7c11.innerHTML += "      ";
        List0c7.appendChild(List0c7c11);
        List0c7.innerHTML += "    ";
        List0.appendChild(List0c7);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c11 = document.createElement("li");
        List0c11.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c11.setAttribute("tabindex", "0");
        List0c11.innerHTML += "            ";
        var List0c11c1 = document.createElement("span");
        List0c11c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c11c1.innerHTML += "Alton Lafferty";
        List0c11.appendChild(List0c11c1);
        List0c11.innerHTML += "      ";
        var List0c11c3 = document.createElement("span");
        List0c11c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c11c3.innerHTML += "Meeting notes";
        List0c11.appendChild(List0c11c3);
        List0c11.innerHTML += "      ";
        var List0c11c5 = document.createElement("span");
        List0c11c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c11c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c11.appendChild(List0c11c5);
        List0c11.innerHTML += "      ";
        var List0c11c7 = document.createElement("span");
        List0c11c7.setAttribute("class", "ms-ListItem-metaText");
        List0c11c7.innerHTML += "2:42p";
        List0c11.appendChild(List0c11c7);
        List0c11.innerHTML += "            ";
        var List0c11c9 = document.createElement("div");
        List0c11c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c11.appendChild(List0c11c9);
        List0c11.innerHTML += "      ";
        var List0c11c11 = document.createElement("div");
        List0c11c11.setAttribute("class", "ms-ListItem-actions");
        List0c11c11.innerHTML += "                ";
        var List0c11c11c1 = document.createElement("div");
        List0c11c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c11c11c1c0 = document.createElement("i");
        List0c11c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c11c11c1.appendChild(List0c11c11c1c0);
        List0c11c11.appendChild(List0c11c11c1);
        List0c11c11.innerHTML += "        ";
        var List0c11c11c3 = document.createElement("div");
        List0c11c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c11c11c3c0 = document.createElement("i");
        List0c11c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c11c11c3.appendChild(List0c11c11c3c0);
        List0c11c11.appendChild(List0c11c11c3);
        List0c11c11.innerHTML += "        ";
        var List0c11c11c5 = document.createElement("div");
        List0c11c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c11c11c5c0 = document.createElement("i");
        List0c11c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c11c11c5.appendChild(List0c11c11c5c0);
        List0c11c11.appendChild(List0c11c11c5);
        List0c11c11.innerHTML += "        ";
        var List0c11c11c7 = document.createElement("div");
        List0c11c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c11c11c7c0 = document.createElement("i");
        List0c11c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c11c11c7.appendChild(List0c11c11c7c0);
        List0c11c11.appendChild(List0c11c11c7);
        List0c11c11.innerHTML += "      ";
        List0c11.appendChild(List0c11c11);
        List0c11.innerHTML += "    ";
        List0.appendChild(List0c11);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c15 = document.createElement("li");
        List0c15.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c15.setAttribute("tabindex", "0");
        List0c15.innerHTML += "            ";
        var List0c15c1 = document.createElement("span");
        List0c15c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c15c1.innerHTML += "Alton Lafferty";
        List0c15.appendChild(List0c15c1);
        List0c15.innerHTML += "      ";
        var List0c15c3 = document.createElement("span");
        List0c15c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c15c3.innerHTML += "Meeting notes";
        List0c15.appendChild(List0c15c3);
        List0c15.innerHTML += "      ";
        var List0c15c5 = document.createElement("span");
        List0c15c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c15c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c15.appendChild(List0c15c5);
        List0c15.innerHTML += "      ";
        var List0c15c7 = document.createElement("span");
        List0c15c7.setAttribute("class", "ms-ListItem-metaText");
        List0c15c7.innerHTML += "2:42p";
        List0c15.appendChild(List0c15c7);
        List0c15.innerHTML += "            ";
        var List0c15c9 = document.createElement("div");
        List0c15c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c15.appendChild(List0c15c9);
        List0c15.innerHTML += "      ";
        var List0c15c11 = document.createElement("div");
        List0c15c11.setAttribute("class", "ms-ListItem-actions");
        List0c15c11.innerHTML += "                ";
        var List0c15c11c1 = document.createElement("div");
        List0c15c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c15c11c1c0 = document.createElement("i");
        List0c15c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c15c11c1.appendChild(List0c15c11c1c0);
        List0c15c11.appendChild(List0c15c11c1);
        List0c15c11.innerHTML += "        ";
        var List0c15c11c3 = document.createElement("div");
        List0c15c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c15c11c3c0 = document.createElement("i");
        List0c15c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c15c11c3.appendChild(List0c15c11c3c0);
        List0c15c11.appendChild(List0c15c11c3);
        List0c15c11.innerHTML += "        ";
        var List0c15c11c5 = document.createElement("div");
        List0c15c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c15c11c5c0 = document.createElement("i");
        List0c15c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c15c11c5.appendChild(List0c15c11c5c0);
        List0c15c11.appendChild(List0c15c11c5);
        List0c15c11.innerHTML += "        ";
        var List0c15c11c7 = document.createElement("div");
        List0c15c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c15c11c7c0 = document.createElement("i");
        List0c15c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c15c11c7.appendChild(List0c15c11c7c0);
        List0c15c11.appendChild(List0c15c11c7);
        List0c15c11.innerHTML += "      ";
        List0c15.appendChild(List0c15c11);
        List0c15.innerHTML += "    ";
        List0.appendChild(List0c15);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c19 = document.createElement("li");
        List0c19.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c19.setAttribute("tabindex", "0");
        List0c19.innerHTML += "            ";
        var List0c19c1 = document.createElement("span");
        List0c19c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c19c1.innerHTML += "Alton Lafferty";
        List0c19.appendChild(List0c19c1);
        List0c19.innerHTML += "      ";
        var List0c19c3 = document.createElement("span");
        List0c19c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c19c3.innerHTML += "Meeting notes";
        List0c19.appendChild(List0c19c3);
        List0c19.innerHTML += "      ";
        var List0c19c5 = document.createElement("span");
        List0c19c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c19c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c19.appendChild(List0c19c5);
        List0c19.innerHTML += "      ";
        var List0c19c7 = document.createElement("span");
        List0c19c7.setAttribute("class", "ms-ListItem-metaText");
        List0c19c7.innerHTML += "2:42p";
        List0c19.appendChild(List0c19c7);
        List0c19.innerHTML += "            ";
        var List0c19c9 = document.createElement("div");
        List0c19c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c19.appendChild(List0c19c9);
        List0c19.innerHTML += "      ";
        var List0c19c11 = document.createElement("div");
        List0c19c11.setAttribute("class", "ms-ListItem-actions");
        List0c19c11.innerHTML += "                ";
        var List0c19c11c1 = document.createElement("div");
        List0c19c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c19c11c1c0 = document.createElement("i");
        List0c19c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c19c11c1.appendChild(List0c19c11c1c0);
        List0c19c11.appendChild(List0c19c11c1);
        List0c19c11.innerHTML += "        ";
        var List0c19c11c3 = document.createElement("div");
        List0c19c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c19c11c3c0 = document.createElement("i");
        List0c19c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c19c11c3.appendChild(List0c19c11c3c0);
        List0c19c11.appendChild(List0c19c11c3);
        List0c19c11.innerHTML += "        ";
        var List0c19c11c5 = document.createElement("div");
        List0c19c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c19c11c5c0 = document.createElement("i");
        List0c19c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c19c11c5.appendChild(List0c19c11c5c0);
        List0c19c11.appendChild(List0c19c11c5);
        List0c19c11.innerHTML += "        ";
        var List0c19c11c7 = document.createElement("div");
        List0c19c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c19c11c7c0 = document.createElement("i");
        List0c19c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c19c11c7.appendChild(List0c19c11c7c0);
        List0c19c11.appendChild(List0c19c11c7);
        List0c19c11.innerHTML += "      ";
        List0c19.appendChild(List0c19c11);
        List0c19.innerHTML += "    ";
        List0.appendChild(List0c19);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c23 = document.createElement("li");
        List0c23.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c23.setAttribute("tabindex", "0");
        List0c23.innerHTML += "            ";
        var List0c23c1 = document.createElement("span");
        List0c23c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c23c1.innerHTML += "Alton Lafferty";
        List0c23.appendChild(List0c23c1);
        List0c23.innerHTML += "      ";
        var List0c23c3 = document.createElement("span");
        List0c23c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c23c3.innerHTML += "Meeting notes";
        List0c23.appendChild(List0c23c3);
        List0c23.innerHTML += "      ";
        var List0c23c5 = document.createElement("span");
        List0c23c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c23c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c23.appendChild(List0c23c5);
        List0c23.innerHTML += "      ";
        var List0c23c7 = document.createElement("span");
        List0c23c7.setAttribute("class", "ms-ListItem-metaText");
        List0c23c7.innerHTML += "2:42p";
        List0c23.appendChild(List0c23c7);
        List0c23.innerHTML += "            ";
        var List0c23c9 = document.createElement("div");
        List0c23c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c23.appendChild(List0c23c9);
        List0c23.innerHTML += "      ";
        var List0c23c11 = document.createElement("div");
        List0c23c11.setAttribute("class", "ms-ListItem-actions");
        List0c23c11.innerHTML += "                ";
        var List0c23c11c1 = document.createElement("div");
        List0c23c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c23c11c1c0 = document.createElement("i");
        List0c23c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c23c11c1.appendChild(List0c23c11c1c0);
        List0c23c11.appendChild(List0c23c11c1);
        List0c23c11.innerHTML += "        ";
        var List0c23c11c3 = document.createElement("div");
        List0c23c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c23c11c3c0 = document.createElement("i");
        List0c23c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c23c11c3.appendChild(List0c23c11c3c0);
        List0c23c11.appendChild(List0c23c11c3);
        List0c23c11.innerHTML += "        ";
        var List0c23c11c5 = document.createElement("div");
        List0c23c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c23c11c5c0 = document.createElement("i");
        List0c23c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c23c11c5.appendChild(List0c23c11c5c0);
        List0c23c11.appendChild(List0c23c11c5);
        List0c23c11.innerHTML += "        ";
        var List0c23c11c7 = document.createElement("div");
        List0c23c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c23c11c7c0 = document.createElement("i");
        List0c23c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c23c11c7.appendChild(List0c23c11c7c0);
        List0c23c11.appendChild(List0c23c11c7);
        List0c23c11.innerHTML += "      ";
        List0c23.appendChild(List0c23c11);
        List0c23.innerHTML += "    ";
        List0.appendChild(List0c23);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c27 = document.createElement("li");
        List0c27.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c27.setAttribute("tabindex", "0");
        List0c27.innerHTML += "            ";
        var List0c27c1 = document.createElement("span");
        List0c27c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c27c1.innerHTML += "Alton Lafferty";
        List0c27.appendChild(List0c27c1);
        List0c27.innerHTML += "      ";
        var List0c27c3 = document.createElement("span");
        List0c27c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c27c3.innerHTML += "Meeting notes";
        List0c27.appendChild(List0c27c3);
        List0c27.innerHTML += "      ";
        var List0c27c5 = document.createElement("span");
        List0c27c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c27c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c27.appendChild(List0c27c5);
        List0c27.innerHTML += "      ";
        var List0c27c7 = document.createElement("span");
        List0c27c7.setAttribute("class", "ms-ListItem-metaText");
        List0c27c7.innerHTML += "2:42p";
        List0c27.appendChild(List0c27c7);
        List0c27.innerHTML += "            ";
        var List0c27c9 = document.createElement("div");
        List0c27c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c27.appendChild(List0c27c9);
        List0c27.innerHTML += "      ";
        var List0c27c11 = document.createElement("div");
        List0c27c11.setAttribute("class", "ms-ListItem-actions");
        List0c27c11.innerHTML += "                ";
        var List0c27c11c1 = document.createElement("div");
        List0c27c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c27c11c1c0 = document.createElement("i");
        List0c27c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c27c11c1.appendChild(List0c27c11c1c0);
        List0c27c11.appendChild(List0c27c11c1);
        List0c27c11.innerHTML += "        ";
        var List0c27c11c3 = document.createElement("div");
        List0c27c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c27c11c3c0 = document.createElement("i");
        List0c27c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c27c11c3.appendChild(List0c27c11c3c0);
        List0c27c11.appendChild(List0c27c11c3);
        List0c27c11.innerHTML += "        ";
        var List0c27c11c5 = document.createElement("div");
        List0c27c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c27c11c5c0 = document.createElement("i");
        List0c27c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c27c11c5.appendChild(List0c27c11c5c0);
        List0c27c11.appendChild(List0c27c11c5);
        List0c27c11.innerHTML += "        ";
        var List0c27c11c7 = document.createElement("div");
        List0c27c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c27c11c7c0 = document.createElement("i");
        List0c27c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c27c11c7.appendChild(List0c27c11c7c0);
        List0c27c11.appendChild(List0c27c11c7);
        List0c27c11.innerHTML += "      ";
        List0c27.appendChild(List0c27c11);
        List0c27.innerHTML += "    ";
        List0.appendChild(List0c27);
        List0.innerHTML += "        ";
        List0.innerHTML += "        ";
        var List0c31 = document.createElement("li");
        List0c31.setAttribute("class", "ms-ListItem  is-unread is-selectable");
        List0c31.setAttribute("tabindex", "0");
        List0c31.innerHTML += "            ";
        var List0c31c1 = document.createElement("span");
        List0c31c1.setAttribute("class", "ms-ListItem-primaryText");
        List0c31c1.innerHTML += "Alton Lafferty";
        List0c31.appendChild(List0c31c1);
        List0c31.innerHTML += "      ";
        var List0c31c3 = document.createElement("span");
        List0c31c3.setAttribute("class", "ms-ListItem-secondaryText");
        List0c31c3.innerHTML += "Meeting notes";
        List0c31.appendChild(List0c31c3);
        List0c31.innerHTML += "      ";
        var List0c31c5 = document.createElement("span");
        List0c31c5.setAttribute("class", "ms-ListItem-tertiaryText");
        List0c31c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        List0c31.appendChild(List0c31c5);
        List0c31.innerHTML += "      ";
        var List0c31c7 = document.createElement("span");
        List0c31c7.setAttribute("class", "ms-ListItem-metaText");
        List0c31c7.innerHTML += "2:42p";
        List0c31.appendChild(List0c31c7);
        List0c31.innerHTML += "            ";
        var List0c31c9 = document.createElement("div");
        List0c31c9.setAttribute("class", "ms-ListItem-selectionTarget");
        List0c31.appendChild(List0c31c9);
        List0c31.innerHTML += "      ";
        var List0c31c11 = document.createElement("div");
        List0c31c11.setAttribute("class", "ms-ListItem-actions");
        List0c31c11.innerHTML += "                ";
        var List0c31c11c1 = document.createElement("div");
        List0c31c11c1.setAttribute("class", "ms-ListItem-action");
        var List0c31c11c1c0 = document.createElement("i");
        List0c31c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        List0c31c11c1.appendChild(List0c31c11c1c0);
        List0c31c11.appendChild(List0c31c11c1);
        List0c31c11.innerHTML += "        ";
        var List0c31c11c3 = document.createElement("div");
        List0c31c11c3.setAttribute("class", "ms-ListItem-action");
        var List0c31c11c3c0 = document.createElement("i");
        List0c31c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        List0c31c11c3.appendChild(List0c31c11c3c0);
        List0c31c11.appendChild(List0c31c11c3);
        List0c31c11.innerHTML += "        ";
        var List0c31c11c5 = document.createElement("div");
        List0c31c11c5.setAttribute("class", "ms-ListItem-action");
        var List0c31c11c5c0 = document.createElement("i");
        List0c31c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        List0c31c11c5.appendChild(List0c31c11c5c0);
        List0c31c11.appendChild(List0c31c11c5);
        List0c31c11.innerHTML += "        ";
        var List0c31c11c7 = document.createElement("div");
        List0c31c11c7.setAttribute("class", "ms-ListItem-action");
        var List0c31c11c7c0 = document.createElement("i");
        List0c31c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        List0c31c11c7.appendChild(List0c31c11c7c0);
        List0c31c11.appendChild(List0c31c11c7);
        List0c31c11.innerHTML += "      ";
        List0c31.appendChild(List0c31c11);
        List0c31.innerHTML += "    ";
        List0.appendChild(List0c31);
        List0.innerHTML += "    ";
        return List0;
    };
    FabricTemplateLibrary.prototype.ListItem = function () {
        var ListItem0 = document.createElement("li");
        ListItem0.setAttribute("class", "ms-ListItem  ");
        ListItem0.setAttribute("tabindex", "0");
        ListItem0.innerHTML += "    ";
        var ListItem0c1 = document.createElement("span");
        ListItem0c1.setAttribute("class", "ms-ListItem-primaryText");
        ListItem0c1.innerHTML += "Alton Lafferty";
        ListItem0.appendChild(ListItem0c1);
        ListItem0.innerHTML += "  ";
        var ListItem0c3 = document.createElement("span");
        ListItem0c3.setAttribute("class", "ms-ListItem-secondaryText");
        ListItem0c3.innerHTML += "Meeting notes";
        ListItem0.appendChild(ListItem0c3);
        ListItem0.innerHTML += "  ";
        var ListItem0c5 = document.createElement("span");
        ListItem0c5.setAttribute("class", "ms-ListItem-tertiaryText");
        ListItem0c5.innerHTML += "Today we discussed the importance of a, b, and c in regards to d.";
        ListItem0.appendChild(ListItem0c5);
        ListItem0.innerHTML += "  ";
        var ListItem0c7 = document.createElement("span");
        ListItem0c7.setAttribute("class", "ms-ListItem-metaText");
        ListItem0c7.innerHTML += "2:42p";
        ListItem0.appendChild(ListItem0c7);
        ListItem0.innerHTML += "    ";
        var ListItem0c9 = document.createElement("div");
        ListItem0c9.setAttribute("class", "ms-ListItem-selectionTarget");
        ListItem0.appendChild(ListItem0c9);
        ListItem0.innerHTML += "  ";
        var ListItem0c11 = document.createElement("div");
        ListItem0c11.setAttribute("class", "ms-ListItem-actions");
        ListItem0c11.innerHTML += "        ";
        var ListItem0c11c1 = document.createElement("div");
        ListItem0c11c1.setAttribute("class", "ms-ListItem-action");
        var ListItem0c11c1c0 = document.createElement("i");
        ListItem0c11c1c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        ListItem0c11c1.appendChild(ListItem0c11c1c0);
        ListItem0c11.appendChild(ListItem0c11c1);
        ListItem0c11.innerHTML += "    ";
        var ListItem0c11c3 = document.createElement("div");
        ListItem0c11c3.setAttribute("class", "ms-ListItem-action");
        var ListItem0c11c3c0 = document.createElement("i");
        ListItem0c11c3c0.setAttribute("class", "ms-Icon ms-Icon--trash");
        ListItem0c11c3.appendChild(ListItem0c11c3c0);
        ListItem0c11.appendChild(ListItem0c11c3);
        ListItem0c11.innerHTML += "    ";
        var ListItem0c11c5 = document.createElement("div");
        ListItem0c11c5.setAttribute("class", "ms-ListItem-action");
        var ListItem0c11c5c0 = document.createElement("i");
        ListItem0c11c5c0.setAttribute("class", "ms-Icon ms-Icon--flag");
        ListItem0c11c5.appendChild(ListItem0c11c5c0);
        ListItem0c11.appendChild(ListItem0c11c5);
        ListItem0c11.innerHTML += "    ";
        var ListItem0c11c7 = document.createElement("div");
        ListItem0c11c7.setAttribute("class", "ms-ListItem-action");
        var ListItem0c11c7c0 = document.createElement("i");
        ListItem0c11c7c0.setAttribute("class", "ms-Icon ms-Icon--pinLeft");
        ListItem0c11c7.appendChild(ListItem0c11c7c0);
        ListItem0c11.appendChild(ListItem0c11c7);
        ListItem0c11.innerHTML += "  ";
        ListItem0.appendChild(ListItem0c11);
        ListItem0.innerHTML += "";
        return ListItem0;
    };
    FabricTemplateLibrary.prototype.MessageBanner = function () {
        var MessageBanner0 = document.createElement("div");
        MessageBanner0.setAttribute("class", "ms-MessageBanner");
        MessageBanner0.innerHTML += "  ";
        var MessageBanner0c1 = document.createElement("div");
        MessageBanner0c1.setAttribute("class", "ms-MessageBanner-content");
        MessageBanner0c1.innerHTML += "    ";
        var MessageBanner0c1c1 = document.createElement("div");
        MessageBanner0c1c1.setAttribute("class", "ms-MessageBanner-text");
        MessageBanner0c1c1.innerHTML += "      ";
        var MessageBanner0c1c1c1 = document.createElement("div");
        MessageBanner0c1c1c1.setAttribute("class", "ms-MessageBanner-clipper");
        MessageBanner0c1c1c1.innerHTML += "        You&#x27;ve reached your total storage on OneDrive. Please upgrade your storage plan if you need more storage.      ";
        MessageBanner0c1c1.appendChild(MessageBanner0c1c1c1);
        MessageBanner0c1c1.innerHTML += "    ";
        MessageBanner0c1.appendChild(MessageBanner0c1c1);
        MessageBanner0c1.innerHTML += "    ";
        var MessageBanner0c1c3 = document.createElement("button");
        MessageBanner0c1c3.setAttribute("class", "ms-MessageBanner-expand");
        MessageBanner0c1c3.innerHTML += "      ";
        var MessageBanner0c1c3c1 = document.createElement("i");
        MessageBanner0c1c3c1.setAttribute("class", "ms-Icon ms-Icon--chevronsDown");
        MessageBanner0c1c3.appendChild(MessageBanner0c1c3c1);
        MessageBanner0c1c3.innerHTML += "    ";
        MessageBanner0c1.appendChild(MessageBanner0c1c3);
        MessageBanner0c1.innerHTML += "    ";
        var MessageBanner0c1c5 = document.createElement("div");
        MessageBanner0c1c5.setAttribute("class", "ms-MessageBanner-action");
        MessageBanner0c1c5.innerHTML += "      ";
        MessageBanner0c1c5.innerHTML += "";
        var MessageBanner0c1c5c3 = document.createElement("button");
        MessageBanner0c1c5c3.setAttribute("class", "ms-Button     ms-Button--primary      ");
        MessageBanner0c1c5c3.innerHTML += "  ";
        var MessageBanner0c1c5c3c1 = document.createElement("span");
        MessageBanner0c1c5c3c1.setAttribute("class", "ms-Button-label");
        MessageBanner0c1c5c3c1.innerHTML += "Get More Storage";
        MessageBanner0c1c5c3.appendChild(MessageBanner0c1c5c3c1);
        MessageBanner0c1c5c3.innerHTML += "";
        MessageBanner0c1c5.appendChild(MessageBanner0c1c5c3);
        MessageBanner0c1c5.innerHTML += "    ";
        MessageBanner0c1.appendChild(MessageBanner0c1c5);
        MessageBanner0c1.innerHTML += "  ";
        MessageBanner0.appendChild(MessageBanner0c1);
        MessageBanner0.innerHTML += "  ";
        var MessageBanner0c3 = document.createElement("button");
        MessageBanner0c3.setAttribute("class", "ms-MessageBanner-close");
        MessageBanner0c3.innerHTML += "    ";
        var MessageBanner0c3c1 = document.createElement("i");
        MessageBanner0c3c1.setAttribute("class", "ms-Icon ms-Icon--x");
        MessageBanner0c3.appendChild(MessageBanner0c3c1);
        MessageBanner0c3.innerHTML += "  ";
        MessageBanner0.appendChild(MessageBanner0c3);
        MessageBanner0.innerHTML += "";
        return MessageBanner0;
    };
    FabricTemplateLibrary.prototype.MessageBar = function () {
        var MessageBar0 = document.createElement("div");
        MessageBar0.setAttribute("class", "ms-MessageBar ");
        MessageBar0.innerHTML += "  ";
        var MessageBar0c1 = document.createElement("div");
        MessageBar0c1.setAttribute("class", "ms-MessageBar-content");
        MessageBar0c1.innerHTML += "    ";
        var MessageBar0c1c1 = document.createElement("div");
        MessageBar0c1c1.setAttribute("class", "ms-MessageBar-icon");
        MessageBar0c1c1.innerHTML += "      ";
        var MessageBar0c1c1c1 = document.createElement("i");
        MessageBar0c1c1c1.setAttribute("class", "ms-Icon ");
        MessageBar0c1c1.appendChild(MessageBar0c1c1c1);
        MessageBar0c1c1.innerHTML += "    ";
        MessageBar0c1.appendChild(MessageBar0c1c1);
        MessageBar0c1.innerHTML += "    ";
        var MessageBar0c1c3 = document.createElement("div");
        MessageBar0c1c3.setAttribute("class", "ms-MessageBar-text");
        MessageBar0c1c3.innerHTML += "      Lorem ipsum dolor sit amet, a elit sem interdum consectetur adipiscing elit.";
        var MessageBar0c1c3c1 = document.createElement("br");
        MessageBar0c1c3.appendChild(MessageBar0c1c3c1);
        MessageBar0c1c3.innerHTML += "      ";
        var MessageBar0c1c3c3 = document.createElement("a");
        MessageBar0c1c3c3.setAttribute("href", "");
        MessageBar0c1c3c3.setAttribute("class", "ms-Link");
        MessageBar0c1c3c3.innerHTML += "Hyperlink string";
        MessageBar0c1c3.appendChild(MessageBar0c1c3c3);
        MessageBar0c1c3.innerHTML += "    ";
        MessageBar0c1.appendChild(MessageBar0c1c3);
        MessageBar0c1.innerHTML += "  ";
        MessageBar0.appendChild(MessageBar0c1);
        MessageBar0.innerHTML += "";
        return MessageBar0;
    };
    FabricTemplateLibrary.prototype.OrgChart = function () {
        var OrgChart0 = document.createElement("div");
        OrgChart0.setAttribute("class", "ms-OrgChart ");
        OrgChart0.innerHTML += "";
        return OrgChart0;
    };
    FabricTemplateLibrary.prototype.Overlay = function () {
        var Overlay0 = document.createElement("div");
        Overlay0.setAttribute("class", "ms-Overlay ");
        return Overlay0;
    };
    FabricTemplateLibrary.prototype.Panel = function () {
        var Panel0 = document.createElement("div");
        Panel0.setAttribute("class", "ms-Panel ");
        Panel0.innerHTML += "    ";
        var Panel0c1 = document.createElement("button");
        Panel0c1.setAttribute("class", "ms-Panel-closeButton ms-PanelAction-close");
        Panel0c1.innerHTML += "        ";
        var Panel0c1c1 = document.createElement("i");
        Panel0c1c1.setAttribute("class", "ms-Panel-closeIcon ms-Icon ms-Icon--x");
        Panel0c1.appendChild(Panel0c1c1);
        Panel0c1.innerHTML += "    ";
        Panel0.appendChild(Panel0c1);
        Panel0.innerHTML += "    ";
        var Panel0c3 = document.createElement("div");
        Panel0c3.setAttribute("class", "ms-Panel-contentInner");
        Panel0c3.innerHTML += "        ";
        var Panel0c3c1 = document.createElement("p");
        Panel0c3c1.setAttribute("class", "ms-Panel-headerText");
        Panel0c3.appendChild(Panel0c3c1);
        Panel0c3.innerHTML += "        ";
        var Panel0c3c3 = document.createElement("div");
        Panel0c3c3.setAttribute("class", "ms-Panel-content");
        Panel0c3c3.innerHTML += "            ";
        var Panel0c3c3c1 = document.createElement("span");
        Panel0c3c3c1.setAttribute("class", "ms-font-m");
        Panel0c3c3.appendChild(Panel0c3c3c1);
        Panel0c3c3.innerHTML += "        ";
        Panel0c3.appendChild(Panel0c3c3);
        Panel0c3.innerHTML += "    ";
        Panel0.appendChild(Panel0c3);
        Panel0.innerHTML += "";
        return Panel0;
    };
    FabricTemplateLibrary.prototype.PanelHost = function () {
        var PanelHost0 = document.createElement("div");
        PanelHost0.setAttribute("class", "ms-PanelHost");
        PanelHost0.innerHTML += "  ";
        var PanelHost0c1 = document.createElement("div");
        PanelHost0c1.setAttribute("class", "ms-PanelHost-inner");
        PanelHost0c1.innerHTML += "  ";
        PanelHost0.appendChild(PanelHost0c1);
        PanelHost0.innerHTML += "  ";
        PanelHost0.innerHTML += "    ";
        var PanelHost0c5 = document.createElement("div");
        PanelHost0c5.setAttribute("class", "ms-Overlay ");
        PanelHost0.appendChild(PanelHost0c5);
        PanelHost0.innerHTML += "";
        return PanelHost0;
    };
    FabricTemplateLibrary.prototype.PeoplePicker = function () {
        var PeoplePicker0 = document.createElement("div");
        PeoplePicker0.setAttribute("class", "ms-PeoplePicker");
        PeoplePicker0.innerHTML += "  ";
        var PeoplePicker0c1 = document.createElement("div");
        PeoplePicker0c1.setAttribute("class", "ms-PeoplePicker-searchBox");
        PeoplePicker0c1.innerHTML += "    ";
        PeoplePicker0c1.innerHTML += "        ";
        var PeoplePicker0c1c3 = document.createElement("div");
        PeoplePicker0c1c3.setAttribute("class", "ms-TextField ");
        PeoplePicker0c1c3.innerHTML += "                            ";
        PeoplePicker0c1.appendChild(PeoplePicker0c1c3);
        PeoplePicker0c1.innerHTML += "  ";
        PeoplePicker0.appendChild(PeoplePicker0c1);
        PeoplePicker0.innerHTML += "  ";
        var PeoplePicker0c3 = document.createElement("div");
        PeoplePicker0c3.setAttribute("class", "ms-PeoplePicker-results");
        PeoplePicker0c3.innerHTML += "  ";
        PeoplePicker0.appendChild(PeoplePicker0c3);
        PeoplePicker0.innerHTML += "  ";
        var PeoplePicker0c5 = document.createElement("div");
        PeoplePicker0c5.setAttribute("class", "ms-PeoplePicker-searchMore");
        PeoplePicker0c5.innerHTML += "    ";
        var PeoplePicker0c5c1 = document.createElement("button");
        PeoplePicker0c5c1.setAttribute("class", "ms-PeoplePicker-searchMoreBtn");
        PeoplePicker0c5c1.innerHTML += "      ";
        var PeoplePicker0c5c1c1 = document.createElement("div");
        PeoplePicker0c5c1c1.setAttribute("class", "ms-PeoplePicker-searchMoreIcon");
        PeoplePicker0c5c1c1.innerHTML += "        ";
        var PeoplePicker0c5c1c1c1 = document.createElement("i");
        PeoplePicker0c5c1c1c1.setAttribute("class", "ms-Icon ms-Icon--search");
        PeoplePicker0c5c1c1.appendChild(PeoplePicker0c5c1c1c1);
        PeoplePicker0c5c1c1.innerHTML += "      ";
        PeoplePicker0c5c1.appendChild(PeoplePicker0c5c1c1);
        PeoplePicker0c5c1.innerHTML += "      ";
        var PeoplePicker0c5c1c3 = document.createElement("div");
        PeoplePicker0c5c1c3.setAttribute("class", "ms-PeoplePicker-searchMoreSecondary");
        PeoplePicker0c5c1c3.innerHTML += "Showing top 5 results";
        PeoplePicker0c5c1.appendChild(PeoplePicker0c5c1c3);
        PeoplePicker0c5c1.innerHTML += "      ";
        var PeoplePicker0c5c1c5 = document.createElement("div");
        PeoplePicker0c5c1c5.setAttribute("class", "ms-PeoplePicker-searchMorePrimary");
        PeoplePicker0c5c1c5.innerHTML += "Search Contacts &amp; Directory";
        PeoplePicker0c5c1.appendChild(PeoplePicker0c5c1c5);
        PeoplePicker0c5c1.innerHTML += "    ";
        PeoplePicker0c5.appendChild(PeoplePicker0c5c1);
        PeoplePicker0c5.innerHTML += "  ";
        PeoplePicker0.appendChild(PeoplePicker0c5);
        PeoplePicker0.innerHTML += "";
        return PeoplePicker0;
    };
    FabricTemplateLibrary.prototype.Persona = function () {
        var Persona0 = document.createElement("div");
        Persona0.setAttribute("class", "ms-Persona");
        Persona0.innerHTML += "  ";
        var Persona0c1 = document.createElement("div");
        Persona0c1.setAttribute("class", "ms-Persona-imageArea");
        Persona0c1.innerHTML += "  ";
        Persona0.appendChild(Persona0c1);
        Persona0.innerHTML += "  ";
        var Persona0c3 = document.createElement("div");
        Persona0c3.setAttribute("class", "ms-Persona-presence");
        Persona0c3.innerHTML += "  ";
        Persona0.appendChild(Persona0c3);
        Persona0.innerHTML += "  ";
        var Persona0c5 = document.createElement("div");
        Persona0c5.setAttribute("class", "ms-Persona-details");
        Persona0c5.innerHTML += "  ";
        Persona0.appendChild(Persona0c5);
        Persona0.innerHTML += "";
        return Persona0;
    };
    FabricTemplateLibrary.prototype.PersonaCard = function () {
        var PersonaCard0 = document.createElement("div");
        PersonaCard0.setAttribute("class", "ms-PersonaCard ");
        PersonaCard0.innerHTML += "  ";
        var PersonaCard0c1 = document.createElement("div");
        PersonaCard0c1.setAttribute("class", "ms-PersonaCard-persona");
        PersonaCard0c1.innerHTML += "    ";
        PersonaCard0c1.innerHTML += "        ";
        var PersonaCard0c1c3 = document.createElement("div");
        PersonaCard0c1c3.setAttribute("class", "ms-Persona    ");
        PersonaCard0c1c3.innerHTML += "      ";
        var PersonaCard0c1c3c1 = document.createElement("div");
        PersonaCard0c1c3c1.setAttribute("class", "ms-Persona-imageArea");
        PersonaCard0c1c3c1.innerHTML += "      ";
        PersonaCard0c1c3.appendChild(PersonaCard0c1c3c1);
        PersonaCard0c1c3.innerHTML += "      ";
        var PersonaCard0c1c3c3 = document.createElement("div");
        PersonaCard0c1c3c3.setAttribute("class", "ms-Persona-presence");
        PersonaCard0c1c3c3.innerHTML += "      ";
        PersonaCard0c1c3.appendChild(PersonaCard0c1c3c3);
        PersonaCard0c1c3.innerHTML += "      ";
        var PersonaCard0c1c3c5 = document.createElement("div");
        PersonaCard0c1c3c5.setAttribute("class", "ms-Persona-details");
        PersonaCard0c1c3c5.innerHTML += "      ";
        PersonaCard0c1c3.appendChild(PersonaCard0c1c3c5);
        PersonaCard0c1c3.innerHTML += "    ";
        PersonaCard0c1.appendChild(PersonaCard0c1c3);
        PersonaCard0c1.innerHTML += "  ";
        PersonaCard0.appendChild(PersonaCard0c1);
        PersonaCard0.innerHTML += "  ";
        var PersonaCard0c3 = document.createElement("ul");
        PersonaCard0c3.setAttribute("class", "ms-PersonaCard-actions");
        PersonaCard0c3.innerHTML += "    ";
        var PersonaCard0c3c1 = document.createElement("li");
        PersonaCard0c3c1.setAttribute("data-action-id", "chat");
        PersonaCard0c3c1.setAttribute("class", "ms-PersonaCard-action");
        PersonaCard0c3c1.setAttribute("tabindex", "1");
        var PersonaCard0c3c1c0 = document.createElement("i");
        PersonaCard0c3c1c0.setAttribute("class", "ms-Icon ms-Icon--chat");
        PersonaCard0c3c1.appendChild(PersonaCard0c3c1c0);
        PersonaCard0c3.appendChild(PersonaCard0c3c1);
        PersonaCard0c3.innerHTML += "    ";
        var PersonaCard0c3c3 = document.createElement("li");
        PersonaCard0c3c3.setAttribute("data-action-id", "phone");
        PersonaCard0c3c3.setAttribute("class", "ms-PersonaCard-action is-active");
        PersonaCard0c3c3.setAttribute("tabindex", "2");
        var PersonaCard0c3c3c0 = document.createElement("i");
        PersonaCard0c3c3c0.setAttribute("class", "ms-Icon ms-Icon--phone");
        PersonaCard0c3c3.appendChild(PersonaCard0c3c3c0);
        PersonaCard0c3.appendChild(PersonaCard0c3c3);
        PersonaCard0c3.innerHTML += "    ";
        var PersonaCard0c3c5 = document.createElement("li");
        PersonaCard0c3c5.setAttribute("data-action-id", "video");
        PersonaCard0c3c5.setAttribute("class", "ms-PersonaCard-action");
        PersonaCard0c3c5.setAttribute("tabindex", "3");
        var PersonaCard0c3c5c0 = document.createElement("i");
        PersonaCard0c3c5c0.setAttribute("class", "ms-Icon ms-Icon--video");
        PersonaCard0c3c5.appendChild(PersonaCard0c3c5c0);
        PersonaCard0c3.appendChild(PersonaCard0c3c5);
        PersonaCard0c3.innerHTML += "    ";
        var PersonaCard0c3c7 = document.createElement("li");
        PersonaCard0c3c7.setAttribute("data-action-id", "mail");
        PersonaCard0c3c7.setAttribute("class", "ms-PersonaCard-action");
        PersonaCard0c3c7.setAttribute("tabindex", "4");
        var PersonaCard0c3c7c0 = document.createElement("i");
        PersonaCard0c3c7c0.setAttribute("class", "ms-Icon ms-Icon--mail");
        PersonaCard0c3c7.appendChild(PersonaCard0c3c7c0);
        PersonaCard0c3.appendChild(PersonaCard0c3c7);
        PersonaCard0c3.innerHTML += "    ";
        var PersonaCard0c3c9 = document.createElement("li");
        PersonaCard0c3c9.setAttribute("class", "ms-PersonaCard-overflow");
        PersonaCard0c3c9.setAttribute("alt", "View profile in Delve");
        PersonaCard0c3c9.setAttribute("title", "View profile in Delve");
        PersonaCard0c3c9.innerHTML += "View profile";
        PersonaCard0c3.appendChild(PersonaCard0c3c9);
        PersonaCard0c3.innerHTML += "    ";
        var PersonaCard0c3c11 = document.createElement("li");
        PersonaCard0c3c11.setAttribute("data-action-id", "org");
        PersonaCard0c3c11.setAttribute("class", "ms-PersonaCard-action ms-PersonaCard-orgChart");
        PersonaCard0c3c11.setAttribute("tabindex", "5");
        var PersonaCard0c3c11c0 = document.createElement("i");
        PersonaCard0c3c11c0.setAttribute("class", "ms-Icon ms-Icon--org");
        PersonaCard0c3c11.appendChild(PersonaCard0c3c11c0);
        PersonaCard0c3.appendChild(PersonaCard0c3c11);
        PersonaCard0c3.innerHTML += "  ";
        PersonaCard0.appendChild(PersonaCard0c3);
        PersonaCard0.innerHTML += "  ";
        var PersonaCard0c5 = document.createElement("div");
        PersonaCard0c5.setAttribute("class", "ms-PersonaCard-actionDetailBox");
        PersonaCard0c5.innerHTML += "    ";
        var PersonaCard0c5c1 = document.createElement("div");
        PersonaCard0c5c1.setAttribute("data-detail-id", "mail");
        PersonaCard0c5c1.setAttribute("class", "ms-PersonaCard-details");
        PersonaCard0c5c1.innerHTML += "      ";
        var PersonaCard0c5c1c1 = document.createElement("div");
        PersonaCard0c5c1c1.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c1c1c0 = document.createElement("span");
        PersonaCard0c5c1c1c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c1c1c0.innerHTML += "Personal:";
        PersonaCard0c5c1c1.appendChild(PersonaCard0c5c1c1c0);
        PersonaCard0c5c1c1.innerHTML += " ";
        var PersonaCard0c5c1c1c2 = document.createElement("a");
        PersonaCard0c5c1c1c2.setAttribute("class", "ms-Link");
        PersonaCard0c5c1c1c2.setAttribute("href", "mailto:alton.lafferty@outlook.com");
        PersonaCard0c5c1c1c2.innerHTML += "alton.lafferty@outlook.com";
        PersonaCard0c5c1c1.appendChild(PersonaCard0c5c1c1c2);
        PersonaCard0c5c1.appendChild(PersonaCard0c5c1c1);
        PersonaCard0c5c1.innerHTML += "      ";
        var PersonaCard0c5c1c3 = document.createElement("div");
        PersonaCard0c5c1c3.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c1c3c0 = document.createElement("span");
        PersonaCard0c5c1c3c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c1c3c0.innerHTML += "Work:";
        PersonaCard0c5c1c3.appendChild(PersonaCard0c5c1c3c0);
        PersonaCard0c5c1c3.innerHTML += " ";
        var PersonaCard0c5c1c3c2 = document.createElement("a");
        PersonaCard0c5c1c3c2.setAttribute("class", "ms-Link");
        PersonaCard0c5c1c3c2.setAttribute("href", "mailto:alton.lafferty@outlook.com");
        PersonaCard0c5c1c3c2.innerHTML += "altonlafferty@contoso.com";
        PersonaCard0c5c1c3.appendChild(PersonaCard0c5c1c3c2);
        PersonaCard0c5c1.appendChild(PersonaCard0c5c1c3);
        PersonaCard0c5c1.innerHTML += "    ";
        PersonaCard0c5.appendChild(PersonaCard0c5c1);
        PersonaCard0c5.innerHTML += "    ";
        var PersonaCard0c5c3 = document.createElement("div");
        PersonaCard0c5c3.setAttribute("data-detail-id", "chat");
        PersonaCard0c5c3.setAttribute("class", "ms-PersonaCard-details");
        PersonaCard0c5c3.innerHTML += "      ";
        var PersonaCard0c5c3c1 = document.createElement("div");
        PersonaCard0c5c3c1.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c3c1c0 = document.createElement("span");
        PersonaCard0c5c3c1c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c3c1c0.innerHTML += "Lync:";
        PersonaCard0c5c3c1.appendChild(PersonaCard0c5c3c1c0);
        PersonaCard0c5c3c1.innerHTML += " ";
        var PersonaCard0c5c3c1c2 = document.createElement("a");
        PersonaCard0c5c3c1c2.setAttribute("class", "ms-Link");
        PersonaCard0c5c3c1c2.setAttribute("href", "#");
        PersonaCard0c5c3c1c2.innerHTML += "Start Lync call";
        PersonaCard0c5c3c1.appendChild(PersonaCard0c5c3c1c2);
        PersonaCard0c5c3.appendChild(PersonaCard0c5c3c1);
        PersonaCard0c5c3.innerHTML += "    ";
        PersonaCard0c5.appendChild(PersonaCard0c5c3);
        PersonaCard0c5.innerHTML += "    ";
        var PersonaCard0c5c5 = document.createElement("div");
        PersonaCard0c5c5.setAttribute("data-detail-id", "phone");
        PersonaCard0c5c5.setAttribute("class", "ms-PersonaCard-details");
        PersonaCard0c5c5.innerHTML += "      ";
        var PersonaCard0c5c5c1 = document.createElement("div");
        PersonaCard0c5c5c1.setAttribute("class", "ms-PersonaCard-detailExpander");
        PersonaCard0c5c5.appendChild(PersonaCard0c5c5c1);
        PersonaCard0c5c5.innerHTML += "      ";
        var PersonaCard0c5c5c3 = document.createElement("div");
        PersonaCard0c5c5c3.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c5c3c0 = document.createElement("span");
        PersonaCard0c5c5c3c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c5c3c0.innerHTML += "Details";
        PersonaCard0c5c5c3.appendChild(PersonaCard0c5c5c3c0);
        PersonaCard0c5c5.appendChild(PersonaCard0c5c5c3);
        PersonaCard0c5c5.innerHTML += "      ";
        var PersonaCard0c5c5c5 = document.createElement("div");
        PersonaCard0c5c5c5.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c5c5c0 = document.createElement("span");
        PersonaCard0c5c5c5c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c5c5c0.innerHTML += "Personal:";
        PersonaCard0c5c5c5.appendChild(PersonaCard0c5c5c5c0);
        PersonaCard0c5c5c5.innerHTML += " 555.206.2443";
        PersonaCard0c5c5.appendChild(PersonaCard0c5c5c5);
        PersonaCard0c5c5.innerHTML += "      ";
        var PersonaCard0c5c5c7 = document.createElement("div");
        PersonaCard0c5c5c7.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c5c7c0 = document.createElement("span");
        PersonaCard0c5c5c7c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c5c7c0.innerHTML += "Work:";
        PersonaCard0c5c5c7.appendChild(PersonaCard0c5c5c7c0);
        PersonaCard0c5c5c7.innerHTML += " 555.929.8240";
        PersonaCard0c5c5.appendChild(PersonaCard0c5c5c7);
        PersonaCard0c5c5.innerHTML += "    ";
        PersonaCard0c5.appendChild(PersonaCard0c5c5);
        PersonaCard0c5.innerHTML += "    ";
        var PersonaCard0c5c7 = document.createElement("div");
        PersonaCard0c5c7.setAttribute("data-detail-id", "video");
        PersonaCard0c5c7.setAttribute("class", "ms-PersonaCard-details");
        PersonaCard0c5c7.innerHTML += "      ";
        var PersonaCard0c5c7c1 = document.createElement("div");
        PersonaCard0c5c7c1.setAttribute("class", "ms-PersonaCard-detailLine");
        var PersonaCard0c5c7c1c0 = document.createElement("span");
        PersonaCard0c5c7c1c0.setAttribute("class", "ms-PersonaCard-detailLabel");
        PersonaCard0c5c7c1c0.innerHTML += "Skype:";
        PersonaCard0c5c7c1.appendChild(PersonaCard0c5c7c1c0);
        PersonaCard0c5c7c1.innerHTML += " ";
        var PersonaCard0c5c7c1c2 = document.createElement("a");
        PersonaCard0c5c7c1c2.setAttribute("class", "ms-Link");
        PersonaCard0c5c7c1c2.setAttribute("href", "#");
        PersonaCard0c5c7c1c2.innerHTML += "Start Skype call";
        PersonaCard0c5c7c1.appendChild(PersonaCard0c5c7c1c2);
        PersonaCard0c5c7.appendChild(PersonaCard0c5c7c1);
        PersonaCard0c5c7.innerHTML += "    ";
        PersonaCard0c5.appendChild(PersonaCard0c5c7);
        PersonaCard0c5.innerHTML += "      ";
        PersonaCard0c5.innerHTML += "    ";
        var PersonaCard0c5c11 = document.createElement("div");
        PersonaCard0c5c11.setAttribute("data-detail-id", "org");
        PersonaCard0c5c11.setAttribute("class", "ms-PersonaCard-details");
        PersonaCard0c5c11.innerHTML += "      ";
        PersonaCard0c5c11.innerHTML += "            ";
        var PersonaCard0c5c11c3 = document.createElement("div");
        PersonaCard0c5c11c3.setAttribute("class", "ms-OrgChart ");
        PersonaCard0c5c11c3.innerHTML += "      ";
        PersonaCard0c5c11.appendChild(PersonaCard0c5c11c3);
        PersonaCard0c5c11.innerHTML += "    ";
        PersonaCard0c5.appendChild(PersonaCard0c5c11);
        PersonaCard0c5.innerHTML += "  ";
        PersonaCard0.appendChild(PersonaCard0c5);
        PersonaCard0.innerHTML += "";
        return PersonaCard0;
    };
    FabricTemplateLibrary.prototype.Pivot = function () {
        var Pivot0 = document.createElement("div");
        Pivot0.setAttribute("class", "ms-Pivot ");
        Pivot0.innerHTML += "  ";
        var Pivot0c1 = document.createElement("ul");
        Pivot0c1.setAttribute("class", "ms-Pivot-links");
        Pivot0c1.innerHTML += "  ";
        Pivot0.appendChild(Pivot0c1);
        Pivot0.innerHTML += "";
        return Pivot0;
    };
    FabricTemplateLibrary.prototype.ProgressIndicator = function () {
        var ProgressIndicator0 = document.createElement("div");
        ProgressIndicator0.setAttribute("class", "ms-ProgressIndicator");
        ProgressIndicator0.innerHTML += "  ";
        var ProgressIndicator0c1 = document.createElement("div");
        ProgressIndicator0c1.setAttribute("class", "ms-ProgressIndicator-itemName");
        ProgressIndicator0.appendChild(ProgressIndicator0c1);
        ProgressIndicator0.innerHTML += "  ";
        var ProgressIndicator0c3 = document.createElement("div");
        ProgressIndicator0c3.setAttribute("class", "ms-ProgressIndicator-itemProgress");
        ProgressIndicator0c3.innerHTML += "    ";
        var ProgressIndicator0c3c1 = document.createElement("div");
        ProgressIndicator0c3c1.setAttribute("class", "ms-ProgressIndicator-progressTrack");
        ProgressIndicator0c3.appendChild(ProgressIndicator0c3c1);
        ProgressIndicator0c3.innerHTML += "    ";
        var ProgressIndicator0c3c3 = document.createElement("div");
        ProgressIndicator0c3c3.setAttribute("class", "ms-ProgressIndicator-progressBar");
        ProgressIndicator0c3.appendChild(ProgressIndicator0c3c3);
        ProgressIndicator0c3.innerHTML += "  ";
        ProgressIndicator0.appendChild(ProgressIndicator0c3);
        ProgressIndicator0.innerHTML += "  ";
        var ProgressIndicator0c5 = document.createElement("div");
        ProgressIndicator0c5.setAttribute("class", "ms-ProgressIndicator-itemDescription");
        ProgressIndicator0.appendChild(ProgressIndicator0c5);
        ProgressIndicator0.innerHTML += "";
        return ProgressIndicator0;
    };
    FabricTemplateLibrary.prototype.RadioButton = function () {
        var RadioButton0 = document.createElement("div");
        RadioButton0.setAttribute("class", "ms-RadioButton");
        RadioButton0.innerHTML += "   ";
        var RadioButton0c1 = document.createElement("li");
        RadioButton0c1.setAttribute("role", "");
        RadioButton0c1.setAttribute("class", "ms-Choice-field ");
        RadioButton0c1.setAttribute("tabindex", "0");
        RadioButton0c1.setAttribute("aria-checked", "");
        RadioButton0c1.setAttribute("name", "");
        RadioButton0c1.innerHTML += "      ";
        var RadioButton0c1c1 = document.createElement("span");
        RadioButton0c1c1.setAttribute("class", "ms-Label");
        RadioButton0c1.appendChild(RadioButton0c1c1);
        RadioButton0c1.innerHTML += "  ";
        RadioButton0.appendChild(RadioButton0c1);
        RadioButton0.innerHTML += "";
        return RadioButton0;
    };
    FabricTemplateLibrary.prototype.SearchBox = function () {
        var SearchBox0 = document.createElement("div");
        SearchBox0.setAttribute("class", "ms-SearchBox  ");
        SearchBox0.innerHTML += "  ";
        var SearchBox0c1 = document.createElement("input");
        SearchBox0c1.setAttribute("class", "ms-SearchBox-field");
        SearchBox0c1.setAttribute("type", "text");
        SearchBox0c1.setAttribute("value", "");
        SearchBox0.appendChild(SearchBox0c1);
        SearchBox0.innerHTML += "  ";
        var SearchBox0c3 = document.createElement("label");
        SearchBox0c3.setAttribute("class", "ms-SearchBox-label");
        SearchBox0c3.innerHTML += "    ";
        var SearchBox0c3c1 = document.createElement("i");
        SearchBox0c3c1.setAttribute("class", "ms-SearchBox-icon ms-Icon ms-Icon--search");
        SearchBox0c3.appendChild(SearchBox0c3c1);
        SearchBox0c3.innerHTML += "    ";
        var SearchBox0c3c3 = document.createElement("span");
        SearchBox0c3c3.setAttribute("class", "ms-SearchBox-text");
        SearchBox0c3c3.innerHTML += "Search";
        SearchBox0c3.appendChild(SearchBox0c3c3);
        SearchBox0c3.innerHTML += "  ";
        SearchBox0.appendChild(SearchBox0c3);
        SearchBox0.innerHTML += "  ";
        SearchBox0.innerHTML += "";
        var SearchBox0c7 = document.createElement("div");
        SearchBox0c7.setAttribute("class", "ms-CommandButton ms-SearchBox-close ms-CommandButton--noLabel  ");
        SearchBox0c7.innerHTML += "  ";
        var SearchBox0c7c1 = document.createElement("button");
        SearchBox0c7c1.setAttribute("class", "ms-CommandButton-button");
        SearchBox0c7c1.innerHTML += "      ";
        var SearchBox0c7c1c1 = document.createElement("span");
        SearchBox0c7c1c1.setAttribute("class", "ms-CommandButton-icon ");
        var SearchBox0c7c1c1c0 = document.createElement("i");
        SearchBox0c7c1c1c0.setAttribute("class", "ms-Icon ms-Icon--x");
        SearchBox0c7c1c1.appendChild(SearchBox0c7c1c1c0);
        SearchBox0c7c1.appendChild(SearchBox0c7c1c1);
        var SearchBox0c7c1c2 = document.createElement("span");
        SearchBox0c7c1c2.setAttribute("class", "ms-CommandButton-label");
        SearchBox0c7c1.appendChild(SearchBox0c7c1c2);
        SearchBox0c7c1.innerHTML += "  ";
        SearchBox0c7.appendChild(SearchBox0c7c1);
        SearchBox0c7.innerHTML += "";
        SearchBox0.appendChild(SearchBox0c7);
        SearchBox0.innerHTML += "";
        return SearchBox0;
    };
    FabricTemplateLibrary.prototype.Spinner = function () {
        var Spinner0 = document.createElement("div");
        Spinner0.setAttribute("class", "ms-Spinner ");
        Spinner0.innerHTML += "";
        return Spinner0;
    };
    FabricTemplateLibrary.prototype.Table = function () {
        var Table0 = document.createElement("table");
        Table0.setAttribute("class", "ms-Table ");
        Table0.innerHTML += "  ";
        var Table0c1 = document.createElement("thead");
        Table0c1.innerHTML += "    ";
        var Table0c1c1 = document.createElement("tr");
        Table0c1c1.innerHTML += "    ";
        Table0c1.appendChild(Table0c1c1);
        Table0c1.innerHTML += "  ";
        Table0.appendChild(Table0c1);
        Table0.innerHTML += "  ";
        var Table0c3 = document.createElement("tbody");
        Table0c3.innerHTML += "  ";
        Table0.appendChild(Table0c3);
        Table0.innerHTML += "";
        return Table0;
    };
    FabricTemplateLibrary.prototype.TextField = function () {
        var TextField0 = document.createElement("div");
        TextField0.setAttribute("class", "ms-TextField ");
        TextField0.innerHTML += "        ";
        return TextField0;
    };
    FabricTemplateLibrary.prototype.Toggle = function () {
        var Toggle0 = document.createElement("div");
        Toggle0.setAttribute("class", "ms-Toggle  ");
        Toggle0.innerHTML += "  ";
        var Toggle0c1 = document.createElement("span");
        Toggle0c1.setAttribute("class", "ms-Toggle-description");
        Toggle0c1.innerHTML += "Let apps use my location";
        Toggle0.appendChild(Toggle0c1);
        Toggle0.innerHTML += "  ";
        var Toggle0c3 = document.createElement("input");
        Toggle0c3.setAttribute("type", "checkbox");
        Toggle0c3.setAttribute("id", "demo-toggle-3");
        Toggle0c3.setAttribute("class", "ms-Toggle-input");
        Toggle0.appendChild(Toggle0c3);
        Toggle0.innerHTML += "  ";
        var Toggle0c5 = document.createElement("label");
        Toggle0c5.setAttribute("for", "demo-toggle-3");
        Toggle0c5.setAttribute("class", "ms-Toggle-field");
        Toggle0c5.setAttribute("tabindex", "0");
        Toggle0c5.innerHTML += "    ";
        var Toggle0c5c1 = document.createElement("span");
        Toggle0c5c1.setAttribute("class", "ms-Label ms-Label--off");
        Toggle0c5c1.innerHTML += "Off";
        Toggle0c5.appendChild(Toggle0c5c1);
        Toggle0c5.innerHTML += "    ";
        var Toggle0c5c3 = document.createElement("span");
        Toggle0c5c3.setAttribute("class", "ms-Label ms-Label--on");
        Toggle0c5c3.innerHTML += "On";
        Toggle0c5.appendChild(Toggle0c5c3);
        Toggle0c5.innerHTML += "  ";
        Toggle0.appendChild(Toggle0c5);
        Toggle0.innerHTML += "";
        return Toggle0;
    };
    return FabricTemplateLibrary;
}());

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../../../dist/js/fabric.templates.ts"/>
/**
 * ContextualHost
 *
 * Hosts contextual menus and callouts
 * NOTE: Position bottom only works if html is set to max-height 100%, overflow hidden
 * and body is set to overflow scroll, body is set to height 100%
 *
 */
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    /**
     *
     * @constructor
     */
    var CONTEXT_STATE_CLASS = "is-open";
    var MODAL_STATE_POSITIONED = "is-positioned";
    var CONTEXT_HOST_MAIN_CLASS = ".ms-ContextualHost-main";
    var CONTEXT_HOST_BEAK_CLASS = ".ms-ContextualHost-beak";
    var ARROW_LEFT_CLASS = "ms-ContextualHost--arrowLeft";
    var ARROW_TOP_CLASS = "ms-ContextualHost--arrowTop";
    var ARROW_BOTTOM_CLASS = "ms-ContextualHost--arrowBottom";
    var ARROW_RIGHT_CLASS = "ms-ContextualHost--arrowRight";
    var MODIFIER_BASE = "ms-ContextualHost--";
    var ARROW_SIZE = 28;
    var ARROW_OFFSET = 8;
    var ContextualHost = (function () {
        function ContextualHost(content, direction, targetElement, hasArrow, modifiers, matchTargetWidth) {
            if (hasArrow === void 0) { hasArrow = true; }
            this._ftl = new FabricTemplateLibrary();
            this._resizeAction = this._resizeAction.bind(this);
            this._disMissAction = this._disMissAction.bind(this);
            this._matchTargetWidth = matchTargetWidth || false;
            this._direction = direction;
            this._container = this._ftl.ContextualHost();
            this._contextualHost = this._container;
            this._contextualHostMain = this._contextualHost.querySelector(CONTEXT_HOST_MAIN_CLASS);
            this._contextualHostMain.appendChild(content);
            this._hasArrow = hasArrow;
            this._arrow = this._container.querySelector(CONTEXT_HOST_BEAK_CLASS);
            this._targetElement = targetElement;
            this._openModal();
            this._setResizeDisposal();
            if (modifiers) {
                for (var i = 0; i < modifiers.length; i++) {
                    this._container.classList.add(MODIFIER_BASE + modifiers[i]);
                }
            }
        }
        ContextualHost.prototype.disposeModal = function () {
            window.removeEventListener("resize", this._resizeAction, false);
            document.removeEventListener("click", this._disMissAction, true);
            this._container.parentNode.removeChild(this._container);
        };
        ContextualHost.prototype.setChildren = function (value) {
            if (!this._children) {
                this._children = [];
            }
            this._children.push(value);
        };
        ContextualHost.prototype.contains = function (value) {
            return this._container.contains(value);
        };
        ContextualHost.prototype._openModal = function () {
            var _this = this;
            this._copyModalToBody();
            this._saveModalSize();
            this._findAvailablePosition();
            this._showModal();
            // Delay the click setting
            setTimeout(function () { _this._setDismissClick(); }, 100);
        };
        ContextualHost.prototype._findAvailablePosition = function () {
            var _posOk;
            switch (this._direction) {
                case "left":
                    // Try the right side
                    _posOk = this._positionOk(this._tryPosModalLeft.bind(this), this._tryPosModalRight.bind(this), this._tryPosModalBottom.bind(this), this._tryPosModalTop.bind(this));
                    this._setPosition(_posOk);
                    break;
                case "right":
                    _posOk = this._positionOk(this._tryPosModalRight.bind(this), this._tryPosModalLeft.bind(this), this._tryPosModalBottom.bind(this), this._tryPosModalTop.bind(this));
                    this._setPosition(_posOk);
                    break;
                case "top":
                    _posOk = this._positionOk(this._tryPosModalTop.bind(this), this._tryPosModalBottom.bind(this));
                    this._setPosition(_posOk);
                    break;
                case "bottom":
                    _posOk = this._positionOk(this._tryPosModalBottom.bind(this), this._tryPosModalTop.bind(this));
                    this._setPosition(_posOk);
                    break;
                default:
                    this._setPosition();
            }
        };
        ContextualHost.prototype._showModal = function () {
            this._container.classList.add(CONTEXT_STATE_CLASS);
        };
        ContextualHost.prototype._positionOk = function (pos1, pos2, pos3, pos4) {
            var _posOk;
            _posOk = pos1();
            if (!_posOk) {
                _posOk = pos2();
                if (!_posOk && pos3) {
                    _posOk = pos3();
                    if (!_posOk && pos4) {
                        _posOk = pos4();
                    }
                }
            }
            return _posOk;
        };
        ContextualHost.prototype._calcLeft = function (mWidth, teWidth, teLeft) {
            var mHalfWidth = mWidth / 2;
            var teHalf = teWidth / 2;
            var mHLeft = (teLeft + teHalf) - mHalfWidth;
            mHLeft = (mHLeft < mHalfWidth) ? teLeft : mHLeft;
            return mHLeft;
        };
        ContextualHost.prototype._calcTop = function (mHeight, teHeight, teTop) {
            var mHalfWidth = mHeight / 2;
            var teHalf = teHeight / 2;
            var mHLeft = (teTop + teHalf) - mHalfWidth;
            mHLeft = (mHLeft < mHalfWidth) ? teTop : mHLeft;
            return mHLeft;
        };
        ContextualHost.prototype._setPosition = function (curDirection) {
            var teBR = this._targetElement.getBoundingClientRect();
            var teLeft = teBR.left;
            var teRight = teBR.right;
            var teTop = teBR.top;
            var teHeight = teBR.height;
            var mHLeft;
            var mHTop;
            var mWidth = "";
            var arrowTop;
            var windowY = window.scrollY ? window.scrollY : 0;
            var arrowSpace = (this._hasArrow) ? ARROW_SIZE : 0;
            if (this._matchTargetWidth) {
                mWidth = "width: " + this._modalWidth + "px;";
            }
            switch (curDirection) {
                case "left":
                    mHLeft = (teLeft - this._modalWidth) + arrowSpace;
                    mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
                    mHTop += window.scrollY ? window.scrollY : 0;
                    this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                    this._container.classList.add(MODAL_STATE_POSITIONED);
                    if (this._hasArrow) {
                        this._container.classList.add(ARROW_RIGHT_CLASS);
                        arrowTop = ((teTop + windowY) - mHTop) + ARROW_OFFSET;
                        this._arrow.setAttribute("style", "top: " + arrowTop + "px;");
                    }
                    break;
                case "right":
                    mHTop = this._calcTop(this._modalHeight, teHeight, teTop);
                    mHTop += windowY;
                    mHLeft = teRight + arrowSpace;
                    this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                    this._container.classList.add(MODAL_STATE_POSITIONED);
                    if (this._hasArrow) {
                        arrowTop = ((windowY + teTop) - mHTop) + ARROW_OFFSET;
                        this._arrow.setAttribute("style", "top: " + arrowTop + "px;");
                        this._container.classList.add(ARROW_LEFT_CLASS);
                    }
                    break;
                case "top":
                    mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
                    mHTop = (teTop - this._modalHeight) + arrowSpace;
                    mHTop += windowY;
                    this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                    this._container.classList.add(MODAL_STATE_POSITIONED);
                    if (this._hasArrow) {
                        this._container.classList.add(ARROW_BOTTOM_CLASS);
                    }
                    break;
                case "bottom":
                    mHLeft = mHLeft = this._calcLeft(this._modalWidth, this._teWidth, teLeft);
                    mHTop = teTop + teHeight + arrowSpace;
                    mHTop += window.scrollY ? window.scrollY : 0;
                    this._container.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;" + mWidth);
                    this._container.classList.add(MODAL_STATE_POSITIONED);
                    if (this._hasArrow) {
                        this._container.classList.add(ARROW_TOP_CLASS);
                    }
                    break;
                default:
                    this._container.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
            }
        };
        ContextualHost.prototype._tryPosModalLeft = function () {
            var teLeft = this._targetElement.getBoundingClientRect().left;
            if (teLeft < this._modalWidth) {
                return false;
            }
            else {
                return "left";
            }
        };
        ContextualHost.prototype._tryPosModalRight = function () {
            var teRight = this._targetElement.getBoundingClientRect().right;
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if ((w - teRight) < this._modalWidth) {
                return false;
            }
            else {
                return "right";
            }
        };
        ContextualHost.prototype._tryPosModalBottom = function () {
            var teBottom = window.innerHeight - this._targetElement.getBoundingClientRect().bottom;
            if (teBottom < this._modalHeight) {
                return false;
            }
            else {
                return "bottom";
            }
        };
        ContextualHost.prototype._tryPosModalTop = function () {
            var teTop = this._targetElement.getBoundingClientRect().top;
            if (teTop < this._modalHeight) {
                return false;
            }
            else {
                return "top";
            }
        };
        ContextualHost.prototype._copyModalToBody = function () {
            document.body.appendChild(this._container);
        };
        ContextualHost.prototype._saveModalSize = function () {
            var _modalStyles = window.getComputedStyle(this._container);
            this._container.setAttribute("style", "opacity: 0; z-index: -1");
            this._container.classList.add(MODAL_STATE_POSITIONED);
            this._container.classList.add(CONTEXT_STATE_CLASS);
            if (this._matchTargetWidth) {
                var teStyles = window.getComputedStyle(this._targetElement);
                this._modalWidth = this._targetElement.getBoundingClientRect().width
                    + (parseInt(teStyles.marginLeft, 10)
                        + parseInt(teStyles.marginLeft, 10));
            }
            else {
                this._modalWidth = this._container.getBoundingClientRect().width
                    + (parseInt(_modalStyles.marginLeft, 10)
                        + parseInt(_modalStyles.marginRight, 10));
                this._container.setAttribute("style", "");
            }
            this._modalHeight = this._container.getBoundingClientRect().height
                + (parseInt(_modalStyles.marginTop, 10)
                    + parseInt(_modalStyles.marginBottom, 10));
            this._container.classList.remove(MODAL_STATE_POSITIONED);
            this._container.classList.remove(CONTEXT_STATE_CLASS);
            this._teWidth = this._targetElement.getBoundingClientRect().width;
            this._teHeight = this._targetElement.getBoundingClientRect().height;
        };
        ContextualHost.prototype._disMissAction = function (e) {
            // If the elemenet clicked is not INSIDE of searchbox then close seach
            if (!this._container.contains(e.target) && e.target !== this._container) {
                if (this._children !== undefined) {
                    var isChild_1 = false;
                    this._children.map(function (child) {
                        if (child !== undefined) {
                            isChild_1 = child.contains(e.target);
                        }
                    });
                    if (!isChild_1) {
                        this.disposeModal();
                    }
                }
                else {
                    this.disposeModal();
                }
            }
        };
        ContextualHost.prototype._setDismissClick = function () {
            var _this = this;
            document.addEventListener("click", this._disMissAction, true);
            document.addEventListener("keyup", function (e) {
                if (e.keyCode === 32 || e.keyCode === 27) {
                    _this._disMissAction(e);
                }
            }, true);
        };
        ContextualHost.prototype._resizeAction = function () {
            this.disposeModal();
        };
        ContextualHost.prototype._setResizeDisposal = function () {
            window.addEventListener("resize", this._resizeAction, false);
        };
        return ContextualHost;
    }());
    fabric.ContextualHost = ContextualHost;
})(fabric || (fabric = {}));

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
/// <reference path="../ContextualHost/ContextualHost.ts"/>
var STATE_HIDDEN = "is-hidden";
var CLOSE_BUTTON_CLASS = ".ms-Callout-close";
var MODIFIER_OOBE_CLASS = "ms-Callout--OOBE";
var fabric;
(function (fabric) {
    "use strict";
    var Callout = (function () {
        function Callout(container, addTarget, position) {
            this._container = container;
            this._addTarget = addTarget;
            this._position = position;
            this._closeButton = document.querySelector(CLOSE_BUTTON_CLASS);
            this._setOpener();
        }
        Callout.prototype._setOpener = function () {
            this._addTarget.addEventListener("click", this._clickHandler.bind(this), true);
        };
        Callout.prototype._openContextMenu = function () {
            var modifiers = [];
            if (this._hasModifier(MODIFIER_OOBE_CLASS)) {
                modifiers.push("primaryArrow");
            }
            this._container.classList.remove(STATE_HIDDEN);
            this._contextualHost = new fabric.ContextualHost(this._container, this._position, this._addTarget, true, modifiers);
            if (this._closeButton) {
                this._closeButton.addEventListener("click", this._closeHandler.bind(this), false);
            }
        };
        Callout.prototype._hasModifier = function (modifierClass) {
            return this._container.classList.contains(modifierClass);
        };
        Callout.prototype._closeHandler = function (e) {
            this._contextualHost.disposeModal();
        };
        Callout.prototype._clickHandler = function (e) {
            this._openContextMenu();
        };
        return Callout;
    }());
    fabric.Callout = Callout;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
var fabric;
(function (fabric) {
    /**
     * CheckBox Plugin
     *
     * Adds basic demonstration functionality to .ms-CheckBox components.
     *
     */
    var CheckBox = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of CheckBox
         * @constructor
         */
        function CheckBox(container) {
            this._container = container;
            this._choiceFieldLI = this._container.querySelector(".ms-Choice-field");
            if (this._choiceFieldLI.getAttribute("aria-checked") === "true") {
                this._choiceFieldLI.classList.add("is-checked");
            }
            if (this._choiceFieldLI.getAttribute("role") === "checkbox") {
                this._choiceFieldLI.classList.add("ms-Choice-type--checkbox");
            }
            this._addListeners();
        }
        CheckBox.prototype.getValue = function () {
            return this._choiceFieldLI.getAttribute("aria-checked") === "true" ? true : false;
        };
        CheckBox.prototype.toggle = function () {
            if (this.getValue()) {
                this.unCheck();
            }
            else {
                this.check();
            }
        };
        CheckBox.prototype.check = function () {
            this._choiceFieldLI.setAttribute("aria-checked", "true");
            this._choiceFieldLI.classList.add("is-checked");
        };
        CheckBox.prototype.unCheck = function () {
            this._choiceFieldLI.setAttribute("aria-checked", "false");
            this._choiceFieldLI.classList.remove("is-checked");
        };
        CheckBox.prototype.removeListeners = function () {
            this._choiceFieldLI.removeEventListener("focus", this._FocusHandler.bind(this));
            this._choiceFieldLI.removeEventListener("blur", this._BlurHandler.bind(this));
            this._choiceFieldLI.removeEventListener("click", this._ClickHandler.bind(this));
            this._choiceFieldLI.addEventListener("keydown", this._KeydownHandler.bind(this));
        };
        CheckBox.prototype._addListeners = function (events) {
            var ignore = events && events.ignore;
            if (!ignore || !(ignore.indexOf("focus") > -1)) {
                this._choiceFieldLI.addEventListener("focus", this._FocusHandler.bind(this), false);
            }
            if (!ignore || !(ignore.indexOf("blur") > -1)) {
                this._choiceFieldLI.addEventListener("blur", this._BlurHandler.bind(this), false);
            }
            if (!ignore || !(ignore.indexOf("click") > -1)) {
                this._choiceFieldLI.addEventListener("click", this._ClickHandler.bind(this), false);
            }
            if (!ignore || !(ignore.indexOf("keydown") > -1)) {
                this._choiceFieldLI.addEventListener("keydown", this._KeydownHandler.bind(this), false);
            }
        };
        CheckBox.prototype._FocusHandler = function () {
            this._choiceFieldLI.classList.add("in-focus");
        };
        CheckBox.prototype._BlurHandler = function () {
            this._choiceFieldLI.classList.remove("in-focus");
        };
        CheckBox.prototype._ClickHandler = function (event) {
            event.stopPropagation();
            event.preventDefault();
            this.toggle();
        };
        CheckBox.prototype._KeydownHandler = function (event) {
            if (event.keyCode === 32) {
                event.stopPropagation();
                event.preventDefault();
                if (!this._choiceFieldLI.classList.contains("is-disabled")) {
                    this.toggle();
                }
            }
        };
        return CheckBox;
    }());
    fabric.CheckBox = CheckBox;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../CheckBox/CheckBox.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fabric;
(function (fabric) {
    /**
     * RadioButton Plugin
     *
     * Adds basic demonstration functionality to .ms-RadioButton components.
     *
     */
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of RadioButton
         * @constructor
         */
        function RadioButton(container) {
            _super.call(this, container);
            if (this._choiceFieldLI.getAttribute("role") === "radio") {
                this._choiceFieldLI.classList.add("ms-Choice-type--radio");
            }
        }
        RadioButton.prototype.removeListeners = function () {
            _super.prototype.removeListeners.call(this);
            this._choiceFieldLI.removeEventListener("click", this._RadioClickHandler.bind(this));
            this._choiceFieldLI.addEventListener("keydown", this._RadioKeydownHandler.bind(this));
        };
        RadioButton.prototype._addListeners = function () {
            _super.prototype._addListeners.call(this, { ignore: ["keydown", "click"] });
            this._choiceFieldLI.addEventListener("click", this._RadioClickHandler.bind(this), false);
            this._choiceFieldLI.addEventListener("keydown", this._RadioKeydownHandler.bind(this), false);
        };
        RadioButton.prototype._RadioClickHandler = function (event) {
            event.stopPropagation();
            event.preventDefault();
            this._dispatchSelectEvent();
        };
        RadioButton.prototype._dispatchSelectEvent = function () {
            var objDict = {
                bubbles: true,
                cancelable: true,
                detail: {
                    name: this._choiceFieldLI.getAttribute("name"),
                    item: this
                }
            };
            this._choiceFieldLI.dispatchEvent(new CustomEvent("msChoicefield", objDict));
        };
        RadioButton.prototype._RadioKeydownHandler = function (event) {
            if (event.keyCode === 32) {
                event.stopPropagation();
                event.preventDefault();
                if (!this._choiceFieldLI.classList.contains("is-disabled")) {
                    this._dispatchSelectEvent();
                }
            }
        };
        return RadioButton;
    }(fabric.CheckBox));
    fabric.RadioButton = RadioButton;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../RadioButton/RadioButton.ts"/>
"use strict";
var fabric;
(function (fabric) {
    /**
     * ChoiceFieldGroup Plugin
     *
     * Adds basic demonstration functionality to .ms-ChoiceFieldGroup components.
     *
    */
    var ChoiceFieldGroup = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of ChoiceFieldGroup
         * @constructor
         */
        function ChoiceFieldGroup(container) {
            this._choiceFieldGroup = container;
            this._choiceFieldComponents = [];
            this._initalSetup();
            this._addListeners();
        }
        ChoiceFieldGroup.prototype.removeListeners = function () {
            this._choiceFieldGroup.removeEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this));
        };
        ChoiceFieldGroup.prototype._initalSetup = function () {
            var choiceFieldElements = this._choiceFieldGroup.querySelectorAll(".ms-RadioButton");
            for (var i = 0; i < choiceFieldElements.length; i++) {
                this._choiceFieldComponents[i] = new fabric.RadioButton(choiceFieldElements[i]);
            }
        };
        ChoiceFieldGroup.prototype._addListeners = function () {
            document.addEventListener("msChoicefield", this._ChoiceFieldHandler.bind(this), false);
        };
        ChoiceFieldGroup.prototype._ChoiceFieldHandler = function (event) {
            var name = event.detail.name;
            var selectedChoice = event.detail.item;
            if (this._choiceFieldGroup.id === name) {
                for (var i = 0; i < this._choiceFieldComponents.length; i++) {
                    this._choiceFieldComponents[i].unCheck();
                }
                selectedChoice.check();
            }
        };
        return ChoiceFieldGroup;
    }());
    fabric.ChoiceFieldGroup = ChoiceFieldGroup;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * SearchBox component
 *
 * Allows you to search the world.
 *
 */
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of SearchBox
     * @constructor
     *
     */
    var SB_FIELD = ".ms-SearchBox-field";
    var SB_CLOSE_BUTTON = ".ms-CommandButton";
    var SB_HAS_TEXT = "has-text";
    var SB_IS_ACTIVE = "is-active";
    var SearchBox = (function () {
        function SearchBox(container) {
            this._cancel = false;
            this._container = container;
            this._saveDOMRefs(this._container);
            this._setHasText();
            this._setFocusAction(this._container);
            this._setCloseButtonAction();
            this._setBlurAction();
            this._checkState();
        }
        SearchBox.prototype.setCollapsedListeners = function () {
            var _this = this;
            this._disposeListeners();
            this._searchBox.addEventListener("click", function () { _this._expandSearchHandler(); }, false);
            this._searchBoxField.addEventListener("focus", function () { _this._expandSearchHandler(); }, true);
        };
        SearchBox.prototype._saveDOMRefs = function (context) {
            this._searchBox = context;
            this._searchBoxField = this._searchBox.querySelector(SB_FIELD);
            this._searchBoxCloseButton = this._searchBox.querySelector(SB_CLOSE_BUTTON);
        };
        SearchBox.prototype._hasClass = function (element, cls) {
            return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
        };
        SearchBox.prototype._disposeListeners = function () {
            var _this = this;
            this._searchBox.removeEventListener("click", function () { _this._expandSearchHandler(); }, false);
            this._searchBoxField.removeEventListener("focus", function () { _this._expandSearchHandler(); }, true);
        };
        SearchBox.prototype._handleOutsideSearchClick = function (e) {
            var _this = this;
            // If the elemenet clicked is not INSIDE of searchbox then close seach
            if (!this._searchBox.contains(e.target) && e.target !== this._searchBox) {
                this._collapseSearchBox();
                document.removeEventListener("click", function (ev) { _this._handleOutsideSearchClick(ev); }, false);
                this.setCollapsedListeners();
            }
        };
        SearchBox.prototype._collapseSearchBox = function () {
            this._searchBox.classList.remove("is-active");
        };
        SearchBox.prototype._expandSearchHandler = function () {
            var _this = this;
            this._disposeListeners();
            this._searchBox.classList.add("is-active");
            this._searchBoxField.focus();
            this._searchBoxCloseButton.addEventListener("click", function () { _this._collapseSearchBox(); }, false);
            document.addEventListener("click", function (ev) { _this._handleOutsideSearchClick(ev); }, false);
        };
        SearchBox.prototype._setHasText = function () {
            if (this._searchBoxField.value.length > 0) {
                this._searchBox.classList.add(SB_HAS_TEXT);
            }
            else {
                this._searchBox.classList.remove(SB_HAS_TEXT);
            }
        };
        SearchBox.prototype._setFocusAction = function (context) {
            var _this = this;
            this._searchBoxField.addEventListener("focus", function () {
                _this._setHasText();
                _this._searchBox.classList.add(SB_IS_ACTIVE);
            }, true);
        };
        SearchBox.prototype._clearSearchBox = function () {
            this._searchBoxField.value = "";
            this._searchBox.classList.remove(SB_IS_ACTIVE);
            this._setHasText();
            this._cancel = false;
        };
        SearchBox.prototype._setCloseButtonAction = function () {
            var _this = this;
            this._searchBoxCloseButton.addEventListener("mousedown", function () {
                _this._clearSearchBox();
            }, false);
            this._searchBoxCloseButton.addEventListener("keydown", function (e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    _this._clearSearchBox();
                }
            }, false);
        };
        SearchBox.prototype._handleBlur = function () {
            var _this = this;
            setTimeout(function () {
                if (!_this._searchBox.contains(document.activeElement)) {
                    _this._clearSearchBox();
                }
            }, 10);
        };
        SearchBox.prototype._setBlurAction = function () {
            var _this = this;
            this._searchBoxField.addEventListener("blur", function () { _this._handleBlur(); }, true);
            this._searchBoxCloseButton.addEventListener("blur", function () { _this._handleBlur(); }, true);
        };
        SearchBox.prototype._checkState = function () {
            if (this._hasClass(this._searchBox, "is-collapsed")) {
                this.setCollapsedListeners();
            }
        };
        return SearchBox;
    }());
    fabric.SearchBox = SearchBox;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>
/**
 * CommandButton
 *
 * Buttons used primarily in the command bar
 *
 */
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    /**
     *
     * @constructor
     */
    var CONTEXT_CLASS = ".ms-ContextualMenu";
    var CB_SPLIT_CLASS = ".ms-CommandButton-splitIcon";
    var CB_BUTTON_CLASS = ".ms-CommandButton-button";
    var MODAL_POSITION = "bottom";
    var CommandButton = (function () {
        function CommandButton(container, contextMenu) {
            this._container = container;
            this._command = this._container;
            this._commandButton = this._command.querySelector(CB_BUTTON_CLASS);
            this._splitButton = this._command.querySelector(CB_SPLIT_CLASS);
            if (contextMenu) {
                this._contextualMenu = contextMenu;
            }
            else {
                this._contextualMenu = this._container.querySelector(CONTEXT_CLASS);
            }
            this._checkForMenu();
        }
        CommandButton.prototype._createModalHostView = function () {
            this._modalHostView = new fabric.ContextualHost(this._contextualMenu, MODAL_POSITION, this._command, false);
        };
        CommandButton.prototype._setClick = function () {
            if (this._splitButton) {
                this._splitButton.addEventListener("click", this._createModalHostView.bind(this), false);
            }
            else {
                this._commandButton.addEventListener("click", this._createModalHostView.bind(this), false);
            }
        };
        CommandButton.prototype._checkForMenu = function () {
            if (this._contextualMenu) {
                this._setClick();
            }
        };
        return CommandButton;
    }());
    fabric.CommandButton = CommandButton;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../SearchBox/SearchBox.ts"/>
/// <reference path="../CommandButton/CommandButton.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>
/**
 * CommandBar
 *
 * Commanding and navigational surface
 *
 */
var fabric;
(function (fabric) {
    "use strict";
    var CONTEXTUAL_MENU = ".ms-ContextualMenu";
    var CONTEXTUAL_MENU_ITEM = ".ms-ContextualMenu-item";
    var CONTEXTUAL_MENU_LINK = ".ms-ContextualMenu-link";
    var CB_SEARCH_BOX = ".ms-SearchBox";
    var CB_MAIN_AREA = ".ms-CommandBar-mainArea";
    var CB_SIDE_COMMAND_AREA = ".ms-CommandBar-sideCommands";
    var CB_ITEM_OVERFLOW = ".ms-CommandBar-overflowButton";
    var CB_NO_LABEL_CLASS = "ms-CommandButton--noLabel";
    var SEARCH_BOX_CLOSE = ".ms-SearchBox-closeField";
    var COMMAND_BUTTON = ".ms-CommandButton";
    var COMMAND_BUTTON_LABEL = ".ms-CommandButton-label";
    var ICON = ".ms-Icon";
    var OVERFLOW_WIDTH = 41.5;
    var CommandBar = (function () {
        function CommandBar(container) {
            this.responsiveSizes = {
                "sm-min": 320,
                "md-min": 480,
                "lg-min": 640,
                "xl-min": 1024,
                "xxl-min": 1366,
                "xxxl-min": 1920
            };
            this.visibleCommands = [];
            this.commandWidths = [];
            this.overflowCommands = [];
            this.itemCollection = [];
            this._sideAreaCollection = [];
            this.breakpoint = "sm";
            this._container = container;
            this.responsiveSizes["sm-max"] = this.responsiveSizes["md-min"] - 1;
            this.responsiveSizes["md-max"] = this.responsiveSizes["lg-min"] - 1;
            this.responsiveSizes["lg-max"] = this.responsiveSizes["xl-min"] - 1;
            this.responsiveSizes["xl-max"] = this.responsiveSizes["xxl-min"] - 1;
            this.responsiveSizes["xxl-max"] = this.responsiveSizes["xxxl-min"] - 1;
            this._setElements();
            this._setBreakpoint();
            // If the overflow exists then run the overflow resizing
            if (this._elements.overflowCommand) {
                this._initOverflow();
            }
            this._setUIState();
        }
        CommandBar.prototype._runsSearchBox = function (reInit, state) {
            if (reInit === void 0) { reInit = true; }
            if (state === void 0) { state = "add"; }
            this._changeSearchState("is-collapsed", state);
            if (reInit) {
                this.searchBoxInstance = this._createSearchInstance();
            }
        };
        CommandBar.prototype._runOverflow = function () {
            if (this._elements.overflowCommand) {
                this._saveCommandWidths();
                this._redrawMenu();
                this._updateCommands();
                this._drawCommands();
                this._checkOverflow();
            }
        };
        CommandBar.prototype._initOverflow = function () {
            this._createContextualRef();
            this._createItemCollection(this.itemCollection, CB_MAIN_AREA);
            this._createItemCollection(this._sideAreaCollection, CB_SIDE_COMMAND_AREA);
            this._saveCommandWidths();
            this._updateCommands();
            this._drawCommands();
            this._setWindowEvent();
            this._checkOverflow();
        };
        CommandBar.prototype._hasClass = function (element, cls) {
            return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
        };
        CommandBar.prototype._getScreenSize = function () {
            // First we need to set what the screen is doing, check screen size
            var w = window;
            var wSize = {
                x: 0,
                y: 0
            };
            var d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0];
            wSize.x = w.innerWidth || e.clientWidth || g.clientWidth;
            wSize.y = w.innerHeight || e.clientHeight || g.clientHeight;
            return wSize;
        };
        CommandBar.prototype._setBreakpoint = function () {
            var screenSize = this._getScreenSize().x;
            switch (true) {
                case (screenSize <= this.responsiveSizes["sm-max"]):
                    this.breakpoint = "sm";
                    break;
                case (screenSize >= this.responsiveSizes["md-min"] && screenSize <= this.responsiveSizes["md-max"]):
                    this.breakpoint = "md";
                    break;
                case (screenSize >= this.responsiveSizes["lg-min"] && screenSize <= this.responsiveSizes["lg-max"]):
                    this.breakpoint = "lg";
                    break;
                case (screenSize >= this.responsiveSizes["xl-min"] && screenSize <= this.responsiveSizes["xl-max"]):
                    this.breakpoint = "xl";
                    break;
                case (screenSize >= this.responsiveSizes["xxl-min"] && screenSize <= this.responsiveSizes["xxl-max"]):
                    this.breakpoint = "xxl";
                    break;
                case (screenSize >= this.responsiveSizes["xxxl-min"]):
                    this.breakpoint = "xxxl";
                    break;
            }
        };
        CommandBar.prototype._createSearchInstance = function () {
            if (this._elements.searchBox) {
                return new fabric.SearchBox(this._elements.searchBox);
            }
            else {
                return false;
            }
        };
        CommandBar.prototype._changeSearchState = function (state, action) {
            if (this._elements.searchBox) {
                switch (action) {
                    case "remove":
                        this._elements.searchBox.classList.remove(state);
                        break;
                    case "add":
                        this._elements.searchBox.classList.add(state);
                        break;
                    default:
                        break;
                }
            }
        };
        CommandBar.prototype._setElements = function () {
            this._elements = {
                mainArea: this._container.querySelector(CB_MAIN_AREA)
            };
            if (this._container.querySelector(CB_SIDE_COMMAND_AREA)) {
                this._elements.sideCommandArea = this._container.querySelector(CB_SIDE_COMMAND_AREA);
            }
            if (this._container.querySelector(CB_ITEM_OVERFLOW)) {
                this._elements.overflowCommand = this._container.querySelector(CB_ITEM_OVERFLOW);
                this._elements.contextMenu = this._container.querySelector(CB_ITEM_OVERFLOW).querySelector(CONTEXTUAL_MENU);
            }
            if (this._container.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX)) {
                this._elements.searchBox = this._container.querySelector(CB_MAIN_AREA + " " + CB_SEARCH_BOX);
                this._elements.searchBoxClose = this._container.querySelector(SEARCH_BOX_CLOSE);
                this.searchBoxInstance = this._createSearchInstance();
            }
        };
        CommandBar.prototype._createItemCollection = function (iCollection, areaClass) {
            var item, label, iconClasses, splitClasses, items = this._container.querySelectorAll(areaClass + " " + COMMAND_BUTTON + ":not(" + CB_ITEM_OVERFLOW + ")");
            // Initiate the overflow command
            this._commandButtonInstance = new fabric.CommandButton(this._elements.overflowCommand);
            for (var i = 0; i < items.length; i++) {
                item = items[i];
                label = item.querySelector(COMMAND_BUTTON_LABEL).textContent;
                var icon = item.querySelector(ICON);
                if (icon) {
                    iconClasses = icon.className;
                    splitClasses = iconClasses.split(" ");
                }
                for (var o = 0; o < splitClasses.length; o++) {
                    if (splitClasses[o].indexOf(ICON.replace(".", "") + "--") > -1) {
                        icon = splitClasses[o];
                        break;
                    }
                }
                iCollection.push({
                    item: item,
                    label: label,
                    icon: icon,
                    isCollapsed: (item.classList.contains(CB_NO_LABEL_CLASS)) ? true : false,
                    commandButtonRef: new fabric.CommandButton(item)
                });
            }
            return;
        };
        CommandBar.prototype._createContextualRef = function () {
            this.contextualItemContainerRef = this._elements.contextMenu.querySelector(CONTEXTUAL_MENU_ITEM).cloneNode(true);
            this.contextualItemLink = this._elements.contextMenu.querySelector(CONTEXTUAL_MENU_LINK).cloneNode(false);
            this.contextualItemIcon = this._elements.contextMenu.querySelector(".ms-Icon").cloneNode(false);
            this._elements.contextMenu.innerHTML = "";
        };
        CommandBar.prototype._getElementWidth = function (element) {
            var width, styles;
            if (element.offsetParent === null) {
                element.setAttribute("style", "position: absolute; opacity: 0; display: block;");
            }
            width = element.getBoundingClientRect().width;
            styles = window.getComputedStyle(element);
            width += parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
            element.setAttribute("style", "");
            return width;
        };
        CommandBar.prototype._saveCommandWidths = function () {
            for (var i = 0; i < this.itemCollection.length; i++) {
                var item = this.itemCollection[i].item;
                var width = this._getElementWidth(item);
                this.commandWidths[i] = width;
            }
        };
        CommandBar.prototype._updateCommands = function () {
            var searchCommandWidth = 0;
            var mainCommandSurfaceAreaWidth = this._elements.mainArea.getBoundingClientRect().width;
            var totalAreaWidth = mainCommandSurfaceAreaWidth;
            if (this._elements.searchBox) {
                searchCommandWidth = this._getElementWidth(this._elements.searchBox);
            }
            var totalCommandWidth = searchCommandWidth + OVERFLOW_WIDTH; // Start with searchbox width
            // Reset overflow and visible
            this.visibleCommands = [];
            this.overflowCommands = [];
            for (var i = 0; i < this.itemCollection.length; i++) {
                totalCommandWidth += this.commandWidths[i];
                if (totalCommandWidth < totalAreaWidth) {
                    this.visibleCommands.push(this.itemCollection[i]);
                }
                else {
                    this.overflowCommands.push(this.itemCollection[i]);
                }
            }
        };
        CommandBar.prototype._drawCommands = function () {
            // Remove existing commands
            this._elements.contextMenu.innerHTML = "";
            for (var i = 0; i < this.overflowCommands.length; i++) {
                this.overflowCommands[i].item.classList.add("is-hidden");
                // Add all items to contextual menu.
                var newCItem = this.contextualItemContainerRef.cloneNode(false);
                var newClink = this.contextualItemLink.cloneNode(false);
                var newIcon = this.contextualItemIcon.cloneNode(false);
                var iconClass = this.overflowCommands[i].icon;
                newClink.innerText = this.overflowCommands[i].label;
                newCItem.appendChild(newClink);
                newIcon.className = ICON.replace(".", "") + " " + iconClass;
                newCItem.appendChild(newIcon);
                this._elements.contextMenu.appendChild(newCItem);
            }
            // Show visible commands
            for (var x = 0; x < this.visibleCommands.length; x++) {
                this.visibleCommands[x].item.classList.remove("is-hidden");
            }
        };
        CommandBar.prototype._setWindowEvent = function () {
            var _this = this;
            window.addEventListener("resize", function () {
                _this._doResize();
            }, false);
        };
        CommandBar.prototype._processColapsedClasses = function (type) {
            for (var i = 0; i < this.itemCollection.length; i++) {
                var thisItem = this.itemCollection[i];
                if (!thisItem.isCollapsed) {
                    if (type === "add") {
                        thisItem.item.classList.add(CB_NO_LABEL_CLASS);
                    }
                    else {
                        thisItem.item.classList.remove(CB_NO_LABEL_CLASS);
                    }
                }
            }
            for (var i = 0; i < this._sideAreaCollection.length; i++) {
                var thisItem = this._sideAreaCollection[i];
                if (!thisItem.isCollapsed) {
                    if (type === "add") {
                        thisItem.item.classList.add(CB_NO_LABEL_CLASS);
                    }
                    else {
                        thisItem.item.classList.remove(CB_NO_LABEL_CLASS);
                    }
                }
            }
        };
        CommandBar.prototype._setUIState = function () {
            switch (this.breakpoint) {
                case "sm":
                    this._runsSearchBox();
                    this._processColapsedClasses("add");
                    this._runOverflow();
                    break;
                case "md":
                    this._runsSearchBox();
                    // Add collapsed classes to commands
                    this._processColapsedClasses("add");
                    this._runOverflow();
                    break;
                case "lg":
                    this._runsSearchBox();
                    this._processColapsedClasses("remove");
                    this._runOverflow();
                    break;
                case "xl":
                    this._runsSearchBox(false, "remove");
                    this._processColapsedClasses("remove");
                    this._runOverflow();
                    break;
                default:
                    this._runsSearchBox(false, "remove");
                    this._processColapsedClasses("remove");
                    this._runOverflow();
                    break;
            }
        };
        CommandBar.prototype._checkOverflow = function () {
            if (this.overflowCommands.length > 0) {
                this._elements.overflowCommand.classList.remove("is-hidden");
            }
            else {
                this._elements.overflowCommand.classList.add("is-hidden");
                if (this.activeCommand === this._elements.overflowCommand) {
                    this._elements.contextMenu.classList.remove("is-open");
                }
            }
        };
        CommandBar.prototype._redrawMenu = function () {
            var left;
            if (this._hasClass(this._elements.contextMenu, "is-open")) {
                left = this.activeCommand.getBoundingClientRect().left;
                this._drawOverflowMenu(left);
            }
        };
        CommandBar.prototype._drawOverflowMenu = function (left) {
            this._elements.contextMenu.setAttribute("style", "left: " + left + "px; transform: translateX(-50%)");
        };
        CommandBar.prototype._doResize = function () {
            this._setBreakpoint();
            this._setUIState();
        };
        return CommandBar;
    }());
    fabric.CommandBar = CommandBar;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../../../dist/js/fabric.templates.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>
/// <reference path="../Button/Button.ts"/>
var fabric;
(function (fabric) {
    var MODAL_POSITION = "bottom";
    var SUBMENU_POSITION = "right";
    var ContextualMenu = (function () {
        function ContextualMenu(container, hostTarget, position) {
            this._container = container;
            this._hostTarget = hostTarget;
            this._position = position ? position : MODAL_POSITION;
            this._setOpener(hostTarget);
            this._init();
        }
        ContextualMenu.prototype.getHost = function () {
            return this._host;
        };
        ContextualMenu.prototype._init = function () {
            this._container.addEventListener("click", this._onContextualMenuClick.bind(this), true);
        };
        ContextualMenu.prototype._onContextualMenuClick = function (event) {
            var target = event.target;
            var classList = target.classList;
            if (classList.contains("ms-ContextualMenu-link") && !classList.contains("is-disabled")) {
                if (this._container.classList.contains("ms-ContextualMenu--multiselect")) {
                    this._multiSelect(target);
                }
                else {
                    this._singleSelect(target);
                }
            }
        };
        ContextualMenu.prototype._multiSelect = function (target) {
            if (target.classList.contains("is-selected")) {
                target.classList.remove("is-selected");
            }
            else {
                target.classList.add("is-selected");
            }
        };
        ContextualMenu.prototype._singleSelect = function (target) {
            var selecteds = this._container.querySelectorAll(".is-selected");
            var i = selecteds.length;
            while (i--) {
                selecteds[i].classList.remove("is-selected");
            }
            target.classList.add("is-selected");
        };
        ContextualMenu.prototype._setOpener = function (hostTarget) {
            var _this = this;
            hostTarget.addEventListener("click", function (event) {
                event.preventDefault();
                _this._openContextMenu(event);
            });
        };
        ContextualMenu.prototype._openContextMenu = function (event) {
            this._createModalHostView(this._container, this._position, this._hostTarget);
            this._checkForSubmenus(this._container);
        };
        ContextualMenu.prototype._checkForSubmenus = function (container) {
            var _this = this;
            var submenus = container.querySelectorAll(".ms-ContextualMenu-item.ms-ContextualMenu-item--hasMenu");
            var i = submenus.length;
            if (submenus.length) {
                var _loop_1 = function() {
                    var button = submenus[i].querySelector(".ms-ContextualMenu-link");
                    var menu = submenus[i].querySelector(".ms-ContextualMenu");
                    if (menu) {
                        var contextualMenu_1 = new fabric.ContextualMenu(menu, button, SUBMENU_POSITION);
                        menu.addEventListener("hostAdded", function () {
                            _this._host.setChildren(contextualMenu_1.getHost());
                        });
                    }
                };
                while (i--) {
                    _loop_1();
                }
            }
        };
        ContextualMenu.prototype._createModalHostView = function (container, position, hostTarget) {
            container.classList.remove("is-hidden");
            this._host = new fabric.ContextualHost(container, position, hostTarget, false);
            container.dispatchEvent(new Event("hostAdded"));
        };
        return ContextualMenu;
    }());
    fabric.ContextualMenu = ContextualMenu;
})(fabric || (fabric = {}));

"use strict";

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
// "use strict";
/// <reference path="../../../typings/jquery.d.ts"/>
/// <reference path="../../../typings/pickadate.d.ts"/>
var fabric;
(function (fabric) {
    /**
     * DatePicker Plugin
     */
    var DatePicker = (function () {
        function DatePicker(container, options) {
            var _this = this;
            /** Set up letiables and run the Pickadate plugin. */
            var $datePicker = $(container);
            var $dateField = $datePicker.find(".ms-TextField-field").pickadate($.extend({
                // Strings and translations.
                weekdaysShort: ["S", "M", "T", "W", "T", "F", "S"],
                // Don't render the buttons
                clear: "",
                close: "",
                today: "",
                // Events
                onStart: function () {
                    _this.initCustomView($datePicker);
                },
                // Classes
                klass: {
                    // The element states
                    input: "ms-DatePicker-input",
                    active: "ms-DatePicker-input--active",
                    // The root picker and states
                    picker: "ms-DatePicker-picker",
                    opened: "ms-DatePicker-picker--opened",
                    focused: "ms-DatePicker-picker--focused",
                    // The picker holder
                    holder: "ms-DatePicker-holder",
                    // The picker frame, wrapper, and box
                    frame: "ms-DatePicker-frame",
                    wrap: "ms-DatePicker-wrap",
                    box: "ms-DatePicker-dayPicker",
                    // The picker header
                    header: "ms-DatePicker-header",
                    // Month & year labels
                    month: "ms-DatePicker-month",
                    year: "ms-DatePicker-year",
                    // Table of dates
                    table: "ms-DatePicker-table",
                    // Weekday labels
                    weekdays: "ms-DatePicker-weekday",
                    // Day states
                    day: "ms-DatePicker-day",
                    disabled: "ms-DatePicker-day--disabled",
                    selected: "ms-DatePicker-day--selected",
                    highlighted: "ms-DatePicker-day--highlighted",
                    now: "ms-DatePicker-day--today",
                    infocus: "ms-DatePicker-day--infocus",
                    outfocus: "ms-DatePicker-day--outfocus"
                }
            }, options || {}));
            var $picker = $dateField.pickadate("picker");
            /** Respond to built-in picker events. */
            $picker.on({
                render: function () {
                    _this.updateCustomView($datePicker);
                },
                open: function () {
                    _this.scrollUp($datePicker);
                }
            });
        }
        /**
         * After the Pickadate plugin starts, this function
         * adds additional controls to the picker view.
         */
        DatePicker.prototype.initCustomView = function ($datePicker) {
            var _this = this;
            /** Get some letiables ready. */
            var $monthControls = $datePicker.find(".ms-DatePicker-monthComponents");
            var $goToday = $datePicker.find(".ms-DatePicker-goToday");
            var $monthPicker = $datePicker.find(".ms-DatePicker-monthPicker");
            var $yearPicker = $datePicker.find(".ms-DatePicker-yearPicker");
            var $pickerWrapper = $datePicker.find(".ms-DatePicker-wrap");
            var $picker = $datePicker.find(".ms-TextField-field").pickadate("picker");
            /** Move the month picker into position. */
            $monthControls.appendTo($pickerWrapper);
            $goToday.appendTo($pickerWrapper);
            $monthPicker.appendTo($pickerWrapper);
            $yearPicker.appendTo($pickerWrapper);
            /** Update the custom view. */
            this.updateCustomView($datePicker);
            /** Move back one month. */
            $monthControls.on("click", ".js-prevMonth", function (event) {
                event.preventDefault();
                var newMonth = $picker.get("highlight").month - 1;
                _this.changeHighlightedDate($picker, null, newMonth, null);
            });
            /** Move ahead one month. */
            $monthControls.on("click", ".js-nextMonth", function (event) {
                event.preventDefault();
                var newMonth = $picker.get("highlight").month + 1;
                _this.changeHighlightedDate($picker, null, newMonth, null);
            });
            /** Move back one year. */
            $monthPicker.on("click", ".js-prevYear", function (event) {
                event.preventDefault();
                var newYear = $picker.get("highlight").year - 1;
                _this.changeHighlightedDate($picker, newYear, null, null);
            });
            /** Move ahead one year. */
            $monthPicker.on("click", ".js-nextYear", function (event) {
                event.preventDefault();
                var newYear = $picker.get("highlight").year + 1;
                _this.changeHighlightedDate($picker, newYear, null, null);
            });
            /** Move back one decade. */
            $yearPicker.on("click", ".js-prevDecade", function (event) {
                event.preventDefault();
                var newYear = $picker.get("highlight").year - 10;
                _this.changeHighlightedDate($picker, newYear, null, null);
            });
            /** Move ahead one decade. */
            $yearPicker.on("click", ".js-nextDecade", function (event) {
                event.preventDefault();
                var newYear = $picker.get("highlight").year + 10;
                _this.changeHighlightedDate($picker, newYear, null, null);
            });
            /** Go to the current date, shown in the day picking view. */
            $goToday.click(function (event) {
                event.preventDefault();
                /** Select the current date, while keeping the picker open. */
                var now = new Date();
                $picker.set("select", [now.getFullYear(), now.getMonth(), now.getDate()]);
                /** Switch to the default (calendar) view. */
                $datePicker.removeClass("is-pickingMonths").removeClass("is-pickingYears");
            });
            /** Change the highlighted month. */
            $monthPicker.on("click", ".js-changeDate", function (event) {
                event.preventDefault();
                var $changeDate = $(event.toElement);
                /** Get the requested date from the data attributes. */
                var newYear = $changeDate.attr("data-year");
                var newMonth = $changeDate.attr("data-month");
                var newDay = $changeDate.attr("data-day");
                /** Update the date. */
                _this.changeHighlightedDate($picker, newYear, newMonth, newDay);
                /** If we"ve been in the "picking months" state on mobile, remove that state so we show the calendar again. */
                if ($datePicker.hasClass("is-pickingMonths")) {
                    $datePicker.removeClass("is-pickingMonths");
                }
            });
            /** Change the highlighted year. */
            $yearPicker.on("click", ".js-changeDate", function (event) {
                event.preventDefault();
                var $changeDate = $(event.toElement);
                /** Get the requested date from the data attributes. */
                var newYear = $changeDate.attr("data-year");
                var newMonth = $changeDate.attr("data-month");
                var newDay = $changeDate.attr("data-day");
                /** Update the date. */
                _this.changeHighlightedDate($picker, newYear, newMonth, newDay);
                /** If we"ve been in the "picking years" state on mobile, remove that state so we show the calendar again. */
                if ($datePicker.hasClass("is-pickingYears")) {
                    $datePicker.removeClass("is-pickingYears");
                }
            });
            /** Switch to the default state. */
            $monthPicker.on("click", ".js-showDayPicker", function () {
                $datePicker.removeClass("is-pickingMonths");
                $datePicker.removeClass("is-pickingYears");
            });
            /** Switch to the is-pickingMonths state. */
            $monthControls.on("click", ".js-showMonthPicker", function () {
                $datePicker.toggleClass("is-pickingMonths");
            });
            /** Switch to the is-pickingYears state. */
            $monthPicker.on("click", ".js-showYearPicker", function () {
                $datePicker.toggleClass("is-pickingYears");
            });
        };
        /** Change the highlighted date. */
        DatePicker.prototype.changeHighlightedDate = function ($picker, newYear, newMonth, newDay) {
            /** All letiables are optional. If not provided, default to the current value. */
            if (typeof newYear === "undefined" || newYear === null) {
                newYear = $picker.get("highlight").year;
            }
            if (typeof newMonth === "undefined" || newMonth === null) {
                newMonth = $picker.get("highlight").month;
            }
            if (typeof newDay === "undefined" || newDay === null) {
                newDay = $picker.get("highlight").date;
            }
            /** Update it. */
            $picker.set("highlight", [newYear, newMonth, newDay]);
        };
        /** Whenever the picker renders, do our own rendering on the custom controls. */
        DatePicker.prototype.updateCustomView = function ($datePicker) {
            /** Get some letiables ready. */
            var $monthPicker = $datePicker.find(".ms-DatePicker-monthPicker");
            var $yearPicker = $datePicker.find(".ms-DatePicker-yearPicker");
            var $picker = $datePicker.find(".ms-TextField-field").pickadate("picker");
            /** Set the correct year. */
            $monthPicker.find(".ms-DatePicker-currentYear").text($picker.get("view").year);
            /** Highlight the current month. */
            $monthPicker.find(".ms-DatePicker-monthOption").removeClass("is-highlighted");
            $monthPicker.find(".ms-DatePicker-monthOption[data-month='" + $picker.get("highlight").month + "']").addClass("is-highlighted");
            /** Generate the grid of years for the year picker view. */
            // Start by removing any existing generated output. */
            $yearPicker.find(".ms-DatePicker-currentDecade").remove();
            $yearPicker.find(".ms-DatePicker-optionGrid").remove();
            // Generate the output by going through the years.
            var startingYear = $picker.get("highlight").year - 11;
            var decadeText = startingYear + " - " + (startingYear + 11);
            var output = "<div class='ms-DatePicker-currentDecade'>" + decadeText + "</div>";
            output += "<div class='ms-DatePicker-optionGrid'>";
            for (var year = startingYear; year < (startingYear + 12); year++) {
                output += "<span class='ms-DatePicker-yearOption js-changeDate' data-year='" + year + "'>" + year + "</span>";
            }
            output += "</div>";
            // Output the title and grid of years generated above.
            $yearPicker.append(output);
            /** Highlight the current year. */
            $yearPicker.find(".ms-DatePicker-yearOption").removeClass("is-highlighted");
            $yearPicker.find(".ms-DatePicker-yearOption[data-year='" + $picker.get("highlight").year + "']").addClass("is-highlighted");
        };
        /** Scroll the page up so that the field the date picker is attached to is at the top. */
        DatePicker.prototype.scrollUp = function ($datePicker) {
            $("html, body").animate({
                scrollTop: $datePicker.offset().top
            }, 367);
        };
        return DatePicker;
    }());
    fabric.DatePicker = DatePicker;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../../../dist/js/fabric.templates.ts"/>
var fabric;
(function (fabric) {
    var Overlay = (function () {
        function Overlay(overlayElement) {
            this._ftl = new FabricTemplateLibrary();
            if (overlayElement) {
                this.overlayElement = overlayElement;
            }
            else {
                this.overlayElement = this._ftl.Overlay();
            }
            this.overlayElement.addEventListener("click", this.hide.bind(this), false);
        }
        Overlay.prototype.remove = function () {
            this.overlayElement.parentElement.removeChild(this.overlayElement);
        };
        Overlay.prototype.show = function () {
            this.overlayElement.classList.add("is-visible");
        };
        Overlay.prototype.hide = function () {
            this.overlayElement.classList.remove("is-visible");
        };
        return Overlay;
    }());
    fabric.Overlay = Overlay;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
/// <reference path="../Overlay/Overlay.ts"/>
var fabric;
(function (fabric) {
    var Dialog = (function () {
        function Dialog(dialog) {
            this._dialog = dialog;
            this._closeButtonElement = this._dialog.querySelector(".ms-Dialog-buttonClose");
            this._actionButtonElements = this._dialog.querySelectorAll(".ms-Dialog-action");
            if (this._closeButtonElement) {
                this._closeButtonElement.addEventListener("click", this.close.bind(this), false);
            }
            for (var i = 0; i < this._actionButtonElements.length; i++) {
                this._actionButtonElements[i].addEventListener("click", this.close.bind(this), false);
            }
        }
        Dialog.prototype.close = function () {
            this._overlay.remove();
            this._dialog.classList.remove("is-open");
            this._overlay.overlayElement.removeEventListener("click", this.close.bind(this));
        };
        Dialog.prototype.open = function () {
            this._dialog.classList.add("is-open");
            this._overlay = new fabric.Overlay();
            if (!this._dialog.classList.contains("ms-Dialog--blocking")) {
                this._overlay.overlayElement.addEventListener("click", this.close.bind(this), false);
                this._overlay.show();
            }
            this._dialog.parentElement.appendChild(this._overlay.overlayElement);
        };
        return Dialog;
    }());
    fabric.Dialog = Dialog;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";
var fabric;
(function (fabric) {
    /**
     * DialogHost class
     */
    var DialogHost = (function () {
        function DialogHost() {
        }
        return DialogHost;
    }());
    fabric.DialogHost = DialogHost;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../Overlay/Overlay.ts"/>
var fabric;
(function (fabric) {
    /**
     * Panel Host
     *
     * A host for the panel control
     *
     */
    var PANEL_HOST_CLASS = "ms-PanelHost";
    var PanelHost = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of Panel
         * @constructor
         */
        function PanelHost(layer, callBack) {
            this._layer = layer;
            this._callBack = callBack;
            this._createElements();
            this._renderElements();
        }
        PanelHost.prototype.dismiss = function () {
            document.body.removeChild(this.panelHost);
        };
        PanelHost.prototype.update = function (layer, callBack) {
            this.panelHost.replaceChild(layer, this._layer);
            if (callBack) {
                callBack();
            }
        };
        PanelHost.prototype._renderElements = function () {
            document.body.appendChild(this.panelHost);
            if (this._callBack) {
                this._callBack(this._layer);
            }
        };
        PanelHost.prototype._createElements = function () {
            this.panelHost = document.createElement("div");
            this.panelHost.classList.add(PANEL_HOST_CLASS);
            this.panelHost.appendChild(this._layer);
            this._overlay = new fabric.Overlay(this._overlayContainer);
            this._overlay.show();
            // Append Elements
            this.panelHost.appendChild(this._overlay.overlayElement);
        };
        return PanelHost;
    }());
    fabric.PanelHost = PanelHost;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../PanelHost/PanelHost.ts"/>
var fabric;
(function (fabric) {
    /**
     * Panel Host
     *
     * A host for the panel control
     *
     */
    var ANIMATE_IN_STATE = "animate-in";
    var ANIMATE_OUT_STATE = "animate-out";
    var ANIMATION_END = 400;
    var Panel = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of Panel
         * @constructor
         */
        function Panel(panel, direction, animateOverlay) {
            this._panel = panel;
            this._direction = direction || "right";
            this._animateOverlay = animateOverlay || true;
            this._panelHost = new fabric.PanelHost(this._panel, this._animateInPanel);
            this._setEvents();
        }
        Panel.prototype.dismiss = function (callBack) {
            var _this = this;
            this._panel.classList.add(ANIMATE_OUT_STATE);
            setTimeout(function () {
                _this._panel.classList.remove(ANIMATE_OUT_STATE);
                _this._panel.classList.remove("is-open");
                _this._panelHost.dismiss();
                if (callBack) {
                    callBack();
                }
            }, ANIMATION_END);
        };
        Panel.prototype._setEvents = function () {
            var _this = this;
            this._panelHost._overlay.overlayElement.addEventListener("click", function () {
                _this.dismiss();
            });
            var closeButton = this._panel.querySelector(".ms-PanelAction-close");
            if (closeButton !== null) {
                closeButton.addEventListener("click", function () {
                    _this.dismiss();
                });
            }
        };
        Panel.prototype._animateInPanel = function (layer) {
            layer.classList.add(ANIMATE_IN_STATE);
            layer.classList.add("is-open");
            setTimeout(function () {
                layer.classList.remove(ANIMATE_IN_STATE);
            }, ANIMATION_END);
        };
        return Panel;
    }());
    fabric.Panel = Panel;
})(fabric || (fabric = {}));

/// <reference path="../Panel/Panel.ts"/>
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
var fabric;
(function (fabric) {
    var DROPDOWN_CLASS = "ms-Dropdown";
    var DROPDOWN_TITLE_CLASS = "ms-Dropdown-title";
    var DROPDOWN_ITEMS_CLASS = "ms-Dropdown-items";
    var DROPDOWN_ITEM_CLASS = "ms-Dropdown-item";
    var DROPDOWN_SELECT_CLASS_SELECTOR = ".ms-Dropdown-select";
    var PANEL_CLASS = "ms-Panel";
    var IS_OPEN_CLASS = "is-open";
    var IS_DISABLED_CLASS = "is-disabled";
    var IS_SELECTED_CLASS = "is-selected";
    var ANIMATE_IN_CLASS = "animate-in";
    var SMALL_MAX_WIDTH = 479;
    /**
     * Dropdown Plugin
     *
     * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
     * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
     *
     */
    var Dropdown = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of Dropdown
         * @constructor
         */
        function Dropdown(container) {
            this._container = container;
            this._newDropdownLabel = document.createElement("span");
            this._newDropdownLabel.classList.add(DROPDOWN_TITLE_CLASS);
            this._newDropdown = document.createElement("ul");
            this._newDropdown.classList.add(DROPDOWN_ITEMS_CLASS);
            this._dropdownItems = [];
            this._originalDropdown = container.querySelector(DROPDOWN_SELECT_CLASS_SELECTOR);
            var _originalOptions = this._originalDropdown.querySelectorAll("option");
            /** Bind the callbacks to retain their context */
            this._onCloseDropdown = this._onCloseDropdown.bind(this);
            this._onItemSelection = this._onItemSelection.bind(this);
            this._onOpenDropdown = this._onOpenDropdown.bind(this);
            /** Create a new option as a list item, and add it to the replacement dropdown */
            for (var i = 0; i < _originalOptions.length; ++i) {
                var option = _originalOptions[i];
                if (option.selected) {
                    this._newDropdownLabel.innerHTML = option.text;
                }
                var newItem = document.createElement("li");
                newItem.classList.add(DROPDOWN_ITEM_CLASS);
                if (option.disabled) {
                    newItem.classList.add(IS_DISABLED_CLASS);
                }
                newItem.innerHTML = option.text;
                newItem.addEventListener("click", this._onItemSelection);
                this._newDropdown.appendChild(newItem);
                this._dropdownItems.push({
                    oldOption: option,
                    newItem: newItem
                });
            }
            /** Add the new replacement dropdown */
            container.appendChild(this._newDropdownLabel);
            container.appendChild(this._newDropdown);
            /** Toggle open/closed state of the dropdown when clicking its title. */
            this._newDropdownLabel.addEventListener("click", this._onOpenDropdown);
            this._setWindowEvent();
        }
        Dropdown.prototype._setWindowEvent = function () {
            var _this = this;
            window.addEventListener("resize", function () {
                _this._doResize();
            }, false);
        };
        Dropdown.prototype._getScreenSize = function () {
            var w = window;
            var wSize = {
                x: 0,
                y: 0
            };
            var d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0];
            wSize.x = w.innerWidth || e.clientWidth || g.clientWidth;
            wSize.y = w.innerHeight || e.clientHeight || g.clientHeight;
            return wSize;
        };
        Dropdown.prototype._doResize = function () {
            var isOpen = this._container.classList.contains(IS_OPEN_CLASS);
            if (!isOpen) {
                return;
            }
            var screenSize = this._getScreenSize().x;
            if (screenSize <= SMALL_MAX_WIDTH) {
                this._openDropdownAsPanel();
            }
            else {
                this._removeDropdownAsPanel();
            }
        };
        Dropdown.prototype._openDropdownAsPanel = function () {
            if (this._panel === undefined) {
                this._panelContainer = document.createElement("div");
                this._panelContainer.classList.add(PANEL_CLASS);
                this._panelContainer.classList.add(DROPDOWN_CLASS);
                this._panelContainer.classList.add(IS_OPEN_CLASS);
                this._panelContainer.classList.add(ANIMATE_IN_CLASS);
                this._panelContainer.appendChild(this._newDropdown);
                /** Assign the script to the new panel, which creates a panel host, overlay, and attaches it to the DOM */
                this._panel = new fabric.Panel(this._panelContainer);
            }
        };
        Dropdown.prototype._removeDropdownAsPanel = function () {
            var _this = this;
            if (this._panel !== undefined) {
                /** destroy panel and move dropdown back to outside the panel */
                this._panel.dismiss(function () {
                    _this._container.appendChild(_this._newDropdown);
                });
                this._panel = undefined;
            }
        };
        Dropdown.prototype._onOpenDropdown = function (evt) {
            var isDisabled = this._container.classList.contains(IS_DISABLED_CLASS);
            var isOpen = this._container.classList.contains(IS_OPEN_CLASS);
            if (!isDisabled && !isOpen) {
                /** Stop the click event from propagating, which would just close the dropdown immediately. */
                evt.stopPropagation();
                /** Go ahead and open that dropdown. */
                this._container.classList.add(IS_OPEN_CLASS);
                /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
                document.addEventListener("click", this._onCloseDropdown);
                var screenSize = this._getScreenSize().x;
                if (screenSize <= SMALL_MAX_WIDTH) {
                    this._openDropdownAsPanel();
                }
            }
        };
        Dropdown.prototype._onCloseDropdown = function () {
            this._removeDropdownAsPanel();
            this._container.classList.remove(IS_OPEN_CLASS);
            document.removeEventListener("click", this._onCloseDropdown);
        };
        Dropdown.prototype._onItemSelection = function (evt) {
            var item = evt.srcElement;
            var isDropdownDisabled = this._container.classList.contains(IS_DISABLED_CLASS);
            var isOptionDisabled = item.classList.contains(IS_DISABLED_CLASS);
            if (!isDropdownDisabled && !isOptionDisabled) {
                /** Deselect all items and select this one. */
                /** Update the original dropdown. */
                for (var i = 0; i < this._dropdownItems.length; ++i) {
                    if (this._dropdownItems[i].newItem === item) {
                        this._dropdownItems[i].newItem.classList.add(IS_SELECTED_CLASS);
                        this._dropdownItems[i].oldOption.selected = true;
                    }
                    else {
                        this._dropdownItems[i].newItem.classList.remove(IS_SELECTED_CLASS);
                        this._dropdownItems[i].oldOption.selected = false;
                    }
                }
                /** Update the replacement dropdown's title. */
                this._newDropdownLabel.innerHTML = item.textContent;
                /** Trigger any change event tied to the original dropdown. */
                var changeEvent = document.createEvent("HTMLEvents");
                changeEvent.initEvent("change", false, true);
                this._originalDropdown.dispatchEvent(changeEvent);
            }
        };
        return Dropdown;
    }());
    fabric.Dropdown = Dropdown;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// "use strict";
var fabric;
(function (fabric) {
    /**
     *
     * Adds basic demonstration functionality to .ms-PersonaCard components.
     *
     */
    var PersonaCard = (function () {
        /**
         *
         * @param {Element} container - the target container for an instance of PersonaCard
         * @constructor
         */
        function PersonaCard(container) {
            this._container = container;
            var activeElement = this._container.querySelector(".ms-PersonaCard-action.is-active");
            var activeId = activeElement.getAttribute("data-action-id");
            this._actions = this._container.querySelector(".ms-PersonaCard-actions");
            this._expander = this._container.querySelector(".ms-PersonaCard-detailExpander");
            this._addListeners();
            this._setDetail(activeId);
        }
        PersonaCard.prototype.removeListeners = function () {
            this._actions.removeEventListener("click", this._onActionClick.bind(this));
            this._expander.removeEventListener("click", this._onExpanderClick.bind(this));
        };
        PersonaCard.prototype._addListeners = function () {
            this._actions.addEventListener("click", this._onActionClick.bind(this), false);
            this._expander.addEventListener("click", this._onExpanderClick.bind(this), false);
            this._container.addEventListener("keydown", this._onTab.bind(this), false);
        };
        PersonaCard.prototype._onTab = function (event) {
            var target = event.target;
            if (event.keyCode === 9 && target.classList.contains("ms-PersonaCard-action")) {
                this._onActionClick(event);
            }
        };
        PersonaCard.prototype._onExpanderClick = function (event) {
            var parent = event.target.parentElement;
            if (parent.classList.contains("is-collapsed")) {
                parent.classList.remove("is-collapsed");
            }
            else {
                parent.classList.add("is-collapsed");
            }
        };
        PersonaCard.prototype._onActionClick = function (event) {
            var target = event.target;
            var actionId = target.getAttribute("data-action-id");
            if (actionId && target.className.indexOf("is-active") === -1) {
                this._setAction(target);
                this._setDetail(actionId);
            }
        };
        PersonaCard.prototype._setAction = function (target) {
            var activeElement = this._container.querySelector(".ms-PersonaCard-action.is-active");
            activeElement.classList.remove("is-active");
            target.classList.add("is-active");
        };
        PersonaCard.prototype._setDetail = function (activeId) {
            var selector = ".ms-PersonaCard-details[data-detail-id='" + activeId + "']";
            var lastDetail = this._container.querySelector(".ms-PersonaCard-details.is-active");
            var activeDetail = this._container.querySelector(selector);
            if (lastDetail) {
                lastDetail.classList.remove("is-active");
            }
            activeDetail.classList.add("is-active");
        };
        return PersonaCard;
    }());
    fabric.PersonaCard = PersonaCard;
})(fabric || (fabric = {}));

/// <reference path="../ContextualHost/ContextualHost.ts"/>
/// <reference path="../PersonaCard/PersonaCard.ts"/>
/**
 * FacePile
 *
 * A host for FacePile
 *
 */
var fabric;
(function (fabric) {
    // const CONTEXTUAL_HOST_CLASS = ".ms-ContextualHost";
    var MODAL_POSITION = "top";
    var Persona = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of FacePile
         * @constructor
         */
        function Persona(container) {
            this._persona = container;
            // If Persona Card and Contextual host exist continue
            // this._contextualHost = this._persona.querySelector(CONTEXTUAL_HOST_CLASS);
            this._personaCard = this._persona.querySelector(".ms-PersonaCard");
            if (this._personaCard) {
                this._assignEvents();
                this._personaCard.setAttribute("style", "display: none;");
                this._createPersonaCard();
            }
        }
        Persona.prototype._createPersonaCard = function () {
            this._personaCardInstance = new fabric.PersonaCard(this._personaCard);
        };
        Persona.prototype._createContextualHostInstance = function () {
            this._personaCard.setAttribute("style", "display: block;");
            this._contextualHostInstance = new fabric.ContextualHost(this._personaCard, MODAL_POSITION, this._persona);
        };
        Persona.prototype._personaEventHandler = function () {
            this._createContextualHostInstance();
        };
        Persona.prototype._assignEvents = function () {
            var _this = this;
            this._persona.addEventListener("click", this._personaEventHandler.bind(this), false);
            this._persona.addEventListener("keyup", function (e) { return (e.keyCode === 32) ? _this._personaEventHandler() : null; }, false);
        };
        return Persona;
    }());
    fabric.Persona = Persona;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../Persona/Persona.ts"/>
var fabric;
(function (fabric) {
    /**
     * FacePile
     *
     * A host for FacePile
     *
     */
    var PERSONA_CLASS = ".ms-Persona";
    var PERSONA_INITIALS = ".ms-Persona-initials";
    var PERSONA_IMAGE = ".ms-Persona-image";
    var PERSONA_PRIMARY_CLASS = ".ms-Persona-primaryText";
    var PERSONA_SECONDARY_CLASS = ".ms-Persona-secondaryText";
    var FacePile = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of FacePile
         * @constructor
         */
        function FacePile(container) {
            this._personaCollection = [];
            this._facePile = container;
            this._createPersonaCollection();
        }
        FacePile.prototype._createPersonaCollection = function () {
            var _personas = document.querySelectorAll(PERSONA_CLASS);
            for (var i = 0; i < _personas.length; i++) {
                var _thisPersona = _personas[i];
                this._personaCollection.push({
                    item: _thisPersona,
                    initials: _thisPersona.querySelector(PERSONA_INITIALS).textContent,
                    image: _thisPersona.querySelector(PERSONA_IMAGE) ?
                        _thisPersona.querySelector(PERSONA_IMAGE).getAttribute("src") : null,
                    primaryText: _thisPersona.querySelector(PERSONA_PRIMARY_CLASS) ?
                        _thisPersona.querySelector(PERSONA_PRIMARY_CLASS).textContent : "",
                    secondaryText: _thisPersona.querySelector(PERSONA_SECONDARY_CLASS) ?
                        _thisPersona.querySelector(PERSONA_SECONDARY_CLASS).textContent : "",
                    personaInstance: new fabric.Persona(_thisPersona)
                });
            }
        };
        return FacePile;
    }());
    fabric.FacePile = FacePile;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
var fabric;
(function (fabric) {
    /**
     * List Item Plugin
     *
     * Adds basic demonstration functionality to .ms-ListItem components.
     *
     */
    var ListItem = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of ListItem
         * @constructor
         */
        function ListItem(container) {
            this._container = container;
            this._toggleElement = this._container.querySelector(".ms-ListItem-selectionTarget");
            this._addListeners();
        }
        ListItem.prototype.removeListeners = function () {
            this._toggleElement.removeEventListener("click", this._toggleHandler.bind(this));
        };
        ListItem.prototype._addListeners = function () {
            this._toggleElement.addEventListener("click", this._toggleHandler.bind(this), false);
        };
        ListItem.prototype._toggleHandler = function () {
            this._container.classList.toggle("is-selected");
        };
        return ListItem;
    }());
    fabric.ListItem = ListItem;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../ListItem/ListItem.ts"/>
"use strict";
var fabric;
(function (fabric) {
    /**
     * List Item Plugin
     *
     * Adds basic demonstration functionality to .ms-List components.
     *
     */
    var List = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of List
         * @constructor
         */
        function List(container) {
            this._container = container;
            this._listItemComponents = [];
            var choiceFieldElements = this._container.querySelectorAll(".ms-ListItem");
            for (var i = 0; i < choiceFieldElements.length; i++) {
                this._listItemComponents[i] = new fabric.ListItem(choiceFieldElements[i]);
            }
        }
        return List;
    }());
    fabric.List = List;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    "use strict";
    /**
     * MessageBanner component
     *
     * A component to display error messages
     *
     */
    var MessageBanner = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of MessageBanner
         * @constructor
         */
        function MessageBanner(container) {
            this._textContainerMaxWidth = 700;
            this._bufferElementsWidth = 88;
            this._bufferElementsWidthSmall = 35;
            this.SMALL_BREAK_POINT = 480;
            this.container = container;
            this.init();
        }
        /**
         * initializes component
         */
        MessageBanner.prototype.init = function () {
            this._cacheDOM();
            this._setListeners();
            this._clientWidth = this._errorBanner.offsetWidth;
            this._initTextWidth = this._clipper.offsetWidth;
            this._onResize();
        };
        /**
         * shows banner if the banner is hidden
         */
        MessageBanner.prototype.showBanner = function () {
            this._errorBanner.className = "ms-MessageBanner";
        };
        /**
         * sets styles on resize
         */
        MessageBanner.prototype._onResize = function () {
            this._clientWidth = this._errorBanner.offsetWidth;
            if (window.innerWidth >= this.SMALL_BREAK_POINT) {
                this._resizeRegular();
            }
            else {
                this._resizeSmall();
            }
        };
        /**
         * resize above 480 pixel breakpoint
         */
        MessageBanner.prototype._resizeRegular = function () {
            if ((this._clientWidth - this._bufferSize) > this._initTextWidth && this._initTextWidth < this._textContainerMaxWidth) {
                this._textWidth = "auto";
                this._chevronButton.className = "ms-MessageBanner-expand";
                this._collapse();
            }
            else {
                this._textWidth = Math.min((this._clientWidth - this._bufferSize), this._textContainerMaxWidth) + "px";
                if (this._chevronButton.className.indexOf("is-visible") === -1) {
                    this._chevronButton.className += " is-visible";
                }
            }
            this._clipper.style.width = this._textWidth;
        };
        /**
         * resize below 480 pixel breakpoint
         */
        MessageBanner.prototype._resizeSmall = function () {
            if (this._clientWidth - (this._bufferElementsWidthSmall + this._closeButton.offsetWidth) > this._initTextWidth) {
                this._textWidth = "auto";
                this._collapse();
            }
            else {
                this._textWidth = (this._clientWidth - (this._bufferElementsWidthSmall + this._closeButton.offsetWidth)) + "px";
            }
            this._clipper.style.width = this._textWidth;
        };
        /**
         * caches elements and values of the component
         */
        MessageBanner.prototype._cacheDOM = function () {
            this._errorBanner = this.container;
            this._clipper = this.container.querySelector(".ms-MessageBanner-clipper");
            this._chevronButton = this.container.querySelector(".ms-MessageBanner-expand");
            this._actionButton = this.container.querySelector(".ms-MessageBanner-action");
            this._bufferSize = this._actionButton.offsetWidth + this._bufferElementsWidth;
            this._closeButton = this.container.querySelector(".ms-MessageBanner-close");
        };
        /**
         * expands component to show full error message
         */
        MessageBanner.prototype._expand = function () {
            var icon = this._chevronButton.querySelector(".ms-Icon");
            this._errorBanner.className += " is-expanded";
            icon.className = "ms-Icon ms-Icon--chevronsUp";
        };
        /**
         * collapses component to only show truncated message
         */
        MessageBanner.prototype._collapse = function () {
            var icon = this._chevronButton.querySelector(".ms-Icon");
            this._errorBanner.className = "ms-MessageBanner";
            icon.className = "ms-Icon ms-Icon--chevronsDown";
        };
        MessageBanner.prototype._toggleExpansion = function () {
            if (this._errorBanner.className.indexOf("is-expanded") > -1) {
                this._collapse();
            }
            else {
                this._expand();
            }
        };
        MessageBanner.prototype._hideMessageBanner = function () {
            this._errorBanner.className = "ms-MessageBanner is-hidden";
        };
        /**
         * hides banner when close button is clicked
         */
        MessageBanner.prototype._hideBanner = function () {
            if (this._errorBanner.className.indexOf("hide") === -1) {
                this._errorBanner.className += " hide";
                setTimeout(this._hideMessageBanner.bind(this), 500);
            }
        };
        /**
         * sets handlers for resize and button click events
         */
        MessageBanner.prototype._setListeners = function () {
            window.addEventListener("resize", this._onResize.bind(this), false);
            this._chevronButton.addEventListener("click", this._toggleExpansion.bind(this), false);
            this._closeButton.addEventListener("click", this._hideBanner.bind(this), false);
        };
        return MessageBanner;
    }());
    fabric.MessageBanner = MessageBanner;
})(fabric || (fabric = {})); // end fabric namespace

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../Overlay/Overlay.ts"/>
/// <reference path="../ContextualHost/ContextualHost.ts"/>
var fabric;
(function (fabric) {
    /**
     * People Picker
     *
     * People picker control
     *
     */
    var CONTEXT_CLASS = ".ms-ContextualHost";
    var MODAL_POSITION = "bottom";
    var PeoplePicker = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of People Picker
         * @constructor
         */
        function PeoplePicker(container) {
            this._container = container;
            this._assignClicks();
            this._contextualHost = this._container.querySelector(CONTEXT_CLASS);
        }
        PeoplePicker.prototype._createModalHost = function () {
            this._contextualHostView = new fabric.ContextualHost(this._contextualHost, MODAL_POSITION, this._container, true);
        };
        PeoplePicker.prototype._clickHandler = function (e) {
            this._createModalHost();
        };
        PeoplePicker.prototype._assignClicks = function () {
            this._container.addEventListener("click", this._clickHandler.bind(this), true);
        };
        return PeoplePicker;
    }());
    fabric.PeoplePicker = PeoplePicker;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
var fabric;
(function (fabric) {
    /**
     * Pivot Plugin
     *
     * Adds basic demonstration functionality to .ms-Pivot components.
     *
     */
    var Pivot = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of Pivot
         * @constructor
         */
        function Pivot(container) {
            this._container = container;
            this._addListeners();
            // Show the first pivot's content
            var firstContent = this._container.querySelector(".ms-Pivot-content");
            firstContent.style.display = "block";
        }
        Pivot.prototype.removeListeners = function () {
            this._container.removeEventListener("click", this._selectTab.bind(this));
        };
        Pivot.prototype._addListeners = function () {
            var _this = this;
            this._container.addEventListener("click", this._selectTabMouse.bind(this), false);
            this._container.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    _this._selectTabKeyboard(event);
                }
            }, true);
        };
        Pivot.prototype._selectTab = function (selectedTab) {
            // Only if its a pivot link and if it doesn't have ellipsis
            if (selectedTab.classList.contains("ms-Pivot-link") && !selectedTab.querySelector(".ms-Pivot-ellipsis")) {
                // Iterate over siblings and un-select them
                var sibling = selectedTab.parentElement.firstElementChild;
                while (sibling) {
                    sibling.classList.remove("is-selected");
                    sibling = sibling.nextElementSibling;
                }
                // Select the clicked tab
                selectedTab.classList.add("is-selected");
                // Hide all of the content
                var containers = this._container.querySelectorAll(".ms-Pivot-content");
                Array.prototype.forEach.call(containers, function (el, i) {
                    el.style.display = "none";
                });
                // Show the content that corresponds to the selected tab
                var selectedContentName = selectedTab.getAttribute("data-content");
                var selectedContent = this._container.querySelector(".ms-Pivot-content[data-content='" + selectedContentName + "']");
                selectedContent.style.display = "block";
            }
        };
        Pivot.prototype._selectTabMouse = function (event) {
            event.preventDefault();
            var selectedTab = event.target;
            this._selectTab(selectedTab);
        };
        Pivot.prototype._selectTabKeyboard = function (event) {
            event.preventDefault();
            var selectedTab = event.target;
            this._selectTab(selectedTab);
        };
        return Pivot;
    }());
    fabric.Pivot = Pivot;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    "use strict";
    /**
     * ProgressIndicator component
     *
     * A component for outputting determinate progress
     *
     */
    var ProgressIndicator = (function () {
        /**
         *
         * @param {HTMLDivElement} container - the target container for an instance of ProgressIndicator
         * @constructor
         */
        function ProgressIndicator(container) {
            this.container = container;
            this.cacheDOM();
        }
        /**
         * Sets the progress percentage for a determinate
         * operation. Either use this or setProgress
         * and setTotal as setProgressPercent assumes
         * you've done a percentage calculation before
         * injecting it into the function
         * @param {number} percent - a floating point number from 0 to 1
         */
        ProgressIndicator.prototype.setProgressPercent = function (percent) {
            this._progressBar.style.width = Math.round(this._width * percent) + "px";
        };
        /**
         * Sets the progress for a determinate operation.
         * Use this in combination with setTotal.
         * @param {number} progress
         */
        ProgressIndicator.prototype.setProgress = function (progress) {
            this._progress = progress;
            var percentage = this._progress / this._total;
            this.setProgressPercent(percentage);
        };
        /**
         * Sets the total file size, etc. for a
         * determinate operation. Use this in
         * combination with setProgress
         * @param {number} total
         */
        ProgressIndicator.prototype.setTotal = function (total) {
            this._total = total;
        };
        /**
         * Sets the text for the title or label
         * of an instance
         * @param {string} name
         */
        ProgressIndicator.prototype.setName = function (name) {
            this._itemName.innerHTML = name;
        };
        /**
         * Sets the text for a description
         * of an instance
         * @param {string} name
         */
        ProgressIndicator.prototype.setDescription = function (description) {
            this._itemDescription.innerHTML = description;
        };
        /**
         * caches elements and values of the component
         *
         */
        ProgressIndicator.prototype.cacheDOM = function () {
            // an itemName element is optional
            this._itemName = this.container.querySelector(".ms-ProgressIndicator-itemName") || null;
            // an itemDescription element is optional
            this._itemDescription = this.container.querySelector(".ms-ProgressIndicator-itemDescription") || null;
            this._progressBar = this.container.querySelector(".ms-ProgressIndicator-progressBar");
            var itemProgress = this.container.querySelector(".ms-ProgressIndicator-itemProgress");
            this._width = itemProgress.offsetWidth;
        };
        return ProgressIndicator;
    }());
    fabric.ProgressIndicator = ProgressIndicator;
})(fabric || (fabric = {})); // end fabric namespace

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    var CircleObject = (function () {
        function CircleObject(element, j) {
            this.element = element;
            this.j = j;
        }
        return CircleObject;
    }());
    /**
     * Spinner Component
     *
     * An animating activity indicator.
     *
     */
    var Spinner = (function () {
        /**
         * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
         */
        function Spinner(container) {
            this.eightSize = 0.2;
            this.animationSpeed = 90;
            this.parentSize = 20;
            this.fadeIncrement = 0;
            this.circleObjects = [];
            this._target = container;
            this._init();
        }
        /**
         * @function start - starts or restarts the animation sequence
         * @memberOf fabric.Spinner
         */
        Spinner.prototype.start = function () {
            var _this = this;
            this.stop();
            this.interval = setInterval(function () {
                var i = _this.circleObjects.length;
                while (i--) {
                    _this._fade(_this.circleObjects[i]);
                }
            }, this.animationSpeed);
        };
        /**
         * @function stop - stops the animation sequence
         * @memberOf fabric.Spinner
         */
        Spinner.prototype.stop = function () {
            clearInterval(this.interval);
        };
        // private methods
        Spinner.prototype._init = function () {
            this._setTargetElement();
            this._setPropertiesForSize();
            this._createCirclesAndArrange();
            this._initializeOpacities();
            this.start();
        };
        Spinner.prototype._setPropertiesForSize = function () {
            if (this.spinner.className.indexOf("large") > -1) {
                this.parentSize = 28;
                this.eightSize = 0.179;
            }
            this.offsetSize = this.eightSize;
            this.numCircles = 8;
        };
        Spinner.prototype._setTargetElement = function () {
            // for backwards compatibility
            if (this._target.className.indexOf("ms-Spinner") === -1) {
                this.spinner = document.createElement("div");
                this.spinner.className = "ms-Spinner";
                this._target.appendChild(this.spinner);
            }
            else {
                this.spinner = this._target;
            }
        };
        Spinner.prototype._initializeOpacities = function () {
            var i = 0;
            var j = 1;
            var opacity;
            this.fadeIncrement = 1 / this.numCircles;
            for (i; i < this.numCircles; i++) {
                var circleObject = this.circleObjects[i];
                opacity = (this.fadeIncrement * j++);
                this._setOpacity(circleObject.element, opacity);
            }
        };
        Spinner.prototype._fade = function (circleObject) {
            var opacity = this._getOpacity(circleObject.element) - this.fadeIncrement;
            if (opacity <= 0) {
                opacity = 1;
            }
            this._setOpacity(circleObject.element, opacity);
        };
        Spinner.prototype._getOpacity = function (element) {
            return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
        };
        Spinner.prototype._setOpacity = function (element, opacity) {
            element.style.opacity = opacity.toString();
        };
        Spinner.prototype._createCircle = function () {
            var circle = document.createElement("div");
            circle.className = "ms-Spinner-circle";
            circle.style.width = circle.style.height = this.parentSize * this.offsetSize + "px";
            return circle;
        };
        Spinner.prototype._createCirclesAndArrange = function () {
            var angle = 0;
            var offset = this.parentSize * this.offsetSize;
            var step = (2 * Math.PI) / this.numCircles;
            var i = this.numCircles;
            var circleObject;
            var radius = (this.parentSize - offset) * 0.5;
            while (i--) {
                var circle = this._createCircle();
                var x = Math.round(this.parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
                var y = Math.round(this.parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
                this.spinner.appendChild(circle);
                circle.style.left = x + "px";
                circle.style.top = y + "px";
                angle += step;
                circleObject = new CircleObject(circle, i);
                this.circleObjects.push(circleObject);
            }
        };
        return Spinner;
    }());
    fabric.Spinner = Spinner;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
var fabric;
(function (fabric) {
    var TextFieldConsts;
    (function (TextFieldConsts) {
        (function (Type) {
            Type[Type["Placeholder"] = 0] = "Placeholder";
            Type[Type["Underlined"] = 1] = "Underlined";
        })(TextFieldConsts.Type || (TextFieldConsts.Type = {}));
        var Type = TextFieldConsts.Type;
    })(TextFieldConsts || (TextFieldConsts = {}));
    /**
     * Text Field Plugin
     *
     * Adds basic demonstration functionality to .ms-TextField components.
     */
    var TextField = (function () {
        /**
         *
         * @param {HTMLDivElement} container - the target container for an instance of TextField
         * @constructor
         */
        function TextField(container) {
            this._container = container;
            this._type = [];
            this._textField = this._container.querySelector(".ms-TextField-field");
            this._textFieldLabel = this._container.querySelector(".ms-Label");
            this._setTextFieldType();
            this._addListeners();
        }
        /** Populate _type with various kinds of text fields */
        TextField.prototype._setTextFieldType = function () {
            if (this._container.classList.contains("ms-TextField--placeholder")) {
                this._type.push(TextFieldConsts.Type.Placeholder);
            }
            if (this._container.classList.contains("ms-TextField--underlined")) {
                this._type.push(TextFieldConsts.Type.Underlined);
            }
        };
        /** Add event listeners according to the type(s) of text field */
        TextField.prototype._addListeners = function () {
            var _this = this;
            /** Placeholder - hide/unhide the placeholder  */
            if (this._type.indexOf(TextFieldConsts.Type.Placeholder) >= 0) {
                this._textField.addEventListener("click", function (event) {
                    _this._textFieldLabel.style.display = "none";
                });
                this._textField.addEventListener("blur", function (event) {
                    // Hide only if no value in the text field
                    if (_this._textField.value.length === 0) {
                        _this._textFieldLabel.style.display = "block";
                    }
                });
            }
            /** Underlined - adding/removing a focus class  */
            if (this._type.indexOf(TextFieldConsts.Type.Underlined) >= 0) {
                this._textField.addEventListener("focus", function (event) {
                    _this._container.classList.add("is-active");
                });
                this._textField.addEventListener("blur", function (event) {
                    _this._container.classList.remove("is-active");
                });
            }
        };
        return TextField;
    }());
    fabric.TextField = TextField;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/**
 * @namespace fabric
 */
var fabric;
(function (fabric) {
    "use strict";
    var Table = (function () {
        function Table(container) {
            this.container = container;
            // Is the table selectable?
            if (this.container.className.indexOf("ms-Table--selectable") !== -1) {
                this._addListeners();
            }
        }
        /**
         * Add event listeners
         */
        Table.prototype._addListeners = function () {
            this.container.addEventListener("click", this._toggleRowSelection.bind(this), false);
        };
        /**
         * Select or deselect a row
         */
        Table.prototype._toggleRowSelection = function (event) {
            var selectedRow = event.target.parentElement;
            var selectedStateClass = "is-selected";
            // Toggle the selected state class
            if (selectedRow.className === selectedStateClass) {
                selectedRow.className = "";
            }
            else {
                selectedRow.className = selectedStateClass;
            }
        };
        return Table;
    }());
    fabric.Table = Table;
})(fabric || (fabric = {}));

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
"use strict";
var fabric;
(function (fabric) {
    /**
     * Toggle Plugin
     *
     * Adds basic demonstration functionality to .ms-Toggle components.
     *
     */
    var Toggle = (function () {
        /**
         *
         * @param {HTMLElement} container - the target container for an instance of Toggle
         * @constructor
         */
        function Toggle(container) {
            this._container = container;
            this._toggleField = this._container.querySelector(".ms-Toggle-field");
            this._addListeners();
        }
        Toggle.prototype.removeListeners = function () {
            this._toggleField.removeEventListener("click", this._toggleHandler.bind(this));
        };
        Toggle.prototype._addListeners = function () {
            var _this = this;
            this._toggleField.addEventListener("click", this._toggleHandler.bind(this), false);
            this._toggleField.addEventListener("keyup", function (e) { return (e.keyCode === 32) ? _this._toggleHandler() : null; }, false);
        };
        Toggle.prototype._toggleHandler = function () {
            this._toggleField.classList.toggle("is-selected");
        };
        return Toggle;
    }());
    fabric.Toggle = Toggle;
})(fabric || (fabric = {}));
