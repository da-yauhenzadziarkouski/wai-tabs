// @ts-check

import {
  noop
} from "./utils/base.js"


import {
  setAttribute,
  getAttribute,
  toggleTabIndex
} from "./utils/dom.js"


/**
 * A node with role="tablist" or a different one
 * when a custom selector was specified
 *
 * @typedef {HTMLElement} Wrapper
 */


/**
 * A tab node
 *
 * @typedef {HTMLElement} NavItem
 */


/**
 * An array of navigation items
 *
 * @typedef {NavItem[]} NavItems
 */


/**
 * A tab panel node
 *
 * @typedef {HTMLElement} Pane
 */


/**
 * An array of tab panels
 *
 * @typedef {(Pane | null)[]} Panes
 */


/**
 * Defines the tabs navigation direction in order
 * to handle keydown event correctly
 *
 * @typedef {"horizontal" | "vertical"} Layout
 * @default "horizontal"
 */


/**
 * @template T
 * @typedef {(navItemIndex: number, event: T) => void} Callback
 * @returns {void}
 */


/**
 * A common callback - fires on tab select
 *
 * @typedef {Callback<MouseEvent | KeyboardEvent>} OnSelect
 */


/**
 * Fires after the tab got focus by using Tab key
 *
 * @typedef {Callback<KeyboardEvent>} OnTabFocus
 */


/**
 * @method
 * @typedef {Function}        SelectTab
 * @param   {number | string} index
 * @returns {void}
 */


/**
 * @typedef {Function} GetIndex
 * @returns {number}   index
 */


/**
 * A separate tabs instance
 *
 * @typedef  {Object}       Instance
 * @property {Wrapper}      wrapper
 * @property {NavItems}     navItems
 * @property {Panes}        panes
 * @property {Layout}       layout
 * @property {GetIndex}     getIndex
 * @property {SelectTab}    selectTab
 */


/**
 * @callback UseInstance
 * @param   {Instance} instance
 * @returns {({ onSelect?: OnSelect, onTabKeyFocus?: OnTabFocus }) | void}
 */


/**
 * @type    {Function} togglePaneAttributes
 * @param   {Pane}     pane
 * @param   {boolean}  isActive
 * @returns {void}
 */
const togglePaneAttributes = (pane, isActive) => {
  toggleTabIndex(pane, isActive)
  setAttribute(pane, "aria-hidden", (!isActive).toString())
}


/**
 * @type    {Function} toggleNavItemAttributes
 * @param   {NavItem}  navItem
 * @param   {boolean}  isActive
 * @returns {void}
 */
const toggleNavItemAttributes = (navItem, isActive) => {
  toggleTabIndex(navItem, isActive)
  setAttribute(navItem, "aria-selected", isActive.toString())
}


/**
 * @type    {Function} switchTabs
 * @param   {NavItems} navItems
 * @param   {Panes}    panes
 * @param   {number}   currentIndex
 * @returns {void}
 */
const switchTabs = (navItems, panes, currentIndex) => {
  /** @type {NavItem} currentNavItem */
  const currentNavItem = navItems[currentIndex]

  /** @type {Pane | null} associatedPane */
  const associatedPane = panes[currentIndex]

  navItems.forEach((item) => toggleNavItemAttributes(item, item === currentNavItem))
  panes.forEach((pane) => togglePaneAttributes(pane, pane === associatedPane))
}


/**
 * @typedef {Function}      handleKeyboardEvents
 * @param   {Wrapper}       tablist
 * @param   {NavItems}      navItems
 * @param   {Layout}        layout
 * @param   {number}        initialIndex
 * @param   {OnTabFocus}    onTabFocus
 * @param   {SelectTab}     selectTab
 * @param   {OnSelect}      onSelect
 * @returns {(i: number) => void} setTabFocus
 */
const handleKeyboardEvents = (
  tablist,
  navItems,
  layout,
  initialIndex,
  onTabFocus,
  selectTab,
  onSelect
) => {
  let index = initialIndex
  const itemsCount = navItems.length - 1

  const KEYS = [
    ...(
      layout === "vertical"
        ? ["ArrowUp", "ArrowDown"]
        : ["ArrowLeft", "ArrowRight"]
    ),
    ...["Home", "End"]
  ]

  /**
   * @type  {Function}      preventDefault
   * @param {KeyboardEvent} event
   */
  const preventDefault = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  /**
   * @typedef  {Function}      switchAfterFocus
   * @param    {KeyboardEvent} event
   * @listens  KeyboardEvent
   * @returns  {void}
   */
  const switchAfterFocus = (event) => {
    if (["Enter", "Space"].includes(event.code)) {
      preventDefault(event)

      selectTab(index)
      onSelect(index, event)
    }
  }

  tablist.addEventListener("keydown", (event) => {
    if (KEYS.includes(event.key)) {
      preventDefault(event)

      toggleTabIndex(navItems[index], false)

      switch (event.key) {
        case KEYS[0]:
          index--
          if (index < 0) {
            index = itemsCount
          }
          break
        case KEYS[1]:
          index++
          if (index > itemsCount) {
            index = 0
          }
          break
        case KEYS[2]:
          index = 0
          break
        case KEYS[3]:
          index = itemsCount
          break
      }

      const currentNavItem = navItems[index]

      toggleTabIndex(currentNavItem, true)
      currentNavItem.focus({ preventScroll: true })

      onTabFocus(index, event)
    }
  })

  navItems.forEach((navItem) => {
    if (navItem.tagName !== "BUTTON") {
      navItem.addEventListener("keydown", switchAfterFocus)
    }
  })

  return (i) => { index = i }
}


