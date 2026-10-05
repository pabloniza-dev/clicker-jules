// Cookie helper functions
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const cName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cName) === 0) {
      return c.substring(cName.length, c.length);
    }
  }
  return "";
}

// State management
let count = 0;

// DOM Elements
const counterDisplay = document.getElementById('counter');
const cookieContainer = document.getElementById('cookieContainer');
const resetBtn = document.getElementById('resetBtn');

// Initialize count from cookie
const savedCount = getCookie('cookieClicks');
if (savedCount !== "") {
  count = parseInt(savedCount, 10) || 0;
}
counterDisplay.textContent = count;

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
