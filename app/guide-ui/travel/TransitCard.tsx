import { transitTimes } from "@/app/guide-core/dayPresentation";
import type { Place, TransitLeg, VisitGuide } from "@/app/guide-core/types";
import styles from "./travel.module.css";

export default function TransitCard({ from, to, leg, visit, href, index }: {
  from: Place; to: Place; leg: TransitLeg; visit?: VisitGuide; href: string; index: number;
}) {
  const times = transitTimes(leg);
  return <article className={styles.card}>
    <div className={styles.cardTop}><span>路段 {String(index).padStart(2, "0")} · {leg.kind}</span>
      <span className={styles.status}>{leg.timingStatus}{leg.verification && ` · ${leg.verification.basis === "官方核实" ? "含官方来源" : leg.verification.basis}`}</span></div>
    <div className={styles.clocks}>
      <div><small>出发</small><strong>{times.departure}</strong><span>{from.name}</span></div>
      <div className={styles.connector}><span>{leg.duration}</span><i aria-hidden="true">⟶</i></div>
      <div><small>到达 · 预计</small><strong>{times.arrival}</strong><span>{to.name}</span></div>
    </div>
    <p className={styles.route}>{leg.route}</p>
    <div className={styles.visit}>
      <div className={styles.visitHeading}><b>{to.category === "stay" ? "抵达住宿" : "到站之后"}</b>
        {visit && <span>{visit.priority} · {visit.duration}</span>}</div>
      <p>{leg.stayPlan}</p>
      {visit && <p className={styles.focus}>{visit.focus}</p>}
    </div>
    {(leg.verification?.pending || leg.verification?.basis === "待确认") && <p className={styles.pending}>{leg.verification.pending ?? "班次待复核，不按‘保证衔接’使用。"}</p>}
    <div className={styles.cardActions}><a href={href} target="_blank" rel="noreferrer">这一段 Google Maps ↗</a></div>
    <details className={styles.details}>
      <summary>换乘细节、首末班与异常备选</summary>
      <dl className={styles.detailFacts}>
        <div><dt>出发安排</dt><dd>{leg.departurePlan}</dd></div>
        <div><dt>抵达安排</dt><dd>{leg.arrivalPlan}</dd></div>
        {leg.serviceBoundary && <div><dt>{leg.serviceBoundary.label}</dt><dd>{leg.serviceBoundary.detail}</dd></div>}
        <div><dt>异常备选</dt><dd>{leg.fallback}</dd></div>
      </dl>
      {leg.verification && <p className={styles.evidence}>{leg.verification.checkedAt} · {leg.verification.basis}：{leg.verification.note}</p>}
      <div className={styles.sources}>{leg.sources?.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={`${source.href}-${source.label}`}>{source.label} ↗</a>)}</div>
    </details>
    {visit && (visit.hours || visit.price || visit.booking || visit.caution || visit.sources?.length) && <details className={styles.details}>
      <summary>{to.category === "restaurant" ? "用餐与预约须知" : "开放时间、费用与游玩提醒"}</summary>
      <dl className={styles.detailFacts}>
        {visit.hours && <div><dt>开放</dt><dd>{visit.hours}</dd></div>}
        {visit.price && <div><dt>费用 / 人</dt><dd>{visit.price}</dd></div>}
        {visit.booking && <div><dt>预约</dt><dd>{visit.booking}</dd></div>}
        {visit.caution && <div><dt>注意</dt><dd>{visit.caution}</dd></div>}
      </dl>
      <div className={styles.sources}>{visit.sources?.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label} · 核查 {source.checkedAt} ↗</a>)}</div>
    </details>}
  </article>;
}
