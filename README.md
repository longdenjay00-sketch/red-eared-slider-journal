# Trachemys Care — Red-Eared Slider Care Reminders & Telemetry Hub

A specialized web application for tracking and scheduling the care, health routines, habitat telemetry, and observations of Red-Eared Sliders (*Trachemys scripta elegans*), specifically tailored for Turbo and Sneaky, with full integration to the Johnny Decimal Obsidian Vault (`91_OBSIDIAN/journals`) and pre-configured for instant **Vercel** serverless deployment.

---

## Architecture & Care Reminders

### 1. Care Schedules & Reminders
- **Daily Protocols**:
  - **Turbo Morning Feed**: Mazuri aquatic pellets (head volume size) + dandelion greens / romaine / kale.
  - **Sneaky Morning Grazing**: Duckweed surface mat + pellets.
  - **Thermal & Photoperiod Check**: Water 74°F–78°F, Basking dock 88°F–95°F, 10–12 hour light timer.
  - **Waste Spot-Clean**: Net out debris & unconsumed greens to curb ammonia.
- **Weekly Protocols**:
  - **25% Partial Water Change & Siphon**: Substrate vacuum with Prime / ReptiSafe dechlorinator.
  - **Water Chemistry Test**: Liquid test for 0 ppm Ammonia, 0 ppm Nitrite, pH 7.4–8.0.
  - **Shell & Scute Inspection**: Monitor marginal scutes for clean shedding without retained scutes or soft spots.
  - **Calcium Boost**: Replenish floating cuttlebone with brittle backing removed.
- **Monthly Protocols**:
  - **Filter Canister Sponge Rinse**: Rinse biological media in removed tank water (never chlorinated tap water).
  - **Glass Algae Scrape & Heater Check**: Verify heater suction mounts and thermostat calibration.
  - **Weight & Straight Carapace Length (SCL)**: Kitchen scale weigh-in in grams, caliper shell measurement.
- **Biannual Protocols (Every 180 Days)**:
  - **UVB 5.0 / 10.0 Lamp Replacement**: Phosphor decay countdown to prevent Metabolic Bone Disease (MBD).

### 2. Audio & Alarms
- **Web Audio API**: Real-time synthesized aquatic two-tone chime upon task completion without external audio files.
- **Web Notifications API**: Browser alarms for due and overdue care tasks.

### 3. Obsidian Vault Sync (`91_OBSIDIAN/journals`)
- Generates markdown files with YAML frontmatter compliant with the Johnny Decimal system:
  - Target: `91_OBSIDIAN/journals/02 Entries/`
  - Template: `91_OBSIDIAN/journals/05 Templates/Entry.md`

### 4. Zero-Dependency Core
- Client-side static application.
- Instant loading, zero cold-starts, full `localStorage` persistence with JSON snapshot import/export.

---

## Local Development & Preview

Inside the project directory:

```bash
cd /root/10_DEV/11_PROJECTS/red-eared-slider-journal
npx serve -l 3000 .
```

---

## Vercel Deployment

Vercel CLI tools are installed globally (`vercel@65.2.0`).

### 1. Temporary Preview Deployment (No login required)
```bash
cd /root/10_DEV/11_PROJECTS/red-eared-slider-journal
vercel deploy --temporary
```

### 2. Production Deployment
```bash
vercel login
vercel --prod
```

### Configuration (`vercel.json`)
Preconfigured with clean URLs and strict security headers (`nosniff`, `DENY` framing, XSS protection).
