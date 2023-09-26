// @ts-check

/**
 * @typedef {Function}      setAttribute
 * @param   {HTMLElement}   el
 * @param   {string}        attr
 * @param   {string}        value
 * @returns {void}
 */
export const setAttribute = (el, attr, value) => el.setAttribute(attr, value)


/**
 * @typedef {Function}      getAttribute
 * @param   {HTMLElement}   el
 * @param   {string}        attr
 * @returns {string | null}
 */
export const getAttribute = (el, attr) => el.getAttribute(attr)


/**
 * @type    {Function}           toggleTabIndex
 * @param   {HTMLElement | null} el
 * @param   {boolean}            isFocusable
 * @returns {void}
 */
export const toggleTabIndex = (el, isFocusable) => {
  if (el) {
    setAttribute(el, "tabindex", isFocusable ? "0" : "-1")
  }
}
