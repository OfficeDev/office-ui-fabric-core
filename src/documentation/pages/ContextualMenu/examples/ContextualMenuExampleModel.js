var ContexualMenuExampleModel = {  
  "basic":  {
    "state": "is-open",
    "items": [
      {
        "title": "Animals",
        "state": ""
      },
      {
        "title": "Books",
        "state": ""
      },
      {
        "title": "Education",
        "state": "is-selected"
      },
      {
        "title": "Music",
        "state": ""
      },
      {
        "title": "Sports",
        "state": "is-disabled"
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "checkmarks":  {
    "state": "is-open",
    "modifier": "hasChecks",
    "items": [
      {
        "title": "Animals",
        "state": "",
        "icon": "check",
        "iconSize": "s"
      },
      {
        "title": "Books",
        "state": ""
      },
      {
        "modifier": "divider",
        "title": ""
      },
      {
        "title": "Education",
        "state": "is-selected"
      },
      {
        "title": "Music",
        "state": "",
        "icon": "check",
        "iconSize": "s"
      },
      {
        "title": "Sports",
        "state": "is-disabled"
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "icons":  {
    "state": "is-open",
    "modifier": "hasIcons",
    "items": [
      {
        "title": "Upload file for photo",
        "state": "",
        "icon": "upload",
        "iconSize": "l"
      },
      {
        "title": "Create folder",
        "state": "",
        "icon": "folder",
        "iconSize": "l"
      },
       {
        "modifier": "divider",
        "title": ""
      },
      {
        "title": "Reply",
        "state": "is-selected",
        "icon": "circleFill",
        "iconSize": "l"
      },
      {
        "title": "Forward",
        "state": "",
        "icon": "circleFill",
        "iconSize": "l"
      },
      {
        "title": "Archive",
        "state": "is-disabled"
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "subMenu":  {
    "state": "is-open",
    "items": [
      {
        "title": "Animals",
        "state": ""
      },
      {
        "title": "Books",
        "state": "",
        "subMenuItems": [
          {
            "title": "Fiction",
            "state": ""
          },
          {
            "title": "Humor",
            "state": ""
          },
          {
            "title": "Magazines",
            "state": "is-selected"
          },
          {
            "title": "Non-fiction",
            "state": ""
          },
          {
            "title": "Textbooks",
            "state": ""
          }
        ]
      },
      {
        "title": "Education",
        "state": "is-selected"
      },
      {
        "title": "Music",
        "state": ""
      },
      {
        "title": "Sports",
        "state": "is-disabled"
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "dividers":  {
    "state": "is-open",
    "items": [
      {
        "title": "Delete",
        "state": ""
      },
      {
        "title": "Flag",
        "state": ""
      },
      {
        "modifier": "divider",
        "title": ""
      },
      {
        "title": "Important",
        "state": "is-selected"
      },
      {
        "title": "Move",
        "state": ""
      },
      {
        "modifier": "divider",
        "title": ""
      },
      {
        "title": "Move",
        "state": "is-disabled",
        "subMenuItems": [
          {
            "title": "Fiction",
            "state": ""
          },
          {
            "title": "Humor",
            "state": ""
          },
          {
            "title": "Magazines",
            "state": "is-selected"
          },
          {
            "title": "Non-fiction",
            "state": ""
          },
          {
            "title": "Textbooks",
            "state": ""
          }
        ]
      },
      {
        "title": "Create Rule...",
        "state": "is-selected"
      },
      {
        "title": "Verdana",
        "state": "is-disabled"
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  },
  "multiselect":  {
    "state": "is-open",
    "items": [
      {
        "title": "SORT BY",
        "state": "",
        "modifier": "header"
      },
      {
        "title": "Date",
        "state": ""
      },
      {
        "title": "Sender",
        "state": "is-selected"
      },
      {
        "modifier": "divider",
        "title": ""
      },
      {
        "title": "ORDER",
        "state": "",
        "modifier": "header"
      },
      {
        "title": "Newest on top",
        "state": "is-disabled"
      },
      {
        "title": "Oldest on top",
        "state": "is-disabled"
      },
      {
        "modifier": "divider",
        "title": ""
      },
      {
        "title": "CONVERSATIONS",
        "modifier": "header"
      },
      {
        "title": "On",
        "state": ""
      },
      {
        "title": "Off",
        "state": ""
      }
    ],
    "contextualHostProps":  {
      "state": "is-open"
    }
  }
}

module.exports = ContexualMenuExampleModel;