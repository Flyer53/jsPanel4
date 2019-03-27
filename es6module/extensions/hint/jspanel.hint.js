/* jspanel.hint.js v1.1.0 (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

import {jsPanel} from '../../jspanel.js';

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
