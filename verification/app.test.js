const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const htmlContent = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const scriptContent = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

function setupDOM(initialCookie = '') {
  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    url: 'http://localhost'
  });

  if (initialCookie) {
    dom.window.document.cookie = initialCookie;
  }

  const scriptEl = dom.window.document.createElement('script');
  scriptEl.textContent = scriptContent;
  dom.window.document.body.appendChild(scriptEl);

  return dom;
}

test('Initial state with no cookies', () => {
  const dom = setupDOM();
  const document = dom.window.document;

  const counter = document.getElementById('counter');
  assert.strictEqual(counter.textContent, '0');

  const trophy10 = document.getElementById('trophy-10');
  const trophy100 = document.getElementById('trophy-100');
  const trophy1000 = document.getElementById('trophy-1000');

  assert.strictEqual(trophy10.classList.contains('unlocked'), false);
  assert.strictEqual(trophy100.classList.contains('unlocked'), false);
  assert.strictEqual(trophy1000.classList.contains('unlocked'), false);
});

test('Clicking unlocks 10, 100, and 1000 achievements', () => {
  const dom = setupDOM();
  const document = dom.window.document;
  const cookieContainer = document.getElementById('cookieContainer');
  const counter = document.getElementById('counter');

  const trophy10 = document.getElementById('trophy-10');
  const trophy100 = document.getElementById('trophy-100');
  const trophy1000 = document.getElementById('trophy-1000');

  // Click 10 times
  for (let i = 0; i < 10; i++) {
    cookieContainer.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  }

  assert.strictEqual(counter.textContent, '10');
  assert.strictEqual(trophy10.classList.contains('unlocked'), true);
  assert.strictEqual(trophy100.classList.contains('unlocked'), false);
  assert.strictEqual(trophy1000.classList.contains('unlocked'), false);

  // Click 90 more times (total 100)
  for (let i = 0; i < 90; i++) {
    cookieContainer.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  }

  assert.strictEqual(counter.textContent, '100');
  assert.strictEqual(trophy10.classList.contains('unlocked'), true);
  assert.strictEqual(trophy100.classList.contains('unlocked'), true);
  assert.strictEqual(trophy1000.classList.contains('unlocked'), false);

  // Click 900 more times (total 1000)
  for (let i = 0; i < 900; i++) {
    cookieContainer.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  }

  assert.strictEqual(counter.textContent, '1000');
  assert.strictEqual(trophy10.classList.contains('unlocked'), true);
  assert.strictEqual(trophy100.classList.contains('unlocked'), true);
  assert.strictEqual(trophy1000.classList.contains('unlocked'), true);
});

test('Cookie persistence initializes saved state and trophy status', () => {
  const dom = setupDOM('cookieClicks=150');
  const document = dom.window.document;

  const counter = document.getElementById('counter');
  assert.strictEqual(counter.textContent, '150');

  const trophy10 = document.getElementById('trophy-10');
  const trophy100 = document.getElementById('trophy-100');
  const trophy1000 = document.getElementById('trophy-1000');

  assert.strictEqual(trophy10.classList.contains('unlocked'), true);
  assert.strictEqual(trophy100.classList.contains('unlocked'), true);
  assert.strictEqual(trophy1000.classList.contains('unlocked'), false);
});

test('Reset button clears counter, updates cookie, and relocks trophies', () => {
  const dom = setupDOM('cookieClicks=500');
  const document = dom.window.document;

  const resetBtn = document.getElementById('resetBtn');
  const counter = document.getElementById('counter');
  const trophy10 = document.getElementById('trophy-10');
  const trophy100 = document.getElementById('trophy-100');

  assert.strictEqual(counter.textContent, '500');
  assert.strictEqual(trophy10.classList.contains('unlocked'), true);
  assert.strictEqual(trophy100.classList.contains('unlocked'), true);

  resetBtn.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

  assert.strictEqual(counter.textContent, '0');
  assert.strictEqual(trophy10.classList.contains('unlocked'), false);
  assert.strictEqual(trophy100.classList.contains('unlocked'), false);
  assert.ok(document.cookie.includes('cookieClicks=0'));
});
