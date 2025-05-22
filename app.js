if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
  
  function updateStatusBar() {
    const bar = document.getElementById('status-bar');
    if (navigator.onLine) {
      bar.className = 'status-bar online';
      bar.textContent = 'Savienots ar internetu';
    } else {
      bar.className = 'status-bar offline';
      bar.textContent = 'Nav interneta savienojuma – tiek izmantots bezsaistes režīms';
    }
  }
  
  function showActionMessage(text) {
    const box = document.getElementById('action-status');
    box.textContent = text;
    box.style.display = 'block';
    setTimeout(() => {
      box.style.display = 'none';
    }, 4000);
  }
  
  window.addEventListener('online', () => {
    updateStatusBar();
    showActionMessage('Savienojums atjaunots! Sinhronizēju...');
    syncNotes();
  });
  
  window.addEventListener('offline', () => {
    updateStatusBar();
    showActionMessage('Bezsaistes režīms – dati tiks saglabāti lokāli.');
  });
  
  document.addEventListener('DOMContentLoaded', async () => {
    updateStatusBar();
    const notes = await getAllNotes();
    renderNotes(notes);
  });
  
  document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('note-input').value.trim();
    if (!text) return;
  
    const note = {
      id: Date.now(),
      text,
      date: new Date().toISOString(),
      synced: navigator.onLine
    };
  
    await saveNote(note);
    renderNotes(await getAllNotes(), note.id);
    document.getElementById('note-input').value = '';
  
    if (navigator.onLine) {
      showActionMessage('✅ Piezīme saglabāta un nosūtīta');
    } else {
      showActionMessage('📦 Piezīme saglabāta lokāli (offline)');
    }
  });
  
  async function syncNotes() {
    const unsynced = await getUnsyncedNotes();
    for (const note of unsynced) {
      await sendToServer(note);
      note.synced = true;
      await updateNote(note);
    }
    renderNotes(await getAllNotes());
    showActionMessage('🔁 Sinhronizācija veiksmīgi pabeigta!');
  }
  
  async function renderNotes(notes, highlightId = null) {
    const list = document.getElementById('note-list');
    list.innerHTML = '';
    notes.sort((a, b) => b.id - a.id);
    notes.forEach(note => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>${note.text}</div>
        <div class="meta">${new Date(note.date).toLocaleString()}</div>
      `;
      if (highlightId && note.id === highlightId) {
        li.classList.add('new');
        setTimeout(() => li.classList.remove('new'), 4000);
      }
      list.appendChild(li);
    });
  }
  