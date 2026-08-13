/* =====================================================================
   GLAM MASH-UP — SHARED CLIENT APP
   =====================================================================
   This file is loaded on both index.html and dresses.html. It exposes
   one function, GlamApp.init(config), which builds a full set of
   reels (spin machine + upload + delete gallery) for whatever
   categories you pass in.

   Every function that touches uploaded photos talks to the backend
   over fetch() — GET to load them, POST to upload, DELETE to remove —
   so the photos live in the server's database/disk, not the browser.
   That's what makes them survive a page refresh.
   ===================================================================== */

const GlamApp = (function(){

  /* ---------------------------------------------------------------
     STATE
     One entry per category, keyed by category.key. `uploaded` holds
     whatever the server told us this category has saved; `defaultItems`
     is the SVG placeholder set (from shapes.js) used only when
     `uploaded` is empty.
     --------------------------------------------------------------- */
  let CATEGORIES = [];          // set by init()
  const state = {};             // spinning/locked/currentIndex per category
  const uploaded = {};          // uploaded photo list per category, from the server

  function activeItems(key){
    return uploaded[key].length > 0 ? uploaded[key] : CATEGORIES.find(c => c.key === key).defaultItems;
  }

  /* ---------------------------------------------------------------
     BACKEND CALLS
     --------------------------------------------------------------- */

  // loads whatever photos are already saved for this category — called
  // once when the page first loads, so previous uploads are still there
  async function loadUploaded(key){
    try{
      const res = await fetch(`/api/items?category=${encodeURIComponent(key)}`);
      if(!res.ok) throw new Error('Failed to load items');
      uploaded[key] = await res.json(); // [{id, category, name, url, created_at}, ...]
    }catch(err){
      console.error(err);
      showServerStatus('Could not reach the server — is it running? (npm start)', true);
      uploaded[key] = [];
    }
  }

  // uploads one file for a category. Called once per selected file.
  // Just the category + the picture itself — no name is collected or
  // sent, so there's nothing to type before a photo goes up.
  async function uploadPhoto(key, file){
    const formData = new FormData();
    formData.append('category', key);
    formData.append('photo', file);

    const res = await fetch('/api/items', { method: 'POST', body: formData });
    if(!res.ok){
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json(); // {id, category, url}
  }

  // deletes one photo by id — removes it from the server's database
  // AND its file on disk. This is the only way a photo goes away.
  async function deletePhoto(id){
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Delete failed');
    return res.json();
  }

  function showServerStatus(msg, isError){
    const el = document.getElementById('serverStatus');
    if(!el) return;
    el.textContent = msg;
    el.classList.toggle('error', !!isError);
  }

  /* ---------------------------------------------------------------
     RENDERING
     --------------------------------------------------------------- */

  function renderReels(containerId){
    const reelsEl = document.getElementById(containerId);
    reelsEl.innerHTML = '';
    if(CATEGORIES.length === 1) reelsEl.classList.add('single');

    CATEGORIES.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'reel-card';
      card.innerHTML = `
        <div class="reel-label">${cat.label}</div>
        <div class="reel-window" id="win-${cat.key}"></div>
        <div class="reel-buttons">
          <button class="btn-reel-stop" id="stop-${cat.key}" disabled>Stop</button>
          <label class="upload-label" id="uploadLabel-${cat.key}">📸 Upload pics
            <input type="file" id="upload-${cat.key}" accept="image/*" multiple>
          </label>
        </div>
        <div class="gallery-heading">Your uploaded photos</div>
        <div class="gallery" id="gallery-${cat.key}"></div>
      `;
      reelsEl.appendChild(card);
      document.getElementById(`stop-${cat.key}`).addEventListener('click', () => stopReel(cat.key));
      document.getElementById(`upload-${cat.key}`).addEventListener('change', (e) => handleUploadInput(cat.key, e.target.files));
    });

    CATEGORIES.forEach(cat => {
      renderWindow(cat.key, 0, false);
      renderGallery(cat.key);
    });
  }

  function renderWindow(key, index, locked){
    const items = activeItems(key);
    const item = items[index % items.length];
    const win = document.getElementById(`win-${key}`);
    if(!win) return;
    win.classList.toggle('spinning', state[key].spinning);
    win.classList.toggle('locked', locked);
    // uploaded real photos show with no name label — just the picture.
    // the SVG sticker placeholders keep their name label, since it's
    // genuinely useful when you're browsing the default set.
    if(item.url){
      win.innerHTML = `<img src="${item.url}" alt="uploaded photo">`;
    }else{
      win.innerHTML = item.svg + `<div class="item-name">${item.name}</div>`;
    }
  }

  // draws the little thumbnail gallery under a reel card, one thumbnail
  // per uploaded photo, each with its own × delete button
  function renderGallery(key){
    const galleryEl = document.getElementById(`gallery-${key}`);
    if(!galleryEl) return;
    const photos = uploaded[key];
    if(photos.length === 0){
      galleryEl.innerHTML = '<div class="gallery-empty">none yet — using sticker placeholders</div>';
      return;
    }
    galleryEl.innerHTML = photos.map(p => `
      <div class="gallery-item">
        <img src="${p.url}" alt="uploaded photo">
        <button class="delete-btn" data-id="${p.id}" data-key="${key}" title="Delete this photo">×</button>
      </div>
    `).join('');
    // wire up every delete button just rendered
    galleryEl.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => onDeleteClick(btn.dataset.key, Number(btn.dataset.id)));
    });
  }

  async function onDeleteClick(key, id){
    try{
      await deletePhoto(id);
      uploaded[key] = uploaded[key].filter(p => p.id !== id);
      // if the reel is currently showing the photo we just deleted
      // (or any photo, to be safe), redraw it from the now-updated list
      state[key].currentIndex = 0;
      state[key].locked = false;
      renderWindow(key, 0, false);
      renderGallery(key);
      renderBoard();
    }catch(err){
      console.error(err);
      showServerStatus('Could not delete that photo — check the server is running.', true);
    }
  }

  async function handleUploadInput(key, fileList){
    const files = Array.from(fileList).slice(0, 10 - uploaded[key].length);
    if(files.length === 0) return;
    const label = document.getElementById(`uploadLabel-${key}`);
    label.classList.add('uploading');
    label.childNodes[0].textContent = '⏳ Uploading...';

    try{
      for(const file of files){
        const saved = await uploadPhoto(key, file);
        uploaded[key].unshift(saved); // newest first, matches server order
      }
      renderGallery(key);
    }catch(err){
      console.error(err);
      showServerStatus(err.message || 'Upload failed', true);
    }finally{
      label.classList.remove('uploading');
      label.childNodes[0].textContent = '📸 Upload pics';
    }
  }

  /* ---------------------------------------------------------------
     SPIN MACHINE (same mechanic as before: random swap every 90ms,
     Stop locks one item in and plays a landing animation)
     --------------------------------------------------------------- */

  function updateGlobalButtons(startBtn, stopAllBtn){
    const anySpinning = CATEGORIES.some(c => state[c.key].spinning);
    stopAllBtn.disabled = !anySpinning;
    startBtn.disabled = anySpinning;
  }

  function startAll(){
    const lookAlert = document.getElementById('lookAlert');
    if(lookAlert) lookAlert.textContent = '';
    CATEGORIES.forEach(cat => {
      const s = state[cat.key];
      s.locked = false;
      s.spinning = true;
      const stopBtn = document.getElementById(`stop-${cat.key}`);
      if(stopBtn) stopBtn.disabled = false;
      s.intervalId = setInterval(() => {
        const items = activeItems(cat.key);
        s.currentIndex = Math.floor(Math.random() * items.length);
        renderWindow(cat.key, s.currentIndex, false);
      }, 90);
    });
    updateGlobalButtons(document.getElementById('startBtn'), document.getElementById('stopAllBtn'));
    renderBoard();
  }

  function stopReel(key){
    const s = state[key];
    if(!s.spinning) return;
    clearInterval(s.intervalId);
    s.spinning = false;
    s.locked = true;
    s.currentIndex = Math.floor(Math.random() * activeItems(key).length);
    renderWindow(key, s.currentIndex, true);
    const stopBtn = document.getElementById(`stop-${key}`);
    if(stopBtn) stopBtn.disabled = true;
    updateGlobalButtons(document.getElementById('startBtn'), document.getElementById('stopAllBtn'));
    renderBoard();

    const allLocked = CATEGORIES.every(c => state[c.key].locked);
    const lookAlert = document.getElementById('lookAlert');
    if(allLocked && lookAlert){
      const lines = ["Look at you, full glam mode!", "This outfit has main-character energy.", "Mismatched and iconic.", "Certified drip, zero rules.", "Ate and left no crumbs 💅"];
      lookAlert.textContent = lines[Math.floor(Math.random()*lines.length)];
    }
  }

  function stopAll(){
    CATEGORIES.forEach(cat => { if(state[cat.key].spinning) stopReel(cat.key); });
  }

  function resetRound(){
    CATEGORIES.forEach(cat => {
      const s = state[cat.key];
      clearInterval(s.intervalId);
      s.spinning = false;
      s.locked = false;
      s.currentIndex = 0;
      const stopBtn = document.getElementById(`stop-${cat.key}`);
      if(stopBtn) stopBtn.disabled = true;
      renderWindow(cat.key, 0, false);
    });
    const lookAlert = document.getElementById('lookAlert');
    if(lookAlert) lookAlert.textContent = '';
    updateGlobalButtons(document.getElementById('startBtn'), document.getElementById('stopAllBtn'));
    renderBoard();
  }

  function renderBoard(){
    const boardFrame = document.getElementById('boardFrame');
    if(!boardFrame) return; // dresses.html doesn't have a look board
    const lockedCats = CATEGORIES.filter(c => state[c.key].locked);
    if(lockedCats.length === 0){
      boardFrame.innerHTML = '<div class="empty-msg">Spin something to start building your look! ✨</div>';
      return;
    }
    boardFrame.innerHTML = lockedCats.map(cat => {
      const items = activeItems(cat.key);
      const item = items[state[cat.key].currentIndex % items.length];
      if(item.url){
        return `<div class="board-item"><img src="${item.url}" alt="uploaded photo"></div>`;
      }
      return `<div class="board-item">${item.svg}<span>${item.name}</span></div>`;
    }).join('');
  }

  /* ---------------------------------------------------------------
     SPARKLES (purely decorative background emoji)
     --------------------------------------------------------------- */
  function scatterSparkles(){
    const emojis = ['✨','💖','🎀','⭐','💫'];
    for(let i=0;i<14;i++){
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = emojis[i % emojis.length];
      s.style.left = Math.random()*100 + 'vw';
      s.style.top = Math.random()*100 + 'vh';
      s.style.animationDelay = (Math.random()*4) + 's';
      s.style.fontSize = (14 + Math.random()*16) + 'px';
      document.body.appendChild(s);
    }
  }

  /* ---------------------------------------------------------------
     PUBLIC INIT
     config = {
       categories: [{ key, label, names, shapeFns }, ...],
       reelsContainerId: 'reels',
       startBtnId, stopAllBtnId, resetBtnId  (all optional if absent from the page)
     }
     --------------------------------------------------------------- */
  async function init(config){
    CATEGORIES = config.categories.map(c => ({
      ...c,
      defaultItems: buildDefaultItems(c.names, c.shapeFns)
    }));
    CATEGORIES.forEach(cat => {
      state[cat.key] = { spinning:false, intervalId:null, currentIndex:0, locked:false };
      uploaded[cat.key] = [];
    });

    scatterSparkles();

    // fetch each category's saved photos from the server BEFORE the
    // first render, so uploads from a previous visit show up immediately
    await Promise.all(CATEGORIES.map(cat => loadUploaded(cat.key)));

    renderReels(config.reelsContainerId || 'reels');

    const startBtn = document.getElementById(config.startBtnId || 'startBtn');
    const stopAllBtn = document.getElementById(config.stopAllBtnId || 'stopAllBtn');
    const resetBtn = document.getElementById(config.resetBtnId || 'resetBtn');
    if(startBtn) startBtn.addEventListener('click', startAll);
    if(stopAllBtn) stopAllBtn.addEventListener('click', stopAll);
    if(resetBtn) resetBtn.addEventListener('click', resetRound);
    if(startBtn && stopAllBtn) updateGlobalButtons(startBtn, stopAllBtn);

    renderBoard();
  }

  return { init };
})();
