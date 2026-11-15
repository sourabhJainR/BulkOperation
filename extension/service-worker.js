chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "BULKOPERATION_SET_ENABLED") return;
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (!tab?.id) {
      sendResponse({ ok: false, error: "No active tab." });
      return;
    }
    chrome.tabs.sendMessage(tab.id, {
      type: "BULKOPERATION_SET_ENABLED",
      enabled: Boolean(message.enabled)
    }).then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ ok: false, error: error.message }));
  });
  return true;
});