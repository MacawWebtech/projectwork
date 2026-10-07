/* =========================================================================
   SWEET MOMENTS BAKERY — shared site behaviour
   Loaded on every page after Bootstrap's bundle.

   1. Reading direction (LTR / RTL) toggle
      - Every button with .js-dir-toggle flips <html dir> between "ltr"
        and "rtl" and remembers the choice in localStorage under
        "sweetMomentsDir". An inline one-liner at the top of <body>
        re-applies the saved direction before first paint.
   2. Theme toggle proxy
      - The header's #themeToggle is wired by each page's own dark-mode
        script. On phones that button lives in the mobile menu instead,
        so .js-theme-proxy buttons simply forward the click to it and
        mirror its icon/label.
   3. Direction-aware icons
      - Arrow / chevron glyphs get .icon-directional so RTL CSS can mirror
        them (an arrow pointing "forward" should point left in RTL).
========================================================================= */
(function () {
  "use strict";

  var DIR_KEY = "sweetMomentsDir";
  var root = document.documentElement;

  /* ---------- 1. direction ---------- */
  function currentDir() {
    return root.getAttribute("dir") === "rtl" ? "rtl" : "ltr";
  }

  function syncDirButtons() {
    var isRtl = currentDir() === "rtl";
    document.querySelectorAll(".js-dir-toggle").forEach(function (btn) {
      var label = isRtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout";
      btn.setAttribute("aria-pressed", isRtl ? "true" : "false");
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
      /* the button shows the direction it will switch TO */
      var short = btn.querySelector(".js-dir-short");
      if (short) short.textContent = isRtl ? "LTR" : "RTL";
      var text = btn.querySelector(".js-dir-label");
      if (text) text.textContent = isRtl ? "Left-to-right" : "Right-to-left";
    });
  }

  function setDir(dir) {
    root.setAttribute("dir", dir);
    try { localStorage.setItem(DIR_KEY, dir); } catch (e) {}
    syncDirButtons();
  }

  /* ---------- 2. theme proxy ---------- */
  function syncThemeProxies() {
    var dark = document.body.classList.contains("dark-mode");
    document.querySelectorAll(".js-theme-proxy").forEach(function (btn) {
      var icon = btn.querySelector(".material-symbols-outlined");
      var text = btn.querySelector(".js-theme-label");
      if (icon) icon.textContent = dark ? "dark_mode" : "light_mode";
      if (text) text.textContent = dark ? "Light mode" : "Dark mode";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
    });
  }

  /* ---------- 3. directional icons ---------- */
  var DIRECTIONAL = ["arrow_forward", "arrow_back", "chevron_right", "chevron_left",
    "east", "west", "arrow_right_alt", "keyboard_arrow_right", "keyboard_arrow_left",
    "arrow_forward_ios", "arrow_back_ios"];

  function markDirectionalIcons() {
    document.querySelectorAll(".material-symbols-outlined").forEach(function (el) {
      if (DIRECTIONAL.indexOf(el.textContent.trim()) !== -1) el.classList.add("icon-directional");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markDirectionalIcons();
    syncDirButtons();
    syncThemeProxies();

    document.querySelectorAll(".js-dir-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setDir(currentDir() === "rtl" ? "ltr" : "rtl");
      });
    });

    document.querySelectorAll(".js-theme-proxy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var main = document.getElementById("themeToggle");
        if (main) main.click();
        syncThemeProxies();
      });
    });

    var mainToggle = document.getElementById("themeToggle");
    if (mainToggle) mainToggle.addEventListener("click", function () {
      setTimeout(syncThemeProxies, 0);
    });

    /* close the mobile drawer after choosing a destination */
    var drawer = document.getElementById("mobileNavigation");
    if (drawer && window.bootstrap) {
      drawer.querySelectorAll("a[href]").forEach(function (link) {
        link.addEventListener("click", function () {
          var inst = window.bootstrap.Collapse.getInstance(drawer);
          if (inst) inst.hide();
        });
      });
    }
  });
})();
