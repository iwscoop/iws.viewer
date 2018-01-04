/**
 * Created by ojb74 on 2017-04-04.
 */
'use strict';
var iws = iws || {version:"1.0.0"};

iws.lib     = {};
iws.plugin  = {};
iws.plugin.handler = {};

/***********************************************************************************************************************
 *                                                                                                         iws.lib.class
 * @type {{add, remove, list}}
 */
iws.lib.class = (function(){
  'use strict';

  function oldAdd(element, className) {
    var classes = element.className.split(' ');
    if (classes.indexOf(className) < 0) {
      classes.push(className);
    }
    element.className = classes.join(' ');
  }

  function oldRemove(element, className) {
    var classes = element.className.split(' ');
    var idx = classes.indexOf(className);
    if (idx >= 0) {
      classes.splice(idx, 1);
    }
    element.className = classes.join(' ');
  }

  return {
    add : function (element, className) {
      if (element.classList) {
        element.classList.add(className);
      } else {
        oldAdd(element, className);
      }
    },

    remove : function (element, className) {
      if (element.classList) {
        element.classList.remove(className);
      } else {
        oldRemove(element, className);
      }
    },

    list : function (element) {
      if (element.classList) {
        return Array.prototype.slice.apply(element.classList);
      } else {
        return element.className.split(' ');
      }
    }
  };

})();

/***********************************************************************************************************************
 *                                                                                                           iws.lib.DOM
 */
iws.lib.DOM = (function(){

  'use strict';

  var DOM = {};

  DOM.e = function (tagName, className) {
    var element = document.createElement(tagName);
    element.className = className;
    return element;
  };

  DOM.appendTo = function (child, parent) {
    parent.appendChild(child);
    return child;
  };

  function cssGet(element, styleName) {
    return window.getComputedStyle(element)[styleName];
  }

  function cssSet(element, styleName, styleValue) {
    if (typeof styleValue === 'number') {
      styleValue = styleValue.toString() + 'px';
    }
    element.style[styleName] = styleValue;
    return element;
  }

  function cssMultiSet(element, obj) {
    for (var key in obj) {
      var val = obj[key];
      if (typeof val === 'number') {
        val = val.toString() + 'px';
      }
      element.style[key] = val;
    }
    return element;
  }

  DOM.css = function (element, styleNameOrObject, styleValue) {
    if (typeof styleNameOrObject === 'object') {
      // multiple set with object
      return cssMultiSet(element, styleNameOrObject);
    } else {
      if (typeof styleValue === 'undefined') {
        return cssGet(element, styleNameOrObject);
      } else {
        return cssSet(element, styleNameOrObject, styleValue);
      }
    }
  };

  DOM.matches = function (element, query) {
    if (typeof element.matches !== 'undefined') {
      return element.matches(query);
    } else {
      if (typeof element.matchesSelector !== 'undefined') {
        return element.matchesSelector(query);
      } else if (typeof element.webkitMatchesSelector !== 'undefined') {
        return element.webkitMatchesSelector(query);
      } else if (typeof element.mozMatchesSelector !== 'undefined') {
        return element.mozMatchesSelector(query);
      } else if (typeof element.msMatchesSelector !== 'undefined') {
        return element.msMatchesSelector(query);
      }
    }
  };

  DOM.remove = function (element) {
    if (typeof element.remove !== 'undefined') {
      element.remove();
    } else {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  };

  DOM.queryChildren = function (element, selector) {
    return Array.prototype.filter.call(element.childNodes, function (child) {
      return DOM.matches(child, selector);
    });
  };

  return DOM;
})();

/***********************************************************************************************************************
 *                                                                                                  iws.lib.EventManager
 */
iws.lib.EventManager = (function(){

  'use strict';

  var EventElement = function (element) {
    this.element = element;
    this.events = {};
  };

  EventElement.prototype.bind = function (eventName, handler) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
    this.element.addEventListener(eventName, handler, false);
  };

  EventElement.prototype.unbind = function (eventName, handler) {
    var isHandlerProvided = (typeof handler !== 'undefined');
    this.events[eventName] = this.events[eventName].filter(function (hdlr) {
      if (isHandlerProvided && hdlr !== handler) {
        return true;
      }
      this.element.removeEventListener(eventName, hdlr, false);
      return false;
    }, this);
  };

  EventElement.prototype.unbindAll = function () {
    for (var name in this.events) {
      this.unbind(name);
    }
  };

  var EventManager = function () {
    this.eventElements = [];
  };

  EventManager.prototype.eventElement = function (element) {
    var ee = this.eventElements.filter(function (eventElement) {
      return eventElement.element === element;
    })[0];
    if (typeof ee === 'undefined') {
      ee = new EventElement(element);
      this.eventElements.push(ee);
    }
    return ee;
  };

  EventManager.prototype.bind = function (element, eventName, handler) {
    this.eventElement(element).bind(eventName, handler);
  };

  EventManager.prototype.unbind = function (element, eventName, handler) {
    this.eventElement(element).unbind(eventName, handler);
  };

  EventManager.prototype.unbindAll = function () {
    for (var i = 0; i < this.eventElements.length; i++) {
      this.eventElements[i].unbindAll();
    }
  };

  EventManager.prototype.once = function (element, eventName, handler) {
    var ee = this.eventElement(element);
    var onceHandler = function (e) {
      ee.unbind(eventName, onceHandler);
      handler(e);
    };
    ee.bind(eventName, onceHandler);
  };

  return EventManager;
})();

