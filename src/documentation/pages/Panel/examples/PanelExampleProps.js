  var PanelExampleProps = {
  "default": {
    "headerText": "Panel",
    "content": "Content goes here",
    "commandBarProps": {
      "commands": [
        {
          "component": "CommandButton",
          "props":  {
            "label": "Save",
            "icon": "save",
            "tag": "button",
            "iconColor": "themePrimary"
          }
        },
        {
          "component": "CommandButton",
          "props":  {
            "label": "Cancel",
            "icon": "x",
            "tag": "button",
            "iconColor": "themePrimary"
          }
        }
      ]
    }
  },
  "medium": {
    "headerText": "Medium Panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "md"
      }
    ]
  },
  "large": {
    "headerText": "Large panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "lg"
      }
    ]
  },
  "largeFixed": {
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
    "headerText": "Extra large panel",
    "content": "Content goes here",
    "modifier": [
      {
        "name": "xl"
      }
    ]
  },
  "extraExtraLarge": {
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
