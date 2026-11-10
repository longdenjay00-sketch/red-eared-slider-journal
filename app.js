/**
 * Trachemys Care — Red-Eared Slider Care Reminders & Telemetry Engine
 * Designed for Morpheus PRoot Matrix & Vercel deployment.
 * Data persistence via localStorage with Obsidian YAML export.
 */

const REMINDERS_STORAGE_KEY = 'trachemys_care_reminders_v2';
const ENTRIES_STORAGE_KEY = 'trachemys_journal_entries_v1';
const AUDIO_PREF_KEY = 'trachemys_audio_enabled';
const STREAK_KEY = 'trachemys_care_streak_v1';

// Initial baseline Red-Eared Slider Care Protocols
const DEFAULT_REMINDERS = [
  {
    id: 'rem-feed-turbo',
    title: 'Turbo: Morning Pellets & Greens',
    category: 'diet',
    target: 'Turbo',
    intervalDays: 1,
    priority: 'high',
    description: 'Feed Mazuri aquatic pellets (head-volume portion) plus dandelion/kale greens or romaine lettuce. Remove uneaten food after 20 minutes.',
    lastCompleted: null,
    nextDue: getTodayString()
  },
  {
    id: 'rem-feed-sneaky',
    title: 'Sneaky: Duckweed & Pellet Feeding',
    category: 'diet',
    target: 'Sneaky',
    intervalDays: 1,
    priority: 'high',
    description: 'Provide fresh duckweed surface mat and fortified pellets. Watch for enthusiastic swimming and healthy feeding response.',
    lastCompleted: null,
    nextDue: getTodayString()
  },
  {
    id: 'rem-temp-check',
    title: 'Verify Water & Basking Temperatures',
    category: 'lighting',
    target: 'Habitat',
    intervalDays: 1,
    priority: 'critical',
    description: 'Confirm water thermometer reads 74°F–78°F. Spot-check basking dock surface with infrared thermometer for 88°F–95°F. Confirm 10–12 hr timer photoperiod.',
    lastCompleted: null,
    nextDue: getTodayString()
  },
  {
    id: 'rem-waste-siphon',
    title: 'Spot-Clean Uneaten Food & Debris',
    category: 'water',
    target: 'Habitat',
    intervalDays: 1,
    priority: 'routine',
    description: 'Net out fecal waste and unconsumed vegetable leaves before decomposition produces ammonia spikes in the water column.',
    lastCompleted: null,
    nextDue: getTodayString()
  },
  {
    id: 'rem-water-change',
    title: '25% Partial Water Change & Siphon',
    category: 'water',
    target: 'Habitat',
    intervalDays: 7,
    priority: 'critical',
    description: 'Siphon 25%–30% of tank water while vacuuming bottom sediment. Condition incoming tap water with ReptiSafe or Prime dechlorinator.',
    lastCompleted: getDateOffsetString(-3),
    nextDue: getDateOffsetString(4)
  },
  {
    id: 'rem-water-test',
    title: 'Liquid API Water Chemistry Test',
    category: 'water',
    target: 'Habitat',
    intervalDays: 7,
    priority: 'critical',
    description: 'Test pH (safe 7.4–8.0), Ammonia (strictly 0 ppm), Nitrite (0 ppm), and Nitrate (< 20 ppm). Record in telemetry.',
    lastCompleted: getDateOffsetString(-5),
    nextDue: getDateOffsetString(2)
  },
  {
    id: 'rem-calcium-boost',
    title: 'Calcium / Cuttlebone Supplement',
    category: 'health',
    target: 'Habitat',
    intervalDays: 7,
    priority: 'routine',
    description: 'Break off a 2-inch cuttlebone piece (scrape away hard brittle backing) and let float in tank for essential dietary calcium.',
    lastCompleted: getDateOffsetString(-6),
    nextDue: getDateOffsetString(1)
  },
  {
    id: 'rem-shell-inspection',
    title: 'Shell, Scute & Eye Health Inspection',
    category: 'health',
    target: 'Turbo',
    intervalDays: 7,
    priority: 'high',
    description: 'Gently observe carapace and plastron scutes for clean shedding without retained scutes or soft spots. Ensure eyes are bright and nostrils clear.',
    lastCompleted: getDateOffsetString(-2),
    nextDue: getDateOffsetString(5)
  },
  {
    id: 'rem-filter-clean',
    title: 'Canister Filter Sponge & Media Clean',
    category: 'hardware',
    target: 'Habitat',
    intervalDays: 30,
    priority: 'critical',
    description: 'Rinse coarse and bio-sponges in REMOVED aquarium water only. Never wash in chlorinated tap water to preserve nitrifying bacteria.',
    lastCompleted: getDateOffsetString(-18),
    nextDue: getDateOffsetString(12)
  },
  {
    id: 'rem-algae-heater',
    title: 'Glass Algae Scrape & Heater Guard Check',
    category: 'hardware',
    target: 'Habitat',
    intervalDays: 30,
    priority: 'routine',
    description: 'Scrape glass viewing pane, ensure submersible heater suction mounts are intact and turtle cannot touch heating element directly.',
    lastCompleted: getDateOffsetString(-12),
    nextDue: getDateOffsetString(18)
  },
  {
    id: 'rem-weight-scl',
    title: 'Weight & Straight Carapace Length (SCL)',
    category: 'health',
    target: 'Sneaky',
    intervalDays: 30,
    priority: 'routine',
    description: 'Weigh on digital kitchen scale in grams. Measure straight shell length using calipers from nuchal notch to supracaudal tip.',
    lastCompleted: getDateOffsetString(-20),
    nextDue: getDateOffsetString(10)
  },
  {
    id: 'rem-uvb-replacement',
    title: 'Replace 5.0 / 10.0 UVB Fluorescent Bulb',
    category: 'lighting',
    target: 'Habitat',
    intervalDays: 180,
    priority: 'critical',
    description: 'UVB phosphors deteriorate after 6 months of daily 10-12 hour operation even though visible light remains active. Replace to prevent MBD.',
    lastCompleted: getDateOffsetString(-38),
    nextDue: getDateOffsetString(142)
  }
];

