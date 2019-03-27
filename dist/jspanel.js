/* jspanel.js - License MIT, copyright 2013 - 2019 Stefan Straesser <info@jspanel.de> (https://jspanel.de) */
/* global jsPanel, module */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var jsPanel = {
    version: '4.6.0',
    date: '2019-03-27 10:00',
    ajaxAlwaysCallbacks: [],
    autopositionSpacing: 4,
    closeOnEscape: function () {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.code === 'Escape' || e.key === 'Esc') {
                jsPanel.getPanels(function () {
                    return this.classList.contains('jsPanel');
                }).some(function (item) {
                    if (item.options.closeOnEscape) {
                        jsPanel.close(item);
                        return true;
                    }
                    return false;
                });
            }
        }, false);
    }(),
    defaults: {
        boxShadow: 3,
        container: 'window',
        contentSize: { width: '400px', height: '200px' }, // must be object
        dragit: {
            cursor: 'move',
            handles: '.jsPanel-headerlogo, .jsPanel-titlebar, .jsPanel-ftr', // do not use .jsPanel-headerbar
            opacity: 0.8,
            disableOnMaximized: true
        },
        header: true,
        headerTitle: 'jsPanel',
        headerControls: { size: 'md' }, // must be object
        iconfont: false,
        maximizedMargin: 0,
        minimizeTo: 'default',
        onparentresize: false,
        paneltype: 'standard',
        position: { my: 'center', at: 'center', of: 'window', offsetX: '0px', offsetY: '0px' },
        resizeit: {
            handles: 'n, e, s, w, ne, se, sw, nw',
            minWidth: 128,
            minHeight: 128
        },
        theme: 'default'
    },
    defaultSnapConfig: {
        sensitivity: 70,
        trigger: 'panel'
    },
    extensions: {},
    globalCallbacks: false,
    icons: {
        close: '<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path fill="currentColor" d="M15.8,14l9.9-9.9c0.5-0.5,0.5-1.3,0-1.8c-0.5-0.5-1.3-0.5-1.8,0L14,12.3L4.1,2.4c-0.5-0.5-1.3-0.5-1.8,0c-0.5,0.5-0.5,1.3,0,1.8l9.9,9.9l-9.9,9.9c-0.5,0.5-0.5,1.3,0,1.8C2.6,25.9,2.9,26,3.3,26s0.7-0.1,0.9-0.3l9.8-9.9l9.9,9.9c0.3,0.3,0.5,0.3,0.9,0.3s0.6-0.1,0.9-0.3c0.5-0.5,0.5-1.3,0-1.8L15.8,14z"/></svg>',
        maximize: '<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path fill="currentColor" d="M25.3,1.9H2.7c-0.6,0-1,0.4-1,1v22.3c0,0.5,0.4,1,1,1h22.5c0.5,0,1-0.5,1-1V2.9C26.3,2.3,25.9,1.9,25.3,1.9z M3.7,24.1v-18h20.5v18C24.3,24.1,3.7,24.1,3.7,24.1z"/></svg>',
        normalize: '<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="M18.5,1.2H5.1c-0.3,0-0.5,0.3-0.5,0.5v3.1c0,0.1,0,0.1,0,0.2h-3C1.2,5,0.9,5.3,0.9,5.7v12.4c0,0.4,0.3,0.7,0.7,0.7h12.6c0.4,0,0.7-0.3,0.7-0.7v-2.6c0,0,0.1,0,0.1,0h3.5c0.3,0,0.5-0.3,0.5-0.5V1.7C19.1,1.4,18.8,1.2,18.5,1.2z M2.3,17.4V8.2c0,0,0.1,0,0.1,0h11c0,0,0.1,0,0.1,0v9.3H2.3z M18,14.4h-3c0,0-0.1,0-0.1,0V5.7c0-0.4-0.3-0.7-0.7-0.7H5.6c0-0.1,0-0.1,0-0.2V2.2H18C18,2.2,18,14.4,18,14.4z"/></svg>',
        minimize: '<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 20"><path fill="currentColor" d="M20.4,18.6H1.8c-0.7,0-1.3-0.5-1.3-1.1s0.6-1.1,1.3-1.1h18.5c0.7,0,1.3,0.5,1.3,1.1S21,18.6,20.4,18.6z"/></svg>',
        smallifyrev: '<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18"><path fill="currentColor" d="M10,15.1L10,15.1c-0.3,0-0.5-0.1-0.6-0.3L1,6.4C0.6,6,0.6,5.5,1,5.1c0.4-0.4,0.9-0.4,1.3,0L10,13l7.8-7.7c0.4-0.4,0.9-0.4,1.3,0c0.3,0.4,0.4,0.9,0,1.3l-8.4,8.4C10.5,15,10.2,15.1,10,15.1z"/></svg>',
        smallify: '<svg class="jsPanel-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18"><path fill="currentColor" d="M19,13.5l-8.4-8.3c-0.4-0.4-0.9-0.4-1.3,0L1,13.6c-0.4,0.4-0.4,0.9,0,1.3c0.2,0.2,0.4,0.3,0.6,0.3c0.2,0,0.5-0.1,0.6-0.3L10,7l7.8,7.7c0.4,0.4,0.9,0.4,1.3,0C19.4,14.4,19.4,13.8,19,13.5z"/></svg>'
    },
    idCounter: 0,
    isIE: function () {
        return navigator.appVersion.match(/Trident/);
    }(),
    pointerdown: 'onpointerdown' in window ? ['pointerdown'] : 'ontouchend' in window ? ['touchstart', 'mousedown'] : ['mousedown'],
    pointermove: 'onpointermove' in window ? ['pointermove'] : 'ontouchend' in window ? ['touchmove', 'mousemove'] : ['mousemove'],
    pointerup: 'onpointerup' in window ? ['pointerup'] : 'ontouchend' in window ? ['touchend', 'mouseup'] : ['mouseup'],
    polyfills: function () {
        // .append() polyfill needed for EDGE - https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append
        (function (arr) {
            arr.forEach(function (item) {
                item.append = item.append || function () {
                    var argArr = Array.prototype.slice.call(arguments),
                        docFrag = document.createDocumentFragment();
                    argArr.forEach(function (argItem) {
                        var isNode = argItem instanceof Node;
                        docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                    });
                    this.appendChild(docFrag);
                };
            });
        })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
        // Element.closest() polyfill needed for EDGE - https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
        if (window.Element && !Element.prototype.closest) {
            Element.prototype.closest = function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = void 0,
                    el = this;
                do {
                    i = matches.length;
                    // eslint-disable-next-line no-empty
                    while (--i >= 0 && matches.item(i) !== el) {}
                } while (i < 0 && (el = el.parentElement));
                return el;
            };
        }
        // NodeList.prototype.forEach() polyfill needed for IE11 and Android mobile - https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || window;
                for (var i = 0; i < this.length; i++) {
                    callback.call(thisArg, this[i], i, this);
                }
            };
        }
        // Object.assign Polyfill needed for mobiles - https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
        if (!Object.assign) {
            Object.defineProperty(Object, 'assign', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: function value(target) {
                    if (target === undefined || target === null) {
                        throw new TypeError('Cannot convert first argument to object');
                    }
                    var to = Object(target);
                    for (var i = 1; i < arguments.length; i++) {
                        var nextSource = arguments[i];
                        if (nextSource === undefined || nextSource === null) {
                            continue;
                        }
                        nextSource = Object(nextSource);
                        var keysArray = Object.keys(Object(nextSource));
                        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                            var nextKey = keysArray[nextIndex];
                            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                            if (desc !== undefined && desc.enumerable) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                    return to;
                }
            });
        }
        // Polyfills for IE11 only
        // CustomEvent - https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
        (function () {
            if (typeof window.CustomEvent === 'function') return false;
            function CustomEvent(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        })();
        // String.prototype.endsWith() - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function (searchStr, Position) {
                // This works much better than >= because
                // it compensates for NaN:
                if (!(Position < this.length)) Position = this.length;else Position |= 0; // round position
                return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
            };
        }
        // String.prototype.startsWith() - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position) {
                return this.substr(position || 0, searchString.length) === searchString;
            };
        }
        // String.prototype.includes() - https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/includes
        if (!String.prototype.includes) {
            String.prototype.includes = function (search, start) {
                if (typeof start !== 'number') {
                    start = 0;
                }
                if (start + search.length > this.length) {
                    return false;
                } else {
                    return this.indexOf(search, start) !== -1;
                }
            };
        }
    }(),
    themes: ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
    ziBase: 100,
    colorFilledLight: 0.81,
    colorFilledDark: 0.08,
    colorFilled: 0,
    colorBrightnessThreshold: 0.55,
    colorNames: {
        // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '0ff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000',
        blanchedalmond: 'ffebcd',
        blue: '00f',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '0ff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgrey: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkslategrey: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dimgrey: '696969',
        dodgerblue: '1e90ff',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'f0f',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        grey: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred: 'cd5c5c',
        indigo: '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgray: 'd3d3d3',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslategray: '789',
        lightslategrey: '789',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '0f0',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'f0f',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        rebeccapurple: '639',
        red: 'f00',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        slategrey: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        wheat: 'f5deb3',
        white: 'fff',
        whitesmoke: 'f5f5f5',
        yellow: 'ff0',
        yellowgreen: '9acd32',
        /* Material Design Colors https://material.io/design/color/the-color-system.html#tools-for-picking-colors */
        grey50: 'fafafa', grey100: 'f5f5f5', grey200: 'eee', grey300: 'e0e0e0', grey400: 'bdbdbd', grey500: '9e9e9e', grey600: '757575', grey700: '616161', grey800: '424242', grey900: '212121',
        gray50: 'fafafa', gray100: 'f5f5f5', gray200: 'eee', gray300: 'e0e0e0', gray400: 'bdbdbd', gray500: '9e9e9e', gray600: '757575', gray700: '616161', gray800: '424242', gray900: '212121',
        bluegrey50: 'eceff1', bluegrey100: 'CFD8DC', bluegrey200: 'B0BEC5', bluegrey300: '90A4AE', bluegrey400: '78909C', bluegrey500: '607D8B', bluegrey600: '546E7A', bluegrey700: '455A64', bluegrey800: '37474F', bluegrey900: '263238',
        bluegray50: 'eceff1', bluegray100: 'CFD8DC', bluegray200: 'B0BEC5', bluegray300: '90A4AE', bluegray400: '78909C', bluegray500: '607D8B', bluegray600: '546E7A', bluegray700: '455A64', bluegray800: '37474F', bluegray900: '263238',
        red50: 'FFEBEE', red100: 'FFCDD2', red200: 'EF9A9A', red300: 'E57373', red400: 'EF5350', red500: 'F44336', red600: 'E53935', red700: 'D32F2F', red800: 'C62828', red900: 'B71C1C', reda100: 'FF8A80', reda200: 'FF5252', reda400: 'FF1744', reda700: 'D50000',
        pink50: 'FCE4EC', pink100: 'F8BBD0', pink200: 'F48FB1', pink300: 'F06292', pink400: 'EC407A', pink500: 'E91E63', pink600: 'D81B60', pink700: 'C2185B', pink800: 'AD1457', pink900: '880E4F', pinka100: 'FF80AB', pinka200: 'FF4081', pinka400: 'F50057', pinka700: 'C51162',
        purple50: 'F3E5F5', purple100: 'E1BEE7', purple200: 'CE93D8', purple300: 'BA68C8', purple400: 'AB47BC', purple500: '9C27B0', purple600: '8E24AA', purple700: '7B1FA2', purple800: '6A1B9A', purple900: '4A148C', purplea100: 'EA80FC', purplea200: 'E040FB', purplea400: 'D500F9', purplea700: 'AA00FF',
        deeppurple50: 'EDE7F6', deeppurple100: 'D1C4E9', deeppurple200: 'B39DDB', deeppurple300: '9575CD', deeppurple400: '7E57C2', deeppurple500: '673AB7', deeppurple600: '5E35B1', deeppurple700: '512DA8', deeppurple800: '4527A0', deeppurple900: '311B92', deeppurplea100: 'B388FF', deeppurplea200: '7C4DFF', deeppurplea400: '651FFF', deeppurplea700: '6200EA',
        indigo50: 'E8EAF6', indigo100: 'C5CAE9', indigo200: '9FA8DA', indigo300: '7986CB', indigo400: '5C6BC0', indigo500: '3F51B5', indigo600: '3949AB', indigo700: '303F9F', indigo800: '283593', indigo900: '1A237E', indigoa100: '8C9EFF', indigoa200: '536DFE', indigoa400: '3D5AFE', indigoa700: '304FFE',
        blue50: 'E3F2FD', blue100: 'BBDEFB', blue200: '90CAF9', blue300: '64B5F6', blue400: '42A5F5', blue500: '2196F3', blue600: '1E88E5', blue700: '1976D2', blue800: '1565C0', blue900: '0D47A1', bluea100: '82B1FF', bluea200: '448AFF', bluea400: '2979FF', bluea700: '2962FF',
        lightblue50: 'E1F5FE', lightblue100: 'B3E5FC', lightblue200: '81D4FA', lightblue300: '4FC3F7', lightblue400: '29B6F6', lightblue500: '03A9F4', lightblue600: '039BE5', lightblue700: '0288D1', lightblue800: '0277BD', lightblue900: '01579B', lightbluea100: '80D8FF', lightbluea200: '40C4FF', lightbluea400: '00B0FF', lightbluea700: '0091EA',
        cyan50: 'E0F7FA', cyan100: 'B2EBF2', cyan200: '80DEEA', cyan300: '4DD0E1', cyan400: '26C6DA', cyan500: '00BCD4', cyan600: '00ACC1', cyan700: '0097A7', cyan800: '00838F', cyan900: '006064', cyana100: '84FFFF', cyana200: '18FFFF', cyana400: '00E5FF', cyana700: '00B8D4',
        teal50: 'E0F2F1', teal100: 'B2DFDB', teal200: '80CBC4', teal300: '4DB6AC', teal400: '26A69A', teal500: '009688', teal600: '00897B', teal700: '00796B', teal800: '00695C', teal900: '004D40', teala100: 'A7FFEB', teala200: '64FFDA', teala400: '1DE9B6', teala700: '00BFA5',
        green50: 'E8F5E9', green100: 'C8E6C9', green200: 'A5D6A7', green300: '81C784', green400: '66BB6A', green500: '4CAF50', green600: '43A047', green700: '388E3C', green800: '2E7D32', green900: '1B5E20', greena100: 'B9F6CA', greena200: '69F0AE', greena400: '00E676', greena700: '00C853',
        lightgreen50: 'F1F8E9', lightgreen100: 'DCEDC8', lightgreen200: 'C5E1A5', lightgreen300: 'AED581', lightgreen400: '9CCC65', lightgreen500: '8BC34A', lightgreen600: '7CB342', lightgreen700: '689F38', lightgreen800: '558B2F', lightgreen900: '33691E', lightgreena100: 'CCFF90', lightgreena200: 'B2FF59', lightgreena400: '76FF03', lightgreena700: '64DD17',
        lime50: 'F9FBE7', lime100: 'F0F4C3', lime200: 'E6EE9C', lime300: 'DCE775', lime400: 'D4E157', lime500: 'CDDC39', lime600: 'C0CA33', lime700: 'AFB42B', lime800: '9E9D24', lime900: '827717', limea100: 'F4FF81', limea200: 'EEFF41', limea400: 'C6FF00', limea700: 'AEEA00',
        yellow50: 'FFFDE7', yellow100: 'FFF9C4', yellow200: 'FFF59D', yellow300: 'FFF176', yellow400: 'FFEE58', yellow500: 'FFEB3B', yellow600: 'FDD835', yellow700: 'FBC02D', yellow800: 'F9A825', yellow900: 'F57F17', yellowa100: 'FFFF8D', yellowa200: 'FFFF00', yellowa400: 'FFEA00', yellowa700: 'FFD600',
        amber50: 'FFF8E1', amber100: 'FFECB3', amber200: 'FFE082', amber300: 'FFD54F', amber400: 'FFCA28', amber500: 'FFC107', amber600: 'FFB300', amber700: 'FFA000', amber800: 'FF8F00', amber900: 'FF6F00', ambera100: 'FFE57F', ambera200: 'FFD740', ambera400: 'FFC400', ambera700: 'FFAB00',
        orange50: 'FFF3E0', orange100: 'FFE0B2', orange200: 'FFCC80', orange300: 'FFB74D', orange400: 'FFA726', orange500: 'FF9800', orange600: 'FB8C00', orange700: 'F57C00', orange800: 'EF6C00', orange900: 'E65100', orangea100: 'FFD180', orangea200: 'FFAB40', orangea400: 'FF9100', orangea700: 'FF6D00',
        deeporange50: 'FBE9E7', deeporange100: 'FFCCBC', deeporange200: 'FFAB91', deeporange300: 'FF8A65', deeporange400: 'FF7043', deeporange500: 'FF5722', deeporange600: 'F4511E', deeporange700: 'E64A19', deeporange800: 'D84315', deeporange900: 'BF360C', deeporangea100: 'FF9E80', deeporangea200: 'FF6E40', deeporangea400: 'FF3D00', deeporangea700: 'DD2C00',
        brown50: 'EFEBE9', brown100: 'D7CCC8', brown200: 'BCAAA4', brown300: 'A1887F', brown400: '8D6E63', brown500: '795548', brown600: '6D4C41', brown700: '5D4037', brown800: '4E342E', brown900: '3E2723'
    },
    errorReporting: 'on',

    // color methods ----
    color: function color(val) {
        var color = val.toLowerCase(),
            r = void 0,
            g = void 0,
            b = void 0,
            h = void 0,
            s = void 0,
            l = void 0,
            match = void 0,
            channels = void 0,
            hsl = void 0,
            result = {};
        var hexPattern = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/gi,
            // matches "#123" or "#f05a78" with or without "#"
        RGBAPattern = /^rgba?\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3}),?(0|1|0\.[0-9]{1,2}|\.[0-9]{1,2})?\)$/gi,
            // matches rgb/rgba color values, whitespace allowed
        HSLAPattern = /^hsla?\(([0-9]{1,3}),([0-9]{1,3}%),([0-9]{1,3}%),?(0|1|0\.[0-9]{1,2}|\.[0-9]{1,2})?\)$/gi,
            namedColors = this.colorNames;

        // change named color to corresponding hex value
        if (namedColors[color]) {
            color = namedColors[color];
        }

        // check val for hex color
        if (color.match(hexPattern) !== null) {
            // '#' remove
            color = color.replace('#', '');
            // color has either 3 or 6 characters
            if (color.length % 2 === 1) {

                // color has 3 char -> convert to 6 char
                // r = color.substr(0,1).repeat(2);
                // g = color.substr(1,1).repeat(2); // String.prototype.repeat() doesn't work in IE11
                // b = color.substr(2,1).repeat(2);
                r = String(color.substr(0, 1)) + color.substr(0, 1);
                g = String(color.substr(1, 1)) + color.substr(1, 1);
                b = String(color.substr(2, 1)) + color.substr(2, 1);

                result.rgb = {
                    r: parseInt(r, 16),
                    g: parseInt(g, 16),
                    b: parseInt(b, 16)
                };

                result.hex = '#' + r + g + b;
            } else {

                // color has 6 char
                result.rgb = {
                    r: parseInt(color.substr(0, 2), 16),
                    g: parseInt(color.substr(2, 2), 16),
                    b: parseInt(color.substr(4, 2), 16)
                };

                result.hex = '#' + color;
            }

            hsl = this.rgbToHsl(result.rgb.r, result.rgb.g, result.rgb.b);
            result.hsl = hsl;
            result.rgb.css = 'rgb(' + result.rgb.r + ',' + result.rgb.g + ',' + result.rgb.b + ')';
        }
        // check val for rgb/rgba color
        else if (color.match(RGBAPattern)) {

                match = RGBAPattern.exec(color);
                result.rgb = { css: color, r: match[1], g: match[2], b: match[3] };
                result.hex = this.rgbToHex(match[1], match[2], match[3]);
                hsl = this.rgbToHsl(match[1], match[2], match[3]);
                result.hsl = hsl;
            }
            // check val for hsl/hsla color
            else if (color.match(HSLAPattern)) {

                    match = HSLAPattern.exec(color);

                    h = match[1] / 360;
                    s = match[2].substr(0, match[2].length - 1) / 100;
                    l = match[3].substr(0, match[3].length - 1) / 100;

                    channels = this.hslToRgb(h, s, l);

                    result.rgb = {
                        css: 'rgb(' + channels[0] + ',' + channels[1] + ',' + channels[2] + ')',
                        r: channels[0],
                        g: channels[1],
                        b: channels[2]
                    };
                    result.hex = this.rgbToHex(result.rgb.r, result.rgb.g, result.rgb.b);
                    result.hsl = { css: 'hsl(' + match[1] + ',' + match[2] + ',' + match[3] + ')', h: match[1], s: match[2], l: match[3] };
                }

                // or return #f5f5f5
                else {
                        result.hex = '#f5f5f5';
                        result.rgb = { css: 'rgb(245,245,245)', r: 245, g: 245, b: 245 };
                        result.hsl = { css: 'hsl(0,0%,96%)', h: 0, s: '0%', l: '96%' };
                    }

        return result;
    },
    calcColors: function calcColors(primaryColor) {
        var threshold = this.colorBrightnessThreshold,
            primeColor = this.color(primaryColor),
            filledlightColor = this.lighten(primaryColor, this.colorFilledLight),
            filledColor = this.darken(primaryColor, this.colorFilled),
            fontColorForPrimary = this.perceivedBrightness(primaryColor) <= threshold ? '#ffffff' : '#000000',
            fontColorFilledlight = this.perceivedBrightness(filledlightColor) <= threshold ? '#ffffff' : '#000000',
            fontColorFilled = this.perceivedBrightness(filledColor) <= threshold ? '#ffffff' : '#000000',
            filleddarkColor = this.lighten(primaryColor, this.colorFilledDark),
            fontColorFilleddark = this.perceivedBrightness(filleddarkColor) <= threshold ? '#ffffff' : '#000000';
        return [primeColor.hsl.css, filledlightColor, filledColor, fontColorForPrimary, fontColorFilledlight, fontColorFilled, filleddarkColor, fontColorFilleddark];
    },
    darken: function darken(val, amount) {
        // amount is value between 0 and 1
        var hsl = this.color(val).hsl,
            l = parseFloat(hsl.l),
            lnew = Math.round(l - l * amount) + '%';
        return 'hsl(' + hsl.h + ',' + hsl.s + ',' + lnew + ')';
    },
    lighten: function lighten(val, amount) {
        // amount is value between 0 and 1
        var hsl = this.color(val).hsl,
            l = parseFloat(hsl.l),
            lnew = Math.round(l + (100 - l) * amount) + '%';
        return 'hsl(' + hsl.h + ',' + hsl.s + ',' + lnew + ')';
    },
    hslToRgb: function hslToRgb(h, s, l) {
        // h, s and l must be values between 0 and 1
        var r = void 0,
            g = void 0,
            b = void 0;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1 / 2) {
                    return q;
                }
                if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                }
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    rgbToHsl: function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h = void 0,
            s = void 0,
            l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        //return [ h, s, l ];
        h = Math.round(h * 360);
        s = Math.round(s * 100) + '%';
        l = Math.round(l * 100) + '%';
        return { css: 'hsl(' + h + ',' + s + ',' + l + ')', h: h, s: s, l: l };
    },
    rgbToHex: function rgbToHex(r, g, b) {
        var red = Number(r).toString(16),
            green = Number(g).toString(16),
            blue = Number(b).toString(16);
        if (red.length === 1) {
            red = '0' + red;
        }
        if (green.length === 1) {
            green = '0' + green;
        }
        if (blue.length === 1) {
            blue = '0' + blue;
        }
        return '#' + red + green + blue;
    },
    perceivedBrightness: function perceivedBrightness(val) {
        var rgb = this.color(val).rgb;
        // return value is in the range 0 - 1 and input rgb values must also be in the range 0 - 1
        // https://www.w3.org/TR/WCAG20-TECHS/G18.html
        return rgb.r / 255 * 0.2126 + rgb.g / 255 * 0.7152 + rgb.b / 255 * 0.0722;
    },

    // ---------------------------------------------------

    addScript: function addScript(path) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/javascript';
        var cb = arguments[2];

        if (!document.querySelector('script[src="' + path + '"]')) {
            var script = document.createElement('script');
            script.onload = cb;
            script.src = path;
            script.type = type;
            document.head.appendChild(script);
        }
    },
    autopositionRemaining: function autopositionRemaining(panel) {
        var autoPos = void 0;
        ['left-top-down', 'left-top-right', 'center-top-down', 'right-top-down', 'right-top-left', 'left-bottom-up', 'left-bottom-right', 'center-bottom-up', 'right-bottom-up', 'right-bottom-left'].forEach(function (item) {
            if (panel.classList.contains(item)) {
                autoPos = item;
            }
        });
        if (autoPos) {
            var box = panel.options.container === 'window' ? document.body : panel.options.container;
            box.querySelectorAll('.' + autoPos).forEach(function (item) {
                item.reposition();
            });
        }
    },
    ajax: function ajax(obj, ajaxConfig) {
        // check whether obj is a jsPanel or something else
        var objIsPanel = void 0;
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.classList.contains('jsPanel')) {
            objIsPanel = true;
        } else {
            objIsPanel = false;
            if (typeof obj === 'string') {
                obj = document.querySelector(obj);
            }
        }

        var configDefaults = {
            method: 'GET',
            async: true,
            user: '',
            pwd: '',
            done: function done() {
                objIsPanel ? obj.content.innerHTML = this.responseText : obj.innerHTML = this.responseText;
            },
            autoresize: true,
            autoreposition: true
        };
        var config = void 0;

        if (typeof ajaxConfig === 'string') {
            config = Object.assign({}, configDefaults, { url: encodeURI(ajaxConfig), evalscripttags: true });
        } else if ((typeof ajaxConfig === 'undefined' ? 'undefined' : _typeof(ajaxConfig)) === 'object' && ajaxConfig.url) {
            config = Object.assign({}, configDefaults, ajaxConfig);
            config.url = encodeURI(ajaxConfig.url);
            // reset timeout to 0, withCredentials & responseType to false if request is synchronous
            if (config.async === false) {
                config.timeout = 0;
                if (config.withCredentials) {
                    config.withCredentials = undefined;
                }
                if (config.responseType) {
                    config.responseType = undefined;
                }
            }
        } else {
            if (this.errorReporting) {
                try {
                    throw new jsPanel.jsPanelError('XMLHttpRequest seems to miss the <code>url</code> parameter!');
                } catch (e) {
                    jsPanel.error(e);
                }
            }
            return obj;
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    config.done.call(xhr, obj);

                    // extract and eval content of script tags if "evalscripttags"
                    if (config.evalscripttags) {
                        // get all script tags within responseText
                        var scripttags = xhr.responseText.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
                        if (scripttags) {
                            scripttags.forEach(function (tag) {
                                // remove tags from string and trim it
                                var js = tag.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '').trim();
                                // execute javascript
                                eval(js);
                            });
                        }
                    }
                } else {
                    if (config.fail) {
                        config.fail.call(xhr, obj);
                    }
                }

                if (config.always) {
                    config.always.call(xhr, obj);
                }

                // resize and reposition panel if either width or height is set to 'auto'
                if (objIsPanel) {
                    var oContentSize = obj.options.contentSize;
                    if (typeof oContentSize === 'string' && oContentSize.match(/auto/i)) {
                        var parts = oContentSize.split(' '),
                            sizes = Object.assign({}, { width: parts[0], height: parts[1] });
                        if (config.autoresize) {
                            obj.resize(sizes);
                        }
                        if (!obj.classList.contains('jsPanel-contextmenu')) {
                            if (config.autoreposition) {
                                obj.reposition();
                            }
                        }
                    } else if ((typeof oContentSize === 'undefined' ? 'undefined' : _typeof(oContentSize)) === 'object' && (oContentSize.width === 'auto' || oContentSize.height === 'auto')) {
                        var _sizes = Object.assign({}, oContentSize);
                        if (config.autoresize) {
                            obj.resize(_sizes);
                        }
                        if (!obj.classList.contains('jsPanel-contextmenu')) {
                            if (config.autoreposition) {
                                obj.reposition();
                            }
                        }
                    }
                }

                // allows plugins to add callback functions to the ajax always callback
                if (jsPanel.ajaxAlwaysCallbacks.length) {
                    jsPanel.ajaxAlwaysCallbacks.forEach(function (item) {
                        item.call(obj, obj);
                    });
                }
            }
        };

        xhr.open(config.method, config.url, config.async, config.user, config.pwd);
        xhr.timeout = config.timeout || 0;
        if (config.withCredentials) {
            xhr.withCredentials = config.withCredentials;
        }
        if (config.responseType) {
            xhr.responseType = config.responseType;
        }

        if (config.beforeSend) {
            config.beforeSend.call(xhr);
        }
        if (config.data) {
            xhr.send(config.data);
        } else {
            xhr.send(null);
        }

        return obj;
    },
    close: function close(panel, cb) {
        if (panel.closetimer) {
            window.clearTimeout(panel.closetimer);
        }
        var id = panel.id,
            parent = panel.parentElement,
            jspanelbeforeclose = new CustomEvent('jspanelbeforeclose', { 'detail': id }),
            jspanelclosed = new CustomEvent('jspanelclosed', { 'detail': id });
        document.dispatchEvent(jspanelbeforeclose);

        if (panel.options.onbeforeclose && panel.options.onbeforeclose.length > 0 && !jsPanel.processCallbacks(panel, panel.options.onbeforeclose, 'some', panel.status)) {
            return panel;
        }

        if (panel.options.animateOut) {
            if (panel.options.animateIn) {
                jsPanel.remClass(panel, panel.options.animateIn);
            }
            jsPanel.setClass(panel, panel.options.animateOut);
            panel.addEventListener('animationend', function () {
                parent.removeChild(panel);
                if (!document.getElementById(id)) {
                    jsPanel.removeMinimizedReplacement(panel);
                    document.dispatchEvent(jspanelclosed);
                    if (panel.options.onclosed) {
                        jsPanel.processCallbacks(panel, panel.options.onclosed, 'every');
                    }
                    jsPanel.autopositionRemaining(panel);
                    if (cb) {
                        cb.call(id, id);
                    }
                } else {
                    if (cb) {
                        cb.call(panel, id, panel);
                    }
                }
            });
        } else {
            parent.removeChild(panel);
            if (!document.getElementById(id)) {
                jsPanel.removeMinimizedReplacement(panel);
                document.dispatchEvent(jspanelclosed);
                if (panel.options.onclosed) {
                    jsPanel.processCallbacks(panel, panel.options.onclosed, 'every');
                }
                jsPanel.autopositionRemaining(panel);
                if (cb) {
                    cb.call(id, id);
                }
            } else {
                if (cb) {
                    cb.call(panel, id, panel);
                }
            }
        }
    },
    createPanelTemplate: function createPanelTemplate() {
        var dataAttr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var panel = document.createElement('div');
        panel.className = 'jsPanel';
        if (dataAttr) {
            ['close', 'maximize', 'normalize', 'minimize', 'smallify', 'smallifyrev'].forEach(function (item) {
                panel.setAttribute('data-btn' + item, 'enabled');
            });
        }
        panel.innerHTML = '<div class="jsPanel-hdr">\n                                <div class="jsPanel-headerbar">\n                                    <div class="jsPanel-headerlogo"></div>\n                                    <div class="jsPanel-titlebar">\n                                        <span class="jsPanel-title"></span>\n                                    </div>\n                                    <div class="jsPanel-controlbar">\n                                        <div class="jsPanel-btn jsPanel-btn-smallify">' + this.icons.smallify + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-smallifyrev">' + this.icons.smallifyrev + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-minimize">' + this.icons.minimize + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-normalize">' + this.icons.normalize + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-maximize">' + this.icons.maximize + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-close">' + this.icons.close + '</div>\n                                    </div>\n                                </div>\n                                <div class="jsPanel-hdr-toolbar"></div>\n                            </div>\n                            <div class="jsPanel-content"></div>\n                            <div class="jsPanel-minimized-box"></div>\n                            <div class="jsPanel-ftr"></div>';
        return panel;
    },
    createMinimizedTemplate: function createMinimizedTemplate() {
        var panel = document.createElement('div');
        panel.className = 'jsPanel-replacement';
        panel.innerHTML = '<div class="jsPanel-hdr">\n                                <div class="jsPanel-headerbar">\n                                    <div class="jsPanel-headerlogo"></div>\n                                    <div class="jsPanel-titlebar">\n                                        <span class="jsPanel-title"></span>\n                                    </div>\n                                    <div class="jsPanel-controlbar">\n                                        <div class="jsPanel-btn jsPanel-btn-md jsPanel-btn-normalize">' + this.icons.normalize + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-md jsPanel-btn-maximize">' + this.icons.maximize + '</div>\n                                        <div class="jsPanel-btn jsPanel-btn-md jsPanel-btn-close">' + this.icons.close + '</div>\n                                    </div>\n                                </div>\n                            </div>';
        return panel;
    },
    createSnapArea: function createSnapArea(panel, pos, snapsens) {
        var el = document.createElement('div'),
            parent = panel.parentElement;
        el.className = 'jsPanel-snap-area jsPanel-snap-area-' + pos;
        if (pos === 'lt' || pos === 'rt' || pos === 'rb' || pos === 'lb') {
            el.style.width = snapsens + 'px';
            el.style.height = snapsens + 'px';
        } else if (pos === 'ct' || pos === 'cb') {
            el.style.height = snapsens + 'px';
        } else if (pos === 'lc' || pos === 'rc') {
            el.style.width = snapsens + 'px';
        }
        if (parent !== document.body) {
            el.style.position = 'absolute';
        }
        if (!document.querySelector('.jsPanel-snap-area.jsPanel-snap-area-' + pos)) {
            panel.parentElement.appendChild(el);
        }
    },
    dragit: function dragit(elmt) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var dragstarted = void 0,
            dragElmt = void 0;
        var jspaneldragstart = new CustomEvent('jspaneldragstart', { detail: elmt.id }),
            jspaneldrag = new CustomEvent('jspaneldrag', { detail: elmt.id }),
            jspaneldragstop = new CustomEvent('jspaneldragstop', { detail: elmt.id }),
            opts = Object.assign({}, this.defaults.dragit, options),
            containment = this.pOcontainment(opts.containment);

        // normalize grid config
        if (opts.grid && Array.isArray(opts.grid)) {
            if (opts.grid.length === 1) {
                opts.grid[1] = opts.grid[0];
            }
        }

        // attach handler to each drag handle
        elmt.querySelectorAll(opts.handles).forEach(function (handle) {

            handle.style.touchAction = 'none';
            handle.style.cursor = opts.cursor;

            jsPanel.pointerdown.forEach(function (evt) {
                handle.addEventListener(evt, function (e) {
                    // prevent body scroll on drag init
                    e.preventDefault();

                    // disable dragging for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }

                    // footer elmts with the class "jsPanel-ftr-btn" don't drag a panel
                    // do not compare e.target with e.currentTarget because there might be footer elmts supposed to drag the panel
                    // noinspection JSUnresolvedFunction
                    if (e.target.closest('.jsPanel-ftr-btn')) {
                        return;
                    }

                    elmt.controlbar.style.pointerEvents = 'none';
                    elmt.content.style.pointerEvents = 'none'; // without this code handler might not be unbound when content has iframe or object tag

                    var startStyles = window.getComputedStyle(elmt),
                        startLeft = parseFloat(startStyles.left),
                        startTop = parseFloat(startStyles.top),
                        psx = e.touches ? e.touches[0].clientX : e.clientX,
                        // pointer x on mousedown (don't use pageX, doesn't work on FF for Android)
                    psy = e.touches ? e.touches[0].clientY : e.clientY,
                        // same as above
                    parent = elmt.parentElement,
                        parentRect = parent.getBoundingClientRect(),
                        parentStyles = window.getComputedStyle(parent),
                        scaleFactor = elmt.getScaleFactor(),
                        startLeftCorrection = 0;

                    // function actually dragging the elmt
                    dragElmt = function dragElmt(e) {
                        e.preventDefault();

                        if (!dragstarted) {
                            document.dispatchEvent(jspaneldragstart);
                            elmt.style.opacity = opts.opacity;
                            // if configured restore panel size to values before snap and reposition reasonable before drag actually starts
                            if (elmt.snapped && opts.snap.resizeToPreSnap && elmt.currentData.beforeSnap) {
                                elmt.resize(elmt.currentData.beforeSnap.width + ' ' + elmt.currentData.beforeSnap.height);
                                var intermediateStyles = elmt.getBoundingClientRect(),
                                    delta = psx - (intermediateStyles.left + intermediateStyles.width),
                                    wHalf = intermediateStyles.width / 2;
                                if (delta > -wHalf) {
                                    startLeftCorrection = delta + wHalf;
                                }
                            }
                            // dragstart callback
                            if (opts.start.length) {
                                jsPanel.processCallbacks(elmt, opts.start, false, { left: startLeft, top: startTop }, e);
                            }
                            jsPanel.front(elmt);
                            elmt.snapped = false;
                        }
                        dragstarted = 1;

                        if (opts.disableOnMaximized && elmt.status === 'maximized') {
                            return false;
                        }

                        var elmtL = void 0,
                            elmtL2 = void 0,
                            elmtT = void 0,
                            elmtT2 = void 0,
                            elmtR = void 0,
                            elmtR2 = void 0,
                            elmtB = void 0,
                            elmtB2 = void 0,
                            right = void 0,
                            bottom = void 0;
                        var pmx = e.touches ? e.touches[0].clientX : e.clientX,
                            // current pointer x while pointer moves (don't use pageX, doesn't work on FF for Android)
                        pmy = e.touches ? e.touches[0].clientY : e.clientY,
                            // current pointer y while pointer moves (don't use pageY, doesn't work on FF for Android)
                        dragStyles = window.getComputedStyle(elmt); // get current styles while dragging

                        // EDGE reports "auto" instead of pixel value using getComputedStyle(), so some values need to be calculated different
                        if (parent === document.body) {
                            var elmtRect = elmt.getBoundingClientRect();
                            right = window.innerWidth - parseInt(parentStyles.borderLeftWidth, 10) - parseInt(parentStyles.borderRightWidth, 10) - (elmtRect.left + elmtRect.width);
                            bottom = window.innerHeight - parseInt(parentStyles.borderTopWidth, 10) - parseInt(parentStyles.borderBottomWidth, 10) - (elmtRect.top + elmtRect.height);
                        } else {
                            right = parseInt(parentStyles.width, 10) - parseInt(parentStyles.borderLeftWidth, 10) - parseInt(parentStyles.borderRightWidth, 10) - (parseInt(dragStyles.left, 10) + parseInt(dragStyles.width, 10));
                            bottom = parseInt(parentStyles.height, 10) - parseInt(parentStyles.borderTopWidth, 10) - parseInt(parentStyles.borderBottomWidth, 10) - (parseInt(dragStyles.top, 10) + parseInt(dragStyles.height, 10));
                        }
                        // -- -- --

                        elmtL = parseFloat(dragStyles.left);
                        elmtT = parseFloat(dragStyles.top);
                        elmtR = right; // instead of parseFloat(dragStyles.right);
                        elmtB = bottom; // instead of parseFloat(dragStyles.bottom);

                        if (opts.snap) {
                            if (opts.snap.trigger === 'panel') {
                                elmtL2 = Math.pow(elmtL, 2);
                                elmtT2 = Math.pow(elmtT, 2);
                                elmtR2 = Math.pow(elmtR, 2);
                                elmtB2 = Math.pow(elmtB, 2);
                            } else if (opts.snap.trigger === 'pointer') {
                                if (elmt.options.container === 'window') {
                                    elmtL = pmx;
                                    elmtT = pmy;
                                    elmtR = window.innerWidth - pmx;
                                    elmtB = window.innerHeight - pmy;
                                    elmtL2 = Math.pow(pmx, 2);
                                    elmtT2 = Math.pow(elmtT, 2);
                                    elmtR2 = Math.pow(elmtR, 2);
                                    elmtB2 = Math.pow(elmtB, 2);
                                } else {
                                    var overlaps = jsPanel.overlaps(elmt, parent, 'paddingbox', e);
                                    elmtL = overlaps.pointer.left;
                                    elmtT = overlaps.pointer.top;
                                    elmtR = overlaps.pointer.right;
                                    elmtB = overlaps.pointer.bottom;
                                    elmtL2 = Math.pow(overlaps.pointer.left, 2);
                                    elmtT2 = Math.pow(overlaps.pointer.top, 2);
                                    elmtR2 = Math.pow(overlaps.pointer.right, 2);
                                    elmtB2 = Math.pow(overlaps.pointer.bottom, 2);
                                }
                            }
                        }

                        var lefttopVectorDrag = Math.sqrt(elmtL2 + elmtT2),
                            leftbottomVectorDrag = Math.sqrt(elmtL2 + elmtB2),
                            righttopVectorDrag = Math.sqrt(elmtR2 + elmtT2),
                            rightbottomVectorDrag = Math.sqrt(elmtR2 + elmtB2),
                            horizontalDeltaDrag = Math.abs(elmtL - elmtR) / 2,
                            verticalDeltaDrag = Math.abs(elmtT - elmtB) / 2,
                            leftVectorDrag = Math.sqrt(elmtL2 + Math.pow(verticalDeltaDrag, 2)),
                            topVectorDrag = Math.sqrt(elmtT2 + Math.pow(horizontalDeltaDrag, 2)),
                            rightVectorDrag = Math.sqrt(elmtR2 + Math.pow(verticalDeltaDrag, 2)),
                            bottomVectorDrag = Math.sqrt(elmtB2 + Math.pow(horizontalDeltaDrag, 2));

                        // prevent selections while dragging
                        window.getSelection().removeAllRanges();

                        // trigger drag permanently while dragging
                        document.dispatchEvent(jspaneldrag);

                        // move elmt
                        if (!opts.axis || opts.axis === 'x') {
                            elmt.style.left = startLeft + (pmx - psx) / scaleFactor.x + startLeftCorrection + 'px'; // set new css left of elmt depending on opts.axis
                        }
                        if (!opts.axis || opts.axis === 'y') {
                            elmt.style.top = startTop + (pmy - psy) / scaleFactor.y + 'px'; // set new css top of elmt depending on opts.axis
                        }

                        // apply grid option
                        if (opts.grid) {
                            // formula rounds to nearest multiple of grid
                            // https://www.webveteran.com/blog/web-coding/javascript-round-to-any-multiple-of-a-specific-number/
                            var x = opts.grid[0] * Math.round((startLeft + (pmx - psx)) / opts.grid[0]),
                                y = opts.grid[1] * Math.round((startTop + (pmy - psy)) / opts.grid[1]);
                            elmt.style.left = x + 'px';
                            elmt.style.top = y + 'px';
                        }

                        // apply containment option
                        if (opts.containment || opts.containment === 0) {
                            var maxLeft = void 0,
                                maxTop = void 0;

                            // calc maxLeft and maxTop (minLeft and MinTop is equal to containment setting)
                            if (elmt.options.container === document.body) {
                                maxLeft = window.innerWidth - parseFloat(dragStyles.width) - containment[1];
                                maxTop = window.innerHeight - parseFloat(dragStyles.height) - containment[2];
                            } else {
                                var xCorr = parseFloat(parentStyles.borderLeftWidth) + parseFloat(parentStyles.borderRightWidth),
                                    yCorr = parseFloat(parentStyles.borderTopWidth) + parseFloat(parentStyles.borderBottomWidth);
                                maxLeft = parentRect.width / scaleFactor.x - parseFloat(dragStyles.width) - containment[1] - xCorr;
                                maxTop = parentRect.height / scaleFactor.y - parseFloat(dragStyles.height) - containment[2] - yCorr;
                            }

                            if (parseFloat(elmt.style.left) <= containment[3]) {
                                elmt.style.left = containment[3] + 'px';
                            }
                            if (parseFloat(elmt.style.top) <= containment[0]) {
                                elmt.style.top = containment[0] + 'px';
                            }
                            if (parseFloat(elmt.style.left) >= maxLeft) {
                                elmt.style.left = maxLeft + 'px';
                            }
                            if (parseFloat(elmt.style.top) >= maxTop) {
                                elmt.style.top = maxTop + 'px';
                            }
                        }

                        // callback while dragging
                        if (opts.drag.length) {
                            jsPanel.processCallbacks(elmt, opts.drag, false, { left: elmtL, top: elmtT, right: elmtR, bottom: elmtB }, e);
                        }

                        // apply snap options
                        if (opts.snap) {
                            var snapSens = opts.snap.sensitivity,
                                topSensAreaLength = parent === document.body ? window.innerWidth / 8 : parentRect.width / 8,
                                sideSensAreaLength = parent === document.body ? window.innerHeight / 8 : parentRect.height / 8;
                            elmt.snappableTo = false;
                            jsPanel.removeSnapAreas();

                            if (lefttopVectorDrag < snapSens) {
                                elmt.snappableTo = 'left-top';
                                if (opts.snap.snapLeftTop !== false) {
                                    jsPanel.createSnapArea(elmt, 'lt', snapSens);
                                }
                            } else if (leftbottomVectorDrag < snapSens) {
                                elmt.snappableTo = 'left-bottom';
                                if (opts.snap.snapLeftBottom !== false) {
                                    jsPanel.createSnapArea(elmt, 'lb', snapSens);
                                }
                            } else if (righttopVectorDrag < snapSens) {
                                elmt.snappableTo = 'right-top';
                                // noinspection JSUnresolvedVariable
                                if (opts.snap.snapRightTop !== false) {
                                    jsPanel.createSnapArea(elmt, 'rt', snapSens);
                                }
                            } else if (rightbottomVectorDrag < snapSens) {
                                elmt.snappableTo = 'right-bottom';
                                // noinspection JSUnresolvedVariable
                                if (opts.snap.snapRightBottom !== false) {
                                    jsPanel.createSnapArea(elmt, 'rb', snapSens);
                                }
                            } else if (elmtT < snapSens && topVectorDrag < topSensAreaLength) {
                                elmt.snappableTo = 'center-top';
                                if (opts.snap.snapCenterTop !== false) {
                                    jsPanel.createSnapArea(elmt, 'ct', snapSens);
                                }
                            } else if (elmtL < snapSens && leftVectorDrag < sideSensAreaLength) {
                                elmt.snappableTo = 'left-center';
                                // noinspection JSUnresolvedVariable
                                if (opts.snap.snapLeftCenter !== false) {
                                    jsPanel.createSnapArea(elmt, 'lc', snapSens);
                                }
                            } else if (elmtR < snapSens && rightVectorDrag < sideSensAreaLength) {
                                elmt.snappableTo = 'right-center';
                                // noinspection JSUnresolvedVariable
                                if (opts.snap.snapRightCenter !== false) {
                                    jsPanel.createSnapArea(elmt, 'rc', snapSens);
                                }
                            } else if (elmtB < snapSens && bottomVectorDrag < topSensAreaLength) {
                                elmt.snappableTo = 'center-bottom';
                                // noinspection JSUnresolvedVariable
                                if (opts.snap.snapCenterBottom !== false) {
                                    jsPanel.createSnapArea(elmt, 'cb', snapSens);
                                }
                            }
                        }
                    };

                    jsPanel.pointermove.forEach(function (e) {
                        document.addEventListener(e, dragElmt);
                    });

                    // remove resize handler when mouse leaves browser window (mouseleave doesn't work)
                    window.addEventListener('mouseout', function (e) {
                        if (e.relatedTarget === null) {
                            jsPanel.pointermove.forEach(function (item) {
                                document.removeEventListener(item, dragElmt, false);
                                elmt.style.opacity = 1;
                            });
                        }
                    }, false);
                });
            });

            jsPanel.pointerup.forEach(function (item) {
                document.addEventListener(item, function (e) {

                    jsPanel.pointermove.forEach(function (e) {
                        document.removeEventListener(e, dragElmt);
                    });

                    document.body.style.overflow = 'inherit';
                    jsPanel.removeSnapAreas();

                    if (dragstarted) {
                        elmt.style.opacity = 1;
                        dragstarted = undefined;
                        elmt.saveCurrentPosition();
                        elmt.calcSizeFactors(); // important for option.onwindowresize
                        document.dispatchEvent(jspaneldragstop);

                        if (opts.snap) {
                            if (elmt.snappableTo === 'left-top') {
                                jsPanel.snapPanel(elmt, opts.snap.snapLeftTop);
                            } else if (elmt.snappableTo === 'center-top') {
                                jsPanel.snapPanel(elmt, opts.snap.snapCenterTop);
                            } else if (elmt.snappableTo === 'right-top') {
                                // noinspection JSUnresolvedVariable
                                jsPanel.snapPanel(elmt, opts.snap.snapRightTop);
                            } else if (elmt.snappableTo === 'right-center') {
                                // noinspection JSUnresolvedVariable
                                jsPanel.snapPanel(elmt, opts.snap.snapRightCenter);
                            } else if (elmt.snappableTo === 'right-bottom') {
                                // noinspection JSUnresolvedVariable
                                jsPanel.snapPanel(elmt, opts.snap.snapRightBottom);
                            } else if (elmt.snappableTo === 'center-bottom') {
                                // noinspection JSUnresolvedVariable
                                jsPanel.snapPanel(elmt, opts.snap.snapCenterBottom);
                            } else if (elmt.snappableTo === 'left-bottom') {
                                jsPanel.snapPanel(elmt, opts.snap.snapLeftBottom);
                            } else if (elmt.snappableTo === 'left-center') {
                                // noinspection JSUnresolvedVariable
                                jsPanel.snapPanel(elmt, opts.snap.snapLeftCenter);
                            }

                            if (opts.snap.callback && elmt.snappableTo && typeof opts.snap.callback === 'function') {
                                opts.snap.callback.call(elmt, elmt);
                            }

                            if (elmt.snappableTo && opts.snap.repositionOnSnap) {
                                elmt.repositionOnSnap(elmt.snappableTo);
                            }
                        }

                        if (opts.stop.length) {
                            jsPanel.processCallbacks(elmt, opts.stop, false, { left: parseFloat(elmt.style.left), top: parseFloat(elmt.style.top) }, e);
                        }
                    }

                    elmt.controlbar.style.pointerEvents = 'inherit';
                    elmt.content.style.pointerEvents = 'inherit';
                });
            });

            // dragit is initialized - now disable if set
            if (opts.disable) {
                handle.style.pointerEvents = 'none';
            }
        });

        return elmt;
    },
    emptyNode: function emptyNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    },
    extend: function extend(obj) {
        // obj needs to be a plain object (to extend the individual panel, not the global object)
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            for (var ext in obj) {
                if (obj.hasOwnProperty(ext)) {
                    this.extensions[ext] = obj[ext];
                }
            }
        }
    },
    fetch: function (_fetch) {
        function fetch(_x4) {
            return _fetch.apply(this, arguments);
        }

        fetch.toString = function () {
            return _fetch.toString();
        };

        return fetch;
    }(function (obj) {
        var confDefaults = {
            bodyMethod: 'text',
            evalscripttags: true,
            autoresize: true,
            autoreposition: true,
            done: function done(obj, response) {
                obj.content.innerHTML = response;
            }
        },
            conf = typeof obj.options.contentFetch === 'string' ? Object.assign({ resource: obj.options.contentFetch }, confDefaults) : Object.assign(confDefaults, obj.options.contentFetch);
        var fetchInit = conf.fetchInit || {};
        if (!conf.resource) {
            if (this.errorReporting) {
                try {
                    throw new jsPanel.jsPanelError('The Fetch request seems to miss the <code>resource</code> parameter');
                } catch (e) {
                    jsPanel.error(e);
                }
            }
            return obj;
        }
        if (conf.beforeSend) {
            conf.beforeSend.call(obj, obj);
        }
        fetch(conf.resource, fetchInit).then(function (response) {
            if (response.ok) {
                return response[conf.bodyMethod]();
            }
        }).then(function (response) {
            conf.done.call(obj, obj, response);
            // extract and eval content of script tags if "evalscripttags"
            if (conf.evalscripttags) {
                // get all script tags within responseText
                var scripttags = response.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
                if (scripttags) {
                    scripttags.forEach(function (tag) {
                        // remove tags from string and trim it
                        var js = tag.replace(/<script\b[^>]*>/i, '').replace(/<\/script>/i, '').trim();
                        // execute javascript
                        eval(js);
                    });
                }
            }
            // resize and reposition panel if either width or height is set to 'auto'
            var oContentSize = obj.options.contentSize;
            if (conf.autoresize || conf.autoreposition) {
                if (typeof oContentSize === 'string' && oContentSize.match(/auto/i)) {
                    var parts = oContentSize.split(' '),
                        sizes = Object.assign({}, { width: parts[0], height: parts[1] });
                    if (conf.autoresize) {
                        obj.resize(sizes);
                    }
                    if (!obj.classList.contains('jsPanel-contextmenu')) {
                        if (conf.autoreposition) {
                            obj.reposition();
                        }
                    }
                } else if ((typeof oContentSize === 'undefined' ? 'undefined' : _typeof(oContentSize)) === 'object' && (oContentSize.width === 'auto' || oContentSize.height === 'auto')) {
                    var _sizes2 = Object.assign({}, oContentSize);
                    if (conf.autoresize) {
                        obj.resize(_sizes2);
                    }
                    if (!obj.classList.contains('jsPanel-contextmenu')) {
                        if (conf.autoreposition) {
                            obj.reposition();
                        }
                    }
                }
            }
        });
    }),
    front: function front(obj) {
        if (obj.status === 'minimized') {
            if (obj.statusBefore === 'maximized') {
                obj.maximize();
            } else {
                obj.normalize();
            }
        } else {
            var newArr = Array.prototype.slice.call(document.querySelectorAll('.jsPanel-standard')).map(function (panel) {
                return panel.style.zIndex;
            });
            if (Math.max.apply(Math, _toConsumableArray(newArr)) > obj.style.zIndex) {
                obj.style.zIndex = jsPanel.zi.next();
            }
            this.resetZi();
        }
        // iframe extra: panel with an iframe get a content overlay if panel is not the topmost panel -> content section click fronts the panel
        this.getPanels().forEach(function (item, index) {
            var overlay = item.content.querySelector('.jsPanel-iframe-overlay');
            if (index > 0) {
                if (item.content.querySelector('iframe') && !overlay) {
                    var _overlay = document.createElement('div');
                    _overlay.className = 'jsPanel-iframe-overlay';
                    item.content.appendChild(_overlay);
                }
            } else {
                if (overlay) {
                    item.content.removeChild(overlay);
                }
            }
        });
    },
    getPanels: function getPanels() {
        var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
            return this.classList.contains('jsPanel-standard');
        };

        return Array.prototype.slice.call(document.querySelectorAll('.jsPanel')).filter(function (value) {
            return condition.call(value, value);
        }).sort(function (a, b) {
            return b.style.zIndex - a.style.zIndex;
        });
    },
    overlaps: function overlaps(panel, reference, elmtBox, event) {
        // if elmtBox === 'paddingbox' elmt border-width is subtracted from return values
        // in other words: overlap is measured against elmt padding-box and not border-box
        var pane = typeof panel === 'string' ? document.querySelector(panel) : panel,
            panelRect = pane.getBoundingClientRect(),
            parentStyle = getComputedStyle(pane.parentElement),
            scaleFactor = pane.getScaleFactor(),
            parentBorderWidth = { top: 0, right: 0, bottom: 0, left: 0 };
        var referenceRect = void 0,
            evtX = 0,
            evtY = 0,
            evtXparent = 0,
            evtYparent = 0;

        if (pane.options.container !== 'window' && elmtBox === 'paddingbox') {
            parentBorderWidth.top = parseInt(parentStyle.borderTopWidth, 10) * scaleFactor.y;
            parentBorderWidth.right = parseInt(parentStyle.borderRightWidth, 10) * scaleFactor.x;
            parentBorderWidth.bottom = parseInt(parentStyle.borderBottomWidth, 10) * scaleFactor.y;
            parentBorderWidth.left = parseInt(parentStyle.borderLeftWidth, 10) * scaleFactor.x;
        }

        if (typeof reference === 'string') {
            if (reference === 'window') {
                referenceRect = { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
            } else if (reference === 'parent') {
                referenceRect = pane.parentElement.getBoundingClientRect();
            } else {
                referenceRect = document.querySelector(reference).getBoundingClientRect();
            }
        } else {
            referenceRect = reference.getBoundingClientRect();
        }

        if (event) {
            evtX = event.touches ? event.touches[0].clientX : event.clientX;
            evtY = event.touches ? event.touches[0].clientY : event.clientY;
            evtXparent = evtX - referenceRect.left;
            evtYparent = evtY - referenceRect.top;
        }

        var overlapsX = panelRect.left < referenceRect.right && panelRect.right > referenceRect.left,
            overlapsY = panelRect.top < referenceRect.bottom && panelRect.bottom > referenceRect.top,
            overlaps = overlapsX && overlapsY;

        return {
            overlaps: overlaps,
            top: panelRect.top - referenceRect.top - parentBorderWidth.top,
            right: referenceRect.right - panelRect.right - parentBorderWidth.right,
            bottom: referenceRect.bottom - panelRect.bottom - parentBorderWidth.bottom,
            left: panelRect.left - referenceRect.left - parentBorderWidth.left,
            parentBorderWidth: parentBorderWidth,
            panelRect: panelRect,
            referenceRect: referenceRect,
            pointer: { // pointer coords relative to window and reference
                clientX: evtX,
                clientY: evtY,
                left: evtXparent - parentBorderWidth.left,
                top: evtYparent - parentBorderWidth.top,
                right: referenceRect.width - evtXparent - parentBorderWidth.right,
                bottom: referenceRect.height - evtYparent - parentBorderWidth.bottom
            }
        };
    },
    pOcontainer: function pOcontainer(container) {
        if (container) {
            if (typeof container === 'string') {
                return container === 'window' ? document.body : document.querySelector(container);
            } else if (container.nodeType === 1) {
                return container;
            } else if (container.length) {
                return container[0];
            }
        }
        return false;
    },


    // normalizes values for option.maximizedMargin and containment of dragit/resizeit
    pOcontainment: function pOcontainment(arg) {
        var value = arg;
        if (typeof arg === 'function') {
            value = arg();
        }
        if (typeof value === 'number') {
            // value: 20 => value: [20, 20, 20, 20]
            return [value, value, value, value];
        } else if (Array.isArray(value)) {
            if (value.length === 1) {
                // value: [20] => value: [20, 20, 20, 20]
                return [value[0], value[0], value[0], value[0]];
            } else if (value.length === 2) {
                // value: [20, 40] => value: [20, 40, 20, 40]
                return value.concat(value);
            } else if (value.length === 3) {
                value[3] = value[1];
            }
        }
        return value; // assumed to be array with 4 values
    },
    pOsize: function pOsize(panel, size) {
        var values = size || this.defaults.contentSize;
        var parent = panel.parentElement;
        if (typeof values === 'string') {
            var nums = values.trim().split(' ');
            values = {};
            values.width = nums[0];
            nums.length === 2 ? values.height = nums[1] : values.height = nums[0];
        } else {
            if (values.width && !values.height) {
                // noinspection JSSuspiciousNameCombination
                values.height = values.width;
            } else if (values.height && !values.width) {
                // noinspection JSSuspiciousNameCombination
                values.width = values.height;
            }
        }

        if (String(values.width).match(/^[0-9.]+$/gi)) {
            // if number only
            values.width += 'px';
        } else if (typeof values.width === 'string' && values.width.endsWith('%')) {
            if (parent === document.body) {
                values.width = window.innerWidth * (parseFloat(values.width) / 100) + 'px';
            } else {
                var prtStyles = window.getComputedStyle(parent),
                    border = parseFloat(prtStyles.borderLeftWidth) + parseFloat(prtStyles.borderRightWidth);
                values.width = (parseFloat(prtStyles.width) - border) * (parseFloat(values.width) / 100) + 'px';
            }
        } else if (typeof values.width === 'function') {
            values.width = values.width.call(panel, panel);
            if (typeof values.width === 'number') {
                values.width += 'px';
            } else if (typeof values.width === 'string' && values.width.match(/^[0-9.]+$/gi)) {
                values.width += 'px';
            }
        }

        if (String(values.height).match(/^[0-9.]+$/gi)) {
            // if number only
            values.height += 'px';
        } else if (typeof values.height === 'string' && values.height.endsWith('%')) {
            if (parent === document.body) {
                values.height = window.innerHeight * (parseFloat(values.height) / 100) + 'px';
            } else {
                var _prtStyles = window.getComputedStyle(parent),
                    _border = parseFloat(_prtStyles.borderTopWidth) + parseFloat(_prtStyles.borderBottomWidth);
                values.height = (parseFloat(_prtStyles.height) - _border) * (parseFloat(values.height) / 100) + 'px';
            }
        } else if (typeof values.height === 'function') {
            values.height = values.height.call(panel, panel);
            if (typeof values.height === 'number') {
                values.height += 'px';
            } else if (typeof values.height === 'string' && values.height.match(/^[0-9.]+$/gi)) {
                values.height += 'px';
            }
        }

        return values; // return value must be object {width: xxx, height: xxx}
    },
    pOborder: function pOborder(border) {
        border = border.trim();
        var values = new Array(3),
            regexStyle = /\s*(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)\s*/gi,
            regexWidth = /\s*(thin|medium|thick)|(\d*\.?\d+[a-zA-Z]{2,4})\s*/gi,
            borderStyle = border.match(regexStyle),
            borderWidth = border.match(regexWidth);

        if (borderStyle) {
            values[1] = borderStyle[0].trim();
            border = border.replace(values[1], '');
        } else {
            values[1] = 'solid';
        }
        if (borderWidth) {
            values[0] = borderWidth[0].trim();
            border = border.replace(values[0], '');
        } else {
            values[0] = 'medium';
        }
        values[2] = border.trim();
        return values;
    },
    pOposition: function pOposition(positionString) {
        var pos = positionString.trim().toLowerCase();
        var settings = {},
            regexMyAt = /(^|\s)((left-|right-)(top|center|bottom){1})|((center-){1}(top|bottom){1})|(center)/gi,
            regexAutopos = /(^|\s)(right|down|left|up)/gi,
            regexOffset = /(^|\s)-?(\d*\.?\d+)([a-zA-Z]{0,4})/gi;

        // find my and at
        var my_at = pos.match(regexMyAt);
        if (my_at) {
            settings.my = my_at[0].trim();
            settings.at = my_at[1] ? my_at[1].trim() : my_at[0].trim();
        }
        pos = pos.replace(regexMyAt, ' ').trim();

        // find autoposition
        var autopos = pos.match(regexAutopos); // do not move up in code
        if (autopos) {
            settings.autoposition = autopos[0].trim();
        }
        pos = pos.replace(regexAutopos, ' ').trim();

        // find offsets
        var offsets = pos.match(regexOffset); // do not move up in code
        if (offsets) {
            offsets.forEach(function (item, index) {
                item = item.trim();
                if (item.match(/(^|\s)(-?[0-9]*\.?[0-9]+)(\s|$)/)) {
                    offsets[index] = (offsets[index] + 'px').trim();
                }
            });
            settings.offsetX = offsets[0].trim();
            settings.offsetY = offsets[1] ? offsets[1].trim() : offsets[0].trim();
        }
        pos = pos.replace(regexOffset, ' ').trim();

        // find of
        if (pos.length) {
            // assumed to be a selector string
            settings.of = pos;
        }

        return settings;
    },
    pOheaderControls: function pOheaderControls(oHdrCtrls) {
        if (typeof oHdrCtrls === 'string') {
            var setting = {},
                str = oHdrCtrls.toLowerCase(),
                sizeMatch = str.match(/xl|lg|md|sm|xs/),
                ctrlMatch = str.match(/closeonly|none/);
            if (sizeMatch) {
                setting.size = sizeMatch[0];
            }
            if (ctrlMatch) {
                setting = Object.assign({}, setting, { maximize: 'remove', normalize: 'remove', minimize: 'remove', smallify: 'remove', smallifyrev: 'remove' });
                if (ctrlMatch[0] === 'none') {
                    setting.close = 'remove';
                }
            }
            return Object.assign({}, this.defaults.headerControls, setting);
        } else {
            return Object.assign({}, this.defaults.headerControls, oHdrCtrls);
        }
    },
    position: function position(elmt, _position) {
        var elmtToPosition = void 0,
            posSettings = void 0,
            elmtToPositionAgainst = void 0,
            myXcorrection = 0,
            myYcorrection = 0,
            atXcorrection = 0,
            atYcorrection = 0;

        var calculatedPosition = { left: 0, top: 0 },
            defaults = this.defaults.position,
            windowRect = {
            width: document.documentElement.clientWidth,
            height: window.innerHeight
        };
        if (elmt.options.container === document.body) {
            defaults.of = document.body;
        }

        if (typeof elmt === 'string') {
            // arg elmt is assumed to be a selector string
            elmtToPosition = document.querySelector(elmt);
        } else {
            // otherwise arg elmt is assumed to be a node object
            elmtToPosition = elmt;
        }

        // do not position elmt when parameter position is set to boolean false
        if (!_position) {
            elmtToPosition.style.opacity = 1;
            return elmtToPosition;
        }

        var elmtToPositionRect = elmtToPosition.getBoundingClientRect();
        // contains read-only left, top, right, bottom, x, y, width, height describing the !! border-box !! in pixels
        // Properties other than width and height are relative to the top-left of the viewport!!

        // translate shorthand string to object and execute parameter functions if needed
        if (typeof _position === 'string') {
            posSettings = Object.assign({}, defaults, jsPanel.pOposition(_position));
        } else {
            posSettings = Object.assign({}, defaults, _position);
            // process parameter functions
            ['my', 'at', 'of', 'offsetX', 'offsetY', 'minLeft', 'maxLeft', 'minTop', 'maxTop'].forEach(function (item) {
                if (typeof posSettings[item] === 'function') {
                    posSettings[item] = posSettings[item].call(elmt, elmt);
                }
            });
        }

        var parentContainer = elmtToPosition.parentElement,
            parentContainerStyles = window.getComputedStyle(parentContainer),
            parentContainerRect = parentContainer.getBoundingClientRect(),
            parentContainerTagName = parentContainer.tagName.toLowerCase();

        if (posSettings.of && posSettings.of !== 'window') {
            if (typeof posSettings.of === 'string') {
                // posSettings.of is assumed to be a selector string
                elmtToPositionAgainst = document.querySelector(posSettings.of);
            } else {
                // otherwise posSettings.of is assumed to be a node object
                elmtToPositionAgainst = posSettings.of;
            }
        }

        // calc left corrections due to panel size, should be the same for all scenarios
        if (posSettings.my.match(/^center-top$|^center$|^center-bottom$/i)) {
            myXcorrection = elmtToPositionRect.width / 2;
        } else if (posSettings.my.match(/right/i)) {
            myXcorrection = elmtToPositionRect.width;
        }
        // calc top corrections due to panel size
        if (posSettings.my.match(/^left-center$|^center$|^right-center$/i)) {
            myYcorrection = elmtToPositionRect.height / 2;
        } else if (posSettings.my.match(/bottom/i)) {
            myYcorrection = elmtToPositionRect.height;
        }

        // SCENARIO 1 - panel appended to body (window) and positioned relative to window -> make fixed
        if (elmt.options.container === 'window' && parentContainerTagName === 'body' && posSettings.of === 'window') {
            // calc left corrections due to window size
            if (posSettings.at.match(/^center-top$|^center$|^center-bottom$/i)) {
                atXcorrection = windowRect.width / 2;
            } else if (posSettings.at.match(/right/i)) {
                atXcorrection = windowRect.width;
            }
            // calc top corrections due to window size
            if (posSettings.at.match(/^left-center$|^center$|^right-center$/i)) {
                atYcorrection = windowRect.height / 2;
            } else if (posSettings.at.match(/bottom/i)) {
                atYcorrection = windowRect.height;
            }
            calculatedPosition.left = atXcorrection - myXcorrection - parseFloat(parentContainerStyles.borderLeftWidth);
            calculatedPosition.top = atYcorrection - myYcorrection - parseFloat(parentContainerStyles.borderTopWidth);
            // panel appended to body and positioned relative to window is always fixed
            elmtToPosition.style.position = 'fixed';
        }

        // SCENARIO 1a - panel appended to body (window) and positioned relative to another panel in window
        else if (elmt.options.container === 'window' && parentContainerTagName === 'body' && posSettings.of.classList && posSettings.of.classList.contains('jsPanel')) {
                var elmtToPositionAgainstRect = elmtToPositionAgainst.getBoundingClientRect();
                // calc left corrections due to position and size of elmtToPositionAgainst
                if (posSettings.at.match(/^center-top$|^center$|^center-bottom$/i)) {
                    atXcorrection = elmtToPositionAgainstRect.width / 2 + elmtToPositionAgainstRect.left;
                } else if (posSettings.at.match(/right/i)) {
                    atXcorrection = elmtToPositionAgainstRect.width + elmtToPositionAgainstRect.left;
                } else {
                    atXcorrection = elmtToPositionAgainstRect.left;
                }
                // calc top corrections due to position and size of elmtToPositionAgainst
                if (posSettings.at.match(/^left-center$|^center$|^right-center$/i)) {
                    atYcorrection = elmtToPositionAgainstRect.height / 2 + elmtToPositionAgainstRect.top;
                } else if (posSettings.at.match(/bottom/i)) {
                    atYcorrection = elmtToPositionAgainstRect.height + elmtToPositionAgainstRect.top;
                } else {
                    atYcorrection = elmtToPositionAgainstRect.top;
                }
                calculatedPosition.left = atXcorrection - myXcorrection;
                calculatedPosition.top = atYcorrection - myYcorrection;
                elmtToPosition.style.position = 'fixed';
            }

            // SCENARIO 2 - panel appended to body and positioned relative to another element in document
            else if (parentContainerTagName === 'body' && posSettings.of !== 'window') {
                    var _elmtToPositionAgainstRect = elmtToPositionAgainst.getBoundingClientRect();
                    // calc left corrections due to position and size of elmtToPositionAgainst
                    if (posSettings.at.match(/^center-top$|^center$|^center-bottom$/i)) {
                        atXcorrection = _elmtToPositionAgainstRect.width / 2 + _elmtToPositionAgainstRect.left + pageXOffset;
                    } else if (posSettings.at.match(/right/i)) {
                        atXcorrection = _elmtToPositionAgainstRect.width + _elmtToPositionAgainstRect.left + pageXOffset;
                    } else {
                        atXcorrection = _elmtToPositionAgainstRect.left + pageXOffset;
                    }
                    // calc top corrections due to position and size of elmtToPositionAgainst
                    if (posSettings.at.match(/^left-center$|^center$|^right-center$/i)) {
                        atYcorrection = _elmtToPositionAgainstRect.height / 2 + _elmtToPositionAgainstRect.top + pageYOffset;
                    } else if (posSettings.at.match(/bottom/i)) {
                        atYcorrection = _elmtToPositionAgainstRect.height + _elmtToPositionAgainstRect.top + pageYOffset;
                    } else {
                        atYcorrection = _elmtToPositionAgainstRect.top + pageYOffset;
                    }
                    calculatedPosition.left = atXcorrection - myXcorrection - parseFloat(parentContainerStyles.borderLeftWidth);
                    calculatedPosition.top = atYcorrection - myYcorrection - parseFloat(parentContainerStyles.borderTopWidth);
                }

                // SCENARIO 3 - // panel appended to other element than body and positioned relative to its container
                else if (parentContainerTagName !== 'body' && (posSettings.of === 'window' || !posSettings.of)) {
                        // calc corrections to position panel relative to parentContainer content-box, not border-box
                        var pContainerLRBorderWidth = parseFloat(parentContainerStyles.borderLeftWidth) + parseFloat(parentContainerStyles.borderRightWidth),
                            pContainerTBBorderWidth = parseFloat(parentContainerStyles.borderTopWidth) + parseFloat(parentContainerStyles.borderBottomWidth);
                        // calc left corrections due to parent container width
                        if (posSettings.at.match(/^center-top$|^center$|^center-bottom$/i)) {
                            atXcorrection = parentContainerRect.width / 2 - pContainerLRBorderWidth / 2;
                        } else if (posSettings.at.match(/right/i)) {
                            atXcorrection = parentContainerRect.width - pContainerLRBorderWidth;
                        }
                        // calc top corrections due to parent container height
                        if (posSettings.at.match(/^left-center$|^center$|^right-center$/i)) {
                            atYcorrection = parentContainerRect.height / 2 - pContainerTBBorderWidth / 2;
                        } else if (posSettings.at.match(/bottom/i)) {
                            atYcorrection = parentContainerRect.height - pContainerTBBorderWidth;
                        }
                        calculatedPosition.left = atXcorrection - myXcorrection;
                        calculatedPosition.top = atYcorrection - myYcorrection;
                    }

                    // SCENARIO 4 - panel appended to other element than body and positioned relative to an element within its container
                    else if (parentContainerTagName !== 'body' && parentContainer.contains(elmtToPositionAgainst)) {
                            var _elmtToPositionAgainstRect2 = elmtToPositionAgainst.getBoundingClientRect();
                            // calc left corrections due to position and size of elmtToPositionAgainst
                            if (posSettings.at.match(/^center-top$|^center$|^center-bottom$/i)) {
                                atXcorrection = _elmtToPositionAgainstRect2.left - parentContainerRect.left + _elmtToPositionAgainstRect2.width / 2;
                            } else if (posSettings.at.match(/right/i)) {
                                atXcorrection = _elmtToPositionAgainstRect2.left - parentContainerRect.left + _elmtToPositionAgainstRect2.width;
                            } else {
                                atXcorrection = _elmtToPositionAgainstRect2.left - parentContainerRect.left;
                            }
                            // calc top corrections due to position and size of elmtToPositionAgainst
                            if (posSettings.at.match(/^left-center$|^center$|^right-center$/i)) {
                                atYcorrection = _elmtToPositionAgainstRect2.top - parentContainerRect.top + _elmtToPositionAgainstRect2.height / 2;
                            } else if (posSettings.at.match(/bottom/i)) {
                                atYcorrection = _elmtToPositionAgainstRect2.top - parentContainerRect.top + _elmtToPositionAgainstRect2.height;
                            } else {
                                atYcorrection = _elmtToPositionAgainstRect2.top - parentContainerRect.top;
                            }
                            calculatedPosition.left = atXcorrection - myXcorrection - parseFloat(parentContainerStyles.borderLeftWidth);
                            calculatedPosition.top = atYcorrection - myYcorrection - parseFloat(parentContainerStyles.borderTopWidth);
                        }

        // autoposition panels only if ...
        if (posSettings.autoposition && posSettings.my === posSettings.at && ['left-top', 'center-top', 'right-top', 'left-bottom', 'center-bottom', 'right-bottom'].indexOf(posSettings.my) >= 0) {

            if (typeof posSettings.autoposition === 'function') {
                posSettings.autoposition = posSettings.autoposition(); // function must return a proper string value
            }

            // add class with position and autoposition direction
            var newClass = posSettings.my + '-' + posSettings.autoposition.toLowerCase();
            elmtToPosition.classList.add(newClass);

            // get all panels with same class
            var newClassAll = Array.prototype.slice.call(document.querySelectorAll('.' + newClass)),
                ownIndex = newClassAll.indexOf(elmtToPosition);

            // if more than 1 position new panel
            if (newClassAll.length > 1) {
                if (posSettings.autoposition === 'down') {
                    // collect heights of all elmts to calc new top position
                    newClassAll.forEach(function (item, index) {
                        if (index > 0 && index <= ownIndex) {
                            calculatedPosition.top += newClassAll[--index].getBoundingClientRect().height + jsPanel.autopositionSpacing;
                        }
                    });
                } else if (posSettings.autoposition === 'up') {
                    newClassAll.forEach(function (item, index) {
                        if (index > 0 && index <= ownIndex) {
                            calculatedPosition.top -= newClassAll[--index].getBoundingClientRect().height + jsPanel.autopositionSpacing;
                        }
                    });
                } else if (posSettings.autoposition === 'right') {
                    // collect widths of all elmts to calc new left position
                    newClassAll.forEach(function (item, index) {
                        if (index > 0 && index <= ownIndex) {
                            calculatedPosition.left += newClassAll[--index].getBoundingClientRect().width + jsPanel.autopositionSpacing;
                        }
                    });
                } else if (posSettings.autoposition === 'left') {
                    newClassAll.forEach(function (item, index) {
                        if (index > 0 && index <= ownIndex) {
                            calculatedPosition.left -= newClassAll[--index].getBoundingClientRect().width + jsPanel.autopositionSpacing;
                        }
                    });
                }
            }
        }

        // corrections if container has css transform: scale()
        var scaleFactor = elmtToPosition.getScaleFactor ? elmtToPosition.getScaleFactor() : { x: 1, y: 1 };
        calculatedPosition.left /= scaleFactor.x;
        calculatedPosition.top /= scaleFactor.y;
        // additional corrections if container has borders
        var xBorders = parseFloat(parentContainerStyles.borderLeftWidth) + parseFloat(parentContainerStyles.borderRightWidth),
            yBorders = parseFloat(parentContainerStyles.borderTopWidth) + parseFloat(parentContainerStyles.borderBottomWidth),
            xCorr100 = xBorders * (1 - scaleFactor.x) / scaleFactor.x,
            yCorr100 = yBorders * (1 - scaleFactor.y) / scaleFactor.y;
        // left correction needed for panels horizontally centered or right
        if (posSettings.at.match(/^right-top$|^right-center$|^right-bottom$/i)) {
            calculatedPosition.left += xCorr100;
        } else if (posSettings.at.match(/^center-top$|^center$|^center-bottom$/i)) {
            calculatedPosition.left += xCorr100 / 2;
        }
        // top correction needed for panels vertically centered or bottom
        if (posSettings.at.match(/^left-bottom$|^center-bottom$|^right-bottom$/i)) {
            calculatedPosition.top += yCorr100;
        } else if (posSettings.at.match(/^left-center$|^center$|^right-center$/i)) {
            calculatedPosition.top += yCorr100 / 2;
        }
        // end scale corrections

        // convert positioning numbers to pixel values and position panel
        calculatedPosition.left += 'px';
        calculatedPosition.top += 'px';
        elmtToPosition.style.left = calculatedPosition.left;
        elmtToPosition.style.top = calculatedPosition.top;

        // apply offsets
        if (posSettings.offsetX) {
            typeof posSettings.offsetX === 'number' ? elmtToPosition.style.left = 'calc(' + calculatedPosition.left + ' + ' + posSettings.offsetX + 'px)' : elmtToPosition.style.left = 'calc(' + calculatedPosition.left + ' + ' + posSettings.offsetX + ')';
            calculatedPosition.left = window.getComputedStyle(elmtToPosition).left;
        }
        if (posSettings.offsetY) {
            typeof posSettings.offsetY === 'number' ? elmtToPosition.style.top = 'calc(' + calculatedPosition.top + ' + ' + posSettings.offsetY + 'px)' : elmtToPosition.style.top = 'calc(' + calculatedPosition.top + ' + ' + posSettings.offsetY + ')';
            calculatedPosition.top = window.getComputedStyle(elmtToPosition).top;
        }

        // apply minLeft
        if (posSettings.minLeft) {
            // save current left of panel as pixel value
            var initialLeft = parseFloat(calculatedPosition.left);
            // convert minLeft number to pixel value
            if (typeof posSettings.minLeft === 'number') {
                posSettings.minLeft += 'px';
            }
            // now position panel with minLeft value
            elmtToPosition.style.left = posSettings.minLeft;
            // get changed left as pixel value
            var minLeft = parseFloat(window.getComputedStyle(elmtToPosition).left);
            // compare minLeft with initialLeft and reposition panel again if needed
            if (initialLeft > minLeft) {
                elmtToPosition.style.left = initialLeft + 'px';
            }
            calculatedPosition.left = window.getComputedStyle(elmtToPosition).left;
        }
        // apply maxLeft
        if (posSettings.maxLeft) {
            var _initialLeft = parseFloat(calculatedPosition.left);
            if (typeof posSettings.maxLeft === 'number') {
                posSettings.maxLeft += 'px';
            }
            elmtToPosition.style.left = posSettings.maxLeft;
            var maxLeft = parseFloat(window.getComputedStyle(elmtToPosition).left);
            if (_initialLeft < maxLeft) {
                elmtToPosition.style.left = _initialLeft + 'px';
            }
            calculatedPosition.left = window.getComputedStyle(elmtToPosition).left;
        }
        // apply maxTop
        if (posSettings.maxTop) {
            var initialTop = parseFloat(calculatedPosition.top);
            if (typeof posSettings.maxTop === 'number') {
                posSettings.maxTop += 'px';
            }
            elmtToPosition.style.top = posSettings.maxTop;
            var maxTop = parseFloat(window.getComputedStyle(elmtToPosition).top);
            if (initialTop < maxTop) {
                elmtToPosition.style.top = initialTop + 'px';
            }
            calculatedPosition.top = window.getComputedStyle(elmtToPosition).top;
        }
        // apply minTop
        if (posSettings.minTop) {
            var _initialTop = parseFloat(calculatedPosition.top);
            if (typeof posSettings.minTop === 'number') {
                posSettings.minTop += 'px';
            }
            elmtToPosition.style.top = posSettings.minTop;
            var minTop = parseFloat(window.getComputedStyle(elmtToPosition).top);
            if (_initialTop > minTop) {
                elmtToPosition.style.top = _initialTop + 'px';
            }
            calculatedPosition.top = window.getComputedStyle(elmtToPosition).top;
        }

        // apply modify
        if (typeof posSettings.modify === 'function') {
            var modifiedPosition = posSettings.modify.call(calculatedPosition, calculatedPosition);
            elmtToPosition.style.left = modifiedPosition.left;
            elmtToPosition.style.top = modifiedPosition.top;
        }

        elmtToPosition.style.opacity = 1;
        // convert css calc values to pixel values - this is required by dragit and resizeit
        elmtToPosition.style.left = window.getComputedStyle(elmtToPosition).left;
        elmtToPosition.style.top = window.getComputedStyle(elmtToPosition).top;

        return elmtToPosition;
    },
    processCallbacks: function processCallbacks(panel, arg) {
        var someOrEvery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'some';
        var param = arguments[3];
        var param2 = arguments[4];

        // if arg != array make it one
        if (typeof arg === 'function') {
            arg = [arg];
        }
        // some():  execute callbacks until one is found returning a truthy value
        // every(): execute callbacks until one is found returning a falsy value
        // truthy values are: '0' (string with single zero), 'false' (string with text false), [] (empty array), {} (empty object), function(){} ("empty" function)
        // falsy values are: false, 0, '', "", null, undefined, NaN
        if (someOrEvery) {
            return arg[someOrEvery](function (cb) {
                return cb.call(panel, panel, param, param2);
            });
        } else {
            arg.forEach(function (cb) {
                cb.call(panel, panel, param, param2);
            });
        }
    },
    removeMinimizedReplacement: function removeMinimizedReplacement(panel) {
        var elmt = document.getElementById(panel.id + '-min');
        if (elmt) {
            elmt.parentElement.removeChild(elmt);
        }
    },
    removeSnapAreas: function removeSnapAreas() {
        document.querySelectorAll('.jsPanel-snap-area').forEach(function (el) {
            el.parentElement.removeChild(el);
        });
    },
    remClass: function remClass(elmt, classnames) {
        classnames.split(' ').forEach(function (item) {
            return elmt.classList.remove(item);
        });
        return elmt;
    },
    resetZi: function resetZi() {
        this.zi = function () {
            var startValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jsPanel.ziBase;

            var val = startValue;
            return { next: function next() {
                    return val++;
                } };
        }();
        Array.prototype.slice.call(document.querySelectorAll('.jsPanel-standard')).sort(function (a, b) {
            return a.style.zIndex - b.style.zIndex;
        }).forEach(function (panel) {
            panel.style.zIndex = jsPanel.zi.next();
        });
    },
    resizeit: function resizeit(elmt) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var opts = Object.assign({}, this.defaults.resizeit, options),
            elmtParent = elmt.parentElement,
            elmtParentTagName = elmtParent.tagName.toLowerCase(),
            containment = this.pOcontainment(opts.containment),
            jspanelresizestart = new CustomEvent('jspanelresizestart', { detail: elmt.id }),
            jspanelresize = new CustomEvent('jspanelresize', { detail: elmt.id }),
            jspanelresizestop = new CustomEvent('jspanelresizestop', { detail: elmt.id });
        var maxWidth = typeof opts.maxWidth === 'function' ? opts.maxWidth() : opts.maxWidth || 10000,
            maxHeight = typeof opts.maxHeight === 'function' ? opts.maxHeight() : opts.maxHeight || 10000,
            minWidth = typeof opts.minWidth === 'function' ? opts.minWidth() : opts.minWidth,
            minHeight = typeof opts.minHeight === 'function' ? opts.minHeight() : opts.minHeight,
            resizePanel = void 0,
            resizestarted = void 0,
            w = void 0,
            h = void 0;

        opts.handles.split(',').forEach(function (item) {
            var node = document.createElement('DIV');
            node.className = 'jsPanel-resizeit-handle jsPanel-resizeit-' + item.trim();
            node.style.zIndex = 90;
            elmt.append(node);
        });

        elmt.querySelectorAll('.jsPanel-resizeit-handle').forEach(function (handle) {

            jsPanel.pointerdown.forEach(function (item) {
                handle.addEventListener(item, function (e) {
                    // prevent window scroll while resizing elmt
                    e.preventDefault();

                    // disable resizing for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }

                    elmt.content.style.pointerEvents = 'none';

                    // noinspection JSUnresolvedVariable
                    var elmtRect = elmt.getBoundingClientRect(),
                        /* needs to be calculated on pointerdown!! */
                    elmtParentRect = elmtParent.getBoundingClientRect(),
                        /* needs to be calculated on pointerdown!! */
                    elmtParentStyles = window.getComputedStyle(elmtParent, null),
                        elmtParentBLW = parseInt(elmtParentStyles.borderLeftWidth, 10),
                        elmtParentBTW = parseInt(elmtParentStyles.borderTopWidth, 10),
                        elmtParentPosition = elmtParentStyles.getPropertyValue('position'),
                        startX = e.clientX || e.touches[0].clientX,
                        startY = e.clientY || e.touches[0].clientY,
                        startRatio = startX / startY,
                        startWidth = elmtRect.width,
                        startHeight = elmtRect.height,
                        resizeHandleClassList = e.target.classList,
                        scaleFactor = elmt.getScaleFactor(),
                        aspectRatio = elmtRect.width / elmtRect.height;
                    var startLeft = elmtRect.left,
                        startTop = elmtRect.top,
                        maxWidthEast = 10000,
                        maxWidthWest = 10000,
                        maxHeightSouth = 10000,
                        maxHeightNorth = 10000;

                    if (elmtParentTagName !== 'body') {
                        startLeft = elmtRect.left - elmtParentRect.left + elmtParent.scrollLeft;
                        startTop = elmtRect.top - elmtParentRect.top + elmtParent.scrollTop;
                    }

                    // calc min/max left/top values if containment is set - code from jsDraggable
                    if (elmtParentTagName === 'body' && containment) {
                        maxWidthEast = document.documentElement.clientWidth - elmtRect.left;
                        maxHeightSouth = document.documentElement.clientHeight - elmtRect.top;
                        maxWidthWest = elmtRect.width + elmtRect.left;
                        maxHeightNorth = elmtRect.height + elmtRect.top;
                    } else {
                        // if panel is NOT in body
                        if (containment) {
                            if (elmtParentPosition === 'static') {
                                maxWidthEast = elmtParentRect.width - elmtRect.left + elmtParentBLW;
                                maxHeightSouth = elmtParentRect.height + elmtParentRect.top - elmtRect.top + elmtParentBTW;
                                maxWidthWest = elmtRect.width + (elmtRect.left - elmtParentRect.left) - elmtParentBLW;
                                maxHeightNorth = elmtRect.height + (elmtRect.top - elmtParentRect.top) - elmtParentBTW;
                            } else {
                                maxWidthEast = elmtParent.clientWidth - (elmtRect.left - elmtParentRect.left) / scaleFactor.x + elmtParentBLW;
                                maxHeightSouth = elmtParent.clientHeight - (elmtRect.top - elmtParentRect.top) / scaleFactor.y + elmtParentBTW;
                                maxWidthWest = (elmtRect.width + elmtRect.left - elmtParentRect.left) / scaleFactor.x - elmtParentBLW;
                                maxHeightNorth = elmt.clientHeight + (elmtRect.top - elmtParentRect.top) / scaleFactor.y - elmtParentBTW;
                            }
                        }
                    }
                    // if original opts.containment is array
                    if (containment) {
                        maxWidthWest -= containment[3];
                        maxHeightNorth -= containment[0];
                        maxWidthEast -= containment[1];
                        maxHeightSouth -= containment[2];
                    }

                    // calculate corrections for rotated panels
                    var computedStyle = window.getComputedStyle(elmt),
                        wDif = parseFloat(computedStyle.width) - elmtRect.width,
                        hDif = parseFloat(computedStyle.height) - elmtRect.height;
                    var xDif = parseFloat(computedStyle.left) - elmtRect.left,
                        yDif = parseFloat(computedStyle.top) - elmtRect.top;
                    if (elmtParent !== document.body) {
                        xDif += elmtParentRect.left;
                        yDif += elmtParentRect.top;
                    }

                    resizePanel = function resizePanel(evt) {
                        // trigger resizestarted only once per resize
                        if (!resizestarted) {
                            document.dispatchEvent(jspanelresizestart);
                            if (opts.start.length) {
                                jsPanel.processCallbacks(elmt, opts.start, false, { width: startWidth, height: startHeight }, evt);
                            }
                            jsPanel.front(elmt);
                        }
                        resizestarted = 1;
                        // trigger resize permanently while resizing
                        document.dispatchEvent(jspanelresize);

                        // possibly updated while resizing
                        var eventX = evt.touches ? evt.touches[0].clientX : evt.clientX,
                            eventY = evt.touches ? evt.touches[0].clientY : evt.clientY,
                            overlaps = void 0;

                        if (resizeHandleClassList.contains('jsPanel-resizeit-e')) {

                            w = startWidth + (eventX - startX) / scaleFactor.x + wDif;
                            if (w >= maxWidthEast) {
                                w = maxWidthEast;
                            }
                            if (w >= maxWidth) {
                                w = maxWidth;
                            } else if (w <= minWidth) {
                                w = minWidth;
                            }
                            elmt.style.width = w + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.height = w / aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.bottom <= containment[2]) {
                                        elmt.style.height = maxHeightSouth + 'px';
                                        elmt.style.width = maxHeightSouth * aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-s')) {

                            h = startHeight + (eventY - startY) / scaleFactor.y + hDif;
                            if (h >= maxHeightSouth) {
                                h = maxHeightSouth;
                            }
                            if (h >= maxHeight) {
                                h = maxHeight;
                            } else if (h <= minHeight) {
                                h = minHeight;
                            }
                            elmt.style.height = h + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.width = h * aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.right <= containment[1]) {
                                        elmt.style.width = maxWidthEast + 'px';
                                        elmt.style.height = maxWidthEast / aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-w')) {

                            w = startWidth + (startX - eventX) / scaleFactor.x + wDif;
                            if (w <= maxWidth && w >= minWidth && w <= maxWidthWest) {
                                elmt.style.left = startLeft + (eventX - startX) / scaleFactor.x + xDif + 'px';
                            }
                            if (w >= maxWidthWest) {
                                w = maxWidthWest;
                            }
                            if (w >= maxWidth) {
                                w = maxWidth;
                            } else if (w <= minWidth) {
                                w = minWidth;
                            }
                            elmt.style.width = w + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.height = w / aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.bottom <= containment[2]) {
                                        elmt.style.height = maxHeightSouth + 'px';
                                        elmt.style.width = maxHeightSouth * aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-n')) {

                            h = startHeight + (startY - eventY) / scaleFactor.y + hDif;
                            if (h <= maxHeight && h >= minHeight && h <= maxHeightNorth) {
                                elmt.style.top = startTop + (eventY - startY) / scaleFactor.y + yDif + 'px';
                            }
                            if (h >= maxHeightNorth) {
                                h = maxHeightNorth;
                            }
                            if (h >= maxHeight) {
                                h = maxHeight;
                            } else if (h <= minHeight) {
                                h = minHeight;
                            }
                            elmt.style.height = h + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.width = h * aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.right <= containment[1]) {
                                        elmt.style.width = maxWidthEast + 'px';
                                        elmt.style.height = maxWidthEast / aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-se')) {

                            w = startWidth + (eventX - startX) / scaleFactor.x + wDif;
                            if (w >= maxWidthEast) {
                                w = maxWidthEast;
                            }
                            if (w >= maxWidth) {
                                w = maxWidth;
                            } else if (w <= minWidth) {
                                w = minWidth;
                            }
                            elmt.style.width = w + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.height = w / aspectRatio + 'px';
                            }

                            h = startHeight + (eventY - startY) / scaleFactor.y + hDif;
                            if (h >= maxHeightSouth) {
                                h = maxHeightSouth;
                            }
                            if (h >= maxHeight) {
                                h = maxHeight;
                            } else if (h <= minHeight) {
                                h = minHeight;
                            }
                            elmt.style.height = h + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.width = h * aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.right <= containment[1]) {
                                        elmt.style.width = maxWidthEast + 'px';
                                        elmt.style.height = maxWidthEast / aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-sw')) {

                            h = startHeight + (eventY - startY) / scaleFactor.y + hDif;
                            if (h >= maxHeightSouth) {
                                h = maxHeightSouth;
                            }
                            if (h >= maxHeight) {
                                h = maxHeight;
                            } else if (h <= minHeight) {
                                h = minHeight;
                            }
                            elmt.style.height = h + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.width = h * aspectRatio + 'px';
                            }

                            w = startWidth + (startX - eventX) / scaleFactor.x + wDif;
                            if (w <= maxWidth && w >= minWidth && w <= maxWidthWest) {
                                elmt.style.left = startLeft + (eventX - startX) / scaleFactor.x + xDif + 'px';
                            }
                            if (w >= maxWidthWest) {
                                w = maxWidthWest;
                            }
                            if (w >= maxWidth) {
                                w = maxWidth;
                            } else if (w <= minWidth) {
                                w = minWidth;
                            }
                            elmt.style.width = w + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.height = w / aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.bottom <= containment[2]) {
                                        elmt.style.height = maxHeightSouth + 'px';
                                        elmt.style.width = maxHeightSouth * aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-ne')) {

                            w = startWidth + (eventX - startX) / scaleFactor.x + wDif;
                            if (w >= maxWidthEast) {
                                w = maxWidthEast;
                            }
                            if (w >= maxWidth) {
                                w = maxWidth;
                            } else if (w <= minWidth) {
                                w = minWidth;
                            }
                            elmt.style.width = w + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.height = w / aspectRatio + 'px';
                            }

                            h = startHeight + (startY - eventY) / scaleFactor.y + hDif;
                            if (h <= maxHeight && h >= minHeight && h <= maxHeightNorth) {
                                elmt.style.top = startTop + (eventY - startY) / scaleFactor.y + yDif + 'px';
                            }
                            if (h >= maxHeightNorth) {
                                h = maxHeightNorth;
                            }
                            if (h >= maxHeight) {
                                h = maxHeight;
                            } else if (h <= minHeight) {
                                h = minHeight;
                            }
                            elmt.style.height = h + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.width = h * aspectRatio + 'px';
                                if (opts.containment) {
                                    overlaps = elmt.overlaps(elmtParent);
                                    if (overlaps.right <= containment[1]) {
                                        elmt.style.width = maxWidthEast + 'px';
                                        elmt.style.height = maxWidthEast / aspectRatio + 'px';
                                    }
                                }
                            }
                        } else if (resizeHandleClassList.contains('jsPanel-resizeit-nw')) {

                            if (opts.aspectRatio && resizeHandleClassList.contains('jsPanel-resizeit-nw')) {
                                eventX = eventY * startRatio;
                                eventY = eventX / startRatio;
                            }

                            w = startWidth + (startX - eventX) / scaleFactor.x + wDif;
                            if (w <= maxWidth && w >= minWidth && w <= maxWidthWest) {
                                elmt.style.left = startLeft + (eventX - startX) / scaleFactor.x + xDif + 'px';
                            }
                            if (w >= maxWidthWest) {
                                w = maxWidthWest;
                            }
                            if (w >= maxWidth) {
                                w = maxWidth;
                            } else if (w <= minWidth) {
                                w = minWidth;
                            }
                            elmt.style.width = w + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.height = w / aspectRatio + 'px';
                            }

                            h = startHeight + (startY - eventY) / scaleFactor.y + hDif;
                            if (h <= maxHeight && h >= minHeight && h <= maxHeightNorth) {
                                elmt.style.top = startTop + (eventY - startY) / scaleFactor.y + yDif + 'px';
                            }
                            if (h >= maxHeightNorth) {
                                h = maxHeightNorth;
                            }
                            if (h >= maxHeight) {
                                h = maxHeight;
                            } else if (h <= minHeight) {
                                h = minHeight;
                            }
                            elmt.style.height = h + 'px';
                            if (opts.aspectRatio) {
                                elmt.style.width = h * aspectRatio + 'px';
                            }
                        }

                        window.getSelection().removeAllRanges();

                        // get current position and size values while resizing
                        var styles = window.getComputedStyle(elmt),
                            values = {
                            left: parseFloat(styles.left),
                            top: parseFloat(styles.top),
                            right: parseFloat(styles.right),
                            bottom: parseFloat(styles.bottom),
                            width: parseFloat(styles.width),
                            height: parseFloat(styles.height)
                        };

                        // callback while resizing
                        if (opts.resize.length) {
                            jsPanel.processCallbacks(elmt, opts.resize, false, values, evt);
                        }
                    };

                    jsPanel.pointermove.forEach(function (item) {
                        document.addEventListener(item, resizePanel, false);
                    });

                    // remove resize handler when mouse leaves browser window (mouseleave doesn't work)
                    window.addEventListener('mouseout', function (e) {
                        if (e.relatedTarget === null) {
                            jsPanel.pointermove.forEach(function (item) {
                                document.removeEventListener(item, resizePanel, false);
                            });
                        }
                    }, false);
                });
            });
        });

        jsPanel.pointerup.forEach(function (item) {
            document.addEventListener(item, function (e) {

                jsPanel.pointermove.forEach(function (item) {
                    document.removeEventListener(item, resizePanel, false);
                });

                if (e.target.classList && e.target.classList.contains('jsPanel-resizeit-handle')) {

                    var isLeftChange = void 0,
                        isTopChange = void 0,
                        cl = e.target.className;
                    if (cl.match(/jsPanel-resizeit-nw|jsPanel-resizeit-w|jsPanel-resizeit-sw/i)) {
                        isLeftChange = true;
                    }
                    if (cl.match(/jsPanel-resizeit-nw|jsPanel-resizeit-n|jsPanel-resizeit-ne/i)) {
                        isTopChange = true;
                    }

                    // snap panel to grid (doesn't work that well if inside function resizePanel)
                    if (opts.grid && Array.isArray(opts.grid)) {
                        if (opts.grid.length === 1) {
                            opts.grid[1] = opts.grid[0];
                        }
                        var cw = parseFloat(elmt.style.width),
                            ch = parseFloat(elmt.style.height),
                            modW = cw % opts.grid[0],
                            modH = ch % opts.grid[1],
                            cx = parseFloat(elmt.style.left),
                            cy = parseFloat(elmt.style.top),
                            modX = cx % opts.grid[0],
                            modY = cy % opts.grid[1];

                        if (modW < opts.grid[0] / 2) {
                            elmt.style.width = cw - modW + 'px';
                        } else {
                            elmt.style.width = cw + (opts.grid[0] - modW) + 'px';
                        }
                        if (modH < opts.grid[1] / 2) {
                            elmt.style.height = ch - modH + 'px';
                        } else {
                            elmt.style.height = ch + (opts.grid[1] - modH) + 'px';
                        }

                        if (isLeftChange) {
                            if (modX < opts.grid[0] / 2) {
                                elmt.style.left = cx - modX + 'px';
                            } else {
                                elmt.style.left = cx + (opts.grid[0] - modX) + 'px';
                            }
                        }
                        if (isTopChange) {
                            if (modY < opts.grid[1] / 2) {
                                elmt.style.top = cy - modY + 'px';
                            } else {
                                elmt.style.top = cy + (opts.grid[1] - modY) + 'px';
                            }
                        }
                    }
                }

                if (resizestarted) {
                    elmt.content.style.pointerEvents = 'inherit';
                    resizestarted = undefined;
                    elmt.saveCurrentDimensions();
                    elmt.saveCurrentPosition();
                    document.dispatchEvent(jspanelresizestop);

                    if (opts.stop.length) {
                        jsPanel.processCallbacks(elmt, opts.stop, false, { width: parseFloat(elmt.style.width), height: parseFloat(elmt.style.height) }, e);
                    }
                }

                elmt.content.style.pointerEvents = 'inherit';
            }, false);
        });

        // resizeit is initialized - now disable if set
        if (opts.disable) {
            elmt.querySelectorAll('.jsPanel-resizeit-handle').forEach(function (handle) {
                handle.style.pointerEvents = 'none';
            });
        }

        return elmt;
    },
    setClass: function setClass(elmt, classnames) {
        classnames.split(' ').forEach(function (item) {
            return elmt.classList.add(item);
        });
        return elmt;
    },
    setStyles: function setStyles(elmt, stylesobject) {
        for (var prop in stylesobject) {
            if (stylesobject.hasOwnProperty(prop)) {
                var property = String(prop).replace(/-\w/gi, function (match) {
                    return match.substr(-1).toUpperCase();
                });
                elmt.style[property] = stylesobject[prop];
            }
        }
        return elmt;
    },
    setStyle: function setStyle(elmt, stylesobject) {
        return this.setStyles.call(elmt, elmt, stylesobject);
    },
    // alias for setStyles()

    snapPanel: function snapPanel(panel, pos) {
        var alreadySnapped = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        // store panel size before it snaps, only if not snapped already
        if (!alreadySnapped) {
            panel.currentData.beforeSnap = {
                width: panel.currentData.width,
                height: panel.currentData.height
            };
        }
        // snap panel
        if (pos && typeof pos === 'function' && !alreadySnapped) {
            pos.call(panel, panel, panel.snappableTo);
        } else if (pos !== false) {
            var offsets = [0, 0];
            if (panel.options.dragit.snap.containment) {
                if (panel.options.dragit.containment) {
                    var containment = this.pOcontainment(panel.options.dragit.containment),
                        position = panel.snappableTo;
                    if (position.startsWith('left')) {
                        offsets[0] = containment[3];
                    } else if (position.startsWith('right')) {
                        offsets[0] = -containment[1];
                    }
                    if (position.endsWith('top')) {
                        offsets[1] = containment[0];
                    } else if (position.endsWith('bottom')) {
                        offsets[1] = -containment[2];
                    }
                }
            }
            panel.reposition(panel.snappableTo + ' ' + offsets[0] + ' ' + offsets[1]);
        }
        if (!alreadySnapped) {
            panel.snapped = panel.snappableTo;
        }
    },
    jsPanelError: function jsPanelError(msg) {
        this.prototype = new Error();
        this.message = msg;
        this.name = 'jsPanel Error';
    },
    error: function error(e) {
        this.create({
            contentSize: { width: 'calc(100% - 10px)', height: 'auto' },
            position: 'center-top 0 5 down',
            animateIn: 'jsPanelFadeIn',
            theme: 'danger filledlight',
            border: '1px',
            borderRadius: '4px',
            header: false,
            content: '<div class="jsPanel-error-content"><div class="jsPanel-error-content-left"><div><i class="fa fa-exclamation-triangle fa-2x"></i></div></div><div class="jsPanel-error-content-right"><p>' + e.message + '</p></div></div><div class="jsPanel-error-close"><span class="jsPanel-ftr-btn">' + jsPanel.icons.close + '</span></div>',
            callback: function callback(panel) {
                panel.content.querySelector('.jsPanel-ftr-btn').addEventListener('click', function () {
                    panel.close();
                });
            }
        });
    },


    // METHOD CREATING THE PANEL ---------------------------------------------
    create: function create() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cb = arguments[1];

        // initialize z-index generator
        if (!jsPanel.zi) {
            jsPanel.zi = function () {
                var startValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : jsPanel.ziBase;

                var val = startValue;
                return {
                    next: function next() {
                        return val++;
                    }
                };
            }();
        }

        if (options.config) {
            options = Object.assign({}, this.defaults, options.config, options);
            delete options.config;
        } else {
            options = Object.assign({}, this.defaults, options);
        }
        if (!options.id) {
            options.id = 'jsPanel-' + (jsPanel.idCounter += 1);
        } else if (typeof options.id === 'function') {
            options.id = options.id();
        }
        var p = document.getElementById(options.id);
        if (p !== null) {
            // if a panel with passed id already exists, front it and return false
            if (p.classList.contains('jsPanel')) {
                p.front();
            }
            if (this.errorReporting) {
                try {
                    throw new jsPanel.jsPanelError('&#9664; COULD NOT CREATE NEW JSPANEL &#9658;<br>An element with the ID <code>' + options.id + '</code> already exists in the document.');
                } catch (e) {
                    jsPanel.error(e);
                }
            }
            return false;
        }

        // check whether container is valid -> if not return and log error
        var panelContainer = this.pOcontainer(options.container);
        if (!panelContainer) {
            if (this.errorReporting) {
                try {
                    throw new jsPanel.jsPanelError('&#9664; COULD NOT CREATE NEW JSPANEL &#9658;<br>The container to append the panel to does not exist');
                } catch (e) {
                    jsPanel.error(e);
                }
            }
            return false;
        }

        // normalize maximizedMargin
        options.maximizedMargin = this.pOcontainment(options.maximizedMargin);

        // normalize drag config
        if (options.dragit) {
            ['start', 'drag', 'stop'].forEach(function (item) {
                if (options.dragit[item]) {
                    if (typeof options.dragit[item] === 'function') {
                        options.dragit[item] = [options.dragit[item]];
                    }
                } else {
                    options.dragit[item] = [];
                }
            });
            if (options.dragit.snap) {
                if (_typeof(options.dragit.snap) === 'object') {
                    options.dragit.snap = Object.assign({}, this.defaultSnapConfig, options.dragit.snap);
                } else {
                    options.dragit.snap = this.defaultSnapConfig;
                }
            }
        }

        // normalize resizeit config
        if (options.resizeit) {
            ['start', 'resize', 'stop'].forEach(function (item) {
                if (options.resizeit[item]) {
                    if (typeof options.resizeit[item] === 'function') {
                        options.resizeit[item] = [options.resizeit[item]];
                    }
                } else {
                    options.resizeit[item] = [];
                }
            });
        }

        // normalize on... callbacks
        ['onbeforeclose', 'onbeforemaximize', 'onbeforeminimize', 'onbeforenormalize', 'onbeforesmallify', 'onbeforeunsmallify', 'onclosed', 'onfronted', 'onmaximized', 'onminimized', 'onnormalized', 'onsmallified', 'onstatuschange', 'onunsmallified'].forEach(function (item) {
            if (options[item]) {
                if (typeof options[item] === 'function') {
                    options[item] = [options[item]];
                }
            } else {
                options[item] = [];
            }
        });

        var self = options.template ? options.template : this.createPanelTemplate();

        // Properties
        self.options = options;
        self.closetimer = undefined;
        self.status = 'initialized';
        self.currentData = {};
        self.header = self.querySelector('.jsPanel-hdr'); // complete header section
        self.headerbar = self.header.querySelector('.jsPanel-headerbar'); // log, title and controls
        self.titlebar = self.header.querySelector('.jsPanel-titlebar'); // div surrounding title h3
        self.headerlogo = self.headerbar.querySelector('.jsPanel-headerlogo'); // logo only
        self.headertitle = self.headerbar.querySelector('.jsPanel-title'); // title div
        self.controlbar = self.headerbar.querySelector('.jsPanel-controlbar'); // div surrounding all controls
        self.headertoolbar = self.header.querySelector('.jsPanel-hdr-toolbar');
        self.content = self.querySelector('.jsPanel-content');
        self.footer = self.querySelector('.jsPanel-ftr');
        self.snappableTo = false;
        self.snapped = false;

        // Events
        var jspanelloaded = new CustomEvent('jspanelloaded', { 'detail': options.id }),
            jspanelcloseduser = new CustomEvent('jspanelcloseduser', { 'detail': options.id }),
            jspanelstatuschange = new CustomEvent('jspanelstatuschange', { 'detail': options.id }),
            jspanelbeforenormalize = new CustomEvent('jspanelbeforenormalize', { 'detail': options.id }),
            jspanelnormalized = new CustomEvent('jspanelnormalized', { 'detail': options.id }),
            jspanelbeforemaximize = new CustomEvent('jspanelbeforemaximize', { 'detail': options.id }),
            jspanelmaximized = new CustomEvent('jspanelmaximized', { 'detail': options.id }),
            jspanelbeforeminimize = new CustomEvent('jspanelbeforeminimize', { 'detail': options.id }),
            jspanelminimized = new CustomEvent('jspanelminimized', { 'detail': options.id }),
            jspanelbeforesmallify = new CustomEvent('jspanelbeforesmallify', { 'detail': options.id }),
            jspanelsmallified = new CustomEvent('jspanelsmallified', { 'detail': options.id }),
            jspanelsmallifiedmax = new CustomEvent('jspanelsmallifiedmax', { 'detail': options.id }),
            jspanelbeforeunsmallify = new CustomEvent('jspanelbeforeunsmallify', { 'detail': options.id }),
            jspanelfronted = new CustomEvent('jspanelfronted', { 'detail': options.id });

        // controls buttons
        var closeBtn = self.querySelector('.jsPanel-btn-close'),
            maxBtn = self.querySelector('.jsPanel-btn-maximize'),
            normBtn = self.querySelector('.jsPanel-btn-normalize'),
            smallBtn = self.querySelector('.jsPanel-btn-smallify'),
            smallrevBtn = self.querySelector('.jsPanel-btn-smallifyrev'),
            minBtn = self.querySelector('.jsPanel-btn-minimize');

        // needed only to fix an issue with pointer events in Firefox
        if ('onpointerdown' in window) {
            self.controlbar.querySelectorAll('.jsPanel-btn').forEach(function (btn) {
                btn.addEventListener('pointerdown', function (e) {
                    e.preventDefault();
                }, true);
            });
        }
        // ----------------------------------------------------------

        if (closeBtn) {
            jsPanel.pointerup.forEach(function (item) {
                closeBtn.addEventListener(item, function (e) {
                    e.preventDefault();
                    // disable close for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }
                    jsPanel.close(self);
                    document.dispatchEvent(jspanelcloseduser);
                });
            });
        }
        if (maxBtn) {
            jsPanel.pointerup.forEach(function (item) {
                maxBtn.addEventListener(item, function (e) {
                    e.preventDefault();
                    // disable maximize for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }
                    self.maximize();
                });
            });
        }
        if (normBtn) {
            jsPanel.pointerup.forEach(function (item) {
                normBtn.addEventListener(item, function (e) {
                    e.preventDefault();
                    // disable normalize for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }
                    self.normalize();
                });
            });
        }
        if (smallBtn) {
            jsPanel.pointerup.forEach(function (item) {
                smallBtn.addEventListener(item, function (e) {
                    e.preventDefault();
                    // disable smallify for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }
                    self.smallify();
                });
            });
        }
        if (smallrevBtn) {
            jsPanel.pointerup.forEach(function (item) {
                smallrevBtn.addEventListener(item, function (e) {
                    e.preventDefault();
                    // disable unsmallify for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }
                    self.unsmallify();
                });
            });
        }
        if (minBtn) {
            jsPanel.pointerup.forEach(function (item) {
                minBtn.addEventListener(item, function (e) {
                    e.preventDefault();
                    // disable minimize for all mouse buttons but left
                    if (e.button && e.button > 0) {
                        return false;
                    }
                    self.minimize();
                });
            });
        }

        // import extensions (extensions of the individual panel, not the global object jsPanel)
        var extensions = jsPanel.extensions;
        for (var ext in extensions) {
            if (extensions.hasOwnProperty(ext)) {
                self[ext] = extensions[ext];
            }
        }

        // Methods
        self.clearTheme = function (cb) {
            jsPanel.themes.forEach(function (value) {
                ['panel', 'jsPanel-theme-' + value, 'panel-' + value, value + '-color'].forEach(function (item) {
                    self.classList.remove(item);
                });
                self.header.classList.remove('jsPanel-theme-' + value);
            }, self);
            self.content.classList.remove('jsPanel-content-filled', 'jsPanel-content-filledlight');
            self.footer.classList.remove('panel-footer');
            self.header.classList.remove('jsPanel-hdr-light');
            self.header.classList.remove('jsPanel-hdr-dark');
            jsPanel.setStyle(self, { backgroundColor: '', borderWidth: '', borderStyle: '', borderColor: '' });
            jsPanel.setStyle(self.content, { background: '', border: '' });
            jsPanel.setStyle(self.headertoolbar, { boxShadow: '', width: '', marginLeft: '' });
            self.header.style.background = '';
            Array.prototype.slice.call(self.controlbar.querySelectorAll('.jsPanel-icon')).concat([self.headerlogo, self.headertitle, self.headertoolbar, self.content]).forEach(function (item) {
                item.style.color = '';
            });
            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.getThemeDetails = function (th) {
            var passedTheme = th.toLowerCase(),
                theme = { color: false, colors: false, filling: false },
                step1 = passedTheme.split('fill');
            theme.color = step1[0].trim().replace(/\s*/g, '');
            if (step1.length === 2) {
                if (step1[1].startsWith('edlight')) {
                    theme.filling = 'filledlight';
                } else if (step1[1].startsWith('eddark')) {
                    theme.filling = 'filleddark';
                } else if (step1[1].startsWith('ed')) {
                    theme.filling = 'filled';
                } else if (step1[1].startsWith('color')) {
                    var step2 = step1[1].split('color'),
                        fillcolor = step2[step2.length - 1].trim().replace(/\s*/g, '');
                    if (jsPanel.colorNames[fillcolor]) {
                        fillcolor = jsPanel.colorNames[fillcolor];
                    }
                    if (fillcolor.match(/^([0-9a-f]{3}|[0-9a-f]{6})$/gi)) {
                        fillcolor = '#' + fillcolor;
                    }
                    theme.filling = fillcolor;
                }
            }

            var builtIn = jsPanel.themes.some(function (item) {
                return item === theme.color.split(/\s/i)[0];
            });
            if (builtIn) {
                var baseTheme = theme.color.split(/\s/i)[0],
                    btn = document.createElement('button');
                btn.className = baseTheme + '-bg';
                document.body.appendChild(btn);
                theme.color = getComputedStyle(btn).backgroundColor.replace(/\s+/gi, '');
                document.body.removeChild(btn);
                // noinspection JSUnusedAssignment
                btn = undefined;
            } else if (theme.color.startsWith('bootstrap-')) {
                // works with bootstrap 3 and 4
                var index = theme.color.indexOf('-'),
                    _btn = document.createElement('button');
                _btn.className = 'btn btn' + theme.color.slice(index);
                document.body.appendChild(_btn);
                theme.color = getComputedStyle(_btn).backgroundColor.replace(/\s+/gi, '');
                document.body.removeChild(_btn);
                // noinspection JSUnusedAssignment
                _btn = undefined;
            } else if (theme.color.startsWith('mdb-')) {
                // material design for bootstrap theme
                var _index = theme.color.indexOf('-') + 1,
                    span = document.createElement('span'),
                    testClass = void 0;
                if (theme.color.endsWith('-dark')) {
                    testClass = theme.color.slice(_index);
                    testClass = testClass.replace('-dark', '-color-dark');
                } else {
                    testClass = theme.color.slice(_index) + '-color';
                }
                span.className = testClass;
                document.body.appendChild(span);
                theme.color = getComputedStyle(span).backgroundColor.replace(/\s+/gi, '');
                document.body.removeChild(span);
                // noinspection JSUnusedAssignment
                span = undefined;
            }
            theme.colors = jsPanel.calcColors(theme.color);
            return theme;
        };
        self.applyColorTheme = function (themeDetails) {
            self.style.backgroundColor = themeDetails.colors[0];
            self.header.style.backgroundColor = themeDetails.colors[0];
            ['.jsPanel-headerlogo', '.jsPanel-title', '.jsPanel-hdr-toolbar'].forEach(function (item) {
                self.querySelector(item).style.color = themeDetails.colors[3];
            }, self);
            self.querySelectorAll('.jsPanel-controlbar .jsPanel-btn').forEach(function (item) {
                item.style.color = themeDetails.colors[3];
            });

            var borderTop = themeDetails.colors[3] === '#000000' ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(255,255,255,0.2)';
            self.headertoolbar.style.borderTop = borderTop;
            self.content.style.borderTop = borderTop;

            if (themeDetails.colors[3] === '#000000') {
                self.header.classList.add('jsPanel-hdr-light');
            } else {
                self.header.classList.add('jsPanel-hdr-dark');
            }

            if (themeDetails.filling) {
                var contentFill = themeDetails.filling;
                if (contentFill === 'filled') {
                    jsPanel.setStyle(self.content, {
                        backgroundColor: themeDetails.colors[2],
                        color: themeDetails.colors[3]
                    });
                } else if (contentFill === 'filledlight') {
                    self.content.style.backgroundColor = themeDetails.colors[1];
                } else if (contentFill === 'filleddark') {
                    jsPanel.setStyle(self.content, {
                        backgroundColor: themeDetails.colors[6],
                        color: themeDetails.colors[7]
                    });
                } else {
                    var fontColor = jsPanel.perceivedBrightness(contentFill) <= jsPanel.colorBrightnessThreshold ? '#fff' : '#000';
                    self.content.style.backgroundColor = contentFill;
                    self.content.style.color = fontColor;
                }
            }

            return self;
        };
        self.applyCustomTheme = function (theme) {
            var defaults = { bgPanel: '#fff', bgContent: '#fff', colorHeader: '#000', colorContent: '#000' },
                passedTheme = void 0;
            if ((typeof theme === 'undefined' ? 'undefined' : _typeof(theme)) === 'object') {
                passedTheme = Object.assign(defaults, theme);
            } else {
                passedTheme = defaults;
            }
            var bgPanel = passedTheme.bgPanel,
                bgContent = passedTheme.bgContent,
                colorHeader = passedTheme.colorHeader,
                colorContent = passedTheme.colorContent;

            // set background panel/header
            jsPanel.colorNames[bgPanel] ? self.style.background = '#' + jsPanel.colorNames[bgPanel] : self.style.background = bgPanel;

            // set font color header
            if (jsPanel.colorNames[colorHeader]) {
                colorHeader = '#' + jsPanel.colorNames[colorHeader];
            }
            ['.jsPanel-headerlogo', '.jsPanel-title', '.jsPanel-hdr-toolbar'].forEach(function (item) {
                self.querySelector(item).style.color = colorHeader;
            }, self);
            self.querySelectorAll('.jsPanel-controlbar .jsPanel-btn').forEach(function (item) {
                item.style.color = colorHeader;
            });

            // set content background
            jsPanel.colorNames[bgContent] ? self.content.style.background = '#' + jsPanel.colorNames[bgContent] : self.content.style.background = bgContent;

            // set content font color
            jsPanel.colorNames[colorContent] ? self.content.style.color = '#' + jsPanel.colorNames[colorContent] : self.content.style.color = colorContent;

            // set border-top for header toolbar and add header class
            var pbPanel = jsPanel.perceivedBrightness(colorHeader);
            if (pbPanel > jsPanel.colorBrightnessThreshold) {
                self.headertoolbar.style.borderTop = '1px solid rgba(255,255,255,0.2)';
                self.header.classList.add('jsPanel-hdr-dark');
            } else {
                self.headertoolbar.style.borderTop = '1px solid rgba(0,0,0,0.2)';
                self.header.classList.add('jsPanel-hdr-light');
            }

            // set border-top for content
            var pbContent = jsPanel.perceivedBrightness(colorContent);
            pbContent > jsPanel.colorBrightnessThreshold ? self.content.style.borderTop = '1px solid rgba(255,255,255,0.2)' : self.content.style.borderTop = '1px solid rgba(0,0,0,0.2)';

            // set panel border (option.border does not work for themes using an object)
            if (passedTheme.border) {
                var border = passedTheme.border,
                    index = border.lastIndexOf(' '),
                    col = border.slice(++index);
                if (jsPanel.colorNames[col]) {
                    border = border.replace(col, '#' + jsPanel.colorNames[col]);
                }
                self.style.border = border;
            }

            return self;
        };
        self.applyThemeBorder = function () {
            var border = jsPanel.pOborder(options.border);
            if (!border[2].length) {
                border[2] = self.style.backgroundColor;
            } else if (jsPanel.colorNames[border[2]]) {
                border[2] = '#' + jsPanel.colorNames[border[2]];
            }
            border = border.join(' ');
            self.style.border = border;
            self.options.border = border;
        };
        self.applyThemeBorderRadius = function (rad) {
            var br = typeof rad === 'string' ? rad.trim().match(/\d*\.?\d+[a-zA-Z]{2,4}/i) : rad + 'px',
                cont = self.content.style;
            if (br) {
                br = typeof br === 'string' ? br : br[0];
                self.style.borderRadius = br;
                // set border-radius of either header or content section depending on presence of header
                if (self.querySelector('.jsPanel-hdr')) {
                    self.header.style.borderTopLeftRadius = br;
                    self.header.style.borderTopRightRadius = br;
                } else {
                    cont.borderTopLeftRadius = br;
                    cont.borderTopRightRadius = br;
                }
                // set border-radius of either footer or content section depending on presence of footer
                if (self.querySelector('.jsPanel-ftr.active')) {
                    self.footer.style.borderBottomRightRadius = br;
                    self.footer.style.borderBottomLeftRadius = br;
                } else {
                    cont.borderBottomRightRadius = br;
                    cont.borderBottomLeftRadius = br;
                }
                self.options.borderRadius = br;
            } else {
                self.options.borderRadius = undefined;
            }
            return self;
        };
        self.setTheme = function () {
            var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options.theme;
            var cb = arguments[1];

            // if panel is minimized normalize it for theme change
            var minimized = void 0;
            if (self.status === 'minimized') {
                minimized = true;
                self.normalize();
            }
            // first remove all theme related styles
            self.clearTheme();
            if ((typeof theme === 'undefined' ? 'undefined' : _typeof(theme)) === 'object') {
                options.border = undefined;
                self.applyCustomTheme(theme);
            } else {
                if (theme === 'none') {
                    // results in an all white panel without any theme related classes/styles applied
                    // removal of footer background/border is done in jsP.toolbarAdd()
                    self.style.backgroundColor = '#fff';
                    self.header.classList.add('jsPanel-hdr-light');
                    if (minimized) {
                        self.minimize();
                    } // minimize again if panel was minimized prior theme change
                    return self;
                }
                var themeDetails = self.getThemeDetails(theme);
                self.applyColorTheme(themeDetails);
                if (options.border) {
                    self.applyThemeBorder();
                } else {
                    self.style.borderWidth = '';
                    self.style.borderStyle = '';
                    self.style.borderColor = '';
                }
            }
            // minimize again if panel was minimized prior theme change
            if (minimized) {
                self.minimize();
            }

            if (cb) {
                cb.call(self, self);
            }
            return self;
        };

        self.close = function (cb) {
            jsPanel.close(self, cb);
        };
        self.maximize = function (cb) {
            // Note: do not disable maximize method for already maximized panels -> onwindowresize wouldn't work
            self.statusBefore = self.status;

            if (options.onbeforemaximize && options.onbeforemaximize.length > 0 && !jsPanel.processCallbacks(self, options.onbeforemaximize, 'some', self.statusBefore)) {
                return self;
            }

            document.dispatchEvent(jspanelbeforemaximize);

            var parent = self.parentElement,
                margins = options.maximizedMargin;

            if (parent === document.body) {
                // maximize within window
                self.style.width = document.documentElement.clientWidth - margins[1] - margins[3] + 'px';
                self.style.height = document.documentElement.clientHeight - margins[0] - margins[2] + 'px';
                self.style.left = margins[3] + 'px';
                self.style.top = margins[0] + 'px';

                if (!options.position.fixed) {
                    self.style.left = window.pageXOffset + margins[3] + 'px';
                    self.style.top = window.pageYOffset + margins[0] + 'px';
                }
            } else {
                // maximize within parentElement
                self.style.width = parent.clientWidth - margins[1] - margins[3] + 'px';
                self.style.height = parent.clientHeight - margins[0] - margins[2] + 'px';
                self.style.left = margins[3] + 'px';
                self.style.top = margins[0] + 'px';
            }

            jsPanel.removeMinimizedReplacement(self);
            self.status = 'maximized';
            self.setControls(['.jsPanel-btn-maximize', '.jsPanel-btn-smallifyrev']);
            jsPanel.front(self);
            document.dispatchEvent(jspanelmaximized);
            document.dispatchEvent(jspanelstatuschange);

            if (options.onstatuschange) {
                jsPanel.processCallbacks(self, options.onstatuschange, 'every', self.statusBefore);
            }

            if (cb) {
                cb.call(self, self, self.statusBefore);
            }

            if (options.onmaximized) {
                jsPanel.processCallbacks(self, options.onmaximized, 'every', self.statusBefore);
            }

            return self;
        };
        self.minimize = function (cb) {
            if (self.status === 'minimized') {
                return self;
            }
            self.statusBefore = self.status;

            if (options.onbeforeminimize && options.onbeforeminimize.length > 0 && !jsPanel.processCallbacks(self, options.onbeforeminimize, 'some', self.statusBefore)) {
                return self;
            }

            document.dispatchEvent(jspanelbeforeminimize);

            // create container for minimized replacements if not already there
            if (!document.getElementById('jsPanel-replacement-container')) {
                var replacementContainer = document.createElement('div');
                replacementContainer.id = 'jsPanel-replacement-container';
                document.body.append(replacementContainer);
            }

            self.style.left = '-9999px';
            self.status = 'minimized';
            document.dispatchEvent(jspanelminimized);
            document.dispatchEvent(jspanelstatuschange);

            if (options.onstatuschange) {
                jsPanel.processCallbacks(self, options.onstatuschange, 'every', self.statusBefore);
            }

            if (options.minimizeTo) {
                var replacement = self.createMinimizedReplacement(),
                    container = void 0,
                    parent = void 0;
                if (options.minimizeTo === 'default') {
                    document.getElementById('jsPanel-replacement-container').append(replacement);
                } else if (options.minimizeTo === 'parentpanel') {
                    parent = self.closest('.jsPanel-content').parentElement;
                    var list = parent.querySelectorAll('.jsPanel-minimized-box');
                    container = list[list.length - 1];
                    container.append(replacement);
                } else if (options.minimizeTo === 'parent') {
                    parent = self.parentElement;
                    container = parent.querySelector('.jsPanel-minimized-container');
                    if (!container) {
                        container = document.createElement('div');
                        container.className = 'jsPanel-minimized-container';
                        parent.append(container);
                    }
                    container.append(replacement);
                } else {
                    // all other strings are assumed to be selector strings returning a single element to append the min replacement to
                    document.querySelector(options.minimizeTo).append(replacement);
                }
            }

            if (cb) {
                cb.call(self, self, self.statusBefore);
            }

            if (options.onminimized) {
                jsPanel.processCallbacks(self, options.onminimized, 'every', self.statusBefore);
            }

            return self;
        };
        self.normalize = function (cb) {
            if (self.status === 'normalized') {
                return self;
            }
            self.statusBefore = self.status;

            if (options.onbeforenormalize && options.onbeforenormalize.length > 0 && !jsPanel.processCallbacks(self, options.onbeforenormalize, 'some', self.statusBefore)) {
                return self;
            }

            document.dispatchEvent(jspanelbeforenormalize);
            self.style.width = self.currentData.width;
            self.style.height = self.currentData.height;
            self.style.left = self.currentData.left;
            self.style.top = self.currentData.top;
            jsPanel.removeMinimizedReplacement(self);
            self.status = 'normalized';
            self.setControls(['.jsPanel-btn-normalize', '.jsPanel-btn-smallifyrev']);
            jsPanel.front(self);
            document.dispatchEvent(jspanelnormalized);
            document.dispatchEvent(jspanelstatuschange);

            if (options.onstatuschange) {
                jsPanel.processCallbacks(self, options.onstatuschange, 'every', self.statusBefore);
            }

            if (cb) {
                cb.call(self, self, self.statusBefore);
            }

            if (options.onnormalized) {
                jsPanel.processCallbacks(self, options.onnormalized, 'every', self.statusBefore);
            }

            return self;
        };
        self.smallify = function (cb) {
            if (self.status === 'smallified' || self.status === 'smallifiedmax') {
                return self;
            }
            self.statusBefore = self.status;

            if (options.onbeforesmallify && options.onbeforesmallify.length > 0 && !jsPanel.processCallbacks(self, options.onbeforesmallify, 'some', self.statusBefore)) {
                return self;
            }

            document.dispatchEvent(jspanelbeforesmallify);
            if (self.status === 'normalized') {
                self.saveCurrentDimensions();
            }

            self.style.overflow = 'hidden';
            var selfStyles = window.getComputedStyle(self),
                selfHeaderHeight = parseFloat(window.getComputedStyle(self.headerbar).height);
            self.style.height = parseFloat(selfStyles.borderTopWidth) + parseFloat(selfStyles.borderBottomWidth) + selfHeaderHeight + 'px';

            if (self.status === 'normalized') {
                self.setControls(['.jsPanel-btn-normalize', '.jsPanel-btn-smallify']);
                self.status = 'smallified';
                document.dispatchEvent(jspanelsmallified);
                document.dispatchEvent(jspanelstatuschange);
                if (options.onstatuschange) {
                    jsPanel.processCallbacks(self, options.onstatuschange, 'every', self.statusBefore);
                }
            } else if (self.status === 'maximized') {
                self.setControls(['.jsPanel-btn-maximize', '.jsPanel-btn-smallify']);
                self.status = 'smallifiedmax';
                document.dispatchEvent(jspanelsmallifiedmax);
                document.dispatchEvent(jspanelstatuschange);
                if (options.onstatuschange) {
                    jsPanel.processCallbacks(self, options.onstatuschange, 'every', self.statusBefore);
                }
            }

            var minBoxes = self.querySelectorAll('.jsPanel-minimized-box');
            minBoxes[minBoxes.length - 1].style.display = 'none';

            if (cb) {
                cb.call(self, self, self.statusBefore);
            }

            if (options.onsmallified) {
                jsPanel.processCallbacks(self, options.onsmallified, 'every', self.statusBefore);
            }

            return self;
        };
        self.unsmallify = function (cb) {
            self.statusBefore = self.status;

            if (self.status === 'smallified' || self.status === 'smallifiedmax') {

                if (options.onbeforeunsmallify && options.onbeforeunsmallify.length > 0 && !jsPanel.processCallbacks(self, options.onbeforeunsmallify, 'some', self.statusBefore)) {
                    return self;
                }

                document.dispatchEvent(jspanelbeforeunsmallify);
                self.style.overflow = 'visible';
                jsPanel.front(self);

                if (self.status === 'smallified') {
                    self.style.height = self.currentData.height;
                    self.setControls(['.jsPanel-btn-normalize', '.jsPanel-btn-smallifyrev']);
                    self.status = 'normalized';
                    document.dispatchEvent(jspanelnormalized);
                    document.dispatchEvent(jspanelstatuschange);
                    if (options.onstatuschange) {
                        jsPanel.processCallbacks(self, options.onstatuschange, 'every', self.statusBefore);
                    }
                } else if (self.status === 'smallifiedmax') {
                    self.maximize();
                } else if (self.status === 'minimized') {
                    self.normalize();
                }

                var minBoxes = self.querySelectorAll('.jsPanel-minimized-box');
                minBoxes[minBoxes.length - 1].style.display = 'flex';

                if (cb) {
                    cb.call(self, self, self.statusBefore);
                }

                if (options.onunsmallified) {
                    jsPanel.processCallbacks(self, options.onunsmallified, 'every', self.statusBefore);
                }
            }

            return self;
        };
        self.front = function (callback) {
            var execOnFrontedCallbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            jsPanel.front(self);
            document.dispatchEvent(jspanelfronted);
            if (callback) {
                callback.call(self, self);
            }
            if (options.onfronted && execOnFrontedCallbacks) {
                jsPanel.processCallbacks(self, options.onfronted, 'every', self.status);
            }
            return self;
        };

        self.closeChildpanels = function (cb) {
            self.getChildpanels().forEach(function (item) {
                return jsPanel.close(item);
            });
            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.getChildpanels = function (cb) {
            var childpanels = self.content.querySelectorAll('.jsPanel');
            if (cb) {
                childpanels.forEach(function (panel, index, list) {
                    cb.call(panel, panel, index, list);
                });
            }
            return childpanels;
        };
        self.isChildpanel = function (cb) {
            var pp = self.closest('.jsPanel-content'),
                parentpanel = pp ? pp.parentElement : null;
            if (cb) {
                cb.call(self, self, parentpanel);
            }
            // if panel is childpanel of another panel returns parentpanel, otherwise false
            return pp ? parentpanel : false;
        };
        self.contentRemove = function (cb) {
            jsPanel.emptyNode(self.content);
            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.createMinimizedReplacement = function () {
            var tpl = jsPanel.createMinimizedTemplate(),
                color = window.getComputedStyle(self.headertitle).color,
                selfStyles = window.getComputedStyle(self),
                font = options.iconfont,
                controlbar = tpl.querySelector('.jsPanel-controlbar');

            // if panel background is an image (that includes gradients) instead of a color value
            if (self.options.header !== 'auto-show-hide') {
                jsPanel.setStyle(tpl, {
                    backgroundColor: selfStyles.backgroundColor,
                    backgroundPositionX: selfStyles.backgroundPositionX,
                    backgroundPositionY: selfStyles.backgroundPositionY,
                    backgroundRepeat: selfStyles.backgroundRepeat,
                    backgroundAttachment: selfStyles.backgroundAttachment,
                    backgroundImage: selfStyles.backgroundImage,
                    backgroundSize: selfStyles.backgroundSize,
                    backgroundOrigin: selfStyles.backgroundOrigin,
                    backgroundClip: selfStyles.backgroundClip
                });
            } else {
                tpl.style.backgroundColor = window.getComputedStyle(self.header).backgroundColor;
            }

            tpl.id = self.id + '-min';
            tpl.querySelector('.jsPanel-headerbar').replaceChild(self.headerlogo.cloneNode(true), tpl.querySelector('.jsPanel-headerlogo'));
            tpl.querySelector('.jsPanel-titlebar').replaceChild(self.headertitle.cloneNode(true), tpl.querySelector('.jsPanel-title'));
            tpl.querySelector('.jsPanel-titlebar').setAttribute('title', self.headertitle.textContent);
            tpl.querySelector('.jsPanel-title').style.color = color;
            controlbar.style.color = color;

            ['jsPanel-hdr-dark', 'jsPanel-hdr-light'].forEach(function (item) {
                if (self.header.classList.contains(item)) {
                    tpl.querySelector('.jsPanel-hdr').classList.add(item);
                }
            });

            // set iconfont
            self.setIconfont(font, tpl);

            // needed only to fix an issue with pointer events in Firefox
            if ('onpointerdown' in window) {
                tpl.querySelectorAll('.jsPanel-btn').forEach(function (btn) {
                    btn.addEventListener('pointerdown', function (e) {
                        e.preventDefault();
                    }, true);
                });
            }
            // ----------------------------------------------------------

            if (self.dataset.btnnormalize === 'enabled') {
                jsPanel.pointerup.forEach(function (evt) {
                    tpl.querySelector('.jsPanel-btn-normalize').addEventListener(evt, function () {
                        self.normalize();
                    });
                });
            } else {
                controlbar.querySelector('.jsPanel-btn-normalize').style.display = 'none';
            }
            if (self.dataset.btnmaximize === 'enabled') {
                jsPanel.pointerup.forEach(function (evt) {
                    tpl.querySelector('.jsPanel-btn-maximize').addEventListener(evt, function () {
                        self.maximize();
                    });
                });
            } else {
                controlbar.querySelector('.jsPanel-btn-maximize').style.display = 'none';
            }
            if (self.dataset.btnclose === 'enabled') {
                jsPanel.pointerup.forEach(function (evt) {
                    tpl.querySelector('.jsPanel-btn-close').addEventListener(evt, function () {
                        jsPanel.close(self);
                    });
                });
            } else {
                controlbar.querySelector('.jsPanel-btn-close').style.display = 'none';
            }

            return tpl;
        };
        self.dragit = function (string) {
            var dragitOptions = Object.assign({}, jsPanel.defaults.dragit, options.dragit),
                handles = self.querySelectorAll(dragitOptions.handles);
            if (string === 'disable') {
                handles.forEach(function (handle) {
                    handle.style.pointerEvents = 'none';
                });
            } else {
                handles.forEach(function (handle) {
                    handle.style.pointerEvents = 'auto';
                });
            }
            return self;
        };
        self.resizeit = function (string) {
            var handles = self.querySelectorAll('.jsPanel-resizeit-handle');
            if (string === 'disable') {
                handles.forEach(function (handle) {
                    handle.style.pointerEvents = 'none';
                });
            } else {
                handles.forEach(function (handle) {
                    handle.style.pointerEvents = 'auto';
                });
            }
            return self;
        };

        self.getScaleFactor = function () {
            var rect = self.getBoundingClientRect();
            return {
                x: rect.width / self.offsetWidth,
                y: rect.height / self.offsetHeight
            };
        };
        self.calcSizeFactors = function () {
            var styles = window.getComputedStyle(self);
            if (options.container === 'window') {
                self.hf = parseFloat(self.style.left) / (window.innerWidth - parseFloat(self.style.width));
                self.vf = parseFloat(self.style.top) / (window.innerHeight - parseFloat(styles.height));
            } else {
                if (self.parentElement) {
                    var parentStyles = self.parentElement.getBoundingClientRect();
                    self.hf = parseFloat(self.style.left) / (parentStyles.width - parseFloat(self.style.width));
                    self.vf = parseFloat(self.style.top) / (parentStyles.height - parseFloat(styles.height));
                }
            }
        };
        self.saveCurrentDimensions = function () {
            var normData = window.getComputedStyle(self);
            self.currentData.width = normData.width;
            if (self.status === 'normalized') {
                self.currentData.height = normData.height;
            }
        };
        self.saveCurrentPosition = function () {
            var normData = window.getComputedStyle(self);
            self.currentData.left = normData.left;
            self.currentData.top = normData.top;
        };
        self.reposition = function () {
            for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
                params[_key] = arguments[_key];
            }

            var pos = options.position,
                updateCache = true,
                callback = void 0;
            params.forEach(function (value) {
                if (typeof value === 'string' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                    pos = value;
                } else if (typeof value === 'boolean') {
                    updateCache = value;
                } else if (typeof value === 'function') {
                    callback = value;
                }
            });

            jsPanel.position(self, pos);
            if (updateCache) {
                self.saveCurrentPosition();
            }
            if (callback) {
                callback.call(self, self);
            }
            return self;
        };
        self.repositionOnSnap = function (pos) {
            var offsetX = '0',
                offsetY = '0',
                margins = jsPanel.pOcontainment(options.dragit.containment);
            // calculate offsets
            if (options.dragit.snap.containment) {
                if (pos === 'left-top') {
                    offsetX = margins[3];
                    offsetY = margins[0];
                } else if (pos === 'right-top') {
                    offsetX = -margins[1];
                    offsetY = margins[0];
                } else if (pos === 'right-bottom') {
                    offsetX = -margins[1];
                    offsetY = -margins[2];
                } else if (pos === 'left-bottom') {
                    offsetX = margins[3];
                    offsetY = -margins[2];
                } else if (pos === 'center-top') {
                    offsetX = margins[3] / 2 - margins[1] / 2;
                    offsetY = margins[0];
                } else if (pos === 'center-bottom') {
                    offsetX = margins[3] / 2 - margins[1] / 2;
                    offsetY = -margins[2];
                } else if (pos === 'left-center') {
                    offsetX = margins[3];
                    offsetY = margins[0] / 2 - margins[2] / 2;
                } else if (pos === 'right-center') {
                    offsetX = -margins[1];
                    offsetY = margins[0] / 2 - margins[2] / 2;
                }
            }
            /* jsPanel.position(self, `${pos} ${offsetX} ${offsetY}`);
               For some reason I could not find the line above does not work (pos and offsets in one string), but only when
               center-bottom is used with different settings for left/right margin.
            */
            jsPanel.position(self, pos);
            jsPanel.setStyle(self, {
                left: 'calc(' + self.style.left + ' + ' + offsetX + 'px)',
                top: 'calc(' + self.style.top + ' + ' + offsetY + 'px)'
            });
        };
        self.overlaps = function (reference, elmtBox, event) {
            return jsPanel.overlaps(self, reference, elmtBox, event);
        };
        self.shiftWithinParent = function (parent) {
            var parentStyles = parent.getBoundingClientRect(),
                margins = self.options.maximizedMargin;
            var left = void 0,
                top = void 0;
            self.style.left = function () {
                left = (parentStyles.width - parseFloat(self.style.width)) * self.hf;
                return left <= margins[3] ? margins[3] + 'px' : left + 'px';
            }();
            self.style.top = function () {
                top = (parentStyles.height - parseFloat(self.currentData.height)) * self.vf;
                return top <= margins[0] ? margins[0] + 'px' : top + 'px';
            }();
        };
        self.setSize = function () {
            if (options.panelSize) {
                var values = jsPanel.pOsize(self, options.panelSize);
                self.style.width = values.width;
                self.style.height = values.height;
            } else if (options.contentSize) {
                var _values = jsPanel.pOsize(self, options.contentSize);
                self.content.style.width = _values.width;
                self.content.style.height = _values.height;
                self.style.width = _values.width; // explicitly assign current width/height to panel
                self.content.style.width = '100%';
            }
            return self;
        };
        self.resize = function () {
            for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                params[_key2] = arguments[_key2];
            }

            var dimensions = window.getComputedStyle(self),
                size = { width: dimensions.width, height: dimensions.height },
                updateCache = true,
                callback = void 0;
            params.forEach(function (value) {
                if (typeof value === 'string') {
                    size = value;
                } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                    size = Object.assign(size, value);
                } else if (typeof value === 'boolean') {
                    updateCache = value;
                } else if (typeof value === 'function') {
                    callback = value;
                }
            });

            var values = jsPanel.pOsize(self, size);
            self.style.width = values.width;
            self.style.height = values.height;
            if (updateCache) {
                self.saveCurrentDimensions();
            }
            if (callback) {
                callback.call(self, self);
            }
            return self;
        };

        self.setControls = function (sel, cb) {
            self.header.querySelectorAll('.jsPanel-btn').forEach(function (item) {
                var btnClass = item.className.split('-'),
                    btn = btnClass[btnClass.length - 1];
                if (self.getAttribute('data-btn' + btn) !== 'hidden') {
                    item.style.display = 'block';
                }
            });
            sel.forEach(function (item) {
                var btn = self.controlbar.querySelector(item);
                if (btn) {
                    btn.style.display = 'none';
                }
            });
            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.setControlStatus = function (ctrl) {
            var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'enable';
            var cb = arguments[2];

            var btn = self.controlbar.querySelector('.jsPanel-btn-' + ctrl);
            if (action === 'disable') {
                if (self.getAttribute('data-btn' + ctrl) !== 'removed') {
                    self.setAttribute('data-btn' + ctrl, 'disabled');
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = 0.4;
                    btn.style.cursor = 'default';
                }
            } else if (action === 'hide') {
                if (self.getAttribute('data-btn' + ctrl) !== 'removed') {
                    self.setAttribute('data-btn' + ctrl, 'hidden');
                    btn.style.display = 'none';
                }
            } else if (action === 'show') {
                if (self.getAttribute('data-btn' + ctrl) !== 'removed') {
                    self.setAttribute('data-btn' + ctrl, 'enabled');
                    btn.style.display = 'block';
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = 1;
                    btn.style.cursor = 'pointer';
                }
            } else if (action === 'enable') {
                if (self.getAttribute('data-btn' + ctrl) !== 'removed') {
                    if (self.getAttribute('data-btn' + ctrl) === 'hidden') {
                        btn.style.display = 'block';
                    }
                    self.setAttribute('data-btn' + ctrl, 'enabled');
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = 1;
                    btn.style.cursor = 'pointer';
                }
            } else if (action === 'remove') {
                self.controlbar.removeChild(btn);
                self.setAttribute('data-btn' + ctrl, 'removed');
            }

            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.setControlSize = function (ctrlSize) {
            // does not work with Font Awesome webfont (only svg/js)
            var size = ctrlSize.toLowerCase(),
                icons = self.controlbar.querySelectorAll('.jsPanel-btn');
            icons.forEach(function (icon) {
                ['jsPanel-btn-xl', 'jsPanel-btn-lg', 'jsPanel-btn-md', 'jsPanel-btn-sm', 'jsPanel-btn-xs'].forEach(function (item) {
                    icon.classList.remove(item);
                });
                icon.classList.add('jsPanel-btn-' + size);
            });
            // adjust font-size of title
            if (size === 'xl') {
                self.titlebar.style.fontSize = '1.5rem';
            } else if (size === 'lg') {
                self.titlebar.style.fontSize = '1.25rem';
            } else if (size === 'md') {
                self.titlebar.style.fontSize = '1.05rem';
            } else if (size === 'sm') {
                self.titlebar.style.fontSize = '.9rem';
            } else if (size === 'xs') {
                self.titlebar.style.fontSize = '.8rem';
            }
        };
        self.setHeaderControls = function (cb) {
            var controls = ['close', 'maximize', 'normalize', 'minimize', 'smallify', 'smallifyrev'],
                option = jsPanel.pOheaderControls(options.headerControls);
            controls.forEach(function (item) {
                if (option[item]) {
                    self.setControlStatus(item, option[item]);
                }
            });
            self.setControlSize(option.size);
            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.setHeaderLogo = function (logo, cb) {
            var logos = [self.headerlogo],
                minPanel = document.querySelector('#' + self.id + '-min');
            if (minPanel) {
                logos.push(minPanel.querySelector('.jsPanel-headerlogo'));
            }

            if (typeof logo === 'string') {
                if (logo.substr(0, 1) !== '<') {
                    // is assumed to be an img url
                    logos.forEach(function (item) {
                        jsPanel.emptyNode(item);
                        var img = document.createElement('img');
                        img.src = logo;
                        item.append(img);
                    });
                } else {
                    logos.forEach(function (item) {
                        item.innerHTML = logo;
                    });
                }
            } else {
                // assumed to be a node object
                logos.forEach(function (item) {
                    jsPanel.emptyNode(item);
                    item.append(logo);
                });
            }
            // set max-height of logo to equal height of headerbar
            logos.forEach(function (item) {
                item.querySelectorAll('img').forEach(function (img) {
                    img.style.maxHeight = getComputedStyle(self.headerbar).height;
                });
            });

            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.setHeaderRemove = function (cb) {
            self.removeChild(self.header);
            self.content.classList.add('jsPanel-content-noheader');
            ['close', 'maximize', 'normalize', 'minimize', 'smallify', 'smallifyrev'].forEach(function (item) {
                self.setAttribute('data-btn' + item, 'removed');
            });

            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.setHeaderTitle = function (hdrTitle, cb) {
            var titles = [self.headertitle],
                minPanel = document.querySelector('#' + self.id + '-min');
            if (minPanel) {
                titles.push(minPanel.querySelector('.jsPanel-title'));
            }
            if (typeof hdrTitle === 'string') {
                titles.forEach(function (item) {
                    item.innerHTML = hdrTitle;
                });
            } else if (typeof hdrTitle === 'function') {
                titles.forEach(function (item) {
                    jsPanel.emptyNode(item);
                    item.innerHTML = hdrTitle();
                });
            } else {
                // assumed to be a node object
                titles.forEach(function (item) {
                    jsPanel.emptyNode(item);
                    item.append(hdrTitle);
                });
            }

            if (cb) {
                cb.call(self, self);
            }
            return self;
        };
        self.setIconfont = function () {
            var font = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var panel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : self;
            var cb = arguments[2];

            if (font !== false) {
                var classArray = void 0,
                    textArray = void 0;
                if (font === 'bootstrap' || font === 'glyphicon') {
                    classArray = ['glyphicon glyphicon-remove', 'glyphicon glyphicon-fullscreen', 'glyphicon glyphicon-resize-full', 'glyphicon glyphicon-minus', 'glyphicon glyphicon-chevron-down', 'glyphicon glyphicon-chevron-up'];
                } else if (font === 'fa' || font === 'far' || font === 'fal' || font === 'fas') {
                    classArray = [font + ' fa-window-close', font + ' fa-window-maximize', font + ' fa-window-restore', font + ' fa-window-minimize', font + ' fa-chevron-down', font + ' fa-chevron-up'];
                } else if (font === 'material-icons') {
                    classArray = [font, font, font, font, font, font];
                    textArray = ['close', 'fullscreen', 'fullscreen_exit', 'call_received', 'expand_more', 'expand_less'];
                } else if (Array.isArray(font)) {
                    classArray = ['custom-control-icon ' + font[5], 'custom-control-icon ' + font[4], 'custom-control-icon ' + font[3], 'custom-control-icon ' + font[2], 'custom-control-icon ' + font[1], 'custom-control-icon ' + font[0]];
                } else {
                    return panel;
                }
                panel.querySelectorAll('.jsPanel-controlbar .jsPanel-btn').forEach(function (item) {
                    jsPanel.emptyNode(item).innerHTML = '<span></span>';
                });
                Array.prototype.slice.call(panel.querySelectorAll('.jsPanel-controlbar .jsPanel-btn > span')).reverse().forEach(function (item, i) {
                    item.className = classArray[i];
                    if (font === 'material-icons') {
                        item.textContent = textArray[i];
                    }
                });
            }
            if (cb) {
                cb.call(panel, panel);
            }
            return panel;
        };
        self.addToolbar = function (place, tb, cb) {
            if (place === 'header') {
                place = self.headertoolbar;
            } else if (place === 'footer') {
                place = self.footer;
            }

            if (typeof tb === 'string') {
                place.innerHTML = tb;
            } else if (Array.isArray(tb)) {
                tb.forEach(function (item) {
                    if (typeof item === 'string') {
                        place.innerHTML += item;
                    } else {
                        place.append(item);
                    }
                });
            } else if (typeof tb === 'function') {
                var tool = tb.call(self, self);
                if (typeof tool === 'string') {
                    place.innerHTML = tool;
                } else {
                    place.append(tool);
                }
            } else {
                place.append(tb);
            }

            place.classList.add('active');
            if (cb) {
                cb.call(self, self);
            }
            return self;
        };

        self.setRtl = function () {
            [self.header, self.headerlogo, self.titlebar, self.headertitle, self.controlbar, self.headertoolbar, self.content, self.footer].forEach(function (item) {
                item.dir = 'rtl';
                if (options.rtl.lang) {
                    item.lang = options.rtl.lang;
                }
            });
        };
        // option.id
        self.id = options.id;
        // option.paneltype classname
        self.classList.add('jsPanel-' + options.paneltype);

        // set z-index and paneltype class
        if (options.paneltype === 'standard') {
            self.style.zIndex = this.zi.next();
        }

        // option.container
        panelContainer.append(self);
        self.front(false, false); // just to ensure iframe code in jsPanel.front() works for very first panel as well, second false prevents onfronted callbacks to be executed
        // option.theme
        self.setTheme(options.theme);

        // option.boxShadow
        if (options.boxShadow) {
            self.classList.add('jsPanel-depth-' + options.boxShadow);
        }

        /* option.header, option.iconfont, option.headerControls, option.headerLogo, option.headerTitle */
        if (options.header) {
            if (options.headerLogo) {
                self.setHeaderLogo(options.headerLogo);
            }
            self.setIconfont(options.iconfont);
            self.setHeaderTitle(options.headerTitle);
            self.setHeaderControls();
            if (options.header === 'auto-show-hide') {
                var boxShadow = 'jsPanel-depth-' + options.boxShadow;
                self.header.style.opacity = 0;
                self.style.backgroundColor = 'transparent';
                this.remClass(self, boxShadow);
                this.setClass(self.content, boxShadow);
                self.header.addEventListener('mouseenter', function () {
                    self.header.style.opacity = 1;
                    jsPanel.setClass(self, boxShadow);
                    jsPanel.remClass(self.content, boxShadow);
                });
                self.header.addEventListener('mouseleave', function () {
                    self.header.style.opacity = 0;
                    jsPanel.remClass(self, boxShadow);
                    jsPanel.setClass(self.content, boxShadow);
                });
            }
        } else {
            self.setHeaderRemove();
        }

        // option.headerToolbar
        if (options.headerToolbar) {
            self.addToolbar(self.headertoolbar, options.headerToolbar);
        }
        // option.footerToolbar
        if (options.footerToolbar) {
            self.addToolbar(self.footer, options.footerToolbar);
        }

        // option.borderRadius
        if (options.borderRadius) {
            self.applyThemeBorderRadius(options.borderRadius);
        }

        // option.content
        if (options.content) {
            if (typeof options.content === 'function') {
                options.content.call(self, self);
            } else if (typeof options.content === 'string') {
                self.content.innerHTML = options.content;
            } else {
                self.content.append(options.content);
            }
        }

        // option.contentAjax
        if (options.contentAjax) {
            this.ajax(self, options.contentAjax);
        }

        // option.contentFetch
        if (options.contentFetch) {
            this.fetch(self);
        }

        // option.contentOverflow
        if (options.contentOverflow) {
            var value = options.contentOverflow.split(' ');
            if (value.length === 1) {
                self.content.style.overflow = value[0];
            } else if (value.length === 2) {
                self.content.style.overflowX = value[0];
                self.content.style.overflowY = value[1];
            }
        }

        // option.rtl
        if (options.rtl) {
            self.setRtl();
        }
        // option.size -- should be after option.theme
        self.setSize();

        // option.position
        self.status = 'normalized';
        // if option.position evaluates to false panel will not be positioned at all
        if (options.position) {
            this.position(self, options.position);
        } else {
            self.style.opacity = 1;
        }
        document.dispatchEvent(jspanelnormalized);
        self.calcSizeFactors();

        // option.animateIn
        if (options.animateIn) {
            // remove class again on animationend, otherwise opacity doesn't change when panel is dragged
            self.addEventListener('animationend', function () {
                _this.remClass(self, options.animateIn);
            });
            this.setClass(self, options.animateIn);
        }

        // option.dragit AND option.resizeit AND option.syncMargins
        if (options.syncMargins) {
            var containment = this.pOcontainment(options.maximizedMargin);
            if (options.dragit) {
                options.dragit.containment = containment;
                if (options.dragit.snap) {
                    options.dragit.snap.containment = true;
                }
            }
            if (options.resizeit) {
                options.resizeit.containment = containment;
            }
        }

        if (options.dragit) {
            this.dragit(self, options.dragit);
            self.addEventListener('jspaneldragstop', function (e) {
                if (e.detail === self.id) {
                    self.calcSizeFactors();
                }
            }, false);
        } else {
            self.titlebar.style.cursor = 'default';
        }

        if (options.resizeit) {
            this.resizeit(self, options.resizeit);
            var startstatus = void 0;
            self.addEventListener('jspanelresizestart', function (e) {
                if (e.detail === self.id) {
                    startstatus = self.status;
                }
            }, false);
            self.addEventListener('jspanelresizestop', function (e) {
                if (e.detail === self.id) {
                    if ((startstatus === 'smallified' || startstatus === 'smallifiedmax' || startstatus === 'maximized') && parseFloat(self.style.height) > parseFloat(window.getComputedStyle(self.header).height)) {
                        self.setControls(['.jsPanel-btn-normalize', '.jsPanel-btn-smallifyrev']);
                        self.status = 'normalized';
                        document.dispatchEvent(jspanelnormalized);
                        document.dispatchEvent(jspanelstatuschange);
                        if (options.onstatuschange) {
                            jsPanel.processCallbacks(self, options.onstatuschange, 'every');
                        }
                        self.calcSizeFactors();
                    }
                }
            }, false);
        }

        // initialize self.currentData - must be after options position & size
        self.saveCurrentDimensions();
        self.saveCurrentPosition();

        // option.setStatus
        if (options.setStatus) {
            if (options.setStatus === 'smallifiedmax') {
                self.maximize().smallify();
            } else if (options.setStatus === 'smallified') {
                self.smallify();
            } else {
                // remove the char 'd' from end of string to get function name to call
                self[options.setStatus.substr(0, options.setStatus.length - 1)]();
            }
        }

        // option.autoclose
        if (options.autoclose) {
            self.closetimer = window.setTimeout(function () {
                if (self) jsPanel.close(self);
            }, options.autoclose);
        }

        // front panel on mousedown
        this.pointerdown.forEach(function (item) {
            self.addEventListener(item, function (e) {
                if (!e.target.closest('.jsPanel-btn-close') && !e.target.closest('.jsPanel-btn-minimize') && options.paneltype === 'standard') {
                    self.front();
                }
            }, false);
        });

        // option.onwindowresize
        if (options.onwindowresize) {
            window.addEventListener('resize', function (e) {
                if (e.target === window) {
                    // see https://bugs.jqueryui.com/ticket/7514
                    var param = options.onwindowresize,
                        status = self.status,
                        parentStyles = void 0;
                    if (self.parentElement) {
                        parentStyles = window.getComputedStyle(self.parentElement);
                    } else {
                        return false;
                    }
                    if (status === 'maximized' && param === true) {
                        self.maximize();
                    } else if (self.snapped) {
                        jsPanel.snapPanel(self, self.snapped, true);
                    } else if (status === 'normalized' || status === 'smallified' || status === 'maximized') {
                        if (typeof param === 'function') {
                            param.call(self, e, self);
                        } else {
                            self.style.left = function () {
                                var left = void 0;
                                if (options.container === 'window') {
                                    left = (window.innerWidth - parseFloat(self.style.width)) * self.hf;
                                } else {
                                    left = (parseFloat(parentStyles.width) - parseFloat(self.style.width)) * self.hf;
                                }
                                return left <= 0 ? 0 : left + 'px';
                            }();
                            self.style.top = function () {
                                var top = void 0;
                                if (options.container === 'window') {
                                    top = (window.innerHeight - parseFloat(self.currentData.height)) * self.vf;
                                } else {
                                    top = (parseFloat(parentStyles.height) - parseFloat(self.currentData.height)) * self.vf;
                                }
                                return top <= 0 ? 0 : top + 'px';
                            }();
                        }
                    }
                }
            }, false);
        }

        // option onparentresize
        if (options.onparentresize) {
            var parentpanel = self.isChildpanel(),
                parentOptions = parentpanel.options,
                isFunction = typeof options.onparentresize === 'function';
            var handleSelf = function handleSelf() {
                if (self.status !== 'minimized') {
                    if (self.status === 'maximized') {
                        self.maximize();
                    } else if (self.status === 'smallifiedmax') {
                        self.maximize().smallify();
                    } else if (self.snapped) {
                        jsPanel.snapPanel(self, self.snapped, true);
                    } else {
                        self.shiftWithinParent(parentpanel.content);
                    }
                }
            };
            if (parentpanel) {
                /* for some reason I don't understand code below does not work as intended this cb has to be set in the code generating the childpanel
                self.options.resizeit.stop.push(function () {self.calcSizeFactors();});
                */
                if (isFunction) {
                    parentOptions.resizeit.resize.push(function () {
                        if (self.status !== 'minimized') {
                            var parentStyles = parentpanel.content.getBoundingClientRect();
                            options.onparentresize.call(self, self, { width: parentStyles.width, height: parentStyles.height });
                        }
                    });
                } else {
                    parentOptions.resizeit.resize.push(function () {
                        handleSelf();
                    });
                    parentOptions.onmaximized.push(function () {
                        handleSelf();
                    });
                    parentOptions.onnormalized.push(function () {
                        handleSelf();
                    });
                    self.options.onnormalized.push(function () {
                        if (self.snapped) {
                            jsPanel.snapPanel(self, self.snapped, true);
                        } else {
                            self.shiftWithinParent(parentpanel.content);
                        }
                    });
                }
            }
        }

        // global callbacks
        if (this.globalCallbacks) {
            if (Array.isArray(this.globalCallbacks)) {
                this.globalCallbacks.forEach(function (item) {
                    item.call(self, self);
                });
            } else {
                this.globalCallbacks.call(self, self);
            }
        }

        // option.callback
        if (options.callback) {
            if (Array.isArray(options.callback)) {
                options.callback.forEach(function (item) {
                    item.call(self, self);
                });
            } else {
                options.callback.call(self, self);
            }
        }

        // constructor callback
        if (cb) {
            cb.call(self, self);
        }

        document.dispatchEvent(jspanelloaded);
        return self;
    }
};

// Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html
if (typeof module !== 'undefined') {
    module.exports = jsPanel;
}