## CHANGELOG

### Version 4.5.0 *released 2019-02-12*

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

### Version 4.4.0 *released 2018-11-30*

+ **added** theme modifier `fillcolor` to specify a custom background color for the content section
+ **updated** option `border` accepts all color names usable with option `theme`
+ **updated** method `.overlaps()`
+ **bugfix** in option `resizeit`
+ **bugfix** in option `onwindowresize`
+ **bugfix** in option `dragit` concerning option `onwindowresize`
+ **updated** `start`, `stop`, `drag/resize` callbacks in options `dragit/resizeit` now additionally get the `event object` as argument
+ **added** polyfill for `String.prototype.includes()`
+ **added** CommonJS module exports

### Version 4.3.0 *released 2018-11-10*

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

### Version 4.2.1 *released 2018-09-14*

+ **fix** in methods `setHeaderLogo()` and `setHeaderTitle()` - logo and title are now updated in minimized replacement as well
+ **fix** in css concerning only IE11 when using very long title texts (controls were pushed out of panel boundaries)
+ **fix** in options `dragit` and `resizeit` - see https://github.com/Flyer53/jsPanel4/issues/53
+ **added:** All parameters of option `position` now accept a function as value

### Version 4.1.2 *released 2018-08-13*

+ **fix** in options `dragit` and `resizeit` - handler was not unbound when mouse cursor came over a `<object>` tag in content section of a jsPanel
+ **added** click on modal backdrop will close a modal jsPanel
+ **changed** `option.closeOnEscape` is set to `true` by default for a modal jPanel

### Version 4.1.1 *released 2018-07-25*

+ **fixed** `jspanel.min.js` to make it work with IE11
+ **fixed** CSS and JS to improve compatibility with Bootstrap > 4.1.2
+ **fix** in the internal function applying a arbitrary theme
+ **replaced** some wrong files in the folder `es6module`

### Version 4.1.0 *released 2018-07-20*

+ **improved** method `.smallify()`
+ **added** method `jsPanel.addScript()` in order to add a script to the document
+ **added** option `borderRadius` applies a css border-radius to the panel
+ when using a mouse **draging/resizing** and **all controls** of a panel are now limited to the left mouse button

### Version 4.0.0 *released 2018-05-23*

+ **bugfix** in the dock extensions
+ **bugfix** in the function creating the minimized replacement
+ **option resizeit** defaults of `minWidth` and `minHeight` set to `128`
+ various tweaks in css and js

### Version 4.0.0-beta.5.1 *released 2018-04-19*

+ **fixes** a typo disabling option `onwindowresize`

### Version 4.0.0-beta.5 *released 2018-04-19*

+ **new** events `jspaneldragstart`, `jspaneldrag`, `jspaneldragstop`, `jspanelresizestart`, `jspanelresize`, `jspanelresizestop`
+ **new** extension **`dock`** extending a jsPanel with the method `.dock()`. This method allows to _dock_ one or more _slave_ panels to a _master_ panel. Basically that means a _slave_ panel is dragged, maximized, normalized, minimized, closed and optionally resized together with the _master_ panel it's docked to.
+ **bugfix** in option `dragit`
+ **bugfix** in extension `layout`
+ **bugfix** in `jspanel.css`
+ **bugfix** in CSS for Right-To-Left panels
+ **removed** CSS `border-radius` settings from themes

### Version 4.0.0-beta.4.1 *released 2018-04-04*

+ **bugfix** in jspanel.css

### Version 4.0.0-beta.4 *released 2018-03-30*

+ **fix** in method **resizeit()**
+ **fix** in method **jsPanel.ajax()**
+ **fix** in methods **smallify()** and **unsmallify()**
+ **fix** in CSS for minimized panel containers
+ **improved** option **minimizedTo**
+ **improved** option **position**
+ **added** option **contentOverflow**
+ **replaced** option **headerRemove** with option **header**
+ various tweaks in css and js

### Version 4.0.0-beta.3 *released 2018-02-17*

+ **added** property **globalCallbacks** to the global object **jsPanel** lets you add callback functions to all or a limited set of jsPanels at once
+ **change:** as of version 4.0.0-beta.3 jsPanel uses built-in SVGs for the controls icons. SVGs are stored in the new property **icons** of the global object jsPanel. So the directory **fonts** with all the _jsglyph_ icontfont files is obsolete
+ **change:** use of the PointerEvent API is turned off, only touch events and/or mouse events are used
+ **improved:** panel is fronted upon click in content section even if content is an iframe
+ **change:** *start, drag/resize, stop* callbacks of options **dragit/resizeit** now accept an array of functions
+ **change:** all **option.on...** callbacks except option.onwindowresize now accept an array of functions. **This change might necessitate a modification of your code**
+ **various bugfixes and improvements in js and css**
+ **ADDED** folder **es6module** with all necessary files to run jsPanel as native ES6 module

### Version 4.0.0-beta.2 *released 2018-01-08*

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

### Version 4.0.0-beta.1 *released 2017-12-07*

First public beta version of jsPanel version 4
