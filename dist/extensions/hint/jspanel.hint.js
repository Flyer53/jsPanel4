/* jspanel.hint.js v1.0.0 (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

if (!jsPanel.hint) {

    jsPanel.hint = {

        version: '1.0.0',
        date: '2017-05-17 22:15',

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