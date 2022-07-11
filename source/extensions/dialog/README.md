# jsPanel.dialog
This extension adds the property <mark>dialog</mark> to the global object **jsPanel**. `jsPanel.dialog` offers an easy-to-use interface for dialog elements to virtually any jsPanel. It also offers a `modal()` function to create modal dialogs as well as `alert()`, `confirm()` and `prompt()` functions.

The extension requires the <mark>jsPanel.modal</mark> extension in order to work with modal dialogs.

**This extension requires browsers that support ES6 (most modern browsers do). Internet Explorer, for example, is NOT supported!**

## Properties
- `jsPanel.dialog.version` _String_ with the version number
- `jsPanel.dialog.date` _String_ with the date of the js file
- `jsPanel.dialog.defaults` _Object_ with options applied to a dialog
```javascript
{
    theme: "none",
    header: false,
    position: {my:'center-top', at:'center-top', offsetY: 30},
    contentSize: "auto",
    onwindowresize: true,
    closeOnEscape: false,
    closeOnBackdrop: false,
    oninitialize: [] // specific to the dialog extension
}
```
- `jsPanel.dialog.dialogTemplateId` _String_ default: `"#dialogs"`  
The HTML of the used dialogs should be wrapped in a `<template>` tag to prevent them from being rendered in your document. The ID-attribute of the `<template>` tag must have the value of this property in order to be found by the script.
- `jsPanel.dialog.css` _object_ with a few CSS classes used by the script
```javascript
{
    primaryBtn: "blue", // primary button
    otherBtn: "white", // all other buttons
    buttonBar: "buttonbar", // the button bar
    promptInput: "prompt-input" // the input field in the prompt() alert
}
```
- `jsPanel.dialog.offsetY` _Integer_ default: `30`  
   A vertical offset applied to child dialogs
- `jsPanel.dialog.active` _Node object_ or _undefined_
   A read-only property that returns the currently active modal dialog.
- `jsPanel.dialog.depth` _Integer_
   A read-only property that reports the number of currently open modal dialogs.

## Methods
-   `async jsPanel.dialog.modal(html, options = {})`
-   `async jsPanel.dialog.alert(msg, buttons = ["OK"], options = {})`
-   `async jsPanel.dialog.confirm(msg, no = false, moreButtons = [], options = {})`
-   `async jsPanel.dialog.prompt(msg, preset = "", options = {})`
-   `jsPanel.dialog.closeAll()`
-   `panel.makeDialog()`

## Properties of a generated dialog
A jsPanel dialog receives a new property <mark>dialog</mark> having itself the following properties:
-   **elements** _object_ read-only  
    The panel property `elements` is a read-only object referencing all named HTML elements in the panel's content area by name. If you, for example, have a text field with a `name="user"` attribute, you can easily access that element by using `panel.dialog.elements.user`
-   **values** _object_ read-only  
    The panel property `values` is a read-only object referencing the value of all named HTML elements in the panel's content area by name.
    The `values` object recognizes these values:-   for input fields and textareas, it is the content
    -   for all elements with a `value` attribute, it is the value of that attribute
    -   for radio buttons and `<select>` elements, it is the value of the selected element
    -   for all other elements, like `<p>`, `<span>` and `<div>`, it is the inner HTML
-   **value**  
    Event handlers can set the value that the `jsPanel.dialog.modal()` method should return by setting `panel.dialog.value`.  
If no element sets that value explicitly, the dialog value is set to a clicked element's `value` property if there is no event handler defined for that element, and the element contains such an attribute.

## Method descriptions

## `async jsPanel.dialog.modal(html, options = {})`
Create and display a modal dialog.
**Returns: `panel.dialog.value`, or, if not set, the value of the last clicked element's `value` attribute.**
**Arguments:**
-   <mark>html</mark> _Node_ or _String_    
    The <mark>html</mark> parameter is either a **Node**, or a **text string**. If the text string is a CSS selector, the method first searches for that selector within a `<template id='dialogs'>` element, if present. If not found, the method searches the HTML content for a selector. In all cases, the HTML is deep-cloned, because dialogs may appear more than once. If the parameter is not a selector, the method attempts to convert the string to HTML if possible. The HTML's CSS attribute **display** is set to `""` to force display of the HTML.
    
    Example for a template tag:
```html
<template id="dialogs">
	<div class="simple-prompt dialog-sm" style="display:none">
	    <p>Please enter your name:</p>
	    <input class="..." type="text" name="input" />
	    <div class="buttonbar">
	        <button data-dismiss name="ok" class="...">OK</button>
	        <button data-dismiss data-cancel name="cancel" class="...">Cancel</button>
	    </div>
	</div>
</template>
```
    