/***********************************************************************************************************************
 *                                                                                                          iws.lib.guid
 */
iws.lib.guid = (function () {
  'use strict';

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };
})();


/***********************************************************************************************************************
 *                                                                                                        iws.lib.helper
 */
iws.lib.helper = (function(){
  'use strict';

  var cls = iws.lib.class;    //require('./class');
  var dom = iws.lib.DOM;    //require('./dom');

  var helper = {};

  var toInt = helper.toInt = function (x) {
    return parseInt(x, 10) || 0;
  };

  var clone = helper.clone = function (obj) {
    if (obj === null) {
      return null;
    } else if (obj.constructor === Array) {
      return obj.map(clone);
    } else if (typeof obj === 'object') {
      var result = {};
      for (var key in obj) {
        result[key] = clone(obj[key]);
      }
      return result;
    } else {
      return obj;
    }
  };

  helper.extend = function (original, source) {
    var result = clone(original);
    for (var key in source) {
      result[key] = clone(source[key]);
    }
    return result;
  };

  helper.isEditable = function (el) {
    return dom.matches(el, "input,[contenteditable]") ||
      dom.matches(el, "select,[contenteditable]") ||
      dom.matches(el, "textarea,[contenteditable]") ||
      dom.matches(el, "button,[contenteditable]");
  };

  helper.removePsClasses = function (element) {
    var clsList = cls.list(element);
    for (var i = 0; i < clsList.length; i++) {
      var className = clsList[i];
      if (className.indexOf('ps-') === 0) {
        cls.remove(element, className);
      }
    }
  };

  helper.outerWidth = function (element) {
    return toInt(dom.css(element, 'width')) +
      toInt(dom.css(element, 'paddingLeft')) +
      toInt(dom.css(element, 'paddingRight')) +
      toInt(dom.css(element, 'borderLeftWidth')) +
      toInt(dom.css(element, 'borderRightWidth'));
  };

  helper.startScrolling = function (element, axis) {
    cls.add(element, 'ps-in-scrolling');
    if (typeof axis !== 'undefined') {
      cls.add(element, 'ps-' + axis);
    } else {
      cls.add(element, 'ps-x');
      cls.add(element, 'ps-y');
    }
  };

  helper.stopScrolling = function (element, axis) {
    cls.remove(element, 'ps-in-scrolling');
    if (typeof axis !== 'undefined') {
      cls.remove(element, 'ps-' + axis);
    } else {
      cls.remove(element, 'ps-x');
      cls.remove(element, 'ps-y');
    }
  };

  helper.env = {
    isWebKit: 'WebkitAppearance' in document.documentElement.style,
    supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
    supportsIePointer: window.navigator.msMaxTouchPoints !== null
  };

  return helper;
})();



/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-04.
 *                                                                                             iws.plugin.defaultSetting
 */
iws.plugin.defaultSetting = (function(){
  'use strict';

  var defaultSetting = {
    customInfo : null,  //이건 페이지 뷰어에 대한 특별한 처리때 사용됨.
    handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    stopPropagationOnClick: true,
    suppressScrollX: false,
    suppressScrollY: false,
    swipePropagation: true,
    useBothWheelAxes: false,
    wheelPropagation: false,
    wheelSpeed: 1,
    theme: 'default'
  };

  return defaultSetting;
})();


/***********************************************************************************************************************
 *                                                                                                  iws.plugin.instances
 * @type {{add, remove, get}}
 */
iws.plugin.instances = (function(){
  'use strict';

  var _             = iws.lib.helper;   //require('../lib/helper');
  var cls           = iws.lib.class;    //require('../lib/class');
  var defaultSettings = iws.plugin.defaultSetting;//require('./default-setting');
  var dom           = iws.lib.DOM;    //require('../lib/dom');
  var EventManager = iws.lib.EventManager;  //require('../lib/event-manager');
  var guid          = iws.lib.guid;   //require('../lib/guid');

  var instances = {};

  function Instance(element) {
    var i = this;

    i.settings = _.clone(defaultSettings);
    i.containerWidth = null;
    i.containerHeight = null;
    i.contentWidth = null;  //scrollWidth
    i.contentHeight = null; //scrollHeight

    i.contentLeft = null;  //scrollLeft
    i.contentTop = null; //scrollTop


    i.isRtl = dom.css(element, 'direction') === "rtl";
    i.isNegativeScroll = (function () {
      var originalScrollLeft = element.scrollLeft;
      var result = null;
      element.scrollLeft = -1;
      result = element.scrollLeft < 0;
      element.scrollLeft = originalScrollLeft;
      return result;
    })();
    i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
    i.event = new EventManager();
    i.ownerDocument = element.ownerDocument || document;

    function focus() {
      cls.add(element, 'ps-focus');
    }

    function blur() {
      cls.remove(element, 'ps-focus');
    }

    i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
    i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
    i.scrollbarX.setAttribute('tabindex', 0);
    i.event.bind(i.scrollbarX, 'focus', focus);
    i.event.bind(i.scrollbarX, 'blur', blur);
    i.scrollbarXActive = null;
    i.scrollbarXWidth = null;
    i.scrollbarXLeft = null;
    i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
    i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
    i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
    i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
    // Set rail to display:block to calculate margins
    dom.css(i.scrollbarXRail, 'display', 'block');
    i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
    dom.css(i.scrollbarXRail, 'display', '');
    i.railXWidth = null;
    i.railXRatio = null;

    i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
    i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
    i.scrollbarY.setAttribute('tabindex', 0);
    i.event.bind(i.scrollbarY, 'focus', focus);
    i.event.bind(i.scrollbarY, 'blur', blur);
    i.scrollbarYActive = null;
    i.scrollbarYHeight = null;
    i.scrollbarYTop = null;
    i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
    i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
    i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
    i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
    i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
    dom.css(i.scrollbarYRail, 'display', 'block');
    i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
    dom.css(i.scrollbarYRail, 'display', '');
    i.railYHeight = null;
    i.railYRatio = null;
  }

  function getId(element) {
    return element.getAttribute('data-ps-id');
  }

  function setId(element, id) {
    element.setAttribute('data-ps-id', id);
  }

  function removeId(element) {
    element.removeAttribute('data-ps-id');
  }

  return {
    add : function (element) {
      var newId = guid();
      setId(element, newId);
      instances[newId] = new Instance(element);
      return instances[newId];
    },

    remove : function (element) {
      delete instances[getId(element)];
      removeId(element);
    },

    get : function (element) {
      return instances[getId(element)];
    }
  }
})();


