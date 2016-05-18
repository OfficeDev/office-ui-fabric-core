var DialogExampleModel = {
  "props": {
    "modifier": "sample",
    "closeIcon": "x",
    "title": "All emails together",
    "subText": "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.",
    "components": [
      {
        "component": "ChoiceField",
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
        "component": "ChoiceField",
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
          "modifier": "primary"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "propsBlocking": {
    "modifier": "blocking",
    "closeIcon": "x",
    "title": "Unsaved changes",
    "subText": "Are you sure you want to discard these changes?.",
    "components": [
      {
        "component": "ChoiceField",
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
        "component": "ChoiceField",
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
          "modifier": "primary"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "propsClose": {
    "modifier": "close",
    "closeIcon": "x",
    "title": "All emails together",
    "subtext": "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.",
    "components": [
      {
        "component": "ChoiceField",
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
        "component": "ChoiceField",
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
          "modifier": "primary"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "propslgHeader": {
    "modifier": "lgHeader",
    "closeIcon": "x",
    "title": "All emails together",
    "subText": "Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails.",
    "actions": [
      {
        "component": "Button",
        "props": {
          "label": "Save",
          "tag": "button",
          "modifier": "primary"
        }
      },
      {
        "component": "Button",
        "props": {
          "label": "Cancel",
          "tag": "button"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "propsMultiline": {
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
          "tag": "button"
        }
      },
       {
        "component": "Button",
        "props":  {
          "label": "Create Account",
          "description": "Description of this action this button takes",
          "icon": "plus",
          "modifier": "compound",
          "tag": "button"
        }
      },
       {
        "component": "Button",
        "props":  {
          "label": "Create Account",
          "description": "Description of this action this button takes",
          "icon": "plus",
          "modifier": "compound",
          "tag": "button"
        }
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  }
}

module.exports = DialogExampleModel;