'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PatternKey = "festiveSteppe" | "sunriseMeditation" | "playfulEcho";

type Pattern = {
  title: string;
  description: string;
  bpm: number;
  sequence: Array<{
    stringIndex: number;
    frequency: number;
    accent?: boolean;
  }>;
};

const STRINGS = [
  { label: "G", frequency: 196 },
  { label: "D", frequency: 293.66 },
  { label: "A", frequency: 440 },
];

const PATTERNS: Record<PatternKey, Pattern> = {
  festiveSteppe: {
    title: "Праздничный наигрыш",
    description: "Быстрый ритм с акцентами для шумных юрточных вечеринок.",
    bpm: 132,
    sequence: [
      { stringIndex: 0, frequency: 196, accent: true },
      { stringIndex: 1, frequency: 293.66 },
      { stringIndex: 2, frequency: 440 },
      { stringIndex: 1, frequency: 329.63 },
      { stringIndex: 0, frequency: 220, accent: true },
      { stringIndex: 2, frequency: 493.88 },
      { stringIndex: 1, frequency: 261.63 },
      { stringIndex: 0, frequency: 174.61 },
    ],
  },
  sunriseMeditation: {
    title: "Рассветное созерцание",
    description: "Медленное, медитативное перетекание утренних лучей.",
    bpm: 82,
    sequence: [
      { stringIndex: 2, frequency: 392 },
      { stringIndex: 2, frequency: 440 },
      { stringIndex: 1, frequency: 293.66 },
      { stringIndex: 0, frequency: 196 },
      { stringIndex: 1, frequency: 246.94 },
      { stringIndex: 0, frequency: 174.61 },
      { stringIndex: 2, frequency: 349.23 },
      { stringIndex: 1, frequency: 261.63 },
    ],
  },
  playfulEcho: {
    title: "Игривое эхо",
    description: "Обезьяньи выкрутасы и подражание голосам птиц.",
    bpm: 104,
    sequence: [
      { stringIndex: 1, frequency: 311.13 },
      { stringIndex: 2, frequency: 466.16 },
      { stringIndex: 1, frequency: 277.18 },
      { stringIndex: 0, frequency: 207.65 },
      { stringIndex: 2, frequency: 415.3, accent: true },
      { stringIndex: 1, frequency: 293.66 },
      { stringIndex: 0, frequency: 174.61 },
      { stringIndex: 2, frequency: 349.23 },
    ],
  },
};

type ScheduledNode = { stop: () => void };

