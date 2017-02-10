# vanilla-collapsible-content

### Synopsis
A collapsible content module written in vanilla JavaScript.

### Installation
```
npm install @ianhatton/vanilla-collapsible-content
```

### Running tests
```
npm run test
```

### Example Instantiation
```javascript
const CollapsibleContentClass = require('@ianhatton/vanilla-collapsible-content');

const collapsibleContentElements = document.querySelectorAll('.collapsible-content');

if (collapsibleContentElements.length > 0){
  Array.from(collapsibleContentElements).map((element)=>{
    return new CollapsibleContentClass({
      element: element
    });
  });
}
```

### Configuration
A new instance of CollapsibleContentClass can contain the following in its configuration object:
```javascript
new CollapsibleContentClass({
  element: // The DOM node to be instantiated as having collapsible content
  , bodyContainerClass: // String. Class for each collapsible content item's body. Default is "collapsible-content-body"
  , itemContainerClass: // String. Class for each collapsible content item. Default is "collapsible-content-item"
  , toggleContainerClass: // String. Class for each collapsible content item's toggle. Default is "collapsible-content-toggle"
});
```

### Example HTML structure
```html
<div class="collapsible-content" data-name="collapsible-example" data-visible-mobile="false" data-visible-tablet="false" data-visible-desktop="true">
  <div class="collapsible-content-item" data-parent="collapsible-example">
    <div class="collapsible-content-toggle">
      <p>The toggle. This can be any element.</p>
    </div>
    <div class="collapsible-content-body">
      <p>The body. This can be any element.</p>
    </div>
  </div>
  <div class="collapsible-content-item" data-parent="collapsible-example">
    <article>
      <div class="collapsible-content-toggle">
        <h1>Another toggle.</h1>
      </div>
      <div class="collapsible-content-body">
        <p>Another body.</p>
      </div>
    </article>
  </div>
</div>
```

All collapsible content items must be wrapped in a single parent div with a class of ***collapsible-content***, and individually wrapped in a div with a class of ***collapsible-content-item***. They always contain a div with a class of ***collapsible-content-toggle*** and ***collapsible-content-body***.

The ***data-name*** attribute of ***collapsible-content*** and ***data-parent*** attribute of ***collapsible-content-item*** determines the relationship between the two. This is in case you need to nest multiple collapsible content divs inside one another.

The ***data-visible-*** attributes of ***collapsible-content-item*** determine whether or not the items are expanded or collapsed by default at the corresponding breakpoint.

### CSS
As a bare minimum, you'll require the following, or similar CSS:

```scss
.collapsible-content-body {
  display: none;
  
  &.open {
    display: block;
  }
}
```