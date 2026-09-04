export type GuideId = string;
export type GuideDayId = string;

export type TravelGuideManifest = {
  schemaVersion: 1;
  id: GuideId;
  slug: string;
  locale: string;
  timezone: string;
  title: string;
  description: string;
  journalDays: DayJournalConfig[];
};

export type DayJournalTemplateId = "hand-journal";

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
  timingStatus?: "verified" | "estimated";
  href?: string;
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

export type DayJournalConfig = {
  schemaVersion: 1;
  id: GuideDayId;
  guideId: GuideId;
  date: string;
  dayNumber: number;
  weekday: string;
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