/**
 * @typedef {Function}  handleClickEvents
 * @param   {NavItems}  navItems
 * @param   {SelectTab} selectTab
 * @param   {(i: number) => void}  setTabFocus
 * @param   {OnSelect}  onSelect
 *
 */
const handleClickEvents = (navItems, selectTab, setTabFocus, onSelect) => {
  navItems.forEach((navItem, navItemIndex) => {
    navItem.addEventListener("click", (event) => {
      selectTab(navItemIndex)
      setTabFocus(navItemIndex)
      onSelect(navItemIndex, event)
    })
  })
}


/**
 * @typedef {Function}           GetLayout
 * @param   {HTMLElement | null} el
 * @param   {Layout}             defaultLayout
 * @returns {Layout}
 */
const getLayout = (el, defaultLayout = "horizontal") => {
  if (el) {
    return (/** @type {Layout | null} */ (getAttribute(el, "aria-orientation"))) || defaultLayout
  }

  return defaultLayout
}


/**
 * A simple Tabs widget skeleton, build with accessibility in mind
 * - on top of 'tabindex', 'aria-*' and 'role' attributes
 *
 * @class
 * @version  0.0.1
 * @author   Yauhen Zadziarkouski - https://github.com/da-yauhenzadziarkouski
 * @license  MIT
 */
export default class WAItabs {
  /** @member {string} [customSelector] */
  customSelector

  /** @param {string} [selector] */
  constructor(selector) {
    if (typeof selector === "string") {
      this.customSelector = selector
    }
  }

  /**
   * @member  mount
   * @param   {UseInstance} [useInstance] A custom function that may return widget callbacks
   * @returns {Instance[]}  All tabs instances on the page
   */
  mount = function(useInstance) {
    /** @type {Instance[]} instances */
    const instances = []

    const DEFAULT_SELECTOR = '[role="tablist"]'

    document.querySelectorAll(this.customSelector || DEFAULT_SELECTOR)
      .forEach((/** @type {Wrapper} */ wrapper) => {
        /** @type {NavItems} navItems */
        const navItems = Array.from(wrapper.querySelectorAll('[role="tab"]'))

        /** @type {Panes} panes */
        const panes = navItems.map((navItem) => {
          const id = getAttribute(navItem, "aria-controls")
          return id && document.getElementById(id) || null
        })

        /** @type {number} index */
        let index = navItems.findIndex((navItem) => getAttribute(navItem, "aria-selected") === "true")

        /** @type {(i: number) => void} setIndex */
        const setIndex = (i) => { index = i }

        /** @type {() => number} getIndex */
        const getIndex = () => index

        /** @type {SelectTab} _selectTab */
        const _selectTab = (/** @type {number} */ i) => {
          if (i !== index) {
            setIndex(i)
            switchTabs(navItems, panes, i)
          }
        }

        /** @type {Wrapper} tabList */
        const tabList = this.customSelector
          ? (wrapper.querySelector(DEFAULT_SELECTOR) || wrapper)
          : wrapper

        /** @type {Layout} layout */
        const layout = getLayout(tabList)

        let _onSelect

        const instance = {
          wrapper,
          navItems,
          panes,
          layout,
          getIndex,
          selectTab: (/** @type {number | string} index */ index) => {
            const i = Number(index)
            _selectTab(i)
            _onSelect(i)
          }
        }

        const {
          onSelect = noop,
          onTabKeyFocus = noop
        } = typeof useInstance === "function" ? (useInstance(instance) || {}) : {}

        _onSelect = onSelect

        const setTabFocus = handleKeyboardEvents(
          tabList,
          navItems,
          layout,
          index,
          onTabKeyFocus,
          _selectTab,
          onSelect,
        )

        handleClickEvents(
          navItems,
          _selectTab,
          setTabFocus,
          onSelect,
        )

        instances.push(instance)
      })

    return instances
  }
}
