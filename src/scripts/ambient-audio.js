/**
 * Cloudhouse Ambient Sensory Sound Generator
 * Generates an ultra-subtle, warm ASMR ember crackle and smooth lounge simmer using Web Audio API
 */
export function initAmbientAudio() {
  const toggleBtn = document.getElementById('ambientToggle');
  if (!toggleBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let noiseNode = null;
  let filterNode = null;
  let crackleInterval = null;

  function startAmbient() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master output gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 2.5); // Very soft background level
      masterGain.connect(audioCtx.destination);

      // Pink/Brown air warmth filter
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        data[i] = (b0 + b1 + b2 + b3 + white * 0.5362) * 0.04;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(320, audioCtx.currentTime);

      noiseNode.connect(filterNode);
      filterNode.connect(masterGain);
      noiseNode.start();

      // Micro ember crackle clicks (soft random clicks)
      crackleInterval = setInterval(() => {
        if (!audioCtx || audioCtx.state !== 'running') return;
        if (Math.random() < 0.35) {
          const osc = audioCtx.createOscillator();
          const clickGain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800 + Math.random() * 1200, audioCtx.currentTime);
          clickGain.gain.setValueAtTime(0.008 + Math.random() * 0.008, audioCtx.currentTime);
          clickGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
          osc.connect(clickGain);
          clickGain.connect(masterGain);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.05);
        }
      }, 120);

      isPlaying = true;
      toggleBtn.classList.add('playing');
      toggleBtn.setAttribute('title', 'Mute Ambient Ember Soundscape');
    } catch (e) {
      console.warn('Web Audio Ambient not supported:', e);
    }
  }

  function stopAmbient() {
    if (audioCtx && masterGain) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        if (noiseNode) noiseNode.stop();
        if (audioCtx) audioCtx.close();
        if (crackleInterval) clearInterval(crackleInterval);
        audioCtx = null;
      }, 1000);
    }
    isPlaying = false;
    toggleBtn.classList.remove('playing');
    toggleBtn.setAttribute('title', 'Play Ambient Ember Soundscape');
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  });
}
