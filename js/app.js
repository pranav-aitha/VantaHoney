/**
 * VantaHoney Deception Suite - Main SOC Orchestrator
 * Telemetry management, Web Audio synthesizer, Live Attack Feed,
 * Interactive Decoy Profile switching, and Background Cyber Canvas.
 */

class VantaSOC {
  constructor() {
    this.audioEnabled = false;
    this.audioCtx = null;
    this.currentProfileKey = 'web';
    this.currentProfile = window.VANTA_DATA.profiles[this.currentProfileKey];

    // Simulation metrics
    this.totalInterceptions = 14285;
    this.activeTrapsCount = 42;
    this.uniqueThreatActors = 389;
    this.defconLevel = 'DEFCON 3';

    // Simulation timer
    this.attackInterval = 1400; // ms
    this.timerId = null;
    this.isStreamPaused = false;
    this.activeFilter = 'ALL';
    this.attackLogHistory = [];

    // Modules
    this.worldMap = null;
    this.portChart = null;

    this.init();
  }

  init() {
    // 1. Init background cyber grid canvas
    this.initBackgroundCanvas();

    // 2. Init World Map
    this.worldMap = new window.VantaWorldMap('socWorldMap', 'mapContainer');

    // 3. Init Port Chart
    this.portChart = new window.VantaPortChart('portChartCanvas');
    this.portChart.init(this.currentProfile);

    // 4. Update UI with initial decoy profile
    this.updateDecoyProfileUI();

    // 5. Setup event listeners
    this.setupEventListeners();

    // 6. Start simulation loop
    this.startSimulationStream();

    // 7. Update clock and uptime
    this.initClock();

    // Seed initial attack logs
    this.seedInitialLogs();
  }

