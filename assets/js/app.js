(function () {
  'use strict';

  // ---------- Config ----------
  var PASSWORD_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; // sha256("1234")
  var BOOTH_TOKEN = 'm4u-booth-2026';
  var UNLOCK_KEY = 'm4u_booth_unlocked';
  var BRAND_HANDLE = '@memories4u';
  var BRAND_PHONE = '055-9696120';
  var GUEST_MESSAGE = 'תודה שבחרתם ב-Memories4U להיות חלק מהאירוע!\nהיה לנו לעונג ללוות אתכם ולתעד את הרגעים היפים.\nמצורפת התמונה שלכם באיכות מלאה, מוכנה לשימוש ולשיתוף.\nנתראה באירוע הבא ❤️\nMemories4U | ' + BRAND_PHONE;
  var OWNER_MESSAGE = 'תודה שבחרתם ב-Memories4U להיות חלק מהאירוע שלכם.\nהיה לנו לעונג ללוות אתכם ולתעד את הרגעים היפים.\nמצורפות כל התמונות באיכות מלאה, מוכנות לשימוש ולשיתוף.\nנתראה באירוע הבא\n' + BRAND_PHONE;
  var FONT_OPTIONS = {
    script1: { label: 'כתב יד קלאסי', family: '"Great Vibes", cursive' },
    script2: { label: 'כתב יד עגול', family: '"Dancing Script", cursive' },
    serif: { label: 'קלאסי (סריף)', family: '"Playfair Display", serif' },
    sans: { label: 'מודרני', family: '"Rubik", sans-serif' },
    playful: { label: 'קליל ודק', family: '"Amatic SC", sans-serif' },
    casual: { label: 'יומיומי', family: '"Caveat", cursive' },
    romantic: { label: 'רומנטי', family: '"Cormorant Garamond", serif' },
    hebrewDeco: { label: 'עברי דקורטיבי', family: '"Suez One", serif' },
    hebrewSerif: { label: 'עברי סריף אלגנטי', family: '"Frank Ruhl Libre", serif' },
    hebrewThin: { label: 'עברי דק ומעודן', family: '"Bellefair", serif' },
    hebrewModern: { label: 'עברי מודרני נקי', family: '"Miriam Libre", sans-serif' },
    hebrewRound: { label: 'עברי עגול וידידותי', family: '"Secular One", sans-serif' },
    slant1: { label: 'נטוי אלגנטי', family: '"Frank Ruhl Libre", serif', italic: true },
    slant2: { label: 'נטוי מודרני', family: '"Rubik", sans-serif', italic: true },
    slant3: { label: 'נטוי עגול', family: '"Secular One", sans-serif', italic: true },
    slant4: { label: 'נטוי רך', family: '"Miriam Libre", sans-serif', italic: true },
    englishBrush: { label: 'אנגלי - Brush אלגנטי', family: '"Alex Brush", cursive' },
    englishAllura: { label: 'אנגלי - כתב יד זורם', family: '"Allura", cursive' },
    englishParisienne: { label: 'אנגלי - פריזאי', family: '"Parisienne", cursive' },
    englishTangerine: { label: 'אנגלי - עדין וקלאסי', family: '"Tangerine", cursive' },
    englishPinyon: { label: 'אנגלי - חתונה קלאסית', family: '"Pinyon Script", cursive' }
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
  var FONT_PRELOAD = [
    '52px "Great Vibes"', '52px "Dancing Script"', 'italic 52px "Playfair Display"',
    '52px "Amatic SC"', '52px "Caveat"', 'italic 52px "Cormorant Garamond"', '52px "Suez One"',
    '52px "Frank Ruhl Libre"', '52px "Bellefair"', '52px "Miriam Libre"', '52px "Secular One"',
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

  // ---------- Camera screen "back to management" (password-gated) ----------
  // The camera screen has no staff controls at all - this is the only
  // way off it, and it re-checks the password so a guest holding the
  // iPad can't wander into settings/design/gallery.
  function openAdminModal() {
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
        stopCamera();
        showScreen('screen-welcome');
      } else {
        $('admin-password-error').textContent = 'סיסמה שגויה';
        $('admin-password-input').value = '';
      }
    });
  }
  $('camera-admin-btn').addEventListener('click', openAdminModal);
  $('admin-modal-cancel').addEventListener('click', closeAdminModal);
  $('admin-modal-confirm').addEventListener('click', submitAdminModal);
  $('admin-password-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitAdminModal();
  });

  // ---------- IndexedDB gallery ----------
  var DB_NAME = 'm4u-photobooth';
  var STORE = 'photos';
  var dbPromise = new Promise(function (resolve, reject) {
    var req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function () {
      req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
  function dbAdd(blob) {
    return dbPromise.then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        var req = tx.objectStore(STORE).add({ blob: blob, createdAt: Date.now() });
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
  function dbDelete(id) {
    return dbPromise.then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, 'readwrite');
        var req = tx.objectStore(STORE).delete(id);
        req.onsuccess = function () { resolve(); };
        req.onerror = function () { reject(req.error); };
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
  $('event-settings-btn').addEventListener('click', function () {
    var current = getEventInfo();
    $('event-title-input').value = current.title || '';
    $('event-date-input').value = current.date || '';
    $('event-modal').classList.add('active');
  });
  $('event-modal-cancel').addEventListener('click', function () {
    $('event-modal').classList.remove('active');
  });
  $('event-modal-save').addEventListener('click', function () {
    var title = $('event-title-input').value.trim();
    var date = $('event-date-input').value.trim();
    localStorage.setItem(EVENT_KEY, JSON.stringify({ title: title, date: date }));
    $('event-modal').classList.remove('active');
    toast('פרטי האירוע נשמרו');
  });

  // ---------- Capture mode (strip of 3 vs. one wide photo) ----------
  // Staff-only setting (chosen once per event in the ⚙ settings panel on
  // the welcome screen) - guests never see or touch this.
  var MODE_KEY = 'm4u_capture_mode';
  var captureMode = localStorage.getItem(MODE_KEY) || 'strip';
  function setCaptureMode(mode) {
    captureMode = mode;
    localStorage.setItem(MODE_KEY, mode);
    $('settings-mode-strip').classList.toggle('active', mode === 'strip');
    $('settings-mode-wide').classList.toggle('active', mode === 'wide');
  }
  $('settings-mode-strip').addEventListener('click', function () { setCaptureMode('strip'); });
  $('settings-mode-wide').addEventListener('click', function () { setCaptureMode('wide'); });
  setCaptureMode(captureMode);

  // ---------- Welcome screen ----------
  var WELCOME_BG_KEY = 'm4u_welcome_bg';
  function applyWelcomeBg() {
    var bg = localStorage.getItem(WELCOME_BG_KEY);
    $('screen-welcome').style.backgroundImage = bg ? 'url(' + bg + ')' : '';
    $('screen-welcome').classList.toggle('has-bg', !!bg);
  }
  applyWelcomeBg();

  $('welcome-start-btn').addEventListener('click', function () {
    showScreen('screen-camera');
    startCamera();
  });
  $('welcome-settings-btn').addEventListener('click', function () {
    $('settings-panel').classList.add('active');
    renderSavedEventsList();
  });
  $('settings-close-btn').addEventListener('click', function () {
    $('settings-panel').classList.remove('active');
  });
  $('welcome-bg-input').addEventListener('change', function () {
    var file = this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      localStorage.setItem(WELCOME_BG_KEY, reader.result);
      applyWelcomeBg();
      toast('הרקע נשמר');
    };
    reader.readAsDataURL(file);
  });
  $('welcome-bg-clear-btn').addEventListener('click', function () {
    localStorage.removeItem(WELCOME_BG_KEY);
    applyWelcomeBg();
    toast('הרקע אופס');
  });

  // ---------- Saved events (prepare several events in advance, switch
  // between them) - snapshots event title/date, capture mode, welcome
  // background and both designs under a name, loadable any time. ----------
  var SAVED_EVENTS_KEY = 'm4u_saved_events';
  function getSavedEvents() {
    try { return JSON.parse(localStorage.getItem(SAVED_EVENTS_KEY)) || []; } catch (e) { return []; }
  }
  function setSavedEvents(list) {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(list));
  }
  function snapshotCurrentSetup() {
    return {
      eventInfo: getEventInfo(),
      captureMode: captureMode,
      welcomeBg: localStorage.getItem(WELCOME_BG_KEY) || null,
      bgMode: localStorage.getItem(BG_MODE_KEY) || 'none',
      bgColor: localStorage.getItem(BG_COLOR_KEY) || '#FFFFFF',
      stripDesign: getStripDesign(),
      wideDesign: getWideDesign()
    };
  }
  function applySavedSetup(setup) {
    localStorage.setItem(EVENT_KEY, JSON.stringify(setup.eventInfo || { title: '', date: '' }));
    setCaptureMode(setup.captureMode || 'strip');
    if (setup.welcomeBg) {
      localStorage.setItem(WELCOME_BG_KEY, setup.welcomeBg);
    } else {
      localStorage.removeItem(WELCOME_BG_KEY);
    }
    applyWelcomeBg();
    localStorage.setItem(BG_COLOR_KEY, setup.bgColor || '#FFFFFF');
    setBgMode(setup.bgMode || 'none');
    $('bg-color-input').value = getBgColor();
    if (setup.stripDesign) saveDesign(STRIP_DESIGN_KEY, setup.stripDesign);
    if (setup.wideDesign) saveDesign(WIDE_DESIGN_KEY, setup.wideDesign);
  }
  function renderSavedEventsList() {
    var list = getSavedEvents();
    var container = $('saved-events-list');
    container.innerHTML = '';
    if (!list.length) {
      var empty = document.createElement('p');
      empty.className = 'design-hint';
      empty.textContent = 'אין עדיין אירועים שמורים';
      container.appendChild(empty);
      return;
    }
    list.forEach(function (entry, i) {
      var row = document.createElement('div');
      row.className = 'saved-event-row';
      var name = document.createElement('span');
      name.className = 'saved-event-name';
      name.textContent = entry.name;
      var loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.className = 'btn btn-ghost';
      loadBtn.textContent = 'טעינה';
      loadBtn.addEventListener('click', function () {
        applySavedSetup(entry.setup);
        toast('האירוע "' + entry.name + '" נטען');
      });
      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn-ghost';
      delBtn.textContent = '🗑';
      delBtn.addEventListener('click', function () {
        setSavedEvents(getSavedEvents().filter(function (_, idx) { return idx !== i; }));
        renderSavedEventsList();
      });
      row.appendChild(name);
      row.appendChild(loadBtn);
      row.appendChild(delBtn);
      container.appendChild(row);
    });
  }
  $('save-event-btn').addEventListener('click', function () {
    var name = $('save-event-name-input').value.trim();
    if (!name) { toast('תנו שם לאירוע'); return; }
    var list = getSavedEvents();
    var setup = snapshotCurrentSetup();
    var existingIdx = -1;
    for (var i = 0; i < list.length; i++) { if (list[i].name === name) { existingIdx = i; break; } }
    if (existingIdx >= 0) { list[existingIdx].setup = setup; } else { list.push({ name: name, setup: setup }); }
    setSavedEvents(list);
    $('save-event-name-input').value = '';
    renderSavedEventsList();
    toast('האירוע נשמר');
  });

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
        width: { ideal: 1440 },
        height: { ideal: 1920 }
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

  var DEFAULT_STRIP_DESIGN = {
    sideTextW: 26, innerPad: 14, topMargin: 30, gap: 14, footerH: 230, cornerRadius: 6,
    layers: [
      { id: 'title', type: 'text', auto: 'title', x: 0.5, y: 0.911, size: 52, color: '#2A2418', font: 'script1', rotation: 0, weight: '' },
      { id: 'heart', type: 'emoji', text: '♥', x: 0.5, y: 0.936, size: 20, color: '#2A2418', rotation: 0 },
      { id: 'date', type: 'text', auto: 'date', x: 0.5, y: 0.962, size: 24, color: '#2A2418', font: 'sans', rotation: 0, weight: '600' },
      { id: 'brand', type: 'text', text: '@MEMORIES4U   055-9696120', x: 0.5, y: 0.978, size: 15, color: '#2A2418', font: 'sans', rotation: 0, weight: '600' }
    ]
  };
  var DEFAULT_WIDE_DESIGN = {
    marginPct: 0.045, footerPct: 0.2, cornerRadius: 0,
    layers: [
      { id: 'title', type: 'text', auto: 'title', x: 0.5, y: 0.855, size: 9, color: '#2A2418', font: 'script1', rotation: 0, weight: '' },
      { id: 'heart', type: 'emoji', text: '♥', x: 0.5, y: 0.898, size: 3.2, color: '#2A2418', rotation: 0 },
      { id: 'date', type: 'text', auto: 'date', x: 0.5, y: 0.940, size: 3.8, color: '#2A2418', font: 'sans', rotation: 0, weight: '600' },
      { id: 'brand', type: 'text', text: '@memories4u   055-9696120', x: 0.5, y: 0.983, size: 2.6, color: '#6B6559', font: 'sans', rotation: 0, weight: '600' }
    ]
  };

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
        color: num('titleColor', '#2A2418'), font: num('titleFont', 'script1')
      },
      {
        id: 'heart', type: 'emoji', rotation: 0,
        text: num('emoji', '♥'),
        x: num('heartX', 0.5), y: num('heartY', isWide ? 0.898 : 0.936),
        size: isWide ? num('heartSizePct', 0.032) * 100 : num('heartSize', 20),
        color: num('titleColor', '#2A2418')
      },
      {
        id: 'date', type: 'text', auto: 'date', rotation: 0, weight: '600',
        x: num('dateX', 0.5), y: num('dateY', isWide ? 0.940 : 0.962),
        size: isWide ? num('dateSizePct', 0.038) * 100 : num('dateSize', 24),
        color: num('dateColor', '#2A2418'), font: 'sans'
      },
      {
        id: 'brand', type: 'text', rotation: 0, weight: '600',
        text: (isWide ? BRAND_HANDLE : BRAND_HANDLE.toUpperCase()) + '   ' + BRAND_PHONE,
        x: num('brandX', 0.5), y: num('brandY', isWide ? 0.983 : 0.978),
        size: isWide ? num('brandSizePct', 0.026) * 100 : num('brandSize', 15),
        color: num('brandColor', isWide ? '#6B6559' : '#2A2418'), font: num('brandFont', 'sans')
      }
    ];
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
    if (!saved.layers && (saved.titleX != null || saved.heartX != null || saved.brandX != null || saved.emoji != null)) {
      merged.layers = migrateLegacyLayers(saved, isWide);
      saveDesign(key, merged);
    }
    return merged;
  }
  function saveDesign(key, design) {
    localStorage.setItem(key, JSON.stringify(design));
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
    if (IMAGE_LAYER_CACHE[src]) return;
    var entry = { img: new Image(), loaded: false };
    IMAGE_LAYER_CACHE[src] = entry;
    entry.img.onload = function () {
      entry.loaded = true;
      if ($('screen-design').classList.contains('active')) renderDesignPreview();
    };
    entry.img.src = src;
  }
  function preloadDesignImages(design) {
    design.layers.forEach(function (layer) {
      if (layer.type === 'image' && layer.src) preloadLayerImage(layer.src);
    });
  }

  function renderLayers(ctx, design, W, H, isWide, hits) {
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
        if (hits) hits.push({ key: layer.id, x: ipx - iw / 2, y: ipy - ih / 2, w: iw, h: ih });
        return;
      }
      var text = layer.type === 'emoji' ? (layer.text || '♥') : layer.text;
      if (layer.auto === 'title') text = info.title;
      if (layer.auto === 'date') text = info.date;
      if (!text) return;

      var px = layer.x * W, py = layer.y * H;
      var sizePx = isWide ? Math.max(1, Math.round(W * (layer.size / 100))) : layer.size;
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
      if (layer.rotation) {
        ctx.translate(px, py);
        ctx.rotate(layer.rotation * Math.PI / 180);
        ctx.fillText(text, 0, 0);
      } else {
        ctx.fillText(text, px, py);
      }
      ctx.restore();

      if (hits) {
        var th = (metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0) || sizePx;
        hits.push({ key: layer.id, x: px - metrics.width / 2, y: py - th, w: metrics.width, h: th * 1.4 });
      }
    });
  }

  // Rotates a landscape (wider-than-tall) canvas 90° into a portrait one.
  // The front camera can hand back a landscape-shaped raw frame even
  // though the ideal capture size requested was portrait - "wide photo"
  // mode is meant to always be a single portrait card, never landscape.
  function ensurePortrait(frame) {
    if (frame.width <= frame.height) return frame;
    var c = document.createElement('canvas');
    c.width = frame.height;
    c.height = frame.width;
    var ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    return c;
  }

  // Full photo on a white card with a script event name + date + brand
  // line underneath, matching the printed single-photo cards.
  function composeWide(frame, design, hits) {
    frame = ensurePortrait(frame);
    design = design || getWideDesign();
    var vw = frame.width, vh = frame.height;
    var margin = Math.round(vw * design.marginPct);
    var footerH = Math.round(vh * design.footerPct);
    var W = vw + margin * 2;
    var H = vh + margin + footerH;

    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);
    if (design.cornerRadius > 0) {
      ctx.save();
      roundRectPath(ctx, margin, margin, vw, vh, design.cornerRadius);
      ctx.clip();
      ctx.drawImage(frame, margin, margin, vw, vh);
      ctx.restore();
    } else {
      ctx.drawImage(frame, margin, margin, vw, vh);
    }

    renderLayers(ctx, design, W, H, true, hits);
    return canvas;
  }

  // Classic 3-photo vertical strip with event title/date + brand footer,
  // matching the printed kraft-card strips (600x1800px = 2x6in @ 300dpi).
  function composeStrip(frames, design, hits) {
    design = design || getStripDesign();
    var W = 600, H = 1800;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // narrow blank side margins, like the printed kraft-paper strips
    var cellX = design.sideTextW + design.innerPad;
    var cellW = W - cellX * 2;
    var cellH = Math.floor((H - design.topMargin - design.footerH - design.gap * (frames.length - 1)) / frames.length);

    frames.forEach(function (frame, i) {
      var cy = design.topMargin + i * (cellH + design.gap);
      ctx.save();
      roundRectPath(ctx, cellX, cy, cellW, cellH, design.cornerRadius);
      ctx.clip();
      drawCover(ctx, frame, cellX, cy, cellW, cellH);
      ctx.restore();
    });

    renderLayers(ctx, design, W, H, false, hits);
    return canvas;
  }

  var currentBlob = null;
  var currentColorBlob = null; // original color version, kept so B&W can be toggled back off
  var isBw = false;
  var currentPhotoId = null; // set when viewing a saved gallery item
  var currentGifBlob = null; // set for strip captures (built from the same 3 shots)
  var currentColorGifBlob = null; // original color GIF, kept so B&W can toggle the GIF too
  var bwGifBlobCache = null;

  // Builds a small looping GIF from the same 3 shots used for the strip.
  // `grayscale` mirrors whatever the still photo's B&W toggle is set to,
  // so the GIF sent/shared always matches what's on screen.
  function composeGif(frames, grayscale) {
    return new Promise(function (resolve) {
      var maxDim = 480;
      var w = frames[0].width, h = frames[0].height;
      var scale = Math.min(1, maxDim / Math.max(w, h));
      var gw = Math.max(1, Math.round(w * scale));
      var gh = Math.max(1, Math.round(h * scale));
      var gif = gifenc.GIFEncoder();
      frames.forEach(function (frame) {
        var c = document.createElement('canvas');
        c.width = gw;
        c.height = gh;
        var ctx = c.getContext('2d');
        ctx.drawImage(frame, 0, 0, gw, gh);
        var imageData = ctx.getImageData(0, 0, gw, gh);
        var data = imageData.data;
        if (grayscale) {
          for (var i = 0; i < data.length; i += 4) {
            var gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = data[i + 1] = data[i + 2] = gray;
          }
        }
        var palette = gifenc.quantize(data, 256);
        var index = gifenc.applyPalette(data, palette);
        gif.writeFrame(index, gw, gh, { palette: palette, delay: 700, repeat: 0 });
      });
      gif.finish();
      resolve(new Blob([gif.bytes()], { type: 'image/gif' }));
    });
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, 'image/jpeg', 0.92);
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
      var i = 0;
      function step() {
        if (i < steps.length) {
          el.textContent = steps[i];
          el.style.opacity = '1';
          i++;
          setTimeout(step, 800);
        } else {
          el.style.opacity = '0';
          flashOnce();
          resolve(rawFrame());
        }
      }
      step();
    });
  }

  function finishCapture(canvas) {
    return canvasToBlob(canvas).then(function (blob) {
      currentBlob = blob;
      currentPhotoId = null;
      dbAdd(blob).then(function (id) { currentPhotoId = id; });
      openResult(blob, true);
    });
  }

  // ---------- Background replacement ("green screen" without a green
  // screen) - an optional, staff-toggled setting (⚙ on the main screen).
  // Off by default; when on, every captured frame has its real
  // background swapped for a plain backdrop, using MediaPipe's Selfie
  // Segmentation model to tell person from background. Runs entirely in
  // the browser, but the model itself is fetched from Google's CDN the
  // first time it's used each session - unlike the rest of the app, this
  // one feature needs internet the first time. If it fails for any
  // reason (no internet, model error), capture falls back to the
  // original, unmodified photo rather than breaking the flow.
  var BG_MODE_KEY = 'm4u_bg_mode'; // 'none' | 'white' | 'color'
  var BG_COLOR_KEY = 'm4u_bg_color';
  function getBgMode() { return localStorage.getItem(BG_MODE_KEY) || 'none'; }
  function getBgColor() { return localStorage.getItem(BG_COLOR_KEY) || '#FFFFFF'; }

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
      pctx.drawImage(mask, 0, 0, w, h);

      var out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      var octx = out.getContext('2d');
      octx.fillStyle = mode === 'white' ? '#FFFFFF' : getBgColor();
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
    $('bg-mode-color').classList.toggle('active', mode === 'color');
    if (mode !== 'none') ensureSegmentation().catch(function () {}); // warm the model up in advance
  }
  $('bg-mode-none').addEventListener('click', function () { setBgMode('none'); });
  $('bg-mode-white').addEventListener('click', function () { setBgMode('white'); });
  $('bg-mode-color').addEventListener('click', function () { setBgMode('color'); });
  $('bg-color-input').addEventListener('input', function () {
    localStorage.setItem(BG_COLOR_KEY, this.value);
    if (getBgMode() === 'color') setBgMode('color');
  });
  $('bg-color-input').value = getBgColor();
  setBgMode(getBgMode());

  function capture() {
    if (countingDown) return;
    countingDown = true;
    $('shutter-btn').disabled = true;
    var indicator = $('shot-indicator');

    var chain;
    if (captureMode === 'wide') {
      indicator.classList.remove('show');
      currentGifBlob = null;
      chain = countdownAndShoot().then(function (frame) {
        return applyBackgroundReplacement(frame);
      }).then(function (frame) {
        lastWideFrame = frame;
        return finishCapture(composeWide(frame));
      });
    } else {
      var frames = [];
      var shotCount = 3;
      function nextShot() {
        indicator.textContent = 'תמונה ' + (frames.length + 1) + ' מתוך ' + shotCount;
        indicator.classList.add('show');
        return countdownAndShoot().then(function (frame) {
          return applyBackgroundReplacement(frame);
        }).then(function (frame) {
          frames.push(frame);
          if (frames.length < shotCount) {
            return new Promise(function (r) { setTimeout(r, 900); }).then(nextShot);
          }
        });
      }
      chain = nextShot().then(function () {
        indicator.classList.remove('show');
        lastStripFrames = frames;
        return composeGif(frames, false).then(function (gifBlob) {
          currentGifBlob = gifBlob;
          currentColorGifBlob = gifBlob;
          bwGifBlobCache = null;
          $('gif-fab-item').style.display = '';
        });
      }).then(function () {
        return finishCapture(composeStrip(frames));
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
    openGallery('screen-welcome');
  });
  $('result-gallery-btn').addEventListener('click', function () { openGallery('screen-result'); });

  // ---------- Result screen ----------
  var resultUrl = null;
  var resultGifUrl = null;
  function openResult(blob, fromCapture) {
    currentBlob = blob;
    currentColorBlob = blob;
    isBw = false;
    bwBlobCache = null;
    $('btn-bw').classList.remove('active');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = URL.createObjectURL(blob);
    $('result-canvas-view').src = resultUrl;
    $('btn-delete').style.display = fromCapture ? 'none' : 'block';
    if (!fromCapture) {
      // Viewing an old gallery photo - no freshly-made GIF goes with it.
      currentGifBlob = null;
      currentColorGifBlob = null;
      bwGifBlobCache = null;
      $('gif-fab-item').style.display = 'none';
    }
    printCopies = 1;
    $('copies-count').textContent = printCopies;
    stopCamera();
    showScreen('screen-result');
  }

  $('result-back-btn').addEventListener('click', function () {
    showScreen('screen-camera');
    startCamera();
  });
  $('btn-retake').addEventListener('click', function () {
    showScreen('screen-camera');
    startCamera();
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
  var bwBlobCache = null; // memoizes the conversion of currentColorBlob
  function toGrayscaleBlob(blob) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, c.width, c.height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);
        URL.revokeObjectURL(img.src);
        c.toBlob(function (grayBlob) { resolve(grayBlob); }, 'image/jpeg', 0.92);
      };
      img.src = URL.createObjectURL(blob);
    });
  }
  $('btn-bw').addEventListener('click', function () {
    if (!currentColorBlob) return;
    var btn = this;
    btn.disabled = true;
    var goingToBw = !isBw;
    var photoNext = goingToBw ? (bwBlobCache ? Promise.resolve(bwBlobCache) : toGrayscaleBlob(currentColorBlob)) : Promise.resolve(currentColorBlob);
    // The GIF (if this was a strip capture) is toggled the same way, so
    // sharing/downloading it after B&W matches what's shown on screen -
    // it used to always send the original color GIF regardless.
    var gifNext = !currentColorGifBlob ? Promise.resolve(null)
      : goingToBw ? (bwGifBlobCache ? Promise.resolve(bwGifBlobCache) : composeGif(lastStripFrames, true))
      : Promise.resolve(currentColorGifBlob);
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
    });
  });

  // ---------- QR share ----------
  // Uploads the photo to the print-bridge running on the event laptop,
  // which briefly hosts it so the QR code has a real URL a guest's own
  // phone can open. Entries older than 2 hours are pruned automatically.
  $('btn-qr').addEventListener('click', function () {
    if (!currentBlob) return;
    $('qr-panel').classList.add('active');
    $('qr-render').innerHTML = '';
    var base = bridgeBase();
    if (!base) {
      $('qr-status').textContent = 'צריך קודם להגדיר את כתובת הגשר ב-⚙ (אותה כתובת של ההדפסה).';
      return;
    }
    $('qr-status').textContent = 'מעלים את התמונה…';
    fetch(base + '/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'image/jpeg', 'X-Booth-Token': BOOTH_TOKEN },
      body: currentBlob
    }).then(function (res) {
      if (!res.ok) throw new Error('upload failed: ' + res.status);
      return res.json();
    }).then(function (data) {
      var url = base + '/photo/' + data.id;
      var qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      $('qr-render').innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2 });
      $('qr-status').textContent = 'סרקו עם הטלפון כדי לשמור את התמונה';
    }).catch(function () {
      $('qr-status').textContent = 'שיתוף ה-QR לא זמין כרגע. אפשר לשתף ישירות מהכפתור "שיתוף".';
    });
  });
  $('qr-close-btn').addEventListener('click', function () {
    $('qr-panel').classList.remove('active');
  });

  // ---------- GIF viewer ----------
  $('btn-gif').addEventListener('click', function () {
    if (!currentGifBlob) return;
    if (resultGifUrl) URL.revokeObjectURL(resultGifUrl);
    resultGifUrl = URL.createObjectURL(currentGifBlob);
    $('gif-view').src = resultGifUrl;
    $('gif-panel').classList.add('active');
  });
  $('gif-close-btn').addEventListener('click', function () {
    $('gif-panel').classList.remove('active');
  });
  $('gif-share-btn').addEventListener('click', function () {
    if (!currentGifBlob) return;
    var file = new File([currentGifBlob], 'memories4u.gif', { type: 'image/gif' });
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
  $('print-settings-btn').addEventListener('click', function () {
    $('print-bridge-input').value = localStorage.getItem(PRINT_BRIDGE_KEY) || '';
    $('print-modal').classList.add('active');
  });
  $('print-modal-cancel').addEventListener('click', function () {
    $('print-modal').classList.remove('active');
  });
  $('print-modal-save').addEventListener('click', function () {
    var base = $('print-bridge-input').value.trim().replace(/\/$/, '');
    if (base) {
      localStorage.setItem(PRINT_BRIDGE_KEY, base);
      toast('כתובת ההדפסה נשמרה');
    } else {
      localStorage.removeItem(PRINT_BRIDGE_KEY);
      toast('חוזרים לתיבת ההדפסה הרגילה');
    }
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

  $('btn-print').addEventListener('click', function () {
    if (!currentBlob) return;
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

  // ---------- Gallery ----------
  // Remembers which screen opened the gallery (guest result screen, or
  // staff settings panel) so the back button returns to the right place.
  var galleryReturnScreen = 'screen-camera';
  var gallerySelectMode = false;
  var gallerySelectedIds = {};

  function openGallery(returnTo) {
    if (returnTo) galleryReturnScreen = returnTo;
    gallerySelectMode = false;
    gallerySelectedIds = {};
    showScreen('screen-gallery');
    renderGalleryGrid();
  }

  // dbAll() is async and renderGalleryGrid() gets called on every
  // selection click - without this guard, an older call's dbAll() can
  // resolve after a newer one already redrew the grid and append a
  // second, stale, duplicate set of items on top of it.
  var galleryRenderGen = 0;
  function renderGalleryGrid() {
    var myGen = ++galleryRenderGen;
    var grid = $('gallery-grid');
    grid.innerHTML = '';
    $('gallery-selection-toolbar').style.display = gallerySelectMode ? 'flex' : 'none';
    $('gallery-select-btn').textContent = gallerySelectMode ? '✕ בטל בחירה' : '☑ בחירה';
    dbAll().then(function (rows) {
      if (myGen !== galleryRenderGen) return;
      if (!rows.length) {
        var empty = document.createElement('div');
        empty.className = 'gallery-empty';
        empty.textContent = 'עדיין אין תמונות מהאירוע הזה';
        grid.appendChild(empty);
        return;
      }
      var selectedCount = Object.keys(gallerySelectedIds).length;
      $('gallery-share-selected-btn').textContent = '📤 שתף (' + selectedCount + ')';
      $('gallery-delete-selected-btn').textContent = '🗑 מחק (' + selectedCount + ')';
      rows.forEach(function (row) {
        var isSelected = !!gallerySelectedIds[row.id];
        var item = document.createElement('div');
        item.className = 'gallery-item' + (gallerySelectMode && isSelected ? ' selected' : '');
        var img = document.createElement('img');
        img.src = URL.createObjectURL(row.blob);
        item.appendChild(img);
        if (gallerySelectMode) {
          var check = document.createElement('div');
          check.className = 'gallery-check';
          check.textContent = isSelected ? '✓' : '';
          item.appendChild(check);
        }
        item.addEventListener('click', function () {
          if (gallerySelectMode) {
            if (gallerySelectedIds[row.id]) {
              delete gallerySelectedIds[row.id];
            } else {
              gallerySelectedIds[row.id] = row.blob;
            }
            renderGalleryGrid();
          } else {
            currentPhotoId = row.id;
            openResult(row.blob, false);
          }
        });
        grid.appendChild(item);
      });
    });
  }

  $('gallery-back-btn').addEventListener('click', function () {
    showScreen(galleryReturnScreen);
    if (galleryReturnScreen === 'screen-camera') startCamera();
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
    dbAll().then(function (rows) {
      if (!rows.length) { toast('אין תמונות למחוק'); return; }
      if (!confirm('למחוק את כל ' + rows.length + ' התמונות? לא ניתן לבטל את זה.')) return;
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
    return { value: key, label: FONT_OPTIONS[key].label };
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
    { key: 'marginPct', label: 'שוליים', min: 0, max: 15, step: 0.5, scale: 100 },
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
        ctx.save();
        ctx.strokeStyle = '#D9C696';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(hit.x - 6, hit.y - 6, hit.w + 12, hit.h + 12);
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
      layer = { id: newLayerId(), type: 'emoji', text: '♥', x: 0.5, y: 0.5, size: designTab === 'strip' ? 24 : 3, color: '#2A2418', rotation: 0 };
    } else if (type === 'image') {
      layer = { id: newLayerId(), type: 'image', src: extra.src, x: 0.5, y: 0.5, size: 60, rotation: 0 };
    } else {
      layer = { id: newLayerId(), type: 'text', text: 'טקסט חדש', x: 0.5, y: 0.5, size: designTab === 'strip' ? 28 : 3.5, color: '#2A2418', font: 'sans', rotation: 0, weight: '' };
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
  function buildLiveRangeRow(labelText, value, range, onChange) {
    var row = mkRow(labelText);
    var input = document.createElement('input');
    input.type = 'range';
    input.min = range.min; input.max = range.max; input.step = range.step;
    input.value = value;
    var val = document.createElement('span');
    val.className = 'val';
    val.textContent = value;
    input.addEventListener('input', function () {
      val.textContent = input.value;
      onChange(Number(input.value));
    });
    row.appendChild(input);
    row.appendChild(val);
    return row;
  }
  function buildRangeRow(design, c) {
    var row = mkRow(c.label);
    var scale = c.scale || 1;
    var input = document.createElement('input');
    input.type = 'range';
    input.min = c.min; input.max = c.max; input.step = c.step;
    input.value = design[c.key] * scale;
    var val = document.createElement('span');
    val.className = 'val';
    val.textContent = Math.round(design[c.key] * scale);
    input.addEventListener('input', function () {
      var d = currentDesign();
      d[c.key] = Number(input.value) / scale;
      saveDesign(currentDesignKey(), d);
      val.textContent = input.value;
      renderDesignPreview();
    });
    row.appendChild(input);
    row.appendChild(val);
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
    actions.appendChild(mkActionBtn('🗑 מחיקה', function () { deleteLayer(layer.id); }, true));
    wrap.appendChild(actions);

    var orderActions = document.createElement('div');
    orderActions.className = 'layer-actions';
    orderActions.appendChild(mkActionBtn('⬆ להביא קדימה (מעל הכל)', function () { bringLayerToFront(layer.id); }));
    orderActions.appendChild(mkActionBtn('⬇ לשלוח אחורה (מתחת לכל)', function () { sendLayerToBack(layer.id); }));
    wrap.appendChild(orderActions);

    // Precise nudging, for when a drag or pinch is too coarse - small
    // fixed steps in each direction, independent of the gesture system.
    var NUDGE_STEP = 0.01;
    function nudge(dx, dy) {
      layer.x = Math.min(1, Math.max(0, layer.x + dx));
      layer.y = Math.min(1, Math.max(0, layer.y + dy));
      saveDesign(currentDesignKey(), design);
      renderDesignPreview();
    }
    var nudgeWrap = document.createElement('div');
    nudgeWrap.className = 'layer-nudge';
    var vRow = document.createElement('div');
    vRow.className = 'nudge-row';
    vRow.appendChild(mkActionBtn('▲ למעלה', function () { nudge(0, -NUDGE_STEP); }));
    vRow.appendChild(mkActionBtn('▼ למטה', function () { nudge(0, NUDGE_STEP); }));
    var hRow = document.createElement('div');
    hRow.className = 'nudge-row';
    hRow.appendChild(mkActionBtn('► ימינה', function () { nudge(NUDGE_STEP, 0); }));
    hRow.appendChild(mkActionBtn('◄ שמאלה', function () { nudge(-NUDGE_STEP, 0); }));
    nudgeWrap.appendChild(vRow);
    nudgeWrap.appendChild(hRow);
    wrap.appendChild(nudgeWrap);

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
      });
      trow.appendChild(input);
      wrap.appendChild(trow);
    } else if (layer.auto) {
      var note = document.createElement('p');
      note.className = 'design-hint';
      note.textContent = layer.auto === 'title'
        ? 'התוכן מגיע משם האירוע (כפתור 📝 במסך הצילום)'
        : 'התוכן מגיע מתאריך האירוע (כפתור 📝 במסך הצילום)';
      wrap.appendChild(note);
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
      });
      frow.appendChild(select);
      wrap.appendChild(frow);
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

    // Image layer size is always % of the card's width (so it scales
    // sensibly with either mode); text/emoji keep their existing scale
    // (raw px for the strip, % of width for the wide photo).
    var sizeRange = layer.type === 'image'
      ? { min: 5, max: 100, step: 1 }
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
    generalChip.textContent = '⚙ פריסה כללית';
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
    showScreen('screen-design');
    switchDesignTab(designTab);
  });
  $('design-back-btn').addEventListener('click', function () {
    showScreen('screen-welcome');
  });
  $('design-tab-strip').addEventListener('click', function () { switchDesignTab('strip'); });
  $('design-tab-wide').addEventListener('click', function () { switchDesignTab('wide'); });
  $('design-reset-btn').addEventListener('click', function () {
    localStorage.removeItem(currentDesignKey());
    selectedLayerId = null;
    renderDesignControls();
    renderDesignPreview();
    toast('אופס לברירת המחדל');
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
        ? { min: 5, max: 100 }
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
      }
      if (designPinch && designPinch.pointerIds.indexOf(String(e.pointerId)) !== -1) {
        designPinch = null;
        renderDesignControls(); // refresh the size/rotation sliders to match
      }
    });
  });

  // ---------- Export all photos as one zip (to send to the event owner) ----------
  $('export-all-btn').addEventListener('click', function () {
    dbAll().then(function (rows) {
      if (!rows.length) {
        toast('אין תמונות לייצוא');
        return;
      }
      toast('מכין קובץ...');
      var zip = new JSZip();
      rows.forEach(function (row, i) {
        var num = String(rows.length - i).padStart(3, '0');
        zip.file('memories4u-' + num + '.jpg', row.blob);
      });
      zip.generateAsync({ type: 'blob' }).then(function (zipBlob) {
        var fileName = 'memories4u-event-photos.zip';
        var file = new File([zipBlob], fileName, { type: 'application/zip' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: 'Memories4U', text: OWNER_MESSAGE }).catch(function () {});
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(zipBlob);
          a.download = fileName;
          a.click();
          toast('הקובץ הורד למכשיר');
        }
      });
    });
  });

  // ---------- Start ----------
  // Camera only starts when the guest actually enters the camera screen
  // (welcome-start-btn, or returning to it) - never automatically, so the
  // welcome screen is always the first thing shown after unlocking.
  window.addEventListener('visibilitychange', function () {
    if (!document.hidden && $('screen-camera').classList.contains('active') && !stream) {
      startCamera();
    }
  });
})();
