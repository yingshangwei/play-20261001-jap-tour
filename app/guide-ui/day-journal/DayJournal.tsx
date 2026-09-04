import type { CSSProperties, ReactNode } from "react";
import { withPublicAssetPrefix } from "@/app/guide-core/links";
import type {
  DayJournalConfig,
  DayJournalSection,
  DayJournalTimelineItem,
  DayJournalTemplateId,
} from "@/app/guide-core/types";
import styles from "./hand-journal.module.css";

type DayJournalProps = {
  config: DayJournalConfig;
  backHref: string;
  assetPrefix?: string;
};

type TemplateProps = DayJournalProps & {
  assetPrefix: string;
};

function JournalTitle({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

function timelineItemLabel(item: DayJournalTimelineItem) {
  if (item.kind === "hop") return "MOVE";
  if (item.kind === "meal") return "EAT";
  if (item.kind === "anchor") return "STOP";
  return "PAUSE";
}

function TimelineSection({ section, labels }: {
  section: Extract<DayJournalSection, { kind: "timeline" }>;
  labels: DayJournalConfig["labels"];
}) {
  return (
    <section className={styles.schedule} aria-labelledby={`${section.id}-title`}>
      <div className={styles.sectionIntro}>
        <div>
          <p>{section.eyebrow}</p>
          <h2 id={`${section.id}-title`}><JournalTitle lines={section.titleLines} /></h2>
        </div>
        {section.aside ? (
          <aside>
            <strong>{section.aside.label}</strong>
            <span>{section.aside.body}</span>
          </aside>
        ) : null}
      </div>

      <ol className={styles.timeline}>
        {section.items.map((item, index) => (
          <li className={`${styles.timelineItem} ${styles[item.kind]}`} key={`${item.time}-${item.title}`}>
            <div className={styles.timeColumn}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time>{item.time}</time>
            </div>
            <div className={styles.timelineBody}>
              <span className={styles.kind}>{timelineItemLabel(item)}</span>
              <h3>{item.title}</h3>
              <div className={styles.itemMeta}>
                {item.price ? <span>{item.price}</span> : null}
                {item.timingStatus === "estimated" ? <span>{labels.estimatedTiming}</span> : null}
                {item.timingStatus === "partial" ? <span>{labels.partiallyVerifiedTiming}</span> : null}
                {item.hasAlternative ? <span>{labels.hasAlternative}</span> : null}
              </div>
              {item.note ? <p>{item.note}</p> : null}
              {item.href ? <a href={item.href} target="_blank" rel="noreferrer">打开这一段导航 ↗</a> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TransportSection({ section, labels }: {
  section: Extract<DayJournalSection, { kind: "transport" }>;
  labels: DayJournalConfig["labels"];
}) {
  return (
    <section className={styles.transportSection} aria-labelledby={`${section.id}-title`}>
      <div className={styles.transportHeading}>
        <div>
          <p>{section.eyebrow}</p>
          <h2 id={`${section.id}-title`}><JournalTitle lines={section.titleLines} /></h2>
        </div>
        {section.note ? <span>{section.note}</span> : null}
      </div>
      <div className={styles.transportGrid}>
        {section.items.map((item, index) => (
          <article className={styles.transportCard} key={`${item.from}-${item.to}`}>
            <div className={styles.transportRoute}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.from}</strong>
              <i aria-hidden="true">→</i>
              <strong>{item.to}</strong>
            </div>
            <dl>
              <div><dt>出发</dt><dd>{item.depart}</dd></div>
              <div><dt>到达</dt><dd>{item.arrive}</dd></div>
              <div><dt>耗时</dt><dd>{item.duration}</dd></div>
              <div><dt>方式</dt><dd>{item.mode}</dd></div>
            </dl>
            <p>{item.route}</p>
            <div className={styles.transportMeta}>
              <span>{item.timingStatus === "verified" ? "已核时刻" : item.timingStatus === "partial" ? labels.partiallyVerifiedTiming : labels.estimatedTiming}</span>
              <span>{item.serviceBoundary}</span>
            </div>
            <small><strong>异常备选：</strong>{item.fallback}</small>
            <a href={item.href} target="_blank" rel="noreferrer">打开这一段导航 ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecommendationSection({ section, labels }: {
  section: Extract<DayJournalSection, { kind: "recommendations" }>;
  labels: DayJournalConfig["labels"];
}) {
  return (
    <section className={styles.foodSection} aria-labelledby={`${section.id}-title`}>
      <div className={styles.foodHeading}>
        <p>{section.eyebrow}</p>
        <h2 id={`${section.id}-title`}><JournalTitle lines={section.titleLines} /></h2>
        {section.note ? <span>{section.note}</span> : null}
      </div>
      <div className={styles.foodGrid}>
        {section.items.map((item, index) => (
          <article className={styles.foodCard} key={item.name}>
            <div className={styles.foodNumber}>{String(index + 1).padStart(2, "0")}</div>
            <span className={styles.foodFlag}>{item.label}</span>
            <h3>{item.name}</h3>
            <strong>{item.order}</strong>
            <p>{item.reason}</p>
            <small>{item.caution}</small>
            <div className={styles.cardLinks}>
              <a href={item.sourceHref} target="_blank" rel="noreferrer">{labels.recommendationSource} ↗</a>
              <a href={item.mapHref} target="_blank" rel="noreferrer">{labels.recommendationMap} ↗</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotesSection({ section }: { section: Extract<DayJournalSection, { kind: "notes" }> }) {
  return (
    <section className={styles.contingency} aria-labelledby={`${section.id}-title`}>
      <div>
        <p>{section.eyebrow}</p>
        <h2 id={`${section.id}-title`}><JournalTitle lines={section.titleLines} /></h2>
      </div>
      <div className={styles.noteStack}>
        {section.items.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LinksSection({ section, assetPrefix }: { section: Extract<DayJournalSection, { kind: "links" }>; assetPrefix: string }) {
  return (
    <section className={styles.mapKit} aria-labelledby={`${section.id}-title`}>
      <div>
        <p>{section.eyebrow}</p>
        <h2 id={`${section.id}-title`}><JournalTitle lines={section.titleLines} /></h2>
      </div>
      <div className={styles.mapActions}>
        {section.items.map((item) => {
          const href = item.href.startsWith("/") ? withPublicAssetPrefix(item.href, assetPrefix) : item.href;
          return item.download ? (
            <a href={href} download key={item.label}>{item.label} ↓</a>
          ) : (
            <a href={href} target="_blank" rel="noreferrer" key={item.label}>{item.label} ↗</a>
          );
        })}
      </div>
      {section.note ? <p className={styles.mapNote}>{section.note}</p> : null}
    </section>
  );
}

function SourcesSection({ section }: { section: Extract<DayJournalSection, { kind: "sources" }> }) {
  return (
    <section className={styles.sources} aria-labelledby={`${section.id}-title`}>
      <details>
        <summary id={`${section.id}-title`}>{section.title}</summary>
        <div className={styles.sourceBody}>
          <p>{section.summary}</p>
          <div>
            {section.items.map((item) => (
              <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>
                {item.title}<span>查于 {item.checkedAt} ↗</span>
              </a>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unsupported journal section: ${JSON.stringify(value)}`);
}

function JournalSectionView({ section, assetPrefix, labels }: {
  section: DayJournalSection;
  assetPrefix: string;
  labels: DayJournalConfig["labels"];
}) {
  switch (section.kind) {
    case "timeline":
      return <TimelineSection section={section} labels={labels} />;
    case "recommendations":
      return <RecommendationSection section={section} labels={labels} />;
    case "transport":
      return <TransportSection section={section} labels={labels} />;
    case "notes":
      return <NotesSection section={section} />;
    case "links":
      return <LinksSection section={section} assetPrefix={assetPrefix} />;
    case "sources":
      return <SourcesSection section={section} />;
    default:
      return assertNever(section);
  }
}

function HandJournalTemplate({ config, backHref, assetPrefix }: TemplateProps) {
  const image = config.presentation.heroImage;
  const heroStyle = image
    ? ({ "--journal-hero-art": `url("${withPublicAssetPrefix(image.src, assetPrefix)}")` } as CSSProperties)
    : undefined;

  return (
    <main className={styles.desk}>
      <article className={styles.journal}>
        <header className={styles.cover}>
          <nav className={styles.topbar} aria-label={config.navigation.ariaLabel}>
            <a href={backHref}>← {config.navigation.backLabel}</a>
            <span>{config.navigation.badge}</span>
          </nav>

          <div className={`${styles.coverGrid} ${image ? "" : styles.coverGridNoImage}`}>
            <div className={styles.coverCopy}>
              <p className={styles.kicker}>{config.hero.kicker}</p>
              <h1><JournalTitle lines={config.hero.titleLines} /></h1>
              <p className={styles.lead}>{config.hero.lead}</p>
              <div className={styles.stats} aria-label={config.labels.statsAriaLabel}>
                {config.hero.stats.map((stat) => <span key={stat.label}><strong>{stat.value}</strong>{stat.label}</span>)}
              </div>
              {config.hero.footnote ? <p className={styles.sun}>{config.hero.footnote}</p> : null}
            </div>

            {image ? (
              <figure className={styles.photoBlock}>
                <div className={styles.heroImage} role="img" aria-label={image.alt} style={heroStyle} />
                {image.caption ? <figcaption>{image.caption}</figcaption> : null}
              </figure>
            ) : null}
          </div>

          <div className={styles.routeTape}>
            <span>{config.route.label}</span>
            <strong>{config.route.summary}</strong>
          </div>
        </header>

        {config.primaryRule ? (
          <section className={styles.firstRule} aria-label={config.primaryRule.ariaLabel}>
            <span className={styles.pin}>{config.primaryRule.eyebrow}</span>
            <p><strong>{config.primaryRule.title}</strong>{config.primaryRule.body}</p>
            {config.primaryRule.href && config.primaryRule.linkLabel ? (
              <a href={config.primaryRule.href} target="_blank" rel="noreferrer">{config.primaryRule.linkLabel} ↗</a>
            ) : null}
          </section>
        ) : null}

        {config.sections.map((section) => (
          <JournalSectionView section={section} assetPrefix={assetPrefix} labels={config.labels} key={section.id} />
        ))}

        <footer className={styles.footer}>
          <div>
            <span>{config.footer.badge}</span>
            <p>{config.footer.message}</p>
          </div>
          <a href={backHref}>{config.footer.backLabel} ↑</a>
        </footer>
      </article>
    </main>
  );
}

const journalTemplates: Record<DayJournalTemplateId, (props: TemplateProps) => ReactNode> = {
  "hand-journal": HandJournalTemplate,
};

export default function DayJournal({ config, backHref, assetPrefix = "" }: DayJournalProps) {
  const Template = journalTemplates[config.presentation.template];
  return <Template config={config} backHref={backHref} assetPrefix={assetPrefix} />;
}
