(function () {
  'use strict';

  // ---------- Config ----------
  var PASSWORD_HASH = '56533080816acfbf988d15e31399b7ba108b2e525abc68387256075d6f8d2693'; // sha256("2526")
  var BOOTH_TOKEN = 'm4u-booth-2026';
  var UNLOCK_KEY = 'm4u_booth_unlocked';
  var BRAND_HANDLE = '@memories4u';
  var BRAND_PHONE = '055-9696120';
  var GUEST_MESSAGE = 'תודה שבחרתם ב-Memories4U להיות חלק מהאירוע!\nהיה לנו לעונג ללוות אתכם ולתעד את הרגעים היפים.\nמצורפת התמונה שלכם באיכות מלאה, מוכנה לשימוש ולשיתוף.\nנתראה באירוע הבא ❤️\nMemories4U | ' + BRAND_PHONE;
  var FONT_OPTIONS = {
    script1: { label: 'כתב יד קלאסי', family: '"Great Vibes", cursive', noHebrew: true },
    script2: { label: 'כתב יד עגול', family: '"Dancing Script", cursive', noHebrew: true },
    serif: { label: 'קלאסי (סריף)', family: '"Playfair Display", serif', noHebrew: true },
    sans: { label: 'מודרני', family: '"Rubik", sans-serif' },
    playful: { label: 'קליל ודק', family: '"Amatic SC", sans-serif', noHebrew: true },
    casual: { label: 'יומיומי', family: '"Caveat", cursive', noHebrew: true },
    romantic: { label: 'רומנטי', family: '"Cormorant Garamond", serif', noHebrew: true },
    hebrewDeco: { label: 'עברי דקורטיבי', family: '"Suez One", serif' },
    hebrewSerif: { label: 'עברי סריף אלגנטי', family: '"Frank Ruhl Libre", serif' },
    hebrewThin: { label: 'עברי דק ומעודן', family: '"Bellefair", serif' },
    hebrewModern: { label: 'עברי מודרני נקי', family: '"Miriam Libre", sans-serif' },
    hebrewRound: { label: 'עברי עגול וידידותי', family: '"Secular One", sans-serif' },
    hebrewBold: { label: 'עברי מודגש וקריא', family: '"Heebo", sans-serif' },
    hebrewSerif2: { label: 'עברי סריף חגיגי', family: '"David Libre", serif' },
    slant1: { label: 'נטוי אלגנטי', family: '"Frank Ruhl Libre", serif', italic: true },
    slant2: { label: 'נטוי מודרני', family: '"Rubik", sans-serif', italic: true },
    slant3: { label: 'נטוי עגול', family: '"Secular One", sans-serif', italic: true },
    slant4: { label: 'נטוי רך', family: '"Miriam Libre", sans-serif', italic: true },
    englishBrush: { label: 'אנגלי - Brush אלגנטי', family: '"Alex Brush", cursive', noHebrew: true },
    englishAllura: { label: 'אנגלי - כתב יד זורם', family: '"Allura", cursive', noHebrew: true },
    englishParisienne: { label: 'אנגלי - פריזאי', family: '"Parisienne", cursive', noHebrew: true },
    englishTangerine: { label: 'אנגלי - עדין וקלאסי', family: '"Tangerine", cursive', noHebrew: true },
    englishPinyon: { label: 'אנגלי - חתונה קלאסית', family: '"Pinyon Script", cursive', noHebrew: true },
    englishDelafield: { label: 'אנגלי - כתב יד מקצועי', family: '"Mrs Saint Delafield", cursive', noHebrew: true },
    englishSacramento: { label: 'אנגלי - כתב יד דק וזורם', family: '"Sacramento", cursive', noHebrew: true },
    englishYellowtail: { label: 'אנגלי - Brush עבה', family: '"Yellowtail", cursive', noHebrew: true }
  };
  // Note: several of the Latin script fonts above (Great Vibes, Dancing
  // Script, Playfair Display, Amatic SC, Caveat, Cormorant Garamond, and
  // all the "english*" ones) don't include Hebrew glyphs - Hebrew text in
  // those falls back to a plain font. The "hebrew*" options are chosen
  // specifically because they do support Hebrew, and "english*" are
  // elegant script fonts meant for Latin-alphabet text (names, dates in
  // English etc.) rather than Hebrew. The "slant*" options apply a
  // synthetic italic/oblique lean (via canvas font-style, browser-
  // rendered even for fonts without a real italic face) on top of fonts
  // already confirmed to support Hebrew.
  // hebrewBold (Heebo) and hebrewSerif2 (David Libre) were checked by hand
  // against the rest of the Hebrew set for how they render both scripts
  // together, plus specifically the gershayim/geresh punctuation (״ ׳ -
  // common in Hebrew abbreviations like תשפ״ו) since that's easy to get
  // visually wrong even in a font that otherwise "supports Hebrew". Noto
  // Sans Hebrew was tested too and dropped - its gershayim renders as two
  // plain vertical bars that read like stray letters, not a quote mark.
  var FONT_PRELOAD = [
    '52px "Great Vibes"', '52px "Dancing Script"', 'italic 52px "Playfair Display"',
    '52px "Amatic SC"', '52px "Caveat"', 'italic 52px "Cormorant Garamond"', '52px "Suez One"',
    '52px "Frank Ruhl Libre"', '52px "Bellefair"', '52px "Miriam Libre"', '52px "Secular One"',
    '52px "Heebo"', '52px "David Libre"',
    'italic 52px "Frank Ruhl Libre"', 'italic 52px "Rubik"', 'italic 52px "Secular One"', 'italic 52px "Miriam Libre"',
    '52px "Alex Brush"', '52px "Allura"', '52px "Parisienne"', '52px "Tangerine"', '52px "Pinyon Script"'
  ];
  if (document.fonts && document.fonts.load) {
    FONT_PRELOAD.forEach(function (f) {
      document.fonts.load(f).catch(function () {});
    });
  }

  // ---------- Small helpers ----------
  var $ = function (id) { return document.getElementById(id); };
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    $(id).classList.add('active');
  }
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function sha256Hex(text) {
    var enc = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', enc).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  // ---------- Lock screen ----------
  if (sessionStorage.getItem(UNLOCK_KEY) === '1') {
    showScreen('screen-welcome');
  }
  $('lock-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var val = $('lock-input').value;
    sha256Hex(val).then(function (hex) {
      if (hex === PASSWORD_HASH) {
        sessionStorage.setItem(UNLOCK_KEY, '1');
        $('lock-error').textContent = '';
        showScreen('screen-welcome');
      } else {
        $('lock-error').textContent = 'סיסמה שגויה, נסו שוב';
        $('lock-input').value = '';
      }
    });
  });

  // ---------- Password gate on the way into real settings ----------
  // The camera screen's own back button only steps back to the branded
  // "ready" splash (screen-ready) - that page has no staff controls on
  // it either (just the start button), so it needs no password. The
  // password is only re-checked at the ONE real boundary: going from
  // screen-ready into actual settings (event info, print, gallery,
  // design editor) - that's the only gate a guest holding the iPad
  // could otherwise use to wander into staff controls.
  // What runs after a correct password - defaults to just landing back on
  // screen-welcome (the ready-back-btn path below), but a caller can pass
  // its own follow-up (e.g. the "no event loaded" prompt wants settings
  // to actually open, not just land on the welcome screen and stop).
  var adminModalOnSuccess = null;
  function openAdminModal(onSuccess) {
    adminModalOnSuccess = onSuccess || function () { showScreen('screen-welcome'); };
    $('admin-password-input').value = '';
    $('admin-password-error').textContent = '';
    $('admin-modal').classList.add('active');
    $('admin-password-input').focus();
  }
  function closeAdminModal() {
    $('admin-modal').classList.remove('active');
  }
  function submitAdminModal() {
    var val = $('admin-password-input').value;
    sha256Hex(val).then(function (hex) {
      if (hex === PASSWORD_HASH) {
        closeAdminModal();
        var onSuccess = adminModalOnSuccess;
        adminModalOnSuccess = null;
        if (onSuccess) onSuccess();
      } else {
        $('admin-password-error').textContent = 'סיסמה שגויה';
        $('admin-password-input').value = '';
      }
    });
  }
  $('camera-admin-btn').addEventListener('click', function () {
    stopCamera();
    showScreen('screen-ready');
  });
  $('ready-back-btn').addEventListener('click', function () { openAdminModal(); });
  $('admin-modal-cancel').addEventListener('click', closeAdminModal);
  $('admin-modal-confirm').addEventListener('click', submitAdminModal);
  $('admin-password-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitAdminModal();
  });

  // A Home Screen web app can resume a SUSPENDED session when reopened
  // instead of actually reloading anything - in that case no network
  // request happens at all, so a plain close/reopen alone doesn't
  // guarantee a fresh copy. This checks whether index.html on the server
  // references a newer app.js than the one actually running here, and if
  // so forces a genuine fresh navigation (not just reload(), which can
  // itself be served from the same stale state). Manual only, from the
  // "🔄 רענון" button in settings - staff asked for this to be something
  // THEY trigger on purpose after uploading an update, not something the
  // app decides to do on its own.
  var APP_VERSION = '20260920f';
  function checkForFreshVersion(manual) {
    if (/[?&]_fresh=/.test(location.search)) return;
    if (manual) toast('בודק אם יש עדכון…');
    fetch('index.html', { cache: 'no-store' }).then(function (res) { return res.text(); }).then(function (html) {
      var m = html.match(/app\.js\?v=([A-Za-z0-9]+)/);
      if (m && m[1] && m[1] !== APP_VERSION) {
        var sep = location.search ? '&' : '?';
        location.replace(location.pathname + location.search + sep + '_fresh=' + Date.now());
      } else if (manual) {
        toast('האפליקציה כבר מעודכנת');
      }
    }).catch(function () {
      if (manual) toast('לא הצלחתי לבדוק - יש בעיה בחיבור לאינטרנט');
    });
  }

  // Asks the browser to mark this site's storage as "persistent" - i.e.
  // exempt from the automatic cleanup iOS/Safari can otherwise do to
  // storage for a site that hasn't been opened in a while. Not a
  // guarantee (the OS can still refuse, or a person can still clear it
  // by hand), so this doesn't replace actually exporting/backing up
  // photos - it just lowers the odds of silent, automatic data loss.
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(function () {});
  }

  // ---------- IndexedDB gallery ----------
  var DB_NAME = 'm4u-photobooth';
  var STORE = 'photos';
  // Thumbnails live in their OWN small database so the photos database is
  // never touched or upgraded (an upgrade can be blocked by another open
  // copy of the app, which would stop photos from saving).
  var THUMB_DB_NAME = 'm4u-photobooth-thumbs';
  var THUMB_STORE = 'thumbs';
  var thumbDbPromise = new Promise(function (resolve) {
    try {
      var treq = indexedDB.open(THUMB_DB_NAME, 1);
      treq.onupgradeneeded = function () { treq.result.createObjectStore(THUMB_STORE, { keyPath: 'id' }); };
      treq.onsuccess = function () { resolve(treq.result); };
      treq.onerror = function () { resolve(null); };
      treq.onblocked = function () { resolve(null); };
    } catch (e) { resolve(null); }
  });
  var dbPromise = new Promise(function (resolve, reject) {
    var req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function () {
      req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
  // Every photo is tagged with whichever saved event is currently active
  // (see ACTIVE_EVENT_KEY below), so each event's gallery only ever shows
  // its own photos - loading a different saved event switches the whole
  // gallery to that event's own set, nothing mixes together.
  function dbAdd(blob, gifBlob, photoRects) {
    return dbPromise.then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        var req = tx.objectStore(STORE).add({ blob: blob, gifBlob: gifBlob || null, photoRects: photoRects || null, createdAt: Date.now(), eventName: getActiveEventName() });
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }
  function dbAll() {
    return dbPromise.then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readonly');
        var req = tx.objectStore(STORE).getAll();
        req.onsuccess = function () { resolve(req.result.sort(function (a, b) { return b.createdAt - a.createdAt; })); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }
  // Only one event's photos - photos saved before this feature existed
  // have no eventName, which reads back as '' (the same "no event
  // loaded" default), so they stay visible together as long as no named
  // event has claimed that bucket.
  function dbAllForEvent(eventName) {
    return dbAll().then(function (rows) {
      var name = eventName || '';
      return rows.filter(function (row) { return (row.eventName || '') === name; });
    });
  }
  function dbAllForActiveEvent() { return dbAllForEvent(getActiveEventName()); }
  function dbDelete(id) {
    return dbPromise.then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        thumbDbPromise.then(function (tdb) {
          if (tdb) { try { tdb.transaction(THUMB_STORE, 'readwrite').objectStore(THUMB_STORE).delete(id); } catch (e) {} }
        });
        var req = tx.objectStore(STORE).delete(id);
        req.onsuccess = function () { resolve(); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  // ---------- Gallery thumbnails ----------
  // The gallery grid used to load every photo at FULL size (up to 16
  // megapixels each) just to show a small tile - with over a hundred photos
  // that overwhelms the iPad and the tiles come up blank. Each photo now has
  // a small thumbnail (480px wide) kept in its own store, made at capture
  // time, and built once in the background for older photos that lack one.
  var THUMB_WIDTH = 480;
  function thumbFromDrawable(src, w, h) {
    var tw = Math.min(THUMB_WIDTH, w), th = Math.max(1, Math.round(h * tw / w));
    var c = document.createElement('canvas');
    c.width = tw;
    c.height = th;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, tw, th);
    return new Promise(function (resolve) { c.toBlob(resolve, 'image/jpeg', 0.85); });
  }
  function thumbFromBlob(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onerror = function () { URL.revokeObjectURL(img.src); reject(new Error('decode')); };
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        thumbFromDrawable(img, w, h).then(function (t) { URL.revokeObjectURL(img.src); resolve(t); });
      };
      img.src = URL.createObjectURL(blob);
    });
  }
  function dbPutThumb(id, blob) {
    if (!blob) return Promise.resolve();
    return thumbDbPromise.then(function (db) {
      if (!db) return;
      return new Promise(function (resolve) {
        var tx = db.transaction(THUMB_STORE, 'readwrite');
        tx.objectStore(THUMB_STORE).put({ id: id, blob: blob });
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      });
    });
  }
  function dbAllThumbs() {
    return thumbDbPromise.then(function (db) {
      return new Promise(function (resolve) {
        var map = {};
        if (!db) { resolve(map); return; }
        var req = db.transaction(THUMB_STORE, 'readonly').objectStore(THUMB_STORE).getAll();
        req.onsuccess = function () { req.result.forEach(function (t) { map[t.id] = t.blob; }); resolve(map); };
        req.onerror = function () { resolve(map); };
      });
    });
  }

  // ---------- Event settings (title/date printed on the strip) ----------
  var EVENT_KEY = 'm4u_event_info';
  function getEventInfo() {
    try {
      return JSON.parse(localStorage.getItem(EVENT_KEY)) || { title: '', date: '' };
    } catch (e) {
      return { title: '', date: '' };
    }
  }
  // Uses a normal on-screen modal rather than window.prompt() - a
  // blocking native dialog was found to freeze the live camera <video>
  // on iOS (it doesn't reliably resume decoding once the dialog closes).
  // Auto-saves as you type (so forgetting to tap "שמירה" can no longer
  // lose a typed title/date), but Cancel restores exactly what was here
  // when the modal opened - not "commit whatever's currently in the
  // field". An earlier version made Cancel commit too, on the reasoning
  // that staff losing typed details by tapping the wrong button was the
  // bigger risk - but that has its own failure mode: an accidental edit
  // (stray tap, autocorrect, whatever) followed by an instinctive Cancel
  // would silently commit the accident instead of discarding it. This
  // way neither failure mode exists: typing is never lost (autosave),
  // and Cancel is a real undo back to the last known-good value.
  var eventInfoSnapshot = null;
  var eventInfoAutosaveTimer = null;
  $('event-settings-btn').addEventListener('click', function () {
    var current = getEventInfo();
    $('event-title-input').value = current.title || '';
    $('event-date-input').value = current.date || '';
    eventInfoSnapshot = { title: current.title || '', date: current.date || '' };
    $('event-modal').classList.add('active');
  });
  function commitEventInfo() {
    var title = $('event-title-input').value.trim();
    var date = $('event-date-input').value.trim();
    localStorage.setItem(EVENT_KEY, JSON.stringify({ title: title, date: date }));
    syncActiveEvent();
  }
  function scheduleEventInfoAutosave() {
    clearTimeout(eventInfoAutosaveTimer);
    eventInfoAutosaveTimer = setTimeout(commitEventInfo, 500);
  }
  $('event-title-input').addEventListener('input', scheduleEventInfoAutosave);
  $('event-date-input').addEventListener('input', scheduleEventInfoAutosave);
  $('event-modal-cancel').addEventListener('click', function () {
    clearTimeout(eventInfoAutosaveTimer);
    if (eventInfoSnapshot) {
      localStorage.setItem(EVENT_KEY, JSON.stringify(eventInfoSnapshot));
      syncActiveEvent();
    }
    $('event-modal').classList.remove('active');
  });
  $('event-modal-save').addEventListener('click', function () {
    clearTimeout(eventInfoAutosaveTimer);
    commitEventInfo();
    $('event-modal').classList.remove('active');
    toast('פרטי האירוע נשמרו');
  });

  // ---------- Capture mode (strip of 3 vs. one wide photo) ----------
  // Staff-only setting (chosen once per event in the ⚙️ settings panel on
  // the welcome screen) - guests never see or touch this.
  var MODE_KEY = 'm4u_capture_mode';
  var captureMode = localStorage.getItem(MODE_KEY) || 'strip';
  function setCaptureMode(mode) {
    captureMode = mode;
    localStorage.setItem(MODE_KEY, mode);
    $('settings-mode-strip').classList.toggle('active', mode === 'strip');
    $('settings-mode-wide').classList.toggle('active', mode === 'wide');
  }
  $('settings-mode-strip').addEventListener('click', function () { setCaptureMode('strip'); syncActiveEvent(); });
  $('settings-mode-wide').addEventListener('click', function () { setCaptureMode('wide'); syncActiveEvent(); });
  setCaptureMode(captureMode);

  // ---------- Welcome screen ----------
  var WELCOME_BG_KEY = 'm4u_welcome_bg';
  function applyWelcomeBg() {
    var bg = localStorage.getItem(WELCOME_BG_KEY);
    $('screen-welcome').style.backgroundImage = bg ? 'url(' + bg + ')' : '';
    $('screen-welcome').classList.toggle('has-bg', !!bg);
  }
  applyWelcomeBg();

  // Shooting without an event loaded used to fall into an unlabeled
  // "general album" nobody could reliably find again later - blocked now,
  // staff has to load or create a named event first.
  $('welcome-start-btn').addEventListener('click', function () {
    if (!getActiveEventName()) {
      $('no-event-panel').classList.add('active');
      return;
    }
    showScreen('screen-ready');
  });
  $('ready-start-btn').addEventListener('click', function () {
    showScreen('screen-camera');
    startCamera();
  });
  function openSettingsPanel() {
    $('settings-panel').classList.add('active');
    renderSavedEventsList();
    setActiveEventName(getActiveEventName());
  }
  $('welcome-settings-btn').addEventListener('click', openSettingsPanel);
  $('no-event-cancel-btn').addEventListener('click', function () {
    $('no-event-panel').classList.remove('active');
  });
  $('no-event-open-settings-btn').addEventListener('click', function () {
    $('no-event-panel').classList.remove('active');
    // Same password gate as the camera screen's own way into settings -
    // this prompt can be reached by anyone tapping "התחילו לצלם" (a guest
    // included, if staff forgot to load an event first), so it needs the
    // same protection, not a free pass straight into staff controls.
    openAdminModal(function () {
      showScreen('screen-welcome');
      openSettingsPanel();
    });
  });
  $('archived-events-btn').addEventListener('click', function () {
    renderArchivedEventsList();
    $('archive-panel').classList.add('active');
  });
  $('archive-close-btn').addEventListener('click', function () {
    $('archive-panel').classList.remove('active');
  });
  $('check-update-btn').addEventListener('click', function () { checkForFreshVersion(true); });
  // Without this, once ANY event is ever loaded there was no way back to
  // "nothing loaded" - it just stays stuck as active forever (including
  // across closing/reopening the app), so the "צריך לטעון אירוע" camera
  // gate could never fire again after the very first event. This is the
  // deliberate reset staff taps at the end of a night, so tomorrow's
  // first "התחילו לצלם" is forced to pick the right new event on purpose
  // instead of silently reusing yesterday's.
  $('clear-active-event-btn').addEventListener('click', function () {
    if (!getActiveEventName()) { toast('אין אירוע פעיל'); return; }
    setActiveEventName('');
    toast('האירוע הפעיל נוקה - יידרש לטעון אירוע כדי לצלם');
  });
  // Staff-only "step away" toggle - covers the whole screen so a guest
  // never sees an idle camera (or worse, wanders into settings) while
  // nobody's there to help. Persisted so an accidental reload while staff
  // is away doesn't silently drop the guard and expose the camera.
  var BRB_KEY = 'm4u_brb_active';
  function setBrbActive(active) {
    localStorage.setItem(BRB_KEY, active ? '1' : '');
    $('brb-overlay').classList.toggle('active', active);
    $('brb-toggle-btn').textContent = active ? '✅ חזרתי - סגירת ההודעה' : '🚻 תכף נשוב';
  }
  setBrbActive(localStorage.getItem(BRB_KEY) === '1');
  $('brb-toggle-btn').addEventListener('click', function () {
    var turningOn = localStorage.getItem(BRB_KEY) !== '1';
    setBrbActive(turningOn);
    // Turning BRB ON is meant to hide the app from view right away - if
    // the settings panel stayed open on top, staff would still have to
    // separately close it before the "be right back" screen actually
    // shows, which defeats stepping away quickly. Closing it here makes
    // pressing the toggle itself the one action that shows the overlay.
    if (turningOn) {
      $('settings-panel').classList.remove('active');
      flushActiveEventSync();
    }
  });
  // The overlay's own gear (same corner as the welcome screen's) is the
  // only way back once BRB is on - without it, turning BRB on would
  // strand staff outside the app. Password-gated so a guest who notices
  // and taps it still can't "wander into settings" (the exact thing this
  // overlay exists to prevent) - only someone who knows the admin
  // password gets through. On success it turns BRB off and drops straight
  // onto the home screen (not into the settings panel) - typing the
  // password here means "I'm back", so it should hand back the whole
  // normal app immediately, gallery included, not one more menu to dig
  // through and close before anything else becomes reachable again.
  $('brb-settings-btn').addEventListener('click', function () {
    openAdminModal(function () {
      setBrbActive(false);
      showScreen('screen-welcome');
    });
  });
  $('settings-close-btn').addEventListener('click', function () {
    $('settings-panel').classList.remove('active');
    flushActiveEventSync();
  });
  $('welcome-bg-input').addEventListener('change', function () {
    var file = this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      localStorage.setItem(WELCOME_BG_KEY, reader.result);
      applyWelcomeBg();
      syncActiveEvent();
      toast('הרקע נשמר');
    };
    reader.readAsDataURL(file);
  });
  $('welcome-bg-clear-btn').addEventListener('click', function () {
    localStorage.removeItem(WELCOME_BG_KEY);
    applyWelcomeBg();
    syncActiveEvent();
    toast('הרקע אופס');
  });

  // Which saved event new photos get tagged with (see dbAdd above) - ''
  // means no named event has been loaded/saved yet, the general bucket
  // used before this feature existed.
  var ACTIVE_EVENT_KEY = 'm4u_active_event';
  function getActiveEventName() { return localStorage.getItem(ACTIVE_EVENT_KEY) || ''; }
  function setActiveEventName(name) {
    localStorage.setItem(ACTIVE_EVENT_KEY, name || '');
    var label = $('active-event-label');
    if (label) label.textContent = name ? ('📌 אירוע פעיל כרגע: ' + name) : 'לא נטען אירוע - צריך לטעון אחד';
  }

  // ---------- Saved events (prepare several events in advance, switch
  // between them) - snapshots event title/date, capture mode, welcome
  // background and both designs under a name, loadable any time. ----------
  var SAVED_EVENTS_KEY = 'm4u_saved_events';
  // Keeps the main "אירועים שמורים" list from growing forever - staff
  // saving a 6th+ event doesn't fail, it's just parked in the "📁 אירועים
  // שמורים בתיקייה" folder automatically instead (entry.archived: true),
  // reachable from the button next to the "הגדרות אירוע" title.
  var MAX_MAIN_EVENTS = 5;
  function getSavedEvents() {
    try { return JSON.parse(localStorage.getItem(SAVED_EVENTS_KEY)) || []; } catch (e) { return []; }
  }
  function setSavedEvents(list) {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(list));
  }
  function getMainSavedEvents(list) { return (list || getSavedEvents()).filter(function (e) { return !e.archived; }); }
  function getArchivedSavedEvents(list) { return (list || getSavedEvents()).filter(function (e) { return !!e.archived; }); }
  function snapshotCurrentSetup() {
    return {
      eventInfo: getEventInfo(),
      captureMode: captureMode,
      welcomeBg: localStorage.getItem(WELCOME_BG_KEY) || null,
      bgMode: localStorage.getItem(BG_MODE_KEY) || 'none',
      stripDesign: getStripDesign(),
      wideDesign: getWideDesign()
    };
  }
  function applySavedSetup(setup, name) {
    localStorage.setItem(EVENT_KEY, JSON.stringify(setup.eventInfo || { title: '', date: '' }));
    setCaptureMode(setup.captureMode || 'strip');
    if (setup.welcomeBg) {
      localStorage.setItem(WELCOME_BG_KEY, setup.welcomeBg);
    } else {
      localStorage.removeItem(WELCOME_BG_KEY);
    }
    applyWelcomeBg();
    setBgMode(setup.bgMode || 'none');
    if (setup.stripDesign) saveDesign(STRIP_DESIGN_KEY, setup.stripDesign);
    if (setup.wideDesign) saveDesign(WIDE_DESIGN_KEY, setup.wideDesign);
    // start decoding this event's logos now, so the first photo has them ready
    if (setup.stripDesign) preloadDesignImages(setup.stripDesign);
    if (setup.wideDesign) preloadDesignImages(setup.wideDesign);
    setActiveEventName(name);
  }
  function findEventIndexByName(list, name) {
    for (var i = 0; i < list.length; i++) { if (list[i].name === name) return i; }
    return -1;
  }
  // Shared by the main "אירועים שמורים" list and the "📁 אירועים שמורים
  // בתיקייה" archive folder - same row, same actions (rename/load/copy/
  // delete), except the one "move" button flips direction depending on
  // which list this row lives in right now.
  function buildSavedEventRow(entry, archived) {
    var row = document.createElement('div');
    row.className = 'saved-event-row';
    var topRow = document.createElement('div');
    topRow.className = 'saved-event-row-top';
    var actionsRow = document.createElement('div');
    actionsRow.className = 'saved-event-row-actions';
    var name = document.createElement('span');
    name.className = 'saved-event-name';
    name.textContent = entry.name;

    function refreshBoth() {
      renderSavedEventsList();
      renderArchivedEventsList();
    }

    var renameBtn = document.createElement('button');
    renameBtn.type = 'button';
    renameBtn.className = 'btn btn-ghost';
    renameBtn.innerHTML = '✏️<span class="btn-icon-label">שינוי שם</span>';
    renameBtn.title = 'שינוי שם האירוע';
    renameBtn.addEventListener('click', function () {
      // Inline edit instead of window.prompt() - same reason as the
      // event-info/print-bridge modals: a blocking native dialog was
      // found to freeze the live camera on iOS.
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'saved-event-name-input';
      input.value = entry.name;
      topRow.replaceChild(input, name);
      // The whole actions row (rename included) is squeezed for space -
      // hiding it while editing gives the input the whole row. It comes
      // back on its own since commit/cancel both end in a full re-render.
      actionsRow.style.display = 'none';
      input.focus();
      input.select();
      // On iPad the on-screen keyboard covers roughly the bottom half
      // of the screen once it slides up, and this row can end up
      // hidden behind it since nothing here scrolls automatically -
      // the delay lets the keyboard's slide-in animation finish before
      // scrolling, otherwise the browser measures the row's position
      // before the viewport has actually shrunk.
      setTimeout(function () {
        input.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 300);
      var done = false;
      function commit() {
        if (done) return;
        done = true;
        var newName = input.value.trim();
        if (!newName || newName === entry.name) { refreshBoth(); return; }
        var list2 = getSavedEvents();
        var clash = list2.some(function (e) { return e.name !== entry.name && e.name === newName; });
        if (clash) { toast('כבר קיים אירוע בשם הזה'); refreshBoth(); return; }
        var idx = findEventIndexByName(list2, entry.name);
        if (idx === -1) { refreshBoth(); return; }
        var wasActive = getActiveEventName() === entry.name;
        list2[idx].name = newName;
        setSavedEvents(list2);
        if (wasActive) setActiveEventName(newName);
        refreshBoth();
        toast('שם האירוע עודכן');
      }
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        else if (e.key === 'Escape') { done = true; refreshBoth(); }
      });
      input.addEventListener('blur', commit);
    });

    var loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.className = 'btn btn-ghost';
    loadBtn.innerHTML = '🔃<span class="btn-icon-label">טעינה</span>';
    loadBtn.addEventListener('click', function () {
      applySavedSetup(entry.setup, entry.name);
      renderGalleryGrid();
      toast('האירוע "' + entry.name + '" נטען');
    });

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-ghost';
    copyBtn.innerHTML = '📋<span class="btn-icon-label">שכפול</span>';
    copyBtn.title = 'שכפול הגדרות האירוע הזה (עיצוב, רקע, מצב צילום) לאירוע חדש - בלי לשייך תמונות אליו עדיין';
    copyBtn.addEventListener('click', function () {
      // Copies the design/background/capture-mode settings only - does
      // NOT switch the active event (so nothing gets photo-tagged to
      // the source event by mistake). Staff just edits the name/date
      // and taps "שמירה" under a new name to finish setting up the copy.
      applySavedSetup(entry.setup, getActiveEventName());
      $('save-event-name-input').value = entry.name + ' - עותק';
      $('save-event-name-input').focus();
      toast('ההגדרות של "' + entry.name + '" הועתקו - עדכני שם/תאריך ולחצי שמירה');
    });

    var moveBtn = document.createElement('button');
    moveBtn.type = 'button';
    moveBtn.className = 'btn btn-ghost';
    if (archived) {
      var canMoveBack = getMainSavedEvents().length < MAX_MAIN_EVENTS;
      moveBtn.innerHTML = '📤<span class="btn-icon-label">לרשימה</span>';
      moveBtn.title = canMoveBack
        ? 'העברת האירוע חזרה לרשימת האירועים השמורים'
        : 'אין מקום ברשימה הראשית (עד ' + MAX_MAIN_EVENTS + ' אירועים) - מחקו או העבירו אירוע אחר לתיקייה קודם';
      moveBtn.disabled = !canMoveBack;
      moveBtn.addEventListener('click', function () {
        var list2 = getSavedEvents();
        if (getMainSavedEvents(list2).length >= MAX_MAIN_EVENTS) { toast('אין מקום ברשימה הראשית'); return; }
        var idx = findEventIndexByName(list2, entry.name);
        if (idx === -1) return;
        list2[idx].archived = false;
        setSavedEvents(list2);
        refreshBoth();
        toast('האירוע "' + entry.name + '" הועבר לאירועים שמורים');
      });
    } else {
      moveBtn.innerHTML = '📁<span class="btn-icon-label">לתיקייה</span>';
      moveBtn.title = 'העברת האירוע (עם כל התוכן שלו) לתיקיית "אירועים שמורים"';
      moveBtn.addEventListener('click', function () {
        var list2 = getSavedEvents();
        var idx = findEventIndexByName(list2, entry.name);
        if (idx === -1) return;
        list2[idx].archived = true;
        setSavedEvents(list2);
        refreshBoth();
        toast('האירוע "' + entry.name + '" הועבר לתיקייה');
      });
    }

    var delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-ghost';
    delBtn.innerHTML = '🗑️<span class="btn-icon-label">מחיקה</span>';
    delBtn.addEventListener('click', function () {
      setSavedEvents(getSavedEvents().filter(function (e) { return e.name !== entry.name; }));
      if (getActiveEventName() === entry.name) setActiveEventName('');
      refreshBoth();
    });

    topRow.appendChild(name);
    actionsRow.appendChild(renameBtn);
    actionsRow.appendChild(loadBtn);
    actionsRow.appendChild(copyBtn);
    actionsRow.appendChild(moveBtn);
    actionsRow.appendChild(delBtn);
    row.appendChild(topRow);
    row.appendChild(actionsRow);
    return row;
  }
  function renderSavedEventsList() {
    var list = getMainSavedEvents();
    var container = $('saved-events-list');
    container.innerHTML = '';
    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'design-hint';
      empty.textContent = 'אין עדיין אירועים שמורים';
      container.appendChild(empty);
      return;
    }
    list.forEach(function (entry) {
      container.appendChild(buildSavedEventRow(entry, false));
    });
  }
  function renderArchivedEventsList() {
    var container = $('archived-events-list');
    if (!container) return;
    var list = getArchivedSavedEvents();
    container.innerHTML = '';
    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'design-hint';
      empty.textContent = 'התיקייה ריקה';
      container.appendChild(empty);
      return;
    }
    list.forEach(function (entry) {
      container.appendChild(buildSavedEventRow(entry, true));
    });
  }
  // Writes the CURRENT live setup (event info, print bridge, design,
  // background, capture mode) into the named event's saved slot -
  // creating it if it doesn't exist yet. Shared by the explicit "save
  // event" button and by the silent auto-sync below, so both always
  // agree on what "saved" means.
  function writeEventSnapshot(name) {
    var list = getSavedEvents();
    var setup = snapshotCurrentSetup();
    var existingIdx = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].name === name) { existingIdx = i; break; } }
    if (existingIdx >= 0) {
      // Updating an existing event's own snapshot never changes whether
      // it's archived - only the explicit "העבר לתיקייה"/"העבר לאירועים
      // שמורים" buttons do that.
      list[existingIdx].setup = setup;
    } else {
      // A brand new event beyond the main list's cap goes straight into
      // the "📁 אירועים שמורים" folder instead of growing that list
      // forever - staff can still pull it back out any time there's room.
      var goesToArchive = getMainSavedEvents(list).length >= MAX_MAIN_EVENTS;
      list.push({ name: name, setup: setup, archived: goesToArchive });
    }
    setSavedEvents(list);
  }
  $('save-event-btn').addEventListener('click', function () {
    var name = $('save-event-name-input').value.trim();
    if (!name) { toast('תנו שם לאירוע'); return; }
    writeEventSnapshot(name);
    setActiveEventName(name);
    $('save-event-name-input').value = '';
    renderSavedEventsList();
    renderArchivedEventsList();
    var saved = getSavedEvents().filter(function (e) { return e.name === name; })[0];
    toast(saved && saved.archived ? 'האירוע נשמר בתיקיית "אירועים שמורים" (הרשימה הראשית מלאה)' : 'האירוע נשמר');
  });


  // Any change to event info, print-bridge address, background, capture
  // mode or design auto-saves straight into the active event (if one is
  // loaded) - no separate "save" step to forget. Design edits fire very
  // often (every keystroke/slider tick/drag frame), so those go through
  // a short debounce instead of writing on every single one; other
  // changes here only happen on an explicit save/click already, so they
  // sync immediately. Completely silent - never toasts "no active event"
  // since most edits happen with no named event loaded at all (the
  // general album), which is a normal, expected state, not a problem.
  function syncActiveEvent() {
    var name = getActiveEventName();
    if (!name) return;
    writeEventSnapshot(name);
  }
  var activeEventSyncTimer = null;
  function scheduleActiveEventSync() {
    clearTimeout(activeEventSyncTimer);
    activeEventSyncTimer = setTimeout(syncActiveEvent, 700);
  }
  function flushActiveEventSync() {
    clearTimeout(activeEventSyncTimer);
    syncActiveEvent();
  }

  // Kept as an explicit "sync now" action (e.g. right before walking away
  // from the iPad) - everything it does now also happens automatically,
  // but forcing it immediately plus the reassuring toast doesn't hurt.
  function saveCurrentSetupToActiveEvent() {
    var name = getActiveEventName();
    if (!name) {
      toast('אין אירוע פעיל - שמרו קודם אירוע בשם דרך ⚙️ הגדרות');
      return;
    }
    writeEventSnapshot(name);
    toast('העיצוב נשמר לאירוע "' + name + '"');
  }

  // ---------- Camera ----------
  var video = $('video');
  var stream = null;
  var countingDown = false;

  function startCamera() {
    $('cam-error').style.display = 'none';
    if (stream) {
      // iOS can pause decoding a live camera <video> while it's hidden
      // behind another screen (design editor, gallery) or while a
      // blocking dialog is open - explicitly resume it so returning to
      // the camera shows a live frame instead of a frozen stale one.
      video.play().catch(function () {});
      return;
    }
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'user' },
        // "ideal" is a soft ask, not a hard requirement - the browser
        // settles for whatever the actual camera's real maximum is, it
        // doesn't fail if that's lower. Deliberately asking for far more
        // than any iPad camera can give (was capped at 1440x1920 before,
        // well under most cameras' real max) guarantees we always get
        // that true maximum instead of an arbitrary lower ceiling - this
        // is also the direct fix for photos looking blurry/soft when a
        // guest pinch-zooms into a QR-shared photo, since that's the same
        // pixels just spread across a bigger view.
        width: { ideal: 3000 },
        height: { ideal: 4000 }
      }
    }).then(function (s) {
      stream = s;
      video.srcObject = s;
      video.play().catch(function () {});
      s.getVideoTracks().forEach(function (track) {
        // If the OS ever revokes/ends the camera track (backgrounding,
        // another app taking the camera, etc.) the stream is dead even
        // though our `stream` var still points at it - clear it so the
        // next startCamera() call properly re-requests the camera
        // instead of leaving a permanently black/frozen video.
        track.addEventListener('ended', function () {
          if (stream === s) stream = null;
        });
      });
    }).catch(function (err) {
      $('cam-error').style.display = 'flex';
      $('cam-error').innerHTML = '<div>לא ניתן לגשת למצלמה.</div><div style="font-size:13px">ודאו שהאתר נפתח ב-Safari או Chrome, ושניתנה הרשאת מצלמה (הגדרות ← Safari ← מצלמה).</div>';
    });
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null;
      video.srcObject = null;
    }
  }

  // Raw mirrored capture of the current video frame, no branding applied yet.
  function rawFrame() {
    var vw = video.videoWidth || 1080;
    var vh = video.videoHeight || 1440;
    var canvas = document.createElement('canvas');
    canvas.width = vw;
    canvas.height = vh;
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(vw, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.restore();
    return canvas;
  }

  // rawFrame() grabs straight from the live <video> element with no check
  // that it actually had a real frame ready at that instant - a momentary
  // camera stream hiccup (seen live: strip printed with a blank white
  // panel instead of the 3rd photo, which then jammed the printer) can
  // produce an all-one-color capture. Sampling a handful of points is
  // cheap and real photo content is essentially never uniform across all
  // of them, so this catches a blank grab without falsely flagging a
  // genuinely plain/blurry photo (which still varies pixel to pixel).
  function isFrameBlank(canvas) {
    var w = canvas.width, h = canvas.height;
    if (!w || !h) return true;
    var ctx = canvas.getContext('2d');
    var points = [
      [0.1, 0.1], [0.5, 0.1], [0.9, 0.1],
      [0.1, 0.5], [0.5, 0.5], [0.9, 0.5],
      [0.1, 0.9], [0.5, 0.9], [0.9, 0.9]
    ];
    var first = null;
    for (var i = 0; i < points.length; i++) {
      var d = ctx.getImageData(Math.floor(w * points[i][0]), Math.floor(h * points[i][1]), 1, 1).data;
      var rgba = d[0] + ',' + d[1] + ',' + d[2] + ',' + d[3];
      if (first === null) { first = rgba; }
      else if (rgba !== first) { return false; }
    }
    return true;
  }
  // Re-grabs from the (already-running) video a few times, a beat apart,
  // until a non-blank frame shows up - a blank capture is a momentary
  // stream glitch, not a broken camera, so the very next grab is normally
  // fine. Adds a small delay only in that rare case; normally resolves on
  // the first try with no extra wait at all.
  function captureFrameRetrying(attemptsLeft) {
    var frame = rawFrame();
    if (!isFrameBlank(frame) || attemptsLeft <= 0) return Promise.resolve(frame);
    return new Promise(function (r) { setTimeout(r, 120); }).then(function () {
      return captureFrameRetrying(attemptsLeft - 1);
    });
  }

  // Draws `img` into ctx covering the target rect (crop-to-fill), like CSS object-fit:cover.
  function drawCover(ctx, img, x, y, w, h) {
    var iw = img.width, ih = img.height;
    var scale = Math.max(w / iw, h / ih);
    var dw = iw * scale, dh = ih * scale;
    var dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---------- Design settings (editable in the design editor) ----------
  // Each design is a fixed layout (photo margins etc.) plus a `layers`
  // array of freely draggable/duplicable/rotatable elements (text or
  // emoji). `title`/`date` are special layers whose text is pulled live
  // from the event info (📝 on the camera screen) rather than typed
  // directly - duplicating one bakes in a plain copy of the current text.
  var STRIP_DESIGN_KEY = 'm4u_strip_design';
  var WIDE_DESIGN_KEY = 'm4u_wide_design';
  // A staff-defined "my own default" per tab (📌 in the design editor) -
  // when set, the 🔄 reset button restores THIS instead of the built-in
  // DEFAULT_STRIP_DESIGN/DEFAULT_WIDE_DESIGN below, so "reset" gives back
  // the layout staff actually wants, not the app's original placeholder.
  var CUSTOM_DEFAULT_STRIP_KEY = 'm4u_custom_default_strip';
  var CUSTOM_DEFAULT_WIDE_KEY = 'm4u_custom_default_wide';

  var DEFAULT_STRIP_DESIGN = {
    sideTextW: 30, innerPad: 6, topMargin: 40, gap: 20, footerH: 250, cornerRadius: 7,
    layers: [
      { id: 'title', type: 'text', auto: 'title', x: 0.5, y: 0.931, size: 46, color: '#000000', font: 'englishParisienne', rotation: 0, weight: '', strength: 0 },
      { id: 'heart', type: 'emoji', text: '♥', x: 0.48, y: 0.951, size: 30, color: '#000000', rotation: 90 },
      { id: 'date', type: 'text', auto: 'date', x: 0.5, y: 0.979, size: 40, color: '#000000', font: 'englishPinyon', rotation: 0, weight: 'bold', strength: 32 },
      { id: 'brand-ig-icon', type: 'image', src: 'assets/img/instagram-icon.png', x: 0.04, y: 0.855, size: 3.5, rotation: -90 },
      { id: 'brand-handle', type: 'text', text: '#MEMORIES4U', x: 0.053, y: 0.813, size: 18, color: '#000000', font: 'sans', rotation: -90, weight: 'bold', strength: 32 },
      { id: 'brand-phone', type: 'text', text: BRAND_PHONE, x: 0.053, y: 0.742, size: 18, color: '#000000', font: 'sans', rotation: -90, weight: 'bold', strength: 32 }
    ]
  };
  var DEFAULT_WIDE_DESIGN = {
    marginTopPct: 0.044, marginSidePct: 0.036, footerPct: 0.24, cornerRadius: 8,
    layers: [
      { id: 'title', type: 'text', auto: 'title', x: 0.502, y: 0.892, size: 5.2, color: '#000000', font: 'englishParisienne', rotation: 0, weight: '', strength: 0 },
      { id: 'heart', type: 'emoji', text: '♥', x: 0.5, y: 0.925, size: 3, color: '#000000', rotation: 90 },
      { id: 'date', type: 'text', auto: 'date', x: 0.5, y: 0.967, size: 4.8, color: '#000000', font: 'englishPinyon', rotation: 0, weight: '600', strength: 32 },
      { id: 'brand-ig-icon', type: 'image', src: 'assets/img/instagram-icon.png', x: 0.02, y: 0.805, size: 2.2, rotation: -90 },
      { id: 'brand-handle', type: 'text', text: '#MEMORIES4U', x: 0.03, y: 0.76, size: 1.6, color: '#000000', font: 'sans', rotation: -90, weight: '600', strength: 32 },
      { id: 'brand-phone', type: 'text', text: BRAND_PHONE, x: 0.03, y: 0.686, size: 1.6, color: '#000000', font: 'sans', rotation: -90, weight: '600', strength: 32 }
    ]
  };

  // One-time sync: everything tuned in today's session (logo/text
  // position, margins, and the switch from weak brown/grey text to true
  // black) landed in DEFAULT_STRIP_DESIGN/DEFAULT_WIDE_DESIGN above, but
  // an event saved BEFORE today (like "Riki & David") keeps its own
  // older design snapshot and wouldn't pick any of that up on its own -
  // staff would have to reopen and redo every tweak by hand. This stamps
  // today's finished defaults onto the currently active design AND every
  // saved event's own snapshot, exactly once (guarded by
  // DESIGN_SYNC_V1_DONE_KEY) so it can never run again and overwrite a
  // deliberately different design someone sets up for a future event.
  var DESIGN_SYNC_V1_DONE_KEY = 'm4u_design_sync_v1_done';
  function syncSavedDesignsToTodaysDefaults() {
    if (localStorage.getItem(DESIGN_SYNC_V1_DONE_KEY)) return;
    function cloneStrip() { return JSON.parse(JSON.stringify(DEFAULT_STRIP_DESIGN)); }
    function cloneWide() { return JSON.parse(JSON.stringify(DEFAULT_WIDE_DESIGN)); }
    try {
      if (localStorage.getItem(STRIP_DESIGN_KEY)) localStorage.setItem(STRIP_DESIGN_KEY, JSON.stringify(cloneStrip()));
      if (localStorage.getItem(WIDE_DESIGN_KEY)) localStorage.setItem(WIDE_DESIGN_KEY, JSON.stringify(cloneWide()));
    } catch (e) {}
    try {
      var events = getSavedEvents();
      var anyChanged = false;
      events.forEach(function (entry) {
        if (entry.setup && entry.setup.stripDesign) { entry.setup.stripDesign = cloneStrip(); anyChanged = true; }
        if (entry.setup && entry.setup.wideDesign) { entry.setup.wideDesign = cloneWide(); anyChanged = true; }
      });
      if (anyChanged) setSavedEvents(events);
    } catch (e) {}
    localStorage.setItem(DESIGN_SYNC_V1_DONE_KEY, '1');
  }
  syncSavedDesignsToTodaysDefaults();

  // Second one-time pass, separate from V1 above (which already ran and
  // won't run again) - backfills the new per-layer "strength" field
  // (the color-strength slider) on any layer that doesn't have one yet,
  // using the same starting point as today's defaults for that layer id.
  // Deliberately lighter-touch than V1: only adds the missing field,
  // never overwrites position/size/color someone may have since tuned.
  var DESIGN_SYNC_V2_DONE_KEY = 'm4u_design_sync_v2_done';
  function backfillLayerStrength() {
    if (localStorage.getItem(DESIGN_SYNC_V2_DONE_KEY)) return;
    var STRENGTH_BY_ID = { date: 32, 'brand-handle': 32, 'brand-phone': 32 };
    function fixLayers(layers) {
      var changed = false;
      (layers || []).forEach(function (layer) {
        if (layer && layer.type === 'text' && layer.strength == null) {
          layer.strength = STRENGTH_BY_ID[layer.id] || 0;
          changed = true;
        }
      });
      return changed;
    }
    [STRIP_DESIGN_KEY, WIDE_DESIGN_KEY].forEach(function (key) {
      try {
        var raw = localStorage.getItem(key);
        if (!raw) return;
        var design = JSON.parse(raw);
        if (fixLayers(design.layers)) localStorage.setItem(key, JSON.stringify(design));
      } catch (e) {}
    });
    try {
      var events = getSavedEvents();
      var anyChanged = false;
      events.forEach(function (entry) {
        if (entry.setup && entry.setup.stripDesign && fixLayers(entry.setup.stripDesign.layers)) anyChanged = true;
        if (entry.setup && entry.setup.wideDesign && fixLayers(entry.setup.wideDesign.layers)) anyChanged = true;
      });
      if (anyChanged) setSavedEvents(events);
    } catch (e) {}
    localStorage.setItem(DESIGN_SYNC_V2_DONE_KEY, '1');
  }
  backfillLayerStrength();

  // Third one-time pass: the main "אירועים שמורים" list is now capped at
  // MAX_MAIN_EVENTS, with the rest living in the "📁 אירועים שמורים
  // בתיקייה" folder (entry.archived: true) - archives whichever already-
  // saved events sit beyond the first MAX_MAIN_EVENTS (in their existing
  // order), exactly once, so nobody's real events just vanish from view.
  // Touches only the new archived flag, nothing else about any event.
  var DESIGN_SYNC_V3_DONE_KEY = 'm4u_design_sync_v3_done';
  function archiveOverflowSavedEvents() {
    if (localStorage.getItem(DESIGN_SYNC_V3_DONE_KEY)) return;
    try {
      var list = getSavedEvents();
      var mainCount = 0;
      var changed = false;
      list.forEach(function (entry) {
        if (entry.archived) return;
        mainCount++;
        if (mainCount > MAX_MAIN_EVENTS) {
          entry.archived = true;
          changed = true;
        }
      });
      if (changed) setSavedEvents(list);
    } catch (e) {}
    localStorage.setItem(DESIGN_SYNC_V3_DONE_KEY, '1');
  }
  archiveOverflowSavedEvents();

  // Converts a design saved before the layer system existed (flat
  // titleX/heartSize/brandColor... fields) into the new layers array,
  // preserving whatever was already customized.
  function migrateLegacyLayers(saved, isWide) {
    function num(key, fb) { return saved[key] != null ? saved[key] : fb; }
    return [
      {
        id: 'title', type: 'text', auto: 'title', rotation: 0, weight: '',
        x: num('titleX', 0.5), y: num('titleY', isWide ? 0.855 : 0.911),
        size: isWide ? num('titleSizePct', 0.09) * 100 : num('titleSize', 52),
        color: num('titleColor', '#000000'), font: num('titleFont', 'script1')
      },
      {
        id: 'heart', type: 'emoji', rotation: 0,
        text: num('emoji', '♥'),
        x: num('heartX', 0.5), y: num('heartY', isWide ? 0.898 : 0.936),
        size: isWide ? num('heartSizePct', 0.032) * 100 : num('heartSize', 20),
        color: num('titleColor', '#000000')
      },
      {
        id: 'date', type: 'text', auto: 'date', rotation: 0, weight: '600',
        x: num('dateX', 0.5), y: num('dateY', isWide ? 0.940 : 0.962),
        size: isWide ? num('dateSizePct', 0.038) * 100 : num('dateSize', 24),
        color: num('dateColor', '#000000'), font: 'sans'
      },
      {
        id: 'brand', type: 'text', rotation: 0, weight: '600',
        text: (isWide ? BRAND_HANDLE : BRAND_HANDLE.toUpperCase()) + '   ' + BRAND_PHONE,
        x: num('brandX', 0.5), y: num('brandY', isWide ? 0.983 : 0.978),
        size: isWide ? num('brandSizePct', 0.026) * 100 : num('brandSize', 15),
        color: num('brandColor', isWide ? '#000000' : '#000000'), font: num('brandFont', 'sans')
      }
    ];
  }

  // A design saved before the brand line was split into an Instagram
  // icon + handle + phone number (previously one combined text layer)
  // still has the old single 'brand' layer - split it the same way a
  // fresh design already is, once, so existing saved designs pick up
  // the new look without the staff having to reset all their other
  // customizations just for this.
  function migrateBrandLayer(layers, isWide) {
    var idx = -1;
    for (var i = 0; i < layers.length; i++) { if (layers[i].id === 'brand') { idx = i; break; } }
    if (idx === -1) return layers;
    var old = layers[idx];
    var x = old.x != null ? old.x : 0.5;
    var y = old.y != null ? old.y : (isWide ? 0.983 : 0.978);
    var spread = isWide ? 0.11 : 0.13;
    var iconLayer = { id: 'brand-ig-icon', type: 'image', src: 'assets/img/instagram-icon.png', x: x - spread / 2, y: y - (isWide ? 0.018 : 0.016), size: isWide ? 2.2 : 6, rotation: 0 };
    var handleLayer = { id: 'brand-handle', type: 'text', text: '#MEMORIES4U', x: x + spread / 2, y: y - (isWide ? 0.018 : 0.016), size: old.size, color: old.color, font: old.font, rotation: 0, weight: old.weight || '600' };
    var phoneLayer = { id: 'brand-phone', type: 'text', text: BRAND_PHONE, x: x, y: y, size: old.size, color: old.color, font: old.font, rotation: 0, weight: old.weight || '600' };
    var next = layers.slice();
    next.splice(idx, 1, iconLayer, handleLayer, phoneLayer);
    return next;
  }

  function loadDesign(key, defaults, isWide) {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) {}
    var merged = {};
    Object.keys(defaults).forEach(function (k) {
      if (k in saved) {
        merged[k] = saved[k];
      } else {
        // Clone object/array defaults so mutating the result (e.g. adding
        // a layer) can never corrupt the shared DEFAULT_*_DESIGN constant.
        var d = defaults[k];
        merged[k] = (d && typeof d === 'object') ? JSON.parse(JSON.stringify(d)) : d;
      }
    });
    // The wide-photo design used to have one "marginPct" for both the top
    // and the side margins - split into marginTopPct/marginSidePct so
    // they can be tuned independently. A design saved before the split
    // has the old key but not the new ones; seed both from it so an
    // already-tuned margin doesn't silently jump back to the default.
    if (isWide && saved.marginPct != null && saved.marginTopPct == null && saved.marginSidePct == null) {
      merged.marginTopPct = saved.marginPct;
      merged.marginSidePct = saved.marginPct;
      saveDesign(key, merged);
    }
    if (!saved.layers && (saved.titleX != null || saved.heartX != null || saved.brandX != null || saved.emoji != null)) {
      merged.layers = migrateLegacyLayers(saved, isWide);
      saveDesign(key, merged);
    }
    var migratedBrand = migrateBrandLayer(merged.layers, isWide);
    if (migratedBrand !== merged.layers) {
      merged.layers = migratedBrand;
      saveDesign(key, merged);
    }
    return merged;
  }
  // One undo step is pushed per saveDesign call, keyed by design (strip
  // vs wide) - every single edit in the design editor (drag, nudge, font,
  // color, slider, text keystroke, layer add/remove...) funnels through
  // this one function, so hooking it here gives undo everywhere for free
  // without touching each individual control's handler. In-memory only
  // (not persisted) - undo doesn't need to survive a page reload, and
  // keeping it out of localStorage avoids bloating the site's small quota
  // with old snapshots of designs that can embed a full uploaded logo.
  var DESIGN_UNDO_LIMIT = 40;
  var designUndoStacks = {};
  function saveDesign(key, design) {
    var prev = localStorage.getItem(key);
    if (prev !== null) {
      var stack = designUndoStacks[key] || (designUndoStacks[key] = []);
      stack.push(prev);
      if (stack.length > DESIGN_UNDO_LIMIT) stack.shift();
    }
    localStorage.setItem(key, JSON.stringify(design));
    // Debounced, not immediate - a drag or a slider fires this dozens of
    // times a second, and syncing the whole saved-event list on every one
    // would be wasteful. scheduleActiveEventSync/syncActiveEvent are
    // defined earlier in this file (both plain function declarations, so
    // hoisting makes them callable from here regardless of file order).
    scheduleActiveEventSync();
  }
  function undoDesign(key) {
    var stack = designUndoStacks[key];
    if (!stack || !stack.length) return false;
    localStorage.setItem(key, stack.pop());
    return true;
  }
  function getStripDesign() { return loadDesign(STRIP_DESIGN_KEY, DEFAULT_STRIP_DESIGN, false); }
  function getWideDesign() { return loadDesign(WIDE_DESIGN_KEY, DEFAULT_WIDE_DESIGN, true); }

  // Draws every layer (title/date/heart/brand/custom). `hits`, if given,
  // is filled with each layer's approximate on-canvas bounding box (used
  // only by the design editor for click/drag hit-testing - rotation is
  // ignored for the hit box itself, just for the actual drawn text).
  // Image layers (uploaded logos) need to be decoded before they can be
  // drawn, but composeStrip/composeWide/renderLayers are all synchronous
  // (a live capture needs a canvas back immediately). So decoded images
  // are cached here ahead of time; a layer whose image isn't loaded yet
  // just doesn't draw for that one frame, and the design editor's
  // preview re-renders itself once the load finishes.
  var IMAGE_LAYER_CACHE = {};
  function preloadLayerImage(src) {
    if (IMAGE_LAYER_CACHE[src]) return IMAGE_LAYER_CACHE[src];
    var entry = { img: new Image(), loaded: false };
    IMAGE_LAYER_CACHE[src] = entry;
    entry.promise = new Promise(function (resolve) {
      entry.img.onload = function () {
        entry.loaded = true;
        if ($('screen-design').classList.contains('active')) renderDesignPreview();
        resolve();
      };
      entry.img.onerror = resolve;
    });
    entry.img.src = src;
    return entry;
  }
  function preloadDesignImages(design) {
    design.layers.forEach(function (layer) {
      if (layer.type === 'image' && layer.src) preloadLayerImage(layer.src);
    });
  }
  // Resolves once every logo/image layer in the design is decoded (or has
  // failed, or 5s pass) - without this, the FIRST photo after loading an
  // event that carries an uploaded logo was composed before that logo had
  // finished decoding, so the logo was silently missing from it (and that
  // photo is what got saved). Capture waits on this before composing.
  function whenDesignImagesReady(design) {
    var waits = [];
    design.layers.forEach(function (layer) {
      if (layer.type === 'image' && layer.src) waits.push(preloadLayerImage(layer.src).promise);
      // A webfont that hasn't been used yet isn't loaded, and canvas text
      // silently falls back to a default font - so the first photo could
      // print its title/date in the wrong typeface. Load it up front.
      if (layer.type === 'text' && document.fonts && document.fonts.load) {
        var opt = FONT_OPTIONS[layer.font] || FONT_OPTIONS.sans;
        waits.push(document.fonts.load((layer.weight ? layer.weight + ' ' : '') + '40px ' + opt.family, layer.text || 'אבג abc').catch(function () {}));
      }
    });
    if (!waits.length) return Promise.resolve();
    return Promise.race([Promise.all(waits), new Promise(function (r) { setTimeout(r, 5000); })]);
  }

  function renderLayers(ctx, design, W, H, isWide, hits, scale) {
    scale = scale || 1;
    preloadDesignImages(design);
    var info = getEventInfo();
    design.layers.forEach(function (layer) {
      if (layer.type === 'image') {
        var cacheEntry = layer.src ? IMAGE_LAYER_CACHE[layer.src] : null;
        if (!cacheEntry || !cacheEntry.loaded) return;
        var img = cacheEntry.img;
        var iw = W * (layer.size / 100);
        var ih = iw * (img.naturalHeight / img.naturalWidth);
        var ipx = layer.x * W, ipy = layer.y * H;
        ctx.save();
        if (layer.rotation) {
          ctx.translate(ipx, ipy);
          ctx.rotate(layer.rotation * Math.PI / 180);
          ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
        } else {
          ctx.drawImage(img, ipx - iw / 2, ipy - ih / 2, iw, ih);
        }
        ctx.restore();
        if (hits) hits.push({ key: layer.id, x: ipx - iw / 2, y: ipy - ih / 2, w: iw, h: ih, cx: ipx, cy: ipy, rotation: layer.rotation || 0 });
        return;
      }
      var text = layer.type === 'emoji' ? (layer.text || '♥') : layer.text;
      if (layer.auto === 'title') text = info.title;
      if (layer.auto === 'date') text = info.date;
      if (!text) return;

      var px = layer.x * W, py = layer.y * H;
      var sizePx = isWide ? Math.max(1, Math.round(W * (layer.size / 100))) : Math.round(layer.size * scale);
      var font;
      if (layer.type === 'emoji') {
        // A plain system font is tried FIRST, not an emoji font - most of
        // the heart glyphs offered (♥ ❤ ❦ ❧) have plain, colorable forms
        // there that respect fillStyle. Only glyphs with no plain form
        // (🖤) fall through to the emoji font, which renders them in
        // their own fixed color regardless of fillStyle.
        font = Math.round(sizePx * 1.6) + 'px -apple-system, "Helvetica Neue", Arial, "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      } else {
        var opt = FONT_OPTIONS[layer.font] || FONT_OPTIONS.sans;
        var stylePrefix = (opt.italic ? 'italic ' : '') + (layer.weight ? layer.weight + ' ' : '');
        font = stylePrefix + sizePx + 'px ' + opt.family;
      }

      ctx.save();
      ctx.font = font;
      ctx.fillStyle = layer.color;
      ctx.textAlign = 'center';
      var metrics = ctx.measureText(text);
      // Most of the loaded webfonts only ship a single weight (see the
      // Google Fonts <link> in index.html), so asking the browser for a
      // real bold face is mostly a no-op for them - it silently keeps
      // using the one weight that's loaded, which is why "B" alone barely
      // changes how dark a thin script font prints. The "עוצמת צבע" slider
      // (layer.strength, 0-100) is the real fix: an extra stroke pass in
      // the same fillStyle color, laid down BEFORE the fill, that thickens
      // the glyph on the canvas itself - continuous and independent of
      // the B toggle, so it works whether or not weight is set.
      var strength = layer.type === 'text' ? (layer.strength || 0) : 0;
      if (strength > 0) {
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = Math.max(0.5, sizePx * (strength / 100) * 0.11);
        ctx.lineJoin = 'round';
      }
      if (layer.rotation) {
        ctx.translate(px, py);
        ctx.rotate(layer.rotation * Math.PI / 180);
        if (strength > 0) ctx.strokeText(text, 0, 0);
        ctx.fillText(text, 0, 0);
      } else {
        if (strength > 0) ctx.strokeText(text, px, py);
        ctx.fillText(text, px, py);
      }
      ctx.restore();

      if (hits) {
        var th = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0) || sizePx;
        hits.push({ key: layer.id, x: px - metrics.width / 2, y: py - th, w: metrics.width, h: th * 1.4, cx: px, cy: py, rotation: layer.rotation || 0 });
      }
    });
  }

  // This iPad's front camera hands back an already-upright frame - just
  // in a landscape-shaped buffer (proven with a real test shot: rotating
  // it always turned correctly-oriented content sideways). So a
  // landscape raw frame isn't rotated - it's center-cropped down to a
  // portrait aspect ratio instead, matching the portrait card "wide
  // photo" mode is meant to produce.
  function cropToPortrait(frame) {
    if (frame.width <= frame.height) return frame;
    var targetAspect = 3 / 4; // width/height, matches the ideal capture constraints
    var targetW = Math.round(frame.height * targetAspect);
    if (targetW >= frame.width) return frame;
    var c = document.createElement('canvas');
    c.width = targetW;
    c.height = frame.height;
    var ctx = c.getContext('2d');
    var sx = Math.round((frame.width - targetW) / 2);
    ctx.drawImage(frame, sx, 0, targetW, frame.height, 0, 0, targetW, frame.height);
    return c;
  }

  // Full photo on a white card with a script event name + date + brand
  // line underneath, matching the printed single-photo cards.
  function composeWide(frame, design, hits) {
    frame = cropToPortrait(frame);
    design = design || getWideDesign();
    var vw = frame.width, vh = frame.height;
    // Both still scale off the frame's width, exactly like the single
    // shared "margin" this replaced - only the percentage each one reads
    // is now independent, so top and sides can be tuned apart without
    // changing how either one is measured.
    var marginTop = Math.round(vw * design.marginTopPct);
    var marginSide = Math.round(vw * design.marginSidePct);
    var footerH = Math.round(vh * design.footerPct);
    var W = vw + marginSide * 2;
    var H = vh + marginTop + footerH;

    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);
    if (design.cornerRadius > 0) {
      ctx.save();
      roundRectPath(ctx, marginSide, marginTop, vw, vh, design.cornerRadius);
      ctx.clip();
      ctx.drawImage(frame, marginSide, marginTop, vw, vh);
      ctx.restore();
    } else {
      ctx.drawImage(frame, marginSide, marginTop, vw, vh);
    }

    renderLayers(ctx, design, W, H, true, hits);
    canvas.m4uPhotoRects = [{ x: marginSide, y: marginTop, w: vw, h: vh, r: design.cornerRadius }];
    return canvas;
  }

  // Classic 3-photo vertical strip with event title/date + brand footer,
  // matching the printed kraft-card strips (2x6in). Rendered at
  // 3x or more (scale below) the original 600x1800@300dpi canvas so shared/QR
  // photos hold up to zoom - every DEFAULT_STRIP_DESIGN/saved-design
  // number below is a raw pixel count tuned against the original 600px
  // width, so it's scaled up here by the same factor at render time only.
  // DEFAULT_STRIP_DESIGN and every saved event's stripDesign stay exactly
  // as stored; this never writes the scaled numbers back anywhere, so the
  // print bridge's own scale-to-fit-page logic (unaffected by source
  // pixel count, only by aspect ratio, which is unchanged) still lines
  // up the same as always.
  // The scale is chosen per photo from the camera's real frame size, so each
  // photo is placed at (or just above) its own native resolution and never
  // downsampled: at least 3x, and up to 3.9x when the camera delivers more
  // than a 3x cell can hold (this iPad gives 2052x2736 frames, which need
  // about 3.9x). 3.9 is the ceiling because 2340x7020 = 16.4 megapixels,
  // just under the ~16.7 MP canvas limit iOS Safari enforces - going
  // higher would fail to render at all, and the upscaling wouldn't add
  // real detail anyway. The aspect ratio stays exactly 1:3 at any scale.
  var STRIP_MIN_SCALE = 3, STRIP_MAX_SCALE = 3.9;
  function stripScaleFor(frames, cellBaseW, cellBaseH) {
    var f = frames[0];
    if (!f || !cellBaseW || !cellBaseH) return STRIP_MIN_SCALE;
    var native = Math.min(f.width / cellBaseW, f.height / cellBaseH);
    return Math.min(STRIP_MAX_SCALE, Math.max(STRIP_MIN_SCALE, Math.ceil(native * 10) / 10));
  }
  function composeStrip(frames, design, hits) {
    design = design || getStripDesign();
    var cellBaseW = 600 - 2 * (design.sideTextW + design.innerPad);
    var cellBaseH = Math.floor((1800 - design.topMargin - design.footerH - design.gap * (frames.length - 1)) / frames.length);
    var scale = stripScaleFor(frames, cellBaseW, cellBaseH);
    var W = Math.round(600 * scale), H = Math.round(1800 * scale);
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    var sideTextW = design.sideTextW * scale, innerPad = design.innerPad * scale;
    var topMargin = design.topMargin * scale, gap = design.gap * scale;
    var footerH = design.footerH * scale, cornerRadius = design.cornerRadius * scale;

    // narrow blank side margins, like the printed kraft-paper strips
    var cellX = sideTextW + innerPad;
    var cellW = W - cellX * 2;
    var cellH = Math.floor((H - topMargin - footerH - gap * (frames.length - 1)) / frames.length);

    var photoRects = [];
    frames.forEach(function (frame, i) {
      var cy = topMargin + i * (cellH + gap);
      photoRects.push({ x: Math.round(cellX), y: Math.round(cy), w: Math.round(cellW), h: Math.round(cellH), r: cornerRadius });
      ctx.save();
      roundRectPath(ctx, cellX, cy, cellW, cellH, cornerRadius);
      ctx.clip();
      drawCover(ctx, frame, cellX, cy, cellW, cellH);
      ctx.restore();
    });

    renderLayers(ctx, design, W, H, false, hits, scale);
    canvas.m4uPhotoRects = photoRects;
    return canvas;
  }

  var currentBlob = null;
  var currentColorBlob = null; // original color version, kept so B&W can be toggled back off
  var isBw = false;
  var currentPhotoId = null; // set when viewing a saved gallery item
  var currentGifBlob = null; // set for strip captures (built from the same 3 shots)
  var currentColorGifBlob = null; // original color GIF, kept so B&W can toggle the GIF too
  var bwGifBlobCache = null;

  // Builds a looping GIF from the same 3 shots used for the strip.
  // `grayscale` mirrors whatever the still photo's B&W toggle is set to,
  // so the GIF sent/shared always matches what's on screen. `full` keeps
  // the camera's full frame size (only done on demand for a guest's own
  // live photo, since it's slow and the file is big); otherwise a smaller
  // 960px version is built, which is what gets saved with each photo.
  // Frames are processed one per tick so the screen never freezes solid.
  function composeGif(frames, grayscale, full) {
    var maxDim = full ? Infinity : 960;
    var w = frames[0].width, h = frames[0].height;
    var scale = Math.min(1, maxDim / Math.max(w, h));
    var gw = Math.max(1, Math.round(w * scale));
    var gh = Math.max(1, Math.round(h * scale));
    var gif = gifenc.GIFEncoder();
    var chain = Promise.resolve();
    frames.forEach(function (frame) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            var c = document.createElement('canvas');
            c.width = gw;
            c.height = gh;
            var ctx = c.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(frame, 0, 0, gw, gh);
            var data = ctx.getImageData(0, 0, gw, gh).data;
            if (grayscale) {
              for (var i = 0; i < data.length; i += 4) {
                var gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                data[i] = data[i + 1] = data[i + 2] = gray;
              }
            }
            var palette = gifenc.quantize(data, 256);
            var index = gifenc.applyPalette(data, palette);
            gif.writeFrame(index, gw, gh, { palette: palette, delay: 700, repeat: 0 });
            resolve();
          }, 0);
        });
      });
    });
    return chain.then(function () {
      gif.finish();
      return new Blob([gif.bytes()], { type: 'image/gif' });
    });
  }

  // Maximum JPEG quality everywhere a finished photo is encoded - file size
  // is a non-issue next to the photo itself never being degraded.
  var JPEG_QUALITY = 1;
  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, 'image/jpeg', JPEG_QUALITY);
    });
  }

  function flashOnce() {
    var flash = $('flash');
    flash.style.transition = 'none';
    flash.style.opacity = '1';
    requestAnimationFrame(function () {
      flash.style.transition = 'opacity .4s ease';
      flash.style.opacity = '0';
    });
  }

  // Runs a 3-2-1 countdown, then resolves with a fresh raw frame.
  function countdownAndShoot() {
    return new Promise(function (resolve) {
      var steps = ['3', '2', '1'];
      var el = $('countdown');
      var numberEl = $('countdown-number');
      var ringEl = $('countdown-ring-progress');
      var i = 0;
      function step() {
        if (i < steps.length) {
          numberEl.textContent = steps[i];
          el.style.opacity = '1';
          // Restart the ring-fill animation on every step - removing the
          // class and forcing a reflow (getBBox) before re-adding it is
          // needed for an SVG animation to replay from scratch, since
          // just re-adding the same class is a no-op to the browser.
          ringEl.classList.remove('running');
          void ringEl.getBBox();
          ringEl.classList.add('running');
          i++;
          setTimeout(step, 800);
        } else {
          el.style.opacity = '0';
          ringEl.classList.remove('running');
          flashOnce();
          captureFrameRetrying(3).then(resolve);
        }
      }
      step();
    });
  }

  function finishCapture(canvas) {
    return canvasToBlob(canvas).then(function (blob) {
      currentBlob = blob;
      currentPhotoId = null;
      currentPhotoRects = canvas.m4uPhotoRects || null;
      lastCapture = { blob: blob, gifBlob: currentGifBlob, rects: currentPhotoRects, id: null };
      var thumbPromise = thumbFromDrawable(canvas, canvas.width, canvas.height);
      dbAdd(blob, currentGifBlob, currentPhotoRects).then(function (id) {
        currentPhotoId = id;
        lastCapture.id = id;
        thumbPromise.then(function (tb) { dbPutThumb(id, tb); });
      });
      openResult(blob, true, currentGifBlob);
    });
  }

  // ---------- Background replacement ("green screen" without a green
  // screen) - an optional, staff-toggled setting (⚙️ on the main screen).
  // Off by default; when on, every captured frame has its real
  // background swapped for a plain backdrop, using MediaPipe's Selfie
  // Segmentation model to tell person from background. Runs entirely in
  // the browser, but the model itself is fetched from Google's CDN the
  // first time it's used each session - unlike the rest of the app, this
  // one feature needs internet the first time. If it fails for any
  // reason (no internet, model error), capture falls back to the
  // original, unmodified photo rather than breaking the flow.
  var BG_MODE_KEY = 'm4u_bg_mode'; // 'none' | 'white' | 'black' | 'green'
  var BG_MODE_COLORS = { white: '#FFFFFF', black: '#000000', green: '#00B140' };
  function getBgMode() { return localStorage.getItem(BG_MODE_KEY) || 'none'; }
  function getBgColor() { return BG_MODE_COLORS[getBgMode()] || '#FFFFFF'; }

  var selfieSegmentation = null;
  var segmentationLoad = null;
  function ensureSegmentation() {
    if (segmentationLoad) return segmentationLoad;
    segmentationLoad = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/selfie_segmentation.js';
      script.onload = function () {
        try {
          selfieSegmentation = new SelfieSegmentation({
            locateFile: function (file) {
              return 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/' + file;
            }
          });
          // Model 0 ("general") is slower but meant for a wider frame with
          // more of the body visible - a better fit for a photo booth shot
          // than model 1 ("landscape"), which is tuned for tight video-call
          // close-ups and was giving weaker results on full-body photos.
          selfieSegmentation.setOptions({ modelSelection: 0 });
          resolve();
        } catch (e) { reject(e); }
      };
      script.onerror = function () { reject(new Error('לא ניתן לטעון את מודל הרקע (בדקו חיבור אינטרנט)')); };
      document.head.appendChild(script);
    });
    return segmentationLoad;
  }

  function segmentFrame(frame) {
    return new Promise(function (resolve, reject) {
      selfieSegmentation.onResults(function (results) {
        resolve(results.segmentationMask);
      });
      selfieSegmentation.send({ image: frame }).catch(reject);
    });
  }

  // The raw segmentation mask is a soft probability gradient, which left
  // a hazy, semi-transparent halo around the cutout person (reported as
  // blurry/messy edges). Steepening the mask's contrast pushes "probably
  // person" pixels to fully opaque and "probably background" pixels to
  // fully transparent, leaving only a thin transition band - then a very
  // slight blur on that sharpened mask smooths the now-crisp edge so it
  // doesn't look jagged/pixelated.
  function sharpenMask(maskImage, w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var cx = c.getContext('2d');
    cx.drawImage(maskImage, 0, 0, w, h);
    var imgData = cx.getImageData(0, 0, w, h);
    var d = imgData.data;
    var contrast = 2.4;
    for (var i = 0; i < d.length; i += 4) {
      var v = d[i + 3]; // mask confidence lives in the alpha channel
      var nv = (v - 128) * contrast + 128;
      d[i + 3] = nv < 0 ? 0 : (nv > 255 ? 255 : nv);
    }
    cx.putImageData(imgData, 0, 0);
    return c;
  }

  // Cuts the person out of `frame` (using the segmentation mask) and
  // composites them onto a plain backdrop in the chosen color.
  function applyBackgroundReplacement(frame) {
    var mode = getBgMode();
    if (mode === 'none') return Promise.resolve(frame);
    return ensureSegmentation().then(function () {
      return segmentFrame(frame);
    }).then(function (mask) {
      var w = frame.width, h = frame.height;
      var personCanvas = document.createElement('canvas');
      personCanvas.width = w;
      personCanvas.height = h;
      var pctx = personCanvas.getContext('2d');
      pctx.drawImage(frame, 0, 0, w, h);
      pctx.globalCompositeOperation = 'destination-in';
      pctx.filter = 'blur(1.2px)';
      pctx.drawImage(sharpenMask(mask, w, h), 0, 0, w, h);
      pctx.filter = 'none';

      var out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      var octx = out.getContext('2d');
      octx.fillStyle = getBgColor();
      octx.fillRect(0, 0, w, h);
      octx.drawImage(personCanvas, 0, 0);
      return out;
    }).catch(function (err) {
      console.warn('Background replacement failed, using the original photo:', err);
      return frame;
    });
  }

  function setBgMode(mode) {
    localStorage.setItem(BG_MODE_KEY, mode);
    $('bg-mode-none').classList.toggle('active', mode === 'none');
    $('bg-mode-white').classList.toggle('active', mode === 'white');
    $('bg-mode-black').classList.toggle('active', mode === 'black');
    $('bg-mode-green').classList.toggle('active', mode === 'green');
    if (mode !== 'none') ensureSegmentation().catch(function () {}); // warm the model up in advance
  }
  $('bg-mode-none').addEventListener('click', function () { setBgMode('none'); });
  $('bg-mode-white').addEventListener('click', function () { setBgMode('white'); });
  $('bg-mode-black').addEventListener('click', function () { setBgMode('black'); });
  $('bg-mode-green').addEventListener('click', function () { setBgMode('green'); });
  setBgMode(getBgMode());

  function resetShotThumbs() {
    for (var i = 0; i < 3; i++) {
      var el = $('shot-thumb-' + i);
      el.classList.remove('filled');
      el.style.backgroundImage = '';
    }
  }

  function capture() {
    if (countingDown) return;
    countingDown = true;
    $('shutter-btn').disabled = true;
    var indicator = $('shot-indicator');

    var chain;
    if (captureMode === 'wide') {
      indicator.classList.remove('show');
      currentGifBlob = null;
      $('gif-fab-item').style.display = 'none';
      chain = countdownAndShoot().then(function (frame) {
        return applyBackgroundReplacement(frame);
      }).then(function (frame) {
        lastWideFrame = frame;
        return whenDesignImagesReady(getWideDesign()).then(function () { return finishCapture(composeWide(frame)); });
      });
    } else {
      var frames = [];
      var shotCount = 3;
      resetShotThumbs();
      $('shot-thumbs').style.display = '';
      function nextShot() {
        indicator.textContent = 'תמונה ' + (frames.length + 1) + ' מתוך ' + shotCount;
        indicator.classList.add('show');
        return countdownAndShoot().then(function (frame) {
          return applyBackgroundReplacement(frame);
        }).then(function (frame) {
          frames.push(frame);
          var thumb = $('shot-thumb-' + (frames.length - 1));
          thumb.style.backgroundImage = 'url(' + frame.toDataURL('image/jpeg', 0.6) + ')';
          thumb.classList.add('filled');
          if (frames.length < shotCount) {
            return new Promise(function (r) { setTimeout(r, 900); }).then(nextShot);
          }
        });
      }
      chain = nextShot().then(function () {
        indicator.classList.remove('show');
        $('shot-thumbs').style.display = 'none';
        lastStripFrames = frames;
        return composeGif(frames, false).then(function (gifBlob) {
          currentGifBlob = gifBlob;
          currentColorGifBlob = gifBlob;
          bwGifBlobCache = null;
          $('gif-fab-item').style.display = '';
        });
      }).then(function () {
        return whenDesignImagesReady(getStripDesign()).then(function () { return finishCapture(composeStrip(frames)); });
      });
    }

    chain.then(function () {
      countingDown = false;
      $('shutter-btn').disabled = false;
    });
  }

  $('shutter-btn').addEventListener('click', capture);
  $('open-gallery-btn').addEventListener('click', function () {
    $('settings-panel').classList.remove('active');
    reopenSettingsAfterScreen = true;
    openGallery('screen-welcome');
  });
  // ---------- Result screen ----------
  var resultUrl = null;
  var resultGifUrl = null;
  // Remembers whether this photo was opened from a fresh capture or from
  // the gallery grid, so the back arrow returns to the right place
  // instead of always jumping to the camera.
  var resultReturnScreen = 'screen-camera';
  // True only for the guest's own just-taken photo, whose raw frames
  // (lastStripFrames/lastWideFrame) are still in memory - lets print
  // re-render the photo against whatever design is live right now
  // instead of the flattened image frozen at capture time. Never true
  // for a photo reopened from the gallery (its raw frames are long gone,
  // and lastStripFrames/lastWideFrame would belong to a different photo).
  var currentPhotoIsLive = false;
  // Where the actual photo(s) sit inside the finished card (pixel rects), so
  // B&W on a photo reopened from the gallery can grey ONLY those areas and
  // leave the card, logo and text in color. Saved with each photo at capture;
  // photos from before this was saved have none and fall back to whole-image.
  var currentPhotoRects = null;
  var resultViaLastPhotoThumb = false;
  var resultThumbUrl = null;
  // The guest's own just-taken photo - the fixed "home" of the guest-facing
  // album, so backing out of the album always lands there (whose back arrow
  // goes to the camera) instead of on whichever photo was opened last.
  var lastCapture = null;
  function openResult(blob, fromCapture, gifBlob) {
    resultReturnScreen = fromCapture ? 'screen-camera' : 'screen-gallery';
    currentPhotoIsLive = !!fromCapture;
    resultViaLastPhotoThumb = false;
    bwCopySaved = false;
    bwPending = null;
    fullGifCache = null;
    viewGifBlob = null;
    $('btn-bw').disabled = false;
    currentBlob = blob;
    currentColorBlob = blob;
    isBw = false;
    bwBlobCache = null;
    $('btn-bw').classList.remove('active');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = URL.createObjectURL(blob);
    $('result-canvas-view').src = resultUrl;
    // The album shortcut belongs to the guest's own fresh photo only; on a
    // photo reached FROM a gallery, back already returns to that gallery.
    $('result-gallery-btn').parentNode.style.display = fromCapture ? '' : 'none';
    // Deleting is an admin-only action - even when a guest taps into an
    // individual photo from the (now guest-accessible) full gallery,
    // never show it there, only when staff reached the gallery via ⚙️.
    $('delete-fab-item').style.display = (fromCapture || galleryReturnScreen === 'screen-result') ? 'none' : '';
    if (gifBlob) {
      // Strip captures carry a GIF - either freshly made just now, or
      // (for a photo reopened from the gallery) the one saved alongside
      // it at capture time, so it's available here too, not just right
      // after shooting it.
      currentGifBlob = gifBlob;
      currentColorGifBlob = gifBlob;
      bwGifBlobCache = null;
      $('gif-fab-item').style.display = '';
    } else {
      currentGifBlob = null;
      currentColorGifBlob = null;
      bwGifBlobCache = null;
      $('gif-fab-item').style.display = 'none';
    }
    if (fromCapture) {
      // A quick way back to a guest's own just-taken photo (to reprint or
      // reshare) if they wander back to the camera screen without
      // meaning to - separate from the full staff-only gallery.
      // Small color thumbnails of the guest's own photo for the album/"my last
      // photo" buttons - always the color original, never affected by the
      // black-and-white toggle, and independent of resultUrl (which gets
      // replaced/revoked whenever the main photo changes).
      thumbFromBlob(blob).then(function (t) {
        if (resultThumbUrl) URL.revokeObjectURL(resultThumbUrl);
        resultThumbUrl = URL.createObjectURL(t);
        $('result-gallery-thumb').src = resultThumbUrl;
        $('camera-last-photo-thumb').src = resultThumbUrl;
      }).catch(function () {});
      $('camera-last-photo-group').style.display = '';
    }
    // Prev/next through the gallery (staff and guests browsing the album) -
    // never for a guest's own just-taken photo, which isn't part of a grid.
    var showNav = !fromCapture && galleryRowIndex !== -1;
    $('result-prev-btn').style.display = showNav ? '' : 'none';
    $('result-next-btn').style.display = showNav ? '' : 'none';
    if (showNav) {
      $('result-prev-btn').disabled = galleryRowIndex <= 0;
      $('result-next-btn').disabled = galleryRowIndex >= galleryRows.length - 1;
    }
    printCopies = 1;
    printAttemptsByCopies = {};
    $('copies-count').textContent = printCopies;
    stopCamera();
    showScreen('screen-result');
    // Guest's own fresh photo: build the black-and-white version quietly in
    // the background a moment after it appears, so the B&W button answers
    // instantly instead of making the guest wait for the conversion.
    if (fromCapture) {
      var warmBlob = blob;
      setTimeout(function () {
        if (currentColorBlob !== warmBlob || bwBlobCache) return;
        grayscaleComposedPhoto().then(function (b) {
          if (currentColorBlob === warmBlob) bwBlobCache = b;
        }).catch(function () {});
      }, 800);
    }
  }

  // Lays out, from the photo's own measured edges outward: photo, then
  // (staff gallery only) the prev/next arrow just outside it, then the
  // fab icon column outside that. The fab columns' CSS default sits a
  // fixed distance in from the SCREEN edge (tuned so the physical booth
  // enclosure doesn't block them); a strip photo is narrow enough that
  // this leaves room for everything, but a wide photo fills much more of
  // the width, so the columns move outward only as far as needed, never
  // closer to the screen edge than the base margin. When there still
  // isn't room for the arrows outside the photo, they're allowed to sit
  // slightly ON the photo (never on the icons) - the photo is never
  // shrunk. Re-measured on every image load and resize.
  function positionResultFabColumns() {
    if (!$('screen-result').classList.contains('active')) return;
    var wrap = document.querySelector('.result-photo-wrap');
    var img = $('result-canvas-view');
    var fabL = document.querySelector('.result-fab-col');
    var fabR = document.querySelector('.result-fab-col-right');
    var navPrev = $('result-prev-btn');
    var navNext = $('result-next-btn');
    if (!wrap || !img || !fabL || !fabR || !img.naturalWidth) return;
    fabL.style.left = '';
    fabR.style.right = '';
    var gap = 10, navW = 44, hardFloor = 12;
    var showNav = navPrev.style.display !== 'none';
    var extra = showNav ? gap + navW + gap : gap; // photo edge -> fab column, ideally
    var wrapRect = wrap.getBoundingClientRect();
    var imgRect = img.getBoundingClientRect();
    var fabLW = fabL.getBoundingClientRect().width, fabRW = fabR.getBoundingClientRect().width;
    var cssLeft = fabL.getBoundingClientRect().left - wrapRect.left;
    var cssRight = wrapRect.right - fabR.getBoundingClientRect().right;
    var mL = imgRect.left - wrapRect.left;
    var mR = wrapRect.right - imgRect.right;
    var fabLeft = Math.min(cssLeft, Math.max(hardFloor, mL - extra - fabLW));
    var fabRight = Math.min(cssRight, Math.max(hardFloor, mR - extra - fabRW));
    fabL.style.left = fabLeft + 'px';
    fabR.style.right = fabRight + 'px';
    // ideal spot is just outside the photo; never closer to the screen
    // edge than the fab column's inner side plus a gap (that would sit on
    // the icons), so if the photo is too wide the arrow ends up on the photo
    var nextLeft = Math.max(mL - gap - navW, fabLeft + fabLW + gap);
    var prevRight = Math.max(mR - gap - navW, fabRight + fabRW + gap);
    // prev sits on the photo's RIGHT side and next on its LEFT (RTL flow,
    // see the CSS comment on .result-nav-prev/-next)
    navPrev.style.right = Math.round(prevRight) + 'px';
    navNext.style.left = Math.round(nextLeft) + 'px';
  }
  $('result-canvas-view').addEventListener('load', positionResultFabColumns);
  window.addEventListener('resize', positionResultFabColumns);

  $('result-back-btn').addEventListener('click', function () {
    // Back from the guest's own just-taken photo leads on to the admin
    // settings, behind the password (guests keep going with "צילום נוסף").
    // A photo reached from a gallery, or reopened via the camera's own
    // "my last photo" thumbnail, just returns where it came from.
    if (resultReturnScreen === 'screen-camera' && !resultViaLastPhotoThumb) {
      openAdminModal();
      return;
    }
    showScreen(resultReturnScreen);
    if (resultReturnScreen === 'screen-camera') startCamera();
  });
  $('result-prev-btn').addEventListener('click', function () {
    if (galleryRowIndex <= 0) return;
    galleryRowIndex--;
    var row = galleryRows[galleryRowIndex];
    currentPhotoId = row.id;
    currentPhotoRects = row.photoRects || null;
    openResult(row.blob, false, row.gifBlob);
  });
  $('result-next-btn').addEventListener('click', function () {
    if (galleryRowIndex >= galleryRows.length - 1) return;
    galleryRowIndex++;
    var row = galleryRows[galleryRowIndex];
    currentPhotoId = row.id;
    currentPhotoRects = row.photoRects || null;
    openResult(row.blob, false, row.gifBlob);
  });
  $('btn-retake').addEventListener('click', function () {
    showScreen('screen-camera');
    startCamera();
  });
  $('camera-last-photo-btn').addEventListener('click', function () {
    if (!resultUrl) return;
    resultViaLastPhotoThumb = true;
    stopCamera();
    showScreen('screen-result');
  });
  $('result-gallery-btn').addEventListener('click', function () {
    reopenSettingsAfterScreen = false;
    openGallery('screen-result');
  });

  $('btn-delete').addEventListener('click', function () {
    if (currentPhotoId == null) return;
    dbDelete(currentPhotoId).then(function () {
      toast('התמונה נמחקה');
      openGallery();
    });
  });

  // ---------- Share ----------
  $('btn-share').addEventListener('click', function () {
    if (!currentBlob) return;
    if (bwPending) { whenBwReady().then(function () { $('btn-share').click(); }); return; }
    var file = new File([currentBlob], 'memories4u.jpg', { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Memories4U',
        text: GUEST_MESSAGE
      }).catch(function () {});
    } else {
      var a = document.createElement('a');
      a.href = resultUrl;
      a.download = 'memories4u.jpg';
      a.click();
      toast('התמונה הורדה למכשיר');
    }
  });

  // ---------- Black & white toggle ----------
  // Converts pixel-by-pixel rather than relying on the canvas filter API
  // (ctx.filter), which isn't reliably supported on every iPad/Safari
  // version and would otherwise fail silently with no visible change.
  var bwBlobCache = null; // memoizes the conversion for the current photo
  // Grayscales a raw captured frame (a canvas, not yet composited with the
  // white card/logo/text) - used so B&W only ever touches the actual
  // photo, never the card frame or branding drawn around it.
  function toGrayscaleCanvas(src, w, h) {
    w = w || src.width;
    h = h || src.height;
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    ctx.drawImage(src, 0, 0, w, h);
    var imageData = ctx.getImageData(0, 0, c.width, c.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
    return c;
  }
  // Fallback for a photo reopened from the gallery (its raw frames are
  // long gone) - grayscales the whole flattened image, frame and all,
  // same as before. Only the live just-captured photo (below) gets the
  // "photo only" treatment, since only it still has raw frames to
  // recomposite from.
  function toGrayscaleBlob(blob) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var gray = toGrayscaleCanvas(img, img.naturalWidth, img.naturalHeight);
        URL.revokeObjectURL(img.src);
        gray.toBlob(function (grayBlob) { resolve(grayBlob); }, 'image/jpeg', JPEG_QUALITY);
      };
      img.src = URL.createObjectURL(blob);
    });
  }
  // Greys one photo rectangle of a canvas in place (leaving the rounded
  // corners' outside untouched), so the white card, logo and text around it
  // are never touched or re-drawn.
  function grayRectInPlace(ctx, r) {
    var data = ctx.getImageData(r.x, r.y, r.w, r.h);
    var d = data.data;
    for (var row = 0; row < r.h; row++) {
      var dy = Math.min(row, r.h - 1 - row);
      var inset = r.r > 0 && dy < r.r ? Math.ceil(r.r - Math.sqrt(r.r * r.r - (r.r - dy) * (r.r - dy))) : 0;
      for (var col = inset; col < r.w - inset; col++) {
        var k = (row * r.w + col) * 4;
        var gray = d[k] * 0.299 + d[k + 1] * 0.587 + d[k + 2] * 0.114;
        d[k] = d[k + 1] = d[k + 2] = gray;
      }
    }
    ctx.putImageData(data, r.x, r.y);
  }
  // Greys only the photo area(s) of a finished card, in place, so only one
  // big canvas is ever held in memory.
  function toGrayscaleWithinRects(blob, rects) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onerror = function () { reject(new Error('decode')); };
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        rects.forEach(function (r) { grayRectInPlace(ctx, r); });
        c.toBlob(function (out) { out ? resolve(out) : reject(new Error('encode')); }, 'image/jpeg', JPEG_QUALITY);
      };
      img.src = URL.createObjectURL(blob);
    });
  }
  function grayscaleComposedPhoto() {
    // Every photo taken since the photo areas started being saved has them;
    // only much older photos fall back to greying the whole image.
    return currentPhotoRects && currentPhotoRects.length
      ? toGrayscaleWithinRects(currentColorBlob, currentPhotoRects)
      : toGrayscaleBlob(currentColorBlob);
  }
  function showResultBlob(blob) {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = URL.createObjectURL(blob);
    $('result-canvas-view').src = resultUrl;
  }
  // A quick, smaller black-and-white version made from the photo already on
  // screen (no big decode), so the button answers at once while the
  // full-quality one - the one that is printed, shared and saved - is built
  // in the background.
  function quickBwPreview() {
    var img = $('result-canvas-view');
    if (!img.naturalWidth) return Promise.reject(new Error('no image'));
    var scale = Math.min(1, 2200 / Math.max(img.naturalWidth, img.naturalHeight));
    var w = Math.max(1, Math.round(img.naturalWidth * scale)), h = Math.max(1, Math.round(img.naturalHeight * scale));
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    var rects = currentPhotoRects && currentPhotoRects.length
      ? currentPhotoRects.map(function (r) { return { x: Math.round(r.x * scale), y: Math.round(r.y * scale), w: Math.round(r.w * scale), h: Math.round(r.h * scale), r: r.r * scale }; })
      : [{ x: 0, y: 0, w: w, h: h, r: 0 }];
    rects.forEach(function (r) { grayRectInPlace(ctx, r); });
    return new Promise(function (resolve) { c.toBlob(resolve, 'image/jpeg', 0.92); });
  }
  var bwPending = null;
  // Print/share/QR wait for the full-quality B&W version if it's still being
  // built, so they never send the color or the smaller preview by mistake.
  function whenBwReady() {
    return bwPending ? bwPending.then(function () {}, function () {}) : Promise.resolve();
  }
  function bwToggleSimple(btn) {
    btn.disabled = true;
    var goingToBw = !isBw;
    var photoNext, gifNext;
    try {
      photoNext = goingToBw ? (bwBlobCache ? Promise.resolve(bwBlobCache) : grayscaleComposedPhoto()) : Promise.resolve(currentColorBlob);
      // The GIF (if this was a strip capture) is toggled the same way, so
      // sharing/downloading it after B&W matches what's shown on screen.
      // Only a photo taken just now still has the 3 raw shots the GIF is
      // rebuilt from; a photo reopened from the gallery keeps its saved
      // GIF as-is (rebuilding it from missing shots used to throw and
      // leave this button disabled forever).
      gifNext = !currentColorGifBlob || !currentPhotoIsLive ? Promise.resolve(null)
        : goingToBw ? (bwGifBlobCache ? Promise.resolve(bwGifBlobCache) : composeGif(lastStripFrames, true))
        : Promise.resolve(currentColorGifBlob);
    } catch (e) {
      btn.disabled = false;
      return;
    }
    Promise.all([photoNext, gifNext]).then(function (results) {
      var blob = results[0], gifBlob = results[1];
      if (goingToBw) {
        bwBlobCache = blob;
        if (gifBlob) bwGifBlobCache = gifBlob;
      }
      currentBlob = blob;
      if (gifBlob) currentGifBlob = gifBlob;
      isBw = goingToBw;
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(blob);
      $('result-canvas-view').src = resultUrl;
      btn.classList.toggle('active', isBw);
      btn.disabled = false;
    }).catch(function () {
      btn.disabled = false;
    });
  }
  $('btn-bw').addEventListener('click', function () {
    if (!currentColorBlob) return;
    var btn = this;
    var goingToBw = !isBw;
    var colorBlob = currentColorBlob;
    if (!goingToBw || bwBlobCache) { bwToggleSimple(btn); return; }
    isBw = true;
    btn.classList.add('active');
    var full = grayscaleComposedPhoto();
    bwPending = full;
    quickBwPreview().then(function (pb) {
      if (isBw && currentColorBlob === colorBlob && !bwBlobCache) showResultBlob(pb);
    }).catch(function () {});
    full.then(function (blob) {
      if (currentColorBlob !== colorBlob) return;
      bwBlobCache = blob;
      if (isBw) { currentBlob = blob; showResultBlob(blob); }
    }).catch(function () {
      if (currentColorBlob !== colorBlob) return;
      isBw = false;
      btn.classList.remove('active');
      currentBlob = colorBlob;
      showResultBlob(colorBlob);
    }).then(function () { if (bwPending === full) bwPending = null; });
    // The GIF's B&W version, only rebuildable for a photo just taken.
    if (currentColorGifBlob && currentPhotoIsLive) {
      composeGif(lastStripFrames, true).then(function (g) {
        if (currentColorBlob !== colorBlob) return;
        bwGifBlobCache = g;
        if (isBw) currentGifBlob = g;
      }).catch(function () {});
    }
  });

  // ---------- QR share ----------
  // Uploads a photo or GIF to the print-bridge running on the event
  // laptop, which briefly hosts it so the QR code has a real URL a
  // guest's own phone can open. Entries older than 2 hours are pruned
  // automatically. Shared by both the still-photo QR button and the
  // GIF one - the blob's own type (image/jpeg vs image/gif) is sent
  // as-is so the guest's phone gets it back correctly labeled instead
  // of every upload being hardcoded to image/jpeg.
  function showQrFor(blob) {
    if (!blob) return;
    $('qr-panel').classList.add('active');
    $('qr-render').innerHTML = '';
    var base = bridgeBase();
    if (!base) {
      $('qr-status').textContent = 'צריך קודם להגדיר את כתובת הגשר ב-⚙️ (אותה כתובת של ההדפסה).';
      return;
    }
    $('qr-status').textContent = 'מעלים…';
    fetch(base + '/upload', {
      method: 'POST',
      headers: { 'Content-Type': blob.type || 'image/jpeg', 'X-Booth-Token': BOOTH_TOKEN },
      body: blob
    }).then(function (res) {
      if (!res.ok) throw new Error('upload failed: ' + res.status);
      return res.json();
    }).then(function (data) {
      var url = base + '/photo/' + data.id;
      var qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      $('qr-render').innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2 });
      $('qr-status').textContent = 'סרקו עם הטלפון כדי לשמור';
    }).catch(function () {
      $('qr-status').textContent = 'שיתוף ה-QR לא זמין כרגע. אפשר לשתף ישירות מהכפתור "שיתוף".';
    });
  }
  $('btn-qr').addEventListener('click', function () {
    if (bwPending) { whenBwReady().then(function () { showQrFor(currentBlob); }); return; }
    showQrFor(currentBlob);
  });
  $('gif-qr-btn').addEventListener('click', function () {
    // The GIF panel and the QR panel share the same overlay z-index, and
    // the GIF panel comes later in the DOM, so opening the QR panel while
    // the GIF panel is still open leaves it hidden behind it (looks like
    // the button did nothing until GIF panel's own "סגירה" is tapped).
    $('gif-panel').classList.remove('active');
    showQrFor(viewGifBlob || currentGifBlob);
  });
  $('qr-close-btn').addEventListener('click', function () {
    $('qr-panel').classList.remove('active');
  });

  // ---------- GIF viewer ----------
  // The GIF a guest looks at, shares or scans is built at the camera's full
  // frame size, on demand, the moment they open it (few guests ever do, and
  // it takes a few seconds) - only possible while their own photo's raw shots
  // are still in memory; a photo reopened from the gallery uses the smaller
  // GIF saved with it. The button just dims while it works.
  var viewGifBlob = null;
  var fullGifCache = null;
  function getGifForSharing() {
    if (!currentPhotoIsLive || !lastStripFrames) return Promise.resolve(currentGifBlob);
    if (fullGifCache && fullGifCache.bw === isBw) return Promise.resolve(fullGifCache.blob);
    var btn = $('btn-gif');
    btn.disabled = true;
    btn.style.opacity = '.5';
    return composeGif(lastStripFrames, isBw, true).then(function (blob) {
      fullGifCache = { bw: isBw, blob: blob };
      return blob;
    }).catch(function () {
      return currentGifBlob;
    }).then(function (blob) {
      btn.disabled = false;
      btn.style.opacity = '';
      return blob;
    });
  }
  $('btn-gif').addEventListener('click', function () {
    if (!currentGifBlob) return;
    getGifForSharing().then(function (blob) {
      viewGifBlob = blob;
      if (resultGifUrl) URL.revokeObjectURL(resultGifUrl);
      resultGifUrl = URL.createObjectURL(blob);
      $('gif-view').src = resultGifUrl;
      $('gif-panel').classList.add('active');
    });
  });
  $('gif-close-btn').addEventListener('click', function () {
    $('gif-panel').classList.remove('active');
  });
  $('gif-share-btn').addEventListener('click', function () {
    var shareGif = viewGifBlob || currentGifBlob;
    if (!shareGif) return;
    var file = new File([shareGif], 'memories4u.gif', { type: 'image/gif' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Memories4U',
        text: GUEST_MESSAGE
      }).catch(function () {});
    } else {
      var a = document.createElement('a');
      a.href = resultGifUrl;
      a.download = 'memories4u.gif';
      a.click();
      toast('ה-GIF הורד למכשיר');
    }
  });

  // ---------- Print ----------
  var PRINT_BRIDGE_KEY = 'm4u_print_bridge_base';
  function bridgeBase() {
    var base = localStorage.getItem(PRINT_BRIDGE_KEY);
    return base ? base.replace(/\/$/, '') : null;
  }
  function printBridgeUrl() {
    var base = bridgeBase();
    return base ? base + '/print' : null;
  }
  // Same reasoning as the event-info modal above - window.prompt() was
  // found to freeze the live camera video on iOS, so this uses a normal
  // on-screen modal instead.
  // Same autosave-while-typing + true-Cancel-reverts pattern as the
  // event-info modal above (see the comment there for why Cancel no
  // longer commits whatever's on screen).
  var printBridgeSnapshot = null;
  var printBridgeAutosaveTimer = null;
  $('print-settings-btn').addEventListener('click', function () {
    var current = localStorage.getItem(PRINT_BRIDGE_KEY) || '';
    $('print-bridge-input').value = current;
    printBridgeSnapshot = current;
    $('print-modal').classList.add('active');
  });
  function commitPrintBridge() {
    var base = $('print-bridge-input').value.trim().replace(/\/$/, '');
    if (base) {
      localStorage.setItem(PRINT_BRIDGE_KEY, base);
    } else {
      localStorage.removeItem(PRINT_BRIDGE_KEY);
    }
  }
  function schedulePrintBridgeAutosave() {
    clearTimeout(printBridgeAutosaveTimer);
    printBridgeAutosaveTimer = setTimeout(commitPrintBridge, 500);
  }
  $('print-bridge-input').addEventListener('input', schedulePrintBridgeAutosave);
  $('print-modal-cancel').addEventListener('click', function () {
    clearTimeout(printBridgeAutosaveTimer);
    if (printBridgeSnapshot) {
      localStorage.setItem(PRINT_BRIDGE_KEY, printBridgeSnapshot);
    } else {
      localStorage.removeItem(PRINT_BRIDGE_KEY);
    }
    $('print-modal').classList.remove('active');
  });
  $('print-modal-save').addEventListener('click', function () {
    clearTimeout(printBridgeAutosaveTimer);
    var hadValue = !!$('print-bridge-input').value.trim();
    commitPrintBridge();
    toast(hadValue ? 'כתובת ההדפסה נשמרה' : 'חוזרים לתיבת ההדפסה הרגילה');
    $('print-modal').classList.remove('active');
  });
  var printCopies = 1;
  $('copies-minus').addEventListener('click', function () {
    printCopies = Math.max(1, printCopies - 1);
    $('copies-count').textContent = printCopies;
  });
  $('copies-plus').addEventListener('click', function () {
    printCopies = Math.min(5, printCopies + 1);
    $('copies-count').textContent = printCopies;
  });

  function sendOnePrint(bridge) {
    return fetch(bridge, {
      method: 'POST',
      headers: { 'Content-Type': 'image/jpeg', 'X-Booth-Token': BOOTH_TOKEN },
      body: currentBlob
    }).then(function (res) {
      if (!res.ok) throw new Error('print failed: ' + res.status);
    });
  }

  // Re-renders the currently viewed photo from its raw frame(s) against
  // whatever design is saved right now, so a logo nudge or margin tweak
  // made in the design editor actually shows up next time this photo is
  // printed - printing used to just resend the flattened image frozen at
  // the moment it was captured, silently ignoring every later edit.
  // Only possible for the guest's own just-taken photo (currentPhotoIsLive)
  // - an older gallery photo's raw frames aren't kept around.
  function recomposeCurrentPhotoFromDesign() {
    if (!currentPhotoIsLive) return Promise.resolve(currentBlob);
    var colorCanvas = captureMode === 'strip' ? composeStrip(lastStripFrames) : composeWide(lastWideFrame);
    // Grayscale the raw frame(s) and recompose separately from the color
    // version, rather than greying the finished color composite - same
    // reason as grayscaleComposedPhoto above: B&W must only touch the
    // photo, not the white card/logo/text drawn around it.
    var bwCanvas = isBw
      ? (captureMode === 'strip'
          ? composeStrip(lastStripFrames.map(function (f) { return toGrayscaleCanvas(f); }))
          : composeWide(toGrayscaleCanvas(lastWideFrame)))
      : null;
    return canvasToBlob(colorCanvas).then(function (colorBlob) {
      currentColorBlob = colorBlob;
      bwBlobCache = null;
      return isBw ? canvasToBlob(bwCanvas) : colorBlob;
    }).then(function (finalBlob) {
      currentBlob = finalBlob;
      if (isBw) bwBlobCache = finalBlob;
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(finalBlob);
      $('result-canvas-view').src = resultUrl;
      return finalBlob;
    });
  }

  // A guest mashing "4 עותקים"/"5 עותקים" repeatedly for the SAME photo
  // was seen live printing ~30 copies of one photo before anyone noticed.
  // Every copy count now has a free allowance before it starts asking for
  // the staff password on the SAME photo: 1-3 copies (a normal reprint)
  // get 2 free prints each before the 3rd+ needs a password; 4-5 copies
  // (almost always accidental/spam at that volume) get only 1 free print
  // before the 2nd+ needs one. Tracked separately per exact copy count
  // (printing "2 copies" twice doesn't use up "3 copies"'s allowance).
  // Resets whenever a different photo is opened (see openResult).
  var printAttemptsByCopies = {};
  function freePrintsAllowed(copies) { return copies <= 3 ? 2 : 1; }
  // A black-and-white photo that gets printed is also kept in the album (the
  // same gallery both staff and guests browse) as its own photo, once per
  // photo however many times or copies it's printed.
  var bwCopySaved = false;
  function saveBwCopyIfNeeded() {
    if (!isBw || bwCopySaved || !currentBlob) return;
    bwCopySaved = true;
    var blob = currentBlob, rects = currentPhotoRects;
    dbAdd(blob, null, rects).then(function (id) {
      thumbFromBlob(blob).then(function (t) { dbPutThumb(id, t); }).catch(function () {});
    }).catch(function () { bwCopySaved = false; });
  }
  function doPrint() {
    recomposeCurrentPhotoFromDesign().then(function () {
      saveBwCopyIfNeeded();
      var bridge = printBridgeUrl();
      if (!bridge) {
        $('print-img').src = resultUrl;
        window.print();
        return;
      }
      var copies = printCopies;
      toast('שולח להדפסה (' + copies + ' עותקים)…');
      var chain = Promise.resolve();
      for (var i = 0; i < copies; i++) {
        chain = chain.then(function () { return sendOnePrint(bridge); });
      }
      chain.then(function () {
        toast('נשלח להדפסה');
      }).catch(function () {
        toast('ההדפסה הישירה נכשלה, פותח את תיבת ההדפסה הרגילה');
        $('print-img').src = resultUrl;
        window.print();
      });
    });
  }
  $('btn-print').addEventListener('click', function () {
    if (!currentBlob) return;
    if (bwPending) { whenBwReady().then(function () { $('btn-print').click(); }); return; }
    var copies = printCopies;
    var used = printAttemptsByCopies[copies] || 0;
    if (used >= freePrintsAllowed(copies)) {
      openAdminModal(function () {
        printAttemptsByCopies[copies] = used + 1;
        doPrint();
      });
      return;
    }
    printAttemptsByCopies[copies] = used + 1;
    doPrint();
  });

  // ---------- Gallery ----------
  // Remembers which screen opened the gallery (guest result screen, or
  // staff settings panel) so the back button returns to the right place.
  var galleryReturnScreen = 'screen-camera';
  // When a screen (gallery, design editor) was reached from the settings
  // panel (⚙), its back button should reopen settings too - not just dump
  // staff on the main screen and make them tap ⚙ all over again. Shared
  // across every settings-launched screen, not just the gallery.
  var reopenSettingsAfterScreen = false;
  var gallerySelectMode = false;
  var gallerySelectedIds = {};

  function openGallery(returnTo) {
    if (returnTo) galleryReturnScreen = returnTo;
    gallerySelectMode = false;
    gallerySelectedIds = {};
    // A guest can reach the gallery straight from their own result screen
    // (no password) - management actions (select/delete-all/export-all)
    // stay admin-only, reached only via ⚙️ settings, never for a guest.
    var isGuestGallery = galleryReturnScreen === 'screen-result';
    $('gallery-admin-toolbar').style.display = isGuestGallery ? 'none' : '';
    $('export-all-group').style.display = isGuestGallery ? 'none' : '';
    showScreen('screen-gallery');
    renderGalleryGrid();
  }

  // dbAll() is async and renderGalleryGrid() gets called on every
  // selection click - without this guard, an older call's dbAll() can
  // resolve after a newer one already redrew the grid and append a
  // second, stale, duplicate set of items on top of it.
  var galleryRenderGen = 0;
  // Kept so the result screen's ‹/› arrows can step to the next/previous
  // photo without bouncing back to the grid each time.
  var galleryRows = [];
  var galleryRowIndex = -1;
  function renderGalleryGrid() {
    var myGen = ++galleryRenderGen;
    var grid = $('gallery-grid');
    grid.innerHTML = '';
    grid.classList.toggle('selecting', gallerySelectMode);
    $('gallery-selection-toolbar').style.display = gallerySelectMode ? 'flex' : 'none';
    $('gallery-select-btn').textContent = gallerySelectMode ? '✕ בטל בחירה' : '☑ בחירה';
    var isGuestGallery = galleryReturnScreen === 'screen-result';
    dbAllForActiveEvent().then(function (rows) {
      if (myGen !== galleryRenderGen) return;
      galleryRows = rows;
      $('gallery-photo-count').textContent = isGuestGallery ? '' : (rows.length + ' תמונות');
      if (!rows.length) {
        var empty = document.createElement('div');
        empty.className = 'gallery-empty';
        empty.textContent = 'עדיין אין תמונות מהאירוע הזה';
        grid.appendChild(empty);
        return;
      }
      updateSelectionButtons();
      dbAllThumbs().then(function (thumbs) {
        if (myGen !== galleryRenderGen) return;
        galleryThumbUrls.forEach(function (u) { URL.revokeObjectURL(u); });
        galleryThumbUrls = [];
        rows.forEach(function (row) {
          var isSelected = !!gallerySelectedIds[row.id];
          var item = document.createElement('div');
          item.className = 'gallery-item' + (gallerySelectMode && isSelected ? ' selected' : '');
          var img = document.createElement('img');
          if (thumbs[row.id]) {
            var url = URL.createObjectURL(thumbs[row.id]);
            galleryThumbUrls.push(url);
            img.src = url;
          } else {
            enqueueThumb(row, img);
          }
          item.appendChild(img);
          item._row = row;
          var check = null;
          if (gallerySelectMode) {
            check = document.createElement('div');
            check.className = 'gallery-check';
            check.textContent = isSelected ? '✓' : '';
            item.appendChild(check);
            item._check = check;
          }
          item.addEventListener('click', function () {
            if (gallerySelectMode) {
              if (dragSelJustEnded) return;
              // Toggled in place - rebuilding the whole grid on every tap
              // re-created every tile and made selecting sluggish.
              setItemSelected(item, !gallerySelectedIds[row.id]);
              updateSelectionButtons();
            } else {
              currentPhotoId = row.id;
              galleryRowIndex = galleryRows.indexOf(row);
              currentPhotoRects = row.photoRects || null;
              openResult(row.blob, false, row.gifBlob);
            }
          });
          grid.appendChild(item);
        });
      });
    });
  }
  var galleryThumbUrls = [];
  function updateSelectionButtons() {
    var selectedCount = Object.keys(gallerySelectedIds).length;
    $('gallery-share-selected-btn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px" aria-hidden="true"><path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8"/><path d="M12 15V3"/><path d="M7 8l5-5 5 5"/></svg> שתף (' + selectedCount + ')';
    $('gallery-delete-selected-btn').textContent = '🗑️ מחק (' + selectedCount + ')';
    $('gallery-select-all-btn').textContent = galleryRows.length && selectedCount === galleryRows.length ? 'בטל הכל' : 'בחר הכל';
  }
  function setItemSelected(item, on) {
    var row = item._row;
    if (!row) return;
    if (on) gallerySelectedIds[row.id] = row.blob; else delete gallerySelectedIds[row.id];
    item.classList.toggle('selected', on);
    if (item._check) item._check.textContent = on ? '✓' : '';
  }
  $('gallery-select-all-btn').addEventListener('click', function () {
    var allSelected = galleryRows.length && Object.keys(gallerySelectedIds).length === galleryRows.length;
    Array.prototype.forEach.call($('gallery-grid').querySelectorAll('.gallery-item'), function (item) {
      setItemSelected(item, !allSelected);
    });
    updateSelectionButtons();
  });

  // Drag-to-select, like the Photos app: in selection mode, press on a tile and
  // slide a finger sideways across others to select (or, if the first tile was
  // already selected, deselect) everything passed over, including tiles the
  // finger skipped over; near the top/bottom edge the grid scrolls by itself.
  // A mostly-vertical drag is left to normal scrolling.
  var dragSel = null;
  var dragSelJustEnded = false;
  var dragScrollTimer = null;
  var galleryGridEl = $('gallery-grid');
  function tileAtPoint(x, y) {
    var el = document.elementFromPoint(x, y);
    return el && el.closest ? el.closest('#gallery-grid .gallery-item') : null;
  }
  function applyDragRange(a, b, on) {
    var items = Array.prototype.slice.call(galleryGridEl.querySelectorAll('.gallery-item'));
    var ia = items.indexOf(a), ib = items.indexOf(b);
    if (ia < 0 || ib < 0) return;
    for (var k = Math.min(ia, ib); k <= Math.max(ia, ib); k++) setItemSelected(items[k], on);
  }
  function dragSelectUpdate() {
    var tile = tileAtPoint(dragSel.ex, dragSel.ey);
    if (tile && tile !== dragSel.last) {
      applyDragRange(dragSel.last, tile, dragSel.mode);
      dragSel.last = tile;
      updateSelectionButtons();
    }
  }
  function dragScrollTick() {
    if (!dragSel || !dragSel.active) { dragScrollTimer = null; return; }
    var rect = galleryGridEl.getBoundingClientRect();
    var edge = 70, speed = 0;
    if (dragSel.ey < rect.top + edge) speed = -Math.ceil((rect.top + edge - dragSel.ey) / 6);
    else if (dragSel.ey > rect.bottom - edge) speed = Math.ceil((dragSel.ey - (rect.bottom - edge)) / 6);
    if (speed) {
      galleryGridEl.scrollTop += speed;
      dragSelectUpdate();
    }
    dragScrollTimer = requestAnimationFrame(dragScrollTick);
  }
  galleryGridEl.addEventListener('pointerdown', function (e) {
    if (!gallerySelectMode) return;
    var tile = e.target.closest ? e.target.closest('.gallery-item') : null;
    if (!tile) return;
    dragSel = { id: e.pointerId, x: e.clientX, y: e.clientY, ex: e.clientX, ey: e.clientY, start: tile, last: tile, active: false, mode: true };
  });
  galleryGridEl.addEventListener('pointermove', function (e) {
    if (!dragSel || e.pointerId !== dragSel.id) return;
    dragSel.ex = e.clientX;
    dragSel.ey = e.clientY;
    if (!dragSel.active) {
      var dx = e.clientX - dragSel.x, dy = e.clientY - dragSel.y;
      var horizontal = Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy);
      var mouseDrag = e.pointerType === 'mouse' && Math.max(Math.abs(dx), Math.abs(dy)) > 8;
      if (!horizontal && !mouseDrag) return;
      dragSel.active = true;
      dragSel.mode = !gallerySelectedIds[dragSel.start._row.id];
      setItemSelected(dragSel.start, dragSel.mode);
      updateSelectionButtons();
      try { galleryGridEl.setPointerCapture(e.pointerId); } catch (err) {}
      dragScrollTimer = requestAnimationFrame(dragScrollTick);
    }
    e.preventDefault();
    dragSelectUpdate();
  });
  function endDragSelect() {
    if (dragSel && dragSel.active) {
      dragSelJustEnded = true;
      setTimeout(function () { dragSelJustEnded = false; }, 60);
    }
    dragSel = null;
  }
  galleryGridEl.addEventListener('pointerup', endDragSelect);
  galleryGridEl.addEventListener('pointercancel', endDragSelect);
  galleryGridEl.addEventListener('touchmove', function (e) {
    if (dragSel && dragSel.active) e.preventDefault();
  }, { passive: false });

  // Older photos with no thumbnail yet get one made in the background, one
  // at a time (decoding a full-size photo is heavy), and saved for good.
  var thumbQueue = [];
  var thumbBusy = false;
  function enqueueThumb(row, img) {
    thumbQueue.push({ row: row, img: img });
    if (!thumbBusy) runThumbQueue();
  }
  function runThumbQueue() {
    var job = thumbQueue.shift();
    if (!job) { thumbBusy = false; return; }
    thumbBusy = true;
    thumbFromBlob(job.row.blob).then(function (tb) {
      dbPutThumb(job.row.id, tb);
      if (job.img.isConnected) {
        var url = URL.createObjectURL(tb);
        galleryThumbUrls.push(url);
        job.img.src = url;
      }
    }).catch(function () {}).then(function () { setTimeout(runThumbQueue, 30); });
  }

  $('gallery-back-btn').addEventListener('click', function () {
    if (galleryReturnScreen === 'screen-result') {
      // Guest album: back always returns to the guest's OWN photo (whose
      // back goes on to the camera), never to a photo they merely browsed
      // to - that used to bounce between album and photo forever.
      if (lastCapture) {
        currentPhotoId = lastCapture.id;
        currentPhotoRects = lastCapture.rects;
        openResult(lastCapture.blob, true, lastCapture.gifBlob);
      } else {
        showScreen('screen-camera');
        startCamera();
      }
      return;
    }
    showScreen(galleryReturnScreen);
    if (galleryReturnScreen === 'screen-camera') startCamera();
    if (reopenSettingsAfterScreen) {
      reopenSettingsAfterScreen = false;
      openSettingsPanel();
    }
  });
  $('gallery-select-btn').addEventListener('click', function () {
    gallerySelectMode = !gallerySelectMode;
    gallerySelectedIds = {};
    renderGalleryGrid();
  });
  $('gallery-cancel-select-btn').addEventListener('click', function () {
    gallerySelectMode = false;
    gallerySelectedIds = {};
    renderGalleryGrid();
  });
  $('gallery-delete-all-btn').addEventListener('click', function () {
    dbAllForActiveEvent().then(function (rows) {
      if (!rows.length) { toast('אין תמונות למחוק'); return; }
      if (!confirm('למחוק את כל ' + rows.length + ' התמונות של האירוע הזה? לא ניתן לבטל את זה.')) return;
      Promise.all(rows.map(function (row) { return dbDelete(row.id); })).then(function () {
        toast('כל התמונות נמחקו');
        renderGalleryGrid();
      });
    });
  });
  $('gallery-delete-selected-btn').addEventListener('click', function () {
    var ids = Object.keys(gallerySelectedIds);
    if (!ids.length) { toast('לא סימנתם תמונות'); return; }
    if (!confirm('למחוק ' + ids.length + ' תמונות שסומנו? לא ניתן לבטל את זה.')) return;
    Promise.all(ids.map(function (id) { return dbDelete(Number(id)); })).then(function () {
      gallerySelectedIds = {};
      toast('התמונות שסומנו נמחקו');
      renderGalleryGrid();
    });
  });
  $('gallery-share-selected-btn').addEventListener('click', function () {
    var blobs = Object.keys(gallerySelectedIds).map(function (id, i) {
      return new File([gallerySelectedIds[id]], 'memories4u-' + (i + 1) + '.jpg', { type: 'image/jpeg' });
    });
    if (!blobs.length) { toast('לא סימנתם תמונות'); return; }
    if (navigator.canShare && navigator.canShare({ files: blobs })) {
      navigator.share({ files: blobs, title: 'Memories4U' }).catch(function () {});
    } else {
      toast('השיתוף המרובה לא נתמך במכשיר הזה - נסו לסמן פחות תמונות');
    }
  });

  // ---------- Design editor ----------
  // Every draggable element (title/date/heart/brand/custom) is a "layer"
  // in design.layers. Tapping one on the canvas (or its chip below)
  // selects it and shows its own controls: content, font, color, size,
  // rotation, plus center/duplicate/delete actions. Works with touch,
  // mouse, and Apple Pencil alike since it's all built on Pointer Events.
  var FONT_SELECT_OPTIONS = Object.keys(FONT_OPTIONS).map(function (key) {
    var opt = FONT_OPTIONS[key];
    return { value: key, label: opt.label + (opt.noHebrew ? ' (לא לעברית)' : '') };
  });
  // Deliberately only solid/filled heart shapes (no outline, no other
  // colors) - ♥ ❤ ❦ ❧ render filled-in and respect whatever color is
  // picked (so choosing black gives a solid black heart); 🖤 is the one
  // glyph that's always solid black by definition.
  var EMOJI_PRESETS = ['♥', '❤', '❥', '🖤', '❦', '❧'];

  var STRIP_GENERAL_CONTROLS = [
    { key: 'sideTextW', label: 'רוחב שוליים לצדדים', min: 10, max: 60, step: 2 },
    { key: 'innerPad', label: 'ריווח פנימי', min: 0, max: 40, step: 2 },
    { key: 'topMargin', label: 'שוליים למעלה', min: 0, max: 100, step: 2 },
    { key: 'gap', label: 'רווח בין תמונות', min: 0, max: 40, step: 2 },
    { key: 'footerH', label: 'גובה אזור הטקסט', min: 100, max: 400, step: 10 },
    { key: 'cornerRadius', label: 'עיגול פינות', min: 0, max: 30, step: 1 }
  ];
  var WIDE_GENERAL_CONTROLS = [
    { key: 'marginTopPct', label: 'שוליים למעלה', min: 0, max: 20, step: 0.2, scale: 100 },
    { key: 'marginSidePct', label: 'שוליים לצדדים', min: 0, max: 20, step: 0.2, scale: 100 },
    { key: 'footerPct', label: 'גובה אזור הטקסט', min: 5, max: 35, step: 1, scale: 100 },
    { key: 'cornerRadius', label: 'עיגול פינות התמונה', min: 0, max: 60, step: 2 }
  ];

  var designTab = 'strip';
  var designDragging = null;
  var designHits = [];
  var selectedLayerId = null;
  var lastStripFrames = null;
  var lastWideFrame = null;
  var designCanvas = $('design-canvas');

  function placeholderFrame(w, h, label) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#D9C696');
    g.addColorStop(1, '#4A3C1E');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.font = Math.round(w * 0.14) + 'px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2);
    return c;
  }
  function previewStripFrames() {
    return lastStripFrames || [1, 2, 3].map(function (n) { return placeholderFrame(600, 800, String(n)); });
  }
  function previewWideFrame() {
    return lastWideFrame || placeholderFrame(1080, 1440, 'תצוגה');
  }

  function currentDesignKey() { return designTab === 'strip' ? STRIP_DESIGN_KEY : WIDE_DESIGN_KEY; }
  function currentCustomDefaultKey() { return designTab === 'strip' ? CUSTOM_DEFAULT_STRIP_KEY : CUSTOM_DEFAULT_WIDE_KEY; }
  function currentDesign() { return designTab === 'strip' ? getStripDesign() : getWideDesign(); }

  function renderDesignPreview() {
    designHits = [];
    var design = currentDesign();
    var canvas = designTab === 'strip'
      ? composeStrip(previewStripFrames(), design, designHits)
      : composeWide(previewWideFrame(), design, designHits);
    designCanvas.width = canvas.width;
    designCanvas.height = canvas.height;
    var ctx = designCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);
    if (selectedLayerId) {
      var hit = designHits.filter(function (h) { return h.key === selectedLayerId; })[0];
      if (hit) {
        // Drawn relative to the layer's own pivot (cx,cy) and rotated the
        // same way the layer itself is (rotation 0 makes this identical to
        // the old fixed strokeRect) - the box previously stayed axis-
        // aligned even when the layer was rotated, so a rotated logo's
        // selection outline visibly stopped matching it.
        ctx.save();
        ctx.strokeStyle = '#D9C696';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.translate(hit.cx, hit.cy);
        ctx.rotate((hit.rotation || 0) * Math.PI / 180);
        ctx.strokeRect(hit.x - hit.cx - 6, hit.y - hit.cy - 6, hit.w + 12, hit.h + 12);
        ctx.restore();
      }
    }
  }

  function newLayerId() {
    return 'layer_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function findLayer(design, id) {
    for (var i = 0; i < design.layers.length; i++) {
      if (design.layers[i].id === id) return design.layers[i];
    }
    return null;
  }
  function addLayer(type, extra) {
    var design = currentDesign();
    var layer;
    if (type === 'emoji') {
      layer = { id: newLayerId(), type: 'emoji', text: '♥', x: 0.5, y: 0.5, size: designTab === 'strip' ? 24 : 3, color: '#000000', rotation: 0 };
    } else if (type === 'image') {
      layer = { id: newLayerId(), type: 'image', src: extra.src, x: 0.5, y: 0.5, size: 60, rotation: 0 };
    } else {
      layer = { id: newLayerId(), type: 'text', text: 'טקסט חדש', x: 0.5, y: 0.5, size: designTab === 'strip' ? 28 : 3.5, color: '#000000', font: 'sans', rotation: 0, weight: '' };
    }
    if (type === 'image') {
      // A logo/background image goes to the very back, so text and other
      // elements added afterwards naturally draw on top of it.
      design.layers.unshift(layer);
      preloadLayerImage(layer.src);
    } else {
      design.layers.push(layer);
    }
    saveDesign(currentDesignKey(), design);
    selectedLayerId = layer.id;
    renderDesignControls();
    renderDesignPreview();
  }
  function duplicateLayer(id) {
    var design = currentDesign();
    var orig = findLayer(design, id);
    if (!orig) return;
    var copy = JSON.parse(JSON.stringify(orig));
    copy.id = newLayerId();
    if (copy.auto) {
      // A duplicate is decoupled from the live event-info binding - it
      // bakes in the current text as a plain, independently editable copy.
      var info = getEventInfo();
      copy.text = copy.auto === 'title' ? (info.title || '') : (info.date || '');
      delete copy.auto;
    }
    copy.x = Math.min(1, copy.x + 0.04);
    copy.y = Math.min(1, copy.y + 0.04);
    design.layers.push(copy);
    saveDesign(currentDesignKey(), design);
    selectedLayerId = copy.id;
    renderDesignControls();
    renderDesignPreview();
  }
  function deleteLayer(id) {
    var design = currentDesign();
    design.layers = design.layers.filter(function (l) { return l.id !== id; });
    saveDesign(currentDesignKey(), design);
    if (selectedLayerId === id) selectedLayerId = null;
    renderDesignControls();
    renderDesignPreview();
  }
  function centerLayerH(id) {
    var design = currentDesign();
    var layer = findLayer(design, id);
    if (!layer) return;
    layer.x = 0.5;
    saveDesign(currentDesignKey(), design);
    renderDesignControls();
    renderDesignPreview();
  }
  // Layers draw in array order (later = on top) - these move a layer to
  // the very front or back of that order, e.g. to put a logo ON TOP of
  // the text instead of always behind it.
  function bringLayerToFront(id) {
    var design = currentDesign();
    var idx = design.layers.findIndex(function (l) { return l.id === id; });
    if (idx < 0 || idx === design.layers.length - 1) return;
    var layer = design.layers.splice(idx, 1)[0];
    design.layers.push(layer);
    saveDesign(currentDesignKey(), design);
    renderDesignPreview();
  }
  function sendLayerToBack(id) {
    var design = currentDesign();
    var idx = design.layers.findIndex(function (l) { return l.id === id; });
    if (idx <= 0) return;
    var layer = design.layers.splice(idx, 1)[0];
    design.layers.unshift(layer);
    saveDesign(currentDesignKey(), design);
    renderDesignPreview();
  }

  function mkRow(labelText) {
    var row = document.createElement('div');
    row.className = 'design-row';
    var label = document.createElement('label');
    label.textContent = labelText;
    row.appendChild(label);
    return row;
  }
  function mkActionBtn(text, onClick, danger) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-ghost layer-action-btn' + (danger ? ' btn-danger' : '');
    b.textContent = text;
    b.addEventListener('click', onClick);
    return b;
  }
  // The number box next to each slider only commits on blur/Enter (the
  // 'change' event), not on every keystroke - typing "-90" one digit at a
  // time would otherwise get clamped to the slider's min/max mid-way
  // through (e.g. "-9" clamped before the final "0" is even typed).
  function buildLiveRangeRow(labelText, value, range, onChange) {
    var row = mkRow(labelText);
    var input = document.createElement('input');
    input.type = 'range';
    input.min = range.min; input.max = range.max; input.step = range.step;
    input.value = value;
    var num = document.createElement('input');
    num.type = 'number';
    num.className = 'val-input';
    num.min = range.min; num.max = range.max; num.step = range.step;
    num.value = value;
    num.addEventListener('focus', scrollFieldAboveKeyboard);
    input.addEventListener('input', function () {
      num.value = input.value;
      onChange(Number(input.value));
    });
    num.addEventListener('change', function () {
      var v = Number(num.value);
      if (isNaN(v)) { num.value = input.value; return; }
      v = Math.min(range.max, Math.max(range.min, v));
      num.value = v;
      input.value = v;
      onChange(v);
    });
    row.appendChild(input);
    row.appendChild(num);
    return row;
  }
  // On iOS the on-screen keyboard covers the bottom of the screen, so a
  // field near the bottom of the panel (e.g. rotation, which is one of
  // the last rows) ends up hidden behind it right when the user starts
  // typing. Nudging it into view once the keyboard has finished
  // animating in keeps it visible while editing.
  function scrollFieldAboveKeyboard(e) {
    var el = e.target;
    setTimeout(function () {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 300);
  }
  function buildRangeRow(design, c) {
    var row = mkRow(c.label);
    var scale = c.scale || 1;
    var input = document.createElement('input');
    input.type = 'range';
    input.min = c.min; input.max = c.max; input.step = c.step;
    input.value = design[c.key] * scale;
    var num = document.createElement('input');
    num.type = 'number';
    num.className = 'val-input';
    num.min = c.min; num.max = c.max; num.step = c.step;
    num.value = Math.round(design[c.key] * scale * 100) / 100;
    num.addEventListener('focus', scrollFieldAboveKeyboard);
    function apply(v) {
      var d = currentDesign();
      d[c.key] = v / scale;
      saveDesign(currentDesignKey(), d);
      renderDesignPreview();
    }
    input.addEventListener('input', function () {
      num.value = input.value;
      apply(Number(input.value));
    });
    num.addEventListener('change', function () {
      var v = Number(num.value);
      if (isNaN(v)) { num.value = input.value; return; }
      v = Math.min(c.max, Math.max(c.min, v));
      num.value = v;
      input.value = v;
      apply(v);
    });
    row.appendChild(input);
    row.appendChild(num);
    return row;
  }

  function layerChipLabel(layer) {
    if (layer.type === 'image') return '🖼 לוגו';
    if (layer.type === 'emoji') return layer.text || '♥';
    if (layer.auto === 'title') return '📝 כותרת';
    if (layer.auto === 'date') return '📅 תאריך';
    return '🔤 ' + (layer.text || 'טקסט').slice(0, 8);
  }

  function buildLayerPanel(design, layer) {
    var wrap = document.createElement('div');
    wrap.className = 'layer-panel';

    var actions = document.createElement('div');
    actions.className = 'layer-actions';
    actions.appendChild(mkActionBtn('◎ מרכז אופקית', function () { centerLayerH(layer.id); }));
    actions.appendChild(mkActionBtn('⧉ שכפול', function () { duplicateLayer(layer.id); }));
    actions.appendChild(mkActionBtn('🗑️ מחיקה', function () { deleteLayer(layer.id); }, true));
    wrap.appendChild(actions);

    var orderActions = document.createElement('div');
    orderActions.className = 'layer-actions';
    orderActions.appendChild(mkActionBtn('⬆ להביא קדימה (מעל הכל)', function () { bringLayerToFront(layer.id); }));
    orderActions.appendChild(mkActionBtn('⬇ לשלוח אחורה (מתחת לכל)', function () { sendLayerToBack(layer.id); }));
    wrap.appendChild(orderActions);

    // Precise nudging, for when a drag or pinch is too coarse - small
    // fixed steps in each direction, independent of the gesture system.
    // Kept small (a quarter of the old 0.01 step) so a single press lands
    // close to the exact spot instead of overshooting it - holding the
    // button still crosses the canvas quickly via the repeat timer below.
    var NUDGE_STEP = 0.0025;
    function nudge(dx, dy) {
      layer.x = Math.min(1, Math.max(0, layer.x + dx));
      layer.y = Math.min(1, Math.max(0, layer.y + dy));
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
    }
    // Press-and-hold repeat: one immediate step on press, then (after a
    // short delay, like OS key-repeat) it keeps moving on its own until
    // released - instead of needing a separate tap per small step.
    function mkHoldNudgeBtn(text, dx, dy) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-ghost layer-action-btn';
      b.textContent = text;
      var holdTimer = null, repeatTimer = null;
      function stop() {
        clearTimeout(holdTimer);
        clearInterval(repeatTimer);
        holdTimer = null;
        repeatTimer = null;
      }
      b.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        try { b.setPointerCapture(e.pointerId); } catch (err) {}
        nudge(dx, dy);
        holdTimer = setTimeout(function () {
          repeatTimer = setInterval(function () { nudge(dx, dy); }, 60);
        }, 350);
      });
      b.addEventListener('pointerup', stop);
      b.addEventListener('pointercancel', stop);
      b.addEventListener('pointerleave', stop);
      return b;
    }
    var nudgeWrap = document.createElement('div');
    nudgeWrap.className = 'layer-nudge';
    var vRow = document.createElement('div');
    vRow.className = 'nudge-row';
    vRow.appendChild(mkHoldNudgeBtn('▲ למעלה', 0, -NUDGE_STEP));
    vRow.appendChild(mkHoldNudgeBtn('▼ למטה', 0, NUDGE_STEP));
    var hRow = document.createElement('div');
    hRow.className = 'nudge-row';
    hRow.appendChild(mkHoldNudgeBtn('► ימינה', NUDGE_STEP, 0));
    hRow.appendChild(mkHoldNudgeBtn('◄ שמאלה', -NUDGE_STEP, 0));
    nudgeWrap.appendChild(vRow);
    nudgeWrap.appendChild(hRow);
    wrap.appendChild(nudgeWrap);

    // Exact position, as % of the card - x/y are stored as 0-1 fractions
    // internally, so this is just that times 100. Dragging and the nudge
    // buttons above are fine for "roughly here"; this is for dialing in
    // an exact spot (e.g. matching a position you already measured on
    // another layer) without guessing at a slider or drag gesture.
    wrap.appendChild(buildLiveRangeRow('מיקום אופקי (%)', Math.round(layer.x * 1000) / 10, { min: 0, max: 100, step: 0.1 }, function (v) {
      layer.x = Math.min(1, Math.max(0, v / 100));
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
    }));
    wrap.appendChild(buildLiveRangeRow('מיקום אנכי (%)', Math.round(layer.y * 1000) / 10, { min: 0, max: 100, step: 0.1 }, function (v) {
      layer.y = Math.min(1, Math.max(0, v / 100));
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
    }));

    // Size and rotation live right next to position (all four are the
    // same kind of "exact number" control) instead of after the
    // content/font/color fields further down.
    // Image layer size is always % of the card's width (so it scales
    // sensibly with either mode); text/emoji keep their existing scale
    // (raw px for the strip, % of width for the wide photo).
    // min is 1, not 5 - the built-in Instagram-icon layer defaults to 2.2
    // in wide-photo mode, and a slider min above a layer's actual value
    // clamps the displayed thumb to that min without touching the real
    // (smaller) value, so the next drag jumps from the true value straight
    // to wherever the thumb visually starts instead of moving smoothly.
    var sizeRange = layer.type === 'image'
      ? { min: 1, max: 100, step: 0.5 }
      : (designTab === 'strip' ? { min: 8, max: 100, step: 1 } : { min: 1, max: 15, step: 0.2 });
    wrap.appendChild(buildLiveRangeRow('גודל', layer.size, sizeRange, function (v) {
      layer.size = v;
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
    }));

    wrap.appendChild(buildLiveRangeRow('סיבוב', layer.rotation || 0, { min: -180, max: 180, step: 5 }, function (v) {
      layer.rotation = v;
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
    }));

    // Shared by the text-content input and the font-style select below -
    // whichever one changes last, this re-checks whether the picked font
    // actually supports Hebrew against what's actually typed (for a
    // fixed layer) or just warns unconditionally (for an auto title/date
    // layer, since its real text comes from the event info and isn't
    // known here - better to warn early than miss a Hebrew event name).
    var fontWarnRow = document.createElement('p');
    fontWarnRow.className = 'design-hint font-hebrew-warn';
    function updateFontWarning() {
      var opt = FONT_OPTIONS[layer.font];
      var hasHebrew = layer.auto || /[֐-׿]/.test(layer.text || '');
      if (opt && opt.noHebrew && hasHebrew) {
        fontWarnRow.textContent = '⚠️ הגופן הזה לא תומך בעברית - טקסט עברי בו יוצא בגופן גנרי ולא יפה.';
        fontWarnRow.style.display = '';
      } else {
        fontWarnRow.style.display = 'none';
      }
    }

    if (layer.type === 'text' && !layer.auto) {
      var trow = mkRow('תוכן הטקסט');
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'design-select';
      input.value = layer.text || '';
      input.addEventListener('input', function () {
        layer.text = input.value;
        saveDesign(currentDesignKey(), design);
        renderDesignPreview();
        updateFontWarning();
      });
      trow.appendChild(input);
      wrap.appendChild(trow);
    }

    if (layer.type === 'emoji') {
      var erow = mkRow('אימוג\'י');
      var epicker = document.createElement('div');
      epicker.className = 'emoji-picker';
      EMOJI_PRESETS.forEach(function (em) {
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.className = 'emoji-opt' + (layer.text === em ? ' active' : '');
        opt.textContent = em;
        opt.addEventListener('click', function () {
          layer.text = em;
          saveDesign(currentDesignKey(), design);
          renderDesignControls();
          renderDesignPreview();
        });
        epicker.appendChild(opt);
      });
      var customEm = document.createElement('input');
      customEm.type = 'text';
      customEm.className = 'design-select';
      customEm.maxLength = 4;
      customEm.placeholder = 'או הקלידו אימוג\'י משלכם';
      customEm.value = EMOJI_PRESETS.indexOf(layer.text) === -1 ? (layer.text || '') : '';
      customEm.addEventListener('input', function () {
        layer.text = customEm.value;
        saveDesign(currentDesignKey(), design);
        renderDesignPreview();
      });
      erow.appendChild(epicker);
      wrap.appendChild(erow);
      wrap.appendChild(customEm);
    }

    if (layer.type === 'text') {
      var frow = mkRow('סגנון כתב');
      var select = document.createElement('select');
      select.className = 'design-select';
      FONT_SELECT_OPTIONS.forEach(function (opt) {
        var optEl = document.createElement('option');
        optEl.value = opt.value;
        optEl.textContent = opt.label;
        if (layer.font === opt.value) optEl.selected = true;
        select.appendChild(optEl);
      });
      select.addEventListener('change', function () {
        layer.font = select.value;
        saveDesign(currentDesignKey(), design);
        renderDesignPreview();
        updateFontWarning();
      });
      frow.appendChild(select);
      wrap.appendChild(frow);
      wrap.appendChild(fontWarnRow);
      updateFontWarning();

      var brow = mkRow('עובי הכתב');
      var boldBtn = document.createElement('button');
      boldBtn.type = 'button';
      boldBtn.className = 'btn btn-ghost bold-toggle-btn';
      boldBtn.textContent = 'B';
      var isBold = layer.weight === 'bold';
      boldBtn.setAttribute('aria-pressed', isBold ? 'true' : 'false');
      boldBtn.title = isBold ? 'בטל הדגשה' : 'הפוך למודגש (בולד)';
      boldBtn.addEventListener('click', function () {
        layer.weight = layer.weight === 'bold' ? '' : 'bold';
        saveDesign(currentDesignKey(), design);
        renderDesignControls();
        renderDesignPreview();
      });
      brow.appendChild(boldBtn);
      wrap.appendChild(brow);
    }

    if (layer.type !== 'image') {
      var crow = mkRow('צבע');
      var color = document.createElement('input');
      color.type = 'color';
      color.value = layer.color;
      color.addEventListener('input', function () {
        layer.color = color.value;
        saveDesign(currentDesignKey(), design);
        renderDesignPreview();
      });
      crow.appendChild(color);
      wrap.appendChild(crow);
    }

    // Separate from the "B" (bold font) toggle above - this thickens the
    // chosen color itself with an extra stroke pass on the canvas, from
    // the thinnest possible rendering (0) up to the strongest ink
    // coverage that still looks like text and not a blob (100). Built
    // specifically because a thin script font in true black can still
    // print looking weak/faded on the DNP printer, and toggling "B" barely
    // helps most of these webfonts (see the comment in renderLayers).
    if (layer.type === 'text') {
      wrap.appendChild(buildLiveRangeRow('עוצמת צבע', layer.strength || 0, { min: 0, max: 100, step: 1 }, function (v) {
        layer.strength = v;
        saveDesign(currentDesignKey(), design);
        renderDesignPreview();
      }));
    }

    return wrap;
  }

  function renderDesignControls() {
    var design = currentDesign();
    var container = $('design-controls');
    container.innerHTML = '';

    var chipsRow = document.createElement('div');
    chipsRow.className = 'layer-chips';
    var generalChip = document.createElement('button');
    generalChip.type = 'button';
    generalChip.className = 'layer-chip' + (!selectedLayerId ? ' active' : '');
    generalChip.textContent = '⚙️ פריסה כללית';
    generalChip.addEventListener('click', function () {
      selectedLayerId = null;
      renderDesignControls();
      renderDesignPreview();
    });
    chipsRow.appendChild(generalChip);
    design.layers.forEach(function (layer) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'layer-chip' + (layer.id === selectedLayerId ? ' active' : '');
      chip.textContent = layerChipLabel(layer);
      chip.addEventListener('click', function () {
        selectedLayerId = layer.id;
        renderDesignControls();
        renderDesignPreview();
      });
      chipsRow.appendChild(chip);
    });
    container.appendChild(chipsRow);

    var addRow = document.createElement('div');
    addRow.className = 'layer-add-row';
    var addText = document.createElement('button');
    addText.type = 'button';
    addText.className = 'btn btn-ghost';
    addText.textContent = '+ טקסט';
    addText.addEventListener('click', function () { addLayer('text'); });
    var addEmoji = document.createElement('button');
    addEmoji.type = 'button';
    addEmoji.className = 'btn btn-ghost';
    addEmoji.textContent = '+ אימוג\'י';
    addEmoji.addEventListener('click', function () { addLayer('emoji'); });
    var addLogo = document.createElement('button');
    addLogo.type = 'button';
    addLogo.className = 'btn btn-ghost';
    addLogo.textContent = '+ לוגו';
    var logoInput = document.createElement('input');
    logoInput.type = 'file';
    logoInput.accept = 'image/*';
    logoInput.style.display = 'none';
    logoInput.addEventListener('change', function () {
      var file = this.files[0];
      this.value = '';
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        addLayer('image', { src: reader.result });
      };
      reader.readAsDataURL(file);
    });
    addLogo.addEventListener('click', function () { logoInput.click(); });
    addRow.appendChild(addText);
    addRow.appendChild(addEmoji);
    addRow.appendChild(addLogo);
    addRow.appendChild(logoInput);
    container.appendChild(addRow);

    // Strictly one or the other - a selected layer shows only its own
    // controls, general layout shows only when nothing is selected, so
    // nothing from one bleeds into the other.
    var selected = selectedLayerId ? findLayer(design, selectedLayerId) : null;
    if (selected) {
      container.appendChild(buildLayerPanel(design, selected));
    } else {
      var generalTitle = document.createElement('h3');
      generalTitle.className = 'design-section-title';
      generalTitle.textContent = 'פריסה כללית';
      container.appendChild(generalTitle);
      var generalControls = designTab === 'strip' ? STRIP_GENERAL_CONTROLS : WIDE_GENERAL_CONTROLS;
      generalControls.forEach(function (c) {
        container.appendChild(buildRangeRow(design, c));
      });
    }
  }

  function switchDesignTab(tab) {
    designTab = tab;
    selectedLayerId = null;
    $('design-tab-strip').classList.toggle('active', tab === 'strip');
    $('design-tab-wide').classList.toggle('active', tab === 'wide');
    renderDesignControls();
    renderDesignPreview();
  }

  $('design-editor-btn').addEventListener('click', function () {
    $('settings-panel').classList.remove('active');
    reopenSettingsAfterScreen = true;
    showScreen('screen-design');
    switchDesignTab(designTab);
  });
  $('design-back-btn').addEventListener('click', function () {
    flushActiveEventSync();
    showScreen('screen-welcome');
    if (reopenSettingsAfterScreen) {
      reopenSettingsAfterScreen = false;
      openSettingsPanel();
    }
  });
  $('design-tab-strip').addEventListener('click', function () { switchDesignTab('strip'); });
  $('design-tab-wide').addEventListener('click', function () { switchDesignTab('wide'); });
  // Reset asks first (native confirm() was ruled out app-wide - see the
  // event-info modal's comment above about it freezing the iOS camera),
  // and what it resets TO is whatever was last pinned with 📌 for this
  // tab, falling back to the app's original built-in layout only if
  // nothing has ever been pinned.
  function performDesignReset() {
    var customRaw = localStorage.getItem(currentCustomDefaultKey());
    if (customRaw) {
      try {
        saveDesign(currentDesignKey(), JSON.parse(customRaw));
      } catch (e) {
        localStorage.removeItem(currentDesignKey());
      }
    } else {
      localStorage.removeItem(currentDesignKey());
    }
    selectedLayerId = null;
    renderDesignControls();
    renderDesignPreview();
    syncActiveEvent();
    toast('אופס לברירת המחדל');
  }
  $('design-reset-btn').addEventListener('click', function () {
    $('reset-confirm-text').textContent = 'לאפס את העיצוב של "' +
      (designTab === 'strip' ? 'סטריפ 3' : 'תמונה רחבה') +
      '" לברירת המחדל? כל שינוי שלא נקבע כברירת מחדל (📌) יימחק.';
    $('reset-confirm-modal').classList.add('active');
  });
  $('reset-confirm-cancel').addEventListener('click', function () {
    $('reset-confirm-modal').classList.remove('active');
  });
  $('reset-confirm-ok').addEventListener('click', function () {
    $('reset-confirm-modal').classList.remove('active');
    performDesignReset();
  });
  $('design-undo-btn').addEventListener('click', function () {
    if (!undoDesign(currentDesignKey())) { toast('אין פעולה לבטל'); return; }
    selectedLayerId = null;
    renderDesignControls();
    renderDesignPreview();
    toast('הפעולה האחרונה בוטלה');
  });
  $('design-save-event-btn').addEventListener('click', saveCurrentSetupToActiveEvent);
  $('design-set-default-btn').addEventListener('click', function () {
    localStorage.setItem(currentCustomDefaultKey(), JSON.stringify(currentDesign()));
    toast('העיצוב הנוכחי נקבע כברירת מחדל - כפתור האיפוס יחזיר לכאן מעכשיו');
  });

  function designPointFromEvent(e) {
    var rect = designCanvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (designCanvas.width / rect.width),
      y: (e.clientY - rect.top) * (designCanvas.height / rect.height)
    };
  }
  function designHitTest(pt) {
    for (var i = designHits.length - 1; i >= 0; i--) {
      var h = designHits[i];
      if (pt.x >= h.x && pt.x <= h.x + h.w && pt.y >= h.y && pt.y <= h.y + h.h) return h.key;
    }
    return null;
  }
  function designPointerDistance(p1, p2) {
    var dx = p2.x - p1.x, dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function designPointerAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  }

  // One finger drags the selected layer's position. A second finger
  // added while one is already selected pinches it - spread apart to
  // resize, twist to rotate - tracking each touch by its own pointerId
  // throughout, so two simultaneous touches can never fight over the
  // same drag and fling a layer to a broken position (a real bug from
  // an earlier version: a second touch mid-drag silently hijacked the
  // single shared drag target). Works the same with touch, mouse, or
  // Apple Pencil, since it's all built on Pointer Events.
  var designDragPointerId = null;
  var designActivePointers = {};
  var designPinch = null;

  designCanvas.addEventListener('pointerdown', function (e) {
    try { designCanvas.setPointerCapture(e.pointerId); } catch (err) {}
    var pt = designPointFromEvent(e);
    designActivePointers[e.pointerId] = pt;
    var pointerIds = Object.keys(designActivePointers);

    if (pointerIds.length === 1) {
      var key = designHitTest(pt);
      if (key) {
        designDragging = key;
        designDragPointerId = e.pointerId;
        selectedLayerId = key;
        designCanvas.style.cursor = 'grabbing';
        renderDesignControls();
        renderDesignPreview();
      }
      // A miss no longer deselects - it may be the first of two fingers
      // about to pinch whatever's already selected (e.g. via the chips).
    } else if (pointerIds.length === 2 && selectedLayerId) {
      designDragging = null;
      designDragPointerId = null;
      var design = currentDesign();
      var layer = findLayer(design, selectedLayerId);
      if (layer) {
        var pts = pointerIds.map(function (id) { return designActivePointers[id]; });
        designPinch = {
          layerId: selectedLayerId,
          pointerIds: pointerIds,
          startDist: designPointerDistance(pts[0], pts[1]),
          startAngle: designPointerAngle(pts[0], pts[1]),
          startSize: layer.size,
          startRotation: layer.rotation || 0
        };
      }
    }
  });

  designCanvas.addEventListener('pointermove', function (e) {
    if (!(e.pointerId in designActivePointers)) return;
    designActivePointers[e.pointerId] = designPointFromEvent(e);

    if (designPinch) {
      var pts = designPinch.pointerIds.map(function (id) { return designActivePointers[id]; });
      if (!pts[0] || !pts[1]) return;
      var design = currentDesign();
      var layer = findLayer(design, designPinch.layerId);
      if (!layer) return;
      var dist = designPointerDistance(pts[0], pts[1]);
      var angle = designPointerAngle(pts[0], pts[1]);
      var scale = designPinch.startDist > 0 ? dist / designPinch.startDist : 1;
      var sizeRange = layer.type === 'image'
        ? { min: 1, max: 100 }
        : (designTab === 'strip' ? { min: 8, max: 100 } : { min: 1, max: 15 });
      layer.size = Math.min(sizeRange.max, Math.max(sizeRange.min, designPinch.startSize * scale));
      layer.rotation = designPinch.startRotation + (angle - designPinch.startAngle);
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
      return;
    }

    if (!designDragging || e.pointerId !== designDragPointerId) return;
    var pt = designActivePointers[e.pointerId];
    var design2 = currentDesign();
    var layer2 = findLayer(design2, designDragging);
    if (!layer2) return;
    layer2.x = Math.min(1, Math.max(0, pt.x / designCanvas.width));
    layer2.y = Math.min(1, Math.max(0, pt.y / designCanvas.height));
    saveDesign(currentDesignKey(), design2);
    renderDesignPreview();
  });

  ['pointerup', 'pointercancel'].forEach(function (evt) {
    designCanvas.addEventListener(evt, function (e) {
      delete designActivePointers[e.pointerId];
      if (designDragPointerId === e.pointerId) {
        designDragging = null;
        designDragPointerId = null;
        designCanvas.style.cursor = 'grab';
        // The size/rotation/etc. sliders below were built from the design
        // object as it was when the panel was last rendered (drag start,
        // or earlier) - a drag writes the new position straight to
        // localStorage via its own separate copy of that object without
        // touching the panel's. Left alone, the next slider touched would
        // save ITS (stale) copy back over the drag's new position,
        // silently reverting it. Same fix already applied to pinch below.
        renderDesignControls();
      }
      if (designPinch && designPinch.pointerIds.indexOf(String(e.pointerId)) !== -1) {
        designPinch = null;
        renderDesignControls(); // refresh the size/rotation sliders to match
      }
    });
  });

  // ---------- Export a specific event's photos as one PDF (to send to
  // the event owner) - eventName defaults to whatever's active. ----------
  // One page per photo, each page exactly the photo's own shape, with the
  // photo's original JPEG bytes embedded untouched (no re-compression, no
  // resizing) - so the PDF is exactly as sharp as the photos already are.
  // It can't add detail a photo never had (see composeStrip's scale note).
  // Written by hand rather than with a library: a PDF that just holds
  // JPEGs is a few dozen lines, and the pieces are handed to Blob as-is so
  // a large event never has to sit in memory as one giant array.
  function imageSize(blob) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }
  function asJpegBlob(blob) {
    return blob.slice(0, 2).arrayBuffer().then(function (buf) {
      var b = new Uint8Array(buf);
      if (b[0] === 0xFF && b[1] === 0xD8) return blob;
      return imageSize(blob).then(function (size) {
        return new Promise(function (resolve) {
          var url = URL.createObjectURL(blob);
          var img = new Image();
          img.onload = function () {
            var c = document.createElement('canvas');
            c.width = size.w; c.height = size.h;
            c.getContext('2d').drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            c.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
          };
          img.src = url;
        });
      });
    });
  }
  function buildPhotosPdf(blobs) {
    var enc = new TextEncoder();
    var parts = [];
    var offset = 0;
    var offsets = [];
    function push(part, len) { parts.push(part); offset += len; }
    function text(s) { var b = enc.encode(s); push(b, b.length); }
    function startObj(n) { offsets[n] = offset; text(n + ' 0 obj\n'); }
    text('%PDF-1.4\n');
    var pageCount = blobs.length;
    // objects: 1 catalog, 2 pages, then per photo: page, image, content
    startObj(1); text('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    var kids = [];
    for (var i = 0; i < pageCount; i++) kids.push((3 + i * 3) + ' 0 R');
    startObj(2); text('<< /Type /Pages /Count ' + pageCount + ' /Kids [' + kids.join(' ') + '] >>\nendobj\n');
    return Promise.all(blobs.map(function (b) { return imageSize(b); })).then(function (sizes) {
      blobs.forEach(function (blob, i) {
        var pageN = 3 + i * 3, imgN = pageN + 1, contentN = pageN + 2;
        // 300 dpi: pixels -> points, so the page is the photo's real print size
        var pw = (sizes[i].w * 72 / 300).toFixed(2), ph = (sizes[i].h * 72 / 300).toFixed(2);
        startObj(pageN);
        text('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << /Im0 ' + imgN + ' 0 R >> >> /Contents ' + contentN + ' 0 R >>\nendobj\n');
        startObj(imgN);
        text('<< /Type /XObject /Subtype /Image /Width ' + sizes[i].w + ' /Height ' + sizes[i].h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + blob.size + ' >>\nstream\n');
        push(blob, blob.size);
        text('\nendstream\nendobj\n');
        var content = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q';
        startObj(contentN);
        text('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream\nendobj\n');
      });
      var total = 3 + pageCount * 3;
      var xrefAt = offset;
      var xref = 'xref\n0 ' + total + '\n0000000000 65535 f \n';
      for (var n = 1; n < total; n++) xref += ('0000000000' + offsets[n]).slice(-10) + ' 00000 n \n';
      text(xref + 'trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xrefAt + '\n%%EOF\n');
      return new Blob(parts, { type: 'application/pdf' });
    });
  }
  function exportEventPdf(eventName, onDone) {
    dbAllForEvent(eventName).then(function (rows) {
      if (!rows.length) {
        toast('אין תמונות לייצוא');
        return;
      }
      toast('מכין PDF...');
      // oldest first, so page 1 is the first photo of the event
      var ordered = rows.slice().reverse();
      Promise.all(ordered.map(function (row) { return asJpegBlob(row.blob); })).then(buildPhotosPdf).then(function (pdf) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(pdf);
        a.download = 'memories4u-event-photos.pdf';
        a.click();
        toast('ה-PDF מוכן - חפש את חץ ההורדות בסרגל העליון של ספארי כדי לפתוח אותו');
        if (onDone) onDone();
      }).catch(function () { toast('הייצוא נכשל - נסו שוב'); });
    });
  }
  $('export-all-btn').addEventListener('click', function () { exportEventPdf(getActiveEventName()); });

  // ---------- Start ----------
  // Keeps the iPad's screen from auto-locking while this app is open -
  // it's a staffed kiosk running non-stop through an event, and the
  // screen dimming/locking mid-use would force staff to unlock it (or
  // worse, interrupt a guest mid-photo). The lock is silently released by
  // the browser whenever the screen actually locks or the app gets
  // backgrounded, so it has to be re-requested every time the app comes
  // back to the front, not just once at load - handled in the same
  // visibilitychange listener below that already restarts the camera.
  preloadDesignImages(getStripDesign());
  preloadDesignImages(getWideDesign());

  var wakeLock = null;
  function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(function (lock) { wakeLock = lock; }).catch(function () {});
  }
  requestWakeLock();

  // Camera only starts when the guest actually enters the camera screen
  // (welcome-start-btn, or returning to it) - never automatically, so the
  // welcome screen is always the first thing shown after unlocking.
  window.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      requestWakeLock();
      if ($('screen-camera').classList.contains('active') && !stream) startCamera();
    }
  });
})();
