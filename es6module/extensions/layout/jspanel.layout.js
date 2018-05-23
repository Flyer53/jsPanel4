/* jspanel.layout.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

import {jsPanel} from '../../jspanel.js';

if (!jsPanel.layout) {

    jsPanel.layout = {

        version: '1.0.0',
        date: '2018-04-04 09:05',

        save(saveConfig = {}) {
            let selector = saveConfig.selector ? saveConfig.selector : '.jsPanel-standard';
            let storage  = saveConfig.storagename ? saveConfig.storagename : 'jspanels';

            const collection = document.querySelectorAll(selector);
            let panels = [];
            collection.forEach(item => {
                let panelData =    item.currentData;
                panelData.status = item.status;
                panelData.zIndex = item.style.zIndex;
                panelData.id =     item.id;
                panels.push(panelData);
            });
            panels.sort(function(a, b) {
                return a.zIndex - b.zIndex;
            });

            window.localStorage.removeItem(storage);
            let storedData = JSON.stringify(panels);
            window.localStorage.setItem(storage, storedData);
            return storedData;
        },

        getAll(storagename = 'jspanels') {
            if (localStorage[storagename]) {
                return JSON.parse(localStorage[storagename]);
            } else {
                return false;
            }
        },

        getId(id, storagename = 'jspanels') {
            if (localStorage[storagename]) {
                let panels = this.getAll(storagename),
                    panel;
                panels.forEach(item => {
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

        restoreId(restoreConfig = {}) {
            let id, config, storage;
            if (!restoreConfig.id || !restoreConfig.config) {
                console.error('Id or prefdefined panel configuration is missing!');
                return false;
            } else {
                id = restoreConfig.id;
                config = restoreConfig.config;
                storage = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
            }

            let storedpanel = this.getId(id, storage);
            if (storedpanel) {
                let savedConfig = {
                    id: storedpanel.id,
                    setStatus: storedpanel.status,
                    panelSize: {width: storedpanel.width, height: storedpanel.height},
                    position: {my: 'left-top', at: 'left-top', offsetX: storedpanel.left, offsetY: storedpanel.top},
                    zIndex: storedpanel.zIndex
                };
                let useConfig = Object.assign({}, config, savedConfig);
                let restoredPanel = jsPanel.create(useConfig);
                restoredPanel.style.zIndex = savedConfig.zIndex;
                return restoredPanel;
            }
        },

        restore(restoreConfig = {}) {
            let predefinedConfigs, storage;
            if (!restoreConfig.configs) {
                console.error('Object with prefdefined panel configurations is missing!');
                return false;
            } else {
                predefinedConfigs = restoreConfig.configs;
                storage = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
            }

            if (localStorage[storage]) {
                let storedPanels = this.getAll(storage);
                // loop over all panels in storage
                storedPanels.forEach(function (item) {
                    let pId = item.id;
                    // loop over predefined configs to find config with pId
                    // this makes it unnecessary that identifiers for a certain config is the same as id in config
                    for (let conf in predefinedConfigs) {
                        if (predefinedConfigs.hasOwnProperty(conf)) {
                            if (predefinedConfigs[conf].id === pId) {
                                //jsPanel.layout.restoreId(pId, predefinedConfigs[conf], storage);
                                jsPanel.layout.restoreId({id: pId, config: predefinedConfigs[conf], storagename: storage});
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