-   <mark>options</mark> _Object_    
    Beside regular jsPanel options this object may contain additional callback handlers for **click** (see example below) and **input** events. Also, it may contain a function **oninitialize** that is called well after the dialog has been set up, and when it is safe to display other modal dialogs like alerts etc.

Example:
```javascript
let result = await jsPanel.dialog.modal('.simple-confirm', {
    theme: 'light filled',
    border: '1px solid gray',
    borderRadius: '.5rem',
    onclick_cancel: (panel, elmts, event) => {
        console.log(panel,elmts,event);
    }
});
```

## `async jsPanel.dialog.alert(html, buttons = ["OK"], options = {})`
Display an alert box.
**Returns: the value of the clicked button, if any. If the definition of the clicked button does not have a `value` property, the return value is undefined.**
**Arguments:**
-   <mark>html</mark> _Node_ or _String_    
    The <mark>html</mark> parameter is either a **Node**, or a **text string**. If the text string is a CSS selector, the method first searches for that selector within a `<template id='dialogs'>` element, if present. If not found, the method searches the HTML content for a selector. In all cases, the HTML is deep-cloned, because dialogs may appear more than once. If the parameter is not a selector, the method attempts to convert the string to HTML if possible. The HTML's CSS attribute **display** is set to `""` to force display of the HTML.
    
-   <mark>buttons</mark> _Array_ of button names, or objects that describe each button. Each button object can have up to four properties:
    -   `label` - the button label (required)
    -   `value` - the value of the button's **value** attribute (optional)
    -   `name` - the value of the button's **name** attribute for callbacks (optional)
    -   `css` - any CSS classes that the button should have

-   <mark>options</mark> _Object_    
    Beside regular jsPanel options this object may contain additional callback handlers for **click** (see example below) and **input** events. Also, it may contain a function **oninitialize** that is called well after the dialog has been set up, and when it is safe to display other modal dialogs like alerts etc.    

If only a text is supplied, the first button receives the class name(s) stored in `defaults.css.primaryBtn`, and all other buttons receive the class name(s) stored in `defaults.css.otherBtn`. Either the single button, or the second button also receives the attribute `data-cancel` to make it respond to the Escape key.

Example:
```javascript
let result = await jsPanel.dialog.alert(
    // param html
    'You are about to exit! Continue?',
    // param buttons
    [
        { label: 'Yes', value: 'YES', css: 'px-4 py-2 bg-gray-100 ...' },
        { label: 'No', value: 'NO', css: 'px-4 py-2 ...' },
        { label: 'Cancel', value: 'CANCEL', css: 'px-4 ...' },
    ],
    // param options
    { theme: 'success filleddark', border: '1px solid forestgreen', borderRadius: '.5rem' }
);
```

## `async jsPanel.dialog.confirm(html, no = false, moreButtons = [], options = {})`
Display an alert box with **Yes** and **No** buttons
**Returns: either `true` or `false`, or the `value` property of any additional button that has been clicked**
**Arguments:**
-   <mark>html</mark> _Node_ or _String_    
    The <mark>html</mark> parameter is either a **Node**, or a **text string**. If the text string is a CSS selector, the method first searches for that selector within a `<template id='dialogs'>` element, if present. If not found, the method searches the HTML content for a selector. In all cases, the HTML is deep-cloned, because dialogs may appear more than once. If the parameter is not a selector, the method attempts to convert the string to HTML if possible. The HTML's CSS attribute **display** is set to `""` to force display of the HTML.    
    
-   <mark>no</mark> _Boolean_    
    If set to `true`, the no parameter sets the default button to `"No"` instead of `"Yes"`. 
       
-   <mark>moreButtons</mark> _Array_    
    The moreButtons parameter is an array of button names, or objects that describe each button, which are added to these two buttons.    
    
-   <mark>options</mark> _Object_    
    Beside regular jsPanel options this object may contain additional callback handlers for **click** (see example below) and **input** events. Also, it may contain a function **oninitialize** that is called well after the dialog has been set up, and when it is safe to display other modal dialogs like alerts etc.

Example:
```javascript
let result = await jsPanel.dialog.confirm("<p>You are about to exit! Continue?</p>");
```

