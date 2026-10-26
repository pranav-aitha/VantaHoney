<div align="center">

# 🍯 VantaHoney Deception Suite
### *Autonomous SOC Threat Defense, Honeynet Radar & Cyber Deception Matrix*

[![License: MIT](https://img.shields.io/badge/License-MIT-00ffcc.svg?style=for-the-badge)](LICENSE)
[![Frontend: Zero-Dependency](https://img.shields.io/badge/Stack-Browser--Native-38bdf8.svg?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Theme: Low--Lit SOC](https://img.shields.io/badge/Theme-Obsidian%20SOC-ff3366.svg?style=for-the-badge)](#)
[![Deployment: GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-10b981.svg?style=for-the-badge)](https://pranav-aitha.github.io/VantaHoney/)

**[🌐 Live Interactive SOC Demo](https://pranav-aitha.github.io/VantaHoney/)** • **[Report Issue](https://github.com/pranav-aitha/VantaHoney/issues)** • **[Documentation](#-architecture--engine-overview)**

<br/>

```
  ____   ____            __          ___   ___                             
  \   \ /   /____   ____/  |______  /   | /   |____   ____   ____ ___.__.  
   \   Y   /\__  \ /    \   __\__  \/    |/    /  _ \ /    \_/ __ <   |  |  
    \     /  / __ \|   |  \  |  / __ \   /    (  <_> )   |  \  ___/\___  |  
     \___/  (____  /___|  /__| (____  / /|___/ \____/|___|  /\___  > ____|  
                 \/     \/          \/                    \/     \/\/        
                     [ D E C E P T I O N   S U I T E ]
```

</div>

---

## 🛰️ Overview

**VantaHoney Deception Suite** is a single-page cybersecurity web application designed with a **low-lit dark Security Operations Center (SOC)** layout. It brings real-time cyber deception telemetry to the browser, orchestrating synthetic honeypot sensors, dynamic decoy persona switching, ballistic threat vector plotting across a vector world map, and an interactive live attack feed.

The entire application is **100% frontend and browser-native**, operating without any required server backend or build pipeline.

---

## ⚡ Key Highlights

### 1. 🌐 Center Vector World Map & Ballistic Trajectory Arcs
- **Vector Projection**: High-performance HTML5 Canvas projection of 177 countries with optimized offscreen pre-rendering for silky-smooth 60 FPS performance.
- **Dynamic Flashing Arcs**: Quadratic Bezier trajectories connecting external attacker nodes across the globe (e.g., Moscow, Shanghai, Frankfurt, São Paulo, Lagos, Ashburn, Seoul) to the target central honeypot node.
- **Photon Packet Pulses & Impact Bursts**: Animated energy pulses travel along each curved ballistic line, triggering a radiant shockwave particle burst upon arrival at the honeypot sensor.
- **Tactical Radar Sweep**: Rotating conic beam emanating from the central honeypot with pulsing concentric range rings.
- **Target Sensor Relocation**: Switch the central target node in real time between **Frankfurt (FRA-01)**, **Ashburn (IAD-02)**, **Singapore (SIN-03)**, **Tokyo (TYO-04)**, and **São Paulo (GRU-05)**.

### 2. ⚡ Live Attack Feed (Tactical Side Stream)
- **Real-Time Stream**: Constantly outputs clean, high-precision log lines showing incoming connection attempts:
  ```text
  [21:42:05.12] IP 185.220.101.4 targeted Port 22 [SSH] - Dropped
  [21:42:06.34] IP 45.154.255.8 targeted Port 3306 [MySQL] - Deceived
  [21:42:07.81] IP 103.203.57.12 targeted Port 80 [HTTP] - Quarantined
  [21:42:09.04] IP 194.26.29.112 targeted Port 502 [Modbus/TCP] - Deceived
  [21:42:10.55] IP 114.119.130.45 targeted Port 443 [HTTPS] - 0-DAY TRAPPED
  ```
- **Filterable Feeds**: Filter logs instantly by action: `ALL`, `DROPPED`, `DECEIVED`, `TARPIT`, `QUARANTINED`, `0-DAY`.
- **Deep Packet Inspection Modal**: Click any log item to reveal full incident forensic details including origin ASN, geographic coordinates, threat actor affinity, and disassembled raw payload signature.
- **Log Management**: Pause/Resume feed, Clear log buffer, and Export forensic logs as timestamped `.csv` datasets.

### 3. 🎯 Interactive Dashboard Controls: "Change Decoy Profile"
Easily switch between specialized deception personas with a single click. Switching profiles immediately shifts emulated service banners, active listening ports, deception tactics, and incoming attack distributions:

| Decoy Profile | Emulation Daemon | Targeted Ports | Deception Tactics |
| :--- | :--- | :--- | :--- |
| **🌐 Web Server** | Nginx 1.24.0 + Node.js API + PHP-FPM | `80`, `443`, `8080`, `8443`, `3000`, `9000` | Canary session cookies, fake SQL errors, JNDI Log4Shell traps, synthetic `/wp-admin` decoy |
| **🗄️ Database Server** | PostgreSQL 16.2 / MySQL 8.0 / Redis 7.2 | `3306`, `5432`, `6379`, `27017`, `1433`, `1521` | Seeded honey-tables with synthetic records, Redis memory dump entrapment, Postgres sandbox diversion |
| **🔐 SSH / Bastion** | Cowrie Deception Core + OpenSSH 9.2p1 | `22`, `23`, `2222`, `3389`, `21`, `8022` | Emulated Debian bash sandbox, keystroke recording, honey-credentials harvester, SSH brute-force tarpit |
| **🏭 SCADA / ICS** | Conpot Industrial Grid + Siemens S7 Sim | `502`, `102`, `20000`, `47808`, `1883`, `44818` | Virtual PLC logic, simulated water turbine RPM telemetry, Modbus coil force override entrapment |
| **🪐 Omni HoneyNet** | Distributed Multi-Vector Hybrid Mesh | Blended Multi-Port Matrix | Enterprise full-spectrum distributed deception camouflage across all attack surfaces |

### 4. 📊 Real-Time Port Hit Frequency Chart
- High-definition horizontal telemetry bar chart powered by Chart.js with custom glowing cyber palettes.
- Dynamically recalculates and highlights the most heavily hit ports in real-time as attacks are intercepted.
- Includes a built-in zero-dependency HTML5 Canvas fallback engine for 100% offline environments.

### 5. 🔊 Pure Web Audio Synthesizer
- Zero audio asset dependencies: all sound effects (tactical radar blips, persona switch chimes, and critical zero-day sirens) are synthesized dynamically using the browser-native **Web Audio API**.
- Audio toggle in the top navigation allows one-click muting and unmuting.

### 6. ✨ High Intensive Animated Graphics
- Dual-canvas architecture: dedicated background canvas rendering an interactive floating matrix particle mesh with distance-based laser connections.
- Authentic CRT scanline overlay, glowing glassmorphism HUD cards (`backdrop-filter: blur(14px)`), and tactical typography (`Orbitron`, `JetBrains Mono`, `Inter`).

---

## 📂 Project Architecture

```
VantaHoney/
├── index.html          # Semantic dark SOC layout, HUD cards, modal, and footer
├── css/
│   └── style.css       # Obsidian SOC theme, neon glows, glassmorphism, responsive grid
├── js/
│   ├── world-geo.js    # Self-contained GeoJSON polygon dataset (177 countries, 0 network latency)
│   ├── data.js         # Decoy profile configurations, global attacker pool, threat payloads
│   ├── map.js          # Hardware-accelerated Canvas vector world map with ballistic attack arcs
│   ├── chart.js        # Real-time port hit visualization with Chart.js & fallback canvas
│   └── app.js          # SOC orchestrator, Web Audio synth, live attack feed, event handlers
├── .gitignore          # Git exclusion rules
└── README.md           # Documentation, badges, and architecture guide
```

---

## 🚀 Getting Started

### Option 1: Direct Browser Launch
Because VantaHoney is 100% browser-native with zero dependencies, you can run it immediately without installing anything:
1. Clone the repository:
   ```bash
   git clone https://github.com/pranav-aitha/VantaHoney.git
   cd VantaHoney
   ```
2. Double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Static Server
You can also preview it using Python, Node, or VS Code Live Server:
```bash
# Using Python 3
python -m http.server 8080

# Or using npx serve
npx serve .
```
Navigate to `http://localhost:8080` in your browser.

---

## 🎮 Interactive Controls Guide

- **Change Decoy Profile**: Click any of the 5 profile tabs in the controller bar to instantly switch persona.
- **Inject Zero-Day Attack**: Click the **🚨 Inject Zero-Day** button in the top right to simulate a high-priority adversary exploit complete with visual alert banners, crimson trajectory lasers, and warning audio chirps.
- **Select Honeypot Sensor**: Use the **Target Node** dropdown to shift the honeypot sensor across North America, Europe, East Asia, and South America.
- **Pacing Controls**: Adjust the stream pace from **Relaxed (2.2s)** to **Standard (1.4s)** or **Blitz / Flood (0.6s)**.
- **Deep Packet Inspection**: Click any log entry in the Live Attack Feed to inspect raw payload signatures and origin telemetry.
- **Export Data**: Click **Export** in the feed toolbar to download a complete forensic `.csv` report of all intercepted connections.

---

## 👨‍💻 Creator & Social Media Links

Made with ❤️ by **Pranav Aitha**

Connect with me across platforms:
- 𝕏 / Twitter: [@PRANAV_AITHA](https://x.com/PRANAV_AITHA)
- 🐙 GitHub: [@pranav-aitha](https://github.com/pranav-aitha)
- 📸 Instagram: [@pranav_aitha](https://instagram.com/pranav_aitha)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use, modify, and build upon it!
