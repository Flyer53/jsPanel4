/* jspanel.hint.js v1.2.3 (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

//import {jsPanel} from '../../jspanel.js';

if (!jsPanel.hint) {

    jsPanel.hint = {

        version: '1.2.3',
        date: '2019-05-18 10:50',

        defaults: {
            autoclose: true,
            dragit: false,
            resizeit: false,
            headerControls: 'closeonly xs'
        },

        create(options = {}) {

            options.paneltype = 'hint';

            let opts = options;
            if (options.config) {
                opts = Object.assign({}, options.config, options);
                delete opts.config;
            }
            opts = Object.assign({}, this.defaults, opts);

            return jsPanel.create(opts, hint => {
                hint.style.zIndex = 9999;
                hint.header.style.cursor = 'default';
                hint.footer.style.cursor = 'default';
            });

        }

    };

}

// Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html
if (typeof module !== 'undefined') {
    module.exports = jsPanel;
}
