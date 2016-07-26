  var PanelExampleProps = {
  "default": {
    "button": {
      "label": "Open Panel",
      "tag": "button"
    },
    "headerText": "Panel",
    "content": "Content goes here",
    "commandBarProps": {
      "commands": [
        {
          "component": "CommandButton",
          "props":  {
            "label": "Save",
            "icon": "Save",
            "tag": "button",
            "iconColor": "themePrimary"
          }
        },
        {
          "component": "CommandButton",
          "props":  {
            "label": "Cancel",
            "icon": "Cancel",
            "tag": "button",
            "iconColor": "themePrimary"
          }
        }
      ]
    }
  },
  "medium": {
    "button": {
      "label": "Open Panel",
      "tag": "button"
    },
    "headerText": "Medium Panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "md"
      }
    ]
  },
  "large": {
    "button": {
      "label": "Open Panel",
      "tag": "button"
    },
    "headerText": "Large panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "lg"
      }
    ]
  },
  "largeFixed": {
    "button": {
      "label": "Open Panel",
      "tag": "button"
    },
    "headerText": "Large panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "lg"
      },
      {
        "name": "fixed"
      }
    ]
  },
  "extraLarge": {
    "button": {
      "label": "Open Panel",
      "tag": "button"
    },
    "headerText": "Extra large panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "xl"
      }
    ]
  },
  "extraExtraLarge": {
    "button": {
      "label": "Open Panel",
      "tag": "button"
    },
    "headerText": "Extra extra large panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "xxl"
      }
    ]
  }
}

module.exports = PanelExampleProps;