// Baseline Journal Entries matching Obsidian vault
const DEFAULT_ENTRIES = [
  {
    id: 'entry-2026-11-09-01',
    title: 'Midday Basking & Carapace Inspection',
    date: '2026-11-09',
    turtle: 'Turbo',
    species: 'red-eared slider',
    waterTemp: 76.4,
    baskingTemp: 92.1,
    diet: 'Mazuri Aquatic Pellets + Dandelion Greens',
    notes: 'Turbo climbed onto the primary driftwood ramp under the 5.0 UVB bulb at 11:30 AM. Shell plates firm, smooth marginal scutes with no signs of pyramiding or retained scutes. Alert posture, actively stretched hind legs while basking.',
    uncheck: 'Plastron underside not lifted for inspection to minimize handling stress.'
  },
  {
    id: 'entry-2026-11-08-01',
    title: 'Duckweed Foraging & Water Quality Check',
    date: '2026-11-08',
    turtle: 'Sneaky',
    species: 'red-eared slider',
    waterTemp: 76.2,
    baskingTemp: 91.5,
    diet: 'Fresh Duckweed & Leafy Greens',
    notes: 'Sneaky spent the morning grazing through duckweed mat across the water surface. Highly active swimming, clear nares, bright clear eyes. Reacted promptly to movement in room.',
    uncheck: 'Weight measurement not taken.'
  },
  {
    id: 'entry-2026-10-27-01',
    title: 'Opening the red-eared slider journal',
    date: '2026-10-27',
    turtle: 'Habitat',
    species: 'red-eared slider',
    waterTemp: 76.0,
    baskingTemp: 90.0,
    diet: 'Standard feeding schedule',
    notes: 'The journal starts today. Turbo and Sneaky are the two red-eared sliders named in the public character list. Private records initialized.',
    uncheck: 'No invasive handling performed.'
  }
];

// State
let reminders = [];
let entries = [];
let currentReminderFilter = 'all';
let currentJournalFilter = 'All';
let audioEnabled = true;
let careStreak = 5;

