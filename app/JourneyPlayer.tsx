"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { GuideDayId, JourneyModel } from "@/app/guide-core/types";
import { INITIAL_PLAYBACK, playbackReducer, stepDuration, travelProgress, TRANSPORT_LABELS } from "@/app/guide-core/journeyPlayback";
import RouteRibbon from "@/app/guide-ui/journey/RouteRibbon";
import JourneyLocator from "@/app/guide-ui/journey/JourneyLocator";
import TransportIcon from "@/app/guide-ui/journey/TransportIcon";
import styles from "@/app/guide-ui/journey/journey.module.css";

export default function JourneyPlayer({ model }: { model: JourneyModel }) {
  if (!model.steps.length) return <section id="journey" className={styles.empty}>暂无可播放的行程。</section>;
  return <Player model={model} />;
}

function Player({ model }: { model: JourneyModel }) {
  const presentation = model.presentation;
  const labels = presentation.labels;
  const [scope, setScope] = useState<"all" | GuideDayId>("all");
  const [state, dispatch] = useReducer(playbackReducer, INITIAL_PLAYBACK);
  const [speed, setSpeed] = useState(1);
  const [view, setView] = useState<"ribbon" | "map">("ribbon");
  const [reducedMotion, setReducedMotion] = useState(false);
  const section = useRef<HTMLElement>(null);
  const dayStrip = useRef<HTMLDivElement>(null);
  const visibleSteps = useMemo(() => scope === "all" ? model.steps : model.steps.filter((step) => step.date === scope), [model.steps, scope]);
  const durations = useMemo(() => visibleSteps.map(stepDuration), [visibleSteps]);
  const currentIndex = Math.min(state.index, visibleSteps.length - 1);
  const current = visibleSteps[currentIndex];
  const day = model.days.find((item) => item.id === current.date)!;
  const daySteps = useMemo(() => visibleSteps.filter((step) => step.date === current.date), [visibleSteps, current.date]);
  const dayIndex = daySteps.indexOf(current);
  const movement = travelProgress(state.elapsed);
  const arrived = movement >= 1;
  const ended = currentIndex === visibleSteps.length - 1 && state.elapsed >= durations[currentIndex];
  const phase = ended ? "播放完毕" : arrived ? "到达 · 停留" : state.elapsed > 0 ? (state.playing ? "行进中" : "行进已暂停") : "准备出发";
  const currentMedia = current.media;
  const next = visibleSteps[currentIndex + 1];
  const progress = (currentIndex + state.elapsed / durations[currentIndex]) / visibleSteps.length * 100;
  const arrivalTime = current.arrivalTime;
  const departureLabel = current.departureTime;
  const pause = () => dispatch({ type: "pause" });
  const selectStep = (index: number) => dispatch({ type: "select", index });
  const selectDayStep = (index: number) => selectStep(visibleSteps.indexOf(daySteps[index]));

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    const visibility = () => { if (document.hidden) dispatch({ type: "pause" }); };
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) dispatch({ type: "pause" }); });
    if (section.current) observer.observe(section.current);
    return () => { query.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!state.playing) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      dispatch({ type: "tick", delta: now - previous, speed, durations });
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state.playing, speed, durations]);

  useEffect(() => {
    visibleSteps.slice(currentIndex, currentIndex + 3).forEach((step) => {
      if (step.media) { const image = new window.Image(); image.src = step.media.src; }
    });
  }, [visibleSteps, currentIndex]);

  useEffect(() => {
    const strip = dayStrip.current;
    const active = strip?.querySelector<HTMLElement>("[data-current-day=true]");
    if (!strip || !active) return;
    const relative = active.getBoundingClientRect().left - strip.getBoundingClientRect().left;
    if (relative < 0 || relative + active.clientWidth > strip.clientWidth) strip.scrollTo({ left: strip.scrollLeft + relative - 12, behavior: reducedMotion ? "instant" : "smooth" });
  }, [current.date, reducedMotion]);

  return <section ref={section} className={styles.player} id="journey" aria-labelledby="journey-title" data-player-step={current.id} data-player-phase={arrived ? "stay" : "travel"} data-player-elapsed={Math.round(state.elapsed)} data-player-playing={state.playing}>
    <header className={`${styles.heading} shell`}>
      <h2 id="journey-title">旅程播放</h2>
      <p>{model.phaseSummary}</p>
    </header>
    <div className={`${styles.workspace} shell`}>
      <div ref={dayStrip} className={styles.dayScroller} role="group" aria-label={labels.daySelectorAriaLabel}>
        <button type="button" aria-pressed={scope === "all"} onClick={() => { setScope("all"); selectStep(0); }}><small>{labels.allDaysCode}</small><span>{labels.allDays}</span></button>
        {model.days.map((item, i) => <button type="button" key={item.id} disabled={!model.steps.some((step) => step.date === item.id)} data-current-day={item.id === current.date} aria-pressed={scope === item.id} className={item.id === current.date ? styles.currentDay : undefined} onClick={() => { setScope(item.id); selectStep(0); }}>
          <small>{item.id} <span>DAY {i + 1}</span></small><span>{item.areaLabel}</span>
        </button>)}
      </div>

      <div className={styles.board}>
        <div className={styles.scene}>
          <div className={styles.sceneToolbar}>
            <span className={styles.chapter}>DAY {model.days.indexOf(day) + 1} <b>{current.date}</b><small>{day.weekday}</small></span>
            <div className={styles.viewTabs} role="group" aria-label="路线展示方式">
              <button type="button" aria-pressed={view === "ribbon"} onClick={() => setView("ribbon")}>路线示意</button>
              <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>真实地图</button>
            </div>
          </div>
          <div className={styles.sceneTitle}><span>{day.areaLabel}</span><h3>{day.title}</h3><p>{view === "ribbon" ? "左侧到达 · 右侧出发 · 线上交通；横向滑动看完整一天。时间为行程参考，路线不按地理比例。" : "查看这段的起终点位置。准确道路、轨道和换乘请打开逐段导航。"}</p></div>
          {view === "ribbon"
            ? <RouteRibbon key={current.date} steps={daySteps} index={dayIndex} progress={movement} playing={state.playing} reducedMotion={reducedMotion} onSelect={selectDayStep} onInteract={pause} />
            : <JourneyLocator step={current} onInteract={pause} />}
          <div className={styles.controlsPanel}>
            <div className={styles.controls} role="group" aria-label={labels.controlsAriaLabel}>
              <button type="button" aria-label={labels.previousAriaLabel} disabled={currentIndex === 0} onClick={() => selectStep(currentIndex - 1)}>←</button>
              <button type="button" className={styles.playButton} onClick={() => dispatch({ type: "toggle", durations })}><span aria-hidden="true">{state.playing ? "Ⅱ" : "▶"}</span>{state.playing ? labels.pause : ended ? labels.replay : state.elapsed > 0 ? "继续播放" : labels.play}</button>
              <button type="button" aria-label={labels.nextAriaLabel} disabled={currentIndex === visibleSteps.length - 1} onClick={() => selectStep(currentIndex + 1)}>→</button>
              <label className={styles.speed}>{labels.speedAriaLabel}<select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label={labels.speedAriaLabel}>{[.75, 1, 1.5, 2].map((value) => <option key={value} value={value}>{value}×</option>)}</select></label>
            </div>
            <div className={styles.progressMeta}><span>{phase} · {dayIndex + 1}/{daySteps.length} 段</span><span>{labels.progress} {currentIndex + 1}/{visibleSteps.length}</span></div>
            <div className={styles.progressTrack} role="progressbar" aria-label="播放进度" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${progress}%` }} /></div>
            <label className={styles.seek}><span>跳到指定阶段</span><input aria-label={labels.stepSelectorAriaLabel} type="range" min={0} max={visibleSteps.length - 1} value={currentIndex} onChange={(event) => selectStep(Number(event.target.value))} /></label>
            <small className={styles.previewNote}>1× 每段约 11–14 秒，含到达后的阅读时间；并非真实车速。</small>
          </div>
          <div className={styles.mobileStay}><span>{current.transportModes.map((mode) => TRANSPORT_LABELS[mode]).join(" + ")} · {current.duration}</span><p>{labels.stay}：{current.stayPlan}</p></div>
          <div className={styles.nextUp}><span>{ended ? "旅程收束" : "接下来"}</span><p>{next ? <>{next.date !== current.date && <b>{next.date} · </b>}{next.departureTime} · {next.from.name} → {next.to.name}</> : ended ? "已到本次播放的最后一站。可切换日期或重新播放。" : "这是本次播放的最后一段，抵达后会自动停止。"}</p></div>
        </div>

        <article className={styles.detail}>
          <figure className={styles.photo} data-journey-photo>
            {currentMedia ? <>
              {/* Keep source, licence and area-placeholder labels attached to real photos. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentMedia.src} key={currentMedia.src} alt={currentMedia.alt} width={960} height={640} decoding="async" style={{ objectPosition: currentMedia.objectPosition }} />
              <figcaption><span>{currentMedia.label}</span><strong>{current.to.name}</strong><small>{currentMedia.caption}</small><a href={currentMedia.sourceHref} target="_blank" rel="noreferrer">{labels.photoCredit}：{currentMedia.credit} · {currentMedia.license} ↗</a></figcaption>
            </> : <figcaption className={styles.noPhoto}><TransportIcon mode={current.transportModes[0]} size={42} /><span>目的地照片待补</span><strong>{current.to.name}</strong><small>保留空位，不用其他地点照片代替。</small></figcaption>}
          </figure>
          <div className={styles.detailBody}>
            <div className={styles.phaseLine}><span>{arrived ? "已抵达" : labels.destination}</span><small>{current.timingStatus}</small></div>
            <h3>{current.to.name}</h3>
            {current.placeholderLabel && <p className={styles.placeholder}>{current.placeholderLabel} · 待最终确认</p>}
            <div className={styles.timePair}><div><small>计划出发</small><strong data-range={departureLabel.length > 8}>{departureLabel}</strong></div><span aria-hidden="true">→</span><div><small>抵达时间参考</small><strong data-range={arrivalTime.length > 8}>{arrivalTime}</strong></div></div>
            <p className={styles.from}>从 {current.from.name}</p>
            <div className={styles.transport}>{current.transportModes.map((mode) => <span key={mode}><TransportIcon mode={mode} />{TRANSPORT_LABELS[mode]}</span>)}<small>{current.duration}</small></div>
            <div className={`${styles.stay} ${arrived ? styles.stayActive : ""}`}><span>{labels.stay}</span><p>{current.stayPlan}</p></div>
            <details className={styles.details} key={current.id} onToggle={(event) => { if (event.currentTarget.open) pause(); }}>
              <summary>班次、换乘与时间说明 <span>＋</span></summary>
              <dl><dt>{labels.departure}</dt><dd>{current.departurePlan}</dd><dt>{labels.arrival}</dt><dd>{current.arrivalPlan}</dd><dt>{labels.route}</dt><dd>{current.route}</dd></dl>
              <p>{current.segmentNote}</p>
            </details>
            {current.navigationHref && <a className={styles.navigation} href={current.navigationHref} target="_blank" rel="noreferrer" onClick={pause}>{labels.navigation}</a>}
          </div>
        </article>
      </div>
      <details className={styles.dayOverview} onToggle={(event) => { if (event.currentTarget.open) pause(); }}>
        <summary>跳到某一段 · {current.date} · {daySteps.length} 段</summary>
        <ol aria-label={labels.nearbyStepsAriaLabel}>{daySteps.map((step, i) => <li key={step.id}><button type="button" aria-current={i === dayIndex ? "step" : undefined} onClick={() => selectDayStep(i)}><small>{String(i + 1).padStart(2, "0")} <b>{step.departureTime}</b></small><strong>{step.from.name} → {step.to.name}</strong><span>{step.mode}</span></button></li>)}</ol>
      </details>
    </div>
    <p className={styles.srOnly} aria-live="polite">{current.date}，{current.from.name} 前往 {current.to.name}，{arrived ? "已到达，" : ""}{current.arrivalPlan}</p>
  </section>;
}
