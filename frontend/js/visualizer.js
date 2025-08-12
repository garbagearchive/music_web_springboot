// visualizer.js

class AudioVisualizer {
    constructor(options = {}) {
        this.canvas = null;
        this.canvasContext = null;
        this.containerSelector = options.containerSelector || 'visualizer-container';
        this.canvasId = options.canvasId || 'audio-visualizer';

        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.bufferLength = 0;

        this.animationFrame = null;
        this.isEnabled = options.isEnabled !== undefined ? options.isEnabled : true;

        this.visualizerType = options.visualizerType || 'bars';
        this.colors = Object.assign({
            primary: '#1db954',
            secondary: '#1ed760',
            accent: '#ffffff',
            background: 'rgba(0,0,0,0)'
        }, options.colors || {});

        this.settings = Object.assign({
            sensitivity: 1.0,
            smoothing: 0.8,
            fftSize: 2048,
            minHeight: 2,
            maxHeight: 150,
            barWidth: 4,
            barSpacing: 2,
            particleCount: 60
        }, options.settings || {});

        this.particles = [];

        this.init = this.init.bind(this);
        this.setupCanvas = this.setupCanvas.bind(this);
        this.createCanvas = this.createCanvas.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.initAudio = this.initAudio.bind(this);
        this.connectToAudioElement = this.connectToAudioElement.bind(this);
        this.connectToAudioNode = this.connectToAudioNode.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.toggle = this.toggle.bind(this);
        this.draw = this.draw.bind(this);
        this.drawBars = this.drawBars.bind(this);
        this.drawWave = this.drawWave.bind(this);
        this.drawCircular = this.drawCircular.bind(this);
        this.drawParticles = this.drawParticles.bind(this);
        this.loadSettings = this.loadSettings.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);

        this.init();
    }

    init() {
        try {
            this.setupCanvas();
            this.loadSettings();
            this.setupEventListeners();
            this._initParticles();
            console.log('Audio Visualizer initialized');
        } catch (err) {
            console.error('Failed to initialize audio visualizer:', err);
        }
    }

    setupCanvas() {
        this.canvas = document.getElementById(this.canvasId) || this.createCanvas();
        if (this.canvas) {
            this.canvasContext = this.canvas.getContext('2d');
            this.resizeCanvas();
        }
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = this.canvasId;
        canvas.className = 'audio-visualizer-canvas';
        canvas.width = 800;
        canvas.height = 200;

        const container = document.getElementById(this.containerSelector) || document.body;
        container.appendChild(canvas);
        return canvas;
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
        this.canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.settings.fftSize;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.analyser.smoothingTimeConstant = this.settings.smoothing;
        }
    }

    connectToAudioElement(audioElement) {
        this.initAudio();
        this.source = this.audioContext.createMediaElementSource(audioElement);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    connectToAudioNode(audioNode) {
        this.initAudio();
        audioNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    start() {
        if (!this.isEnabled || this.animationFrame) return;
        this.draw();
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            this.start();
        } else {
            this.stop();
        }
    }

    draw() {
        this.animationFrame = requestAnimationFrame(this.draw.bind(this));

        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.visualizerType) {
            case 'bars':
                this.drawBars(this.canvasContext);
                break;
            case 'wave':
                this.drawWave(this.canvasContext);
                break;
            case 'circular':
                this.drawCircular(this.canvasContext);
                break;
            case 'particles':
                this.drawParticles(this.canvasContext);
                break;
        }
    }

    drawBars(ctx) {
        const width = this.canvas.width / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = (this.dataArray[i] / 255) * this.canvas.height;

            ctx.fillStyle = this.colors.primary;
            ctx.fillRect(x, this.canvas.height - barHeight, width, barHeight);

            x += width + 1;
        }
    }

    drawWave(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 2;

        const sliceWidth = this.canvas.width / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * (this.canvas.height / 2);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        ctx.stroke();
    }

    drawCircular(ctx) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.beginPath();
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 2;

        for (let i = 0; i < this.bufferLength; i++) {
            const angle = (i / this.bufferLength) * Math.PI * 2;
            const length = (this.dataArray[i] / 255) * radius;

            const x = centerX + Math.cos(angle) * length;
            const y = centerY + Math.sin(angle) * length;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.stroke();
    }

    _initParticles() {
        const count = this.settings.particleCount;
        const w = this.canvas ? (this.canvas.clientWidth || this.canvas.width) : 800;
        const h = this.canvas ? (this.canvas.clientHeight || this.canvas.height) : 200;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: 1 + Math.random() * 3,
                hue: Math.random() * 360
            });
        }
    }

    drawParticles(ctx) {
        const canvas = this.canvas;
        const cw = canvas.clientWidth || canvas.width;
        const ch = canvas.clientHeight || canvas.height;

        ctx.fillStyle = this.colors.background || 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, cw, ch);

        const buffer = this.dataArray || new Uint8Array(this.bufferLength || 1024);
        const avg = buffer.length ? (buffer.reduce((s, v) => s + v, 0) / buffer.length) / 255 : 0;

        for (let p of this.particles) {
            p.x += p.vx * (1 + avg * 5);
            p.y += p.vy * (1 + avg * 5);

            if (p.x < -10) p.x = cw + 10;
            if (p.x > cw + 10) p.x = -10;
            if (p.y < -10) p.y = ch + 10;
            if (p.y > ch + 10) p.y = -10;

            const size = p.size * (1 + avg * 4);
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${0.3 + avg * 0.7})`;
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem('audioVisualizerSettings');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.colors) this.colors = Object.assign(this.colors, parsed.colors);
                if (parsed.settings) this.settings = Object.assign(this.settings, parsed.settings);
                if (parsed.visualizerType) this.visualizerType = parsed.visualizerType;
            }
        } catch (e) { /* ignore */ }
    }

    saveSettings() {
        try {
            const payload = {
                colors: this.colors,
                settings: this.settings,
                visualizerType: this.visualizerType
            };
            localStorage.setItem('audioVisualizerSettings', JSON.stringify(payload));
        } catch (e) {}
    }

    setupEventListeners() {
        window.addEventListener('resize', this.resizeCanvas);
        document.addEventListener('theme:changed', (e) => {
            const themeColors = e.detail?.colors;
            if (themeColors && themeColors.primary) {
                this.colors.primary = themeColors.primary;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.audioVisualizer = new AudioVisualizer();
    if (window.player && window.player.audio) {
        window.audioVisualizer.connectToAudioElement(window.player.audio);
    }
});