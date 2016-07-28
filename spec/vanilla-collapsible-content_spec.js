/* eslint-disable max-len, require-jsdoc */
const _  = require('lodash');
const CollapsibleContentClass = require('../src/vanilla-collapsible-content');

function createCollapsibleContent(){
  var div =  document.createElement('div');
  div.className = 'collapsible-content';
  div.setAttribute('data-name', 'spec-collapsible');
  div.setAttribute('data-visible-mobile', 'true');
  div.setAttribute('data-visible-tablet', 'true');
  div.setAttribute('data-visible-desktop', 'true');

  createCollapsibleContentItems(div);

  document.body.appendChild(div);

  return div;
}

function createCollapsibleContentBodies(item){
  let body, bodyInner, p;

  body = document.createElement('div');
  body.className = 'collapsible-content-body';

  bodyInner = document.createElement('div');
  p = document.createElement('p');
  p.innerHTML = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam varius egestas augue, in molestie dolor pellentesque faucibus. Aliquam at vulputate mi. Nunc id lacus eget felis mattis congue id eu velit.';

  bodyInner.appendChild(p);
  body.appendChild(bodyInner);
  item.appendChild(body);
}

function createCollapsibleContentItems(holder, items = 2){
  let item;
  let range = _.range(1, (items + 1));

  _.forEach(range, function(i){
    item = document.createElement('div');
    item.className = 'collapsible-content-item';
    item.setAttribute('data-parent', 'spec-collapsible');

    createCollapsibleContentToggles(item, i);
    createCollapsibleContentBodies(item, i);

    holder.appendChild(item);
  });
}

function createCollapsibleContentToggles(item, i){
  let button, element;

  button = document.createElement('button');
  element = document.createElement('a');
  button.className = 'collapsible-content-toggle';
  element.setAttribute('href', '#');
  element.innerHTML = 'Collapsible toggle ' + i;

  button.appendChild(element);
  item.appendChild(button);
}