/***********************************************************************************************************************
 *                                                                                               iws.plugin.updateScroll
 */
iws.plugin.updateScroll = (function () {
  'use strict';

  var instances = iws.plugin.instances;//require('./instances');

  var lastTop;
  var lastLeft;

  var createDOMEvent = function (name) {
    var event = document.createEvent("Event");
    event.initEvent(name, true, true);
    return event;
  };

  return function (element, axis, value) {
    if (typeof element === 'undefined') {
      throw 'You must provide an element to the update-scroll function';
    }

    if (typeof axis === 'undefined') {
      throw 'You must provide an axis to the update-scroll function';
    }

    if (typeof value === 'undefined') {
      throw 'You must provide a value to the update-scroll function';
    }

    if (axis === 'top' && value <= 0) {
      element.scrollTop = value = 0; // don't allow negative scroll
      element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
    }

    if (axis === 'left' && value <= 0) {
      element.scrollLeft = value = 0; // don't allow negative scroll
      element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
    }

    var i = instances.get(element);

    if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
      // don't allow scroll past container
      value = i.contentHeight - i.containerHeight;
      if (value - element.scrollTop <= 1) {
        // mitigates rounding errors on non-subpixel scroll values
        value = element.scrollTop;
      } else {
        element.scrollTop = value;
      }
      element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
    }

    if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
      // don't allow scroll past container
      value = i.contentWidth - i.containerWidth;
      if (value - element.scrollLeft <= 1) {
        // mitigates rounding errors on non-subpixel scroll values
        value = element.scrollLeft;
      } else {
        element.scrollLeft = value;
      }
      element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
    }

    if (!lastTop) {
      lastTop = element.scrollTop;
    }

    if (!lastLeft) {
      lastLeft = element.scrollLeft;
    }

    if (axis === 'top' && value < lastTop) {
      element.dispatchEvent(createDOMEvent('ps-scroll-up'));
    }

    if (axis === 'top' && value > lastTop) {
      element.dispatchEvent(createDOMEvent('ps-scroll-down'));
    }

    if (axis === 'left' && value < lastLeft) {
      element.dispatchEvent(createDOMEvent('ps-scroll-left'));
    }

    if (axis === 'left' && value > lastLeft) {
      element.dispatchEvent(createDOMEvent('ps-scroll-right'));
    }

    if (axis === 'top') {
      element.scrollTop = lastTop = value;
      element.dispatchEvent(createDOMEvent('ps-scroll-y'));
    }

    if (axis === 'left') {
      element.scrollLeft = lastLeft = value;
      element.dispatchEvent(createDOMEvent('ps-scroll-x'));
    }

  };

})();



/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-04.
 *                                                                                             iws.plugin.updateGeometry
 */
