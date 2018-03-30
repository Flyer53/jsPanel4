/* jspanel.modal.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

/*
If option.dragit is enabled on a modal AND an already open panel has option.syncMargins set to true the modal somehow inherits
the option.dragit.containment setting of the already open panel. Reason unknown!
Workaround: Set option.dragit.containment to a suitable value on the modal.
 */
 
import { jsPanel } from '../../jspanel.js';

if (!jsPanel.modal) {

    jsPanel.modal = {

        version: '1.0.0',
        date: '2017-05-17 22:15',

        defaults: {
            headerControls: 'closeonly',
            dragit: false,
            resizeit: false,
            syncMargins: false
        },

        ziModalBase: 10000,

        addBackdrop: function addBackdrop(id) {
            var modalCount = document.getElementsByClassName('jsPanel-modal-backdrop').length,
                mb = document.createElement('div');
            mb.id = 'jsPanel-modal-backdrop-' + id;
            if (modalCount === 0) {
                mb.className = 'jsPanel-modal-backdrop';
            } else if (modalCount > 0) {
                mb.className = 'jsPanel-modal-backdrop jsPanel-modal-backdrop-multi';
            }
            mb.style.zIndex = this.ziModal.next();
            return mb;
        },
        removeBackdrop: function removeBackdrop(id) {
            var mb = document.getElementById('jsPanel-modal-backdrop-' + id);
            mb.classList.add('jsPanel-modal-backdrop-out');
            var delay = parseFloat(getComputedStyle(mb).animationDuration) * 1000;
            window.setTimeout(function () {
                document.body.removeChild(mb);
            }, delay);
        },
        create: function create() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            options.paneltype = 'modal';
            if (!options.id) {
                options.id = 'jsPanel-' + (jsPanel.idCounter += 1);
            } else if (typeof options.id === 'function') {
                options.id = options.id();
            }

            var opts = options,
                backdrop = this.addBackdrop(opts.id);
            if (options.config) {
                opts = Object.assign({}, options.config, options);
                delete opts.config;
            }
            opts = Object.assign({}, this.defaults, opts, { container: 'body' });

            document.body.append(backdrop);

            var remBackdrop = function remBackdrop(e) {
                var id = e.detail;
                if (id === opts.id) {
                    jsPanel.modal.removeBackdrop(id);
                    document.removeEventListener('jspanelclosed', remBackdrop, false);
                }
            };

            document.addEventListener('jspanelclosed', remBackdrop, false);

            return jsPanel.create(opts, function (modal) {
                modal.style.zIndex = jsPanel.modal.ziModal.next();
                modal.header.style.cursor = 'default';
                modal.footer.style.cursor = 'default';
            });
        }
    };

    jsPanel.modal.ziModal = function () {
        var startValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jsPanel.modal.ziModalBase;

        var val = startValue;
        return {
            next: function next() {
                return val++;
            }
        };
    }();
}