## CHANGELOG

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
