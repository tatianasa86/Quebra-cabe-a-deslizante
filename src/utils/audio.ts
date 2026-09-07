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

  try {
    const now = ctx.currentTime;
    // Softer, gentle warm wooden/water droplet click
    const pitchVariation = 0.96 + Math.random() * 0.08;
    const baseFreq = 310 * pitchVariation;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.07);

    // Very gentle, soothing volume level (non-intrusive)
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, now);
    filter.frequency.exponentialRampToValueAtTime(280, now + 0.07);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

export function playInvalidSound(soundEnabled: boolean): void {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Soft muted, gentle bump
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.09);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

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
