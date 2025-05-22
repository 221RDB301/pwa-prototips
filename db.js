const dbName = 'pwa-notes';
let db;

const openDb = new Promise((resolve, reject) => {
  const request = indexedDB.open(dbName, 1);

  request.onerror = () => reject(request.error);

  request.onsuccess = () => {
    db = request.result;
    resolve();
  };

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('notes', { keyPath: 'id' });
  };
});

async function saveNote(note) {
  await openDb;
  const tx = db.transaction('notes', 'readwrite');
  tx.objectStore('notes').put(note);
  return tx.complete;
}

async function getAllNotes() {
  await openDb;
  return new Promise(resolve => {
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

async function getUnsyncedNotes() {
  const all = await getAllNotes();
  return all.filter(note => !note.synced);
}

async function updateNote(note) {
  await saveNote(note);
}

// Simulē nosūtīšanu uz serveri
async function sendToServer(note) {
  return new Promise(res => setTimeout(res, 1000)); // imitē tīkla pieprasījumu
}
