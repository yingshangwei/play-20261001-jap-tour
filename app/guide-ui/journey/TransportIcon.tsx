import type { TransportMode } from "@/app/guide-core/types";

/** Small functional pictograms, shared by the route and the transport summary. */
export function TransportGlyph({ mode }: { mode: TransportMode }) {
  switch (mode) {
    case "walk": return <><circle cx="14" cy="4" r="2" /><path d="m7 21 3-6-1-5 4-3 3 5 4 1M10 10l-5 3M10 15l5 2 1 4M13 7l1 5" /></>;
    case "flight": return <path d="m3 12 7 2-1 7 3-2 2-5 6-5c3-3 1-5-2-2l-6 4-5-2-3 2 6 3-4 4-3-1z" />;
    case "taxi": return <><path d="m3 11 2-6h14l2 6v8h-3v-3H6v3H3zM3 11h18M10 5V2h4v3" /><path d="M6 14h2m8 0h2" /></>;
    case "bus": return <><rect x="4" y="3" width="16" height="17" rx="3" /><path d="M4 12h16M8 3v9m8-9v9M7 16h2m6 0h2M7 20v2m10-2v2" /></>;
    case "cable-car": return <><path d="M2 4 22 1M12 3v5M8 8h8l4 5v8H4v-8zM4 15h16M9 8v7m6-7v7" /></>;
    case "high-speed-train": return <><path d="M3 17c0-6 6-13 12-13h4v13H3Zm2-6h14M10 4l-4 7M3 21h18" /><circle cx="8" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>;
    case "metro": return <><path d="M2 21V10a10 10 0 0 1 20 0v11" /><rect x="6" y="6" width="12" height="13" rx="3" /><path d="M6 12h12M8 22l2-3m6 3-2-3M9 16h1m4 0h1" /></>;
    default: return <><rect x="5" y="2" width="14" height="17" rx="4" /><path d="M5 11h14M12 2v9M8 22l2-3m6 3-2-3M8 15h1m6 0h1" /></>;
  }
}

export default function TransportIcon({ mode, size = 24 }: { mode: TransportMode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><TransportGlyph mode={mode} /></svg>;
}
