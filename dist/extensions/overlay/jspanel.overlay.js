/* jspanel.overlay.js v1.0.0 2018-02-17 10:55 (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

jsPanel.extend({

    overlay: function overlay() {
        var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'panel';


        // create overlay and spinner elements
        var overlay = document.createElement('div'),
            spinner = document.createElement('i');

        // style overlay
        jsPanel.setStyle(overlay, {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            background: 'gray',
            opacity: .6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });

        // add class names and append spinner to overlay
        overlay.className = 'jsPanel-overlay';
        spinner.className = 'fas fa-spinner fa-spin fa-3x';
        overlay.appendChild(spinner);

        // append overlay depending on passed arg
        if (arg === 'content') {
            // append overlay to panel content section
            this.content.appendChild(overlay);
        } else {
            // append overlay to panel
            this.appendChild(overlay);
            // deactivate events (without this panel could be resized using the mouse)
            this.style.pointerEvents = 'none';
        }

        // panel prop indicating its deactivated status
        this.deactivated = true;

        // return panel to allow for chaining other panel methods
        return this;
    },

    clear: function clear() {

        if (this.deactivated) {

            // reactivate events
            this.style.pointerEvents = 'auto';

            // remove overlay again
            var overlay = this.querySelector('.jsPanel-overlay');
            if (overlay) {
                if (overlay.parentElement.classList.contains('jsPanel')) {
                    this.removeChild(overlay);
                } else {
                    this.content.removeChild(overlay);
                }
            }

            // reset deactivated status
            this.deactivated = false;

            // return panel to allow for chaining other panel methods
            return this;
        }
    }

});

/*
let p = jsPanel.create({
    theme: 'crimson'
});

window.setTimeout(function(){
    p.overlay();
    // or
    // p.overlay('content'); // in order to add overlay to content section
},2000);

window.setTimeout(function(){
    p.clear();
},6000);
*/