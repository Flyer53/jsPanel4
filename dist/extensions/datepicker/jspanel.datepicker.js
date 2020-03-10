/**
 * jsPanel - A JavaScript library to create highly configurable multifunctional floating panels that can also be used as modal, tooltip, hint or contextmenu
 * @version v4.9.5
 * @homepage https://jspanel.de/
 * @license MIT
 * @author Stefan Sträßer - info@jspanel.de
 * @github https://github.com/Flyer53/jsPanel4.git
 */

'use strict';
/**
 * requires moment.js < https://momentjs.com/ > to be loaded prior this extension
 */
// TODO: - cancelable events dateselect, rangeselect, selectionclear, etc. ??
//       - alternative way to select a range, e.g start by Alt+Click end end by another Alt-Click ??
//       - make dates not selectable and mark them accordingly ??
//       - load list of days to highlight somehow (e.g. holidays)
if (!jsPanel.datepicker) {
  jsPanel.datepicker = {
    version: '0.3.0',
    date: '2020-02-16 19:32',
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
      wrapper.innerHTML = "<div class=\"jsPanel-cal-sub jsPanel-cal-clear\">&#9723;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-back\">&#9204;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-month\"></div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-forward\">&#9205;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-reset\">&#8634;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-blank3\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-0\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-1\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-2\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-3\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-4\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-5\"></div>\n                <div class=\"jsPanel-cal-sub day-name day-name-6\"></div>";

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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = days[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = container.querySelectorAll('.jsPanel-cal-sub.day')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var day = _step2.value;
          day.classList.remove('selected', 'range', 'remove-border-radius-right', 'remove-border-radius-left');
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    },
    // method to restore selected dates or range
    restoreSelections: function restoreSelections(container) {
      // restore selections of days
      var days = container.querySelectorAll('.jsPanel-cal-sub.day');
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = days[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _day = _step3.value;

          if (container.selectedDays.has(_day.dataset.date)) {
            _day.classList.add('selected');
          }
        } // restore selection of a range

      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (container.selectedRange.size) {
        var rangeIterator = container.selectedRange.values();
        var rangeArray = rangeIterator.next().value.split('/');
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = days[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
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
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
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
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = pickers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var picker = _step5.value;
          // clear buttons
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = picker.querySelectorAll('.jsPanel-cal-clear')[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
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
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
                _iterator8["return"]();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }

          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = picker.querySelectorAll('.jsPanel-cal-back')[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var backbtn = _step9.value;
              backbtn.addEventListener('click', function () {
                // get all wrappers and decrease their date
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                  for (var _iterator12 = pickers[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var _picker = _step12.value;

                    var monthshown = _picker.querySelector('.jsPanel-cal-month').dataset.date,
                        // string like '2020-02-12'
                    monthwanted = moment(monthshown).subtract(1, 'months').format('YYYY-MM');

                    jsPanel.datepicker.fillMonth(_picker, monthwanted);
                  }
                } catch (err) {
                  _didIteratorError12 = true;
                  _iteratorError12 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
                      _iterator12["return"]();
                    }
                  } finally {
                    if (_didIteratorError12) {
                      throw _iteratorError12;
                    }
                  }
                }

                jsPanel.datepicker.deselectAllDays(container);
                jsPanel.datepicker.restoreSelections(container);
              });
            } // forward buttons

          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
                _iterator9["return"]();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }

          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = picker.querySelectorAll('.jsPanel-cal-forward')[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var fwdbtn = _step10.value;
              fwdbtn.addEventListener('click', function () {
                // get all wrappers and increase their date
                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                  for (var _iterator13 = pickers[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                    var _picker2 = _step13.value;

                    var monthshown = _picker2.querySelector('.jsPanel-cal-month').dataset.date,
                        // string like '2020-02-12'
                    monthwanted = moment(monthshown).add(1, 'months').format('YYYY-MM');

                    jsPanel.datepicker.fillMonth(_picker2, monthwanted);
                  }
                } catch (err) {
                  _didIteratorError13 = true;
                  _iteratorError13 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
                      _iterator13["return"]();
                    }
                  } finally {
                    if (_didIteratorError13) {
                      throw _iteratorError13;
                    }
                  }
                }

                jsPanel.datepicker.deselectAllDays(container);
                jsPanel.datepicker.restoreSelections(container);
              });
            } // reset buttons

          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                _iterator10["return"]();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }

          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = picker.querySelectorAll('.jsPanel-cal-reset')[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
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

                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                  for (var _iterator14 = pickers[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var _picker3 = _step14.value;
                    jsPanel.datepicker.fillMonth(_picker3, month);
                    month = moment(month).add(1, 'months');
                  }
                } catch (err) {
                  _didIteratorError14 = true;
                  _iteratorError14 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion14 && _iterator14["return"] != null) {
                      _iterator14["return"]();
                    }
                  } finally {
                    if (_didIteratorError14) {
                      throw _iteratorError14;
                    }
                  }
                }

                jsPanel.datepicker.deselectAllDays(container);
                jsPanel.datepicker.restoreSelections(container);
              });
            }
          } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
                _iterator11["return"]();
              }
            } finally {
              if (_didIteratorError11) {
                throw _iteratorError11;
              }
            }
          }
        }
        /**
         * CLICK ON A DAY
         * MEANS SELECTION/DESELECTION OF SINGLE OR MULTIPLE DAYS; NO RANGES
         */

      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
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
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = container.querySelectorAll('.day')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var day = _step6.value;

                if (day.classList.contains('selected') && day.classList.contains('range')) {
                  day.classList.remove('range', 'selected');
                }
              } // select/unselect day depending on let selected

            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                  _iterator6["return"]();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
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


          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = container.querySelectorAll('.day')[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
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
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                _iterator7["return"]();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
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
