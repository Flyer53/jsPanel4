/**
 * jsPanel - A JavaScript library to create highly configurable multifunctional floating panels that can also be used as modal, tooltip, hint or contextmenu
 * @version v4.12.0
 * @homepage https://jspanel.de/
 * @license MIT
 * @author Stefan Sträßer - info@jspanel.de
 * @github https://github.com/Flyer53/jsPanel4.git
 */

'use strict';
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * requires moment.js < https://momentjs.com/ > to be loaded prior this extension
 */
// TODO: - cancelable events dateselect, rangeselect, selectionclear, etc. ??
//       - alternative way to select a range, e.g start by Alt+Click end end by another Alt-Click ??
//       - make dates not selectable and mark them accordingly ??
//       - load list of days to highlight somehow (e.g. holidays)
if (!jsPanel.datepicker) {
  // add some icons for the datepicker controls
  jsPanel.icons.chevronLeft = "<svg focusable=\"false\" class=\"jsPanel-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\"><g transform=\"matrix(6.12323e-17,-1,1,6.12323e-17,0.0375,22.0375)\"><path fill=\"currentColor\" d=\"M2.1,15.2L2.9,16C3.1,16.2 3.4,16.2 3.6,16L11,8.7L18.4,16C18.6,16.2 18.9,16.2 19.1,16L19.9,15.2C20.1,15 20.1,14.7 19.9,14.5L11.3,6C11.1,5.8 10.8,5.8 10.6,6L2.1,14.5C2,14.7 2,15 2.1,15.2Z\"/></g></svg>";
  jsPanel.icons.chevronRight = "<svg focusable=\"false\" class=\"jsPanel-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\"><g transform=\"matrix(6.12323e-17,1,-1,6.12323e-17,22.0375,-0.0375)\"><path fill=\"currentColor\" d=\"M2.1,15.2L2.9,16C3.1,16.2 3.4,16.2 3.6,16L11,8.7L18.4,16C18.6,16.2 18.9,16.2 19.1,16L19.9,15.2C20.1,15 20.1,14.7 19.9,14.5L11.3,6C11.1,5.8 10.8,5.8 10.6,6L2.1,14.5C2,14.7 2,15 2.1,15.2Z\"/></g></svg>";
  jsPanel.icons.square = "<svg focusable=\"false\" class=\"jsPanel-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\"><g transform=\"matrix(0.0401786,0,0,0.0401786,2,0.714286)\"><path fill=\"currentColor\" d=\"M400,32L48,32C21.5,32 0,53.5 0,80L0,432C0,458.5 21.5,480 48,480L400,480C426.5,480 448,458.5 448,432L448,80C448,53.5 426.5,32 400,32ZM394,432L54,432C50.7,432 48,429.3 48,426L48,86C48,82.7 50.7,80 54,80L394,80C397.3,80 400,82.7 400,86L400,426C400,429.3 397.3,432 394,432Z\"/></g></svg>";
  jsPanel.icons.undo = "<svg focusable=\"false\" class=\"jsPanel-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\"><g transform=\"matrix(2.18687e-18,0.0357143,-0.0357143,2.18687e-18,20.1429,2)\"><path fill=\"currentColor\" d=\"M12,8L39.711,8C46.45,8 51.868,13.548 51.708,20.286L49.361,118.854C93.925,51.834 170.212,7.73 256.793,8.001C393.18,8.428 504.213,120.009 504,256.396C503.786,393.181 392.835,504 256,504C192.074,504 133.798,479.813 89.822,440.092C84.709,435.474 84.468,427.531 89.34,422.659L109.078,402.921C113.576,398.423 120.831,398.136 125.579,402.369C160.213,433.246 205.895,452 256,452C364.322,452 452,364.338 452,256C452,147.678 364.338,60 256,60C176.455,60 108.059,107.282 77.325,175.302L203.714,172.293C210.451,172.133 216,177.55 216,184.29L216,212C216,218.627 210.627,224 204,224L12,224C5.373,224 0,218.627 0,212L0,20C0,13.373 5.373,8 12,8Z\"/></g></svg>";
  jsPanel.datepicker = {
    version: '0.3.2',
    date: '2020-06-19 09:48',
    defaults: {
      locale: 'en',
      startdate: undefined,
      months: 1,
      showWeekNumbers: true,
      ondateselect: undefined,
      onrangeselect: undefined,
      onselectionclear: undefined,
      callback: undefined
    },
    keyValue: undefined,
    generateHTML: function generateHTML() {
      var wrapper = document.createElement('div');
      wrapper.className = 'jsPanel-cal-wrapper';
      wrapper.innerHTML = "<div class=\"jsPanel-cal-sub jsPanel-cal-clear\" title=\"Clear all selections\">".concat(jsPanel.icons.square, "</div>\n            <div class=\"jsPanel-cal-sub jsPanel-cal-back\" title=\"Go back one month\">").concat(jsPanel.icons.chevronLeft, "</div>\n            <div class=\"jsPanel-cal-sub jsPanel-cal-month\"></div>\n            <div class=\"jsPanel-cal-sub jsPanel-cal-forward\" title=\"Go forward one month\">").concat(jsPanel.icons.chevronRight, "</div>\n            <div class=\"jsPanel-cal-sub jsPanel-cal-reset\" title=\"Reset to current month\">").concat(jsPanel.icons.undo, "</div>\n            <div class=\"jsPanel-cal-sub jsPanel-cal-blank3\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-0\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-1\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-2\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-3\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-4\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-5\"></div>\n            <div class=\"jsPanel-cal-sub day-name day-name-6\"></div>");

      for (var i = 0; i < 6; i++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub week week-".concat(i, "\"></div>");
      }

      for (var _i = 1; _i < 43; _i++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub day day-".concat(_i, "\"></div>"); // ${i} is just a counter of days listed in the calendar, not a date value!
      }

      return wrapper;
    },
    // method to fill a month with data
    fillMonth: function fillMonth(datepicker) {
      var startdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment();
      moment.locale(datepicker.options.locale); // set locale globally

      var now = moment(startdate) || moment(datepicker.options.startdate);
      now.locale(datepicker.options.locale);
      var month = now.month(),
          // returns number 0 to 11 where 0 is January
      firstDay = now.date(1).weekday(),
          // returns locale aware number 0 to 6 where 0 is either Sunday or Monday
      localeData = now.localeData(); // fill selected month incl. year

      var monthBox = datepicker.querySelector('.jsPanel-cal-month');
      monthBox.innerHTML = now.format('MMMM YYYY');
      monthBox.dataset.date = now.format('YYYY-MM-DD'); // fill day names (Mo, Tu, etc.) considering used locale

      var dayNames = datepicker.querySelectorAll('.jsPanel-cal-sub.day-name'),
          weekdays = localeData.weekdaysMin();

      if (localeData.firstDayOfWeek() === 1) {
        // week starts with Monday
        for (var i = 0, j = 1; i < 7; i++, j++) {
          dayNames[i].textContent = weekdays[j];
        }

        dayNames[6].textContent = weekdays[0];
        dayNames[5].classList.add('weekend');
        dayNames[6].classList.add('weekend');
      } else {
        for (var _i2 = 0; _i2 < 7; _i2++) {
          dayNames[_i2].textContent = weekdays[_i2];
        }

        dayNames[0].classList.add('weekend');
        dayNames[6].classList.add('weekend');
      } // fill dates


      var firstEntry = now.subtract(++firstDay, 'days');
      var days = datepicker.querySelectorAll('.jsPanel-cal-sub.day');

      var _iterator = _createForOfIteratorHelper(days),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var day = _step.value;
          day.classList.remove('today', 'notInMonth', 'selected', 'range', 'remove-border-radius-right', 'remove-border-radius-left');
          var value = firstEntry.add(1, 'days');
          day.textContent = value.format('D');
          day.dataset.date = now.format('YYYY-MM-DD');

          if (value.month() !== month) {
            day.classList.add('notInMonth');
          } else if (day.dataset.date === moment().format('YYYY-MM-DD')) {
            day.classList.add('today');
          }
        } // fill week numbers

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (datepicker.options.showWeekNumbers) {
        datepicker.querySelectorAll('.jsPanel-cal-sub.week').forEach(function (week, index) {
          week.textContent = moment(datepicker.querySelector(".jsPanel-cal-sub.day-".concat((index + 1) * 7)).dataset.date).week();
        });
      }
    },
    // deselect all days (remove .selected class; does not empty selectedDays/selectedRange)
    // do not empty selectedDays/selectedRange -> selection would be lost when clicking forward/back buttons
    deselectAllDays: function deselectAllDays(container) {
      var _iterator2 = _createForOfIteratorHelper(container.querySelectorAll('.jsPanel-cal-sub.day')),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var day = _step2.value;
          day.classList.remove('selected', 'range', 'remove-border-radius-right', 'remove-border-radius-left');
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    },
    // method to restore selected dates or range
    restoreSelections: function restoreSelections(container) {
      // restore selections of days
      var days = container.querySelectorAll('.jsPanel-cal-sub.day');

      var _iterator3 = _createForOfIteratorHelper(days),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _day = _step3.value;

          if (container.selectedDays.has(_day.dataset.date)) {
            _day.classList.add('selected');
          }
        } // restore selection of a range

      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      if (container.selectedRange.size) {
        var rangeIterator = container.selectedRange.values();
        var rangeArray = rangeIterator.next().value.split('/');

        var _iterator4 = _createForOfIteratorHelper(days),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var day = _step4.value;
            var date = day.dataset.date;

            if (date >= rangeArray[0] && date <= rangeArray[1]) {
              day.classList.add('selected', 'range'); // remove border radius of dates between start and end

              if (date === rangeArray[0]) {
                day.classList.add('remove-border-radius-right');
              } else if (date === rangeArray[1]) {
                day.classList.add('remove-border-radius-left');
              } else if (date > rangeArray[0] || date < rangeArray[1]) {
                day.classList.add('remove-border-radius-right', 'remove-border-radius-left');
              }
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    },
    create: function create(container) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      container.style.display = 'flex';
      container.selectedDays = new Set();
      container.selectedRange = new Set();
      var opts = Object.assign({}, this.defaults, options);
      var wrapper; // fill container with monthly calendars according to option.months

      for (var i = 0; i < opts.months; i++) {
        wrapper = this.generateHTML();
        wrapper.options = opts;
        container.append(wrapper); // fill month with data

        this.fillMonth(wrapper, opts.startdate); // increase startdate 1 month for next calendar

        opts.startdate = moment(opts.startdate).add(1, 'months');
      } // add handlers for back, forward etc. buttons


      var pickers = container.querySelectorAll('.jsPanel-cal-wrapper');

      var _iterator5 = _createForOfIteratorHelper(pickers),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var picker = _step5.value;

          // clear buttons
          var _iterator8 = _createForOfIteratorHelper(picker.querySelectorAll('.jsPanel-cal-clear')),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var clearbtn = _step8.value;
              clearbtn.addEventListener('click', function (e) {
                if (opts.onselectionclear && typeof opts.onselectionclear === 'function') {
                  opts.onselectionclear.call(container, container, e);
                }

                if (!e.defaultPrevented) {
                  jsPanel.datepicker.deselectAllDays(container);
                  container.selectedDays.clear();
                  container.selectedRange.clear();
                }
              });
            } // back buttons

          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }

          var _iterator9 = _createForOfIteratorHelper(picker.querySelectorAll('.jsPanel-cal-back')),
              _step9;

          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var backbtn = _step9.value;
              backbtn.addEventListener('click', function () {
                // get all wrappers and decrease their date
                var _iterator12 = _createForOfIteratorHelper(pickers),
                    _step12;

                try {
                  for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                    var _picker = _step12.value;

                    var monthshown = _picker.querySelector('.jsPanel-cal-month').dataset.date,
                        // string like '2020-02-12'
                    monthwanted = moment(monthshown).subtract(1, 'months').format('YYYY-MM');

                    jsPanel.datepicker.fillMonth(_picker, monthwanted);
                  }
                } catch (err) {
                  _iterator12.e(err);
                } finally {
                  _iterator12.f();
                }

                jsPanel.datepicker.deselectAllDays(container);
                jsPanel.datepicker.restoreSelections(container);
              });
            } // forward buttons

          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }

          var _iterator10 = _createForOfIteratorHelper(picker.querySelectorAll('.jsPanel-cal-forward')),
              _step10;

          try {
            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              var fwdbtn = _step10.value;
              fwdbtn.addEventListener('click', function () {
                // get all wrappers and increase their date
                var _iterator13 = _createForOfIteratorHelper(pickers),
                    _step13;

                try {
                  for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                    var _picker2 = _step13.value;

                    var monthshown = _picker2.querySelector('.jsPanel-cal-month').dataset.date,
                        // string like '2020-02-12'
                    monthwanted = moment(monthshown).add(1, 'months').format('YYYY-MM');

                    jsPanel.datepicker.fillMonth(_picker2, monthwanted);
                  }
                } catch (err) {
                  _iterator13.e(err);
                } finally {
                  _iterator13.f();
                }

                jsPanel.datepicker.deselectAllDays(container);
                jsPanel.datepicker.restoreSelections(container);
              });
            } // reset buttons

          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }

          var _iterator11 = _createForOfIteratorHelper(picker.querySelectorAll('.jsPanel-cal-reset')),
              _step11;

          try {
            for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
              var resetbtn = _step11.value;
              resetbtn.addEventListener('click', function (e) {
                // get month shown of clicked picker
                var picker = e.target.closest('.jsPanel-cal-wrapper'),
                    counter = 0;

                while (picker.previousSibling) {
                  counter++;
                  picker = picker.previousSibling;
                } // counter is now the zero-based position of the clicked picker in the container
                // get month for first picker in sequence


                var month = moment().subtract(counter, 'months'); // reset each pickers month

                var _iterator14 = _createForOfIteratorHelper(pickers),
                    _step14;

                try {
                  for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                    var _picker3 = _step14.value;
                    jsPanel.datepicker.fillMonth(_picker3, month);
                    month = moment(month).add(1, 'months');
                  }
                } catch (err) {
                  _iterator14.e(err);
                } finally {
                  _iterator14.f();
                }

                jsPanel.datepicker.deselectAllDays(container);
                jsPanel.datepicker.restoreSelections(container);
              });
            }
          } catch (err) {
            _iterator11.e(err);
          } finally {
            _iterator11.f();
          }
        }
        /**
         * CLICK ON A DAY
         * MEANS SELECTION/DESELECTION OF SINGLE OR MULTIPLE DAYS; NO RANGES
         */

      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      container.addEventListener('click', function (e) {
        e.preventDefault();
        var target = e.target,
            altKey = e.altKey,
            ctrlKey = e.ctrlKey,
            shiftKey = e.shiftKey;

        if (target.classList.contains('day')) {
          // check whether day is already selected
          var selected = target.classList.contains('selected');
          var date = target.dataset.date;
          /**
           * IF NO MODIFIER KEY IS PRESSED
           */

          if (!ctrlKey && !shiftKey && !altKey) {
            // unselect all selected days and clear container.selectedDays
            jsPanel.datepicker.deselectAllDays(container);
            container.selectedDays.clear(); // select/unselect day depending on let selected

            if (selected) {
              target.classList.remove('selected');
            } else {
              target.classList.add('selected'); // add selected day to storage

              container.selectedDays.add(date);
            }
          } else if (!altKey && ctrlKey && !shiftKey) {
            /**
             * IF CTRL KEY IS PRESSED
             */
            container.selectedRange.clear();

            var _iterator6 = _createForOfIteratorHelper(container.querySelectorAll('.day')),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var day = _step6.value;

                if (day.classList.contains('selected') && day.classList.contains('range')) {
                  day.classList.remove('range', 'selected');
                }
              } // select/unselect day depending on let selected

            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }

            if (selected) {
              target.classList.remove('selected'); // remove selected day from storage

              container.selectedDays["delete"](date);
            } else {
              target.classList.add('selected'); // add selected day to storage

              container.selectedDays.add(date);
            }
          } // custom callback


          if (opts.ondateselect && typeof opts.ondateselect === 'function') {
            opts.ondateselect.call(container, container, date, e);
          }
        }
      });
      /**
       * POINTERDOWN HANDLER TO STARTING A RANGE SELECTION
       */

      var rangeSelectionStarted;
      container.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        var target = e.target,
            altKey = e.altKey,
            ctrlKey = e.ctrlKey,
            shiftKey = e.shiftKey;
        var start = e.target.dataset.date,
            current = e.target.dataset.date,
            range = [start, start];

        var calcRange = function calcRange(e) {
          e.preventDefault();
          rangeSelectionStarted = true;

          if (container.selectedDays.size) {
            container.selectedDays.clear();
          } // build range array and sort it


          if (e.target.classList.contains('day')) {
            current = e.target.dataset.date;
            range = [start, current].sort(function (a, b) {
              return moment(a).unix() - moment(b).unix(); // convert values to number for comparison
            });
          } // add needed classes to selected range


          var _iterator7 = _createForOfIteratorHelper(container.querySelectorAll('.day')),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var day = _step7.value;
              var date = day.dataset.date;
              day.classList.remove('remove-border-radius-right', 'remove-border-radius-left');

              if (date < range[0] || date > range[1]) {
                day.classList.remove('selected', 'range');
              } else {
                day.classList.add('selected', 'range'); // remove border radius of dates between start and end

                if (date === range[0]) {
                  day.classList.add('remove-border-radius-right');
                } else if (date === range[1]) {
                  day.classList.add('remove-border-radius-left');
                } else if (date > range[0] || date < range[1]) {
                  day.classList.add('remove-border-radius-right', 'remove-border-radius-left');
                }
              }
            } // build range string for selectedRange

          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }

          container.selectedRange.clear();
          container.selectedRange.add(container.querySelector(".day[data-date=\"".concat(range[0], "\"]")).dataset.date + '/' + container.querySelector(".day[data-date=\"".concat(range[1], "\"]")).dataset.date);
        }; // if pointerdown is on a day and Shift key is pressed


        if (target.classList.contains('day') && !altKey && !ctrlKey && shiftKey) {
          container.addEventListener('pointermove', calcRange);
          container.addEventListener('pointerup', function () {
            container.removeEventListener('pointermove', calcRange);
          });
        }
      });
      container.addEventListener('pointerup', function (e) {
        if (rangeSelectionStarted) {
          if (opts.onrangeselect && typeof opts.onrangeselect === 'function') {
            opts.onrangeselect.call(container, container, container.selectedRange, e);
            rangeSelectionStarted = undefined;
          }
        }

        rangeSelectionStarted = undefined;
      });

      if (opts.callback) {
        opts.callback.call(container, container);
      }

      return container;
    }
  }; // jsPanel.datepicker.keyValue is set to the value of the pressed number key while key is down and if key's value is between 1 and 9

  document.addEventListener('keydown', function (e) {
    if (e.key.match(/^[2-9]$/)) {
      jsPanel.datepicker.keyValue = e.key;
    } else if (e.key.match(/^1$/)) {
      jsPanel.datepicker.keyValue = 12;
    }
  });
  document.addEventListener('keyup', function () {
    jsPanel.datepicker.keyValue = undefined;
  });
}

// Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html
if (typeof module !== 'undefined') { module.exports = jsPanel; }
