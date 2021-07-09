## <span style='color:#563D7C;'>CHANGELOG</span>

### <span style='color:#563D7C;'>Version 4.12.0 *2021-07-09*</span>

+ updated CSS files to **bugfix** a minor issue in `option.minimizeTo`
+ **bugfix** in `resizeit` interaction 
+ **added** string value `'closed'` to panel property `status`. Since a closed panel is removed from the DOM this value is only available when a panel reference is saved.
+ **added** option to use a custom callback function as setting for `option.closeOnEscape` instead of just boolean true/false

### <span style='color:#563D7C;'>Version 4.11.4 *2021-04-10*</span>

+ **bugfix** in `dragit` interaction
+ **improved** panel positioning, dragit and snap features in order to allow for scrollbars
+ **added** option `parentPanelFront` to the tooltip configuration options (tooltip extension updated to v1.4.0)

### <span style='color:#563D7C;'>Version 4.11.3 *2021-02-03*</span>

+ **bugfix** in the code for the `resizeit` interaction reducing memory leaks. [See GitHub issue](https://github.com/Flyer53/jsPanel4/issues/121)
+ **bugfix** when using the **dock** extension a _docked_ panel:
  + did not reposition when the _master_ panel was repositioned programmatically
  + did not reposition when the _master_ panel was resized programmatically
  + did not reposition when **option** `onwindowresize` is activated and the window is resized
+ **bugfix** `layout` extension: `jsPanel.layout.restoreId` now returns the restored panel
+ **added** parameter `closeOnMouseleave` in `contextmenu` extension

### <span style='color:#563D7C;'>Version 4.11.2 *2020-12-09*</span>

+ **bugfix** in the code for the `dragit` interaction reducing memory leaks. [See GitHub issue](https://github.com/Flyer53/jsPanel4/issues/121)

### <span style='color:#563D7C;'>Version 4.11.1 *2020-11-23*</span>

+ **bugfix** in the `maximize()` method

### <span style='color:#563D7C;'>Version 4.11.0 *2020-11-20*</span>

+ **renamed** panel property `autocloseProgressbar` to `progressbar`. The old property name remains usable for compatibility.
+ **bugfix** in option `onwindowresize`
+ various internal improvements in js and css

**See also the changelog of _v4.11.0-beta_ for a list of changes compared with _v4.10.2_**

### <span style='color:#563D7C;'>Version 4.11.0-beta *2020-09-06*</span>

+ **added** method `jsPanel.strToHtml(str)` converting a DOMString to a `DocumentFragment`.
+ **added** option `opacity`
+ **bugfix** in _modal_ extension concerning the use of `onclosed` callback.
+ **bugfix** in `autoposition` parameter of option `position`.
+ **bugfix** in option `onwindowresize`.
+ **updated** `jsPanel.ajax()` in order to improve its usability as general purpose AJAX tool.<br>**This update might require a change in your code if you use `jsPanel.ajax()` and/or option `contentAjax`.**
+ **updated** `jsPanel.fetch()` in order to improve its usability as general purpose Fetch tool.<br>**This update might require a change in your code if you use `jsPanel.fetch()` and/or option `contentFetch`.**
+ **updated** option `contentAjax` optionally loads only a page fragment.
+ **updated** CSS for controlbar
+ **updated** header title is now wrapped in a `<div>` instead of a `<span>`
+ **updated**  _contextmenu_ extension due to changes in `jsPanel.ajax()`.
+ **updated** dock extension internally. Should not affect existing code.
+ **disabled** the use of the Pointer Events API. So for now only Touch and Mouse events are used by a panels controls and dragit/resizeit interactions.

### <span style='color:#563D7C;'>Version 4.10.2 *2020-05-01*</span>

+ **bugfix** in _modal_ extension concerning the use of `onclosed` callback
+ **bugfix** in `autoposition` feature of option `position`

### <span style='color:#563D7C;'>Version 4.10.1 *2020-04-09*</span>

+ **bugfix** in `autoposition` feature of `option.position`
+ **updated** `datepicker` extension (which is still experimental)

### <span style='color:#563D7C;'>Version 4.10.0 *2020-03-10*</span>

+ **bugfix** in the resizeit functionality, issue https://github.com/Flyer53/jsPanel4/issues/117
+ **fixed** CSS issue concerning header logo in minimized panel
+ **added** method `jsPanel.toggleClass()`
+ **added** option `data`
+ **updated** `layout` extension
+ **updated** all jsPanel events (`jspanelloaded`, `jspanelclosed`, etc.) are now cancelable

### <span style='color:#563D7C;'>Version 4.9.5 *2020-02-01*</span>

+ **bugfix** in option resizeit parameter `aspectRatio` when using modifier keys
+ **fixed/improved** some minor code issues

### <span style='color:#563D7C;'>Versions 4.9.3/4.9.4 *2020-01-16*</span>

+ this releases only fix an issue with `package.json`

### <span style='color:#563D7C;'>Version 4.9.2 *2020-01-15*</span>

+ **updated** events `jspanelclosed` and `jspanelcloseduser`
+ **updated** `dock` extension: master AND slave panels get the same z-index value if either
panel is fronted. Recoded event handling within the extension.
+ **updated** panel template to fix an issue with IE11

### <span style='color:#563D7C;'>Version 4.9.1 *2019-12-11*</span>

This release fixes a typo in the js files of folder `es6module`. Other files are not affected.

### <span style='color:#563D7C;'>Version 4.9.0 *2019-12-10*</span>

+ **bugfix** in option `onwindowresize`
+ **bugfix** in `dragit.disableOnMaximized`
+ **bugfix** in `dragit.snap` feature
+ **bugfix** in option `resizeit`
+ **bugfix** in option `syncMargins`
+ **bugfix** in and updated `layout extension`
+ **bugfix** in method `.setHeaderLogo()`
+ **added** jsPanel events: implemented _event_ property `panel` referring to the panel firing the _event_
+ **added** `dragit.snap` parameter `active`
+ **added** almost all option `dragit` and `resizeit` parameters are now editable for already existing panels
+ **added** option `maximizedMargin` is now editable for existing panels
+ **added** first implementation of `dragit.drop` allowing to move a panel from its current parent element to another one
+ **added** <kbd>SHIFT</kbd> modifier key action to the resizeit interaction
+ **updated** option `resizeit` _modifier key_ functionality
+ **updated** options `dragit` and `resizeit`: the start, drag/resize and stop callbacks now receive the same
argument _paneldata_ (instead of args position/size) with css **left**, **top**, **width** and **height** data
+ **improved** handling of `contentSize:"auto"` / `panelSize:"auto"` when combined with `autoclose`

### <span style='color:#563D7C;'>Version 4.8.0 *2019-11-08*</span>

+ **bugfix** in option `resizeit` and panel method `resize()`
+ **bugfix** in method `jsPanel.close()`
+ **added** setting `"content"` to parameter `aspectRatio` of option `resizeit` in order to maintain
the aspect ratio of the content section while resizing a panel
+ **added** support for Font Awesome duotone icons to option `iconfont`
+ **added** modifier keys to the `resizeit` feature
+ **updated** z-index handling in `modal extension`
+ **updated** handling of `iframes` in the content section while dragging/resizing a panel
+ **updated** event sequence: `jspanelcloseduser` is now fired before `jspanelclosed`
+ **updated** option `onclosed` callback receives a second argument `closedByUser` set to `true` if the panel is closed by user action
+ **updated** option `onbeforeclose` callback receives a third argument `closedByUser` set to `true` if the panel is closed by user action
+ **updated** modal extension due to the updated method `jsPanel.close()`

### <span style='color:#563D7C;'>Version 4.7.0 *2019-06-18*</span>

+ **bugfix** in option `dragit`
+ **bugfix** in option `resizeit`
+ **bugfix** in method `normalize()`
+ **bugfix** in method `resize()`
+ **bugfix** in `jsPanel.addScript()`
+ **bugfix** in the `contextmenu` extension
+ **bugfix** in the `dock` extension
+ **completely recoded** methods handling option `position`
+ **completely recoded** options `onwindowresize` and `onparentresize`
+ **added** option `addCloseControl` to add an additional close control to the
panel (might be handy if the header section is removed)
+ **added** a customizable progressbar to option `autoclose`
+ **added** method `addControl()` to add custom controls to the controlbar of existing panels
+ **added** tooltip method `remove()` in order to remove a handler triggering a specific tooltip
+ **added** polyfill `Number.isInteger()` to support IE11
+ **updated** option `headerControls` in order to add custom controls
+ **option theme:** when `theme: "none"` or the method `setTheme()` is used 
properties assigned via options `border` and/or `borderRadius` remain untouched
+ reworked SVG icons for the controls
+ **updated** methods `setBorder()` and `setBorderRadius()` are now available to
existing panels in order to set/change CSS border/borderRadius
+ **updated** options `border` and `borderRadius`
+ **updated tooltip extension:** due to new positioning methods
+ **updated layout extension:** added optional use of `sessionStorage` instead of `localStorage`
+ **updated hint extension:** due to updated header controls
+ various internal bugfixes

### <span style='color:#563D7C;'>Version 4.6.0 *2019-03-27*</span>

+ **bugfix** in `option.dragit.snap` concerning use of `trigger: 'pointer'`
+ **bugfix** concerning `jspaneldragstop/jspanelresizestop` events
+ **bugfix** in method `front()`
+ **bugfix** in tooltip extension
+ **added** theme modifier `'filleddark'`
+ **added** parameter `size` to option `headerControls` in order to set size of controls
+ **added** some more return values to method `overlaps()`
+ **added** `jsPanel.errorReporting` to turn off/on error jsPanel reporting
+ various minor fixes and improvements

### <span style='color:#563D7C;'>Version 4.5.0 *released 2019-02-12*</span>

+ jsPanel now uses **pointer events** if supported
+ **bugfix** - recoded the complete `close()` function to fix a long standing bug
+ **bugfix** in `jsPanel.position()` concerning the use of the **dock extension**
+ **bugfix** in `minimize()` concerning the use of an image as background
+ **bugfix** in option `dragit`
+ **bugfix** in `tooltip` extension
+ jsPanel **themes** got numerous updates:
  + additional built-in themes
  + updated built-in theme colors
  + all built-in themes are are now "normal" color themes &rarr; less CSS
  + recoded bootstrap theme support &rarr; no more bootstrap adjustments in *jspanel.css* needed
  + option theme can now be used with an object as value &rarr; more theming options and better support of images (includes css gradients) as panel background
  + reworked built-in controls icons, updated CSS accordingly and changed hover effect of controls
+ **added** option `onparentresize` to autoreposition childpanels on various resize actions of the parentpanel
+ **added** parameter `status` to the callbacks `onbeforemaximize`, `onmaximized` etc.
+ **added** parameter options `'hide'` and `'show'` to panel method `setControlStatus()` parameter `action`
+ **added** optional callback function to panel method `getChildpanels()` and the method now returns a NodeList (instead of an array)
+ **added** optional callback function to panel method `isChildpanel()`
+ **added** support for setting `option.position.of` in a **position shorthand string**
+ various minor fixes/improvements in js and css

#####Note:
The numerous updates in theming might require an update of your code in case you used some kind of custom theme since there no more are theme specific css classes applied to a jsPanel.

### <span style='color:#563D7C;'>Version 4.4.0 *released 2018-11-30*

+ **added** theme modifier `fillcolor` to specify a custom background color for the content section
+ **updated** option `border` accepts all color names usable with option `theme`
+ **updated** method `.overlaps()`
+ **bugfix** in option `resizeit`
+ **bugfix** in option `onwindowresize`
+ **bugfix** in option `dragit` concerning option `onwindowresize`
+ **updated** `start`, `stop`, `drag/resize` callbacks in options `dragit/resizeit` now additionally get the `event object` as argument
+ **added** polyfill for `String.prototype.includes()`
+ **added** CommonJS module exports

### <span style='color:#563D7C;'>Version 4.3.0 *released 2018-11-10*</span>

+ **added** event `jspanelcloseduser` which is fired when a panel is closed using the header control
+ **added** panel method `.overlaps()`
+ **added** parameter `aspectRatio` to option `resizeit`
+ **updated** panel method `.close()` - it now has a return value depending on whether the panel was closed successfully or not
+ `option.container` default value is changed to `'window'`. This might need a change in existing code when `container: doccument.body` is used even though this was the default previously
+ `option.maximizedMargin` now accepts a function as value
+ `option.theme` supports color names derived from the Material Design Color System like `'bluegray700'`, `'orangeA400'` etc.
+ **options** `position`, `dragit` and `resizeit` now correctly position, drag and resize panels appended to a container using css `transform: scale()` if both container and panel are scaled
+ **bugfix** in global color methods
+ **modal extension:** minor bugfixes
+ **tooltip extension:**
    + **added** method `jsPanel.tooltip.reposition()` to reposition existing tooltips
    + **added** parameter `autoshow` for tooltips
    + **added** support for tooltips positioned relative to another element than target
    + **improved** tooltip connectors
    + a few **bugfixes** in the tooltip extension
    + tooltip extension will load a `MouseEvent()` polyfill for IE11
+ various tweaks in css and js

### <span style='color:#563D7C;'>Version 4.2.1 *released 2018-09-14*</span>

+ **fix** in methods `setHeaderLogo()` and `setHeaderTitle()` - logo and title are now updated in minimized replacement as well
+ **fix** in css concerning only IE11 when using very long title texts (controls were pushed out of panel boundaries)
+ **fix** in options `dragit` and `resizeit` - see https://github.com/Flyer53/jsPanel4/issues/53
+ **added:** All parameters of option `position` now accept a function as value

### <span style='color:#563D7C;'>Version 4.1.2 *released 2018-08-13*</span>

+ **fix** in options `dragit` and `resizeit` - handler was not unbound when mouse cursor came over a `<object>` tag in content section of a jsPanel
+ **added** click on modal backdrop will close a modal jsPanel
+ **changed** `option.closeOnEscape` is set to `true` by default for a modal jPanel

### <span style='color:#563D7C;'>Version 4.1.1 *released 2018-07-25*</span>

+ **fixed** `jspanel.min.js` to make it work with IE11
+ **fixed** CSS and JS to improve compatibility with Bootstrap > 4.1.2
+ **fix** in the internal function applying a arbitrary theme
+ **replaced** some wrong files in the folder `es6module`

### <span style='color:#563D7C;'>Version 4.1.0 *released 2018-07-20*</span>

+ **improved** method `.smallify()`
+ **added** method `jsPanel.addScript()` in order to add a script to the document
+ **added** option `borderRadius` applies a css border-radius to the panel
+ when using a mouse **draging/resizing** and **all controls** of a panel are now limited to the left mouse button

### <span style='color:#563D7C;'>Version 4.0.0 *released 2018-05-23*</span>

+ **bugfix** in the dock extensions
+ **bugfix** in the function creating the minimized replacement
+ **option resizeit** defaults of `minWidth` and `minHeight` set to `128`
+ various tweaks in css and js

### <span style='color:#563D7C;'>Version 4.0.0-beta.5.1 *released 2018-04-19*</span>

+ **fixes** a typo disabling option `onwindowresize`

### <span style='color:#563D7C;'>Version 4.0.0-beta.5 *released 2018-04-19*</span>

+ **new** events `jspaneldragstart`, `jspaneldrag`, `jspaneldragstop`, `jspanelresizestart`, `jspanelresize`, `jspanelresizestop`
+ **new** extension **`dock`** extending a jsPanel with the method `.dock()`. This method allows to _dock_ one or more _slave_ panels to a _master_ panel. Basically that means a _slave_ panel is dragged, maximized, normalized, minimized, closed and optionally resized together with the _master_ panel it's docked to.
+ **bugfix** in option `dragit`
+ **bugfix** in extension `layout`
+ **bugfix** in `jspanel.css`
+ **bugfix** in CSS for Right-To-Left panels
+ **removed** CSS `border-radius` settings from themes

### <span style='color:#563D7C;'>Version 4.0.0-beta.4.1 *released 2018-04-04*</span>

+ **bugfix** in jspanel.css

### <span style='color:#563D7C;'>Version 4.0.0-beta.4 *released 2018-03-30*</span>

+ **fix** in method **resizeit()**
+ **fix** in method **jsPanel.ajax()**
+ **fix** in methods **smallify()** and **unsmallify()**
+ **fix** in CSS for minimized panel containers
+ **improved** option **minimizedTo**
+ **improved** option **position**
+ **added** option **contentOverflow**
+ **replaced** option **headerRemove** with option **header**
+ various tweaks in css and js

### <span style='color:#563D7C;'>Version 4.0.0-beta.3 *released 2018-02-17*</span>

+ **added** property **globalCallbacks** to the global object **jsPanel** lets you add callback functions to all or a limited set of jsPanels at once
+ **change:** as of version 4.0.0-beta.3 jsPanel uses built-in SVGs for the controls icons. SVGs are stored in the new property **icons** of the global object jsPanel. So the directory **fonts** with all the _jsglyph_ icontfont files is obsolete
+ **change:** use of the PointerEvent API is turned off, only touch events and/or mouse events are used
+ **improved:** panel is fronted upon click in content section even if content is an iframe
+ **change:** *start, drag/resize, stop* callbacks of options **dragit/resizeit** now accept an array of functions
+ **change:** all **option.on...** callbacks except option.onwindowresize now accept an array of functions. **This change might necessitate a modification of your code**
+ **various bugfixes and improvements in js and css**
+ **ADDED** folder **es6module** with all necessary files to run jsPanel as native ES6 module

###<span style='color:#563D7C;'> Version 4.0.0-beta.2 *released 2018-01-08*</span>

+ **new** setting **trigger** for option.dragit.snap
+ **new** setting **containment** for option.dragit.snap
+ **new** setting **repositionOnSnap** for option.dragit.snap
+ **new** setting **resizeToPreSnap** for option.dragit.snap
+ **new** panel property **snapped**
+ **option.syncMargins**, if used, will set option.dragit.snap.containment to *true*
+ **new** options **contentSize** and **panelSize** now accept percentage values
+ **change** in options contentSize and panelSize: if a string has only one value the second one is set to the first by default
+ **new** setting **ttipEvent** for tooltip extension
+ **added** polyfills to improve compatibility with IE11
+ **various bugfixes and internal improvements**

### <span style='color:#563D7C;'>Version 4.0.0-beta.1 *released 2017-12-07*</span>

First public beta version of jsPanel version 4
