export type setAttribute = Function;
export function setAttribute(el: HTMLElement, attr: string, value: string): void;
export type getAttribute = Function;
export function getAttribute(el: HTMLElement, attr: string): string | null;
/**
 * @type    {Function}           toggleTabIndex
 * @param   {HTMLElement | null} el
 * @param   {boolean}            isFocusable
 * @returns {void}
 */
export const toggleTabIndex: Function;