iws.plugin.updateGeometry = (function () {
  'use strict';

  var _ = iws.lib.helper; //require('../lib/helper');
  var cls = iws.lib.class; //require('../lib/class');
  var dom = iws.lib.DOM;  //require('../lib/dom');
  var instances = iws.plugin.instances; //require('./instances');
  var updateScroll = iws.plugin.updateScroll; //require('./update-scroll');

  function getThumbSize(i, thumbSize) {
    if (i.settings.minScrollbarLength) {
      thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
    }
    if (i.settings.maxScrollbarLength) {
      thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
    }
    return thumbSize;
  }

  function updateCss(element, i) {
    var xRailOffset = {width: i.railXWidth};
    if (i.isRtl) {
      xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
    } else {
      xRailOffset.left = element.scrollLeft;
    }
    if (i.isScrollbarXUsingBottom) {
      xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
    } else {
      xRailOffset.top = i.scrollbarXTop + element.scrollTop;
    }
    dom.css(i.scrollbarXRail, xRailOffset);

    var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
    if (i.isScrollbarYUsingRight) {
      if (i.isRtl) {
        yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
      } else {
        yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
      }
    } else {
      if (i.isRtl) {
        yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
      } else {
        yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
      }
    }
    dom.css(i.scrollbarYRail, yRailOffset);

    dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
    dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
  }

  return function (element) {
    var i = instances.get(element);

    i.containerWidth = element.clientWidth;
    i.containerHeight = element.clientHeight;


    if(i.settings.customInfo == null){
      i.contentWidth = element.scrollWidth;
      i.contentHeight = element.scrollHeight;
      i.contentLeft = element.scrollLeft;
      i.contentTop = element.scrollTop;
    }else{
      var customInfo = i.settings.customInfo.getContentInfo();
      i.contentWidth = customInfo.scrollWidth;
      i.contentHeight = customInfo.scrollHeight;
      i.contentLeft = customInfo.scrollLeft;
      i.contentTop = customInfo.scrollTop;
    }


    var existingRails;
    if (!element.contains(i.scrollbarXRail)) {
      existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
      if (existingRails.length > 0) {
        existingRails.forEach(function (rail) {
          dom.remove(rail);
        });
      }
      dom.appendTo(i.scrollbarXRail, element);
    }
    if (!element.contains(i.scrollbarYRail)) {
      existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
      if (existingRails.length > 0) {
        existingRails.forEach(function (rail) {
          dom.remove(rail);
        });
      }
      dom.appendTo(i.scrollbarYRail, element);
    }

    if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
      i.scrollbarXActive = true;
      i.railXWidth = i.containerWidth - i.railXMarginWidth;
      i.railXRatio = i.containerWidth / i.railXWidth;
      i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
      i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + i.contentLeft/*element.scrollLeft*/) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
    } else {
      i.scrollbarXActive = false;
    }

    if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
      i.scrollbarYActive = true;
      i.railYHeight = i.containerHeight - i.railYMarginHeight;
      i.railYRatio = i.containerHeight / i.railYHeight;
      i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
      i.scrollbarYTop = _.toInt(i.contentTop/*element.scrollTop*/ * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
    } else {
      i.scrollbarYActive = false;
    }

    if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
      i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
    }
    if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
      i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
    }

    updateCss(element, i);

    if (i.scrollbarXActive) {
      cls.add(element, 'ps-active-x');
    } else {
      cls.remove(element, 'ps-active-x');
      i.scrollbarXWidth = 0;
      i.scrollbarXLeft = 0;
      updateScroll(element, 'left', 0);
    }
    if (i.scrollbarYActive) {
      cls.add(element, 'ps-active-y');
    } else {
      cls.remove(element, 'ps-active-y');
      i.scrollbarYHeight = 0;
      i.scrollbarYTop = 0;
      updateScroll(element, 'top', 0);
    }
  };
})();



/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-05.
 *                                                                                          iws.plugin.handler.clickRail
 */
iws.plugin.handler.clickRail = (function(){
  'use strict';

  var _ = iws.lib.helper; //require('../../lib/helper');
  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('../update-geometry');
  var updateScroll = iws.plugin.updateScroll; //('../update-scroll');

  function bindClickRailHandler(element, i) {
    function pageOffset(el) {
      return el.getBoundingClientRect();
    }
    var stopPropagation = function (e) { e.stopPropagation(); };

    if (i.settings.stopPropagationOnClick) {
      i.event.bind(i.scrollbarY, 'click', stopPropagation);
    }
    i.event.bind(i.scrollbarYRail, 'click', function (e) {
      var halfOfScrollbarLength = _.toInt(i.scrollbarYHeight / 2);
      var positionTop = i.railYRatio * (e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top - halfOfScrollbarLength);
      var maxPositionTop = i.railYRatio * (i.railYHeight - i.scrollbarYHeight);
      var positionRatio = positionTop / maxPositionTop;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }


      //이거 뷰어에 셋팅하라고 데이터 넘김.
      if(i.settings.customInfo){
        var value = (i.contentHeight - i.containerHeight) * positionRatio;
        var param = {
          direction:'top',
          value:-value
        };
        i.settings.customInfo.setContentInfo && i.settings.customInfo.setContentInfo(param);
      }else{
        //스크롤바의 위치를 변경.
        updateScroll(element, 'top', (i.contentHeight - i.containerHeight) * positionRatio);
      }

      //위치를 계산하여 스크롤바 그림.
      updateGeometry(element);

      e.stopPropagation();
    });

    if (i.settings.stopPropagationOnClick) {
      i.event.bind(i.scrollbarX, 'click', stopPropagation);
    }
    i.event.bind(i.scrollbarXRail, 'click', function (e) {
      var halfOfScrollbarLength = _.toInt(i.scrollbarXWidth / 2);
      var positionLeft = i.railXRatio * (e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left - halfOfScrollbarLength);
      var maxPositionLeft = i.railXRatio * (i.railXWidth - i.scrollbarXWidth);
      var positionRatio = positionLeft / maxPositionLeft;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      //이거 뷰어에 셋팅하라고 데이터 넘김.
      if(i.settings.customInfo){
        var value = ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment;
        var param = {
          direction:'left',
          value:-value
        };
        i.settings.customInfo.setContentInfo && i.settings.customInfo.setContentInfo(param);
      }else {
        updateScroll(element, 'left', ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment);
      }
      updateGeometry(element);

      e.stopPropagation();
    });
  }

  return function (element) {
    var i = instances.get(element);
    bindClickRailHandler(element, i);
  };
})();


/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-06.
 *                                                                                      iws.plugin.handler.dragScrollbar
 */
