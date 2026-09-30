import { useCallback, useEffect, useRef, useState } from 'react';

let audioCtx: AudioContext | null = null;
/** Precisa ser chamado num gesto do usuário (iOS). */
export function unlockAudio() {
  try {
    audioCtx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
  } catch {
    /* sem áudio */
  }
}

export function beep(times = 3) {
  try {
    unlockAudio();
    if (!audioCtx) return;
    const ctx = audioCtx;
    for (let i = 0; i < times; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.0001;
      o.connect(g).connect(ctx.destination);
      const t = ctx.currentTime + i * 0.35;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.start(t);
      o.stop(t + 0.3);
    }
  } catch {
    /* ignore */
  }
}

export function vibrate(pattern: number[] = [200, 100, 200, 100, 400]) {
  try {
    // iOS Safari não expõe navigator.vibrate; Android sim.
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

/** Cronômetro de descanso baseado em timestamp (continua certo com a tela bloqueada). */
export function useRestTimer() {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const fired = useRef(false);

  const start = useCallback((sec: number) => {
    unlockAudio();
    fired.current = false;
    setTotal(sec);
    setEndAt(Date.now() + sec * 1000);
    setRemaining(sec);
  }, []);

  const add = useCallback((sec: number) => {
    setEndAt((e) => (e ? e + sec * 1000 : e));
    setTotal((t) => t + sec);
  }, []);

  const stop = useCallback(() => {
    setEndAt(null);
    setRemaining(0);
  }, []);

  useEffect(() => {
    if (!endAt) return;
    const tick = () => {
      const r = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      setRemaining(r);
      if (r <= 0 && !fired.current) {
        fired.current = true;
        beep(3);
        vibrate();
        setTimeout(() => setEndAt(null), 1500);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    const onVis = () => tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [endAt]);

  return { running: endAt != null, remaining, total, start, stop, add };
}
