var CalloutExampleOOBEModel = {
  "title": "All of your favorite people",
  "subText": "Message body is optional. If help documentation is available, consider adding a link to learn more at the bottom.",
  "modifier": "OOBE",
  "arrowPosition": "arrowLeft",
  "actions": [
    {
      "component": "Button",
      "props": {
        "label": "More",
        "tag": "button",
        "modifier": "primary"
      }
    },
    {
      "component": "Button",
      "props": {
        "label": "Got it",
        "tag": "button"
      }
    }
  ],
  "contextualHostProps": {
    "arrowPosition": "arrowLeft",
    "state": "is-open"
  }
}

module.exports = CalloutExampleOOBEModel;