iws.plugin.handler.dragScrollbar = (function(){
  'use strict';

  var _ = iws.lib.helper; //require('../../lib/helper');
  var dom = iws.lib.DOM;  //require('../../lib/dom');
  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('../update-geometry');
  var updateScroll = iws.plugin.updateScroll; //require('../update-scroll');

  function bindMouseScrollXHandler(element, i) {
    var currentLeft = null;
    var currentPageX = null;

    function updateScrollLeft(deltaX) {
      var newLeft = currentLeft + (deltaX * i.railXRatio);
      var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

      if (newLeft < 0) {
        i.scrollbarXLeft = 0;
      } else if (newLeft > maxLeft) {
        i.scrollbarXLeft = maxLeft;
      } else {
        i.scrollbarXLeft = newLeft;
      }

      var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;

      //이거 뷰어에 셋팅하라고 데이터 넘김.
      if(i.settings.customInfo){

        var param = {
          direction:'left',
          value:-scrollLeft
        };
        i.settings.customInfo.setContentInfo && i.settings.customInfo.setContentInfo(param);
      }else{
        //스크롤바의 위치를 변경.
        updateScroll(element, 'left', scrollLeft);
      }

    }

    var mouseMoveHandler = function (e) {
      updateScrollLeft(e.pageX - currentPageX);
      updateGeometry(element);
      e.stopPropagation();
      e.preventDefault();
    };

    var mouseUpHandler = function () {
      _.stopScrolling(element, 'x');
      i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    };

    i.event.bind(i.scrollbarX, 'mousedown', function (e) {
      currentPageX = e.pageX;
      currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
      _.startScrolling(element, 'x');

      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

      e.stopPropagation();
      e.preventDefault();
    });
  }

  function bindMouseScrollYHandler(element, i) {
    var currentTop = null;
    var currentPageY = null;

    function updateScrollTop(deltaY) {
      var newTop = currentTop + (deltaY * i.railYRatio);
      var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

      if (newTop < 0) {
        i.scrollbarYTop = 0;
      } else if (newTop > maxTop) {
        i.scrollbarYTop = maxTop;
      } else {
        i.scrollbarYTop = newTop;
      }

      var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
      //이거 뷰어에 셋팅하라고 데이터 넘김.
      if(i.settings.customInfo){

        var param = {
          direction:'top',
          value:-scrollTop
        };
        i.settings.customInfo.setContentInfo && i.settings.customInfo.setContentInfo(param);
      }else{
        //스크롤바의 위치를 변경.
        updateScroll(element, 'top', scrollTop);
      }

    }

    var mouseMoveHandler = function (e) {
      updateScrollTop(e.pageY - currentPageY);
      updateGeometry(element);
      e.stopPropagation();
      e.preventDefault();
    };

    var mouseUpHandler = function () {
      _.stopScrolling(element, 'y');
      i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    };

    i.event.bind(i.scrollbarY, 'mousedown', function (e) {
      currentPageY = e.pageY;
      currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
      _.startScrolling(element, 'y');

      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

      e.stopPropagation();
      e.preventDefault();
    });
  }

  return function (element) {
    var i = instances.get(element);
    bindMouseScrollXHandler(element, i);
    bindMouseScrollYHandler(element, i);
  };
})();


/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-06.
 *                                                                                           iws.plugin.handler.keyboard
 */
iws.plugin.handler.keyboard = (function(){
  'use strict';

  var _ = iws.lib.helper; //require('../../lib/helper');
  var dom = iws.lib.DOM;  //require('../../lib/dom');
  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('../update-geometry');
  var updateScroll = iws.plugin.updateScroll; //require('../update-scroll');

  function bindKeyboardHandler(element, i) {
    var hovered = false;
    i.event.bind(element, 'mouseenter', function () {
      hovered = true;
    });
    i.event.bind(element, 'mouseleave', function () {
      hovered = false;
    });

    var shouldPrevent = false;
    function shouldPreventDefault(deltaX, deltaY) {
      var scrollTop = element.scrollTop;
      if (deltaX === 0) {
        if (!i.scrollbarYActive) {
          return false;
        }
        if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
          return !i.settings.wheelPropagation;
        }
      }

      var scrollLeft = element.scrollLeft;
      if (deltaY === 0) {
        if (!i.scrollbarXActive) {
          return false;
        }
        if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
          return !i.settings.wheelPropagation;
        }
      }
      return true;
    }

    i.event.bind(i.ownerDocument, 'keydown', function (e) {
      if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
        return;
      }

      var focused = dom.matches(i.scrollbarX, ':focus') ||
        dom.matches(i.scrollbarY, ':focus');

      if (!hovered && !focused) {
        return;
      }

      var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
      if (activeElement) {
        if (activeElement.tagName === 'IFRAME') {
          activeElement = activeElement.contentDocument.activeElement;
        } else {
          // go deeper if element is a webcomponent
          while (activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
          }
        }
        if (_.isEditable(activeElement)) {
          return;
        }
      }

      var deltaX = 0;
      var deltaY = 0;

      switch (e.which) {
        case 37: // left
          deltaX = -30;
          break;
        case 38: // up
          deltaY = 30;
          break;
        case 39: // right
          deltaX = 30;
          break;
        case 40: // down
          deltaY = -30;
          break;
        case 33: // page up
          deltaY = 90;
          break;
        case 32: // space bar
          if (e.shiftKey) {
            deltaY = 90;
          } else {
            deltaY = -90;
          }
          break;
        case 34: // page down
          deltaY = -90;
          break;
        case 35: // end
          if (e.ctrlKey) {
            deltaY = -i.contentHeight;
          } else {
            deltaY = -i.containerHeight;
          }
          break;
        case 36: // home
          if (e.ctrlKey) {
            deltaY = element.scrollTop;
          } else {
            deltaY = i.containerHeight;
          }
          break;
        default:
          return;
      }

      updateScroll(element, 'top', element.scrollTop - deltaY);
      updateScroll(element, 'left', element.scrollLeft + deltaX);
      updateGeometry(element);

      shouldPrevent = shouldPreventDefault(deltaX, deltaY);
      if (shouldPrevent) {
        e.preventDefault();
      }
    });
  }

  return function (element) {
    var i = instances.get(element);
    bindKeyboardHandler(element, i);
  };
})();

