// ==UserScript==
// @name         Prostasia
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Schedule multiple Athena's City Protection spells on different cities at different times
// @author       NocteAvem
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @grant        none
// @icon         https://i.postimg.cc/kghr7w8N/protection.png
// @downloadURL  https://raw.githubusercontent.com/georgeadono/grepolis_autoCityProtection/refs/heads/main/prostasia.js
// @updateURL    https://raw.githubusercontent.com/georgeadono/grepolis_autoCityProtection/refs/heads/main/prostasia.js
// ==/UserScript==

// Obfuscate the script before deploying
//javascript-obfuscator prostasia.js --output prostasia.obf.js

(function (pageScript) {
  var script = document.createElement("script");
  script.textContent = "(" + pageScript.toString() + ")();";
  document.documentElement.appendChild(script);
})(function () {
  // --- UI Setup ---
  const bod2 = document.body;

  const startDiv = document.createElement("div");
  startDiv.className = "startDiv";
  startDiv.style.top = "560px";
  startDiv.style.left = "20px";
  startDiv.style.position = "absolute";
  startDiv.style.zIndex = "9999";
  startDiv.style.backgroundColor = "white";
  startDiv.style.border = "1px solid black";
  startDiv.style.textAlign = "center";
  startDiv.style.padding = "0";
  startDiv.style.minWidth = "260px";

  const titleDiv = document.createElement("div");
  titleDiv.className = "titleDiv";
  titleDiv.style.padding = "10px";
  titleDiv.style.cursor = "move";
  titleDiv.style.zIndex = "10";
  titleDiv.style.backgroundColor = "#f8de7e";
  titleDiv.style.color = "#333";
  titleDiv.style.fontWeight = "bold";
  titleDiv.style.textShadow = "1px 1px 2px #fff8dc";
  titleDiv.innerText = "Athena Protection Scheduler";

  const containerDiv = document.createElement("div");
  containerDiv.style.backgroundColor = "antiquewhite";
  containerDiv.style.display = "flex";
  containerDiv.style.flexDirection = "column";
  containerDiv.style.padding = "10px";

  // City ID input
  const townInput = document.createElement("input");
  townInput.type = "number";
  townInput.min = "0";
  townInput.placeholder = "Target City ID";
  townInput.style.marginBottom = "5px";
  townInput.style.width = "90px";

  // --- Time Inputs Row ---
  const spellHourInput = document.createElement("input");
  const spellMinuteInput = document.createElement("input");
  const spellSecondInput = document.createElement("input");
  const timeRow = document.createElement("div");
  timeRow.style.display = "flex";
  timeRow.style.flexDirection = "row";
  timeRow.style.gap = "3px";
  timeRow.style.justifyContent = "center";
  timeRow.style.marginBottom = "5px";

  // Hour input
  spellHourInput.type = "number";
  spellHourInput.min = "0";
  spellHourInput.max = "23";
  spellHourInput.placeholder = "HH";
  spellHourInput.style.width = "34px";
  spellHourInput.style.textAlign = "center";
  spellHourInput.style.marginBottom = "0";

  // Minute input
  spellMinuteInput.type = "number";
  spellMinuteInput.min = "0";
  spellMinuteInput.max = "59";
  spellMinuteInput.placeholder = "MM";
  spellMinuteInput.style.width = "34px";
  spellMinuteInput.style.textAlign = "center";
  spellMinuteInput.style.marginBottom = "0";

  // Second input
  spellSecondInput.type = "number";
  spellSecondInput.min = "0";
  spellSecondInput.max = "59";
  spellSecondInput.placeholder = "SS";
  spellSecondInput.style.width = "34px";
  spellSecondInput.style.textAlign = "center";
  spellSecondInput.style.marginBottom = "0";

  // Add time inputs to row
  timeRow.appendChild(spellHourInput);
  timeRow.appendChild(spellMinuteInput);
  timeRow.appendChild(spellSecondInput);

  // Schedule button
  const spellButton = document.createElement("button");
  spellButton.innerText = "ADD SCHEDULE";
  spellButton.style.marginBottom = "5px";

  // Schedules list
  const schedulesDiv = document.createElement("div");
  schedulesDiv.style.display = "flex";
  schedulesDiv.style.flexDirection = "column";
  schedulesDiv.style.gap = "6px";
  schedulesDiv.style.marginTop = "10px";

  // Add elements to container
  containerDiv.appendChild(townInput);
  containerDiv.appendChild(timeRow);
  containerDiv.appendChild(spellButton);
  containerDiv.appendChild(schedulesDiv);

  startDiv.appendChild(titleDiv);
  startDiv.appendChild(containerDiv);
  bod2.append(startDiv);

  // --- Add toggle button to .nui_main_menu .bottom ---
  const toggleBtn = document.createElement("button");
  toggleBtn.innerHTML =
    '<img src="https://raw.githubusercontent.com/yourusername/yourrepo/main/assets/protection.png" alt="Shield" style="width:20px;height:20px;vertical-align:middle;">';
  toggleBtn.title = "Show/Hide Athena Protection Scheduler";
  toggleBtn.style.zIndex = "10000";
  toggleBtn.style.fontSize = "18px";
  toggleBtn.style.background = "gold";
  toggleBtn.style.border = "1px solid #bfa100";
  toggleBtn.style.borderRadius = "6px";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.margin = "4px";
  toggleBtn.style.position = "absolute";
  toggleBtn.style.right = "8px";
  toggleBtn.style.bottom = "8px";

  // Place the button in the .nui_main_menu .bottom div
  const mainMenuBottom = document.querySelector(".nui_main_menu .bottom");
  if (mainMenuBottom) {
    // Only set position: relative if not already set, to avoid layout issues
    if (getComputedStyle(mainMenuBottom).position === "static") {
      mainMenuBottom.style.position = "relative";
    }
    mainMenuBottom.appendChild(toggleBtn);
  }

  // Hide the scheduler window by default
  startDiv.style.display = "none";

  // Toggle window on button click
  toggleBtn.addEventListener("click", function () {
    startDiv.style.display = startDiv.style.display === "none" ? "" : "none";
  });

  // --- Window Movement ---
  let elem = titleDiv,
    par = startDiv,
    x = 0,
    y = 0,
    mousedown = false;

  elem.addEventListener(
    "mousedown",
    function (e) {
      mousedown = true;
      x = par.offsetLeft - e.clientX;
      y = par.offsetTop - e.clientY;
      e.preventDefault();
    },
    true
  );

  document.addEventListener(
    "mouseup",
    function () {
      mousedown = false;
    },
    true
  );

  elem.addEventListener(
    "mousemove",
    function (e) {
      if (mousedown) {
        par.style.left = e.clientX + x + "px";
        par.style.top = e.clientY + y + "px";
      }
    },
    true
  );

  // --- Multiple Schedules Logic ---
  let scheduleList = [];

  spellButton.addEventListener("click", function () {
    const targetTownId = parseInt(townInput.value, 10);
    const hour = parseInt(spellHourInput.value, 10);
    const minute = parseInt(spellMinuteInput.value, 10);
    const second = parseInt(spellSecondInput.value, 10);

    if (
      !targetTownId ||
      isNaN(hour) ||
      hour < 0 ||
      hour > 23 ||
      isNaN(minute) ||
      minute < 0 ||
      minute > 59 ||
      isNaN(second) ||
      second < 0 ||
      second > 59
    ) {
      alert(
        "Please enter a valid city ID, hour (0-23), minute (0-59), and second (0-59)."
      );
      return;
    }

    addSchedule(targetTownId, hour, minute, second);
  });

  function addSchedule(targetTownId, hour, minute, second) {
    // UI row for this schedule
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.background = "#f5f5dc";
    row.style.border = "1px solid #ccc";
    row.style.padding = "3px 5px";
    row.style.fontSize = "13px";

    const info = document.createElement("span");
    info.innerText = `City: ${targetTownId} @ ${hour
      .toString()
      .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")}`;

    const status = document.createElement("span");
    status.innerText = "Scheduled";
    status.style.marginLeft = "6px";
    status.style.color = "#333";

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.style.backgroundColor = "#e57373";
    cancelBtn.style.color = "#fff";
    cancelBtn.style.border = "none";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.padding = "2px 8px";
    cancelBtn.style.fontSize = "12px";
    cancelBtn.style.marginLeft = "6px";

    row.appendChild(info);
    row.appendChild(status);
    row.appendChild(cancelBtn);
    schedulesDiv.appendChild(row);

    // Schedule logic
    let intervalId = setInterval(async function () {
      const now = new Date();
      if (
        now.getHours() === hour &&
        now.getMinutes() === minute &&
        now.getSeconds() >= second - 3 &&
        now.getSeconds() <= second + 2
      ) {
        status.innerText = `Spamming at ${now.getSeconds()}s...`;
        await castProtection(targetTownId, status);
      }
      if (
        now.getHours() === hour &&
        now.getMinutes() === minute &&
        now.getSeconds() > second + 2
      ) {
        status.innerText = "Done!";
        clearInterval(intervalId);
      }
    }, 200);

    cancelBtn.addEventListener("click", function () {
      clearInterval(intervalId);
      status.innerText = "Cancelled";
      cancelBtn.disabled = true;
      row.style.opacity = "0.6";
      row.remove();
    });

    // Keep reference if you want to manage schedules later
    scheduleList.push({ intervalId, row });
  }

  async function castProtection(targetTownId, statusElem) {
    try {
      // Find a city with Athena
      const myTowns = uw.MM.getCollections().Town[0].models;
      let athenaTown = null;
      for (let t of myTowns) {
        if (t.attributes.god === "athena") {
          athenaTown = t;
          break;
        }
      }
      if (!athenaTown) {
        statusElem.innerText = "No Athena city!";
        return;
      }

      // Check favor (optional)
      let favor = ITowns.player_gods.attributes.athena_favor;
      if (favor < 130) {
        statusElem.innerText = "Not enough favor!";
        return;
      }

      let data = {
        model_url: "CastedPowers",
        action_name: "cast",
        arguments: {
          power_id: "town_protection",
          target_id: targetTownId,
          town_id: athenaTown.attributes.id,
          csrfToken: Game.csrfToken,
        },
      };

      gpAjax.ajaxPost("frontend_bridge", "execute", data, true);
      statusElem.innerText = "Protection cast!";
    } catch (e) {
      statusElem.innerText = "Error: " + e.message;
    }
  }
})();
