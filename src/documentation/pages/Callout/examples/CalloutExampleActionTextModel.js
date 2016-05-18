var CalloutExampleActionTextModel = {
  "title": "All of your favorite people",
  "subText": "Message body is optional. If help documentation is available, consider adding a link to learn more at the bottom.",
  "modifier": "actionText",
  "actions": [
    {
      "component": "CommandButton",
      "props": {
        "label": "Command",
        "icon": "check",
        "tag": "button",
        "modifier": "inline",
        "iconColor": "green"
      }
    },
    {
      "component": "CommandButton",
      "props": {
        "label": "Command",
        "icon": "x",
        "tag": "button",
        "modifier": "inline",
        "iconColor": "red"
      }
    }
  ],
  "contextualHostProps": {
    "arrowPosition": "arrowLeft",
      "state": "is-open"
  }
}

module.exports = CalloutExampleActionTextModel;