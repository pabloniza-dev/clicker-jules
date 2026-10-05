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

  function encodeValue(value) {
    const rawStr = String(value);
    const checksum = generateChecksum(rawStr);
    const payload = `${rawStr}:${checksum}`;
    return btoa(payload);
  }

  function decodeValue(encodedStr) {
    if (!encodedStr) return null;
    try {
      const decoded = atob(encodedStr);
      const parts = decoded.split(':');
      if (parts.length !== 2) return null;

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

  // Prevent right click and DevTools shortcuts
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return;
    }

    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    if (ctrlOrCmd) {
      // Ctrl+Shift+I / J / C (Inspect/Console/Element)
      if (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return;
      }
      // Ctrl+U (View Source)
      if (e.key === 'U' || e.key === 'u' || e.keyCode === 85) {
        e.preventDefault();
        return;
      }
      // Ctrl+S (Save Page)
      if (e.key === 'S' || e.key === 's' || e.keyCode === 83) {
        e.preventDefault();
        return;
      }
    }
  });

  // Event Listeners
  cookieContainer.addEventListener('click', (e) => {
    count++;
    counterDisplay.textContent = count;
    setCookie('cookieClicks', count);

    // Create floating +1 animation
    const pop = document.createElement('div');
    pop.classList.add('click-pop');
    pop.textContent = '+1';

    const rect = cookieContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;

    cookieContainer.appendChild(pop);

    setTimeout(() => {
      pop.remove();
    }, 800);
  });

  resetBtn.addEventListener('click', () => {
    count = 0;
    counterDisplay.textContent = count;
    setCookie('cookieClicks', count);
  });
})();