describe('collapsible content module', function(){
  let collapsibleContent, cc, viewport;

  beforeEach(()=>{
    cc = createCollapsibleContent();
    viewport = CollapsibleContentClass.__get__('viewport');

    collapsibleContent = new CollapsibleContentClass({element: cc, bodyContainerClass: 'collapsible-content-body', itemContainerClass: 'collapsible-content-item', toggleContainerClass: 'collapsible-content-toggle'}, false);
    this.dataName = collapsibleContent.config.element.getAttribute('data-name');
    collapsibleContent.bodies = [];
    collapsibleContent.items = [];
    collapsibleContent.toggles = [];
  });

  it('should exist', function(){
    expect(collapsibleContent).toBeDefined();
  });

  describe('_init function', ()=>{
    beforeEach(()=>{
      spyOn(collapsibleContent, '_render');

      collapsibleContent._init();
    });

    it('should set this.bodies to be an empty array', ()=>{
      expect(collapsibleContent.bodies.length).toEqual(0);
    });

    it('should set this.items to be an empty array', ()=>{
      expect(collapsibleContent.items.length).toEqual(0);
    });

    it('should set this.toggles to be an empty array', ()=>{
      expect(collapsibleContent.toggles.length).toEqual(0);
    });

    it('should set this.dataName to be the "data-name" attribute of the element', ()=>{
      expect(collapsibleContent.dataName).toEqual(this.dataName);
    });

    it('should call the _render function', ()=>{
      expect(collapsibleContent._render).toHaveBeenCalled();
    });
  });

  describe('_initViewport function', ()=>{
    beforeEach(()=>{
      spyOn(viewport, 'getDevice').and.returnValue('massive swanky monitor');
      spyOn(viewport, 'windowSize').and.returnValue('99999px');
      spyOn(viewport, 'trackSize');

      collapsibleContent._initViewport();
    });

    it('should set this.device to be a call to the viewport.getDevice function', ()=>{
      expect(collapsibleContent.device).toEqual('massive swanky monitor');
    });

    it('should set this.size to be a call to the viewport.windowSize function', ()=>{
      expect(collapsibleContent.size).toEqual('99999px');
    });

    it('should call the viewport.trackSize function', ()=>{
      expect(viewport.trackSize).toHaveBeenCalled();
    });
  });

  describe('_render function', ()=>{
    beforeEach(()=>{
      spyOn(collapsibleContent, '_getItems');
      spyOn(collapsibleContent, '_getToggles');
      spyOn(collapsibleContent, '_getBodies');
      spyOn(collapsibleContent, '_setBreakpointDefaults');

      collapsibleContent._render();
    });

    it('should call the _getItems function', ()=>{
      expect(collapsibleContent._getItems).toHaveBeenCalled();
    });

    it('should call the _getToggles function', ()=>{
      expect(collapsibleContent._getToggles).toHaveBeenCalled();
    });

    it('should call the _getBodies function', ()=>{
      expect(collapsibleContent._getBodies).toHaveBeenCalled();
    });

    it('should call the _setBreakpointDefaults function', ()=>{
      expect(collapsibleContent._setBreakpointDefaults).toHaveBeenCalled();
    });
  });

  // describe('_addToggleClickListeners function', () {
  //   How do I test this?
  // });

  describe('_getBodies function', ()=>{
    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      spyOn(collapsibleContent, '_setBodyClasses');

      collapsibleContent._getBodies();
    });

    it('should build the this.bodies array from this.items', ()=>{
      expect(collapsibleContent.items.length).toEqual(2);
    });

    it('should call the _setBodyClasses function', ()=>{
      expect(collapsibleContent._setBodyClasses).toHaveBeenCalled();
    });
  });

  describe('_getItems function', ()=>{
    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        spyOn(collapsibleContent, '_setVisibleItems');

        collapsibleContent._getItems();
      });

      it('should call the _setVisibleItems function', ()=>{
        expect(collapsibleContent._setVisibleItems).toHaveBeenCalled();
      });
    });

    describe("when the item's data-parent attribute matches the element's data-name attribute", ()=>{
      beforeEach(()=>{
        collapsibleContent.dataName = this.dataName;
        collapsibleContent._getItems();
      });

      it('should add the item to the this.items array', ()=>{
        expect(collapsibleContent.items.length).toEqual(2);
      });
    });

    describe("when the item's data-parent attribute does not match the element's data-name attribute", ()=>{
      beforeEach(()=>{
        collapsibleContent.dataName = 'not-spec-collapsible';
        collapsibleContent._getItems();
      });

      it('should not add the item to the this.items array', ()=>{
        expect(collapsibleContent.items.length).toEqual(0);
      });
    });
  });

  describe('_getToggles function', ()=>{
    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      spyOn(collapsibleContent, '_setToggleAriaControls');
      spyOn(collapsibleContent, '_addToggleClickListeners');

      collapsibleContent._getToggles();
    });

    it('should add the toggle to the this.toggles array', ()=>{
      expect(collapsibleContent.toggles.length).toEqual(2);
    });

    it('should call the setToggleAriaControls function', ()=>{
      expect(collapsibleContent._setToggleAriaControls).toHaveBeenCalled();
    });

    it('should call the addToggleClickListeners function', ()=>{
      expect(collapsibleContent._addToggleClickListeners).toHaveBeenCalled();
    });
  });

  describe('_setBodyAriaHidden function', ()=>{
    let attribute, body, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
        collapsibleContent.bodies.push(item.querySelector('.' + collapsibleContent.config.bodyContainerClass));
      });

      toggle = collapsibleContent.toggles[0];
      body = collapsibleContent.bodies[0];

      spyOn(collapsibleContent, '_skipTextNodes').and.returnValue(body);
    });

    describe("when the 'aria-hidden' attribute of the body is 'false'", ()=>{
      beforeEach(()=>{
        body.setAttribute('aria-hidden', 'false');

        collapsibleContent._setBodyAriaHidden(toggle);

        attribute = body.getAttribute('aria-hidden');
      });

      it("should set the 'aria-hidden' attribute of the body to 'true'", ()=>{
        expect(attribute).toEqual('true');
      });
    });

    describe("when the 'aria-hidden' attribute of the body is 'true'", ()=>{
      beforeEach(()=>{
        body.setAttribute('aria-hidden', 'true');

        collapsibleContent._setBodyAriaHidden(toggle);

        attribute = body.getAttribute('aria-hidden');
      });

      it("should set the 'aria-hidden' attribute of the body to 'true'", ()=>{
        expect(attribute).toEqual('false');
      });
    });
  });

  describe('_setBodyClass function', ()=>{
    let body, className, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
        collapsibleContent.bodies.push(item.querySelector('.' + collapsibleContent.config.bodyContainerClass));
      });

      toggle = collapsibleContent.toggles[0];
      body = collapsibleContent.bodies[0];

      spyOn(collapsibleContent, '_skipTextNodes').and.returnValue(body);
    });

    describe("when the item's body does not have an 'open' class on it", ()=>{
      beforeEach(()=>{
        collapsibleContent._setBodyClass(toggle);

        className = body.className;
      });

      it("should add the 'open' class to the body", ()=>{
        expect(className).toContain('open');
      });
    });

    describe("when the item's body has an 'open' class on it", ()=>{
      beforeEach(()=>{
        body.className += ' open';

        collapsibleContent._setBodyClass(toggle);

        className = body.className;
      });

      it("should not add the 'open' class to the body", ()=>{
        expect(className).not.toContain('open');
      });
    });
  });

  describe('_setBodyClasses function', ()=>{
    let body, className;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.bodies.push(item.querySelector('.' + collapsibleContent.config.bodyContainerClass));
      });

      body = collapsibleContent.bodies[0];
    });

    describe('when this.dataName is not null', ()=>{
      beforeEach(()=>{
        collapsibleContent.dataName = this.dataName;

        collapsibleContent._setBodyClasses();

        className = body.className;
      });

      it("should append the value of this.dataName to the class on the item's body", ()=>{
        expect(className).toContain(this.dataName);
      });
    });

    describe('when this.dataName is null', ()=>{
      beforeEach(()=>{
        collapsibleContent.dataName = null;

        collapsibleContent._setBodyClasses();

        className = body.className;
      });

      it("should not append the value of this.dataName to the class on the item's body", ()=>{
        expect(className).not.toContain(this.dataName);
      });
    });
  });

  describe('_setBreakpointDefaults function', ()=>{
    describe("when this.device is 'mobile'", ()=>{
      beforeEach(()=>{
        collapsibleContent.device = 'mobile';
        collapsibleContent.visibleMobile = 'true';

        spyOn(collapsibleContent, '_setDefaults');

        collapsibleContent._setBreakpointDefaults();
      });

      it('should call the _setDefaults function with this.visibleMobile as a parameter', ()=>{
        expect(collapsibleContent._setDefaults).toHaveBeenCalledWith('true');
      });
    });

    describe("when this.device is 'tablet'", ()=>{
      beforeEach(()=>{
        collapsibleContent.device = 'tablet';
        collapsibleContent.visibleTablet = 'true';

        spyOn(collapsibleContent, '_setDefaults');

        collapsibleContent._setBreakpointDefaults();
      });

      it('should call the _setDefaults function with this.visibleTablet as a parameter', ()=>{
        expect(collapsibleContent._setDefaults).toHaveBeenCalledWith('true');
      });
    });

    describe("when this.device is 'desktop'", ()=>{
      beforeEach(()=>{
        collapsibleContent.device = 'desktop';
        collapsibleContent.visibleDesktop = 'true';

        spyOn(collapsibleContent, '_setDefaults');

        collapsibleContent._setBreakpointDefaults();
      });

      it('should call the _setDefaults function with this.visibleDesktop as a parameter', ()=>{
        expect(collapsibleContent._setDefaults).toHaveBeenCalledWith('true');
      });
    });
  });

  describe('_setDefaultBodyAriaHiddens function', ()=>{
    let attribute, body;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item) {
        collapsibleContent.bodies.push(item.querySelector('.' + collapsibleContent.config.bodyContainerClass));
      });

      body = collapsibleContent.bodies[0];
    });

    describe("when it's passed a parameter of 'true'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultBodyAriaHiddens('true');

        attribute = body.getAttribute('aria-hidden');
      });

      it("should set the 'aria-hidden' attribute of the item's body to 'false'", ()=>{
        expect(attribute).toEqual('false');
      });
    });

    describe("when it's passed a parameter of 'false'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultBodyAriaHiddens('false');

        attribute = body.getAttribute('aria-hidden');
      });

      it("should set the 'aria-hidden' attribute of the item's body to 'true'", ()=>{
        expect(attribute).toEqual('true');
      });
    });
  });

  describe('_setDefaultBodyClasses function', ()=>{
    let body, className;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.bodies.push(item.querySelector('.' + collapsibleContent.config.bodyContainerClass));
      });

      body = collapsibleContent.bodies[0];
    });

    describe("when it's passed a parameter of 'true'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultBodyClasses('true');

        className = body.className;
      });

      it("should add the 'open' class to the item's body", ()=>{
        expect(className).toContain('open');
      });
    });

    describe("when it's passed a parameter of 'false'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultBodyClasses('false');

        className = body.className;
      });

      it("should not add the 'open' class to the item's body", ()=>{
        expect(className).not.toContain('open');
      });
    });
  });

  describe('_setDefaults function', ()=>{
    beforeEach(()=>{
      spyOn(collapsibleContent, '_setDefaultToggleAriaExpandeds');
      spyOn(collapsibleContent, '_setDefaultToggleClasses');
      spyOn(collapsibleContent, '_setDefaultBodyAriaHiddens');
      spyOn(collapsibleContent, '_setDefaultBodyClasses');

      collapsibleContent._setDefaults('false');
    });

    it('should call the _setDefaultToggleAriaExpandeds function with the visible parameter', ()=>{
      expect(collapsibleContent._setDefaultToggleAriaExpandeds).toHaveBeenCalledWith('false');
    });

    it('should call the _setDefaultToggleClasses function with the visible parameter', ()=>{
      expect(collapsibleContent._setDefaultToggleClasses).toHaveBeenCalledWith('false');
    });

    it('should call the _setDefaultBodyAriaHiddens function with the visible parameter', ()=>{
      expect(collapsibleContent._setDefaultBodyAriaHiddens).toHaveBeenCalledWith('false');
    });

    it('should call the _setDefaultBodyClasses function with the visible parameter', ()=>{
      expect(collapsibleContent._setDefaultBodyClasses).toHaveBeenCalledWith('false');
    });
  });

  describe('_setDefaultToggleAriaExpandeds function', ()=>{
    let attribute, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item) {
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
      });

      toggle = collapsibleContent.toggles[0];
    });

    describe("when it's passed a parameter of 'true'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultToggleAriaExpandeds('true');

        attribute = toggle.getAttribute('aria-expanded');
      });

      it("should set the 'aria-expanded' attribute of the item's toggle to 'true'", ()=>{
        expect(attribute).toEqual('true');
      });
    });

    describe("when it's passed a parameter of 'false'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultToggleAriaExpandeds('false');

        attribute = toggle.getAttribute('aria-expanded');
      });

      it("should set the 'aria-expanded' attribute of the item's toggle to 'false'", ()=>{
        expect(attribute).toEqual('false');
      });
    });
  });

  describe('_setDefaultToggleClasses function', ()=>{
    let className, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item) {
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
      });

      toggle = collapsibleContent.toggles[0];
    });

    describe("when it's passed a parameter of 'true'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultToggleClasses('true');

        className = toggle.className;
      });

      it("should add the 'open' class to the item's toggle", ()=>{
        expect(className).toContain('open');
      });
    });

    describe("when it's passed a parameter of 'false'", ()=>{
      beforeEach(()=>{
        collapsibleContent._setDefaultToggleClasses('false');

        className = toggle.className;
      });

      it("should add the 'open' class to the item's toggle", ()=>{
        expect(className).not.toContain('open');
      });
    });
  });

  describe('_setToggleAriaControls function', ()=>{
    let attribute, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
      });

      toggle = collapsibleContent.toggles[0];
    });

    describe('when this.dataName is not null', ()=>{
      beforeEach(()=>{
        collapsibleContent.dataName = this.dataName;

        collapsibleContent._setToggleAriaControls();

        attribute = toggle.getAttribute('aria-controls');
      });

      it("should set the 'aria-controls' attribute of the toggle to contain the value of this.dataName", ()=>{
        expect(attribute).toContain(this.dataName);
      });
    });

    describe('when this.dataName is null', ()=>{
      beforeEach(()=>{
        collapsibleContent.dataName = null;

        collapsibleContent._setToggleAriaControls();

        attribute = toggle.getAttribute('aria-controls');
      });

      it("should not set the 'aria-controls' attribute of the toggle to contain the value of this.dataName", ()=>{
        expect(attribute).not.toContain(this.dataName);
      });
    });
  });

  describe('_setToggleAriaExpanded function', ()=>{
    let attribute, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
      });

      toggle = collapsibleContent.toggles[0].firstChild;
    });

    describe("when the 'aria-expanded' attribute of the item's toggle is 'true'", ()=>{
      beforeEach(()=>{
        toggle.setAttribute('aria-expanded', 'true');

        collapsibleContent._setToggleAriaExpanded(toggle);

        attribute = toggle.getAttribute('aria-expanded');
      });

      it("should set it to 'false'", ()=>{
        expect(attribute).toEqual('false');
      });
    });

    describe("when the 'aria-expanded' attribute of the item's toggle is 'false'", ()=>{
      beforeEach(()=>{
        toggle.setAttribute('aria-expanded', 'false');

        collapsibleContent._setToggleAriaExpanded(toggle);

        attribute = toggle.getAttribute('aria-expanded');
      });

      it("should set it to 'false'", ()=>{
        expect(attribute).toEqual('true');
      });
    });
  });

  describe('_setToggleClass function', ()=>{
    let className, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item) {
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
      });

      toggle = collapsibleContent.toggles[0].firstChild;
    });

    describe("when the item's toggle has an 'open' class on it", ()=>{
      beforeEach(()=>{
        toggle.className += ' open';

        collapsibleContent._setToggleClass(toggle);

        className = toggle.parentNode.className;
      });

      it('should remove it', ()=>{
        expect(className).not.toContain('open');
      });
    });

    describe("when the item's toggle does not have an 'open' class on it", ()=>{
      beforeEach(()=>{
        collapsibleContent._setToggleClass(toggle);

        className = toggle.className;
      });

      it('should add it', ()=>{
        expect(className).toContain('open');
      });
    });
  });

  describe('_setVisibleItems function', ()=>{
    describe("when the element's 'data-visible-mobile' attribute is not null", ()=>{
      beforeEach(()=>{
        collapsibleContent._setVisibleItems();
      });

      it("should set this.visibleMobile to the value of the 'data-visible-mobile' attribute", ()=>{
        expect(collapsibleContent.visibleMobile).toEqual('true');
      });
    });

    describe("when the element's 'data-visible-mobile' attribute is null", ()=>{
      beforeEach(()=>{
        collapsibleContent.config.element.removeAttribute('data-visible-mobile');

        collapsibleContent._setVisibleItems();
      });

      it("should set this.visibleMobile to be 'false'", ()=>{
        expect(collapsibleContent.visibleMobile).toEqual('false');
      });
    });

    describe("when the element's 'data-visible-tablet' attribute is not null", ()=>{
      beforeEach(()=>{
        collapsibleContent._setVisibleItems();
      });

      it("should set this.visibleTablet to the value of the 'data-visible-tablet' attribute", ()=>{
        expect(collapsibleContent.visibleTablet).toEqual('true');
      });
    });

    describe("when the element's 'data-visible-tablet' attribute is null", ()=>{
      beforeEach(()=>{
        collapsibleContent.config.element.removeAttribute('data-visible-tablet');

        collapsibleContent._setVisibleItems();
      });

      it("should set this.visibleTablet to be 'false'", ()=>{
        expect(collapsibleContent.visibleTablet).toEqual('false');
      });
    });

    describe("when the element's 'data-visible-desktop' attribute is not null", ()=>{
      beforeEach(()=>{
        collapsibleContent._setVisibleItems();
      });

      it("should set this.visibleDesktop to the value of the 'data-visible-desktop' attribute", ()=>{
        expect(collapsibleContent.visibleDesktop).toEqual('true');
      });
    });

    describe("when the element's 'data-visible-desktop' attribute is null", ()=>{
      beforeEach(()=>{
        collapsibleContent.config.element.removeAttribute('data-visible-desktop');

        collapsibleContent._setVisibleItems();
      });

      it("should set this.visibleDesktop to be 'false'", ()=>{
        expect(collapsibleContent.visibleDesktop).toEqual('false');
      });
    });
  });

  describe('_toggleClick function', ()=>{
    let clickSpy, toggle;

    beforeEach(()=>{
      collapsibleContent.items = collapsibleContent.config.element.querySelectorAll('.' + collapsibleContent.config.itemContainerClass);

      _.forEach(collapsibleContent.items, function(item){
        collapsibleContent.toggles.push(item.querySelector('.' + collapsibleContent.config.toggleContainerClass));
      });

      toggle = collapsibleContent.toggles[0].firstChild;

      clickSpy = jasmine.createSpyObj('e', ['preventDefault']);

      spyOn(collapsibleContent, '_setToggleAriaExpanded');
      spyOn(collapsibleContent, '_setToggleClass');
      spyOn(collapsibleContent, '_setBodyAriaHidden');
      spyOn(collapsibleContent, '_setBodyClass');

      collapsibleContent._toggleClick(toggle, clickSpy);
    });

    it('should call e.preventDefault', ()=>{
      expect(clickSpy.preventDefault).toHaveBeenCalled();
    });

    it('should call the _setToggleAriaExpanded function with toggle as a parameter', ()=>{
      expect(collapsibleContent._setToggleAriaExpanded).toHaveBeenCalledWith(toggle);
    });

    it('should call the _setToggleClass function with toggle as a parameter', ()=>{
      expect(collapsibleContent._setToggleClass).toHaveBeenCalledWith(toggle);
    });

    it('should call the _setBodyAriaHidden function with toggle as a parameter', ()=>{
      expect(collapsibleContent._setBodyAriaHidden).toHaveBeenCalledWith(toggle);
    });

    it('should call the _setBodyClass function with toggle as a parameter', ()=>{
      expect(collapsibleContent._setBodyClass).toHaveBeenCalledWith(toggle);
    });
  });

  describe('_trackSize function', ()=>{
    let device, size;

    describe('under all circumstances', ()=>{
      beforeEach(()=>{
        device = 'massive swanky monitor';
        size = '99999px';

        spyOn(collapsibleContent, '_setBreakpointDefaults');

        collapsibleContent._trackSize(device, size);
      });

      it('should set this.size to be the size parameter', ()=>{
        expect(collapsibleContent.size).toEqual('99999px');
      });
    });

    describe('when this.device is equal to the device parameter', ()=>{
      beforeEach(()=>{
        collapsibleContent.device = 'massive swanky monitor';
        device = 'massive swanky monitor';

        spyOn(collapsibleContent, '_setBreakpointDefaults');

        collapsibleContent._trackSize(device, size);
      });

      it('should not call the _setBreakpointDefaults function', ()=>{
        expect(collapsibleContent._setBreakpointDefaults).not.toHaveBeenCalled();
      });
    });

    describe('when this.device is not equal to the device parameter', ()=>{
      beforeEach(()=>{
        collapsibleContent.device = 'massive swanky monitor';
        device = 'mobile';

        spyOn(collapsibleContent, '_setBreakpointDefaults');

        collapsibleContent._trackSize(device, size);
      });

      it('should set this.device to be the value of the device parameter', ()=>{
        expect(collapsibleContent.device).toEqual('mobile');
      });

      it('should call the _setBreakpointDefaults function', ()=>{
        expect(collapsibleContent._setBreakpointDefaults).toHaveBeenCalled();
      });
    });
  });
});
/* eslint-enable */
