var CalloutExampleModel = {
  "props":  {
    "state": "is-hidden",
    "title": "All of your favorite people",
    "subText": "Message body is optional. If help documentation is available, consider adding a link to learn more at the bottom.",
    "actions": [
      {
        "component": "Link",
        "props": {
          "label": "Learn more",
          "linkText": "Learn More",
          "customClassses": "ms-Callout-link",
          "tabIndex": 0,
          "hasHref": false
        }
      }
    ],
    "button": {
      "label": "Open Callout",
      "tag": "button"
    }
  },
  "propsActionText": {
    "state": "is-hidden",
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
    },
    "button": {
      "label": "Open Callout Action Text",
      "tag": "button"
    }
  },
  "propsClose": {
    "state": "is-hidden",
    "title": "All of your favorite people",
    "subText": "Message body is optional. If help documentation is available, consider adding a link to learn more at the bottom.",
    "modifier": "close",
    "closeIcon": "x",
    "arrowPosition": "arrowLeft",
    "actions": [
      {
        "component": "Link",
        "props": {
          "title": "Learn More",
          "modifier": "hero",
          "label": "Learn More",
          "tabIndex": 0
        }
      }
    ],
    "contextualHostProps": {
      "arrowPosition": "arrowLeft",
      "state": "is-open"
    },
    "button": {
      "label": "Create Account",
      "tag": "button"
    }
  },
  "propsOobe": {
    "state": "is-hidden",
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
    },
    "button": {
      "label": "Open Callout OOBE",
      "tag": "button"
    }
  },
  "propsPeek":  {
    "state": "is-hidden",
    "title": "Uploaded 2 items to <span class='ms-Link'>Alton's OneDrive</span>",
    "titleTokens": ["<span class='ms-Link'>", "</span>"],
    "subText": "",
    "modifier": "peek",
    "arrowPosition": "arrowLeft",
    "actions": [
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
    },
    "button": {
      "label": "Open Callout Peek",
      "tag": "button"
    }
  }
}

module.exports = CalloutExampleModel