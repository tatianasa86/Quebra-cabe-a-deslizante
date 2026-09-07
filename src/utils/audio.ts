/**
 * Web Audio API synthesizer for tactile puzzle feedback
 */

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSlideSound(soundEnabled: boolean): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;

    // Harmonious pentatonic pitches for a serene, soft marimba / water-drop tap
    const notes = [440, 493.88, 523.25, 587.33, 659.25];
    const pitch = notes[Math.floor(Math.random() * notes.length)] * (0.99 + Math.random() * 0.02);

    // Primary fundamental oscillator (pure sine for smooth warmth)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(pitch, now);
    // Subtle, gentle micro slide downward gives it a soft fluid drop feel
    osc1.frequency.exponentialRampToValueAtTime(pitch * 0.96, now + 0.11);

    // Soft attack (7ms) and smooth exponential decay (120ms)
    // Gain at 0.16 ensures it is clearly audible on all speakers while staying gentle and relaxing
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.16, now + 0.007);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    // Secondary subtle overtone oscillator for natural presence on phone speakers
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(pitch * 2, now);
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.04, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    // Warm low-pass acoustic filter to remove any harshness or sharp edge
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.12);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.13);
    osc2.stop(now + 0.09);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

export function playInvalidSound(soundEnabled: boolean): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Soft, muted wooden bump
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

export function playVictoryFanfare(soundEnabled: boolean): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Gentle celestial kalimba / music box arpeggio
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.28, vol: 0.08 }, // C5
      { freq: 659.25, time: 0.12, dur: 0.3, vol: 0.08 }, // E5
      { freq: 783.99, time: 0.24, dur: 0.32, vol: 0.09 }, // G5
      { freq: 987.77, time: 0.36, dur: 0.36, vol: 0.09 }, // B5
      { freq: 1046.5, time: 0.48, dur: 0.65, vol: 0.11 }, // C6
    ];

    notes.forEach((note) => {
      const noteTime = now + note.time;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, noteTime);

      gainNode.gain.setValueAtTime(0.0001, noteTime);
      gainNode.gain.linearRampToValueAtTime(note.vol, noteTime + 0.025);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + note.dur);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, noteTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + note.dur);
    });
  } catch (e) {
    console.warn('Victory audio failed:', e);
  }
}
