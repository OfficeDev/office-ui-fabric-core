var SearchBoxExampleProps = {
  "default": {
    "label": "Search",
    "defaultValue": "",
    "icon": "search",
    "clearButton": {
      "component": "CommandButton",
      "props": {
        "icon": "Clear",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-clear"
      }
    },
    "filterButton": {
      "component": "CommandButton",
      "props": {
        "icon": "Filter",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-filter"
      }
    }
  },
  "collapsed": {
    "label": "Search",
    "defaultValue": "",
    "icon": "search",
    "closeIcon": "x",
    "modifier": "commandBar",
    "state": "is-collapsed",
    "clearButton": {
      "component": "CommandButton",
      "props": {
        "icon": "x",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-close"
      }
    },
    "filterButton": {
      "component": "CommandButton",
      "props": {
        "icon": "Filter",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-filter"
      }
    }
  },
  "commandBar": {
    "label": "Search",
    "defaultValue": "",
    "icon": "search",
    "closeIcon": "x",
    "modifier": "commandBar",
    "clearButton": {
      "component": "CommandButton",
      "props": {
        "icon": "x",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-close"
      }
    },
    "filterButton": {
      "component": "CommandButton",
      "props": {
        "icon": "Filter",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-filter"
      }
    }
  },
}

module.exports = SearchBoxExampleProps;
