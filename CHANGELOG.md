## CHANGELOG

### Version 4.0.0-beta.1 *released 2017-12-07*

First public beta version of jsPanel 4

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