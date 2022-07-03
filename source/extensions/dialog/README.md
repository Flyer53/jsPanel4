# jsPanel.dialog

This extension adds an easy-to-use interface for dialog elements to virtually any jsPanel. It also offers a `modal` function to create modal dialogs as well as `alert()`, `confirm()` and `prompt()` functions.

The extension works with the `name` attribute to recognize dialog elements. Unlike HTML forms, any HTML can have a `name` atribute, including spans, paragraphs and `div`s.

The extension requires the `jsDialog.modal` extension in order to work with modal dialogs.

**This extension requires browsers that support ES6 (most modern browsers do). Internet Explorer, for example, is NOT supported!**

## HTML

The extension accepts several different ways to specify the HTML to display.

### Nodes or DocumentFragments

Supply the node to display.

### CSS Selectors

Supply the CSS selector of the HTML to display. This approach has two limitations. First, you should refrain from using IDs, because the extension deep-clones the HTML, thus creating multiple IDs with the same name. Second, the HTML should be initially invisible by adding `style="display:none"` to the dialog `<div>`.

### CSS Selectors inside a "template" Element

The extension searches for a `<template>` element with the ID of "dialogs" (this default ID can be changed, see below). If the dialog HTML is found within that template tag, it is deep-cloned into the main DOM. This lets you use IDs if necessary. This is the first approach; if there is no `template` element with an ID of "dialogs", of the selector is not part of that element, the search is repeated in the main DOM.

### HTML Strings

Finally, you can use HTML strings. The extension converts the string to a DocumentFragment by calling `jsPanel.strToHtml()`.

## Additional Properties

A jsPanel dialog receives a new property `dialog` that contains three properties:

### Dialog Elements

The panel property `dialog.elements` is a read-only object referencing all named HTML elements
in the panel's content area by name. If you, for example, have a text field with a `name="user"`
attribute, you can easily access that element by using `panel.dialog.elements.user`.

### Dialog Values

The panel property `dialog.values` is a read-only object referencing the value of all named HTML elements
in the panel's content area by name. In the above example, you can get or set the vaue of the input element
with `panel.dialog.values.user`.

The `values` object recognizes these values:

- For input fields and textareas, it is the content.
- For all elements with a `value` attribute, it is the value of that attribute.
- For radio buttons and `<select>` elements, it is the value of the selected element.
- For all other elements, like paragraphs, spans and `div`s, it is the inner HTML.

### The Modal Dialog Value

Event handlers (see below) can set the value that the `jsPanel.dialog.modal()` method should return by setting `panel.dialog.value`.

If no element sets that value explicitly, the dialog value is set to a clicked element's `value` property if there is no event handler defined for that element, and the element contains such an attribute.

## HTML Attributes

The extension honors the presence of several HTML attributes. These attributes are not
restricted to dialog elements; you can set them at any HTML element, like an image, for example.

- `data-dismiss`: Causes the dialog panel to close when clicked. 
- `data-cancel`: A HTML element with this attribute would receive a Click event when the user presses the Esc ape key. The handler for this attribute replaces the option's `closeOnEscape` handler.
- `data-dblclick`: An element with this attribute would respond to a double-click event.

## Event Handlers

For each named element, the panel options can contain event handlers for click and/or input events. The name of the event handler begins with either `onclick_` or `oninput_`, followed by the name of the element to listen to. For the above text input with the name `user`, this would, for example, be `oninput_user`. The three arguments are the panel, the affected HTML elements, and the event.

jsPanel's `callback` handler is fine to initialize the dialog. If, however, the handler needs to display a modal dialog, `callback` should not be used, because not everything is in place yet. Instead, use the new `oninitialize` handler. This handler is guaranteed to be called when everything has been set up. Its single argument is the panel.

## Modal Dialogs

Modal dialogs can be nested just fine. Dialogs that are moved to the background are made partially transparent, and a vertical offset is added to each new nested modal dialog.

Dialogs are created as white boxes with no headers and slightly rounded corners, centered horizontally.

### Dialog Sizes

The extension offers a few classes to be applied to dialogs to control their width:

- `dialog-sm` - 400px
- `dialog-md` - 600px
- `dialog-lg` - 800px
- `dialog-xl` - 1000px

All dialogs are limited to a height of 90% screen minus their initial vertical offset, with an automatic vertical scroll bar.

The classes offer limited responsive functionality, limiting their width to 90% of the screen width.

## Other CSS

The CSS file contains a few classes to colorize buttons, and to make sure that a text following a checkbox or radio button is aligned properly. Also, it defines the look and feel of disabled elements.

## Default Values

The `jsPanel.dialog` object contains these values, which can be changed at will:

- `defaults`: The default values for the jsPanel dialog options:
  - `theme: "none"` - no theme
  - `header: false` - no header
  - `position: {my:'center-top', at:'center-top', offsetY: 30}` - position towards the top, centered
  - `contentSize: "auto"` - the panel fits the content
  - `closeOnBackdrop: false` - dialog does not close when the backdrop is clicked
  - `oninitialize: []` - the default event handler to initialize the dialog (modal only)

