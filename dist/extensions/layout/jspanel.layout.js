/* jspanel.layout.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

//import {jsPanel} from '../../jspanel.js';

if (!jsPanel.layout) {

    jsPanel.layout = {

        version: '1.1.0',
        date: '2018-11-30 10:30',

        save: function save() {
            var saveConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var selector = saveConfig.selector ? saveConfig.selector : '.jsPanel-standard';
            var storage = saveConfig.storagename ? saveConfig.storagename : 'jspanels';

            var collection = document.querySelectorAll(selector);
            var panels = [];
            collection.forEach(function (item) {
                var panelData = item.currentData;
                panelData.status = item.status;
                panelData.zIndex = item.style.zIndex;
                panelData.id = item.id;
                panels.push(panelData);
            });
            panels.sort(function (a, b) {
                return a.zIndex - b.zIndex;
            });

            window.localStorage.removeItem(storage);
            var storedData = JSON.stringify(panels);
            window.localStorage.setItem(storage, storedData);
            return storedData;
        },
        getAll: function getAll() {
            var storagename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'jspanels';

            if (localStorage[storagename]) {
                return JSON.parse(localStorage[storagename]);
            } else {
                return false;
            }
        },
        getId: function getId(id) {
            var storagename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jspanels';

            if (localStorage[storagename]) {
                var panels = this.getAll(storagename),
                    panel = void 0;
                panels.forEach(function (item) {
                    if (item.id === id) {
                        panel = item;
                    }
                });
                if (panel) {
                    return panel;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        restoreId: function restoreId() {
            var restoreConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var id = void 0,
                config = void 0,
                storage = void 0;
            if (!restoreConfig.id || !restoreConfig.config) {
                console.error('Id or prefdefined panel configuration is missing!');
                return false;
            } else {
                id = restoreConfig.id;
                config = restoreConfig.config;
                storage = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
            }

            var storedpanel = this.getId(id, storage);
            if (storedpanel) {
                var savedConfig = {
                    id: storedpanel.id,
                    setStatus: storedpanel.status,
                    panelSize: { width: storedpanel.width, height: storedpanel.height },
                    position: { my: 'left-top', at: 'left-top', offsetX: storedpanel.left, offsetY: storedpanel.top },
                    zIndex: storedpanel.zIndex
                };
                var useConfig = Object.assign({}, config, savedConfig);
                var restoredPanel = jsPanel.create(useConfig);
                restoredPanel.style.zIndex = savedConfig.zIndex;
                return restoredPanel;
            }
        },
        restore: function restore() {
            var restoreConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var predefinedConfigs = void 0,
                storage = void 0;
            if (!restoreConfig.configs) {
                console.error('Object with prefdefined panel configurations is missing!');
                return false;
            } else {
                predefinedConfigs = restoreConfig.configs;
                storage = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
            }

            if (localStorage[storage]) {
                var storedPanels = this.getAll(storage);
                // loop over all panels in storage
                storedPanels.forEach(function (item) {
                    var pId = item.id;
                    // loop over predefined configs to find config with pId
                    // this makes it unnecessary that identifiers for a certain config is the same as id in config
                    for (var conf in predefinedConfigs) {
                        if (predefinedConfigs.hasOwnProperty(conf)) {
                            if (predefinedConfigs[conf].id === pId) {
                                //jsPanel.layout.restoreId(pId, predefinedConfigs[conf], storage);
                                jsPanel.layout.restoreId({ id: pId, config: predefinedConfigs[conf], storagename: storage });
                            }
                        }
                    }
                });
            } else {
                return false;
            }
        }
    };
}

// Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html
if (typeof module !== 'undefined') {
    module.exports = jsPanel;
}