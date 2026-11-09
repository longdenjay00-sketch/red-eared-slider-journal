# Trachemys Journal — Red-Eared Slider Telemetry & Field Vault

A specialized web application for tracking and recording the health, habitat telemetry, and care observations of Red-Eared Sliders (*Trachemys scripta elegans*), specifically tailored for Turbo and Sneaky, with full integration to the Johnny Decimal Obsidian Vault (`91_OBSIDIAN/journals`).

---

## Architecture & Features

- **Species Focus**: *Trachemys scripta elegans* (Red-eared slider).
- **Subject Tracking**:
  - **Turbo**: Channel "Turbo The Turtle" &bull; Print SKU `EB-TRB-001`.
  - **Sneaky**: 36 Public Titles &bull; Print SKU `EB-SNK-001`.
  - **Night-Tank Frame**: Mystery observation frame &bull; Print SKU `EB-NGT-001`.
- **Habitat Telemetry**:
  - Water temperature gauge with 74°F–78°F safe zone monitor.
  - Basking surface temperature monitor with 88°F–95°F safe zone monitor.
  - Water quality indicators (pH 7.4–8.0, 0 ppm Ammonia/Nitrite).
  - 6-month UVB 5.0 lamp replacement countdown.
- **Obsidian Vault Sync**:
  - Native export modal generating markdown formatted with standard YAML frontmatter compliant with `91_OBSIDIAN/journals/05 Templates/Entry.md`.
- **Zero-Dependency Core**:
  - Ultra-fast client-side application.
  - Full local-first persistence via `localStorage`.

---

## Local Development & Preview

Inside the project directory:

```bash
cd /root/10_DEV/11_PROJECTS/red-eared-slider-journal
npm run dev
# or
npx serve -l 3000 .
```

---

## Vercel Deployment

Vercel CLI tools are installed globally (`vercel@65.2.0`).

### 1. Temporary Preview Deployment (No login required)
```bash
vercel deploy --temporary
```

### 2. Production Deployment
```bash
vercel login
vercel --prod
```

### Configuration (`vercel.json`)
The application includes `vercel.json` preconfigured with clean URLs and strict security headers (`nosniff`, `DENY` framing, XSS protection).
