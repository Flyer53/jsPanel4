/* jspanel.tooltip.js (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

import {jsPanel} from '../../jspanel.js';

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent#Polyfill - needed for IE11
(function (window) {
    try {
        new MouseEvent('test');
        return false; // No need to polyfill
    } catch (e) {
        // Need to polyfill - fall through
    }
    // Polyfills DOM4 MouseEvent
    var MouseEvent = function (eventType, params) {
        params = params || { bubbles: false, cancelable: false };
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return mouseEvent;
    };
    MouseEvent.prototype = Event.prototype;
    window.MouseEvent = MouseEvent;
})(window);
// -----------------------------------------------------------

if (!jsPanel.tooltip) {

    jsPanel.tooltip = {

        version: '1.2.1',
        date: '2019-02-09 12:07',

        defaults: {
            //position: is set in jsPanel.tooltip.create()
            border: '1px solid',
            dragit: false,
            resizeit: false,
            headerControls: 'none',
            delay: 400,
            ttipEvent: 'mouseenter'
        },

        create(options = {}, callback) {

            options.paneltype = 'tooltip';

            if (!options.id) {
                options.id = `jsPanel-${jsPanel.idCounter += 1}`;
            } else if (typeof options.id === 'function') {
                options.id = options.id();
            }
            let target = options.target,
                mode   = options.mode || 'default',
                timer;

            if (typeof target === 'string') {
                target = document.querySelector(target);
            }

            if (!target) {
                const error = new window.jsPanelError('TOOLTIP SETUP FAILED!\nEither option target is missing in the tooltip configuration or the target does nor exist in the document!');
                try {
                    throw error;
                } catch (e) {
                    if (callback) {callback.call(e, e);}
                }
                console.error(error.name+':', error.message);
                return false;
            }

            // don't close tooltip or contextmenu on mousedown in target
            jsPanel.pointerdown.forEach(function (evt) {
                target.addEventListener(evt, e => {
                    e.stopPropagation();
                }, false);
            });

            let opts = options;
            if (options.config) {
                opts = Object.assign({}, options.config, options);
                delete opts.config;
            }
            opts = Object.assign({}, this.defaults, opts);
            opts.position = Object.assign({}, options.position);
            opts.position.of = options.position.of || target;

            target.addEventListener(opts.ttipEvent, () => {

                timer = window.setTimeout(function () {

                    // do nothing if id already exists in document
                    if (document.getElementById(options.id)) {
                        return false;
                    }

                    jsPanel.create(opts, function (panel) {

                        const tipToClose = panel,
                            closeTip = () => {
                                tipToClose.close();
                                target.removeEventListener('mouseleave', closeTip);
                                panel.removeEventListener('mouseleave', closeTip);
                            };

                        // by default tooltip will close when mouse leaves trigger
                        if (mode === 'default') {
                            target.addEventListener('mouseleave', closeTip, false);
                        } else if (mode === 'semisticky') {
                            // close tooltip when mouse leaves tooltip
                            panel.addEventListener('mouseleave', closeTip, false);
                        }
                        // some more tooltip specifics
                        panel.classList.add('jsPanel-tooltip');
                        panel.style.overflow = 'visible';
                        panel.header.style.cursor = 'default';
                        panel.footer.style.cursor = 'default';

                        // check whether contextmenu is triggered from within a modal panel or panel and if so update z-index
                        if (target.closest('.jsPanel-modal')) {
                            panel.style.zIndex = target.closest('.jsPanel-modal').style.zIndex;
                        } else {
                            if (target.closest('.jsPanel')) {
                                target.closest('.jsPanel').front();
                            }
                            panel.style.zIndex = jsPanel.zi.next();
                        }

                        // do not use 'click' instead of jsPanel.evtStart
                        jsPanel.pointerdown.forEach(function (evt) {
                            panel.addEventListener(evt, e => {
                                e.stopPropagation();
                            }, false);
                        });

                        // add tooltip connector
                        if (opts.connector) {
                            let tipPos = jsPanel.tooltip.relativeTipPos(panel);
                            if (tipPos !== 'over') {
                                panel.append(jsPanel.tooltip.addConnector(panel, tipPos));
                            }
                        }

                        if (callback) {callback.call(panel, panel);}

                    });

                }, opts.delay);

            }, false);

            // immediately show tooltip
            if (opts.autoshow) {
                let event = new MouseEvent('mouseenter');
                target.dispatchEvent(event);
            }

            // do not create tooltip if mouse leaves target before delay elapsed
            target.addEventListener('mouseleave', () => {
                window.clearTimeout(timer);
            }, false);

        },

        relativeTipPos(tip) {
            // returns the basic position of the tooltip relative to option.position.of (top, right, right-bottom etc.)
            let relativePosition,
                target = tip.options.position.of || tip.options.target;
            if (typeof target === 'string') {
                target = document.querySelector(target);
            }
            let tipRect = tip.getBoundingClientRect(),
                targetRect = target.getBoundingClientRect();

            if (parseInt(tipRect.right) <= parseInt(targetRect.left)) {
                if (parseInt(tipRect.bottom) <= parseInt(targetRect.top)) {
                    relativePosition = 'left-top-corner';
                } else if (parseInt(tipRect.top) >= parseInt(targetRect.bottom)) {
                    relativePosition = 'left-bottom-corner';
                } else if (parseInt(tipRect.top) === parseInt(targetRect.top)) {
                    relativePosition = 'lefttop';
                } else if (parseInt(tipRect.bottom) === parseInt(targetRect.bottom)) {
                    relativePosition = 'leftbottom';
                } else {
                    relativePosition = 'left';
                }
            } else if (parseInt(tipRect.left) >= parseInt(targetRect.right)) {
                if (parseInt(tipRect.bottom) <= parseInt(targetRect.top)) {
                    relativePosition = 'right-top-corner';
                } else if (parseInt(tipRect.top) >= parseInt(targetRect.bottom)) {
                    relativePosition = 'right-bottom-corner';
                } else if (parseInt(tipRect.top) === parseInt(targetRect.top)) {
                    relativePosition = 'righttop';
                } else if (parseInt(tipRect.bottom) === parseInt(targetRect.bottom)) {
                    relativePosition = 'rightbottom';
                } else {
                    relativePosition = 'right';
                }
            } else if (parseInt(tipRect.bottom) <= parseInt(targetRect.top)) {
                if (parseInt(tipRect.left) === parseInt(targetRect.left)) {
                    relativePosition = 'topleft';
                } else if (parseInt(tipRect.right) === parseInt(targetRect.right)) {
                    relativePosition = 'topright';
                } else {
                    relativePosition = 'top';
                }
            } else if (parseInt(tipRect.top) >= parseInt(targetRect.bottom)) {
                if (parseInt(tipRect.left) === parseInt(targetRect.left)) {
                    relativePosition = 'bottomleft';
                } else if (parseInt(tipRect.right) === parseInt(targetRect.right)) {
                    relativePosition = 'bottomright';
                } else {
                    relativePosition = 'bottom';
                }
            } else {relativePosition = 'over';}

            return relativePosition;
        },

        addConnector(tip, relposition) {
            let left, top, connCSS, connBg,
                conn = document.createElement('div');
            conn.className = `jsPanel-connector jsPanel-connector-${relposition}`;

            // rest of tooltip positioning is in jspanel.sass
            if (relposition === 'top' || relposition === 'topleft' || relposition === 'topright') {
                tip.style.top = (parseFloat(tip.style.top) - 12) + 'px';
            } else if (relposition === 'right' || relposition === 'righttop' || relposition === 'rightbottom') {
                tip.style.left = (parseFloat(tip.style.left) + 12) + 'px';
            } else if (relposition === 'bottom' || relposition === 'bottomleft' || relposition === 'bottomright') {
                tip.style.top = (parseFloat(tip.style.top) + 12) + 'px';
            } else if (relposition === 'left' || relposition === 'lefttop' || relposition === 'leftbottom') {
                tip.style.left = (parseFloat(tip.style.left) - 12) + 'px';
            }

            if (typeof tip.options.connector === 'string') {
                connBg = tip.options.connector;
            } else {
                connBg = window.getComputedStyle(tip).borderBottomColor;
            }

            if (relposition.match(/-/)) {
                connCSS = {
                    left: left,
                    top: top,
                    backgroundColor: connBg
                };
            } else {
                let styles = window.getComputedStyle(tip);

                if (relposition === 'topleft' || relposition === 'topright') {
                    if (relposition === 'topleft') {
                        left = styles.borderBottomLeftRadius;
                    } else {
                        let corr = (24 + parseInt(styles.borderBottomLeftRadius)) + 'px';
                        left = `calc(100% - ${corr})`;
                    }
                    relposition = 'top';
                } else if (relposition === 'bottomleft' || relposition === 'bottomright')  {
                    if (relposition === 'bottomleft') {
                        left = styles.borderTopLeftRadius;
                    } else {
                        let corr = (24 + parseInt(styles.borderTopRightRadius)) + 'px';
                        left = `calc(100% - ${corr})`;
                    }
                    relposition = 'bottom';
                } else if (relposition === 'lefttop' || relposition === 'leftbottom')  {
                    if (relposition === 'lefttop') {
                        top = styles.borderTopRightRadius;
                    } else {
                        let corr = (24 + parseInt(styles.borderBottomRightRadius)) + 'px';
                        top = `calc(100% - ${corr})`;
                    }
                    relposition = 'left';
                } else if (relposition === 'righttop' || relposition === 'rightbottom')  {
                    if (relposition === 'righttop') {
                        top = styles.borderTopLeftRadius;
                    } else {
                        let corr = (24 + parseInt(styles.borderBottomLeftRadius)) + 'px';
                        top = `calc(100% - ${corr})`;
                    }
                    relposition = 'right';
                }

                connCSS = {
                    left: left,
                    top: top,
                    [`border-${relposition}-color`]: connBg
                };
            }

            jsPanel.setStyle(conn, connCSS);

            tip.classList.add(`jsPanel-tooltip-${relposition}`);

            return conn;
        },

        // reposition is still experimental
        reposition(tip, newposition, cb) {
            // newposition must be an object
            // first save connector setting and then remove connector
            let connector = tip.querySelector('.jsPanel-connector'),
                hasConnector;
            if (connector) {
                hasConnector = tip.options.connector;
                tip.removeChild(connector);
            }

            // get option.position.of
            newposition.of = tip.options.position.of;

            // reposition tooltip
            tip.reposition(newposition);

            // ... and add connector again
            if (hasConnector) {
                let tipPos = this.relativeTipPos(tip);
                if (tipPos !== 'over') {
                    tip.append(this.addConnector(tip, tipPos));
                }
            }

            if (cb) {cb.call(tip, tip);}

            return tip;

        },

    };

    // close tooltips on pointerdown in document
    jsPanel.pointerdown.forEach(function (evt) {
        document.addEventListener(evt, function (e) {
            document.querySelectorAll('.jsPanel-tooltip').forEach(function (item) {
                if (!e.target.closest('.jsPanel-tooltip')) {
                    if (!item.options.autoshow) {
                        item.close();
                    }
                }
            });
        },false);
    });

}

// Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html
if (typeof module !== 'undefined') {
    module.exports = jsPanel;
}