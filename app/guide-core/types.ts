export type GuideId = string;
export type GuideDayId = string;
export type PlaceId = string;
export type GuideAreaId = string;

export type PlaceCategory = "spot" | "restaurant" | "stay";

export type GuideMapArea = {
  id: GuideAreaId;
  label: string;
  bounds: [[number, number], [number, number]];
};

export type GuideMapConfig = {
  defaultAreaId: GuideAreaId;
  ariaLabel: string;
  transitAuditNote: string;
  diningNote: string;
  areas: GuideMapArea[];
};

export type Place = {
  id: PlaceId;
  name: string;
  area: GuideAreaId;
  category: PlaceCategory;
  position: [number, number];
  dates: GuideDayId[];
  meta: string;
  googleQuery: string;
  guide?: string;
  fit?: string;
  fitLevel?: "顺路" | "预订型" | "备选";
  official?: string;
};

export type RouteSegment = {
  id: string;
  label: string;
  note: string;
  pointIds: PlaceId[];
  mode: "walking" | "transit";
  drawOnMap?: boolean;
};

export type GuideDay = {
  id: GuideDayId;
  date: string;
  dayNumber: number;
  shortLabel: string;
  filterLabel: string;
  weekday: string;
  areaLabel: string;
  title: string;
  segments: RouteSegment[];
};

export type TransitLeg = {
  id: string;
  dayId: GuideDayId;
  fromPlaceId: PlaceId;
  toPlaceId: PlaceId;
  kind: "步行" | "铁路" | "铁路＋巴士" | "缆车＋步行";
  suggestedTime: string;
  duration: string;
  route: string;
  serviceBoundary?: {
    label: "最早班次" | "最晚班次" | "班次参考";
    detail: string;
  };
  fallback: string;
  sources?: Array<{ label: string; href: string }>;
  departurePlan: string;
  arrivalPlan: string;
  stayPlan: string;
  timingStatus: "已核班次" | "部分核实" | "预计时间";
};

export type GuideRouteModel = {
  map: GuideMapConfig;
  places: Place[];
  days: GuideDay[];
  transitLegs: TransitLeg[];
};

export type JourneyConfiguredStep = {
  id: string;
  date: GuideDayId;
  segment: string;
  segmentNote: string;
  fromPlaceId: PlaceId;
  toPlaceId: PlaceId;
  mode: string;
  icon: string;
  duration: string;
  departurePlan: string;
  arrivalPlan: string;
  stayPlan: string;
  route: string;
  timingStatus: TransitLeg["timingStatus"];
  navigationHref?: string;
};

export type JourneyPresentation = {
  eyebrow: string;
  titleLines: string[];
  description: string;
  phaseUnit: string;
  phaseSuffix: string;
  map: {
    center: [number, number];
    zoom: number;
    ariaLabel: string;
    note: string;
  };
  labels: {
    allDaysCode: string;
    allDays: string;
    daySelectorAriaLabel: string;
    progress: string;
    stepSelectorAriaLabel: string;
    day: string;
    step: string;
    departure: string;
    arrival: string;
    stay: string;
    route: string;
    navigation: string;
    controlsAriaLabel: string;
    previousAriaLabel: string;
    nextAriaLabel: string;
    play: string;
    pause: string;
    replay: string;
    speedAriaLabel: string;
    nearbyStepsAriaLabel: string;
    unknownTime: string;
    destination: string;
    photoCredit: string;
  };
};

export type JourneyMedia = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  credit: string;
  license: string;
  sourceHref: string;
  objectPosition?: string;
};

export type JourneyConfig = {
  presentation: JourneyPresentation;
  mediaByPlaceId?: Partial<Record<PlaceId, JourneyMedia>>;
  supplementalPlaces: Place[];
  beforeSteps: JourneyConfiguredStep[];
  afterSteps: JourneyConfiguredStep[];
  placeholderLabels: {
    byPlaceId: Record<PlaceId, string>;
    byCategory: Partial<Record<PlaceCategory, string>>;
  };
  transitIcons: Record<TransitLeg["kind"], string>;
};

