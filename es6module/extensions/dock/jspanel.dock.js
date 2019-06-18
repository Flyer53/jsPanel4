/* jspanel.dock.js v1.1.1 - 2019-05-18 09:40, (c) Stefan Sträßer(Flyer53) <info@jspanel.de> license: MIT */
/* global jsPanel */
'use strict';

import {jsPanel} from '../../jspanel.js';

function dockPanel (config, cb) {

    let configDefault = {
        position: {my: 'left-top', at: 'right-top'},
        linkSlaveHeight: false,
        linkSlaveWidth: false,
        callback: false
    };
    let conf = Object.assign({}, configDefault, config);
    let master;
    let slave = document.getElementById(this.id);
    if (conf.master && conf.master.nodeType === 1) {
        master = conf.master;
    } else {
        master = document.querySelector(conf.master);
    }
    if (!master) {
        // if master does not exist show error panel return false
        if (jsPanel.errorReporting) {
            try {
                throw new jsPanel.jsPanelError('&#9664; COULD NOT DOCK PANEL &#9658;<br>The master panel does not exist in the document.');
            } catch (e) {
                jsPanel.error(e);
                if (cb) {cb.call(slave, slave);}
            }
        }
        return false;
    }

    let position = Object.assign({}, conf.position, {of: master, minLeft: false, minTop: false, maxLeft: false, maxTop: false, autoposition: false});
    if (!position.my) {position.my = configDefault.position.my;}
    if (!position.at) {position.at = configDefault.position.at;}
    slave.options.position = position;
    ['smallify', 'minimize', 'normalize', 'maximize'].forEach(function (ctrl) {
        slave.setControlStatus(ctrl, 'remove');
    });
    if (conf.linkSlaveHeight) {
        let height = window.getComputedStyle(master).height;
        slave.resize({height: height});
    }
    if (conf.linkSlaveWidth) {
        let width = window.getComputedStyle(master).width;
        slave.resize({width: width});
    }
    // position slave
    slave.reposition(position);
    // set necessary slave panel options
    slave.dragit('disable');
    slave.resizeit('disable');
    slave.options.minimizeTo = false;

    // set necessary master options
    master.reposSlave = function () {
        if (document.querySelector('#'+slave.id)) {
            slave.reposition();
        }
    };
    if (master.options.dragit) {
        master.options.dragit.drag.push(master.reposSlave);
    }

    master.resizeSlave = function () {
        if (document.querySelector('#'+slave.id)) {
            slave.reposition();
            if (conf.linkSlaveHeight) {
                let h = window.getComputedStyle(master).height;
                slave.resize({
                    height: h
                });
            }
            if (conf.linkSlaveWidth) {
                let w = window.getComputedStyle(master).width;
                slave.resize({
                    width: w
                });
            }
        }
    };
    if (master.options.resizeit) {
        master.options.resizeit.resize.push(master.resizeSlave);
    }

    // do not replace following event handlers with master.on.... callbacks
    // remove drag/resize callbacks from master before master is closed, otherwise callbacks build up in arrays when master is recreated again after it was closed
    document.addEventListener('jspanelbeforeclose', function (evt) {
        if (evt.detail === master.id) {
            if (master.options.dragit) {
                master.options.dragit.drag = [];
            }
            if (master.options.resizeit) {
                master.options.resizeit.resize = [];
            }
            return true;
        }
    }, false);

    // close slave when master is closed
    document.addEventListener('jspanelclosed', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.close();
        }
    }, false);

    // maximize slave when master is maximized
    document.addEventListener('jspanelmaximized', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.normalize();
            if (conf.linkSlaveHeight) {
                let height = window.getComputedStyle(master).height;
                slave.resize({height: height});
            }
            if (conf.linkSlaveWidth) {
                let width = window.getComputedStyle(master).width;
                slave.resize({width: width});
            }
            slave.reposition();
        }
    }, false);

    // minimize slave when master is minimized
    document.addEventListener('jspanelminimized', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.minimize();
        }
    }, false);

    // normalize slave when master is normalized
    document.addEventListener('jspanelnormalized', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.normalize();
            if (conf.linkSlaveHeight) {
                let height = window.getComputedStyle(master).height;
                slave.resize({height: height});
            }
            if (conf.linkSlaveWidth) {
                let width = window.getComputedStyle(master).width;
                slave.resize({width: width});
            }
            slave.reposition();
        }
    }, false);

    // smallify/unsmallify slave when master is smallified/unsmallified
    document.addEventListener('jspanelsmallifiedmax', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.smallify().reposition();
        }
    }, false);
    document.addEventListener('jspanelsmallified', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.smallify().reposition();
        }
    }, false);
    document.addEventListener('jspanelunsmallified', function (evt) {
        if (evt.detail === master.id && document.querySelector('#'+slave.id)) {
            slave.unsmallify().reposition();
        }
    }, false);

    slave.dockedTo = master.id;

    if (conf.callback) {
        conf.callback.call(slave, master, slave);
    }

    return slave;

}

dockPanel.getVersion = function () { return '1.1.1'; };
dockPanel.getDate    = function () { return '2019-05-18 09:40'; };

jsPanel.extend({ dock: dockPanel });