  // Pure Web Audio Synthesizer for zero-dependency high-tech SFX
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBlipSound(type = 'blip') {
    if (!this.audioEnabled || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'blip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'critical') {
        // High alert two-tone chirp
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.setValueAtTime(1400, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'switch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Interactive Decoy Profile Switcher
  switchDecoyProfile(profileKey) {
    if (!window.VANTA_DATA.profiles[profileKey]) return;

    this.currentProfileKey = profileKey;
    this.currentProfile = window.VANTA_DATA.profiles[profileKey];

    this.playBlipSound('switch');

    // Update active state on buttons
    document.querySelectorAll('.profile-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.profile === profileKey);
    });

    // Update Decoy specification card
    this.updateDecoyProfileUI();

    // Inform Port Chart of new profile
    this.portChart.setProfile(this.currentProfile);

    // Append system transition log
    this.appendSystemNotice(
      `DECOY PROFILE SHIFTED TO: [${this.currentProfile.name.toUpperCase()}] // Re-binding listeners on ports: ${this.currentProfile.primaryPorts.join(', ')}`
    );

    // Flash HUD effect
    const hud = document.getElementById('socApp');
    hud.classList.add('profile-shift-flash');
    setTimeout(() => hud.classList.remove('profile-shift-flash'), 400);
  }

  updateDecoyProfileUI() {
    const p = this.currentProfile;
    document.getElementById('profileTitle').textContent = p.name;
    document.getElementById('profileTagline').textContent = p.tagline;
    document.getElementById('profileEngine').textContent = p.emulationEngine;
    document.getElementById('profileBanner').textContent = p.banner;

    // Render active tactics
    const tacticsList = document.getElementById('profileTacticsList');
    tacticsList.innerHTML = '';
    p.tactics.forEach(tactic => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="tactic-bullet">▶</span> ${tactic}`;
      tacticsList.appendChild(li);
    });

    // Render active listening port pills
    const portsContainer = document.getElementById('profileListeningPorts');
    portsContainer.innerHTML = '';
    p.primaryPorts.forEach(port => {
      const span = document.createElement('span');
      span.className = 'port-pill';
      span.innerHTML = `<strong>${port}</strong>/${p.portNames[port] || 'TCP'}`;
      portsContainer.appendChild(span);
    });
  }

  // Simulation attack stream
  startSimulationStream() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (!this.isStreamPaused) {
        this.generateRandomAttack();
      }
    }, this.attackInterval);
  }

  setStreamSpeed(speedMs) {
    this.attackInterval = speedMs;
    this.startSimulationStream();
  }

  generateRandomAttack(forceZeroDay = false) {
    const attackers = window.VANTA_DATA.attackers;
    const attacker = attackers[Math.floor(Math.random() * attackers.length)];

    const profile = this.currentProfile;
    const ports = profile.primaryPorts;
    const port = ports[Math.floor(Math.random() * ports.length)];
    const portName = profile.portNames[port] || 'TCP';

    // Pick action
    let actionObj;
    if (forceZeroDay) {
      actionObj = window.VANTA_DATA.actions.find(a => a.label === '0-DAY TRAPPED');
    } else {
      const weights = [0.45, 0.32, 0.12, 0.08, 0.03]; // Drop, Deceive, Tarpit, Quarantine, 0-Day
      const rand = Math.random();
      let sum = 0;
      let chosenIdx = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (rand <= sum) {
          chosenIdx = i;
          break;
        }
      }
      actionObj = window.VANTA_DATA.actions[chosenIdx];
    }

    const payload = profile.samplePayloads[Math.floor(Math.random() * profile.samplePayloads.length)];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);

    const attackData = {
      id: 'ATK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      time: timeStr,
      ip: attacker.ip,
      country: attacker.country,
      code: attacker.code,
      port: port,
      portName: portName,
      action: actionObj.label,
      actionClass: actionObj.class,
      actionDesc: actionObj.desc,
      payload: payload,
      asn: attacker.asn,
      actor: attacker.actor,
      isZeroDay: actionObj.label === '0-DAY TRAPPED'
    };

    // 1. Animate on Vector World Map
    this.worldMap.spawnAttackArc(attacker, attackData);

    // 2. Increment Port Hit graph
    this.portChart.registerHit(port);

    // 3. Append to Live Attack Feed
    this.appendAttackLog(attackData);

    // 4. Update SOC Counters
    this.totalInterceptions += 1;
    document.getElementById('counterInterceptions').textContent = this.totalInterceptions.toLocaleString();

    // Audio SFX
    if (attackData.isZeroDay) {
      this.playBlipSound('critical');
      this.triggerAlertBanner(attackData);
    } else {
      this.playBlipSound('blip');
    }
  }

  // Seed realistic historical logs on startup
  seedInitialLogs() {
    for (let i = 0; i < 7; i++) {
      this.generateRandomAttack();
    }
  }

  // Format clean single text line as requested
  formatCleanLogLine(atk) {
    // e.g. "IP 185.220.101.4 targeted Port 22 [SSH] - Dropped"
    return `IP ${atk.ip} targeted Port ${atk.port} [${atk.portName}] - ${atk.action}`;
  }

  appendAttackLog(atk) {
    this.attackLogHistory.unshift(atk);
    if (this.attackLogHistory.length > 200) {
      this.attackLogHistory.pop();
    }

    // Check filter
    if (this.activeFilter !== 'ALL' && atk.action !== this.activeFilter) {
      return;
    }

    const feedList = document.getElementById('liveAttackFeed');
    const row = document.createElement('div');
    row.className = `feed-item ${atk.actionClass}`;
    if (atk.isZeroDay) row.classList.add('feed-item-alert');

    // Clean text line with high-tech badge accents
    row.innerHTML = `
      <div class="feed-main-line">
        <span class="feed-time">[${atk.time}]</span>
        <span class="feed-badge">${atk.code}</span>
        <span class="feed-ip">${atk.ip}</span>
        <span class="feed-arrow">➔</span>
        <span class="feed-target">Port ${atk.port} [${atk.portName}]</span>
        <span class="feed-status-pill ${atk.actionClass}">${atk.action}</span>
      </div>
      <div class="feed-sub-line">
        <span class="feed-payload-tag">Sig:</span> ${this.escapeHTML(atk.payload.substring(0, 68))}
        <span class="feed-inspect-btn" title="Inspect Telemetry">🔍 Inspect</span>
      </div>
    `;

    // Click row to inspect deep packet
    row.addEventListener('click', () => {
      this.openPacketInspectionModal(atk);
    });

    feedList.insertBefore(row, feedList.firstChild);

    // Limit visible DOM items to 50 for max speed
    while (feedList.children.length > 50) {
      feedList.removeChild(feedList.lastChild);
    }
  }

  appendSystemNotice(text) {
    const feedList = document.getElementById('liveAttackFeed');
    const row = document.createElement('div');
    row.className = 'feed-system-notice';
    const timeStr = new Date().toTimeString().split(' ')[0];
    row.innerHTML = `<span>[${timeStr}] ⚡</span> <span>${this.escapeHTML(text)}</span>`;
    feedList.insertBefore(row, feedList.firstChild);
  }

  filterFeed(filter) {
    this.activeFilter = filter;
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Re-render feed from history
    const feedList = document.getElementById('liveAttackFeed');
    feedList.innerHTML = '';
    const filtered = this.activeFilter === 'ALL'
      ? this.attackLogHistory
      : this.attackLogHistory.filter(a => a.action === this.activeFilter);

    filtered.slice(0, 50).forEach(atk => {
      const row = document.createElement('div');
      row.className = `feed-item ${atk.actionClass}`;
      if (atk.isZeroDay) row.classList.add('feed-item-alert');
      row.innerHTML = `
        <div class="feed-main-line">
          <span class="feed-time">[${atk.time}]</span>
          <span class="feed-badge">${atk.code}</span>
          <span class="feed-ip">${atk.ip}</span>
          <span class="feed-arrow">➔</span>
          <span class="feed-target">Port ${atk.port} [${atk.portName}]</span>
          <span class="feed-status-pill ${atk.actionClass}">${atk.action}</span>
        </div>
        <div class="feed-sub-line">
          <span class="feed-payload-tag">Sig:</span> ${this.escapeHTML(atk.payload.substring(0, 68))}
          <span class="feed-inspect-btn" title="Inspect Telemetry">🔍 Inspect</span>
        </div>
      `;
      row.addEventListener('click', () => this.openPacketInspectionModal(atk));
      feedList.appendChild(row);
    });
  }

  // Deep Packet Inspection Modal
  openPacketInspectionModal(atk) {
    const modal = document.getElementById('packetModal');
    document.getElementById('modalAtkId').textContent = atk.id;
    document.getElementById('modalTimestamp').textContent = atk.time;
    document.getElementById('modalIp').textContent = `${atk.ip} (${atk.country})`;
    document.getElementById('modalAsn').textContent = atk.asn;
    document.getElementById('modalActor').textContent = atk.actor;
    document.getElementById('modalPort').textContent = `${atk.port} [${atk.portName}]`;
    document.getElementById('modalAction').textContent = `${atk.action} (${atk.actionDesc})`;
    document.getElementById('modalAction').className = `modal-val ${atk.actionClass}`;
    document.getElementById('modalPayload').textContent = atk.payload;

    modal.classList.add('active');
  }

  closePacketModal() {
    document.getElementById('packetModal').classList.remove('active');
  }

  triggerAlertBanner(atk) {
    const alertBox = document.getElementById('socAlertBanner');
    alertBox.innerHTML = `
      <div class="alert-content">
        <span class="alert-icon">⚠️</span>
        <strong>CRITICAL ZERO-DAY ADVERSARY INTERCEPTED:</strong>
        <span>IP ${atk.ip} (${atk.country}) targeted Port ${atk.port} [${atk.portName}]. Forensic memory sandbox initiated.</span>
      </div>
      <button class="alert-dismiss" onclick="document.getElementById('socAlertBanner').classList.remove('active')">DISMISS</button>
    `;
    alertBox.classList.add('active');
    setTimeout(() => {
      alertBox.classList.remove('active');
    }, 6000);
  }

  exportLogsAsCSV() {
    if (!this.attackLogHistory.length) return;
    let csv = 'Timestamp,Attacker_IP,Country,Port,Protocol,Action,Payload,ASN,Actor\n';
    this.attackLogHistory.forEach(a => {
      csv += `"${a.time}","${a.ip}","${a.country}",${a.port},"${a.portName}","${a.action}","${a.payload.replace(/"/g, '""')}","${a.asn}","${a.actor}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VantaHoney_SOC_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Setup UI event bindings
  setupEventListeners() {
    // Decoy Profile Tabs
    document.querySelectorAll('.profile-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchDecoyProfile(e.currentTarget.dataset.profile);
      });
    });

