/**
 * Red-Eared Slider Journal & Telemetry Engine
 * Aligned with Morpheus Obsidian Vault schema (91_OBSIDIAN/journals)
 */

const STORAGE_KEY = 'trachemys_journal_entries_v1';

// Initial baseline entries matching the vault records
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
    turtle: 'Unassigned',
    species: 'red-eared slider',
    waterTemp: 76.0,
    baskingTemp: 90.0,
    diet: 'Standard feeding schedule',
    notes: 'The journal starts today. Turbo and Sneaky are the two red-eared sliders named in the public character list. Private records initialized.',
    uncheck: 'No feeding, temperature, or measurement was taken for this entry.'
  }
];

// App State
let entries = [];
let currentFilter = 'All';

// Initialize
function initApp() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      entries = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse localStorage, resetting to defaults', e);
      entries = DEFAULT_ENTRIES;
    }
  } else {
    entries = DEFAULT_ENTRIES;
    saveEntries();
  }

  // Update clock
  const timeEl = document.getElementById('current-time');
  if (timeEl) {
    const now = new Date();
    timeEl.textContent = now.toISOString().split('T')[0];
  }

  setupEventListeners();
  renderEntries();
  updateTurtleSummaries();
  refreshLucide();
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function setupEventListeners() {
  // Modal openers
  const btnQuickLog = document.getElementById('btn-quick-log');
  if (btnQuickLog) {
    btnQuickLog.addEventListener('click', () => openModal('modal-log-entry'));
  }

  const btnExportObsidian = document.getElementById('btn-export-obsidian');
  if (btnExportObsidian) {
    btnExportObsidian.addEventListener('click', () => {
      generateObsidianExport();
      openModal('modal-obsidian');
    });
  }

  // Form submit
  const formEntry = document.getElementById('form-entry');
  if (formEntry) {
    formEntry.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCreateEntry();
    });
  }

  // Close modals on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('modal-log-entry');
      closeModal('modal-obsidian');
    }
  });
}

function refreshLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.remove('hidden');
    refreshLucide();
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('hidden');
  }
}

function handleCreateEntry() {
  const turtle = document.getElementById('input-turtle').value;
  const waterTemp = parseFloat(document.getElementById('input-water-temp').value) || 76.5;
  const baskingTemp = parseFloat(document.getElementById('input-basking-temp').value) || 92.0;
  const diet = document.getElementById('input-diet').value.trim() || 'Standard pellets and greens';
  const notes = document.getElementById('input-notes').value.trim() || 'Routine observation.';

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const newEntry = {
    id: `entry-${Date.now()}`,
    title: `${turtle === 'Unassigned' ? 'Night-Tank Observation' : turtle + ' Care & Telemetry'} (${dateStr})`,
    date: dateStr,
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

  // Reset form
  document.getElementById('form-entry').reset();
  closeModal('modal-log-entry');

  renderEntries();
  updateTurtleSummaries();
  refreshLucide();
}

function filterByTurtle(turtle) {
  currentFilter = turtle;

  // Update button active states
  ['All', 'Turbo', 'Sneaky', 'Unassigned'].forEach(t => {
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
  refreshLucide();
}

function renderEntries() {
  const container = document.getElementById('entries-container');
  if (!container) return;

  const filtered = currentFilter === 'All' 
    ? entries 
    : entries.filter(e => e.turtle === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-panel rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
        <i data-lucide="inbox" class="w-8 h-8 text-slate-600 mx-auto mb-2"></i>
        No entries recorded for ${currentFilter}. Click "Log Observation" to create one.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    let tagClass = 'tag-unassigned';
    let tagLabel = 'Night-Tank Frame';
    if (item.turtle === 'Turbo') {
      tagClass = 'tag-turbo';
      tagLabel = 'Turbo (EB-TRB-001)';
    } else if (item.turtle === 'Sneaky') {
      tagClass = 'tag-sneaky';
      tagLabel = 'Sneaky (EB-SNK-001)';
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

// Generate Markdown adhering to 05 Templates/Entry.md
function generateObsidianExport() {
  const latest = entries[0] || DEFAULT_ENTRIES[0];
  const markdown = `---
title: "${latest.title}"
date: ${latest.date}
species: red-eared slider
animal: "${latest.turtle === 'Unassigned' ? '' : latest.turtle.toLowerCase()}"
type: entry
status: recorded
telemetry:
  water_temp_f: ${latest.waterTemp}
  basking_temp_f: ${latest.baskingTemp}
  diet: "${latest.diet}"
---

# ${latest.title}

## Who was seen

${latest.turtle === 'Unassigned' ? 'Unknown (Night-Tank Frame EB-NGT-001). Stays unassigned.' : latest.turtle + ' (Red-eared slider).'}

## What was observed

- **Water Temperature:** ${latest.waterTemp}°F
- **Basking Surface:** ${latest.baskingTemp}°F
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
    console.error('Clipboard error', err);
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Start
document.addEventListener('DOMContentLoaded', initApp);
