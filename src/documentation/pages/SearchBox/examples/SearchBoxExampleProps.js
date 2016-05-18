var SearchBoxExampleProps = {
  "default": {
    "label": "Search",
    "defaultValue": "",
    "icon": "search",
    "clearButton": {
      "component": "CommandButton",
      "props": {
        "icon": "x",
        "modifier": "noLabel",
        "tag": "button",
        "customClasses": "ms-SearchBox-close"
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
    }
  },
}

module.exports = SearchBoxExampleProps;