/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-06.
 *                                                                                         iws.plugin.handler.mouseWheel
 */
iws.plugin.handler.mouseWheel = (function(){
  'use strict';

  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('../update-geometry');
  var updateScroll = iws.plugin.updateScroll; //require('../update-scroll');

  function bindMouseWheelHandler(element, i) {
    var shouldPrevent = false;

    function shouldPreventDefault(deltaX, deltaY) {
      var scrollTop = element.scrollTop;
      if (deltaX === 0) {
        if (!i.scrollbarYActive) {
          return false;
        }
        if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
          return !i.settings.wheelPropagation;
        }
      }

      var scrollLeft = element.scrollLeft;
      if (deltaY === 0) {
        if (!i.scrollbarXActive) {
          return false;
        }
        if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
          return !i.settings.wheelPropagation;
        }
      }
      return true;
    }

    function getDeltaFromEvent(e) {
      var deltaX = e.deltaX;
      var deltaY = -1 * e.deltaY;

      if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
        // OS X Safari
        deltaX = -1 * e.wheelDeltaX / 6;
        deltaY = e.wheelDeltaY / 6;
      }

      if (e.deltaMode && e.deltaMode === 1) {
        // Firefox in deltaMode 1: Line scrolling
        deltaX *= 10;
        deltaY *= 10;
      }

      if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.wheelDelta;
      }

      return [deltaX, deltaY];
    }

    function shouldBeConsumedByChild(deltaX, deltaY) {
      var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
      if (child) {
        if (child.tagName !== 'TEXTAREA' && !window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
          return false;
        }

        var maxScrollTop = child.scrollHeight - child.clientHeight;
        if (maxScrollTop > 0) {
          if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
            return true;
          }
        }
        var maxScrollLeft = child.scrollLeft - child.clientWidth;
        if (maxScrollLeft > 0) {
          if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
            return true;
          }
        }
      }
      return false;
    }

    function mousewheelHandler(e) {
      var delta = getDeltaFromEvent(e);

      var deltaX = delta[0];
      var deltaY = delta[1];

      if (shouldBeConsumedByChild(deltaX, deltaY)) {
        return;
      }

      shouldPrevent = false;
      if (!i.settings.useBothWheelAxes) {
        // deltaX will only be used for horizontal scrolling and deltaY will
        // only be used for vertical scrolling - this is the default
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else if (i.scrollbarYActive && !i.scrollbarXActive) {
        // only vertical scrollbar is active and useBothWheelAxes option is
        // active, so let's scroll vertical bar using both mouse wheel axes
        if (deltaY) {
          updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
        } else {
          updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
        }
        shouldPrevent = true;
      } else if (i.scrollbarXActive && !i.scrollbarYActive) {
        // useBothWheelAxes and only horizontal bar is active, so use both
        // wheel axes for horizontal bar
        if (deltaX) {
          updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
        } else {
          updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
        }
        shouldPrevent = true;
      }

      updateGeometry(element);

      shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
      if (shouldPrevent) {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    if (typeof window.onwheel !== "undefined") {
      i.event.bind(element, 'wheel', mousewheelHandler);
    } else if (typeof window.onmousewheel !== "undefined") {
      i.event.bind(element, 'mousewheel', mousewheelHandler);
    }
  }

  return function (element) {
    var i = instances.get(element);
    bindMouseWheelHandler(element, i);
  };

})();

/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-05.
 *                                                                                       iws.plugin.handler.nativeScroll
 */
iws.plugin.handler.nativeScroll = (function(){
  'use strict';

  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry;//require('../update-geometry');

  function bindNativeScrollHandler(element, i) {
    i.event.bind(element, 'scroll', function () {
      updateGeometry(element);
    });
  }

  /*module.exports = function (element) {
   var i = instances.get(element);
   bindNativeScrollHandler(element, i);
   };
   */
  return function(element){
    var i = instances.get(element);
    bindNativeScrollHandler(element, i);
  };

})();

/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-06.
 *                                                                                          iws.plugin.handler.selection
 */
