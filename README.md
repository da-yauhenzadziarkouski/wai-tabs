# WAI Tabs &#9971;

A simple Tabs widget skeleton, build with accessibility in mind - on top of `tabindex`, `aria-*` and `role` attributes. It's a bare minimum, but lets you construct a fully functional module in minutes with little to no efforts at the same time, if the correct CSS styles were provided.

## Why

1. There are tons of similar plugins available, but usually we don't need an extra functionality or dive into a setup complexity, these offer.
2. This plugin lets you ensure that you didn't forget to add all required attributes to follow [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
3. Ability to use any HTML tags as controls besides `<button>`.
4. You can use as many wrappers as you need for the navigation items or panels - this will not affect the behavior.
5. Tab panels can be in a different order than tabs - this doesn't matter since the script queries the panels by the `id` attribute.

## How it works

Basically, it changes certain attributes, but also provides a simple API for extending: it doesn't add any classes or change attributes except `tabindex`, `aria-selected` and `aria-hidden`, so you need to pass a custom function/hook to the `mount` method, if you would like to change the HTML DOM dynamically - please see [Configuration](#configuration). You may ask "Why the script doesn't add `hidden` attribute to panels? Well, because sometimes we don't need to entirely hide the panels, but to toggle CSS visibility property instead to keep the widget height constant, relying on the tallest pane, and use CSS transitions.

It utilizes the following HTML Attributes:

- `role="tablist"` is used as an entry selector. This can be changed - please see [Configuration](#configuration), but still, this attribute is considered required https://w3c.github.io/aria/#tablist
- `role="tab"` is used as a selector to query all navigation items.
- `aria-orientation` (`"horizontal"`/`"vertical"`) attribute is for internal handling the key codes correctly while using keyboard. It's optional, if your tabs list is horizontal.
- `tabindex` (`"0"`/`"-1"`) to make elements focusable or restrict focus instead.
- `aria-selected` (`"true"`/`"false"`) see https://w3c.github.io/aria/#aria-selected Additionally, `aria-selected="true"` determines an initial index that's utilized internally while using arrow keys to focus on a certain tab.
- `aria-controls` tab attribute along with the tab panel `id` to query all associated pane elements.
- `aria-hidden` is used to mark the pane as hidden for screen readers.

So, you should add attributes stated above to let the widget work. The script itself doesn't assert custom error messages to keep it lightweight.

# Installation
```
npm i wai-tabs
```
then
```js
import WAITabs from "wai-tabs"
```
# Configuration

**The very basic usage**

```js
new WAITabs().mount()
```

The script takes care about all instances on the page, querying elements by `'[role="tablist"]'` selector by default.

A minimum CSS may looks like this:

```css
[role="tab"][aria-selected="true"] {
  background-color: blue;
  color: white;
}
[role="tabpanel"][aria-hidden="true"] {
  display: none;
}
```

And Tabs HTML:

```html
<div role="tablist" aria-orientation="horizontal">
  <button id="tab-1" role="tab" aria-selected="true" tabindex="0" aria-controls="panel-1">Tab 1</button>
  <button id="tab-2" role="tab" aria-selected="false" tabindex="-1" aria-controls="panel-2">Tab 2</button>
  <button id="tab-3" role="tab" aria-selected="false" tabindex="-1" aria-controls="panel-3">Tab 3</button>
</div>
<div id="panel-1" role="tabpanel" tabindex="0" aria-labelledby="tab-1" aria-hidden="false">
  Panel #1
</div>
<div id="panel-2" role="tabpanel" tabindex="-1" aria-labelledby="tab-2" aria-hidden="true">
  Panel #2
</div>
<div id="panel-3" role="tabpanel" tabindex="-1" aria-labelledby="tab-3" aria-hidden="true">
  Panel #3
</div>
```

**Advanced usage**

Since we might need to have more control over the look and behavior by using our own classes or change the HTML DOM dynamically, the code may looks like the following:

```js
/**
 * The function invoked per a separate instance initialization and
 * may optionally return an object with two optional properties
 * - callbacks "onSelect" and "onTabKeyFocus"
 */
const useInstance = (singleInstance) => {
  const {
    wrapper,  // [role="tablist"] element by default or <div class="my-tabs">...</div> in our case
    navItems, // an array of [role="tab"] elements
    panes,    // an array of associated [role="tabpanel"] elements
    getIndex, // a function/method - get an internal active tab's index
    selectTab // a function/method - programmatically select a desired tab by calling it with a certain index as an argument
  } = singleInstance;

  // Adding custom data attribute just as example
  const initialIndex = getIndex();
  panes[initialIndex].dataset.currentPane = "true";

  return {
    /**
     * Fires when a tab was selected on "click" or "keydown"
     * event or after invoking "selectTab" method (event as a
     * second argument will be undefined). 
     */
    onSelect: (index, event) {
      console.log(event.type === "click" ? `Clicked the tab #${index + 1}` : `Pressed the tab #${index + 1}`)

      navItems.forEach((navItem, i) => {
        // I personally use Tailwind, so I need to add/remove a certain class
        navItem.classList[i === index ? "add" : "remove"]("text-blue-400", "border-b-blue-400")

        // Change pane's "data-current-pane" attribute
        panes[i].dataset.currentPane = (i === index).toString()
      })
    },
    /**
     * Fires when focused on a tab, but only if used
     * keyboard keys such as arrows, Home, End
     */
    onTabKeyFocus(index, event) {
      console.log(`The tab #${index + 1} is in focus!`, event.type);
    }
  };
};

new WAITabs(".my-tabs").mount(useInstance);
```

### Run a local dev server

```
npm i && npm start
```
