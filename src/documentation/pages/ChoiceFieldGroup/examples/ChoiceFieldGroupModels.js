var ChoiceFieldGroupModels = {
  "props": {
   "title": "Unselected",
   "required": true,
   "id": "choicefieldgroup",
   "groupType": "radiogroup",
   "fields": [
     {
       "component": "RadioButton",
       "props": {
        "label": "Option 1",
        "modifier": "",
        "name": "choicefieldgroup",
        "id": "option1",
        "checked": false,
        "disabled": false,
        "type": "radio"
       }
     },
     {
       "component": "RadioButton",
       "props": {
          "label": "Option 2",
          "modifier": "",
          "name": "choicefieldgroup",
          "id": "option2",
          "checked": false,
          "disabled": false,
          "type": "radio"
        }
     },
     {
       "component": "RadioButton",
       "props": {
          "label": "Option 3",
          "modifier": "",
          "name": "choicefieldgroup",
          "id": "option3",
          "checked": false,
          "disabled": true,
          "type": "radio"
        }
     },
     {
       "component": "RadioButton",
       "props": {
          "label": "Option 4",
          "modifier": "",
          "name": "choicefieldgroup",
          "id": "option4",
          "checked": false,
          "disabled": false,
          "type": "radio"
        }
     }
   ]
  }
}

module.exports = ChoiceFieldGroupModels;