iws.plugin.handler.selection = (function(){
  //이거 언제 발생되는지 아직도 잘 모르겠다..
  'use strict';

  var _ = iws.lib.helper; //require('../../lib/helper');
  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('../update-geometry');
  var updateScroll = iws.plugin.updateScroll; //require('../update-scroll');

  function bindSelectionHandler(element, i) {
    function getRangeNode() {
      var selection = window.getSelection ? window.getSelection() :
        document.getSelection ? document.getSelection() : '';
      if (selection.toString().length === 0) {
        return null;
      } else {
        return selection.getRangeAt(0).commonAncestorContainer;
      }
    }

    var scrollingLoop = null;
    var scrollDiff = {top: 0, left: 0};
    function startScrolling() {
      if (!scrollingLoop) {
        scrollingLoop = setInterval(function () {
          if (!instances.get(element)) {
            clearInterval(scrollingLoop);
            return;
          }

          updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
          updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
          updateGeometry(element);
        }, 50); // every .1 sec
      }
    }
    function stopScrolling() {
      if (scrollingLoop) {
        clearInterval(scrollingLoop);
        scrollingLoop = null;
      }
      _.stopScrolling(element);
    }

    var isSelected = false;
    i.event.bind(i.ownerDocument, 'selectionchange', function () {
      if (element.contains(getRangeNode())) {
        isSelected = true;
      } else {
        isSelected = false;
        stopScrolling();
      }
    });
    i.event.bind(window, 'mouseup', function () {
      if (isSelected) {
        isSelected = false;
        stopScrolling();
      }
    });

    i.event.bind(window, 'mousemove', function (e) {
      if (isSelected) {
        var mousePosition = {x: e.pageX, y: e.pageY};
        var containerGeometry = {
          left: element.offsetLeft,
          right: element.offsetLeft + element.offsetWidth,
          top: element.offsetTop,
          bottom: element.offsetTop + element.offsetHeight
        };

        if (mousePosition.x < containerGeometry.left + 3) {
          scrollDiff.left = -5;
          _.startScrolling(element, 'x');
        } else if (mousePosition.x > containerGeometry.right - 3) {
          scrollDiff.left = 5;
          _.startScrolling(element, 'x');
        } else {
          scrollDiff.left = 0;
        }

        if (mousePosition.y < containerGeometry.top + 3) {
          if (containerGeometry.top + 3 - mousePosition.y < 5) {
            scrollDiff.top = -5;
          } else {
            scrollDiff.top = -20;
          }
          _.startScrolling(element, 'y');
        } else if (mousePosition.y > containerGeometry.bottom - 3) {
          if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
            scrollDiff.top = 5;
          } else {
            scrollDiff.top = 20;
          }
          _.startScrolling(element, 'y');
        } else {
          scrollDiff.top = 0;
        }

        if (scrollDiff.top === 0 && scrollDiff.left === 0) {
          stopScrolling();
        } else {
          startScrolling();
        }
      }
    });
  }

  return function (element) {
    var i = instances.get(element);
    bindSelectionHandler(element, i);
  };

})();

/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-06.
 *                                                                                              iws.plugin.handler.touch
 */
iws.plugin.handler.touch = (function(){
  'use strict';

  var _ = iws.lib.helper; //require('../../lib/helper');
  var instances = iws.plugin.instances; //require('../instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('../update-geometry');
  var updateScroll = iws.plugin.updateScroll; //require('../update-scroll');

  function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
    function shouldPreventDefault(deltaX, deltaY) {
      var scrollTop = element.scrollTop;
      var scrollLeft = element.scrollLeft;
      var magnitudeX = Math.abs(deltaX);
      var magnitudeY = Math.abs(deltaY);

      if (magnitudeY > magnitudeX) {
        // user is perhaps trying to swipe up/down the page

        if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
          return !i.settings.swipePropagation;
        }
      } else if (magnitudeX > magnitudeY) {
        // user is perhaps trying to swipe left/right across the page

        if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
          return !i.settings.swipePropagation;
        }
      }

      return true;
    }

    function applyTouchMove(differenceX, differenceY) {
      updateScroll(element, 'top', element.scrollTop - differenceY);
      updateScroll(element, 'left', element.scrollLeft - differenceX);

      updateGeometry(element);
    }

    var startOffset = {};
    var startTime = 0;
    var speed = {};
    var easingLoop = null;
    var inGlobalTouch = false;
    var inLocalTouch = false;

    function globalTouchStart() {
      inGlobalTouch = true;
    }
    function globalTouchEnd() {
      inGlobalTouch = false;
    }

    function getTouch(e) {
      if (e.targetTouches) {
        return e.targetTouches[0];
      } else {
        // Maybe IE pointer
        return e;
      }
    }
    function shouldHandle(e) {
      if (e.targetTouches && e.targetTouches.length === 1) {
        return true;
      }
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
        return true;
      }
      return false;
    }
    function touchStart(e) {
      if (shouldHandle(e)) {
        inLocalTouch = true;

        var touch = getTouch(e);

        startOffset.pageX = touch.pageX;
        startOffset.pageY = touch.pageY;

        startTime = (new Date()).getTime();

        if (easingLoop !== null) {
          clearInterval(easingLoop);
        }

        e.stopPropagation();
      }
    }
    function touchMove(e) {
      if (!inLocalTouch && i.settings.swipePropagation) {
        touchStart(e);
      }
      if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
        var touch = getTouch(e);

        var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

        var differenceX = currentOffset.pageX - startOffset.pageX;
        var differenceY = currentOffset.pageY - startOffset.pageY;

        applyTouchMove(differenceX, differenceY);
        startOffset = currentOffset;

        var currentTime = (new Date()).getTime();

        var timeGap = currentTime - startTime;
        if (timeGap > 0) {
          speed.x = differenceX / timeGap;
          speed.y = differenceY / timeGap;
          startTime = currentTime;
        }

        if (shouldPreventDefault(differenceX, differenceY)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    }
    function touchEnd() {
      if (!inGlobalTouch && inLocalTouch) {
        inLocalTouch = false;

        clearInterval(easingLoop);
        easingLoop = setInterval(function () {
          if (!instances.get(element)) {
            clearInterval(easingLoop);
            return;
          }

          if (!speed.x && !speed.y) {
            clearInterval(easingLoop);
            return;
          }

          if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
            clearInterval(easingLoop);
            return;
          }

          applyTouchMove(speed.x * 30, speed.y * 30);

          speed.x *= 0.8;
          speed.y *= 0.8;
        }, 10);
      }
    }

    if (supportsTouch) {
      i.event.bind(window, 'touchstart', globalTouchStart);
      i.event.bind(window, 'touchend', globalTouchEnd);
      i.event.bind(element, 'touchstart', touchStart);
      i.event.bind(element, 'touchmove', touchMove);
      i.event.bind(element, 'touchend', touchEnd);
    }

    if (supportsIePointer) {
      if (window.PointerEvent) {
        i.event.bind(window, 'pointerdown', globalTouchStart);
        i.event.bind(window, 'pointerup', globalTouchEnd);
        i.event.bind(element, 'pointerdown', touchStart);
        i.event.bind(element, 'pointermove', touchMove);
        i.event.bind(element, 'pointerup', touchEnd);
      } else if (window.MSPointerEvent) {
        i.event.bind(window, 'MSPointerDown', globalTouchStart);
        i.event.bind(window, 'MSPointerUp', globalTouchEnd);
        i.event.bind(element, 'MSPointerDown', touchStart);
        i.event.bind(element, 'MSPointerMove', touchMove);
        i.event.bind(element, 'MSPointerUp', touchEnd);
      }
    }
  }

  return function (element) {
    if (!_.env.supportsTouch && !_.env.supportsIePointer) {
      return;
    }

    var i = instances.get(element);
    bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
  };

})();

