// Wait for DOM content
window.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.documentElement;
  const clientIdInput = document.getElementById("client-id");
  const scopesSelect = document.getElementById("scopes");
  const permissionsInput = document.getElementById("permissions-integer");
  const oauthUrl = document.getElementById("oauth-url");
  const oauthLink = document.getElementById("oauth-link");
  const copyBtn = document.getElementById("copy-url");

  // Hide loading after 1s
  setTimeout(() => loadingScreen.style.display = "none", 1000);

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
  });

  // Permission list (sorted alphabetically by name per category)
  const permissions = {
    general: [
      [3, "Administrator"],
      [1, "Kick Members"],
      [2, "Ban Members"],
      [0, "Create Instant Invite"],
      [4, "Manage Channels"],
      [5, "Manage Guild"],
      [11, "Manage Emojis and Stickers"],
      [10, "Manage Webhooks"],
      [17, "Manage Events"],
      [18, "Manage Threads"],
      [7, "View Audit Log"],
      [22, "View Creator Monetization Insights"],
      [15, "Use Application Commands"],
      [20, "Use Embedded Activities"],
      [21, "Moderate Members"],
      [16, "Request to Speak"]
    ].sort((a, b) => a[1].localeCompare(b[1])),

    text: [
      [13, "Attach Files"],
      [12, "Embed Links"],
      [14, "Read Message History"],
      [9, "Send Messages"],
      [23, "Send Messages in Threads"],
      [27, "Send Polls"],
      [10, "Send TTS Messages"],
      [11, "Manage Messages"],
      [15, "Mention Everyone"],
      [17, "Add Reactions"],
      [24, "Use Public Threads"],
      [25, "Use Private Threads"],
      [16, "Use External Emojis"],
      [26, "Use External Stickers"],
      [19, "Use Slash Commands"]
    ].sort((a, b) => a[1].localeCompare(b[1])),

    voice: [
      [20, "Connect"],
      [23, "Deafen Members"],
      [22, "Mute Members"],
      [24, "Move Members"],
      [21, "Speak"],
      [30, "Stream"],
      [31, "Use Soundboard"],
      [32, "Use External Sounds"],
      [33, "Use Embedded Activities"],
      [25, "Use Voice Activity"],
      [29, "Request to Speak"],
      [34, "Use Scheduled Events"],
      [26, "Priority Speaker"]
    ].sort((a, b) => a[1].localeCompare(b[1]))
  };

  function renderPermissions() {
    for (const category in permissions) {
      const container = document.getElementById(`${category}-perms`);
      permissions[category].forEach(([bit, name]) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.bit = bit;
        checkbox.addEventListener("change", updatePermissions);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(name));
        container.appendChild(label);
      });
    }
  }

  function updatePermissions() {
    let total = 0;
    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
      if (cb.checked) total |= 1 << parseInt(cb.dataset.bit);
    });
    permissionsInput.value = total;
    updateOAuthURL();
  }

  function updateOAuthURL() {
    const id = clientIdInput.value.trim();
    const scopes = Array.from(scopesSelect.selectedOptions).map(o => o.value);
    const perms = permissionsInput.value;
    const scopeStr = scopes.join("%20");
    const fullUrl = `https://discord.com/oauth2/authorize?client_id=${id}&scope=${scopeStr}&permissions=${perms}`;

    oauthLink.href = fullUrl;
    oauthLink.textContent = fullUrl;
  }

  clientIdInput.addEventListener("input", updateOAuthURL);
  scopesSelect.addEventListener("change", updateOAuthURL);

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(oauthLink.href);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy OAuth URL", 1500);
  });

  renderPermissions();
});
