var PersonaExampleProps = {
  "default": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "icon": "skypeCheck"
  },
  "large": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "tertiaryText": "In a meeting",
    "icon": "skypeCheck",
    "modifiers": [
      {
        "name": "lg"
      }
    ]
  },
  "extraLarge": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "tertiaryText": "In a meeting",
    "optionalText": "Available at 4:00pm",
    "icon": "skypeCheck",
    "modifiers":  [
      {
        "name": "xl"
      }
    ]
  },
  "small": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "icon": "skypeCheck",
    "modifiers":  [
      {
        "name": "sm"
      }
    ]
  },
  "extraSmall": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "icon": "skypeCheck",
    "modifiers":  [
      {
        "name": "xs"
      }
    ]
  },
  "tiny": {
    "primaryText": "Alton Lafferty",
    "icon": "skypeCheck",
    "modifiers":  [
      {
        "name": "tiny"
      }
    ]
  },
  "initials": {
    "initials": "AL",
    "initialsColor": "blue",
    "primaryText": "Alton Lafferty",
    "icon": "skypeCheck"
  },
  "presenceAvailable": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "icon": "skypeCheck",
    "modifiers":  [
      {
        "name": "available"
      }
    ]
  },
  "presenceAway": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "icon": "skypeClock",
    "modifiers":  [
      {
        "name": "away"
      }
    ]
  },
  "presenceBlocked": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "modifiers":  [
      {
        "name": "blocked"
      }
    ]
  },
  "presenceBusy": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "modifiers":  [
      {
        "name": "busy"
      }
    ]
  },
  "presenceDND": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "icon": "skypeMinus",
    "modifiers":  [
      {
        "name": "dnd"
      }
    ]
  },
  "presenceOffline": {
    "image": "Persona.Person2.png",
    "primaryText": "Alton Lafferty",
    "secondaryText": "Accountant",
    "modifiers":  [
      {
        "name": "offline"
      }
    ]
  },
  "token": {
    "image": "Persona.Person2.png",
    "primaryText": "Gerrad Matteu",
    "actionIcon": "x",
    "icon": "skypeCheck",
    "modifiers": [
      {
        "name": "token"
      }
    ]
  },
  "facePile": {
    "initials": "AL",
    "initialsColor": "blue",
    "image": "Persona.Person2.png",
    "modifiers": [
      {
        "name": "facePile"
      }
    ],
    "personaCardProps":  {
      "button": {
        "label": "Open Example",
        "modifier": "primary",
        "tag": "button"
      },
      "contextualHostProps": {
        "state": "is-open"
      },
      "personaProps": {
        "initials": "AL",
        "initialsColor": "blue",
        "image": "../persona/Persona.Person2.png",
        "primaryText": "Alton Lafferty",
        "secondaryText": "Accountant",
        "tertiaryText": "In a meeting",
        "optionalText": "Available at 4:00pm",
        "modifiers":  [
          {
            "name": "lg"
          }
        ]
      },
      "orgChartProps": {
        "groups": [
          {
            "personas": [
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Russel Miller",
                  "secondaryText": "Sales"
                }
              },
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Douglas Fielder",
                  "secondaryText": "Public Relations"
                }
              }
            ]
          },
          {
            "title": "Manager",
            "personas": [
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Grant Steel",
                  "secondaryText": "Sales"
                }
              }
            ]
          },
          {
            "title": "Staff",
            "personas": [
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Harvey Wallin",
                  "secondaryText": "Public Relations"
                }
              },
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Marcus Lauer",
                  "secondaryText": "Technical Support"
                }
              },
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Marcel Groce",
                  "secondaryText": "Delivery"
                }
              },
              {
                "component": "Persona",
                "props": {
                  "initials": "RM",
                  "initialsColor": "blue",
                  "image": "../persona/Persona.Person2.png",
                  "primaryText": "Jessica Fischer",
                  "secondaryText": "Marketing"
                }
              }
            ]
          }
        ]
      }
    }
  }
}

module.exports = PersonaExampleProps;
