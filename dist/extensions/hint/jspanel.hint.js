/* jspanel.hint.js v1.1.0 (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

//import {jsPanel} from '../../jspanel.js';

if (!jsPanel.hint) {

    jsPanel.hint = {

        version: '1.1.0',
        date: '2018-11-30 10:30',

        defaults: {
            autoclose: 8000,
            dragit: false,
            resizeit: false,
            headerControls: 'none'
        },

        create: function create() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


            options.paneltype = 'hint';

            var opts = options;
            if (options.config) {
                opts = Object.assign({}, options.config, options);
                delete opts.config;
            }
            opts = Object.assign({}, this.defaults, opts);

            return jsPanel.create(opts, function (hint) {
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