export default function MonkeyStage() {
  const [selectedPattern, setSelectedPattern] =
    useState<PatternKey>("festiveSteppe");
  const [isPerforming, setIsPerforming] = useState(false);
  const [activeString, setActiveString] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const scheduledNodesRef = useRef<ScheduledNode[]>([]);

  const activePattern = useMemo(
    () => PATTERNS[selectedPattern],
    [selectedPattern],
  );

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  useEffect(() => {
    return () => {
      clearTimeouts();
      scheduledNodesRef.current.forEach(({ stop }) => stop());
      scheduledNodesRef.current = [];
      audioContextRef.current?.close().catch(() => undefined);
    };
  }, [clearTimeouts]);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  }, []);

  const scheduleHighlight = useCallback(
    (msFromNow: number, stringIndex: number, release: number) => {
      const highlightId = window.setTimeout(() => {
        setActiveString(stringIndex);
        const resetId = window.setTimeout(() => {
          setActiveString((current) =>
            current === stringIndex ? null : current,
          );
        }, release);
        timeoutsRef.current.push(resetId);
      }, msFromNow);
      timeoutsRef.current.push(highlightId);
    },
    [],
  );

  const pluckString = useCallback(
    (
      ctx: AudioContext,
      frequency: number,
      startTime: number,
      accent: boolean,
    ) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, startTime);

      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 1500);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(accent ? 2200 : 1800, startTime);

      const gain = ctx.createGain();
      const peak = accent ? 0.9 : 0.6;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(peak, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.4);

      oscillator.connect(filter);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      noise.start(startTime);
      oscillator.stop(startTime + 1.5);
      noise.stop(startTime + 0.4);

      scheduledNodesRef.current.push({
        stop: () => {
          oscillator.stop();
          noise.stop();
        },
      });
    },
    [],
  );

  const perform = useCallback(async () => {
    clearTimeouts();
    scheduledNodesRef.current.forEach(({ stop }) => stop());
    scheduledNodesRef.current = [];

    const ctx = await ensureAudioContext();
    const startAt = ctx.currentTime + 0.05;
    const subdivision = 0.5;
    const beatLength = 60 / activePattern.bpm;
    const stepDuration = beatLength * subdivision;

    setIsPerforming(true);

    activePattern.sequence.forEach((note, index) => {
      const when = startAt + index * stepDuration;
      pluckString(ctx, note.frequency, when, Boolean(note.accent));
      const delayMs = Math.max((when - ctx.currentTime) * 1000, 0);
      scheduleHighlight(delayMs, note.stringIndex, stepDuration * 700);
    });

    const totalDuration =
      activePattern.sequence.length * stepDuration * 1000 + 1200;
    const resetId = window.setTimeout(() => {
      setIsPerforming(false);
      setActiveString(null);
    }, totalDuration);
    timeoutsRef.current.push(resetId);
  }, [
    activePattern,
    clearTimeouts,
    ensureAudioContext,
    pluckString,
    scheduleHighlight,
  ]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl shadow-slate-900/50 backdrop-blur">
      <div className="absolute inset-x-12 -top-20 h-64 rounded-full bg-rose-500/40 blur-3xl" />
      <div className="absolute -inset-x-32 bottom-0 h-40 bg-gradient-to-t from-amber-500/30 blur-3xl" />
      <div className="relative grid gap-10 p-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/80">
            Steppe Stage
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            Обезьяна выводит домбровую партию
          </h2>
          <p className="mt-4 max-w-xl text-base text-slate-200/90 md:text-lg">
            Шелест шерсти, щелчок коготков по струнам, и вот степь заполняет
            танцующий тембр домбры. Выберите настроение и позвольте сцене
            ожить.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(Object.keys(PATTERNS) as PatternKey[]).map((key) => {
              const pattern = PATTERNS[key];
              const isActive = key === selectedPattern;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPattern(key)}
                  className={`group rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-1 ${
                    isActive
                      ? "border-amber-300/60 bg-amber-300/15 text-amber-100 shadow-[0_12px_50px_-15px_rgba(251,191,36,0.6)]"
                      : "border-white/10 bg-white/5 text-slate-100/80 hover:border-amber-200/40 hover:bg-amber-200/10"
                  }`}
                >
                  <span className="text-sm uppercase tracking-wide text-amber-200/70 group-hover:text-amber-100">
                    {pattern.title}
                  </span>
                  <p className="mt-2 text-sm text-slate-100/90">
                    {pattern.description}
                  </p>
                  <p className="mt-3 text-xs text-amber-100/70">
                    {pattern.bpm} BPM · {pattern.sequence.length} штрихов
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={perform}
              disabled={isPerforming}
              className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:bg-amber-200/40 disabled:text-amber-100/60"
            >
              {isPerforming ? "В процессе..." : "Сыграть партию"}
            </button>
            <span className="text-xs text-slate-200/70">
              Звук создаётся прямо в браузере с помощью Web Audio API.
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rotate-3 rounded-[36px] border border-white/5 bg-white/5 blur-md" />
          <div className="relative rounded-[32px] border border-white/15 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-inner shadow-black/40">
            <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-400">
              <span>Сцена</span>
              <span>Dombyra Jam</span>
            </div>
            <div className="relative isolate flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/80">
              <div className="absolute inset-3 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
              <div className="relative mt-4 flex w-4/5 max-w-[240px] flex-col items-center">
                <MonkeyFigure />
                <DombyraStrings activeString={activeString} />
              </div>
              <div className="absolute inset-x-6 bottom-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.45em] text-slate-400">
                {STRINGS.map((string) => (
                  <span key={string.label}>{string.label}</span>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-2 text-xs text-slate-200/80">
              <p className="font-semibold uppercase tracking-[0.35em] text-amber-100/80">
                Mood Mix
              </p>
              <p>
                {activePattern.title} · {activePattern.bpm} BPM ·{" "}
                {activePattern.sequence.length} акцентов
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MonkeyFigure() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative h-32 w-32">
        <div className="absolute left-1/2 top-4 -translate-x-1/2">
          <div className="h-6 w-6 rounded-full bg-amber-200 blur-sm" />
        </div>
        <div className="absolute inset-x-6 top-6 h-12 rounded-full bg-gradient-to-b from-amber-500 via-amber-400 to-amber-600 shadow-lg shadow-amber-900/30" />
        <div className="absolute inset-x-9 top-10 h-16 rounded-full bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950" />
        <div className="absolute inset-x-10 top-12 h-10 rounded-full bg-amber-200/80" />
        <div className="absolute left-[30%] top-12 h-3 w-3 rounded-full bg-amber-900" />
        <div className="absolute right-[30%] top-12 h-3 w-3 rounded-full bg-amber-900" />
        <div className="absolute left-1/2 top-16 h-2 w-8 -translate-x-1/2 rounded-full bg-amber-700" />
        <div className="absolute left-[12%] top-16 h-10 w-6 rotate-6 rounded-full bg-gradient-to-b from-amber-700 to-amber-500 shadow-inner shadow-amber-900/40" />
        <div className="absolute right-[12%] top-16 h-10 w-6 -rotate-6 rounded-full bg-gradient-to-b from-amber-700 to-amber-500 shadow-inner shadow-amber-900/40" />
      </div>
      <div className="relative mt-2 h-24 w-24">
        <div className="absolute inset-x-6 top-0 h-[88px] rounded-[40%] bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 shadow-lg shadow-amber-900/40" />
        <div className="absolute left-2 top-6 h-10 w-8 -rotate-12 rounded-full bg-amber-700 blur-[1px]" />
        <div className="absolute right-2 top-6 h-10 w-8 rotate-12 rounded-full bg-amber-700 blur-[1px]" />
        <div className="absolute left-1/2 top-16 h-14 w-14 -translate-x-1/2 rotate-6 rounded-full border-4 border-amber-300/80 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 shadow-inner shadow-amber-900/30" />
      </div>
    </div>
  );
}

function DombyraStrings({ activeString }: { activeString: number | null }) {
  return (
    <div className="mt-4 w-full">
      <div className="relative h-28 rounded-2xl border border-white/10 bg-slate-900/80">
        <div className="absolute inset-x-6 top-4 h-3 rounded-full bg-amber-200/70" />
        <div className="absolute inset-x-10 top-6 h-20 rounded-2xl border border-amber-100/50 bg-gradient-to-b from-amber-50/50 via-amber-100/60 to-amber-200/80 shadow-inner shadow-amber-900/30" />
        <div className="absolute inset-x-12 top-9 h-2 rounded-full bg-amber-500/70" />
        <div className="absolute inset-x-12 top-20 h-2 rounded-full bg-amber-500/60" />
        <div className="absolute inset-x-12 top-[4.5rem] h-2 rounded-full bg-amber-500/50" />
        <div className="absolute inset-x-14 top-10 h-[70px] rounded-full border border-amber-800/60 bg-gradient-to-b from-amber-500/80 via-amber-300/80 to-amber-200/80 shadow-inner shadow-black/40" />
        <div className="absolute inset-x-[4.5rem] top-4 h-20 rounded-full border border-amber-900/60 bg-gradient-to-b from-amber-900/80 to-amber-700/80" />

        {STRINGS.map((string, index) => {
          const isActive = activeString === index;
          return (
            <div
              key={string.label}
              className={`absolute inset-x-8 rounded-full ${
                index === 0
                  ? "top-14"
                  : index === 1
                    ? "top-[4.85rem]"
                    : "top-[5.9rem]"
              }`}
            >
              <div
                className={`h-1 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 transition ${
                  isActive ? "shadow-[0_0_25px_8px_rgba(251,191,36,0.5)]" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

