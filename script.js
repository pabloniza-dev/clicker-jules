(function () {
  'use strict';

  const SALT = 'c00k13_cl1ck3r_s3cr3t_s4lt_2025';

  function generateChecksum(valStr) {
    let hash = 0;
    const str = valStr + SALT;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
  return "";
}

// State management
let count = 0;

// DOM Elements
const counterDisplay = document.getElementById('counter');
const cookieContainer = document.getElementById('cookieContainer');
const resetBtn = document.getElementById('resetBtn');
const trophyCards = document.querySelectorAll('.trophy-card');

function updateAchievements() {
  trophyCards.forEach(card => {
    const threshold = parseInt(card.getAttribute('data-threshold'), 10);
    const statusElem = card.querySelector('.trophy-status');
    if (count >= threshold) {
      card.classList.add('unlocked');
      if (statusElem) statusElem.textContent = 'Unlocked!';
    } else {
      card.classList.remove('unlocked');
      if (statusElem) statusElem.textContent = 'Locked';
    }
  });
}

// Initialize count from cookie
const savedCount = getCookie('cookieClicks');
if (savedCount !== "") {
  count = parseInt(savedCount, 10) || 0;
}
counterDisplay.textContent = count;
updateAchievements();

// Event Listeners
cookieContainer.addEventListener('click', (e) => {
  count++;
  counterDisplay.textContent = count;
  setCookie('cookieClicks', count);
  updateAchievements();

  function encodeValue(value) {
    const rawStr = String(value);
    const checksum = generateChecksum(rawStr);
    const payload = `${rawStr}:${checksum}`;
    return btoa(payload);
  }

  const rect = cookieContainer.getBoundingClientRect();
  const x = e ? e.clientX - rect.left : 0;
  const y = e ? e.clientY - rect.top : 0;

      const rawValueStr = parts[0];
      const checksum = parts[1];

      if (generateChecksum(rawValueStr) === checksum) {
        const val = parseInt(rawValueStr, 10);
        return isNaN(val) ? null : val;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  // Cookie helper functions
  function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const encodedVal = encodeValue(value);
    document.cookie = `${name}=${encodeURIComponent(encodedVal)};${expires};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const cName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(cName) === 0) {
        const encodedVal = c.substring(cName.length, c.length);
        const decodedVal = decodeValue(encodedVal);
        if (decodedVal !== null) {
          return decodedVal;
        }
        return null;
      }
    }
    return null;
  }

  // State management
  let count = 0;

  // DOM Elements
  const counterDisplay = document.getElementById('counter');
  const cookieContainer = document.getElementById('cookieContainer');
  const resetBtn = document.getElementById('resetBtn');

  // Initialize count from cookie
  const savedCount = getCookie('cookieClicks');
  if (savedCount !== null) {
    count = savedCount;
  } else {
    count = 0;
  }
  counterDisplay.textContent = count;
  setCookie('cookieClicks', count);
  updateAchievements();
});