export type JourneyPoint = Pick<Place, "id" | "name" | "category" | "position">;

export type JourneyStep = {
  id: string;
  date: GuideDayId;
  segment: string;
  segmentNote: string;
  from: JourneyPoint;
  to: JourneyPoint;
  mode: string;
  icon: string;
  duration: string;
  departurePlan: string;
  departureTime: string;
  arrivalPlan: string;
  stayPlan: string;
  route: string;
  timingStatus: TransitLeg["timingStatus"];
  navigationHref?: string;
  placeholderLabel?: string;
  media?: JourneyMedia;
};

export type JourneyDaySummary = Pick<GuideDay, "id" | "weekday" | "areaLabel" | "title">;

export type JourneyModel = {
  presentation: JourneyPresentation;
  phaseSummary: string;
  days: JourneyDaySummary[];
  steps: JourneyStep[];
};

export type HomeHeading = {
  eyebrow: string;
  note?: string;
  titleLines: string[];
  description?: string;
};

export type HomeLink = {
  label: string;
  href: string;
};

export type HomeItineraryDay = {
  date: GuideDayId;
  day: string;
  city: string;
  stay: string;
  title: string;
  route: string;
  rhythm: string;
  luggage?: string;
  schedule: string;
  note: string;
  transit: string;
  tone: "city" | "special" | "nature" | "culture";
};

export type HomeRestaurant = {
  city: string;
  name: string;
  cuisine: string;
  stars: string;
  status: string;
  statusTone: "priority" | "candidate" | "recommended";
  when: string;
  price: string;
  rating: string;
  party: string;
  reservation: string;
  feature: string;
  caution: string;
  mapHref: string;
  michelinHref?: string;
  reviewHref: string;
  bookingHref: string;
};

export type HomePageConfig = {
  metadata: {
    title: string;
    description: string;
    image: { src: string; width: number; height: number; alt: string };
  };
  navigation: {
    ariaLabel: string;
    brandMark: string;
    brand: string;
    homeAriaLabel: string;
    links: HomeLink[];
  };
  hero: {
    eyebrow: string;
    titleLines: string[];
    description: string;
    cta: HomeLink;
    dateRange: string;
    sunLabel: string;
  };
  overview: {
    ariaLabel: string;
    items: Array<{ label: string; value: string }>;
  };
  luggage: HomeHeading & {
    items: Array<{ date: string; label: string; title: string; body: string; href: string; cta: string }>;
  };
  mapSection: HomeHeading;
  itinerary: HomeHeading & {
    items: HomeItineraryDay[];
    journalPaths: Partial<Record<GuideDayId, string>>;
    labels: { stay: string; luggage: string; rhythm: string; schedule: string; transit: string; journal: string };
  };
  reference: HomeHeading & {
    id: string;
    items: Array<{ status: string; tone: "adopt" | "skip" | "keep" | "move"; title: string; body: string }>;
  };
  feature: HomeHeading & {
    id: string;
    date: string;
    stats: Array<{ value: string; label: string }>;
    link: HomeLink;
  };
  booking: HomeHeading & {
    id: string;
    items: Array<{ number: string; urgency: string; title: string; body: string; meta: string; href: string; cta: string }>;
  };
  dining: HomeHeading & {
    id: string;
    summaryAriaLabel: string;
    summary: Array<{ value: string; label: string }>;
    labels: { when: string; price: string; rating: string; party: string; reservation: string; feature: string; caution: string; map: string; michelin: string; review: string; booking: string };
    items: HomeRestaurant[];
  };
  detours: HomeHeading & {
    items: Array<{ area: string; title: string; body: string }>;
  };
  practical: HomeHeading & {
    items: Array<{ title: string; body: string }>;
  };
  sources: HomeHeading & { links: HomeLink[] };
  footer: {
    brandMark: string;
    brand: string;
    message: string;
    backToTop: HomeLink;
  };
};

