"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JourneyStep } from "@/app/guide-core/types";
import { curvePoint, routeNodes, TRANSPORT_LABELS } from "@/app/guide-core/journeyPlayback";
import TransportIcon, { TransportGlyph } from "./TransportIcon";
import styles from "./journey.module.css";

export default function RouteRibbon({ steps, index, progress, playing, reducedMotion, onSelect, onInteract }: {
  steps: JourneyStep[]; index: number; progress: number; playing: boolean; reducedMotion: boolean;
  onSelect: (index: number) => void; onInteract: () => void;
}) {
  const scroll = useRef<HTMLDivElement>(null);
  const framedLeg = useRef("");
  const [compact, setCompact] = useState(false);
  const route = useMemo(() => routeNodes(steps), [steps]);
  const gap = compact ? 180 : 240;
  const point = (i: number): [number, number] => [98 + i * gap, 101];
  const leg = route.legs[index];
  const from = point(leg.from);
  const to = point(leg.to);
  const displayProgress = reducedMotion ? (progress >= 1 ? 1 : 0) : progress;
  const traveler = curvePoint(from, to, displayProgress);
  const current = steps[index];
  const width = Math.max(350, 196 + (route.nodes.length - 1) * gap);

  useEffect(() => {
    const element = scroll.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 550));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = scroll.current;
    if (!element) return;
    const frameKey = `${leg.from}-${gap}`;
    if (!playing && framedLeg.current === frameKey) return;
    framedLeg.current = frameKey;
    const left = 98 + leg.from * gap;
    const halfNode = compact ? 85 : 98;
    const inset = Math.max(24, Math.min(98, (element.clientWidth - gap) / 2, element.clientWidth - gap - halfNode));
    // Reframe once at a stop boundary, never on pause, speed changes or every frame.
    if (left < element.scrollLeft + 24 || left + gap + halfNode > element.scrollLeft + element.clientWidth) {
      element.scrollTo({ left: Math.max(0, left - inset), behavior: reducedMotion ? "instant" : "smooth" });
    }
  }, [leg.from, gap, compact, reducedMotion, playing]);

  const path = (a: [number, number], b: [number, number]) => `M ${a[0]} ${a[1]} C ${(a[0] + b[0]) / 2} ${a[1]}, ${(a[0] + b[0]) / 2} ${b[1]}, ${b[0]} ${b[1]}`;
  return <div className={styles.ribbonScroll} data-compact={compact} ref={scroll} onPointerDown={onInteract} onWheel={onInteract} aria-label="当天路线：节点左侧到达时间，右侧出发时间，连接线上是交通方式">
    <div className={styles.ribbonCanvas} style={{ width }}>
      <svg width={width} height="350" className={styles.ribbonSvg} aria-hidden="true">
        {route.legs.map((item, i) => <g key={i}>
          <path d={path(point(item.from), point(item.to))} fill="none" stroke={i < index ? "#355c45" : "#c8d2c1"} strokeWidth="3" />
          <path d={`M ${point(item.to)[0] - 29} 97 l 5 4 l -5 4`} fill="none" stroke={i < index ? "#355c45" : "#8a9d80"} strokeWidth="2" />
        </g>)}
        <path d={path(from, to)} fill="none" stroke="#dd622f" strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - displayProgress} />
      </svg>
      {route.legs.map((item, i) => <button key={i} type="button" data-route-transport={i} data-in-transit={i === index && progress > 0 && progress < 1} className={`${styles.routeTransport} ${i === index ? styles.activeTransport : ""}`} style={{ left: (point(item.from)[0] + point(item.to)[0]) / 2, top: 101 }} onClick={() => onSelect(i)} aria-label={`${steps[i].from.name} 到 ${steps[i].to.name}：${steps[i].transportModes.map((mode) => TRANSPORT_LABELS[mode]).join("、")}`} title={`${steps[i].duration}；${steps[i].route}`}>
        {steps[i].transportModes.map((mode) => <span key={mode}><TransportIcon mode={mode} size={15} />{TRANSPORT_LABELS[mode]}</span>)}
      </button>)}
      {(playing || progress > 0) && <svg width={width} height="350" className={styles.travelerSvg} aria-hidden="true">
        <g transform={`translate(${traveler[0]}, ${traveler[1]})`} data-traveler-progress={progress.toFixed(3)}>
          <rect x={current.transportModes.length > 1 ? -35 : -23} y="-23" width={current.transportModes.length > 1 ? 70 : 46} height="46" rx="23" fill="#dd622f" stroke="#fffdf8" strokeWidth="4" />
          {current.transportModes.slice(0, 2).map((mode, i, all) => <g key={mode} transform={`translate(${all.length > 1 ? -25 + i * 27 : -12}, -12)`} fill="none" stroke="white" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"><TransportGlyph mode={mode} /></g>)}
        </g>
      </svg>}
      {route.nodes.map(({ point: place, stepIndex, incomingStepIndex, outgoingStepIndex }, i) => {
        const incoming = incomingStepIndex === undefined ? undefined : steps[incomingStepIndex];
        const outgoing = outgoingStepIndex === undefined ? undefined : steps[outgoingStepIndex];
        const media = incoming ? incoming.media : outgoing?.fromMedia;
        const arrival = incoming?.arrivalTime ?? (i === 0 ? "当日起点" : "分段起点");
        const departure = outgoing?.departureTime ?? (i === route.nodes.length - 1 ? "当日结束" : "分段结束");
        const active = i === leg.to;
        return <div key={`${place.id}-${i}`} data-route-node={place.id} className={`${styles.ribbonStop} ${active ? styles.activeStop : ""} ${i <= leg.from ? styles.visitedStop : ""}`} style={{ left: point(i)[0] }}>
          <button type="button" className={styles.nodeSelect} onClick={() => onSelect(stepIndex)} aria-label={`${i + 1}. ${place.name}，到达 ${arrival}，出发 ${departure}`} aria-current={active ? "step" : undefined}>
            <span className={styles.nodeTimes}>
              <span data-node-arrival title={incoming?.arrivalPlan}><small>到达</small><strong>{arrival}</strong></span>
              <span data-node-departure title={outgoing?.departurePlan}><small>出发</small><strong>{departure}</strong></span>
            </span>
            <span className={styles.stopDot}>{i + 1}</span>
            <span className={styles.stopName}>{place.name}</span>
          </button>
          <figure className={styles.nodePhoto} data-node-photo>
            <button type="button" className={styles.thumbnail} onClick={() => onSelect(stepIndex)} aria-label={`查看 ${place.name} 的行程与照片`}>
              {media
                // eslint-disable-next-line @next/next/no-img-element -- configuration-owned credited local images
                ? <img src={media.src} alt={media.alt} width="160" height="90" loading="lazy" style={{ objectPosition: media.objectPosition }} />
                : <span>实景照片待补</span>}
            </button>
            <figcaption>{media ? <><span title={media.caption}>{media.label}</span><a href={media.sourceHref} target="_blank" rel="noreferrer" title={`${media.credit} · ${media.license}`}>{media.credit} · {media.license} ↗</a></> : <span>未使用其他地点代图</span>}</figcaption>
          </figure>
        </div>;
      })}
    </div>
    <span className={styles.srOnly}>{current.from.name} 至 {current.to.name}，{current.transportModes.map((mode) => TRANSPORT_LABELS[mode]).join("、")}</span>
  </div>;
}
