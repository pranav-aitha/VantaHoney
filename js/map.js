/**
 * VantaHoney Deception Suite - Vector World Map Engine
 * Hardware-accelerated Canvas world map with quadratic bezier attack arcs,
 * photon pulse animations, radar sweeps, and tactical sensor nodes.
 */

class VantaWorldMap {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById(containerId);
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');

    // Viewport dimensions
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Map projection bounds (Mercator / Equirectangular hybrid cropped to populated latitudes)
    this.latMin = -58;
    this.latMax = 78;
    this.lonMin = -170;
    this.lonMax = 190;

    // Active Sensor Node (Honeypot target)
    this.currentSensor = window.VANTA_DATA.sensors[0]; // Frankfurt

    // Dynamic state
    this.activeArcs = [];
    this.impactBursts = [];
    this.activeAttackerBeacons = new Map();
    this.radarAngle = 0;
    this.radarActive = true;
    this.hoverTarget = null;
    this.lastFrameTime = performance.now();

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.renderWorldToOffscreen();
    });

    // Mouse movement for tooltips
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());

    // Pre-render world map
    this.renderWorldToOffscreen();

    // Start 60fps render loop
    requestAnimationFrame((ts) => this.renderLoop(ts));
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.floor(rect.width) || this.container.clientWidth || 800;
    this.height = Math.floor(rect.height) || this.container.clientHeight || 480;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.offscreenCanvas.width = this.canvas.width;
    this.offscreenCanvas.height = this.canvas.height;
  }

  // Convert (Lon, Lat) to Canvas (x, y) coordinates
  project(lon, lat) {
    // Equirectangular projection with calibrated scaling
    const x = ((lon - this.lonMin) / (this.lonMax - this.lonMin)) * this.width;
    const y = ((this.latMax - lat) / (this.latMax - this.latMin)) * this.height;
    return { x, y };
  }

  // Set active honeypot central sensor
  setSensor(sensorId) {
    const found = window.VANTA_DATA.sensors.find(s => s.id === sensorId);
    if (found) {
      this.currentSensor = found;
      // Add a celebration ring burst
      const targetPos = this.project(found.lon, found.lat);
      this.addImpactBurst(targetPos.x, targetPos.y, '#00ffcc', 35);
    }
  }

  // Pre-render vector world map to offscreen canvas for high performance
  renderWorldToOffscreen() {
    const ctx = this.offscreenCtx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.width, this.height);

    // Deep SOC grid background
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw tactical grid lines (parallels and meridians)
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.04)';
    ctx.lineWidth = 1;

    for (let lon = -150; lon <= 180; lon += 30) {
      const p1 = this.project(lon, this.latMin);
      const p2 = this.project(lon, this.latMax);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    for (let lat = -40; lat <= 70; lat += 20) {
      const p1 = this.project(this.lonMin, lat);
      const p2 = this.project(this.lonMax, lat);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Equator highlight
    const eq1 = this.project(this.lonMin, 0);
    const eq2 = this.project(this.lonMax, 0);
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.08)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(eq1.x, eq1.y);
    ctx.lineTo(eq2.x, eq2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw GeoJSON Country Polygons if available
    if (window.WORLD_GEOJSON && window.WORLD_GEOJSON.features) {
      ctx.fillStyle = '#0d1829'; // Dark slate-blue landmass
      ctx.strokeStyle = '#1b2d4b'; // Subtle country borders
      ctx.lineWidth = 0.8;

      window.WORLD_GEOJSON.features.forEach((feature) => {
        const geom = feature.geometry;
        if (!geom) return;

        const renderPolygon = (coords) => {
          ctx.beginPath();
          for (let i = 0; i < coords.length; i++) {
            const pt = this.project(coords[i][0], coords[i][1]);
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        };

        if (geom.type === 'Polygon') {
          geom.coordinates.forEach(renderPolygon);
        } else if (geom.type === 'MultiPolygon') {
          geom.coordinates.forEach((poly) => {
            poly.forEach(renderPolygon);
          });
        }
      });
    }

    // Outer tactical vignette
    const gradient = ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.width * 0.2,
      this.width / 2, this.height / 2, this.width * 0.7
    );
    gradient.addColorStop(0, 'rgba(5, 10, 20, 0)');
    gradient.addColorStop(1, 'rgba(3, 7, 18, 0.65)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.restore();
  }

  // Trigger an animated attack arc from attacker to current honeypot node
  spawnAttackArc(attacker, attackData) {
    const start = this.project(attacker.lon, attacker.lat);
    const end = this.project(this.currentSensor.lon, this.currentSensor.lat);

    // Compute curve control point (arch dynamic based on distance)
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);

    // Arch height perpendicular or upward
    const archFactor = Math.min(dist * 0.35, 120);
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - archFactor;

    // Determine color based on action/severity
    let color = '#00ffcc'; // Cyan default
    let glow = 'rgba(0, 255, 204, 0.4)';
    if (attackData.action === '0-DAY TRAPPED') {
      color = '#ff3366'; // Crimson
      glow = 'rgba(255, 51, 102, 0.5)';
    } else if (attackData.action === 'DECEIVED') {
      color = '#10b981'; // Emerald
      glow = 'rgba(16, 185, 129, 0.4)';
    } else if (attackData.action === 'TARPIT') {
      color = '#f59e0b'; // Amber
      glow = 'rgba(245, 158, 11, 0.4)';
    } else if (attackData.action === 'QUARANTINED') {
      color = '#a855f7'; // Purple
      glow = 'rgba(168, 85, 247, 0.4)';
    }

    const duration = Math.max(900, Math.min(2000, dist * 3)); // speed proportional to distance

    const arc = {
      id: Math.random().toString(36).substring(2, 9),
      attacker,
      attackData,
      start,
      end,
      ctrl: { x: midX, y: midY },
      color,
      glow,
      dist,
      startTime: performance.now(),
      duration,
      progress: 0,
      alpha: 1,
      isFinished: false
    };

    this.activeArcs.push(arc);

    // Track active attacker beacon
    this.activeAttackerBeacons.set(attacker.ip, {
      attacker,
      x: start.x,
      y: start.y,
      color,
      spawnTime: performance.now(),
      life: 2500
    });
  }

  addImpactBurst(x, y, color, maxRadius = 24) {
    this.impactBursts.push({
      x,
      y,
      color,
      radius: 2,
      maxRadius,
      alpha: 1,
      startTime: performance.now(),
      duration: 600
    });
  }

  // Quadratic Bezier interpolation
  getBezierPoint(p0, p1, p2, t) {
    const inv = 1 - t;
    return {
      x: inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x,
      y: inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y
    };
  }

  renderLoop(timestamp) {
    const dt = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    const ctx = this.ctx;

    // 1. Blit cached offscreen world map (1:1 physical pixel copy)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.offscreenCanvas, 0, 0);

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 2. Target sensor position
    const targetPos = this.project(this.currentSensor.lon, this.currentSensor.lat);

    // 3. Draw animated radar sweep from target sensor
    if (this.radarActive) {
      this.radarAngle = (this.radarAngle + 0.02) % (Math.PI * 2);
      const sweepRadius = Math.min(this.width, this.height) * 0.45;

      ctx.save();
      ctx.translate(targetPos.x, targetPos.y);
      const sweepGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, sweepRadius);
      sweepGradient.addColorStop(0, 'rgba(0, 255, 204, 0.12)');
      sweepGradient.addColorStop(1, 'rgba(0, 255, 204, 0.0)');

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, sweepRadius, this.radarAngle - 0.4, this.radarAngle);
      ctx.closePath();
      ctx.fill();

      // Radar leading line
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(this.radarAngle) * sweepRadius, Math.sin(this.radarAngle) * sweepRadius);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Render and update active attack arcs & photon pulses
    const now = performance.now();
    for (let i = this.activeArcs.length - 1; i >= 0; i--) {
      const arc = this.activeArcs[i];
      const elapsed = now - arc.startTime;
      arc.progress = Math.min(1, elapsed / arc.duration);

      // Trajectory arc path
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(arc.start.x, arc.start.y);
      ctx.quadraticCurveTo(arc.ctrl.x, arc.ctrl.y, arc.end.x, arc.end.y);

      // Flashing & glowing laser trajectory
      const flash = (Math.sin(now * 0.015 + i) + 1) * 0.5;
      const baseAlpha = 0.35 + flash * 0.35;
      ctx.strokeStyle = arc.glow;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Moving photon packet along the curve
      const head = this.getBezierPoint(arc.start, arc.ctrl, arc.end, arc.progress);
      const tailProgress = Math.max(0, arc.progress - 0.12);
      const tail = this.getBezierPoint(arc.start, arc.ctrl, arc.end, tailProgress);

      // Photon packet beam
      const photonGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      photonGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      photonGrad.addColorStop(1, arc.color);

      ctx.setLineDash([]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = photonGrad;
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.stroke();

      // Glowing photon head dot
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = arc.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Check if photon reached target
      if (arc.progress >= 1 && !arc.isFinished) {
        arc.isFinished = true;
        this.addImpactBurst(targetPos.x, targetPos.y, arc.color, 28);
      }

      // Remove finished arcs after linger time
      if (elapsed > arc.duration + 400) {
        this.activeArcs.splice(i, 1);
      }
    }

    // 5. Render impact bursts at target
    for (let i = this.impactBursts.length - 1; i >= 0; i--) {
      const burst = this.impactBursts[i];
      const elapsed = now - burst.startTime;
      const progress = elapsed / burst.duration;

      if (progress >= 1) {
        this.impactBursts.splice(i, 1);
        continue;
      }

      const curRadius = burst.maxRadius * Math.sin((progress * Math.PI) / 2);
      const alpha = 1 - progress;

      ctx.save();
      ctx.strokeStyle = burst.color;
      ctx.lineWidth = 2 * (1 - progress);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(burst.x, burst.y, curRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw active attacker beacons
    this.activeAttackerBeacons.forEach((beacon, ip) => {
      const age = now - beacon.spawnTime;
      if (age > beacon.life) {
        this.activeAttackerBeacons.delete(ip);
        return;
      }

      const alpha = Math.max(0, 1 - age / beacon.life);
      const ringPulse = ((age % 800) / 800) * 16;

      ctx.save();
      ctx.globalAlpha = alpha;

      // Pulsing ring
      ctx.strokeStyle = beacon.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(beacon.x, beacon.y, 4 + ringPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Core dot
      ctx.fillStyle = beacon.color;
      ctx.shadowColor = beacon.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(beacon.x, beacon.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Small label for active attacker
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillText(`${beacon.attacker.code} · ${beacon.attacker.ip}`, beacon.x + 8, beacon.y - 4);

      ctx.restore();
    });

    // 7. Draw Central Target Honeypot Node
    ctx.save();
    // Expanding concentric beacon rings
    const ringTime = (now % 2400) / 2400;
    const ring1 = ringTime * 28;
    const ring2 = ((ringTime + 0.5) % 1) * 28;

    ctx.strokeStyle = 'rgba(0, 255, 204, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, ring1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, ring2, 0, Math.PI * 2);
    ctx.stroke();

    // Central core glowing diamond / circle
    ctx.shadowColor = '#00ffcc';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright white spark
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(targetPos.x, targetPos.y, 2, 0, Math.PI * 2);
    ctx.fill();

    // Target crosshair indicators
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(targetPos.x - 12, targetPos.y);
    ctx.lineTo(targetPos.x - 7, targetPos.y);
    ctx.moveTo(targetPos.x + 7, targetPos.y);
    ctx.lineTo(targetPos.x + 12, targetPos.y);
    ctx.moveTo(targetPos.x, targetPos.y - 12);
    ctx.lineTo(targetPos.x, targetPos.y - 7);
    ctx.moveTo(targetPos.x, targetPos.y + 7);
    ctx.lineTo(targetPos.x, targetPos.y + 12);
    ctx.stroke();

    // Label for Central Honeypot Node
    ctx.shadowBlur = 0;
    ctx.font = 'bold 10px "Orbitron", "JetBrains Mono", sans-serif';
    ctx.fillStyle = '#00ffcc';
    const tagText = `[HONEYPOT: ${this.currentSensor.code}]`;
    ctx.fillText(tagText, targetPos.x + 16, targetPos.y + 4);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0, 255, 204, 0.6)';
    ctx.fillText(`${this.currentSensor.region} · SENSOR ACTIVE`, targetPos.x + 16, targetPos.y + 16);
    ctx.restore();

    // 8. Render Tooltip if hovered
    if (this.hoverTarget) {
      this.renderTooltip(ctx, this.hoverTarget);
    }

    ctx.restore();
    requestAnimationFrame((ts) => this.renderLoop(ts));
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check hover near central sensor
    const targetPos = this.project(this.currentSensor.lon, this.currentSensor.lat);
    if (Math.hypot(mx - targetPos.x, my - targetPos.y) < 16) {
      this.hoverTarget = {
        type: 'sensor',
        x: targetPos.x,
        y: targetPos.y,
        data: this.currentSensor
      };
      return;
    }

    // Check hover near active attacker beacons
    for (const [ip, beacon] of this.activeAttackerBeacons.entries()) {
      if (Math.hypot(mx - beacon.x, my - beacon.y) < 14) {
        this.hoverTarget = {
          type: 'attacker',
          x: beacon.x,
          y: beacon.y,
          data: beacon.attacker
        };
        return;
      }
    }

    this.hoverTarget = null;
  }

  handleMouseLeave() {
    this.hoverTarget = null;
  }

  renderTooltip(ctx, target) {
    ctx.save();
    let lines = [];
    let title = '';
    let accent = '#00ffcc';

    if (target.type === 'sensor') {
      title = `DECEPTION NODE: ${target.data.name}`;
      accent = '#00ffcc';
      lines = [
        `Code: ${target.data.code}`,
        `Coordinates: ${target.data.lat.toFixed(4)}°N, ${target.data.lon.toFixed(4)}°E`,
        `Region: ${target.data.region}`,
        `Status: ${target.data.status} (Listeners Armed)`
      ];
    } else {
      title = `ATTACKER NODE: ${target.data.ip}`;
      accent = '#ff3366';
      lines = [
        `Origin: ${target.data.city}, ${target.data.country} (${target.data.code})`,
        `Network: ${target.data.asn}`,
        `Profile: ${target.data.actor}`,
        `Trajectory: INTERCEPTED & LOGGED`
      ];
    }

    ctx.font = '11px "JetBrains Mono", monospace';
    let maxW = ctx.measureText(title).width;
    lines.forEach(l => {
      const w = ctx.measureText(l).width;
      if (w > maxW) maxW = w;
    });

    const boxW = maxW + 24;
    const boxH = (lines.length + 1) * 16 + 18;
    let boxX = target.x + 12;
    let boxY = target.y - boxH - 8;

    if (boxX + boxW > this.width) boxX = target.x - boxW - 12;
    if (boxY < 10) boxY = target.y + 16;

    // Background card
    ctx.fillStyle = 'rgba(7, 12, 22, 0.94)';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Header
    ctx.fillStyle = accent;
    ctx.font = 'bold 11px "Orbitron", sans-serif';
    ctx.fillText(title, boxX + 12, boxY + 18);

    // Body lines
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px "JetBrains Mono", monospace';
    lines.forEach((l, idx) => {
      ctx.fillText(l, boxX + 12, boxY + 36 + idx * 16);
    });

    ctx.restore();
  }
}

window.VantaWorldMap = VantaWorldMap;
