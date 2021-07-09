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
 * requires moment.js < https://momentjs.com/ > to be loaded prior this extension
 */

// TODO: - cancelable events dateselect, rangeselect, selectionclear, etc. ??
//       - alternative way to select a range, e.g start by Alt+Click end end by another Alt-Click ??
//       - make dates not selectable and mark them accordingly ??
//       - load list of days to highlight somehow (e.g. holidays)

if (!jsPanel.datepicker) {
    // add some icons for the datepicker controls
    jsPanel.icons.chevronLeft =  `<svg focusable="false" class="jsPanel-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g transform="matrix(6.12323e-17,-1,1,6.12323e-17,0.0375,22.0375)"><path fill="currentColor" d="M2.1,15.2L2.9,16C3.1,16.2 3.4,16.2 3.6,16L11,8.7L18.4,16C18.6,16.2 18.9,16.2 19.1,16L19.9,15.2C20.1,15 20.1,14.7 19.9,14.5L11.3,6C11.1,5.8 10.8,5.8 10.6,6L2.1,14.5C2,14.7 2,15 2.1,15.2Z"/></g></svg>`;
    jsPanel.icons.chevronRight = `<svg focusable="false" class="jsPanel-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g transform="matrix(6.12323e-17,1,-1,6.12323e-17,22.0375,-0.0375)"><path fill="currentColor" d="M2.1,15.2L2.9,16C3.1,16.2 3.4,16.2 3.6,16L11,8.7L18.4,16C18.6,16.2 18.9,16.2 19.1,16L19.9,15.2C20.1,15 20.1,14.7 19.9,14.5L11.3,6C11.1,5.8 10.8,5.8 10.6,6L2.1,14.5C2,14.7 2,15 2.1,15.2Z"/></g></svg>`;
    jsPanel.icons.square =       `<svg focusable="false" class="jsPanel-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g transform="matrix(0.0401786,0,0,0.0401786,2,0.714286)"><path fill="currentColor" d="M400,32L48,32C21.5,32 0,53.5 0,80L0,432C0,458.5 21.5,480 48,480L400,480C426.5,480 448,458.5 448,432L448,80C448,53.5 426.5,32 400,32ZM394,432L54,432C50.7,432 48,429.3 48,426L48,86C48,82.7 50.7,80 54,80L394,80C397.3,80 400,82.7 400,86L400,426C400,429.3 397.3,432 394,432Z"/></g></svg>`;
    jsPanel.icons.undo =         `<svg focusable="false" class="jsPanel-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g transform="matrix(2.18687e-18,0.0357143,-0.0357143,2.18687e-18,20.1429,2)"><path fill="currentColor" d="M12,8L39.711,8C46.45,8 51.868,13.548 51.708,20.286L49.361,118.854C93.925,51.834 170.212,7.73 256.793,8.001C393.18,8.428 504.213,120.009 504,256.396C503.786,393.181 392.835,504 256,504C192.074,504 133.798,479.813 89.822,440.092C84.709,435.474 84.468,427.531 89.34,422.659L109.078,402.921C113.576,398.423 120.831,398.136 125.579,402.369C160.213,433.246 205.895,452 256,452C364.322,452 452,364.338 452,256C452,147.678 364.338,60 256,60C176.455,60 108.059,107.282 77.325,175.302L203.714,172.293C210.451,172.133 216,177.55 216,184.29L216,212C216,218.627 210.627,224 204,224L12,224C5.373,224 0,218.627 0,212L0,20C0,13.373 5.373,8 12,8Z"/></g></svg>`;

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

    generateHTML() {
        let wrapper = document.createElement('div');
        wrapper.className = 'jsPanel-cal-wrapper';
        wrapper.innerHTML = `<div class="jsPanel-cal-sub jsPanel-cal-clear" title="Clear all selections">${jsPanel.icons.square}</div>
            <div class="jsPanel-cal-sub jsPanel-cal-back" title="Go back one month">${jsPanel.icons.chevronLeft}</div>
            <div class="jsPanel-cal-sub jsPanel-cal-month"></div>
            <div class="jsPanel-cal-sub jsPanel-cal-forward" title="Go forward one month">${jsPanel.icons.chevronRight}</div>
            <div class="jsPanel-cal-sub jsPanel-cal-reset" title="Reset to current month">${jsPanel.icons.undo}</div>
            <div class="jsPanel-cal-sub jsPanel-cal-blank3"></div>
            <div class="jsPanel-cal-sub day-name day-name-0"></div>
            <div class="jsPanel-cal-sub day-name day-name-1"></div>
            <div class="jsPanel-cal-sub day-name day-name-2"></div>
            <div class="jsPanel-cal-sub day-name day-name-3"></div>
            <div class="jsPanel-cal-sub day-name day-name-4"></div>
            <div class="jsPanel-cal-sub day-name day-name-5"></div>
            <div class="jsPanel-cal-sub day-name day-name-6"></div>`;
        for (let i = 0; i < 6; i++) {
            wrapper.innerHTML += `<div class="jsPanel-cal-sub week week-${i}"></div>`;
        }
        for (let i = 1; i < 43; i++) {
            wrapper.innerHTML += `<div class="jsPanel-cal-sub day day-${i}"></div>`;
            // ${i} is just a counter of days listed in the calendar, not a date value!
        }
        return wrapper;
    },

    // method to fill a month with data
    fillMonth(datepicker, startdate = moment()) {
        moment.locale(datepicker.options.locale); // set locale globally

        let now = moment(startdate) || moment(datepicker.options.startdate);
        now.locale(datepicker.options.locale);
        let month = now.month(), // returns number 0 to 11 where 0 is January
            firstDay = now.date(1).weekday(), // returns locale aware number 0 to 6 where 0 is either Sunday or Monday
            localeData = now.localeData();

        // fill selected month incl. year
        let monthBox = datepicker.querySelector('.jsPanel-cal-month');
        monthBox.innerHTML = now.format('MMMM YYYY');
        monthBox.dataset.date = now.format('YYYY-MM-DD');

        // fill day names (Mo, Tu, etc.) considering used locale
        let dayNames = datepicker.querySelectorAll('.jsPanel-cal-sub.day-name'),
            weekdays = localeData.weekdaysMin();
        if (localeData.firstDayOfWeek() === 1) {
            // week starts with Monday
            for (let i = 0, j = 1; i < 7; i++, j++) {
                dayNames[i].textContent = weekdays[j];
            }
            dayNames[6].textContent = weekdays[0];
            dayNames[5].classList.add('weekend');
            dayNames[6].classList.add('weekend');
        } else {
            for (let i = 0; i < 7; i++) {
                dayNames[i].textContent = weekdays[i];
            }
            dayNames[0].classList.add('weekend');
            dayNames[6].classList.add('weekend');
        }

        // fill dates
        let firstEntry = now.subtract(++firstDay, 'days');
        let days = datepicker.querySelectorAll('.jsPanel-cal-sub.day');
        for (let day of days) {
            day.classList.remove('today', 'notInMonth','selected', 'range', 'remove-border-radius-right', 'remove-border-radius-left');
            let value = firstEntry.add(1, 'days');
            day.textContent = value.format('D');
            day.dataset.date = now.format('YYYY-MM-DD');
            if (value.month() !== month) {
                day.classList.add('notInMonth');
            } else if (day.dataset.date === moment().format('YYYY-MM-DD')) {
                day.classList.add('today');
            }
        }

        // fill week numbers
        if (datepicker.options.showWeekNumbers) {
            datepicker.querySelectorAll('.jsPanel-cal-sub.week').forEach((week, index) => {
                week.textContent = moment(
                    datepicker.querySelector(`.jsPanel-cal-sub.day-${(index + 1) * 7}`).dataset.date
                ).week();
            });
        }
    },

    // deselect all days (remove .selected class; does not empty selectedDays/selectedRange)
    // do not empty selectedDays/selectedRange -> selection would be lost when clicking forward/back buttons
    deselectAllDays(container) {
        for (let day of container.querySelectorAll('.jsPanel-cal-sub.day')) {
            day.classList.remove('selected', 'range', 'remove-border-radius-right', 'remove-border-radius-left');
        }
    },

    // method to restore selected dates or range
    restoreSelections(container) {
        // restore selections of days
        let days = container.querySelectorAll('.jsPanel-cal-sub.day');
        for (let day of days) {
            if (container.selectedDays.has(day.dataset.date)) {
                day.classList.add('selected');
            }
        }
        // restore selection of a range
        if (container.selectedRange.size) {
            let rangeIterator = container.selectedRange.values();
            let rangeArray = rangeIterator.next().value.split('/');
            for (let day of days) {
                let date = day.dataset.date;
                if (date >= rangeArray[0] && date <= rangeArray[1]) {
                    day.classList.add('selected', 'range');
                    // remove border radius of dates between start and end
                    if (date === rangeArray[0]) {
                        day.classList.add('remove-border-radius-right');
                    } else if (date === rangeArray[1]) {
                        day.classList.add('remove-border-radius-left');
                    } else if (date > rangeArray[0] || date < rangeArray[1]) {
                        day.classList.add('remove-border-radius-right', 'remove-border-radius-left');
                    }
                }
            }
        }
    },

    create(container, options = {}) {
        container.style.display = 'flex';
        container.selectedDays = new Set();
        container.selectedRange = new Set();
        let opts = Object.assign({}, this.defaults, options);
        let wrapper;
        // fill container with monthly calendars according to option.months
        for (let i = 0; i < opts.months; i++) {
            wrapper = this.generateHTML();
            wrapper.options = opts;
            container.append(wrapper);
            // fill month with data
            this.fillMonth(wrapper, opts.startdate);
            // increase startdate 1 month for next calendar
            opts.startdate = moment(opts.startdate).add(1, 'months');
        }

        // add handlers for back, forward etc. buttons
        let pickers = container.querySelectorAll('.jsPanel-cal-wrapper');
        for (let picker of pickers) {
            // clear buttons
            for (let clearbtn of picker.querySelectorAll('.jsPanel-cal-clear')) {
                clearbtn.addEventListener('click', (e) => {
                    if (opts.onselectionclear && typeof opts.onselectionclear === 'function') {
                        opts.onselectionclear.call(container, container, e);
                    }
                    if (!e.defaultPrevented) {
                        jsPanel.datepicker.deselectAllDays(container);
                        container.selectedDays.clear();
                        container.selectedRange.clear();
                    }
                });
            }
            // back buttons
            for (let backbtn of picker.querySelectorAll('.jsPanel-cal-back')) {
                backbtn.addEventListener('click', () => {
                    // get all wrappers and decrease their date
                    for (let picker of pickers) {
                        let monthshown = picker.querySelector('.jsPanel-cal-month').dataset.date, // string like '2020-02-12'
                            monthwanted = moment(monthshown).subtract(1, 'months').format('YYYY-MM');
                        jsPanel.datepicker.fillMonth(picker, monthwanted);
                    }
                    jsPanel.datepicker.deselectAllDays(container);
                    jsPanel.datepicker.restoreSelections(container);
                });
            }
            // forward buttons
            for (let fwdbtn of picker.querySelectorAll('.jsPanel-cal-forward')) {
                fwdbtn.addEventListener('click', () => {
                    // get all wrappers and increase their date
                    for (let picker of pickers) {
                        let monthshown = picker.querySelector('.jsPanel-cal-month').dataset.date, // string like '2020-02-12'
                            monthwanted = moment(monthshown).add(1, 'months').format('YYYY-MM');
                        jsPanel.datepicker.fillMonth(picker, monthwanted);
                    }
                    jsPanel.datepicker.deselectAllDays(container);
                    jsPanel.datepicker.restoreSelections(container);
                });
            }
            // reset buttons
            for (let resetbtn of picker.querySelectorAll('.jsPanel-cal-reset')) {
                resetbtn.addEventListener('click', (e) => {
                    // get month shown of clicked picker
                    let picker = e.target.closest('.jsPanel-cal-wrapper'),
                        counter = 0;
                    while (picker.previousSibling) {
                        counter++;
                        picker = picker.previousSibling;
                    }
                    // counter is now the zero-based position of the clicked picker in the container
                    // get month for first picker in sequence
                    let month = moment().subtract(counter, 'months');
                    // reset each pickers month
                    for (let picker of pickers) {
                        jsPanel.datepicker.fillMonth(picker, month);
                        month = moment(month).add(1, 'months');
                    }
                    jsPanel.datepicker.deselectAllDays(container);
                    jsPanel.datepicker.restoreSelections(container);
                });
            }
        }

        /**
         * CLICK ON A DAY
         * MEANS SELECTION/DESELECTION OF SINGLE OR MULTIPLE DAYS; NO RANGES
         */
        container.addEventListener('click', e => {
            e.preventDefault();
            const target = e.target,
                altKey = e.altKey,
                ctrlKey = e.ctrlKey,
                shiftKey = e.shiftKey;

            if (target.classList.contains('day')) {
                // check whether day is already selected
                let selected = target.classList.contains('selected');
                let date = target.dataset.date;
                /**
                 * IF NO MODIFIER KEY IS PRESSED
                 */
                if (!ctrlKey && !shiftKey && !altKey) {
                    // unselect all selected days and clear container.selectedDays
                    jsPanel.datepicker.deselectAllDays(container);
                    container.selectedDays.clear();

                    // select/unselect day depending on let selected
                    if (selected) {
                        target.classList.remove('selected');
                    } else {
                        target.classList.add('selected');
                        // add selected day to storage
                        container.selectedDays.add(date);
                    }
                } else if (!altKey && ctrlKey && !shiftKey) {
                    /**
                     * IF CTRL KEY IS PRESSED
                     */
                    container.selectedRange.clear();
                    for (let day of container.querySelectorAll('.day')) {
                        if (day.classList.contains('selected') && day.classList.contains('range')) {
                            day.classList.remove('range', 'selected');

                        }
                    }
                    // select/unselect day depending on let selected
                    if (selected) {
                        target.classList.remove('selected');
                        // remove selected day from storage
                        container.selectedDays.delete(date);
                    } else {
                        target.classList.add('selected');
                        // add selected day to storage
                        container.selectedDays.add(date);
                    }
                }

                // custom callback
                if (opts.ondateselect && typeof opts.ondateselect === 'function') {
                    opts.ondateselect.call(container, container, date, e);
                }

            }
        });

        /**
         * POINTERDOWN HANDLER TO STARTING A RANGE SELECTION
         */
        let rangeSelectionStarted;
        container.addEventListener('pointerdown', e => {
            e.preventDefault();
            const target = e.target,
                altKey = e.altKey,
                ctrlKey = e.ctrlKey,
                shiftKey = e.shiftKey;
            let start = e.target.dataset.date,
                current = e.target.dataset.date,
                range = [start, start];

            let calcRange = e => {
                e.preventDefault();
                rangeSelectionStarted = true;

                if (container.selectedDays.size) {
                    container.selectedDays.clear();
                }
                // build range array and sort it
                if (e.target.classList.contains('day')) {
                    current = e.target.dataset.date;
                    range = [start, current].sort((a, b) => {
                        return moment(a).unix() - moment(b).unix(); // convert values to number for comparison
                    });
                }
                // add needed classes to selected range
                for (let day of container.querySelectorAll('.day')) {
                    let date = day.dataset.date;
                    day.classList.remove('remove-border-radius-right', 'remove-border-radius-left');
                    if (date < range[0] || date > range[1]) {
                        day.classList.remove('selected', 'range');
                    } else {
                        day.classList.add('selected', 'range');
                        // remove border radius of dates between start and end
                        if (date === range[0]) {
                            day.classList.add('remove-border-radius-right');
                        } else if (date === range[1]) {
                            day.classList.add('remove-border-radius-left');
                        } else if (date > range[0] || date < range[1]) {
                            day.classList.add('remove-border-radius-right', 'remove-border-radius-left');
                        }
                    }
                }

                // build range string for selectedRange
                container.selectedRange.clear();
                container.selectedRange.add(container.querySelector(`.day[data-date="${range[0]}"]`).dataset.date + '/' + container.querySelector(`.day[data-date="${range[1]}"]`).dataset.date);
            };

            // if pointerdown is on a day and Shift key is pressed
            if (target.classList.contains('day') && !altKey && !ctrlKey && shiftKey) {
                container.addEventListener('pointermove', calcRange);

                container.addEventListener('pointerup', () => {
                    container.removeEventListener('pointermove', calcRange);
                });
            }
        });
        container.addEventListener('pointerup', (e) => {
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
};

    // jsPanel.datepicker.keyValue is set to the value of the pressed number key while key is down and if key's value is between 1 and 9
    document.addEventListener('keydown', e => {
        if (e.key.match(/^[2-9]$/)) {
            jsPanel.datepicker.keyValue = e.key;
        } else if (e.key.match(/^1$/)) {
            jsPanel.datepicker.keyValue = 12;
        }
    });
    document.addEventListener('keyup', () => {
        jsPanel.datepicker.keyValue = undefined;
    });
}
