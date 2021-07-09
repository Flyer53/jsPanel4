/**
 * jsPanel - A JavaScript library to create highly configurable multifunctional floating panels that can also be used as modal, tooltip, hint or contextmenu
 * @version v4.12.0
 * @homepage https://jspanel.de/
 * @license MIT
 * @author Stefan Sträßer - info@jspanel.de
 * @github https://github.com/Flyer53/jsPanel4.git
 */

import {jsPanel} from '../../jspanel.js';

/**
 * If option.dragit is enabled on a modal AND an already open panel has option.syncMargins set to true the modal somehow inherits
 * the option.dragit.containment setting of the already open panel. Reason unknown!
 * Workaround: Set option.dragit.containment to a suitable value on the modal.
 */

if (!jsPanel.modal) {

    jsPanel.modal = {

        version: '1.2.5',
        date: '2020-04-26 23:23',

        defaults: {
            closeOnEscape:  true,
            closeOnBackdrop:true,
            dragit:         false,
            headerControls: 'closeonly',
            resizeit:       false,
            syncMargins:    false
        },

        addBackdrop(id) {
            let modalCount = document.getElementsByClassName('jsPanel-modal-backdrop').length,
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

        removeBackdrop(id) {
            let mb = document.getElementById(`jsPanel-modal-backdrop-${id}`);
            mb.classList.add('jsPanel-modal-backdrop-out');
            let delay = parseFloat(getComputedStyle(mb).animationDuration) * 1000;
            window.setTimeout(function() {
                document.body.removeChild(mb);
            }, delay);
        },

        create(options = {}) {
            options.paneltype = 'modal';
            if (!options.id) {
                options.id = `jsPanel-${jsPanel.idCounter += 1}`;
            } else if (typeof options.id === 'function') {
                options.id = options.id();
            }

            let opts = options,
                backdrop = this.addBackdrop(opts.id);
            if (options.config) {
                opts = Object.assign({}, options.config, options);
                delete opts.config;
            }
            opts = Object.assign({}, this.defaults, opts, {container: 'window'});

            document.body.append(backdrop);

            return jsPanel.create(opts, modal => {
                modal.style.zIndex = jsPanel.modal.ziModal.next();
                modal.header.style.cursor = 'default';
                modal.footer.style.cursor = 'default';
                // close modal on click in backdrop
                if (opts.closeOnBackdrop) {
                    jsPanel.pointerup.forEach(function (evt) {
                        document.getElementById(`jsPanel-modal-backdrop-${opts.id}`).addEventListener(evt, function () {
                            modal.close(null, true);
                        });
                    });
                }
                // remove modal backdrop when modal is closed
                // callback should be the first item in the onclosed array
                modal.options.onclosed.unshift(function removeModalBackdrop() {
                    jsPanel.modal.removeBackdrop(opts.id);
                    // must return true in order to have the next callbacks (added via modal config) in the array execute as well
                    return true;
                });
            });

        }

    };

    jsPanel.modal.ziModal = (() => {
        let val = jsPanel.ziBase + 10000;
        return {
            next: function() {
                return val++;
            }
        };
    })();

}
