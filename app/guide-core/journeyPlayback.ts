import type { JourneyPoint, JourneyStep, TransportMode } from "./types";

export function resolveTransportModes(mode: string, route = "", explicit?: TransportMode[]): TransportMode[] {
  if (explicit?.length) return [...explicit];
  if (/航班|飞机|flight/i.test(mode)) return ["flight"];
  if (/高铁|新干线|high.speed/i.test(mode)) return ["high-speed-train"];
  if (/打车|出租|taxi/i.test(mode)) return ["taxi"];
  if (/缆车/.test(mode)) return ["cable-car", "walk"];
  if (/铁路.*巴士/.test(mode)) return ["train", "bus"];
  if (/公交|巴士|bus/i.test(mode)) return ["bus"];
  if (/步行|walk/i.test(mode)) return ["walk"];
  if (/地铁|metro|subway/i.test(mode)) return ["metro"];
  // Ordinary JR / private rail is not high-speed rail. Mixed rail remains generic.
  if (/地铁|地下鉄|metro/i.test(route) && !/JR|阪神|阪急|近铁|近鉄|南海|叡山/.test(route)) return ["metro"];
  return ["train"];
}

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  walk: "步行", metro: "地铁", train: "铁路", bus: "公交", taxi: "出租车",
  "high-speed-train": "高铁 / 新干线", "cable-car": "缆车", flight: "飞机",
};

export const TRAVEL_PREVIEW_MS = 6000;
/** Keep estimated ranges; the final arrival is after intermediate station times. */
export function planTimeLabel(plan: string, fallback = "待定", edge: "first" | "last" = "last") {
  const times = plan.match(/\d{2}:\d{2}(?:\s*[–—-]\s*\d{2}:\d{2})?/g);
  return (edge === "first" ? times?.[0] : times?.at(-1)) ?? fallback;
}

export function stepDuration(step: Pick<JourneyStep, "stayPlan" | "arrivalPlan">) {
  // Preview time is reading time, not a compressed timetable or a real ETA.
  return TRAVEL_PREVIEW_MS + Math.min(8000, Math.max(4500, (step.stayPlan.length + step.arrivalPlan.length) * 80));
}

export type PlaybackState = { index: number; elapsed: number; playing: boolean };
export type PlaybackAction =
  | { type: "toggle"; durations: number[] }
  | { type: "pause" }
  | { type: "select"; index: number }
  | { type: "tick"; delta: number; speed: number; durations: number[] };

export const INITIAL_PLAYBACK: PlaybackState = { index: 0, elapsed: 0, playing: false };
export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  if (action.type === "pause") return state.playing ? { ...state, playing: false } : state;
  if (action.type === "select") return { index: action.index, elapsed: 0, playing: false };
  if (action.type === "toggle") {
    if (!action.durations.length) return state;
    const ended = state.index === action.durations.length - 1 && state.elapsed >= action.durations[state.index];
    return ended ? { ...INITIAL_PLAYBACK, playing: true } : { ...state, playing: !state.playing };
  }
  if (!state.playing || !action.durations.length) return state;
  // Background and long main-thread stalls must not silently skip a destination.
  const elapsed = state.elapsed + Math.max(0, Math.min(action.delta, 100)) * action.speed;
  const duration = action.durations[state.index];
  if (elapsed < duration) return { ...state, elapsed };
  if (state.index === action.durations.length - 1) return { ...state, elapsed: duration, playing: false };
  return { index: state.index + 1, elapsed: 0, playing: true };
}

export function travelProgress(elapsed: number) {
  return Math.max(0, Math.min(1, elapsed / TRAVEL_PREVIEW_MS));
}

export function routeNodes(steps: JourneyStep[]) {
  const nodes: Array<{
    point: JourneyPoint; stepIndex: number;
    incomingStepIndex?: number; outgoingStepIndex?: number;
  }> = [];
  const legs: Array<{ from: number; to: number }> = [];
  steps.forEach((step, index) => {
    // Adjacent boundaries collapse; a later revisit (including the hotel) does not.
    if (nodes.at(-1)?.point.id !== step.from.id || steps[index - 1]?.date !== step.date) {
      nodes.push({ point: step.from, stepIndex: index });
    }
    const from = nodes.length - 1;
    nodes[from].outgoingStepIndex = index;
    nodes.push({ point: step.to, stepIndex: index, incomingStepIndex: index });
    legs.push({ from, to: nodes.length - 1 });
  });
  return { nodes, legs };
}

export function curvePoint(from: [number, number], to: [number, number], progress: number): [number, number] {
  const t = Math.max(0, Math.min(1, progress));
  const u = 1 - t;
  const middle = (from[0] + to[0]) / 2;
  return [u ** 3 * from[0] + 3 * u * u * t * middle + 3 * u * t * t * middle + t ** 3 * to[0],
    u ** 3 * from[1] + 3 * u * u * t * from[1] + 3 * u * t * t * to[1] + t ** 3 * to[1]];
}
