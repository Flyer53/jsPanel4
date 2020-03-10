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
if (!jsPanel.datepicker) {
  jsPanel.datepicker = {
    version: '0.2.5',
    date: '2020-02-10 11:50',
    defaults: {
      locale: 'en',
      months: 1,
      showWeekNumbers: true,
      ondateselect: undefined,
      onrangeselect: undefined
    },
    keyValue: undefined,
    weekcount: [6, 10, 14],
    // number of weeks in datepicker for 1, 2 or 3 months
    daycount: [43, 71, 99],
    // number of days in datepicker for 1, 2 or 3 months
    generateHTML: function generateHTML(options) {
      var wrapper = document.createElement('div');
      wrapper.className = 'jsPanel-cal-wrapper';
      wrapper.innerHTML = "<div class=\"jsPanel-cal-sub jsPanel-cal-clear\">&#9723;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-back\">&#9204;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-month\"></div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-forward\">&#9205;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-reset\">&#8634;</div>\n                <div class=\"jsPanel-cal-sub jsPanel-cal-blank3\"></div>";

      for (var i = 0; i < 7; i++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub day-name day-name-".concat(i, "\"></div>");
      }

      for (var _i = 0; _i < this.weekcount[options.months - 1]; _i++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub week week-".concat(_i, "\"></div>");
      }

      for (var _i2 = 1; _i2 < this.daycount[options.months - 1]; _i2++) {
        wrapper.innerHTML += "<div class=\"jsPanel-cal-sub day day-".concat(_i2, "\" data-day=\"").concat(_i2, "\"></div>"); // ${i} is just a counter of days listed in the calendar, not a date value!
      }

      return wrapper;
    },
    create: function create(container) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var opts = options;

      if (options.config) {
        opts = Object.assign({}, options.config, options);
        delete opts.config;
      }

      opts = Object.assign({}, this.defaults, opts); // opts months must be in range 1 - 3

      if (opts.months < 1 || opts.months > 3) {
        opts.months = 1;
      } // stores days selected in calendar


      container.selectedDays = new Set();
      container.selectedRange = new Set(); // deselect all days (remove .selected class; does not empty container.selectedDays/container.selectedRange)
      // do not empty container.selectedDays/container.selectedRange -> selection would be lost when clicking forward/back buttons

      container.deselectAllDays = function () {
        var days = container.querySelectorAll('.jsPanel-cal-sub.day');
        days.forEach(function (day) {
          day.classList.remove('selected', 'range');
        });
      }; // method to restore selected dates or range


      container.restoreSelections = function () {
        // restore selections of days
        var days = container.querySelectorAll('.jsPanel-cal-sub.day');
        days.forEach(function (day) {
          if (container.selectedDays.has(day.dataset.date)) {
            day.classList.add('selected');
          }
        }); // restore selection of a range

        if (container.selectedRange.size) {
          var rangeIterator = container.selectedRange.values();
          var rangeArray = rangeIterator.next().value.split('/');
          days.forEach(function (day) {
            if (day.dataset.date >= rangeArray[0] && day.dataset.date <= rangeArray[1]) {
              day.classList.add('selected', 'range');
            }
          });
        }
      }; // method to fill the datepicker with data


      container.fill = function (date) {
        moment.locale(opts.locale); // set locale globally

        var now = date || moment(); // returns 2019-06-01T09:44:14.083Z

        now.locale(opts.locale);
        var month = now.month(),
            // returns number 0 to 11 where 0 is January
        firstDay = now.date(1).weekday(),
            // returns locale aware number 0 to 6 where 0 is either Sunday or Monday
        localeData = now.localeData(); // fill selected month incl. year

        var monthBox = container.querySelector('.jsPanel-cal-month');
        monthBox.innerHTML = now.format('MMMM YYYY');
        monthBox.dataset.date = now.format('YYYY-MM-DD'); // fill day names (Mo, Tu, etc.) considering used locale

        var dayNames = container.querySelectorAll('.jsPanel-cal-sub.day-name'),
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
          for (var _i3 = 0; _i3 < 7; _i3++) {
            dayNames[_i3].textContent = weekdays[_i3];
          }

          dayNames[0].classList.add('weekend');
          dayNames[6].classList.add('weekend');
        } // fill dates


        var firstEntry = now.subtract(++firstDay, 'days');
        var days = container.querySelectorAll('.jsPanel-cal-sub.day');
        days.forEach(function (day) {
          day.classList.remove('today', 'notInMonth');
          var value = firstEntry.add(1, 'days');
          day.textContent = value.format('D');
          day.dataset.date = now.format('YYYY-MM-DD');

          if (value.month() !== month) {
            day.classList.add('notInMonth');
          } else if (day.dataset.date === moment().format('YYYY-MM-DD')) {
            day.classList.add('today');
          }
        }); // fill week numbers

        if (opts.showWeekNumbers) {
          container.querySelectorAll('.jsPanel-cal-sub.week').forEach(function (week, index) {
            week.textContent = moment(container.querySelector(".jsPanel-cal-sub.day-".concat((index + 1) * 7)).dataset.date).week();
          });
        } else {
          container.querySelector('.jsPanel-cal-wrapper').style.gridTemplateColumns = '0fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr';
        }
      }; // load datepicker HTML and fill it


      var wrapper = this.generateHTML(opts);
      wrapper.classList.add("month-count-".concat(opts.months));
      container.append(wrapper);
      container.fill(); // handler to go back one month

      var month = container.querySelector('.jsPanel-cal-sub.jsPanel-cal-month');
      container.querySelector('.jsPanel-cal-sub.jsPanel-cal-back').addEventListener('click', function (e) {
        e.preventDefault();
        var count = jsPanel.datepicker.keyValue || 1;
        container.fill(moment(month.dataset.date).subtract(count, 'months'));
        container.deselectAllDays();
        container.restoreSelections();
      }); // handler to go forward one month

      container.querySelector('.jsPanel-cal-sub.jsPanel-cal-forward').addEventListener('click', function (e) {
        e.preventDefault();
        var count = jsPanel.datepicker.keyValue || 1;
        container.fill(moment(month.dataset.date).add(count, 'months'));
        container.deselectAllDays();
        container.restoreSelections();
      }); // handler to reset to current month

      container.querySelector('.jsPanel-cal-sub.jsPanel-cal-reset').addEventListener('click', function (e) {
        e.preventDefault();
        container.fill(moment());
        container.deselectAllDays();
        container.restoreSelections();
      }); // handler to clear all selections (incl. container.selectedDays/container.selectedRange)

      container.querySelector('.jsPanel-cal-sub.jsPanel-cal-clear').addEventListener('click', function (e) {
        e.preventDefault();
        container.deselectAllDays();
        container.selectedDays.clear();
        container.selectedRange.clear();
      });
      /**
       * CLICK ON A DAY
       * MEANS SELECTION/DESELECTION OF SINGLE OR MULTIPLE DAYS; NO RANGES
       */

      wrapper.addEventListener('click', function (e) {
        e.preventDefault();
        var target = e.target,
            altKey = e.altKey,
            ctrlKey = e.ctrlKey,
            shiftKey = e.shiftKey;

        if (target.classList.contains('day')) {
          // check whether day is already selected
          var selected = target.classList.contains('selected');
          /**
           * IF NO MODIFIER KEY IS PRESSED
           */

          if (!ctrlKey && !shiftKey && !altKey) {
            // unselect all selected days and clear container.selectedDays
            container.deselectAllDays();
            container.selectedDays.clear(); // select/unselect day depending on let selected

            if (selected) {
              target.classList.remove('selected');
            } else {
              target.classList.add('selected');
              container.selectedDays.add(target.dataset.date);
            }
          } else if (!altKey && ctrlKey && !shiftKey) {
            /**
             * IF CTRL KEY IS PRESSED
             */
            container.selectedRange.clear();
            wrapper.querySelectorAll('.day').forEach(function (item) {
              if (item.classList.contains('selected') && item.classList.contains('range')) {
                item.classList.remove('range', 'selected');
              }
            }); // select/unselect day depending on let selected

            if (selected) {
              target.classList.remove('selected');
              container.selectedDays["delete"](target.dataset.date);
            } else {
              target.classList.add('selected');
              container.selectedDays.add(target.dataset.date);
            }
          } // custom callback


          if (opts.ondateselect && typeof opts.ondateselect === 'function') {
            var date = moment(target.dataset.date);
            opts.ondateselect.call(container, container, date, e);
          }
        }
      });
      /**
       * POINTERDOWN HANDLER TO STARTING A RANGE SELECTION
       */

      var rangeSelectionStarted;
      wrapper.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        var target = e.target,
            altKey = e.altKey,
            ctrlKey = e.ctrlKey,
            shiftKey = e.shiftKey;
        var start = Number(e.target.dataset.day),
            current = Number(e.target.dataset.day),
            range = [start, start]; // array items must be numbers

        var calcRange = function calcRange(e) {
          e.preventDefault();
          rangeSelectionStarted = true;

          if (container.selectedDays.size) {
            container.selectedDays.clear();
          } // build range array and sort it


          if (e.target.dataset.day) {
            current = Number(e.target.dataset.day);
            range = [start, current].sort(function (a, b) {
              return a - b;
            });
          } // add needed classes to selected range


          wrapper.querySelectorAll('.day').forEach(function (item) {
            var nr = Number(item.dataset.day);

            if (nr < range[0] || nr > range[1]) {
              item.classList.remove('selected', 'range');
            } else {
              item.classList.add('selected', 'range');
            }
          }); // build range string for container.selectedRange

          container.selectedRange.clear();
          container.selectedRange.add(wrapper.querySelector(".day-".concat(range[0])).dataset.date + '/' + wrapper.querySelector(".day-".concat(range[1])).dataset.date);
        }; // if pointerdown is on a day and Shift key is pressed


        if (target.classList.contains('day') && !altKey && !ctrlKey && shiftKey) {
          wrapper.addEventListener('pointermove', calcRange);
          wrapper.addEventListener('pointerup', function () {
            wrapper.removeEventListener('pointermove', calcRange);
          });
        }
      });
      wrapper.addEventListener('pointerup', function (e) {
        if (rangeSelectionStarted) {
          if (opts.onrangeselect && typeof opts.onrangeselect === 'function') {
            opts.onrangeselect.call(container, container, container.selectedRange, e);
            rangeSelectionStarted = undefined;
          }
        }

        rangeSelectionStarted = undefined;
      });
      return container;
    }
  }; // jsPanel.datepicker.keyValue is set to the value of the pressed key while key is down and if key's value is between 1 and 9

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
