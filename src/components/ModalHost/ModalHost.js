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
  var MODAL_STATE_POSITIONED = "is-positioned";
  
  var _modalHost;
  var _modalisible;
  var _curX = 0;
  var _curY = 0;
  var _modalClone;
  var _modalWidth;
  var _modalHeight;
  var _teWidth;
  
  function disposeModal() {
    _modalClone.parentNode.removeChild(_modalClone);
  }
  
  function _openModal() {
    _copyModalToBody();
    _saveModalSize();
    _findAvailablePosition();
    _showModal();
    
    // Delay the click setting
    setTimeout( function() { _setDismissClick(); }, 100);
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
        _setPosition(_posOk);
        break;
      case "right":
        _posOk = _positionOk(
          _tryPosModalRight,
          _tryPosModalLeft,
          _tryPosModalBottom,
          _tryPosModalTop
        );
        _setPosition(_posOk);
        break;
      case "top":
        _posOk = _positionOk(
          _tryPosModalTop,
          _tryPosModalBottom
        );
        _setPosition(_posOk);
       break;
      case "bottom":
        _posOk = _positionOk(
          _tryPosModalBottom,
          _tryPosModalTop
        );
        _setPosition(_posOk);
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
    if(!_posOk) {
      _posOk = pos2();
      if(!_posOk && pos3) {
        _posOk = pos3();
        if(!_posOk && pos4) {
          _posOk = pos4(); 
        }
      }
    }
    return _posOk;
  }
  
  function _calcLeft(mWidth, teWidth, teLeft) {
    var mHalfWidth = mWidth / 2;
    var teHalf = teWidth / 2;
    var mHLeft = (teLeft + teHalf) - mHalfWidth;
    mHLeft = (mHLeft < mHalfWidth) ? teLeft : mHLeft;
    return mHLeft;
  }
  
  function _calcTop(mHeight, teHeight, teTop) {
    var mHalfWidth = mHeight / 2;
    var teHalf = teHeight / 2;
    var mHLeft = (teTop + teHalf) - mHalfWidth;
    mHLeft = (mHLeft < mHalfWidth) ? teTop : mHLeft;
    return mHLeft;
  }
  
  function _setPosition(curDirection) {
    var teBR = targetElement.getBoundingClientRect();
    var teLeft = teBR.left;
    var teRight = teBR.right;
    var teTop = teBR.top;
    var teBottom = teBR.bottom;
    var teHeight = teBR.height;
    
    var mHLeft;
    var mHTop;
    var mHalfWidth;
    
     switch (curDirection) {
      case "left":
        mHLeft = teLeft - _modalWidth;
        mHTop = _calcTop(_modalHeight, teHeight, teTop);
        _modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;");
        _modalClone.classList.add(MODAL_STATE_POSITIONED);
      break;
      case "right":
        mHTop = _calcTop(_modalHeight, teHeight, teTop);
        mHLeft = teRight;
        _modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;");
        _modalClone.classList.add(MODAL_STATE_POSITIONED);
      break;
      case "top":
        mHLeft = _calcLeft(_modalWidth, _teWidth, teLeft);
        mHTop = teTop - _modalHeight;
        _modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;");
        _modalClone.classList.add(MODAL_STATE_POSITIONED);
      break;
      case "bottom":
        mHLeft = mHLeft = _calcLeft(_modalWidth, _teWidth, teLeft);
        mHTop = teTop + teHeight;
        _modalClone.setAttribute("style", "top: " + mHTop + "px; left: " + mHLeft + "px;");
        _modalClone.classList.add(MODAL_STATE_POSITIONED);
      break;
      default:
        _modalClone.setAttribute("style", "top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);");
     }
  }
  
  // Menu positioning
  function _tryPosModalLeft() {

    var teLeft = targetElement.getBoundingClientRect().left;
    
    if(teLeft < _modalWidth) {
      return false;
    } else {
      return "left";
    }
  }
  
  // Menu positioning
  function _tryPosModalRight() {
    
    var teRight = targetElement.getBoundingClientRect().right;
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    if((w - teRight) < _modalWidth) {
     return false;
    } else {
     return "right";
    }
  }
  
  // Menu positioning
  function _tryPosModalBottom() {
    
    var teBottom = targetElement.getBoundingClientRect().bottom;
    
    if(teBottom < _modalHeight) {
      return true;
    } else {
      return "bottom";
    }
  }
  
  // Menu positioning
  function _tryPosModalTop() {
    
    var teTop = targetElement.getBoundingClientRect().top;
    
    if(teTop < _modalHeight) {
      return false;
    } else {
      return "top";
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
    _modalClone.setAttribute("style", "opacity: 0; z-index: -1");
    _modalClone.classList.add(MODAL_STATE_POSITIONED);
    _modalClone.classList.add(CONTEXT_STATE_CLASS);
    _modalWidth = _modalClone.getBoundingClientRect().width + (parseInt(_modalStyles.marginLeft) + parseInt(_modalStyles.marginRight));
    _modalHeight = _modalClone.getBoundingClientRect().height + (parseInt(_modalStyles.marginTop) + parseInt(_modalStyles.marginBottom));
    _modalClone.setAttribute("style", "");
    _modalClone.classList.remove(MODAL_STATE_POSITIONED);
    _modalClone.classList.remove(CONTEXT_STATE_CLASS);
    _teWidth = targetElement.getBoundingClientRect().width;
    _teHeight = targetElement.getBoundingClientRect().height;
  }
  
  function _disMissAction(e) {
    // If the elemenet clicked is not INSIDE of searchbox then close seach
    if(!_modalClone.contains(e.target) && e.target !== _modalClone) {
      document.removeEventListener("click", _disMissAction, false);
      disposeModal();
    }
  }
  
  function _setDismissClick() {
    document.addEventListener('click', _disMissAction, false);
  }
  
  function _init() {
   _saveDOMRefs(context);
   _cloneModal();
   _openModal();
  }
  
  _init();

  return {
    disposeModal: disposeModal
  };

};