// Helper: Dates
function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getDateOffsetString(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function getDaysDiff(dateString) {
  if (!dateString) return 999;
  const target = new Date(dateString + 'T00:00:00');
  const now = new Date(getTodayString() + 'T00:00:00');
  const diffTime = target.getTime() - now.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Initialize Application
function initApp() {
  // Load Audio Preference
  const savedAudio = localStorage.getItem(AUDIO_PREF_KEY);
  audioEnabled = savedAudio !== null ? savedAudio === 'true' : true;
  updateAudioIcon();

  // Load Reminders
  const savedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
  if (savedReminders) {
    try {
      reminders = JSON.parse(savedReminders);
    } catch (e) {
      console.error('Failed to parse reminders, resetting', e);
      reminders = DEFAULT_REMINDERS;
    }
  } else {
    reminders = DEFAULT_REMINDERS;
    saveReminders();
  }

  // Load Journal Entries
  const savedEntries = localStorage.getItem(ENTRIES_STORAGE_KEY);
  if (savedEntries) {
    try {
      entries = JSON.parse(savedEntries);
    } catch (e) {
      console.error('Failed to parse entries, resetting', e);
      entries = DEFAULT_ENTRIES;
    }
  } else {
    entries = DEFAULT_ENTRIES;
    saveEntries();
  }

  // Load Streak
  const savedStreak = localStorage.getItem(STREAK_KEY);
  if (savedStreak) {
    careStreak = parseInt(savedStreak, 10) || 5;
  }

  // Update Clock
  const timeEl = document.getElementById('current-time');
  if (timeEl) {
    timeEl.textContent = getTodayString();
  }

  setupEventListeners();
  renderReminders();
  renderEntries();
  updateTelemetryAndSensors();
  updateTurtleSummaries();
  updateDuePill();
  refreshLucide();
}

function saveReminders() {
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
}

function saveEntries() {
  localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
}

function saveStreak() {
  localStorage.setItem(STREAK_KEY, careStreak.toString());
}

// Event Listeners Setup
function setupEventListeners() {
  // Modal openers
  const btnExportObsidian = document.getElementById('btn-export-obsidian');
  if (btnExportObsidian) {
    btnExportObsidian.addEventListener('click', () => {
      generateObsidianExport();
      openModal('modal-obsidian');
    });
  }

  // Form: Add Reminder
  const formReminder = document.getElementById('form-reminder');
  if (formReminder) {
    formReminder.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAddReminder();
    });
  }

  // Form: Add Journal Entry
  const formEntry = document.getElementById('form-entry');
  if (formEntry) {
    formEntry.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCreateEntry();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['modal-add-reminder', 'modal-log-entry', 'modal-obsidian', 'modal-backup'].forEach(closeModal);
    }
  });
}

function refreshLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Audio Synthesizer via Web Audio API (Aquatic 2-tone chimes)
function playTone(type = 'success') {
  if (!audioEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Pleasant aquatic two-tone chime: D5 (587.33Hz) -> A5 (880Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, now);
      osc2.frequency.setValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === 'alert') {
      // Urgent soft alert
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    console.warn('Audio playback error', err);
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  localStorage.setItem(AUDIO_PREF_KEY, audioEnabled.toString());
  updateAudioIcon();
  if (audioEnabled) {
    playTone('success');
  }
}

function updateAudioIcon() {
  const icon = document.getElementById('audio-icon');
  const btn = document.getElementById('btn-toggle-audio');
  if (icon && btn) {
    if (audioEnabled) {
      icon.setAttribute('data-lucide', 'volume-2');
      icon.className = 'w-4 h-4 text-emerald-400';
      btn.title = 'Sound Alarms: Enabled';
    } else {
      icon.setAttribute('data-lucide', 'volume-x');
      icon.className = 'w-4 h-4 text-slate-500';
      btn.title = 'Sound Alarms: Muted';
    }
    refreshLucide();
  }
}

// Browser Notification API
function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notifications.');
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      new Notification('Trachemys Care Reminders Active', {
        body: 'You will receive alarms when turtle care protocols are due.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2970/2970034.png'
      });
      const btn = document.getElementById('btn-enable-notify');
      if (btn) btn.textContent = 'Alarms Enabled ✓';
      playTone('success');
    }
  });
}

// Modal Controllers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove('hidden');
    refreshLucide();
    if (id === 'modal-backup') {
      const bRem = document.getElementById('backup-rem-count');
      const bLog = document.getElementById('backup-log-count');
      if (bRem) bRem.textContent = reminders.length;
      if (bLog) bLog.textContent = entries.length;
    }
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// CARE REMINDERS LOGIC
// -------------------------------------------------------------

function getTaskStatus(reminder) {
  const today = getTodayString();
  const isCompletedToday = reminder.lastCompleted === today;
  if (isCompletedToday) {
    return { code: 'completed', label: 'Done Today ✓', class: 'status-badge-completed' };
  }

  const diff = getDaysDiff(reminder.nextDue);
  if (diff < 0) {
    return { code: 'overdue', label: `Overdue (${Math.abs(diff)}d)`, class: 'status-badge-overdue' };
  } else if (diff === 0) {
    return { code: 'due', label: 'Due Today', class: 'status-badge-due' };
  } else {
    return { code: 'upcoming', label: `Due in ${diff}d`, class: 'status-badge-upcoming' };
  }
}