/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-05.
 *                                                                                                 iws.plugin.initialize
 */
iws.plugin.initialize =  (function (){
  'use strict';

  var _ = iws.lib.helper; //require('../lib/helper');
  var cls = iws.lib.class;  //require('../lib/class');
  var instances = iws.plugin.instances; //require('./instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('./update-geometry');

// Handlers
  var handlers = {
    'click-rail': iws.plugin.handler.clickRail, //require('./handler/click-rail')
    'drag-scrollbar': iws.plugin.handler.dragScrollbar, //require('./handler/drag-scrollbar'),
    'keyboard': iws.plugin.handler.keyboard,  //require('./handler/keyboard'),
    'wheel': iws.plugin.handler.mouseWheel, //require('./handler/mouse-wheel'),
    'touch': iws.plugin.handler.touch,  //require('./handler/touch'),
    'selection': iws.plugin.handler.selection  //require('./handler/selection')
  };

  var nativeScrollHandler = iws.plugin.handler.nativeScroll;//require('./handler/native-scroll');

  return function (element, userSettings) {
    userSettings = typeof userSettings === 'object' ? userSettings : {};

    cls.add(element, 'ps-container');

    // Create a plugin instance.
    var i = instances.add(element);

    i.settings = _.extend(i.settings, userSettings);
    cls.add(element, 'ps-theme-' + i.settings.theme);

    i.settings.handlers.forEach(function (handlerName) {
      handlers[handlerName] && handlers[handlerName](element);
    });

    nativeScrollHandler(element);

    updateGeometry(element);
  };
})();

/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-05.
 *                                                                                                     iws.plugin.update
 */
iws.plugin.update = (function(){
  'use strict';

  var _ = iws.lib.helper; //require('../lib/helper');
  var dom = iws.lib.DOM;  //require('../lib/dom');
  var instances = iws.plugin.instances; //require('./instances');
  var updateGeometry = iws.plugin.updateGeometry; //require('./update-geometry');
  var updateScroll = iws.plugin.updateScroll; //require('./update-scroll');

  return function (element) {
    var i = instances.get(element);

    if (!i) {
      return;
    }

    // Recalcuate negative scrollLeft adjustment
    i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

    // Recalculate rail margins
    dom.css(i.scrollbarXRail, 'display', 'block');
    dom.css(i.scrollbarYRail, 'display', 'block');
    i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
    i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

    // Hide scrollbars not to affect scrollWidth and scrollHeight
    dom.css(i.scrollbarXRail, 'display', 'none');
    dom.css(i.scrollbarYRail, 'display', 'none');

    updateGeometry(element);

    // Update top/left scroll to trigger events
    updateScroll(element, 'top', element.scrollTop);
    updateScroll(element, 'left', element.scrollLeft);

    dom.css(i.scrollbarXRail, 'display', '');
    dom.css(i.scrollbarYRail, 'display', '');
  }
})();


/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-05.
 *                                                                                                    iws.plugin.destroy
 * @returns {Function}
 */
iws.plugin.destroy = function () {
  'use strict';

  var _ = iws.lib.helper; //require('../lib/helper');
  var dom = iws.lib.DOM;  //require('../lib/dom');
  var instances = iws.plugin.instances; //require('./instances');

  return function(element){
    var i = instances.get(element);

    if (!i) {
      return;
    }

    i.event.unbindAll();
    dom.remove(i.scrollbarX);
    dom.remove(i.scrollbarY);
    dom.remove(i.scrollbarXRail);
    dom.remove(i.scrollbarYRail);
    _.removePsClasses(element);

    instances.remove(element);
  }

};


/***********************************************************************************************************************
 * Created by ojb74 on 2017-04-04.
 *                                                                                                            iws.scroll
 * @returns {{initialize: *, update: *, destroy: *}}
 */
iws.scroll = (function(){
  'use strict';

  var destroy = iws.plugin.destroy; //require('./plugin/destroy');
  var initialize = iws.plugin.initialize; //require('./plugin/initialize');
  var update = iws.plugin.update; //require('./plugin/update');

  return{
    initialize: initialize,
    update: update,
    destroy: destroy
  }
})();