    // Sensor Dropdown Selector
    const sensorSelect = document.getElementById('sensorSelect');
    if (sensorSelect) {
      sensorSelect.addEventListener('change', (e) => {
        this.worldMap.setSensor(e.target.value);
        this.playBlipSound('switch');
        this.appendSystemNotice(`Target Honeypot relocated to sensor: [${e.target.value.toUpperCase()}]`);
      });
    }

    // Audio SFX Toggle
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.initAudio();
        this.audioEnabled = !this.audioEnabled;
        soundToggle.classList.toggle('active', this.audioEnabled);
        soundToggle.innerHTML = this.audioEnabled ? '<span>🔊 SFX: ON</span>' : '<span>🔇 SFX: OFF</span>';
        if (this.audioEnabled) this.playBlipSound('switch');
      });
    }

    // Zero-Day Attack Trigger Button
    const triggerZeroDayBtn = document.getElementById('triggerZeroDayBtn');
    if (triggerZeroDayBtn) {
      triggerZeroDayBtn.addEventListener('click', () => {
        this.initAudio();
        this.generateRandomAttack(true);
      });
    }

    // Stream Pause / Resume
    const pauseBtn = document.getElementById('pauseFeedBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isStreamPaused = !this.isStreamPaused;
        pauseBtn.classList.toggle('active', this.isStreamPaused);
        pauseBtn.textContent = this.isStreamPaused ? '▶ Resume Feed' : '⏸ Pause Feed';
      });
    }

    // Clear Feed
    const clearBtn = document.getElementById('clearFeedBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        document.getElementById('liveAttackFeed').innerHTML = '';
        this.appendSystemNotice('Live Attack Feed buffer cleared by operator.');
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('exportFeedBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportLogsAsCSV();
      });
    }

    // Filter pills
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterFeed(e.currentTarget.dataset.filter);
      });
    });

    // Simulation Speed Selector
    const speedSelect = document.getElementById('simSpeedSelect');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        const ms = parseInt(e.target.value);
        this.setStreamSpeed(ms);
        this.appendSystemNotice(`Telemetry ingest rate calibrated to: ${ms}ms / event`);
      });
    }

    // Close Modal Button & Overlay
    const modalClose = document.getElementById('modalCloseBtn');
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closePacketModal());
    }
    const modalOverlay = document.getElementById('packetModal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closePacketModal();
      });
    }
  }

  initClock() {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toUTCString().replace('GMT', 'UTC');
      const timeElem = document.getElementById('socUtcClock');
      if (timeElem) timeElem.textContent = utcString;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Stylish animated background with high intensive graphics
  initBackgroundCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Cyber particle nodes
    const particleCount = 48;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    // Animation loop for cyber matrix particle grid
    const animateBg = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark cyber background fill
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle perspective digital grid
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.025)';
      ctx.lineWidth = 1;

      const gridSize = 64;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw floating cyber particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(0, 255, 204, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle laser strands
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 255, 204, ${0.08 * (1 - dist / 130)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateBg);
    };

    requestAnimationFrame(animateBg);
  }

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.VantaSOC = VantaSOC;

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.socApp = new VantaSOC();
});
