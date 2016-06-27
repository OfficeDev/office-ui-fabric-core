var CommandBarExampleModel = {
  "props": {
    "transientComponent": {
      "component": "SearchBox",
      "props":  {
        "label": "Search",
        "icon": "Search",
        "defaultValue": "",
        "modifier": "commandBar",
        "clearButton": {
          "component": "CommandButton",
          "props": {
            "icon": "Cancel",
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
        },
        "exitButton": {
          "component": "CommandButton",
          "props": {
            "icon": "ChromeBack",
            "modifier": "noLabel",
            "tag": "button",
            "customClasses": "ms-SearchBox-exit"
          }
        }
      }
    },
    "commands": [
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "New",
          "icon": "CircleRing",
          "tag": "button",
          "dropdownIcon": "ChevronDown",
          "iconColor": "themePrimary",
          "dropdown": {
            "component": "ContextualMenu",
            "props":  {
              "state": "is-opened",
              "modifier": "hasIcons",
              "items": [
                {
                  "title": "Folder",
                  "state": "",
                  "icon": "Folder"
                },
                {
                  "modifier": "divider",
                  "title": ""
                },
                {
                  "title": "Plain Text Document",
                  "icon": "Page"
                },
                {
                  "title": "A Coffee",
                  "icon": "Coffee"
                },
                {
                  "title": "Picture",
                  "state": "",
                  "icon": "Picture"
                },
                {
                  "title": "Money",
                  "icon": "Money"
                }
              ]
            }
          }
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      }
    ],
    "sideCommands": [
      {
        "component": "CommandButton",
        "props":  {
          "icon": "CircleRing",
          "tag": "button",
          "modifier": "noLabel",
          "iconColor": "themePrimary"
        }
      }
    ],
    "overflow": {
      "component": "CommandButton",
      "props":  {
        "icon": "More",
        "customClasses": "ms-CommandBar-overflowButton",
        "tag": "button",
        "modifier": "noLabel",
        "dropdown": {
          "component": "ContextualMenu",
          "props":  {
            "state": "is-opened",
            "modifier": "hasIcons",
            "items": [
              {
                "title": "Folder",
                "state": "",
                "icon": "Folder"
              },
              {
                "modifier": "divider",
                "title": ""
              },
              {
                "title": "Plain Text Document",
                "icon": "Page"
              },
              {
                "title": "A Coffee",
                "icon": "Coffee"
              },
              {
                "title": "Picture",
                "state": "",
                "icon": "Picture"
              },
              {
                "title": "Money",
                "icon": "Money"
              }
            ]
          }
        }
      }
    }
  },
  "propsDropdown": {
    "transientComponent": {
      "component": "CommandButton",
      "props":  {
        "icon": "GlobalNavButton",
        "modifier": "actionButton",
        "tag": "button",
        "iconColor": "themePrimary"
      }
    },
    "overflow": {
      "component": "CommandButton",
      "props":  {
        "icon": "More",
        "customClasses": "ms-CommandBar-overflowButton",
        "tag": "button",
        "modifier": "noLabel",
        "dropdown": {
          "component": "ContextualMenu",
          "props":  {
            "state": "is-opened",
            "modifier": "hasIcons",
            "items": [
              {
                "title": "Folder",
                "state": "",
                "icon": "folder"
              },
              {
                "modifier": "divider",
                "title": ""
              },
              {
                "title": "Plain Text Document",
                "icon": "document"
              },
              {
                "title": "A Dog",
                "icon": "dogAlt"
              },
              {
                "title": "Picture",
                "state": "",
                "icon": "sun"
              },
              {
                "title": "Money",
                "icon": "Money"
              }
            ]
          }
        }
      }
    },
    "commands": [
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "Search",
          "tag": "button",
          "iconColor": "themePrimary",
          "modifier": "noLabel"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Reply",
          "icon": "CircleRing",
          "splitIcon": "ChevronDown",
          "iconColor": "themePrimary",
          "tag": "button",
          "dropdown": {
            "component": "ContextualMenu",
            "props":  {
              "state": "is-opened",
              "items": [
                {
                  "title": "Reply",
                  "state": ""
                },
                {
                  "title": "Reply all",
                  "state": ""
                },
                {
                  "title": "Forward",
                  "state": "is-selected"
                },
                {
                  "title": "Flag",
                  "state": ""
                },
                {
                  "title": "Delete",
                  "state": "is-disabled"
                }
              ]
            }
          }  
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Command",
          "icon": "CircleRing",
          "tag": "button",
          "iconColor": "themePrimary"
        }
      }
    ]
  },
  "propsNavBar": {
    "modifier": "navBar",
    "transientComponent": {
      "component": "SearchBox",
      "props":  {
        "label": "Search photos",
        "icon": "Search",
        "defaultValue": "",
        "modifier": "commandBar",
        "clearButton": {
          "component": "CommandButton",
          "props": {
            "icon": "Cancel",
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
        },
        "exitButton": {
          "component": "CommandButton",
          "props": {
            "icon": "ChromeBack",
            "modifier": "noLabel",
            "tag": "button",
            "customClasses": "ms-SearchBox-exit"
          }
        }
      }
    },
    "overflow": {
      "component": "CommandButton",
      "props":  {
        "icon": "More",
        "customClasses": "ms-CommandBar-overflowButton",
        "tag": "button",
        "modifier": "noLabel",
        "dropdown": {
          "component": "ContextualMenu",
          "props":  {
            "state": "is-opened",
            "items": [
              {
                "title": "Folder",
                "state": "",
                "icon": "Folder"
              },
              {
                "modifier": "divider",
                "title": ""
              },
              {
                "title": "Plain Text Document",
                "icon": "Document"
              },
              {
                "title": "A Coffee",
                "icon": "Coffee"
              },
              {
                "title": "Picture",
                "state": "",
                "icon": "Picture"
              },
              {
                "title": "Money",
                "icon": "Money"
              }
            ]
          }
        }
      }
    },
    "commands": [
      {
        "component": "CommandButton",
        "props":  {
          "label": "All Photos",
          "tag": "button",
          "dropdownIcon": "ChevronDown",
          "iconColor": "themePrimary",
          "modifier": "pivot",
          "state": "is-active",
          "dropdown": {
            "component": "ContextualMenu",
            "props":  {
              "state": "is-opened",
              "modifier": "hasIcons",
              "items": [
                {
                  "title": "Folder",
                  "state": "",
                  "icon": "Folder"
                },
                {
                  "modifier": "divider",
                  "title": ""
                },
                {
                  "title": "Plain Text Document",
                  "icon": "Document"
                },
                {
                  "title": "Coffee",
                  "icon": "Coffee"
                },
                {
                  "title": "Picture",
                  "state": "",
                  "icon": "Picture"
                },
                {
                  "title": "Money",
                  "icon": "Money"
                }
              ]
            }
          }
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Albums",
          "tag": "a",
          "modifier": "pivot",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Tags",
          "tag": "a",
          "modifier": "pivot",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "Places",
          "tag": "a",
          "modifier": "pivot",
          "iconColor": "themePrimary"
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "label": "People",
          "tag": "a",
          "modifier": "pivot",
          "iconColor": "themePrimary"
        }
      }
    ],
    "sideCommands": [
      {
        "component": "CommandButton",
        "props":  {
          "label": "Show photos from",
          "icon": "Settings",
          "tag": "button",
          "modifier": "dropdown",
          "iconColor": "themePrimary",
          "dropdownIcon": "ChevronDown",
          "dropdown": {
            "component": "ContextualMenu",
            "props":  {
              "state": "is-opened",
              "modifier": "hasIcons",
              "items": [
                {
                  "title": "Folder",
                  "state": "",
                  "icon": "Folder"
                },
                {
                  "modifier": "divider",
                  "title": ""
                },
                {
                  "title": "Plain Text Document",
                  "icon": "Document"
                },
                {
                  "title": "A Coffee",
                  "icon": "Coffee"
                },
                {
                  "title": "Picture",
                  "state": "",
                  "icon": "Picture"
                },
                {
                  "title": "Money",
                  "icon": "Money"
                }
              ]
            }
          }
        }
      },
      {
        "component": "CommandButton",
        "props":  {
          "icon": "Info",
          "tag": "button",
          "modifier": "noLabel",
          "iconColor": "themePrimary"
        }
      }
    ]
  }
}

module.exports = CommandBarExampleModel;