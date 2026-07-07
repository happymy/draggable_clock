const PAGE_KEY = `clock-position-${window.location.hostname}`;
let clockTimer = null;

function savePosition(el) {
  try {
    const pos = {
      left: parseInt(el.style.left, 10) || 0,
      top: parseInt(el.style.top, 10) || 0
    };
    localStorage.setItem(PAGE_KEY, JSON.stringify(pos));
  } catch (e) {
    /* localStorage 不可用或已满 */
  }
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function updateClock(display) {
  const now = new Date();
  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  display.firstChild.textContent = `${h}:${m}`;
  display.lastChild.textContent = `:${s}`;
}

function createClock() {
  if (document.getElementById('draggable-clock')) return;
  if (clockTimer) clearInterval(clockTimer);

  const el = document.createElement('div');
  el.id = 'draggable-clock';

  const display = document.createElement('span');
  display.className = 'clock-display';
  display.appendChild(document.createTextNode(''));
  display.appendChild(document.createElement('span'));
  display.lastChild.className = 'seconds';
  el.appendChild(display);

  document.body.appendChild(el);

  try {
    const saved = localStorage.getItem(PAGE_KEY);
    if (saved) {
      const { left, top } = JSON.parse(saved);
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.right = 'auto';
    }
  } catch (e) {
    localStorage.removeItem(PAGE_KEY);
  }

  updateClock(display);
  clockTimer = setInterval(updateClock, 1000, display);

  let isDragging = false;
  let hasDragged = false;
  let offsetX, offsetY;

  el.addEventListener('mousedown', function(e) {
    isDragging = true;
    hasDragged = false;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
    el.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    hasDragged = true;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    el.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    el.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    el.style.right = 'auto';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    el.style.cursor = 'move';
    if (hasDragged) savePosition(el);
  });

  el.addEventListener('touchstart', function(e) {
    isDragging = true;
    hasDragged = false;
    const touch = e.touches[0];
    offsetX = touch.clientX - el.getBoundingClientRect().left;
    offsetY = touch.clientY - el.getBoundingClientRect().top;
  });

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    hasDragged = true;
    e.preventDefault();

    const touch = e.touches[0];
    const x = touch.clientX - offsetX;
    const y = touch.clientY - offsetY;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    el.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    el.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    el.style.right = 'auto';
  });

  document.addEventListener('touchend', function() {
    isDragging = false;
    if (hasDragged) savePosition(el);
  });

  el.addEventListener('click', function() {
    if (hasDragged) return;
    const url = new URL(window.location.href);
    url.searchParams.set('_rb', Date.now().toString(36));
    window.location.href = url.toString();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createClock);
} else {
  createClock();
}

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && !document.getElementById('draggable-clock')) {
        createClock();
        break;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
