/**
 * jsPanel - A JavaScript library to create highly configurable multifunctional floating panels that can also be used as modal, tooltip, hint or contextmenu
 * @version v4.9.5
 * @homepage https://jspanel.de/
 * @license MIT
 * @author Stefan Sträßer - info@jspanel.de
 * @github https://github.com/Flyer53/jsPanel4.git
 */

import {jsPanel} from '../../jspanel.js';

if (!jsPanel.layout) {
    jsPanel.layout = {
        version: '1.3.1',
        date: '2020-01-18 14:53',
        storage: localStorage,

        save(saveConfig = {}) {
            let selector = saveConfig.selector
                ? saveConfig.selector
                : '.jsPanel-standard';
            let storageName = saveConfig.storagename
                ? saveConfig.storagename
                : 'jspanels';

            const collection = document.querySelectorAll(selector);
            let panels = [];
            collection.forEach(item => {
                let panelData = item.currentData;
                panelData.status = item.status;
                panelData.zIndex = item.style.zIndex;
                panelData.id = item.id;
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
                // eslint-disable-next-line no-console
                console.error(
                    'Id or predefined panel configuration is missing!'
                );
                return false;
            } else {
                id = restoreConfig.id;
                config = restoreConfig.config;
                storageName = restoreConfig.storagename
                    ? restoreConfig.storagename
                    : 'jspanels';
            }

            let storedpanel = this.getId(id, storageName);
            if (storedpanel) {
                let savedConfig = {
                    id: storedpanel.id,
                    panelSize: {
                        width: storedpanel.width,
                        height: storedpanel.height
                    },
                    position: `left-top ${storedpanel.left} ${storedpanel.top}`,
                    zIndex: storedpanel.zIndex
                };
                let useConfig = Object.assign({}, config, savedConfig);

                jsPanel.create(useConfig, panel => {
                    panel.style.zIndex = savedConfig.zIndex;
                    panel.saveCurrentDimensions();
                    panel.saveCurrentPosition();
                    panel.calcSizeFactors();
                    // don't put code below in savedConfig.setStatus
                    if (storedpanel.status !== 'normalized') {
                        if (storedpanel.status === 'minimized') {
                            panel.minimize();
                        } else if (storedpanel.status === 'maximized') {
                            panel.maximize();
                        } else if (storedpanel.status === 'smallified') {
                            panel.smallify();
                        } else if (storedpanel.status === 'smallifiedmax') {
                            panel.maximize().smallify();
                        }
                    }
                });
            }
        },

        restore(restoreConfig = {}) {
            let predefinedConfigs, storageName;
            if (!restoreConfig.configs) {
                // eslint-disable-next-line no-console
                console.error(
                    'Object with predefined panel configurations is missing!'
                );
                return false;
            } else {
                predefinedConfigs = restoreConfig.configs;
                storageName = restoreConfig.storagename
                    ? restoreConfig.storagename
                    : 'jspanels';
            }

            if (this.storage[storageName]) {
                let storedPanels = this.getAll(storageName);
                // loop over all panels in storageName
                storedPanels.forEach(function(item) {
                    let pId = item.id;
                    // loop over predefined configs to find config with pId
                    // this makes it unnecessary that identifiers for a certain config is the same as id in config
                    for (let conf in predefinedConfigs) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                predefinedConfigs,
                                conf
                            )
                        ) {
                            if (predefinedConfigs[conf].id === pId) {
                                jsPanel.layout.restoreId({
                                    id: pId,
                                    config: predefinedConfigs[conf],
                                    storagename: storageName
                                });
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
