
updateButton = (inlinePrefValue) => {
  switch (inlinePrefValue) {
    case true:
      messenger.messageDisplayAction.setIcon({path: "toggleInline1.png"});
      messenger.messageDisplayAction.setTitle({title: "Toggle Inline (viewing attachments inline)"});
      break;

    case false:
      messenger.messageDisplayAction.setIcon({path: "toggleInline2.png"});
      messenger.messageDisplayAction.setTitle({title: "Toggle Inline (not viewing attachments inline)"});
      break;

    default:
      //disable button as pref value does not seem to be there
      messenger.messageDisplayAction.disable();
  }
}

togglePref = async () => {
  // get a value from the pref system
  let inlinePrefValue = await messenger.LegacyPrefs.getPref("mail.inline_attachments");

  // toggle pref if possible
  switch (inlinePrefValue) {
    case true:
      await messenger.LegacyPrefs.setPref("mail.inline_attachments", false);
      updateButton(false);
      break;

    case false:
      await messenger.LegacyPrefs.setPref("mail.inline_attachments", true);
      updateButton(true);
      break;

    default:
      //disable button as pref value does not seem to be there
      updateButton();
  }
}

(async () => {
  // get a value from the pref system and initialize the button
  let inlinePrefValue = await messenger.LegacyPrefs.getPref("mail.inline_attachments");
  updateButton(inlinePrefValue);

  messenger.messageDisplayAction.onClicked.addListener(togglePref);
})()
