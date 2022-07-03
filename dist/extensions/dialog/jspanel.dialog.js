/**
 * jsPanel - A JavaScript library to create highly configurable multifunctional floating panels that can also be used as modal, tooltip, hint or contextmenu
 * @version v4.16.0
 * @homepage https://jspanel.de/
 * @license MIT
 * @author Stefan Sträßer - info@jspanel.de
 * @author of dialog extension: Michael Daumling - michael@terrapinlogo.com
 * @github https://github.com/Flyer53/jsPanel4.git
 */

'use strict';
if (!jsPanel.dialog) {
	jsPanel.dialog = {
		version: '1.0.0',
		date: '2022-04-25 10:00',
		defaults: {
			theme: "none", 
			header: false,
			position: {my:'center-top', at:'center-top', offsetY: 30},
			contentSize: "auto",
			onwindowresize: true,
			closeOnEscape: false,
			closeOnBackdrop: false,
			oninitialize: []
		},
		// You can wrap dialogs into this <template> tag to prevent them from rendering
		dialogTemplateId: "#dialogs",
		// CSS classes
		css: {
			// primary button
			primaryBtn: "blue",
			// all other buttons
			otherBtn: "white",
			// the button bar
			buttonBar: "buttonbar",
			// the input field in the prompt() alert
			promptInput: "prompt-input"
		},
		// The vertical offset for child dialogs
		offsetY: 30,

		/**
		 * Display a modal dialog. The html may either be a selector (whose content
		 * is deep-cloned), a HTML string, a HTMLElement (deep-cloned), or a simple
		 * string, which is wrapped in a <span> tag. Since existing HTML is cloned,
		 * you should not use IDs in that HTML, because these IDs will occur twice
		 * as long as the dialog exists.
		 * 
		 * You can also wrap your dialogs in a <template> tag, which keeps them from
		 * being rendered. The ID of that tag is stored in jsPanel.dialog.templateId
		 * (the default is "dialogs"). When you do this, you are also free to use
		 * HTML IDs if required.
		 * 
		 * To initialize the dialog, use either the "callback" option, which is called
		 * synchronously during the creation of the panel, or use the "oninitialize" 
		 * option, which takes a function or an array of functions as usual. This 
		 * callback is called after the panel has been created, so it is safe to e.g. 
		 * display alerts inside the function. 
		 * 
		 * The modal's value is the dialog value (see makeDialog() below).
		 * 
		 * @param {string|HTMLElement} html (a selector, a HTML string, or the HTML itself)
		 * @param {Object} options 
		 * @returns {*} any value returned by a handler, or the value of the last clicked element
		 */
		async modal(html, options = {}) {
			html = this.helpers.getHTML(html);
			options = Object.assign({}, this.defaults, options);
			options.content = html;
			const prev = this.active;
			if (prev) {
				options.position = Object.assign({}, options.position);
				options.position.offsetY = prev.options.position.offsetY + this.offsetY;
			}
			options.css = { panel: "jsPanel-dialog" };
			for (let cls of ["dialog-sm", "dialog-md", "dialog-lg", "dialog-xl"]) {
				if (!html.classList.contains(cls))
					continue;
				html.classList.remove(cls);
				options.css.panel += " " + cls;
				break;
			}
			// Make sure that the callback function is an array
			if (!options.callback)
				options.callback = [];
			else if (typeof options.callback === "function")
				options.callback = [options.callback];
			options.callback.unshift(panel => {
				panel.makeDialog();
				if (this.helpers.all.length)
					// Move a previous modal dialog into the background
					this.helpers.all[0].classList.add("background");
				this.helpers.all.unshift(panel);
			});
			document.addEventListener("jspanelloaded", ev => {
				if (ev.panel.options.oninitialize)
					jsPanel.processCallbacks(ev.panel, ev.panel.options.oninitialize, "every");
			}, { once: true });
			const panel = jsPanel.modal.create(options);
			panel.resize({height: 'auto'});
			return new Promise(resolve => {
				panel.options.onclosed.push(panel => {
					this.helpers.all.shift();
					if (this.helpers.all.length)
						this.helpers.all[0].classList.remove("background");
					const value = panel.dialog.value;
					panel.dialog.value = undefined;
					resolve(value);
				});
			});
		},
		/**
		 * Return the currently active modal dialog.
		 */
		get active() {
			return this.helpers.all[0];
		},

		/**
		 * Return the number of open dialogs.
		 */
		get depth() {
			return this.helpers.all.length;
		},

		/**
		 * Force-close all active dialogs.
		 */
		closeAll() {
			while (this.helpers.all.length) {
				const len = this.helpers.all.length;
				this.helpers.all[0].close();
				if (this.helpers.all.length === len)
					// close refused
					return;
			}
			// sometimes, there seems to bea leftover backdrop
			for (let el of document.querySelectorAll(".jsPanel-modal.background"))
				el.remove();
		},

		/**
		 * Display a message box with the given list of buttons.
		 * If there is no button, create an OK button. The buttons array
		 * is either a list of labels, or objects with these properties:
		 * label - the label
		 * value - the value for panel.dialog.value when clicked (opt)
		 * name - the name of the button if they are accessed ba name (opt)
		 * css - any CSS classes for the button
		 * 
		 * @param {string|Node} msg (can be a string, a HTML string, or HTML)
		 * @param {Array} buttons 
		 * @param {Object} options
		 * @returns {string} the button value
		 */
		async alert(msg, buttons = ["OK"], options = {}) {
			msg = this.helpers.getHTML(msg);
			if (!buttons.length)
				buttons.push("OK");
			msg.append(this.helpers.buttonBar(buttons));
			return this.modal(msg, options);
		},

		/**
		 * Display a Confirm (Yes/No) box. If no is true, No is set as the default.
		 * 
		 * @param {string} msg the message
		 * @param {bool} no if true, No is preselected
		 * @param {Array} moreButtons any extra buttons (see jsPanel.dialog.alert())
		 * @param {Object} options
		 * @returns {bool}
		 */
		async confirm(msg, no = false, moreButtons = [], options = {}) {
			const y = { label: "Yes", value: "true" };
			const n = { label: "No", value: "false" };
			let btns = no ? [n, y] : [y, n];
			btns = btns.concat(moreButtons);
			return await this.alert(msg, btns, options) === "true";
		},

		/**
		 * Display a prompt box with a message and an input field, with an optional
		 * preset. Either returns the content of the input field or null.
		 * @param {String} msg
		 * @param {String} preset
		 * @param {Object} options
		 * @returns {string|null}
		 */
		async prompt(msg, preset = "", options = {}) {
			msg = this.helpers.getHTML(`<div>${msg}</div>`);
			const div = document.createElement("div");
			if (msg instanceof DocumentFragment) {
				for (let el = msg.firstChild; el; el = el.nextSibling)
					div.append(msg);
			}
			else
				div.append(msg);
			const input = jsPanel.strToHtml(`<input name="input" type="text" class="${this.css.promptInput}" value="${preset}"/>`);
			div.append(input.firstElementChild);
			div.append(this.helpers.buttonBar(["OK", "Cancel"]));
			options = Object.assign({
				onclick_OK: panel => panel.dialog.value = panel.dialog.values.input,
				onclick_Cancel: async panel => panel.dialog.value = null
			}, options);
			return await this.modal(div, options);
		},

		helpers: {
			// All open modal dialogs
			all: [],
			/**
			 * Create HTML for the given buttons array. Each element is an object with 
			 * label and value. The buttons are dismiss buttons. The only button (or 
			 * the second button) is marked as the Cancel button that acts on the Esc 
			 * key. We also have the "css" property that, optionally, defines button 
			 * css classes, and a "name" property if the button should be named.
			 * 
			 * If the array element is just a string, name and value are set to that string.
			 * 
			 * @param {Array} buttons 
			 * @returns {HTMLElement}
			 */
			buttonBar(buttons) {
				const div = document.createElement("div");
				div.classList.add(jsPanel.dialog.css.buttonBar);
				let html = "";
				for (let [i, btn] of buttons.map(b => (typeof b === "string") ? { label:b,name:b,value:b} : b).entries()) {
					let {label, value, css, name} = btn;
					const classDefs = jsPanel.dialog.css;
					if (!css)
						css = i ? classDefs.otherBtn : classDefs.primaryBtn;
					let cancel = "";
					name = name ? `name="${name}"` : "";
					switch (i) {
						case 0: 
							if (buttons.length === 1)
								cancel = " data-cancel";
							break;
						case 1:
							cancel = " data-cancel";
							break;
					}
					html += `<button data-dismiss ${name} ${cancel} class="${css}" value="${value}">${label}</button>`;
				}
				div.innerHTML = html;
				return div;
			},

			/**
			 * Get the HTML to display - see modal() above and make sure it is visible.
			 * @param {Node|string} html 
			 * @returns {Node}
			 */
			getHTML(html) {
				if (!(html instanceof Node)) {
					html = html.toString().trim();
					try {
						let el = document.querySelector(html);
						if (!el) {
							const tpl = document.querySelector(jsPanel.dialog.dialogTemplateId);
							if (tpl)
								el = tpl.content.querySelector(html);
						}
						if (el)
							html = el.cloneNode(true);
						else
							html = jsPanel.strToHtml("<span>" + html + "</span>");
					}
					catch (e) {
						html = jsPanel.strToHtml(html.toString().trim());
					}
				}
				if (html instanceof DocumentFragment) {
					// convert a DocumentFragment to a div, because the former cannot have CSS
					let div = document.createElement("div");
					for (let node of html.childNodes)
						div.append(node);
					return div;
				}
				if (html instanceof HTMLElement)
					// ensure its visibility
					html.style.display = "";
				return html;	
			},

			/**
			 * Get the value of an element.
			 * 
			 * The values are:
			 * radio buttons: the value of the selected button
			 * checkboxes: true or false
			 * text etc: the text
			 * elements with a "value" property: the value of that property
			 * everything else: the inner HTML
			 * 
			 * @param {jsPanel} panel
			 * @param {HTMLElement} element
			 * @param {bool} returnHTML - false to return undefined for no value
			 */
			getValue(panel, el, returnHTML = true) {
				switch (el.getAttribute("type"))
				{
					case "radio":
						const name = el.getAttribute("name");
						const radio = panel.querySelector(`[name="${name}"]:checked`);
						return radio ? radio.value : "";
					case "checkbox":
						return el.checked;
					default:
						if ("value" in el)
							return el.value;
						else if (el.hasAttribute("value"))
							return el.getAttribute("value");
						else if (returnHTML)
							return el.innerHTML;
				}
			},
			/**
			 * Set the value of an element.
			 * 
			 * The values are:
			 * radio buttons: the value of the selected button
			 * checkboxes: true or false
			 * text etc: the text
			 * elements with a "value" property: the value of that property
			 * everything else: the inner HTML (lets you set content)
			 * 
			 * @param {jsPanel} panel
			 * @param {HTMLElement} element
			 * @param {*} value
			 */
			setValue(panel, el, value) {
				switch(el.getAttribute("type")) {
					case "radio":
						const name = el.getAttribute("name");
						const radio = panel.querySelector(`[name="${name}"][value="${value}"]`);
						if (radio)
							radio.checked = true; 
						break;
					case "checkbox": 
						el.checked = value; 
						break;
					default:
						if ("value" in el)
							el.value = value;
						else if (el.hasAttribute("value"))
							el.setAttribute("value", value.toString());
						else
							el.innerHTML = value.toString();
				}
			}
		}
	};

	document.addEventListener("click", ev => {
		// handle all clicks on elements without a "name" property;
		// elements with a "name" property are handled in jsPanel.makeDialog()
		let el = ev.target.closest("[data-dismiss]");
		if (!el)
			return;
		let panel = el.closest(".jsPanel");
		if (!panel)
			return;
		if (el.click)
			el.click();
		if (panel.parentElement)
			panel.close();
	});

/*	window.addEventListener("resize", ev => {
		for (let panel of jsPanel.dialog.helpers.all)
			panel.reposition();
	});
*/
	jsPanel.extend({
		/**
		 * Extend any jsPanel to act as a dialog.
		 * 
		 * Elements of this panel can have several additional attributes:
		 * 
		 * The "name" attribute is well-known from forms. Actually, you can set this
		 * attribute at any element. Elements with a "name" attribute have
		 * several advantages:
		 * 
		 * The panel property "dialog.elements" refers any elements with a "name"
		 * attribute. For example, if you have a textfield with name="user", you
		 * can access that element as panel.dialog.elements.user. If multiple elements
		 * share the same value, the value of this property is a NodeList.
		 * 
		 * The panel property "dialog.values" permits direct access to an element's
		 * value. In the above example, panel.dialog.values.user gets and sets the
		 * text of that element. If the element does not have a direct value, you
		 * can define a value with the "value" attribute. If the element does not
		 * have a "value" attribute, you can get and set the element's inner HTML
		 * this way.
		 * 
		 * The "data-dismiss" attribute causes the panel to be closed when that element
		 * is clicked.
		 * 
		 * The "data-cancel" attribute causes the element to respond to the "Escape"
		 * key. Note that the closeOnEscape option is not used; instead, an own event
		 * listener handles the Escape key, because the closeOnEscape option closes 
		 * just any panel that happens to return true in the handler, which is not 
		 * desirable in a dialog environment.
		 * 
		 * The "data-dblclick" causes the element to respond to a double click as
		 * if it was clicked.
		 * 
		 * The panel options can define several handlers for elements. Each handler
		 * starts with either "onclick_" for clicks, or "oninput_" for changes to
		 * a text element, followed by the element's name, like e.g. "oninput_user".
		 * It is fine to call panel.close() in a handler.
		 * 
		 * All handlers can set a value by setting panel.dialog.value. If a modal
		 * dialog was created, the return value of the await statement is that
		 * value. If no handler was defined for a clicked element, the element's "value" 
		 * attribute is set as the dialog value. Inside a handler, you can, of course,
		 * read panel.dialog.value.
		 */
		makeDialog() {
			this.dialog = {
				elements: new jsPanelDialogElements(this),
				values: new jsPanelDialogValues(this),
				value: undefined
			};
			const cb = async ev => {
				let el = ev.target.closest("[name]");
				ev.stopPropagation();
				if (el) {
					const name = el ? el.getAttribute("name") : "";
					const cbName = `on${ev.type}_${name}`;
					if (this.options[cbName])
						jsPanel.processCallbacks(this, this.options[cbName], "every", el, ev);
				}
				else
					el = ev.target;
				if (el.hasAttribute("data-dismiss") && this.parentElement) {
					// grab any value if not set yet
					if (this.dialog.value === undefined)
						this.dialog.value = jsPanel.dialog.helpers.getValue(this, el, false);
					this.close();
				}
			};
			this.addEventListener("click", cb);
			this.addEventListener("input", cb);
			this.addEventListener("dblclick", ev => {
				const el = this.querySelector("[data-dblclick]");
				if (el) {
					ev.stopPropagation();
					el.click();
				}
			});
			this.options.closeOnEscape = _ => {
				// Trigger a data-cancel element if present
				const el = this.querySelector("[data-cancel]");
				if (el)
					el.click();
				return false;
			}
		}
	});

	/**
	 * This class acts as a proxy for all dialog elements with either
	 * a "name" attribute or a "data-name" attribute. You can address
	 * such an element with panel.dialog.values.xxx, where xxx is the
	 * element's name.
	 * 
	 * The object is enumerable; you may walk over the object with the
	 * usual helpers. If multiple elements have the same name, the getter
	 * returns an array; otherwiese, it returns the HTMLElement or null.
	 */
	class jsPanelDialogElements {
		constructor(panel) {
			for (let el of panel.querySelectorAll("[name],[data-name]")) {
				const name = el.getAttribute("name") || el.getAttribute("data-name");
				if (this.hasOwnProperty(name))
					continue;
				Object.defineProperty(this, name, {
					enumerable: true,
					get() {
						const result = panel.querySelectorAll(`[name="${name}"],[data-name="${name}"]`);
						return result.length <= 1 ? result[0] : result;
					}
				});
			}
			Object.seal(this);
		}
		/**
		 * Retrieve an object with key/value pairs for all elements. This
		 * is more versatile than using a FormData object, because it can
		 * also contain numbers, booleans etc.
		 */
		get() {
			const obj = {};
			for (let [name, value] of Object.entries(this))
				obj[name] = value;
			return obj;
		}
	}

	/**
	 * This class acts as a proxy for all dialog elements with 
	 * a "name" attribute. You can address such an element's value with 
	 * panel.dialog.values.xxx, where xxx is the element's name. 
	 * 
	 * The values are:
	 * radio buttons: the value of the selected button
	 * checkboxes: true or false
	 * text etc: the text
	 * elements with a "value" property: the value of that property
	 * everything else: the inner HTML (lets you set content)
	 * 
	 * The object is enumerable; you may walk over the object with the
	 * usual helpers. 
	 * 
	 * If multiple elements have the same name, only the first element
	 * is affected, except for radio buttons.
	 */
	class jsPanelDialogValues {
		constructor(panel) {
			for (let el of panel.querySelectorAll("[name]")) {
				const name = el.getAttribute("name");
				if (this.hasOwnProperty(name))
					continue;
				const type = (el.getAttribute("type") || "").toLowerCase();
				Object.defineProperty(this, name, {
					enumerable: true,
					get() { return jsPanel.dialog.helpers.getValue(panel, el); },
					set(value) { jsPanel.dialog.helpers.setValue(panel, el, value); }
				});
			}
			Object.seal(this);
		}

		/**
		 * Retrieve an object with key/value pairs for all elements. This
		 * is more versatile than using a FormData object, because it can
		 * also contain numbers, booleans etc.
		 */
		get() {
			const obj = {};
			for (let [name, value] of Object.entries(this))
				obj[name] = value;
			return obj;
		}
		/**
		 * Use an object with key/value pairs to set element values.
		 * 
		 * @param {Object} obj
		 */
		set(obj) {
			for (let [name, value] of Object.entries(obj))
				this[name] = value;
		}
	}
}


// Add CommonJS module exports, so it can be imported using require() in Node.js
// https://nodejs.org/docs/latest/api/modules.html
if (typeof module !== 'undefined') { module.exports = jsPanel; }
