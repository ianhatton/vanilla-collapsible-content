/* eslint-disable max-len */
const _ = require('lodash/core')
    , ViewportDetectionClass = require('viewport-detection-es6');

_.includes = require('lodash/includes');
const viewport = new ViewportDetectionClass();

class VanillaCollapsibleContentClass{
  constructor(config = {}, init = true){
    this.config = _.defaults(config,
      {
        bodyContainerClass: 'collapsible-content-body'
      , itemContainerClass: 'collapsible-content-item'
      , toggleContainerClass: 'collapsible-content-toggle'
      }
    );

    if (init){
      this._initViewport();
      this._init();
    }
  }

  _init(){
    this.bodies = [];
    this.items = [];
    this.toggles = [];
    this.dataName = this.config.element.getAttribute('data-name');
    this._render();
  }

  _initViewport(){
    this.device = viewport.getDevice();
    this.size = viewport.windowSize();
    viewport.trackSize(this._trackSize.bind(this));
  }

  _render(){
    this._getItems();
    this._getToggles();
    this._getBodies();
    this._setBreakpointDefaults();
  }

  _addToggleClickListeners(){
    this.toggles.forEach((toggle)=>{
      toggle.addEventListener('click'
                             , this._toggleClick.bind(this, toggle)
                             , false);
    });
  }

  _getBodies(){
    this.bodies = this.items.map((item)=>{
      return item.querySelector(`.${this.config.bodyContainerClass}`);
    });

    this._setBodyIDs();
  }

  _getItems(){
    let dataParent;
    const items = this.config.element.querySelectorAll(`.${this.config.itemContainerClass}`);

    this.items = Array.from(items).filter((item)=>{
      dataParent = item.getAttribute('data-parent');

      return dataParent === this.dataName;
    });

    this._setVisibleItems();
  }

  _getToggles(){
    this.toggles = this.items.map((item)=>{
      return item.querySelector(`.${this.config.toggleContainerClass}`);
    });

    this._setToggleAriaControls();
    this._addToggleClickListeners();
  }

  _setBodyAriaHidden(toggle){
    let body = this._skipTextNodes(toggle.nextSibling, 'nextSibling');
    let attribute = body.getAttribute('aria-hidden');

    body.setAttribute('aria-hidden', (attribute === 'true') ? 'false' : 'true');
  }

  _setBodyClass(toggle){
    let body = this._skipTextNodes(toggle.nextSibling, 'nextSibling');
    let className = body.className;

    if (_.includes(className, 'open')){
      body.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
    } else {
      body.className = className += ' open';
    }
  }

  _setBodyIDs(){
    this.bodies.forEach((body, i)=>{
      body.id += _.isNull(this.dataName) ? `collapsible-${i}` : `${this.dataName}-collapsible-${i}`;
    });
  }

  _setBreakpointDefaults(){
    switch (this.device){
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

  _setDefaultBodyAriaHiddens(visible){
    this.bodies.forEach((body)=>{
      body.setAttribute('aria-hidden', (visible === 'true') ? 'false' : 'true');
    });
  }

  _setDefaultBodyClasses(visible){
    let className;

    this.bodies.forEach((body)=>{
      className = body.className;

      if (visible === 'true'){
        if (!_.includes(className, 'open')){
          body.className = className += ' open';
        }
      } else {
        body.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      }
    });
  }

  _setDefaults(visible){
    this._setDefaultToggleAriaExpandeds(visible);
    this._setDefaultToggleClasses(visible);
    this._setDefaultBodyAriaHiddens(visible);
    this._setDefaultBodyClasses(visible);
  }

  _setDefaultToggleAriaExpandeds(visible){
    this.toggles.forEach((toggle)=>{
      toggle.setAttribute('aria-expanded', (visible === 'true') ? 'true' : 'false');
    });
  }

  _setDefaultToggleClasses(visible){
    let className;

    this.toggles.forEach((toggle)=>{
      className = toggle.className;

      if (visible === 'true'){
        if (!_.includes(className, 'open')){
          toggle.className = className += ' open';
        }
      } else {
        toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
      }
    });
  }

  _setToggleAriaControls(){
    this.toggles.forEach((toggle, i)=>{
      toggle.setAttribute('aria-controls', _.isNull(this.dataName) ? `collapsible-${i}` : `${this.dataName}-collapsible-${i}`);
    });
  }

  _setToggleAriaExpanded(toggle){
    let attribute = toggle.getAttribute('aria-expanded');

    toggle.setAttribute('aria-expanded', (attribute === 'true') ? 'false' : 'true');
  }

  _setToggleClass(toggle){
    let className = toggle.className;

    if (_.includes(className, 'open')){
      toggle.className = className.replace(/(?:^|\s)open(?!\S)/g, '');
    } else {
      toggle.className = className += ' open';
    }
  }

  _setVisibleItems(){
    const visibleMobile = this.config.element.getAttribute('data-visible-mobile');
    const visibleTablet = this.config.element.getAttribute('data-visible-tablet');
    const visibleDesktop = this.config.element.getAttribute('data-visible-desktop');

    this.visibleMobile = (_.isNull(visibleMobile)) ? 'false' : visibleMobile;
    this.visibleTablet = (_.isNull(visibleTablet)) ? 'false' : visibleTablet;
    this.visibleDesktop = (_.isNull(visibleDesktop)) ? 'false' : visibleDesktop;
  }

  _skipTextNodes(el, method){
    let element = el[method];

    while (element !== null && element.nodeType !== 1){
      element = element.nextSibling;
    }

    return element;
  }

  _toggleClick(toggle, e){
    e.preventDefault();

    this._setToggleAriaExpanded(toggle);
    this._setToggleClass(toggle);
    this._setBodyAriaHidden(toggle);
    this._setBodyClass(toggle);
  }

  _trackSize(device, size){
    if (this.device !== device){
      this.device = device;

      this._setBreakpointDefaults();
    }

    this.size = size;
  }
}

module.exports = VanillaCollapsibleContentClass;
/* eslint-enable */

