// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * ModalHost
 *
 * Hosts contextual menus and callouts
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

fabric.ModalHost = function(context, direction, targetElement) {
  
  var CONTEXT_STATE_CLASS = "is-open";
  
  var _modalHost;
  var _modalisible;
  var _curX = 0;
  var _curY = 0;
  var _modalClone;
  var _modalWidth;
  var _modalHeight;
  var _teWidth;
  
  function disposeModal() {
    _cloneModal.parentNode.removeChild(_cloneModal);
  }
  
  function _openModal() {
    _copyModalToBody();
    _findAvailablePosition();
    _showModal();
  }
  
  function _findAvailablePosition() {
    var _posOk;
    
    switch (direction) {
      case "left":
        //Try the right side
        _posOk = _positionOk(
          _tryPosModalLeft,
          _tryPosModalRight,
          _tryPosModalBottom,
          _tryPosModalTop
        );
        _setPosition("left");
        break;
      case "right":
        _posOk = _positionOk(
          _tryPosModalRight,
          _tryPosModalLeft,
          _tryPosModalBottom,
          _tryPosModalTop
        );
        _setPosition("right");
        break;
      case "top":
        _posOk = _positionOk(
          _tryPosModalTop,
          _tryPosModalBottom
        );
        _setPosition("top");
       break;
      case "bottom":
        _posOk = _positionOk(
          _tryPosModalBottom,
          _tryPosModalTop
        );
        _setPosition("bottom");
       break;
      default:
       _setPosition();
    }
  }
  
  function _showModal() {
    _modalClone.classList.add(CONTEXT_STATE_CLASS);
  }
  
  function _hideModal() {
    _modalClone.classList.remove(CONTEXT_STATE_CLASS);
  }
  
  function _toggleModal() {
    
    if(_modalClone.classList.contains(CONTEXT_STATE_CLASS)) {
      _hideModal();
    } else {
      _showModal();
    }
  }
  
  function _positionOk(pos1, pos2, pos3, pos4) {
    var _posOk;
    _posOk = pos1();
    if(!_positionOk) {
      _positionOk = _pos2();
      if(!_positionOk && pos3) {
        _positionOk = _pos3();
        if(!_positionOk && pos4) {
          _positionOk = pos4();
        }
      }
    }
    return _posOk;
  }
  
  function _setPosition() {
    var teLeft = targetElement.getBoundingClientRect().left;
    var teRight = targetElement.getBoundingClientRect().right;
    var teTop = targetElement.getBoundingClientRect().top;
    var teBottom = targetElement.getBoundingClientRect.bottom;
    
    var leftTopPos;
    var leftLeftPos;
    var rightTopPos;
    var rightLeftPos;
    var topLeftPos;
    var topTopPos;
    var bottomTopPos;
    var bottomLeftPos;
    
     switch (direction) {
      case "left":
        leftLeftPos = teLeft - _modalWidth;
        leftTopPos = teTop + (_teHeight / 2);
        _modalClone.setAttribute("style", "top: " + leftTopPos + "px; left: " + leftLeftPos);
      break;
      case "right":
        rightTopPos = teTop + (_teHeight / 2);
        rightLeftPos = teLeft + _modalWidth;
        _modalClone.setAttribute("style", "top: " + rightLeftPos + "px; left: " + rightTopPos);
      break;
      case "top":
        topLeftPos = teLeft + (_teWidth / 2);
        topTopPos = teTop - _modalHeight;
        _modalClone.setAttribute("style", "top: " + topLeftPos + "px; left: " + topLeftPos);
      break;
      case "bottom":
        bottomLeftPos = teLeft + (_teWidth / 2);
        bottomTopPos = teTop - _modalHeight;
        _modalClone.setAttribute("style", "top: " + bottomLeftPos + "px; left: " + bottomLeftPos);
      break;
      default:
        _modalClone.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); position: absolute;");
     }
  }
  
  // Menu positioning
  function _checkPositionLeft() {

    var teLeft = targetElement.getBoundingClientRect().left;
    
    if(teLeft < _modalWidth) {
      return false;
    } else {
      return true;
    }
  }
  
  // Menu positioning
  function _tryPosModalRight() {
    
    var teRight = targetElement.getBoundingClientRect().right;
    
    if(teRight < _modalWidth) {
     return false;
    } else {
     return true;
    }
  }
  
  // Menu positioning
  function _tryPosModalBottom() {
    
    var teBottom = targetElement.getBoundingClientRect().bottom;
    
    if(teBottom < _modalHeight) {
      return true;
    } else {
      return false;
    }
  }
  
  // Menu positioning
  function _tryPosModalTop() {
    
    var teTop = targetElement.getBoundingClientRect().top;
    
    if(teTop < _modalHeight) {
      return false;
    } else {
      return true;
    }
  }
  
  function _copyModalToBody() {
    document.body.appendChild(_modalClone);
  }
  
  function _cloneModal() {
    _modalClone = _modalHost.cloneNode(true);
  }
  
  function _saveDOMRefs(context) {
    _modalHost = context;
  }
  
  function _saveModalSize() {
    var _modalStyles = window.getComputedStyle(_modalClone);
    _modalClone.setAttribute("style", "opacity: 0; display: block; z-index: -1");
    _modalWidth = _modalClone.getBoundingClientRect().width + _modalStyles.marginLeft + _modalStyles.marginRight;
    _modalHeight = _modalClone.getBoundingClientRect().height + _modalStyles.marginTop + _modalStyles.marginBottom;
    _modalClone.setAttribute("style", "");
    _teWidth = targetElement.getBoundingClientRect().width;
    _teHeight = targetElement.getBoundingClientRect().height;
  }
  
  function _disMissAction(e) {
    // If the elemenet clicked is not INSIDE of searchbox then close seach
    if(!_cloneModal.contains(e.target) && e.target !== _cloneModal) {
      document.removeEventListener("click", _handleOutsideSearchClick, false);
      disposeModal();
    }
  }
  
  function _setDismissClick() {
    document.addEventListener('click', _disMissAction, false);
  }
  
  function _init() {
   _saveDOMRefs(context);
   _cloneModal();
   _saveModalSize();
   _openModal();
  }
  
  _init();

  return {
    disposeModal: disposeModal
  };

};