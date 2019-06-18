/* jspanel.layout.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

import {jsPanel} from '../../jspanel.js';

if (!jsPanel.layout) {

    jsPanel.layout = {

        version: '1.2.0',
        date: '2019-04-22 09:15',
        storage: localStorage,

        save(saveConfig = {}) {
            let selector = saveConfig.selector ? saveConfig.selector : '.jsPanel-standard';
            let storageName  = saveConfig.storagename ? saveConfig.storagename : 'jspanels';

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

            this.storage.removeItem(storageName);
            let storedData = JSON.stringify(panels);
            this.storage.setItem(storageName, storedData);
            return storedData;
        },

        getAll(storagename = 'jspanels') {
            if (this.storage[storagename]) {
                return JSON.parse(this.storage[storagename]);
            } else {
                return false;
            }
        },

        getId(id, storagename = 'jspanels') {
            if (this.storage[storagename]) {
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
            let id, config, storageName;
            if (!restoreConfig.id || !restoreConfig.config) {
                console.error('Id or predefined panel configuration is missing!');
                return false;
            } else {
                id = restoreConfig.id;
                config = restoreConfig.config;
                storageName = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
            }

            let storedpanel = this.getId(id, storageName);
            if (storedpanel) {
                let savedConfig = {
                    id: storedpanel.id,
                    setStatus: storedpanel.status,
                    panelSize: {width: storedpanel.width, height: storedpanel.height},
                    //position: {my: 'left-top', at: 'left-top', offsetX: storedpanel.left, offsetY: storedpanel.top},
                    // for some reason I didn't find out yet position results in doubled offsets????
                    // therefore simply apply left and top as below
                    zIndex: storedpanel.zIndex
                };
                let useConfig = Object.assign({}, config, savedConfig);
                let restoredPanel = jsPanel.create(useConfig);
                restoredPanel.style.zIndex = savedConfig.zIndex;

                restoredPanel.style.left = storedpanel.left;
                restoredPanel.style.top = storedpanel.top;

                return restoredPanel;
            }
        },

        restore(restoreConfig = {}) {
            let predefinedConfigs, storageName;
            if (!restoreConfig.configs) {
                console.error('Object with predefined panel configurations is missing!');
                return false;
            } else {
                predefinedConfigs = restoreConfig.configs;
                storageName = restoreConfig.storagename ? restoreConfig.storagename : 'jspanels';
            }

            if (this.storage[storageName]) {
                let storedPanels = this.getAll(storageName);
                // loop over all panels in storageName
                storedPanels.forEach(function (item) {
                    let pId = item.id;
                    // loop over predefined configs to find config with pId
                    // this makes it unnecessary that identifiers for a certain config is the same as id in config
                    for (let conf in predefinedConfigs) {
                        if (predefinedConfigs.hasOwnProperty(conf)) {
                            if (predefinedConfigs[conf].id === pId) {
                                jsPanel.layout.restoreId({id: pId, config: predefinedConfigs[conf], storagename: storageName});
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