export type TravelGuideManifest = {
  schemaVersion: 1;
  id: GuideId;
  slug: string;
  locale: string;
  timezone: string;
  title: string;
  description: string;
  map: GuideMapConfig;
  places: Place[];
  days: GuideDay[];
  transitLegs: TransitLeg[];
  journey: JourneyConfig;
  home: HomePageConfig;
  journalDays: DayJournalConfig[];
};

export type DayJournalTemplateId = "hand-journal" | "compact-journal";

export type DayJournalPresentation = {
  template: DayJournalTemplateId;
  heroImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
};

export type DayJournalStat = {
  value: string;
  label: string;
};

export type DayJournalTimelineItem = {
  time: string;
  title: string;
  kind: "anchor" | "hop" | "meal" | "free";
  note?: string;
  price?: string;
  hasAlternative?: boolean;
  timingStatus?: "verified" | "partial" | "estimated";
  href?: string;
};

export type DayJournalTransportLeg = {
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  mode: string;
  route: string;
  timingStatus: "verified" | "partial" | "estimated";
  serviceBoundary: string;
  fallback: string;
  href: string;
};

export type DayJournalRecommendation = {
  label: string;
  name: string;
  order: string;
  reason: string;
  caution: string;
  sourceHref: string;
  mapHref: string;
};

export type DayJournalNote = {
  label: string;
  body: string;
};

export type DayJournalLink = {
  label: string;
  href: string;
  download?: boolean;
};

export type DayJournalSource = {
  title: string;
  href: string;
  checkedAt: string;
};

export type DayJournalSection =
  | {
      kind: "timeline";
      id: string;
      eyebrow: string;
      titleLines: string[];
      aside?: DayJournalNote;
      items: DayJournalTimelineItem[];
    }
  | {
      kind: "recommendations";
      id: string;
      eyebrow: string;
      titleLines: string[];
      note?: string;
      items: DayJournalRecommendation[];
    }
  | {
      kind: "transport";
      id: string;
      eyebrow: string;
      titleLines: string[];
      note?: string;
      items: DayJournalTransportLeg[];
    }
  | {
      kind: "notes";
      id: string;
      eyebrow: string;
      titleLines: string[];
      items: DayJournalNote[];
    }
  | {
      kind: "links";
      id: string;
      eyebrow: string;
      titleLines: string[];
      note?: string;
      items: DayJournalLink[];
    }
  | {
      kind: "sources";
      id: string;
      title: string;
      summary: string;
      items: DayJournalSource[];
    };

/** Derived from the selected guide's route, coordinates and transit plans. */
export type DayJournalWeather = {
  guideId: GuideId;
  date: string;
  timezone: string;
  locations: Array<{ id: PlaceId; name: string; position: [number, number]; officialHref?: string }>;
  stops: Array<{
    locationId: PlaceId;
    time: string | null;
    timingLabel: string;
    fallback?: string;
  }>;
};

export type DayJournalConfig = {
  schemaVersion: 1;
  id: GuideDayId;
  guideId: GuideId;
  date: string;
  dayNumber: number;
  weekday: string;
  weather?: DayJournalWeather;
  metadata: {
    title: string;
    description: string;
  };
  navigation: {
    ariaLabel: string;
    backLabel: string;
    badge: string;
  };
  labels: {
    statsAriaLabel: string;
    estimatedTiming: string;
    partiallyVerifiedTiming: string;
    hasAlternative: string;
    recommendationSource: string;
    recommendationMap: string;
  };
  presentation: DayJournalPresentation;
  hero: {
    kicker: string;
    titleLines: string[];
    lead: string;
    stats: DayJournalStat[];
    footnote?: string;
  };
  route: {
    label: string;
    summary: string;
  };
  primaryRule?: {
    ariaLabel: string;
    eyebrow: string;
    title: string;
    body: string;
    href?: string;
    linkLabel?: string;
  };
  sections: DayJournalSection[];
  footer: {
    badge: string;
    message: string;
    backLabel: string;
  };
};
