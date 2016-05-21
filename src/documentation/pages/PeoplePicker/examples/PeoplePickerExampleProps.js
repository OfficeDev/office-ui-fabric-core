var PersonaExampleProps = {
  "default": {
    "textFieldProps": {
      "textfield": true,
      "modifier": "textFieldUnderlined",
      "placeholder": "Select or enter an option"
    },
    "groups": [
      {
        "title": "Contacts",
        "personas": [
          {
            "component": "Persona",
            "props": {
              "initials": "RM",
              "initialsColor": "blue",
              "primaryText": "Russel Miller",
              "secondaryText": "Sales",
                "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            }
          },
          {
            "component": "Persona",
            "props": {
              "initials": "DF",
              "initialsColor": "purple",
              "primaryText": "Douglas Fielder",
              "secondaryText": "Public Relations",
              "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            }
          },
          {
            "component": "Persona",
            "props": {
              "initials": "RM",
              "initialsColor": "blue",
              "primaryText": "Russel Miller",
              "secondaryText": "Sales",
                "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            }
          },
          {
            "component": "Persona",
            "props": {
              "initials": "DF",
              "initialsColor": "purple",
              "primaryText": "Douglas Fielder",
              "secondaryText": "Public Relations",
              "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "compact": {
    "modifiers": [
      {
        "name": "compact"
      }
    ],
    "textFieldProps": {
      "textfield": true,
      "modifier": "textFieldUnderlined",
      "placeholder": "Select or enter an option"
    },
    "groups": [
      {
        "title": "Contacts",
        "personas": [
          {
            "component": "Persona",
            "props": {
              "initials": "RM",
              "initialsColor": "blue",
              "primaryText": "Russel Miller",
              "secondaryText": "Sales",
                "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            },
            "state": "is-selected"
          },
          {
            "component": "Persona",
            "props": {
              "initials": "DF",
              "initialsColor": "purple",
              "primaryText": "Douglas Fielder",
              "secondaryText": "Public Relations",
              "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "facePile": {
    "modifiers": [
      {
        "name": "facePile"
      }
    ],
    "textFieldProps": {
      "textfield": true,
      "modifier": "textFieldUnderlined",
      "placeholder": "Select or enter an option"
    },
    "resultsProps": {
      "modifiers": [
        {
          "name": "facePile"
        }
      ]
    },
    "groups": [
      {
        "title": "Contacts",
        "personas": [
          {
            "component": "Persona",
            "props": {
              "initials": "RM",
              "initialsColor": "blue",
              "primaryText": "Russel Miller",
              "secondaryText": "Sales",
                "modifiers":  [
                {
                  "name": "sm"
                }
              ]
            }
          },
          {
            "component": "Persona",
            "props": {
              "initials": "DF",
              "initialsColor": "purple",
              "primaryText": "Douglas Fielder",
              "secondaryText": "Public Relations",
              "modifiers":  [
                {
                  "name": "sm"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "membersList": {
    "modifiers": [
      {
        "name": "membersList"
      }
    ],
    "textFieldProps": {
      "textfield": true,
      "modifier": "textFieldUnderlined",
      "placeholder": "Select or enter an option"
    },
    "groups": [
      {
        "title": "Contacts",
        "personas": [
          {
            "component": "Persona",
            "props": {
              "initials": "RM",
              "initialsColor": "blue",
              "primaryText": "Russel Miller",
              "secondaryText": "Sales",
                "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            },
            "state": "is-selected"
          },
          {
            "component": "Persona",
            "props": {
              "initials": "DF",
              "initialsColor": "purple",
              "primaryText": "Douglas Fielder",
              "secondaryText": "Public Relations",
              "modifiers":  [
                {
                  "name": "xs"
                }
              ]
            }
          }
        ]
      }
    ]
  }
}

module.exports = PersonaExampleProps;
