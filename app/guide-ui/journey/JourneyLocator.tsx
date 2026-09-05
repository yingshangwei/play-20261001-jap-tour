"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type { JourneyStep } from "@/app/guide-core/types";
import styles from "./journey.module.css";

/** Geographic context only. No invented road/rail geometry on the real basemap. */
export default function JourneyLocator({ step, onInteract }: { step: JourneyStep; onInteract: () => void }) {
  const element = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const interact = useRef(onInteract);
  useEffect(() => { interact.current = onInteract; }, [onInteract]);

  useEffect(() => {
    let disposed = false;
    let observer: ResizeObserver | undefined;
    async function setup() {
      try {
        const L = await import("leaflet");
        if (disposed || !element.current) return;
        const map = L.map(element.current, { zoomControl: false, scrollWheelZoom: false });
        mapRef.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        map.on("dragstart", () => interact.current());
        observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
        observer.observe(element.current);
        setReady(true);
      } catch { if (!disposed) setError(true); }
    }
    void setup();
    return () => { disposed = true; observer?.disconnect(); mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    void import("leaflet").then((L) => {
      const map = mapRef.current;
      if (!map || disposed) return;
      layer.current?.remove();
      layer.current = L.layerGroup().addTo(map);
      [step.from, step.to].forEach((place, i) => {
        const label = document.createElement("span");
        label.textContent = `${i === 0 ? "出发" : "目的地"} · ${place.name}`;
        L.circleMarker(place.position, { radius: i ? 9 : 6, color: "#fffdf8", weight: 3, fillColor: i ? "#dd622f" : "#355c45", fillOpacity: 1 })
          .bindTooltip(label, { permanent: true, direction: i ? "top" : "bottom", offset: [0, i ? -10 : 10] }).addTo(layer.current!);
      });
      // The camera changes only with the leg; no motion during reading or resume.
      map.fitBounds(L.latLngBounds([step.from.position, step.to.position]), { padding: [70, 65], maxZoom: 14, animate: false });
    });
    return () => { disposed = true; };
  }, [ready, step]);

  return <div className={styles.locatorWrap}>
    <div ref={element} className={styles.locator} onPointerDown={onInteract} aria-label={`真实地图定位：${step.from.name} 至 ${step.to.name}`} />
    {error && <p className={styles.mapError}>地图暂未加载，请切回路线示意或打开 Google Maps。</p>}
    <p className={styles.locatorNote}>仅显示真实位置；不连线、不模拟道路或铁轨。拖动地图会暂停播放。</p>
  </div>;
}
