/**
 * VantaHoney Deception Suite - Real-Time Port Hit Telemetry Chart
 * Dynamic telemetry visualization showing port hits, frequency distribution, and trend analysis.
 */

class VantaPortChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
    this.portHitCounts = {};
    this.currentProfile = null;
    this.activeMode = 'ports'; // 'ports' or 'vectors'
  }

  init(initialProfile) {
    this.currentProfile = initialProfile;
    this.resetPortCounts();

    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
      this.createChart();
    } else {
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof Chart !== 'undefined') {
          clearInterval(checkInterval);
          this.createChart();
        } else if (attempts > 15) {
          clearInterval(checkInterval);
          this.useCanvasFallback = true;
          this.renderCanvasFallback();
        }
      }, 100);
    }
  }

  renderCanvasFallback() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 400;
    const height = 240;
    this.canvas.width = width;
    this.canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    const sorted = this.getSortedPorts();
    const maxVal = Math.max(...sorted.map(s => s.count), 1);

    const rowH = (height - 20) / sorted.length;
    sorted.forEach((item, idx) => {
      const y = 10 + idx * rowH;
      const barMaxW = width - 150;
      const barW = (item.count / maxVal) * barMaxW;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`${item.port} [${item.name}]`, 10, y + rowH * 0.65);

      // Glow bar
      ctx.fillStyle = 'rgba(0, 255, 204, 0.2)';
      ctx.fillRect(140, y + 4, barMaxW, rowH - 8);

      const grad = ctx.createLinearGradient(140, 0, 140 + barW, 0);
      grad.addColorStop(0, '#00ffcc');
      grad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = grad;
      ctx.fillRect(140, y + 4, barW, rowH - 8);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${item.count}`, 140 + barW + 8, y + rowH * 0.65);
    });
  }

  resetPortCounts() {
    this.portHitCounts = {};
    if (this.currentProfile && this.currentProfile.primaryPorts) {
      this.currentProfile.primaryPorts.forEach((port) => {
        // Initialize with realistic baseline hits
        this.portHitCounts[port] = Math.floor(Math.random() * 24) + 12;
      });
    }
  }

  setProfile(newProfile) {
    this.currentProfile = newProfile;
    this.resetPortCounts();
    if (this.chart) {
      this.updateChartConfig();
    } else if (this.useCanvasFallback) {
      this.renderCanvasFallback();
    }
  }

  registerHit(port) {
    if (!this.portHitCounts[port]) {
      this.portHitCounts[port] = 0;
    }
    this.portHitCounts[port] += 1;

    if (this.chart) {
      this.refreshData();
    } else if (this.useCanvasFallback) {
      this.renderCanvasFallback();
    }
  }

  getSortedPorts() {
    return Object.entries(this.portHitCounts)
      .map(([port, count]) => ({
        port: parseInt(port),
        name: (this.currentProfile.portNames && this.currentProfile.portNames[port]) || `Port ${port}`,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }

  createChart() {
    const ctx = this.canvas.getContext('2d');
    const sorted = this.getSortedPorts();

    const labels = sorted.map(item => `${item.port} [${item.name}]`);
    const data = sorted.map(item => item.count);

    // Neon cyber gradients
    const neonColors = [
      'rgba(0, 255, 204, 0.85)',
      'rgba(56, 189, 248, 0.85)',
      'rgba(129, 140, 248, 0.85)',
      'rgba(168, 85, 247, 0.85)',
      'rgba(245, 158, 11, 0.85)',
      'rgba(255, 51, 102, 0.85)'
    ];

    const borderColors = [
      '#00ffcc',
      '#38bdf8',
      '#818cf8',
      '#a855f7',
      '#f59e0b',
      '#ff3366'
    ];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Interceptions',
          data: data,
          backgroundColor: neonColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bars for clean reading of port names
        animation: {
          duration: 400,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(7, 12, 22, 0.95)',
            borderColor: '#00ffcc',
            borderWidth: 1,
            titleFont: { family: 'Orbitron', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            padding: 10,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return `Hits: ${context.raw} trapped attempts`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 255, 204, 0.08)',
              tickColor: 'transparent'
            },
            ticks: {
              color: '#94a3b8',
              font: { family: 'JetBrains Mono', size: 10 },
              stepSize: 10
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#e2e8f0',
              font: { family: 'JetBrains Mono', size: 11, weight: '600' }
            }
          }
        }
      }
    });
  }

  updateChartConfig() {
    if (!this.chart) return;
    const sorted = this.getSortedPorts();
    this.chart.data.labels = sorted.map(item => `${item.port} [${item.name}]`);
    this.chart.data.datasets[0].data = sorted.map(item => item.count);
    this.chart.update('none');
  }

  refreshData() {
    if (!this.chart) return;
    const sorted = this.getSortedPorts();
    this.chart.data.labels = sorted.map(item => `${item.port} [${item.name}]`);
    this.chart.data.datasets[0].data = sorted.map(item => item.count);
    this.chart.update('none'); // Update without janky animation reset
  }
}

window.VantaPortChart = VantaPortChart;
