/**
 * Constants and configuration
 */

import { ServerConfig } from '../models/ComponentDoc.js';

/**
 * Documentation pages (setup and styling guides)
 */
export const DOCUMENTATION_PAGES = {
  setup: ['installation'],
  styling: ['theming', 'icons', 'tailwind']
};

/**
 * All documentation page names (flattened)
 */
export const ALL_DOCUMENTATION_PAGES = Object.values(DOCUMENTATION_PAGES).flat();

/**
 * Pages that are not components and not documentation guides
 */
export const NON_COMPONENT_PAGES = [
  ...ALL_DOCUMENTATION_PAGES, // Include docs but handle separately
  'configuration', 'support', 'pro', 'playground', 'customicons',
  'templates', 'designer', 'filterservice', 'lts', 'team', 'roadmap',
  'contribution', 'chart', 'classnames', 'uikit', 'guides'
];

/**
 * Default server configuration
 */
export const DEFAULT_CONFIG: ServerConfig = {
  cache: {
    enabled: true,
    ttl: 86400000, // 24 hours in milliseconds
    location: '.cache/'
  },
  scraping: {
    timeout: 15000,
    retries: 3,
    rateLimit: 5 // requests per second
  },
  logging: {
    level: 'info'
  }
};

/**
 * HTTP headers for web scraping
 */
export const SCRAPING_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

/**
 * PrimeNG base URL
 */
export const PRIMENG_BASE_URL = 'https://primeng.org';

/**
 * Fallback component list (used if scraping fails)
 */
export const FALLBACK_COMPONENTS = [
  "accordion", "autocomplete", "avatar", "badge", "breadcrumb", "button",
  "cascadeselect", "checkbox", "colorpicker", "confirmdialog", "contextmenu",
  "dataview", "datepicker", "dialog", "divider", "drawer", "dropdown",
  "editor", "fieldset", "fileupload", "floatlabel", "galleria", "iconfield",
  "iftalabel", "image", "inplace", "inputgroup", "inputmask", "inputnumber",
  "inputotp", "inputtext", "keyfilter", "knob", "listbox", "megamenu",
  "menu", "menubar", "message", "metergroup", "multiselect", "orderlist",
  "organizationchart", "paginator", "panel", "panelmenu", "password",
  "picklist", "popover", "progressbar", "progressspinner", "radiobutton",
  "rating", "ripple", "scrollpanel", "scrolltop", "select", "selectbutton",
  "skeleton", "slider", "speeddial", "splitbutton", "splitter", "stepper",
  "table", "tabs", "tag", "terminal", "textarea", "timeline", "toast",
  "togglebutton", "toggleswitch", "toolbar", "tooltip", "tree",
  "treetable", "treeselect", "virtualscroller"
];

/**
 * Component categories for organization
 */
export const COMPONENT_CATEGORIES: Record<string, string[]> = {
  "Inputs": ["autocomplete", "calendar", "checkbox", "colorpicker", "dropdown", "inputmask", "inputnumber", "inputswitch", "inputtext", "inputtextarea", "multiselect", "password", "radiobutton", "rating", "selectbutton", "slider", "togglebutton", "tristatecheckbox"],
  "Data": ["datatable", "table", "dataview", "orderlist", "organizationchart", "paginator", "picklist", "timeline", "tree", "treetable", "virtualscroller"],
  "Buttons": ["button", "splitbutton", "speeddial"],
  "Panels": ["accordion", "card", "divider", "fieldset", "panel", "scrollpanel", "splitter", "stepper", "tabview", "toolbar"],
  "Overlays": ["dialog", "confirmdialog", "sidebar", "tooltip"],
  "Menus": ["breadcrumb", "contextmenu", "menu", "menubar", "megamenu", "panelmenu", "tabmenu", "tieredmenu"],
  "Messages": ["message", "toast"],
  "Media": ["carousel", "galleria", "image"],
  "Misc": ["avatar", "badge", "chip", "progressbar", "progressspinner", "skeleton", "tag", "terminal"]
};
