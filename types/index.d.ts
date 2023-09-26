/**
 * A simple Tabs widget skeleton, built with accessibility in mind
 * - on top of 'tabindex', 'aria-*' and 'role' attributes
 *
 * @class
 * @version  0.0.2
 * @author   Yauhen Zadziarkouski - https://github.com/da-yauhenzadziarkouski
 * @license  MIT
 */
export default class WAItabs {
    /** @param {string} [selector] */
    constructor(selector?: string);
    /** @member {string} [customSelector] */
    customSelector: any;
    /**
     * @member  mount
     * @param   {UseInstance} [useInstance] A custom function that may return widget callbacks
     * @returns {Instance[]}  All tabs instances on the page
     */
    mount: (useInstance?: UseInstance) => Instance[];
}
/**
 * A node with role="tablist" or a different one
 * when a custom selector was specified
 */
export type Wrapper = HTMLElement;
/**
 * A tab node
 */
export type NavItem = HTMLElement;
/**
 * An array of navigation items
 */
export type NavItems = HTMLElement[];
/**
 * A tab panel node
 */
export type Pane = HTMLElement;
/**
 * An array of tab panels
 */
export type Panes = HTMLElement[];
/**
 * Defines the tabs navigation direction in order
 * to handle keydown event correctly
 */
export type Layout = "horizontal" | "vertical";
export type Callback<T> = (navItemIndex: number, event: T) => void;
/**
 * A common callback - fires on tab select
 */
export type OnSelect = (navItemIndex: number, event: MouseEvent | KeyboardEvent) => void;
/**
 * Fires after the tab got focus by using Tab key
 */
export type OnTabFocus = (navItemIndex: number, event: KeyboardEvent) => void;
export type SelectTab = Function;
export type GetIndex = Function;
/**
 * A separate tabs instance
 */
export type Instance = {
    wrapper: Wrapper;
    navItems: HTMLElement[];
    panes: HTMLElement[];
    layout: Layout;
    getIndex: GetIndex;
    selectTab: SelectTab;
};
export type UseInstance = (instance: Instance) => ({
    onSelect?: OnSelect;
    onTabKeyFocus?: OnTabFocus;
}) | void;
export type handleKeyboardEvents = Function;
export type handleClickEvents = Function;
export type GetLayout = Function;