## `async jsPanel.dialog.prompt(html, preset = "", options = {})`
Display an alert box with a text input field, and **OK** and **Cancel** buttons.
The text field receives the CSS class name stored in `defaults.css.promptInput`.
**Returns: the entered text if the user clicked **OK**, or `null` if the user clicked **Cancel**.**
**Arguments:**
-   <mark>html</mark> _Node_ or _String_    
    The <mark>html</mark> parameter is either a **Node**, or a **text string**. If the text string is a CSS selector, the method first searches for that selector within a `<template id='dialogs'>` element, if present. If not found, the method searches the HTML content for a selector. In all cases, the HTML is deep-cloned, because dialogs may appear more than once. If the parameter is not a selector, the method attempts to convert the string to HTML if possible. The HTML's CSS attribute **display** is set to `""` to force display of the HTML.
    
-   <mark>preset</mark> _String_    
    The preset parameter can be used to preset the value of the input field.
    
-   <mark>options</mark> _Object_    
    Beside regular jsPanel options this object may contain additional callback handlers for **click** (see example below) and **input** events. Also, it may contain a function **oninitialize** that is called well after the dialog has been set up, and when it is safe to display other modal dialogs like alerts etc.

Example:
```javascript
let result = await jsPanel.dialog.prompt("Please enter your name!");
```
Example with static version of the prompt(html, preset, options) function:
```javascript
let result = await jsPanel.dialog.modal(".simple-prompt", {
    onclick_ok: panel => panel.dialog.value = panel.dialog.values.input,
    onclick_cancel: panel => panel.dialog.value = null
});
```

## `jsPanel.dialog.closeAll()`
Closes all open modal dialogs.

## `panel.makeDialog()`
Adds dialog functionality to any jsPanel. Scans the content for named elements, and creates and attaches the **dialog** object to the panel. Overwrites the `closeOnEscape` option with a custom function. Finally, defines event handlers for **click**, **dblclick** and **input** events and attaches them to the panel.

## The content (HTML) of a dialog
The dialog extension offers various ways to define the HTML that is to be displayed in the dialog.

**CSS selectors inside a `<template>` element**
The extension searches for a `<template>` element with the ID of "dialogs" (the default ID can be changed, see below). If the dialog HTML is found within that template tag, it is deep-cloned into the main DOM. This lets you use IDs if necessary. This is the preferred approach; if there is no `<template>` element with an ID of `"dialogs"`, or the selector is not part of that element, the search is repeated in the main DOM.

**Nodes or DocumentFragments**
Supply the Node to display.

**CSS selectors**
Supply the CSS selector of the HTML to display. This approach has two limitations. First, you should refrain from using IDs, because the extension deep-clones the HTML, thus creating multiple IDs with the same name. Second, the HTML should be initially invisible by adding `style="display:none"` to the dialog element.

**HTML strings**
Finally, you can use HTML strings. The extension converts the string to a DocumentFragment by calling `jsPanel.strToHtml(str)`.

## Predefined dialog sizes
The extension offers a few css classes to be applied to dialogs to control their width:

-   `dialog-sm` → `400px`
-   `dialog-md` → `600px`
-   `dialog-lg` → `800px`
-   `dialog-xl` → `1000px`

All dialogs are limited to a height of 90% screen minus their initial vertical offset, with an automatic vertical scroll bar.
The classes offer limited responsive functionality, limiting their width to 90% screen, depending on the screen width.

## CSS
The CSS file contains a few classes to colorize buttons, and to make sure that a text following a checkbox or radio button is aligned properly. Also, it defines the look and feel of disabled elements.

## HTML attributes
The extension honors the presence of several HTML attributes. These attributes are not restricted to dialog elements; you can set them at any HTML element, like an image, for example.

`data-dismiss`
Causes the dialog panel to close when clicked.

`data-cancel`
A HTML element with this attribute would receive a click event when the user presses the Esc ape key. The handler for this attribute replaces the option's `closeOnEscape` handler.

`data-dblclick`
An element with this attribute would respond to a doubleclick event.

## Event handlers
For each named element, the panel options can contain event handlers for click and/or input events. The name of the event handler begins with either `onclick_` or `oninput_`, followed by the name of the element to listen to. For the above text input with the name `user`, this would, for example, be `oninput_user`. The three arguments are the <mark>panel</mark>, the <mark>affected HTML elements</mark>, and the <mark>event</mark>.

jsPanel's `callback` handler is fine to initialize the dialog. If, however, the handler needs to display a modal dialog, `callback` should not be used, because not everything is in place yet. Instead, use the new `oninitialize` handler. This handler is guaranteed to be called when everything has been set up. Its single argument is the <mark>panel</mark>.

## Modal Dialogs
Modal dialogs can be nested just fine. Dialogs that are moved to the background are made partially transparent, and a vertical offset is added to each new nested modal dialog.

Dialogs are created as white boxes with no headers and slightly rounded corners, centered horizontally.
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTI3NjgzMTg1NCwtMTkxNTA1NDk4XX0=
-->