function filterReminders(filterType) {
  currentReminderFilter = filterType;

  // Update button active styling
  ['all', 'due', 'daily', 'weekly', 'monthly', 'Turbo', 'Sneaky'].forEach(f => {
    const btn = document.getElementById(`rf-${f}`);
    if (btn) {
      if (f === filterType) {
        btn.className = 'px-2.5 py-1 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1';
      } else {
        btn.className = 'px-2.5 py-1 rounded text-slate-400 hover:text-white flex items-center gap-1';
      }
    }
  });

  renderReminders();
}

function renderReminders() {
  const container = document.getElementById('reminders-container');
  if (!container) return;

  const today = getTodayString();

  // Filter tasks
  const filtered = reminders.filter(rem => {
    const status = getTaskStatus(rem);
    if (currentReminderFilter === 'all') return true;
    if (currentReminderFilter === 'due') return status.code === 'due' || status.code === 'overdue';
    if (currentReminderFilter === 'daily') return rem.intervalDays === 1 || rem.intervalDays === 2;
    if (currentReminderFilter === 'weekly') return rem.intervalDays === 7 || rem.intervalDays === 14;
    if (currentReminderFilter === 'monthly') return rem.intervalDays >= 30;
    if (currentReminderFilter === 'Turbo') return rem.target === 'Turbo';
    if (currentReminderFilter === 'Sneaky') return rem.target === 'Sneaky';
    return true;
  });

  // Sort: overdue first, then due today, then upcoming, then completed
  filtered.sort((a, b) => {
    const statusA = getTaskStatus(a);
    const statusB = getTaskStatus(b);
    const order = { overdue: 0, due: 1, upcoming: 2, completed: 3 };
    if (order[statusA.code] !== order[statusB.code]) {
      return order[statusA.code] - order[statusB.code];
    }
    return (a.nextDue || '').localeCompare(b.nextDue || '');
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-panel col-span-1 md:col-span-2 rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
        <i data-lucide="check-circle" class="w-8 h-8 text-emerald-500 mx-auto mb-2"></i>
        No reminders matching filter "${currentReminderFilter}". All applicable turtle protocols are up to date!
      </div>
    `;
    refreshLucide();
    return;
  }

  container.innerHTML = filtered.map(rem => {
    const status = getTaskStatus(rem);
    const isCompleted = status.code === 'completed';

    // Target pill styling
    let targetClass = 'tag-habitat';
    let targetLabel = 'Habitat Tank';
    if (rem.target === 'Turbo') {
      targetClass = 'tag-turbo';
      targetLabel = 'Turbo (EB-TRB-001)';
    } else if (rem.target === 'Sneaky') {
      targetClass = 'tag-sneaky';
      targetLabel = 'Sneaky (EB-SNK-001)';
    }

    // Interval label
    let intervalLabel = 'Daily';
    if (rem.intervalDays === 2) intervalLabel = 'Every 2 Days';
    else if (rem.intervalDays === 7) intervalLabel = 'Weekly (7d)';
    else if (rem.intervalDays === 14) intervalLabel = 'Bi-Weekly (14d)';
    else if (rem.intervalDays === 30) intervalLabel = 'Monthly (30d)';
    else if (rem.intervalDays === 180) intervalLabel = 'Every 6 Months';

    return `
      <div class="glass-panel rounded-xl p-4 space-y-3 relative transition priority-${rem.priority} ${isCompleted ? 'reminder-card-completed' : ''}">
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-1">
            <div class="flex items-center space-x-2 flex-wrap gap-y-1">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded ${targetClass}">${targetLabel}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">${intervalLabel}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded ${status.class} font-bold">${status.label}</span>
            </div>
            <h3 class="text-sm font-bold text-white tracking-wide mt-1 ${isCompleted ? 'line-through text-slate-400' : ''}">
              ${escapeHtml(rem.title)}
            </h3>
          </div>

          <!-- Complete Checkbox Button -->
          <button 
            onclick="completeReminder('${rem.id}')" 
            title="${isCompleted ? 'Completed today! Tap to toggle' : 'Mark task complete & log'}" 
            class="btn-complete-task shrink-0 w-8 h-8 rounded-lg ${isCompleted ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50' : 'bg-slate-800/80 hover:bg-emerald-600 hover:text-white border border-slate-700 text-slate-400'} flex items-center justify-center transition"
          >
            <i data-lucide="${isCompleted ? 'check-check' : 'check'}" class="w-4 h-4"></i>
          </button>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed font-sans">
          ${escapeHtml(rem.description)}
        </p>

        <div class="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div class="flex items-center space-x-3">
            <span>Last: <strong class="text-slate-300">${rem.lastCompleted || 'Never'}</strong></span>
            <span>Next: <strong class="${status.code === 'overdue' ? 'text-red-400' : 'text-slate-300'}">${rem.nextDue}</strong></span>
          </div>

          <div class="flex items-center space-x-1.5">
            <button onclick="snoozeReminder('${rem.id}', 1)" title="Snooze 1 day" class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteReminder('${rem.id}')" title="Delete reminder" class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshLucide();
}

function completeReminder(id, autoLogJournal = true) {
  const rem = reminders.find(r => r.id === id);
  if (!rem) return;

  const today = getTodayString();
  const wasCompletedToday = rem.lastCompleted === today;

  if (wasCompletedToday) {
    // Toggle back
    rem.lastCompleted = null;
    rem.nextDue = today;
  } else {
    // Complete
    rem.lastCompleted = today;
    rem.nextDue = getDateOffsetString(rem.intervalDays);
    playTone('success');

    // Increment streak
    careStreak += 1;
    saveStreak();

    // Optionally auto-create journal observation
    if (autoLogJournal) {
      const entryTitle = `Care Protocol: ${rem.title}`;
      const newEntry = {
        id: `entry-${Date.now()}`,
        title: entryTitle,
        date: today,
        turtle: rem.target === 'Habitat' ? 'Habitat' : rem.target,
        species: 'red-eared slider',
        waterTemp: 76.4,
        baskingTemp: 92.0,
        diet: rem.category === 'diet' ? rem.title : 'Standard diet maintained',
        notes: `Completed scheduled care protocol: ${rem.title}. ${rem.description}`,
        uncheck: 'Routine procedural maintenance performed.'
      };
      entries.unshift(newEntry);
      saveEntries();
      renderEntries();
    }
  }

  saveReminders();
  renderReminders();
  updateDuePill();
  updateTelemetryAndSensors();
  updateTurtleSummaries();
}

function snoozeReminder(id, days = 1) {
  const rem = reminders.find(r => r.id === id);
  if (!rem) return;
  rem.nextDue = getDateOffsetString(days);
  saveReminders();
  renderReminders();
  updateDuePill();
  playTone('alert');
}

function deleteReminder(id) {
  if (!confirm('Are you sure you want to remove this care reminder?')) return;
  reminders = reminders.filter(r => r.id !== id);
  saveReminders();
  renderReminders();
  updateDuePill();
}

function handleAddReminder() {
  const title = document.getElementById('rem-input-title').value.trim();
  const target = document.getElementById('rem-input-target').value;
  const intervalDays = parseInt(document.getElementById('rem-input-interval').value, 10) || 1;
  const category = document.getElementById('rem-input-category').value;
  const priority = document.getElementById('rem-input-priority').value;
  const description = document.getElementById('rem-input-desc').value.trim() || 'Custom care protocol.';

  if (!title) return;

  const newReminder = {
    id: `rem-custom-${Date.now()}`,
    title,
    category,
    target,
    intervalDays,
    priority,
    description,
    lastCompleted: null,
    nextDue: getTodayString()
  };

  reminders.unshift(newReminder);
  saveReminders();

  document.getElementById('form-reminder').reset();
  closeModal('modal-add-reminder');
  renderReminders();
  updateDuePill();
  playTone('success');
}

// 1-Tap Quick Action Protocols
function quickActionComplete(type) {
  const today = getTodayString();
  if (type === 'feed') {
    // Complete both Turbo and Sneaky feed reminders
    reminders.forEach(r => {
      if (r.id === 'rem-feed-turbo' || r.id === 'rem-feed-sneaky') {
        r.lastCompleted = today;
        r.nextDue = getDateOffsetString(r.intervalDays);
      }
    });
    // Add quick log
    entries.unshift({
      id: `entry-${Date.now()}`,
      title: 'Daily Feeding (Turbo & Sneaky)',
      date: today,
      turtle: 'Turbo',
      species: 'red-eared slider',
      waterTemp: 76.5,
      baskingTemp: 92.0,
      diet: 'Mazuri Pellets + Dandelion Greens + Duckweed',
      notes: 'Morning feeding completed for both turtles. Both exhibited active swimming, keen appetites, and healthy digestion response.',
      uncheck: 'No invasive physical handling performed.'
    });
  } else if (type === 'temp') {
    const r = reminders.find(rem => rem.id === 'rem-temp-check');
    if (r) {
      r.lastCompleted = today;
      r.nextDue = getDateOffsetString(r.intervalDays);
    }
  } else if (type === 'water') {
    const r = reminders.find(rem => rem.id === 'rem-water-change');
    if (r) {
      r.lastCompleted = today;
      r.nextDue = getDateOffsetString(r.intervalDays);
    }
    entries.unshift({
      id: `entry-${Date.now()}`,
      title: '25% Tank Water Change & Substrate Siphon',
      date: today,
      turtle: 'Habitat',
      species: 'red-eared slider',
      waterTemp: 76.4,
      baskingTemp: 91.8,
      diet: 'Standard diet',
      notes: 'Completed 25% water change with gravel vacuum. Conditioned refill water with ReptiSafe dechlorinator. Water clarity crystal clear.',
      uncheck: 'Filter canisters not disturbed.'
    });
  } else if (type === 'test') {
    const r = reminders.find(rem => rem.id === 'rem-water-test');
    if (r) {
      r.lastCompleted = today;
      r.nextDue = getDateOffsetString(r.intervalDays);
    }
  }

  saveReminders();
  saveEntries();
  renderReminders();
  renderEntries();
  updateDuePill();
  updateTelemetryAndSensors();
  updateTurtleSummaries();
  playTone('success');
}

function updateDuePill() {
  let dueCount = 0;
  reminders.forEach(r => {
    const s = getTaskStatus(r);
    if (s.code === 'due' || s.code === 'overdue') {
      dueCount++;
    }
  });

  const countEl = document.getElementById('nav-due-count');
  const pillEl = document.getElementById('nav-due-pill');
  const badgeEl = document.getElementById('filter-due-badge');
  const banner = document.getElementById('urgent-banner');

  if (countEl) countEl.textContent = `${dueCount} Due`;
  if (badgeEl) badgeEl.textContent = dueCount;

  if (dueCount > 0) {
    if (pillEl) pillEl.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono cursor-pointer hover:bg-red-900/60 transition animate-pulse';
    if (banner) {
      banner.classList.remove('hidden');
      const title = document.getElementById('urgent-banner-title');
      const desc = document.getElementById('urgent-banner-desc');
      if (title) title.textContent = `${dueCount} Care Protocol${dueCount > 1 ? 's' : ''} Require Attention Today`;
      if (desc) desc.textContent = 'Keep water pristine, temperatures verified, and Turbo & Sneaky fed on schedule.';
    }
  } else {
    if (pillEl) pillEl.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono cursor-pointer hover:bg-emerald-900/50 transition';
    if (countEl) countEl.textContent = 'All Clear ✓';
    if (banner) banner.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// TELEMETRY & TURTLE PROFILES
// -------------------------------------------------------------

function updateTelemetryAndSensors() {
  // Days since water change
  const waterRem = reminders.find(r => r.id === 'rem-water-change');
  const tankWaterChangeEl = document.getElementById('tank-last-water-change');
  if (waterRem && tankWaterChangeEl) {
    if (waterRem.lastCompleted) {
      const diff = Math.abs(getDaysDiff(waterRem.lastCompleted));
      tankWaterChangeEl.textContent = diff === 0 ? 'Today' : `${diff} day${diff > 1 ? 's' : ''} ago`;
    } else {
      tankWaterChangeEl.textContent = 'Pending';
    }
  }

  // UVB Countdown
  const uvbRem = reminders.find(r => r.id === 'rem-uvb-replacement');
  if (uvbRem) {
    const daysLeft = Math.max(0, getDaysDiff(uvbRem.nextDue));
    const daysEl = document.getElementById('telemetry-uvb-days');
    const barEl = document.getElementById('telemetry-uvb-bar');
    const textEl = document.getElementById('uvb-status-text');

    if (daysEl) daysEl.textContent = daysLeft;
    if (barEl) {
      const pct = Math.min(100, Math.round((daysLeft / 180) * 100));
      barEl.style.width = `${pct}%`;
      if (daysLeft < 30) {
        barEl.className = 'bg-red-500 h-1.5 rounded-full';
        if (textEl) { textEl.textContent = 'Replace Soon'; textEl.className = 'text-red-400'; }
      } else {
        barEl.className = 'bg-purple-500 h-1.5 rounded-full';
        if (textEl) { textEl.textContent = 'Active'; textEl.className = 'text-purple-400'; }
      }
    }
  }

  // Streak Display
  const streakEl = document.getElementById('care-streak-display');
  if (streakEl) {
    streakEl.textContent = `${careStreak} Days 🔥`;
  }
}

function updateTurtleSummaries() {
  const turboEntry = entries.find(e => e.turtle === 'Turbo');
  if (turboEntry) {
    const dietEl = document.getElementById('turbo-last-diet');
    const logEl = document.getElementById('turbo-last-log');
    if (dietEl) dietEl.textContent = turboEntry.diet.slice(0, 20);
    if (logEl) logEl.textContent = turboEntry.date;
  }

  const sneakyEntry = entries.find(e => e.turtle === 'Sneaky');
  if (sneakyEntry) {
    const dietEl = document.getElementById('sneaky-last-diet');
    const logEl = document.getElementById('sneaky-last-log');
    if (dietEl) dietEl.textContent = sneakyEntry.diet.slice(0, 20);
    if (logEl) logEl.textContent = sneakyEntry.date;
  }
}

// -------------------------------------------------------------
// JOURNAL ENTRIES LOGIC
// -------------------------------------------------------------

function handleCreateEntry() {
  const turtle = document.getElementById('input-turtle').value;
  const waterTemp = parseFloat(document.getElementById('input-water-temp').value) || 76.5;
  const baskingTemp = parseFloat(document.getElementById('input-basking-temp').value) || 92.0;
  const diet = document.getElementById('input-diet').value.trim() || 'Standard pellets and greens';
  const notes = document.getElementById('input-notes').value.trim() || 'Routine observation.';

  const today = getTodayString();
  const newEntry = {
    id: `entry-${Date.now()}`,
    title: `${turtle === 'Habitat' ? 'Habitat Enclosure Observation' : turtle + ' Care & Telemetry'} (${today})`,
    date: today,
    turtle,
    species: 'red-eared slider',
    waterTemp,
    baskingTemp,
    diet,
    notes,
    uncheck: 'Handling kept minimal to prevent animal stress.'
  };

  entries.unshift(newEntry);
  saveEntries();

  document.getElementById('form-entry').reset();
  closeModal('modal-log-entry');

  renderEntries();
  updateTurtleSummaries();
  playTone('success');
  refreshLucide();
}

function filterByTurtle(turtle) {
  currentJournalFilter = turtle;

  ['All', 'Turbo', 'Sneaky', 'Habitat'].forEach(t => {
    const btn = document.getElementById(`filter-${t}`);
    if (btn) {
      if (t === turtle) {
        btn.className = 'px-3 py-1 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/40';
      } else {
        btn.className = 'px-3 py-1 rounded text-slate-400 hover:text-white';
      }
    }
  });

  renderEntries();
}

function renderEntries() {
  const container = document.getElementById('entries-container');
  if (!container) return;

  const filtered = currentJournalFilter === 'All'
    ? entries
    : entries.filter(e => e.turtle === currentJournalFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-panel rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
        <i data-lucide="inbox" class="w-8 h-8 text-slate-600 mx-auto mb-2"></i>
        No entries recorded for ${currentJournalFilter}. Click "Log" to create one.
      </div>
    `;
    refreshLucide();
    return;
  }

  container.innerHTML = filtered.map(item => {
    let tagClass = 'tag-habitat';
    let tagLabel = 'Habitat Tank';
    if (item.turtle === 'Turbo') {
      tagClass = 'tag-turbo';
      tagLabel = 'Turbo (EB-TRB-001)';
    } else if (item.turtle === 'Sneaky') {
      tagClass = 'tag-sneaky';
      tagLabel = 'Sneaky (EB-SNK-001)';
    } else if (item.turtle === 'Unassigned') {
      tagClass = 'tag-unassigned';
      tagLabel = 'Night-Tank Frame';
    }

    return `
      <article class="glass-panel rounded-xl p-5 space-y-3 relative transition">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/80 pb-2.5">
          <div class="flex items-center space-x-2">
            <span class="text-[11px] font-mono px-2 py-0.5 rounded ${tagClass}">
              ${tagLabel}
            </span>
            <h3 class="text-sm font-bold text-white tracking-wide">${escapeHtml(item.title)}</h3>
          </div>
          <span class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-500"></i>
            ${item.date}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono bg-[#090e0b]/70 p-3 rounded-lg border border-slate-800/50">
          <div>
            <span class="text-slate-500 block text-[10px]">WATER TEMP</span>
            <span class="text-emerald-400 font-semibold">${item.waterTemp || '--'}°F</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[10px]">BASKING TEMP</span>
            <span class="text-amber-400 font-semibold">${item.baskingTemp || '--'}°F</span>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <span class="text-slate-500 block text-[10px]">DIET FED</span>
            <span class="text-slate-300 truncate block">${escapeHtml(item.diet || 'None logged')}</span>
          </div>
        </div>

        <div class="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
          <p>${escapeHtml(item.notes)}</p>
          ${item.uncheck ? `
            <div class="text-[11px] font-mono text-slate-400 border-l-2 border-slate-700 pl-2 mt-2">
              <span class="text-slate-400 font-semibold">What was not checked:</span> ${escapeHtml(item.uncheck)}
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');

  refreshLucide();
}

// -------------------------------------------------------------
// OBSIDIAN EXPORTER
// -------------------------------------------------------------

function generateObsidianExport() {
  const latest = entries[0] || DEFAULT_ENTRIES[0];
  const markdown = `---
title: "${latest.title}"
date: ${latest.date}
species: red-eared slider
animal: "${latest.turtle === 'Habitat' ? 'habitat' : latest.turtle.toLowerCase()}"
type: entry
status: recorded
telemetry:
  water_temp_f: ${latest.waterTemp}
  basking_temp_f: ${latest.baskingTemp}
  diet: "${latest.diet}"
---

# ${latest.title}

## Who was observed
${latest.turtle === 'Habitat' ? 'Aquaterrarium Habitat Enclosure (75 Gallon).' : latest.turtle + ' (Red-eared slider, Trachemys scripta elegans).'}

## What was performed & verified
- **Water Temperature:** ${latest.waterTemp}°F (Safe range: 74°F–78°F)
- **Basking Surface:** ${latest.baskingTemp}°F (Safe range: 88°F–95°F)
- **Diet / Nutrition:** ${latest.diet}

${latest.notes}

## What was not checked
${latest.uncheck || 'No invasive physical handling performed.'}
`;

  const preview = document.getElementById('obsidian-preview');
  if (preview) {
    preview.textContent = markdown;
  }
  return markdown;
}

function copyObsidianMarkdown() {
  const text = generateObsidianExport();
  navigator.clipboard.writeText(text).then(() => {
    const status = document.getElementById('copy-status');
    if (status) {
      status.textContent = 'Copied to clipboard!';
      setTimeout(() => { status.textContent = ''; }, 3000);
    }
  }).catch(err => {
    console.error('Clipboard copy error', err);
  });
}

function downloadObsidianMarkdown() {
  const text = generateObsidianExport();
  const latest = entries[0] || DEFAULT_ENTRIES[0];
  const filename = `${latest.date}-${latest.turtle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-entry.md`;

  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// BACKUP & RESTORE
// -------------------------------------------------------------

function exportVaultBackup() {
  const data = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    careStreak,
    reminders,
    entries
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const filename = `trachemys-care-backup-${getTodayString()}.json`;

  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importVaultBackup(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data.reminders)) {
        reminders = data.reminders;
        saveReminders();
      }
      if (Array.isArray(data.entries)) {
        entries = data.entries;
        saveEntries();
      }
      if (data.careStreak) {
        careStreak = data.careStreak;
        saveStreak();
      }
      alert('Backup snapshot imported successfully!');
      closeModal('modal-backup');
      initApp();
    } catch (err) {
      alert('Invalid JSON backup file.');
      console.error(err);
    }
  };
  reader.readAsText(file);
}

function resetDefaults() {
  if (!confirm('Reset all reminders and entries to species defaults? Custom tasks will be overwritten.')) return;
  reminders = DEFAULT_REMINDERS;
  entries = DEFAULT_ENTRIES;
  careStreak = 5;
  saveReminders();
  saveEntries();
  saveStreak();
  closeModal('modal-backup');
  initApp();
}

// Utility
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Boot application
document.addEventListener('DOMContentLoaded', initApp);
