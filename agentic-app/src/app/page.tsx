import MonkeyStage from "@/components/MonkeyStage";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <BackgroundAurora />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-20 px-6 pb-20 pt-24 sm:px-10 lg:px-16">
        <HeroSection />
        <MonkeyStage />
        <InstrumentLore />
        <Stories />
      </main>
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-12 text-xs uppercase tracking-[0.28em] text-slate-400 sm:px-10 lg:px-16">
        Вдохновлено ритмами степи · Слушайте сердцем
      </footer>
    </div>
  );
}

function BackgroundAurora() {
  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.1),rgba(15,23,42,0.95))]" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.25),rgba(15,23,42,0))]" />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.18),rgba(15,23,42,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(244,63,94,0.12),rgba(15,23,42,0.9))]" />
      <div className="absolute inset-x-[10%] top-[20%] h-72 rounded-full bg-gradient-to-r from-amber-400/10 via-fuchsia-400/5 to-sky-400/10 blur-[120px]" />
      <div className="absolute inset-x-[35%] top-[35%] h-80 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-400/10 to-rose-400/15 blur-[140px]" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative grid gap-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 px-10 py-12 shadow-lg shadow-slate-900/40 backdrop-blur">
      <div className="absolute inset-0 rounded-3xl border border-white/10" />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
          Live From The Steppe
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
          Обезьяна играет на домбре
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-200/85 lg:text-xl">
          Под ритм ветра и шорохи листвы, смышленая обезьяна нашла свою
          домбру. Сцена сияет янтарём, струны звучат, и древний инструмент
          рассказывает новую историю.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FactCard
            title="Тембр"
            detail="Тёплые янтарные струны, мягкий сустейн"
            accent="Древесина саксаула"
          />
          <FactCard
            title="Настроение"
            detail="От рассветных медитаций до ярмарочного драйва"
            accent="3 авторских ритма"
          />
          <FactCard
            title="Исполнитель"
            detail="Обезьяна-перфекционист, тонкое чувство синкоп"
            accent="Школа 'Джунгли-джаз'"
          />
          <FactCard
            title="Легенда"
            detail="Степные сказители шепчут о новой звезде"
            accent="Эхо кочевников"
          />
        </div>
      </div>
    </section>
  );
}

function FactCard({
  title,
  detail,
  accent,
}: {
  title: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm shadow-inner shadow-slate-900/50 transition hover:-translate-y-1 hover:border-amber-200/50 hover:bg-amber-100/10">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-200/10 via-transparent to-sky-200/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
      <div className="relative space-y-3">
        <p className="text-xs uppercase tracking-[0.32em] text-amber-200/70">
          {title}
        </p>
        <p className="text-slate-100/90">{detail}</p>
        <p className="text-xs text-amber-100/80">{accent}</p>
      </div>
    </div>
  );
}

function InstrumentLore() {
  return (
    <section className="relative grid gap-10 rounded-3xl border border-white/10 bg-white/5 px-10 py-12 shadow-[0_35px_120px_-45px_rgba(8,47,73,0.9)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
          Dombyra DNA
        </p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Звук, что переплёл джунгли и степь
        </h2>
        <p className="text-base text-slate-100/80 md:text-lg">
          Домбра — двухструнная лютня, чьи вибрации веками звучали под ночным
          небом Тянь-Шаня. Теперь она пульсирует в лапах обезьяны, которая
          превратила струны в канат между мирами.
        </p>
        <ul className="grid gap-4 text-sm text-slate-200/90 md:grid-cols-2">
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <span className="text-xs uppercase tracking-[0.32em] text-amber-200/70">
              Резонатор
            </span>
            <p className="mt-2">
              Полый корпус усиливает низкие частоты, добавляя древесный
              оттенок каждому щипку.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <span className="text-xs uppercase tracking-[0.32em] text-amber-200/70">
              Струны
            </span>
            <p className="mt-2">
              Натянуты из кокосового волокна — дар джунглей, одомашненный
              степью.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <span className="text-xs uppercase tracking-[0.32em] text-amber-200/70">
              Ритмика
            </span>
            <p className="mt-2">
              Комбинация традиционных казахских рисунков и обезьяньих
              импровизаций.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <span className="text-xs uppercase tracking-[0.32em] text-amber-200/70">
              Публика
            </span>
            <p className="mt-2">
              Олени, верблюды, попугаи и случайные туристы — все ловят такт.
            </p>
          </li>
        </ul>
      </div>
      <div className="relative">
        <div className="absolute -inset-4 rounded-[36px] border border-white/10 bg-gradient-to-br from-amber-200/10 to-sky-300/20 blur-md" />
        <div className="relative rounded-[32px] border border-white/15 bg-slate-950/80 p-10 shadow-inner shadow-slate-900/80">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-100/70">
            Ритуал подготовки
          </p>
          <dl className="mt-7 space-y-6 text-sm text-slate-100/90">
            <div className="grid gap-2">
              <dt className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                1. Настроить каскадом
              </dt>
              <dd>
                Обезьяна прогоняет плавные глиссандо, пока струны не совпадут с
                песней ветра.
              </dd>
            </div>
            <div className="grid gap-2">
              <dt className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                2. Призвать ритм
              </dt>
              <dd>
                Лёгкий стук хвостом задаёт расстояние между ударами сердца и
                темпом домбры.
              </dd>
            </div>
            <div className="grid gap-2">
              <dt className="text-xs uppercase tracking-[0.35em] text-amber-200/80">
                3. Поделиться шёпотом
              </dt>
              <dd>
                Пару нот для луны — и можно начинать концерт для всех,
                кто слушает.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 px-10 py-12 shadow-2xl shadow-slate-900/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(250,204,21,0.1),transparent)]" />
      <div className="relative space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
              Истории со сцены
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Хроники ночных выступлений
            </h2>
          </div>
          <p className="max-w-xl text-sm text-slate-200/80 md:text-base">
            Каждое выступление — новая легенда. Ведите дневник впечатлений,
            чтобы не забыть, как домбра звучала именно этой ночью.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <StoryCard
            title="Лунный дуэт"
            detail="Вместе с ветром, что спускался с гор, обезьяна сыграла нежный дуэт, напоминающий о далёких островах."
            timestamp="Ночь шестнадцатой луны"
          />
          <StoryCard
            title="Степная ярмарка"
            detail="Верблюды притоптывали, а дети хлопали в ладоши под бешеный ритм «Праздничного наигрыша»."
            timestamp="Полдень каравана"
          />
          <StoryCard
            title="Тишина после бури"
            detail="Когда дождь прекратился, остались только две струны — ими обезьяна вывела новую мелодию надежды."
            timestamp="После грозы"
          />
        </div>
      </div>
    </section>
  );
}

function StoryCard({
  title,
  detail,
  timestamp,
}: {
  title: string;
  detail: string;
  timestamp: string;
}) {
  return (
    <article className="relative rounded-2xl border border-white/10 bg-white/5 p-6 text-sm shadow-lg shadow-slate-900/60 transition hover:-translate-y-1 hover:border-amber-200/50 hover:bg-amber-100/10">
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/15 via-transparent to-rose-200/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
      <div className="relative space-y-3">
        <p className="text-xs uppercase tracking-[0.32em] text-amber-200/80">
          {timestamp}
        </p>
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <p className="text-slate-100/85">{detail}</p>
      </div>
    </article>
  );
}
