/**
 * jsPanel - A JavaScript library to create highly configurable multifunctional floating panels that can also be used as modal, tooltip, hint or contextmenu
 * @version v4.12.0
 * @homepage https://jspanel.de/
 * @license MIT
 * @author Stefan Sträßer - info@jspanel.de
 * @github https://github.com/Flyer53/jsPanel4.git
 */

import {jsPanel} from '../../jspanel.js';

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
