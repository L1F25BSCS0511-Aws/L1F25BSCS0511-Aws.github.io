/**
 * Web Audio API Sound Synthesizer for subtle futuristic UI feedback
 * Pure code synthesis - no external audio files required!
 */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('soundEnabled') === 'true';
    this.volume = 0.15; // Soft ambient volume
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    if (this.enabled) {
      this.init();
      this.playBeep(600, 0.08, 'sine');
    }
    return this.enabled;
  }

  playBeep(freq = 440, duration = 0.05, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  click() {
    this.playBeep(800, 0.04, 'triangle');
  }

  hover() {
    this.playBeep(450, 0.02, 'sine');
  }

  success() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(this.volume * 0.8, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
      });
    } catch (e) {}
  }

  open() {
    this.playBeep(320, 0.09, 'sawtooth');
  }

  keystroke() {
    this.playBeep(500 + Math.random() * 200, 0.025, 'triangle');
  }
}

window.soundManager = new SoundManager();
