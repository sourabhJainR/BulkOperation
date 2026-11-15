(() => {
  if (window.__bulkOperationLoaded) return;
  window.__bulkOperationLoaded = true;

  const state = {
    enabled: false,
    selected: new Map(),
    toolbar: null,
    observer: null,
    running: false,
    completed: new Set(),
    actionSignature: null
  };
  const ID = "bo-";
  const textOf = node => (node?.innerText || node?.textContent || "").replace(/\\s+/g, " ").trim();
  const visible = node => {
    if (!node || !node.isConnected) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };
  const isOurNode = node => node?.id?.startsWith("bo-") || node?.classList?.contains("bo-row-checkbox");

  function githubBranchRows() {
    if (!/github\\.com$/.test(location.hostname) || !/\\/(branches|branches\\/all)(?:[/?#]|$)/.test(location.pathname)) return [];
    const anchors = [...document.querySelectorAll('a[href*="/tree/"], a[href*="/branch/"]')];
    const rows = new Set();
    for (const anchor of anchors) {
      if (!visible(anchor)) continue;
      const href = new URL(anchor.href, location.href);
      const match = href.pathname.match(/\\/(?:tree|branch)\\/(.+)$/);
      if (!match) continue;
      let row = anchor.closest("tr, [role=row], li");
      if (!row) {
        let current = anchor;
        for (let i = 0; i < 6 && current?.parentElement; i++, current = current.parentElement) {
          if (current.querySelectorAll('a[href*="/tree/"], a[href*="/branch/"]').length === 1 &&
              current.querySelectorAll("button").length >= 1) { row = current; break; }
        }
      }
      if (!row || row === document.body) continue;
      const branch = decodeURIComponent(match[1]).split("/").slice(0, 10).join("/");
      if (branch) rows.add({ row, key: "github:" + branch, label: branch, kind: "github-branch" });
    }
    return [...rows.values()];
  }

  function genericRows() {
    const found = new Set();
    const selectors = ["table tbody tr", '[role="grid"] [role="row"]', '[role="treegrid"] [role="row"]', "ul > li", "ol > li"];
    for (const selector of selectors) {
      for (const row of document.querySelectorAll(selector)) {
        if (!visible(row) || isOurNode(row) || row.closest("#bo-toolbar, #bo-dialog")) continue;
        const label = textOf(row).slice(0, 180);
        if (!label || row.querySelectorAll("a,button,[role=button]").length === 0) continue;
        const key = row.getAttribute("data-id") || row.id || row.querySelector("a[href]")?.getAttribute("href") || label;
        found.add({ row, key: "generic:" + key, label, kind: "generic" });
      }
    }
    return [...found.values()];
  }

  function getRows() {
    const github = githubBranchRows();
    return github.length ? github : genericRows();
  }

  function isProtectedBranch(item) {
    if (item.kind !== "github-branch") return false;
    const rowText = textOf(item.row).toLowerCase();
    const branch = item.label.toLowerCase();
    return branch === "main" || branch === "master" || branch === "gh-pages" ||
      /\\bdefault\\b/.test(rowText) || /\\bprotected\\b/.test(rowText);
  }

  function ensureCheckbox(item) {
    if (item.row.querySelector(":scope > .bo-row-checkbox") || item.row.querySelector(".bo-row-checkbox")) return;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "bo-row-checkbox";
    checkbox.setAttribute("aria-label", "Select " + item.label);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) state.selected.set(item.key, item);
      else state.selected.delete(item.key);
      item.row.classList.toggle("bo-selected-row", checkbox.checked);
      updateToolbar();
    });
    const anchor = item.row.querySelector("a,td,[role=gridcell]") || item.row.firstElementChild;
    if (anchor) anchor.prepend(checkbox);
    else item.row.prepend(checkbox);
    if (state.selected.has(item.key)) {
      checkbox.checked = true;
      item.row.classList.add("bo-selected-row");
      state.selected.set(item.key, item);
    }
  }

  function button(label, handler, className = "") {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = label;
    if (className) element.className = className;
    element.addEventListener("click", handler);
    return element;
  }

  function createToolbar() {
    if (state.toolbar?.isConnected) return;
    const bar = document.createElement("div");
    bar.id = "bo-toolbar";
    const count = document.createElement("span");
    count.className = "bo-count";
    count.id = "bo-count";
    const selectAll = button("Select visible", () => {
      for (const item of getRows()) {
        if (isProtectedBranch(item)) continue;
        const checkbox = item.row.querySelector(".bo-row-checkbox");
        if (checkbox && !checkbox.checked) { checkbox.checked = true; checkbox.dispatchEvent(new Event("change")); }
      }
    });
    const clear = button("Clear", clearSelection);
    const action = document.createElement("select");
    action.id = "bo-action";
    action.setAttribute("aria-label", "Bulk action");
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Choose an action…";
    action.append(option);
    const run = button("Review and run", reviewRun, "primary");
    const close = button("Close", disable);
    bar.append(count, selectAll, clear, action, run, close);
    document.documentElement.append(bar);
    state.toolbar = bar;
    updateToolbar();
  }

  function actionName(button) {
    return (button.getAttribute("aria-label") || button.title || textOf(button)).replace(/\\s+/g, " ").trim();
  }

  function genericActions(item) {
    return [...item.row.querySelectorAll("button,[role=button],a[role=button]")]
      .filter(node => visible(node) && !node.classList.contains("bo-row-checkbox"))
      .map(actionName).filter(name => name && name.length <= 70);
  }

  function updateToolbar() {
    const count = state.toolbar?.querySelector("#bo-count");
    if (count && count.textContent !== state.selected.size + " selected") count.textContent = state.selected.size + " selected";
    const action = state.toolbar?.querySelector("#bo-action");
    if (!action) return;
    const selected = [...state.selected.values()];
    const github = selected.some(x => x.kind === "github-branch");
    const values = [];
    if (github && selected.every(x => x.kind === "github-branch")) {
      values.push(["Delete selected branches", "github-delete-branch"]);
    } else if (selected.length && selected.every(x => x.kind === "generic")) {
      const lists = selected.map(genericActions);
      const common = lists.length ? lists[0].filter(name => lists.every(list => list.includes(name))) : [];
      for (const name of [...new Set(common)].sort()) values.push(["Run: " + name, "generic:" + name]);
    }
    const signature = JSON.stringify(values);
    if (signature !== state.actionSignature) {
      const previous = action.value;
      action.replaceChildren(new Option("Choose an action…", ""));
      for (const [label, value] of values) action.add(new Option(label, value));
      if ([...action.options].some(x => x.value === previous)) action.value = previous;
      state.actionSignature = signature;
    }
  }

  function clearSelection() {
    state.selected.clear();
    for (const row of document.querySelectorAll(".bo-selected-row")) row.classList.remove("bo-selected-row");
    for (const checkbox of document.querySelectorAll(".bo-row-checkbox")) checkbox.checked = false;
    updateToolbar();
  }

  function showDialog(title, message, items, confirmLabel, onConfirm, danger = false) {
    document.getElementById("bo-dialog")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "bo-dialog";
    const panel = document.createElement("section");
    panel.className = "bo-panel";
    const heading = document.createElement("h2"); heading.textContent = title;
    const paragraph = document.createElement("p"); paragraph.textContent = message;
    const list = document.createElement("ul");
    for (const item of items) { const li = document.createElement("li"); li.textContent = item; list.append(li); }
    const actions = document.createElement("div"); actions.className = "bo-actions";
    actions.append(button("Cancel", () => overlay.remove()));
    actions.append(button(confirmLabel, () => { overlay.remove(); onConfirm(); }, danger ? "danger" : "primary"));
    panel.append(heading, paragraph, list, actions); overlay.append(panel);
    overlay.addEventListener("click", event => { if (event.target === overlay) overlay.remove(); });
    document.documentElement.append(overlay);
  }

  async function githubDelete(item) {
    if (!item.row.isConnected) throw new Error("Row is no longer on the page.");
    if (isProtectedBranch(item)) throw new Error("Protected or default branch was skipped.");
    const buttons = [...item.row.querySelectorAll("button,[role=button]")].filter(visible);
    const menuButton = buttons.find(b => /branch options|more options|actions|menu/i.test((b.getAttribute("aria-label") || "") + " " + (b.title || "") + " " + textOf(b)));
    if (!menuButton) throw new Error("Could not find the branch actions menu.");
    menuButton.click();
    await wait(250);
    const menus = [...document.querySelectorAll('[role=menu], [role=menuitem], button, a')].filter(visible);
    const deleteAction = menus.find(node => /^delete branch$/i.test(textOf(node)) || /delete branch/i.test(node.getAttribute("aria-label") || ""));
    if (!deleteAction) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      throw new Error("GitHub did not expose a visible Delete branch action.");
    }
    deleteAction.click();
    await wait(250);
    const dialog = [...document.querySelectorAll('[role=dialog], dialog')].find(visible);
    if (dialog) {
      const confirm = [...dialog.querySelectorAll("button")].find(b => visible(b) && /^delete$/i.test(textOf(b)));
      if (confirm) confirm.click();
      else throw new Error("GitHub confirmation dialog did not expose a clear Delete button.");
    } else {
      const confirm = [...document.querySelectorAll("button")].find(b => visible(b) && /^delete branch$/i.test(textOf(b)));
      if (confirm) confirm.click();
      else throw new Error("Could not confirm deletion through GitHub's visible interface.");
    }
    await wait(500);
    const stillPresent = [...document.querySelectorAll('a[href*="/tree/"],a[href*="/branch/"]')].some(a => {
      try {
        const path = new URL(a.href, location.href).pathname;
        const match = path.match(/\\/(?:tree|branch)\\/(.+)$/);
        return match && decodeURIComponent(match[1]) === item.label;
      } catch { return false; }
    });
    if (stillPresent) throw new Error("GitHub has not visibly removed this branch yet.");
  }

  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  async function runSequential(items, action) {
    if (state.running) return;
    state.running = true;
    const count = state.toolbar.querySelector("#bo-count");
    const results = [];
    try {
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        count.textContent = "Processing " + (index + 1) + "/" + items.length + "…";
        try {
          if (action === "github-delete-branch") await githubDelete(item);
          else if (action.startsWith("generic:")) {
            const name = action.slice("generic:".length);
            const target = [...item.row.querySelectorAll("button,[role=button],a[role=button]")]
              .find(node => visible(node) && actionName(node) === name);
            if (!target) throw new Error("The selected row no longer exposes the action: " + name);
            target.click();
            await wait(500);
          } else throw new Error("Choose a supported action.");
          results.push({ label: item.label, ok: true });
          state.completed.add(item.key);
          state.selected.delete(item.key);
        } catch (error) {
          results.push({ label: item.label, ok: false, error: error.message });
        }
        await wait(350);
      }
    } finally {
      state.running = false;
      clearSelection();
      const successes = results.filter(x => x.ok).length;
      showDialog("Bulk operation finished", successes + " of " + results.length + " items completed. Failed items remain listed below.", results.map(x => (x.ok ? "Completed: " : "Failed: ") + x.label + (x.error ? " — " + x.error : "")), "Close", () => {}, false);
    }
  }

  function reviewRun() {
    if (state.running) return;
    const action = state.toolbar.querySelector("#bo-action").value;
    const items = [...state.selected.values()];
    if (!items.length) { alert("Select at least one item."); return; }
    if (!action) { alert("Choose an action first."); return; }
    const eligible = items.filter(item => !isProtectedBranch(item));
    const skipped = items.length - eligible.length;
    if (!eligible.length) { alert("No eligible items. Protected/default branches are excluded."); return; }
    const message = "This will process " + eligible.length + " item(s), one at a time, using visible page controls. " + (skipped ? skipped + " protected/default item(s) will be skipped. " : "") + "Review the list before continuing.";
    showDialog("Confirm bulk operation", message, eligible.map(x => x.label), "Confirm operation", () => runSequential(eligible, action), true);
  }

  function scan() {
    if (!state.enabled) return;
    for (const item of getRows()) {
      if (isProtectedBranch(item)) continue;
      ensureCheckbox(item);
    }
    updateToolbar();
  }

  function enable() {
    state.enabled = true;
    createToolbar();
    scan();
    if (!state.observer) {
      state.observer = new MutationObserver(() => {
        if (!state.enabled) return;
        clearTimeout(state.scanTimer);
        state.scanTimer = setTimeout(scan, 180);
      });
      state.observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  function disable() {
    state.enabled = false;
    state.observer?.disconnect();
    state.observer = null;
    state.toolbar?.remove();
    state.toolbar = null;
    document.getElementById("bo-dialog")?.remove();
    clearSelection();
    for (const checkbox of document.querySelectorAll(".bo-row-checkbox")) checkbox.remove();
    for (const row of document.querySelectorAll(".bo-selected-row")) row.classList.remove("bo-selected-row");
  }

  chrome.runtime.onMessage.addListener(message => {
    if (message?.type !== "BULKOPERATION_SET_ENABLED") return;
    if (message.enabled) enable(); else disable();
  });
})();