"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import type { GuideDayId, JourneyModel, JourneyStep } from "@/app/guide-core/types";

type PlayerScope = "all" | GuideDayId;

function statusClass(status: JourneyStep["timingStatus"]) {
  return status === "已核班次" ? "verified" : status === "部分核实" ? "partial" : "estimated";
}

export default function JourneyPlayer({ model }: { model: JourneyModel }) {
  const journeySteps = model.steps;
  const presentation = model.presentation;
  const dayOrder = useMemo(() => model.days.map((day) => day.id), [model.days]);
  const dayById = useMemo(() => new Map(model.days.map((day) => [day.id, day])), [model.days]);
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const routeLayer = useRef<LayerGroup | null>(null);
  const travelerMarker = useRef<Marker | null>(null);
  const animationFrame = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [scope, setScope] = useState<PlayerScope>("all");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const visibleSteps = useMemo(
    () => scope === "all" ? journeySteps : journeySteps.filter((step) => step.date === scope),
    [journeySteps, scope],
  );
  const currentIndex = Math.min(stepIndex, visibleSteps.length - 1);
  const currentStep = visibleSteps[currentIndex];
  const progress = ((currentIndex + 1) / visibleSteps.length) * 100;
  const currentDayStep = visibleSteps.slice(0, currentIndex + 1).filter((step) => step.date === currentStep.date).length;
  const currentDayTotal = visibleSteps.filter((step) => step.date === currentStep.date).length;
  const recentSteps = visibleSteps.slice(Math.max(0, currentIndex - 2), Math.min(visibleSteps.length, currentIndex + 3));

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    let disposed = false;
    async function setupMap() {
      if (!mapElement.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;
      leafletRef.current = L;
      const map = L.map(mapElement.current, {
        center: presentation.map.center,
        zoom: presentation.map.zoom,
        scrollWheelZoom: true,
        touchZoom: true,
        zoomControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstance.current = map;
      setMapReady(true);
    }
    setupMap();
    return () => {
      disposed = true;
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      mapInstance.current?.remove();
      mapInstance.current = null;
      leafletRef.current = null;
      routeLayer.current = null;
      travelerMarker.current = null;
    };
  }, [presentation.map.center, presentation.map.zoom]);

  useEffect(() => {
    if (!playing) return;
    const delay = 3200 / speed;
    const timer = window.setTimeout(() => {
      if (currentIndex >= visibleSteps.length - 1) {
        setPlaying(false);
        return;
      }
      setStepIndex((index) => index + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [currentIndex, playing, speed, visibleSteps.length]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstance.current;
    if (!L || !map || !mapReady || !currentStep) return;

    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    routeLayer.current?.remove();
    const layer = L.layerGroup().addTo(map);
    routeLayer.current = layer;

    visibleSteps.slice(0, currentIndex).forEach((step) => {
      L.polyline([step.from.position, step.to.position], {
        color: "#355c45",
        weight: 3,
        opacity: .28,
        lineCap: "round",
      }).addTo(layer);
    });

    L.polyline([currentStep.from.position, currentStep.to.position], {
      color: "#ef6a39",
      weight: 5,
      opacity: .95,
      dashArray: "9 10",
      lineCap: "round",
    }).addTo(layer);
    L.circleMarker(currentStep.from.position, {
      radius: 6,
      color: "#fffdf8",
      weight: 3,
      fillColor: "#355c45",
      fillOpacity: 1,
    }).bindTooltip(currentStep.from.name).addTo(layer);
    L.circleMarker(currentStep.to.position, {
      radius: 8,
      color: "#fffdf8",
      weight: 3,
      fillColor: "#f5b94c",
      fillOpacity: 1,
    }).bindTooltip(currentStep.to.name).addTo(layer);

    const icon = L.divIcon({
      className: "journey-traveler-icon",
      html: `<span>${currentStep.icon}</span>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });
    const marker = L.marker(currentStep.from.position, { icon, interactive: false, keyboard: false }).addTo(layer);
    travelerMarker.current = marker;

    const bounds = L.latLngBounds([currentStep.from.position, currentStep.to.position]);
    map.fitBounds(bounds, { padding: [58, 58], maxZoom: 13, animate: !reducedMotion.current, duration: .65 });

    if (reducedMotion.current) {
      marker.setLatLng(currentStep.to.position);
      return;
    }

    const startedAt = performance.now();
    const animationDuration = Math.max(520, (playing ? 1500 : 900) / speed);
    const animate = (now: number) => {
      const raw = Math.min((now - startedAt) / animationDuration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      marker.setLatLng([
        currentStep.from.position[0] + (currentStep.to.position[0] - currentStep.from.position[0]) * eased,
        currentStep.from.position[1] + (currentStep.to.position[1] - currentStep.from.position[1]) * eased,
      ]);
      if (raw < 1) animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
  }, [currentIndex, currentStep, mapReady, playing, speed, visibleSteps]);

  function selectScope(nextScope: PlayerScope) {
    setPlaying(false);
    setScope(nextScope);
    setStepIndex(0);
  }

  function togglePlaying() {
    if (currentIndex >= visibleSteps.length - 1) setStepIndex(0);
    setPlaying((value) => !value);
  }

  function moveStep(delta: number) {
    setPlaying(false);
    setStepIndex((index) => Math.max(0, Math.min(visibleSteps.length - 1, index + delta)));
  }

  return (
    <section className="journey-player" id="journey" aria-labelledby="journey-title">
      <div className="journey-player-heading shell">
        <div>
          <p className="eyebrow">{presentation.eyebrow}</p>
          <span className="section-note">{model.phaseSummary}</span>
        </div>
        <div>
          <h2 id="journey-title">{presentation.titleLines.map((line, index) => <span key={line}>{line}{index < presentation.titleLines.length - 1 && <br />}</span>)}</h2>
          <p>{presentation.description}</p>
        </div>
      </div>

      <div className="journey-player-frame shell">
        <div className="journey-map-stage">
          <div className="journey-map" ref={mapElement} aria-label={presentation.map.ariaLabel} />
          <div className="journey-map-caption">
            <span>{currentStep.date} · {dayById.get(currentStep.date)?.weekday}</span>
            <strong>{dayById.get(currentStep.date)?.title}</strong>
            <small>{presentation.map.note}</small>
          </div>
        </div>

        <div className="journey-console">
          <div className="journey-day-scroller" aria-label={presentation.labels.daySelectorAriaLabel}>
            <button type="button" className={scope === "all" ? "active" : ""} onClick={() => selectScope("all")}>
              <small>{presentation.labels.allDaysCode}</small><span>{presentation.labels.allDays}</span>
            </button>
            {dayOrder.map((date) => (
              <button type="button" className={scope === date ? "active" : ""} onClick={() => selectScope(date)} key={date}>
                <small>{date}</small><span>{dayById.get(date)?.areaLabel}</span>
              </button>
            ))}
          </div>

          <div className="journey-progress-block">
            <div><span>{presentation.labels.progress}</span><strong>{currentIndex + 1} / {visibleSteps.length}</strong></div>
            <div className="journey-progress-track" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
            <input aria-label={presentation.labels.stepSelectorAriaLabel} type="range" min="0" max={visibleSteps.length - 1} value={currentIndex} onChange={(event) => {
              setPlaying(false);
              setStepIndex(Number(event.target.value));
            }} />
          </div>

          <article className="journey-current-card" aria-live="polite">
            <div className="journey-step-topline">
              <span>{presentation.labels.day} {dayOrder.indexOf(currentStep.date) + 1} · {presentation.labels.step} {currentDayStep}/{currentDayTotal}</span>
              <em className={`timing-status status-${statusClass(currentStep.timingStatus)}`}>{currentStep.timingStatus}</em>
            </div>
            <div className="journey-clock">{currentStep.departureTime}</div>
            <p className="journey-segment-label">{currentStep.segment}</p>
            <div className="journey-place-line">
              <strong>{currentStep.from.name}</strong>
              <span><i>{currentStep.icon}</i>{currentStep.mode}<small>{currentStep.duration}</small></span>
              <strong>{currentStep.to.name}</strong>
            </div>
            {currentStep.placeholderLabel && <span className="journey-placeholder">{currentStep.placeholderLabel}</span>}
            <dl className="journey-step-facts">
              <div><dt>{presentation.labels.departure}</dt><dd>{currentStep.departurePlan}</dd></div>
              <div><dt>{presentation.labels.arrival}</dt><dd>{currentStep.arrivalPlan}</dd></div>
              <div><dt>{presentation.labels.stay}</dt><dd>{currentStep.stayPlan}</dd></div>
              <div><dt>{presentation.labels.route}</dt><dd>{currentStep.route}</dd></div>
            </dl>
            <p className="journey-step-note">{currentStep.segmentNote}</p>
            {currentStep.navigationHref && <a className="journey-nav-link" href={currentStep.navigationHref} target="_blank" rel="noreferrer">{presentation.labels.navigation}</a>}
          </article>

          <div className="journey-controls" aria-label={presentation.labels.controlsAriaLabel}>
            <button type="button" onClick={() => moveStep(-1)} disabled={currentIndex === 0} aria-label={presentation.labels.previousAriaLabel}>←</button>
            <button type="button" className="journey-play" onClick={togglePlaying}>{playing ? presentation.labels.pause : currentIndex === visibleSteps.length - 1 ? presentation.labels.replay : presentation.labels.play}</button>
            <button type="button" onClick={() => moveStep(1)} disabled={currentIndex === visibleSteps.length - 1} aria-label={presentation.labels.nextAriaLabel}>→</button>
            <div className="journey-speed" aria-label={presentation.labels.speedAriaLabel}>
              {[1, 2, 4].map((value) => <button type="button" className={speed === value ? "active" : ""} onClick={() => setSpeed(value)} key={value}>{value}×</button>)}
            </div>
          </div>

          <ol className="journey-mini-log" aria-label={presentation.labels.nearbyStepsAriaLabel}>
            {recentSteps.map((step) => {
              const absoluteIndex = visibleSteps.indexOf(step);
              const state = absoluteIndex < currentIndex ? "done" : absoluteIndex === currentIndex ? "current" : "upcoming";
              return <li className={state} key={step.id}>
                <button type="button" onClick={() => { setPlaying(false); setStepIndex(absoluteIndex); }}>
                  <span>{step.departureTime}</span>
                  <strong>{step.from.name} → {step.to.name}</strong>
                  <small>{step.mode}</small>
                </button>
              </li>;
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