- `dialogTemplateId: "#dialogs"` - the ID of the `template` element to search for dialogs.
- `css` - this object contains a few CSS class names that can be altered if required. These CSS classes are used for the `alert()`, `confirm()` and `prompt()` implementation to define the buttons.
  - `primaryBtn: "blue"` - the color of the primary button
  - `otherBtn: "white"` - all other buttons
  - `buttonBar: "buttonbar"` the class name of the button bar
  - `promptInput: "prompt-input"` - the class name of the text input field in the `prompt()` dialog
- `offsetY: 30` - the vertical offset that is added to nested dialogs

## Examples

A simple yes/no/cancel dialog whose value is either "YES", "NO", or "CANCEL". Note the use of a class name instead of an ID to reference the dialog to avoid double IDs.

```html
<div class="simple-confirm dialog-sm" style="display:none">
    <p>You are about to exit! Continue?</p>
    <div class="buttonbar">
        <button data-dismiss value="YES">Yes</button>
        <button data-dismiss data-cancel value="NO">No</button>
        <button data-dismiss value="CANCEL" class="yellow">Cancel</button>
    <div>
</div>
```

```javascript
// result is YES/NO/CANCEL
let result = await jsPanel.dialog.modal(".simple-confirm");
```

You could even use `alert()` for the same functionality (made the last button yellow for a change):

```javascript
let result = await jsPanel.dialog.alert("You are about to exit! Continue?", [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
    { label: "Cancel", value: "CANCEL", css: "yellow" }
]);
```

Here is a static version of the `prompt()` function, which returns either the entered text or `null`:

```html
<div class="simple-prompt dialog-sm" style="display:none">
    <p>Please enter your name:</p>
    <input type="text" name="input" />
    <div class="buttonbar">
        <button data-dismiss name="ok">OK</button>
        <button data-dismiss data-cancel name="cancel">Cancel</button>
    <div>
</div>
```

```javascript
// text or null
let result = await jsPanel.dialog.modal(".simple-prompt", {
    // use the value of the input field as dialog value
    onclick_ok: panel => panel.dialog.value = panel.dialog.values.input,
    // use null as the dialog value
    onclick_cancel: panel => panel.dialog.value = null
});
```

## API

### Properties

`jsPanel.dialog.active`

A read-only property that reports the currently active modal dialog.

`jsPanel.dialog.depth`

A read-only property that reports the number of currently open modal dialogs.

### Methods

`panel.makeDialog()`

Add dialog functionality to any jsPanel. Scans the content for named elements, and creates and attaches the `dialog` object to the panel. Overwrites the `closeOnEscape` option with a custom function. Finally, defines event handlers for `click`, `dblclick` and `input` events and attaches them to the panel.

`async jsPanel.dialog.modal(html, options)`

Create and display a modal dialog. The `html` parameter is either a `Node`, a `DocumentFragment`, or a string. If the string is a CSS selector, the method first searches for that selector within a `<template id="dialogs">` element, if present (the ID can be changed in the default, see above). If not found, the method searches the HTML content for a selector. In all cases, the HTML is deep-cloned, because dialogs may appear more than once. If the parameter is not a selector, the method attempts to convert the string to HTML if possible. The HTML's CSS attribute `display` is set to "" to force display of the HTML.

The options may contain additional callback handlers for `click` and `input` events as described above. Also, it may contain a function `oninitialize` that is called well after the dialog has been set up, and when it is safe to display other modal dialogs like alerts etc.

The result of the method is the value of `panel.dialog.value`. If not set, the value of the last clicked element's `value` attrribute is the result of the method.

`async jsPanel.dialog.alert(html, buttons, options = {})`

Display an alert box. The `html` and `options` parameters are passed on to the `modal()` method. The `buttons` parameter is an array of button names, or objects that describe each button. Each button object can have up to four properties:

- `label` - the button label (required)
- `value` - the value of the button's `value` attribute (optional)
- `name` - the value of the button's `name` atribute for callbacks (optional)
- `css` - anny CSS classes that the button should have.

If only a text is supplied, the first button receives the class name(s) stored in `defaults.css.primaryBtn`, and all other buttons receive the class name(s) stored in `defaults.css.otherBtn`. Either the signel button, or the second button also receives the attribute `data-cancel` to make it respond to the Escape key.

The return value is the value of the clicked button, if any.

`async jsPanel.dialog.confirm(html, no = false, moreButtons = [], options = {})`

Display an alert box with "Yes" and "No" buttons. The `html` and `options` parameters are passed on to the `modal()` method. If set to *true*, the `no` parameter sets the fdefault button to "No" instead of "Yes". The `moreButtons` parameter is an array of button names, or objects that describe each button, which are added to these two buttons. Internally, the method calls `alert()`.

The return value is either "YES" or "NO", or any of the values defined by the additional buttons.

`async jsPanel.dialog.prompt(html, preset = "", options = {})`

Display an alert box with a text input field, and "OK" and "Cancel" buttons. The `html` and `options` parameters are passed on to the `modal()` method. the `preset` parameter can be used to preset the value of the input field.

The text field receives the CSS class name stored in `defaults.css.promptInput`.

The result is either the entered text if the user clicked "OK", or `null` if the user clicked "Cancel".

`jsPanel.dialog.closeAll()`

Closes all open modal dialogs.
