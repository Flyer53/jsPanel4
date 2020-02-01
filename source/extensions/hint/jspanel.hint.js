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
