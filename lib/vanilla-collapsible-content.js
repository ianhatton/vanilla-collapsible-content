'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable max-len */
var _ = require('lodash/core'),
    ViewportDetectionClass = require('viewport-detection-es6');

_.includes = require('lodash/includes');
var viewport = new ViewportDetectionClass();

var VanillaCollapsibleContentClass = function () {
  function VanillaCollapsibleContentClass() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, VanillaCollapsibleContentClass);

    this.config = _.defaults(config, {
      bodyContainerClass: 'collapsible-content-body',
      itemContainerClass: 'collapsible-content-item',
      toggleContainerClass: 'collapsible-content-toggle'
    });

    if (init) {
      this._initViewport();
      this._init();
    }
  }

  _createClass(VanillaCollapsibleContentClass, [{
    key: '_init',
    value: function _init() {
      this.bodies = [];
      this.items = [];
      this.toggles = [];
      this.dataName = this.config.element.getAttribute('data-name');
      this._render();
    }
  }, {
    key: '_initViewport',
    value: function _initViewport() {
      this.device = viewport.getDevice();
      this.size = viewport.windowSize();
      viewport.trackSize(this._trackSize.bind(this));
    }
  }, {
    key: '_render',
    value: function _render() {
      this._getItems();
      this._getToggles();
      this._getBodies();
      this._setBreakpointDefaults();
    }
  }, {
    key: '_addToggleClickListeners',
    value: function _addToggleClickListeners() {
      var _this = this;

      this.toggles.forEach(function (toggle) {
        toggle.addEventListener('click', _this._toggleClick.bind(_this, toggle), false);
      });
    }
  }, {
    key: '_getBodies',
    value: function _getBodies() {
      var _this2 = this;

      this.bodies = this.items.map(function (item) {
        return item.querySelector('.' + _this2.config.bodyContainerClass);
      });

      this._setBodyIDs();
    }
  }, {
    key: '_getItems',
    value: function _getItems() {
      var _this3 = this;

      var dataParent = void 0;
      var items = this.config.element.querySelectorAll('.' + this.config.itemContainerClass);

      this.items = Array.from(items).filter(function (item) {
        dataParent = item.getAttribute('data-parent');

        return dataParent === _this3.dataName;
      });

      this._setVisibleItems();
    }
  }, {
    key: '_getToggles',
    value: function _getToggles() {
      var _this4 = this;

      this.toggles = this.items.map(function (item) {
        return item.querySelector('.' + _this4.config.toggleContainerClass);
      });

      this._setToggleAriaControls();
      this._addToggleClickListeners();
    }
  }, {
    key: '_setBodyAriaHidden',
    value: function _setBodyAriaHidden(toggle) {
      var body = this._skipTextNodes(toggle.nextSibling, 'nextSibling');
      var attribute = body.getAttribute('aria-hidden');

      body.setAttribute('aria-hidden', attribute === 'true' ? 'false' : 'true');
    }
  }, {
    key: '_setBodyClass',
    value: function _setBodyClass(toggle) {
      var body = this._skipTextNodes(toggle.nextSibling, 'nextSibling');
      var className = body.className;

      if (_.includes(className, 'open')) {
        body.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      } else {
        body.className = className += ' open';
      }
    }
  }, {
    key: '_setBodyIDs',
    value: function _setBodyIDs() {
      var _this5 = this;

      this.bodies.forEach(function (body, i) {
        body.id += _.isNull(_this5.dataName) ? 'collapsible-' + i : _this5.dataName + '-collapsible-' + i;
      });
    }
  }, {
    key: '_setBreakpointDefaults',
    value: function _setBreakpointDefaults() {
      switch (this.device) {
        case 'mobile':
          this._setDefaults(this.visibleMobile);
          break;
        case 'tablet':
          this._setDefaults(this.visibleTablet);
          break;
        case 'desktop':
          this._setDefaults(this.visibleDesktop);
          break;
        default:
          break;
      }
    }
  }, {
    key: '_setDefaultBodyAriaHiddens',
    value: function _setDefaultBodyAriaHiddens(visible) {
      this.bodies.forEach(function (body) {
        body.setAttribute('aria-hidden', visible === 'true' ? 'false' : 'true');
      });
    }
  }, {
    key: '_setDefaultBodyClasses',
    value: function _setDefaultBodyClasses(visible) {
      var className = void 0;

      this.bodies.forEach(function (body) {
        className = body.className;

        if (visible === 'true') {
          if (!_.includes(className, 'open')) {
            body.className = className += ' open';
          }
        } else {
          body.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
        }
      });
    }
  }, {
    key: '_setDefaults',
    value: function _setDefaults(visible) {
      this._setDefaultToggleAriaExpandeds(visible);
      this._setDefaultToggleClasses(visible);
      this._setDefaultBodyAriaHiddens(visible);
      this._setDefaultBodyClasses(visible);
    }
  }, {
    key: '_setDefaultToggleAriaExpandeds',
    value: function _setDefaultToggleAriaExpandeds(visible) {
      this.toggles.forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', visible === 'true' ? 'true' : 'false');
      });
    }
  }, {
    key: '_setDefaultToggleClasses',
    value: function _setDefaultToggleClasses(visible) {
      var className = void 0;

      this.toggles.forEach(function (toggle) {
        className = toggle.className;

        if (visible === 'true') {
          if (!_.includes(className, 'open')) {
            toggle.className = className += ' open';
          }
        } else {
          toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
        }
      });
    }
  }, {
    key: '_setToggleAriaControls',
    value: function _setToggleAriaControls() {
      var _this6 = this;

      this.toggles.forEach(function (toggle, i) {
        toggle.setAttribute('aria-controls', _.isNull(_this6.dataName) ? 'collapsible-' + i : _this6.dataName + '-collapsible-' + i);
      });
    }
  }, {
    key: '_setToggleAriaExpanded',
    value: function _setToggleAriaExpanded(toggle) {
      var attribute = toggle.getAttribute('aria-expanded');

      toggle.setAttribute('aria-expanded', attribute === 'true' ? 'false' : 'true');
    }
  }, {
    key: '_setToggleClass',
    value: function _setToggleClass(toggle) {
      var className = toggle.className;

      if (_.includes(className, 'open')) {
        toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      } else {
        toggle.className = className += ' open';
      }
    }
  }, {
    key: '_setVisibleItems',
    value: function _setVisibleItems() {
      var visibleMobile = this.config.element.getAttribute('data-visible-mobile');
      var visibleTablet = this.config.element.getAttribute('data-visible-tablet');
      var visibleDesktop = this.config.element.getAttribute('data-visible-desktop');

      this.visibleMobile = _.isNull(visibleMobile) ? 'false' : visibleMobile;
      this.visibleTablet = _.isNull(visibleTablet) ? 'false' : visibleTablet;
      this.visibleDesktop = _.isNull(visibleDesktop) ? 'false' : visibleDesktop;
    }
  }, {
    key: '_skipTextNodes',
    value: function _skipTextNodes(el, method) {
      var element = el[method];

      while (element !== null && element.nodeType !== 1) {
        element = element.nextSibling;
      }

      return element;
    }
  }, {
    key: '_toggleClick',
    value: function _toggleClick(toggle, e) {
      e.preventDefault();

      this._setToggleAriaExpanded(toggle);
      this._setToggleClass(toggle);
      this._setBodyAriaHidden(toggle);
      this._setBodyClass(toggle);
    }
  }, {
    key: '_trackSize',
    value: function _trackSize(device, size) {
      if (this.device !== device) {
        this.device = device;

        this._setBreakpointDefaults();
      }

      this.size = size;
    }
  }]);

  return VanillaCollapsibleContentClass;
}();

module.exports = VanillaCollapsibleContentClass;
/* eslint-enable */
//# sourceMappingURL=vanilla-collapsible-content.js.map