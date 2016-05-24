var DialogExampleModel = {
  "default": {
    "title": "All emails together",
    "subText": "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.",
    "components": [
      {
        "component": "CheckBox",
        "props":  {
          "label": "Option1",
          "modifier": "",
          "name": "checkboxa",
          "id": "checkboxa",
          "checked": false,
          "disabled": false,
          "type": "checkbox"
        }
      },
      {
        "component": "CheckBox",
        "props":  {
          "label": "Option2",
          "modifier": "",
          "name": "checkboxa",
          "id": "checkboxa",
          "checked": false,
          "disabled": false,
          "type": "checkbox"
        }
      }
    ],
    "actions": [
      {
        "component": "Button",
        "props": {
          "label": "Save",
          "tag": "button",
          "modifier": "primary",
          "customClasses": "ms-Dialog-action"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "blocking": {
    "modifier": "blocking",
    "title": "Unsaved changes",
    "subText": "Are you sure you want to discard these changes?.",
    "components": [
      {
        "component": "CheckBox",
        "props":  {
          "label": "Option1",
          "modifier": "",
          "name": "checkboxa",
          "id": "checkboxa",
          "checked": false,
          "disabled": false,
          "type": "checkbox"
        }
      },
      {
        "component": "CheckBox",
        "props":  {
          "label": "Option2",
          "modifier": "",
          "name": "checkboxa",
          "id": "checkboxa",
          "checked": false,
          "disabled": false,
          "type": "checkbox"
        }
      }
    ],
    "actions": [
      {
        "component": "Button",
        "props": {
          "label": "Save",
          "tag": "button",
          "modifier": "primary",
          "customClasses": "ms-Dialog-action"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Delete",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "close": {
    "modifier": "close",
    "closeIcon": "x",
    "title": "All emails together",
    "subtext": "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.",
    "components": [
      {
        "component": "CheckBox",
        "props":  {
          "label": "Option1",
          "modifier": "",
          "name": "checkboxa",
          "id": "checkboxa",
          "checked": false,
          "disabled": false,
          "type": "checkbox"
        }
      },
      {
        "component": "CheckBox",
        "props":  {
          "label": "Option2",
          "modifier": "",
          "name": "checkboxa",
          "id": "checkboxa",
          "checked": false,
          "disabled": false,
          "type": "checkbox"
        }
      }
    ],
    "actions": [
      {
        "component": "Button",
        "props": {
          "label": "Save",
          "tag": "button",
          "modifier": "primary",
          "customClasses": "ms-Dialog-action"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "lgHeader": {
    "modifier": "lgHeader",
    "title": "All emails together",
    "subText": "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.",
    "actions": [
      {
        "component": "Button",
        "props": {
          "label": "Save",
          "tag": "button",
          "modifier": "primary",
          "customClasses": "ms-Dialog-action"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "multiline": {
    "modifier": "multiline",
    "title": "All emails together",
    "components": [
      {
        "component": "Button",
        "props":  {
          "label": "Create Account",
          "description": "Description of this action this button takes",
          "icon": "plus",
          "modifier": "compound",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      },
       {
        "component": "Button",
        "props":  {
          "label": "Sign in",
          "description": "Description of this action this button takes",
          "icon": "plus",
          "modifier": "compound",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      },
       {
        "component": "Button",
        "props":  {
          "label": "Settings",
          "description": "Description of this action this button takes",
          "icon": "plus",
          "modifier": "compound",
          "tag": "button",
          "customClasses": "ms-Dialog-action"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  }
}

module.exports = DialogExampleModel;