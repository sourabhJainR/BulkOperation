const status = document.getElementById("status");
async function setEnabled(enabled) {
  status.textContent = "Updating page…";
  try {
    const response = await chrome.runtime.sendMessage({
      type: "BULKOPERATION_SET_ENABLED",
      enabled
    });
    if (!response?.ok) throw new Error(response?.error || "Could not reach this page.");
    status.textContent = enabled ? "Selection enabled on this page." : "BulkOperation disabled.";
  } catch (error) {
    status.textContent = error.message + " Refresh the page and try again.";
  }
}
document.getElementById("enable").addEventListener("click", () => setEnabled(true));
document.getElementById("disable").addEventListener("click", () => setEnabled(false));