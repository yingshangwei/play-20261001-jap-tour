import { dayPresentation } from "@/app/guide-core/dayPresentation";
import type { GuideDay, GuideRouteModel } from "@/app/guide-core/types";
import styles from "./travel.module.css";

export default function DayOverview({ day, model, compact = false }: {
  day: GuideDay; model: GuideRouteModel; compact?: boolean;
}) {
  const summary = dayPresentation(model, day);
  return <div className={styles.overview}>
    <dl className={styles.dayFacts}>
      <div><dt>首段出发</dt><dd>{summary.departure}</dd></div>
      <div><dt>预计到达终点</dt><dd>{summary.arrival}</dd></div>
      <div><dt>当天终点</dt><dd className={styles.destination}>{summary.destination}</dd></div>
      {day.practical && <div><dt>步行估计 · 非测距</dt><dd className={styles.destination}>{day.practical.walking}</dd></div>}
    </dl>
    {day.practical && !compact && <div className={styles.dayAdvice}>
      <p><b>{day.practical.effort}</b>{day.practical.priority}</p>
      <p><b>晚了 / 累了</b>{day.practical.cutIfLate}</p>
    </div>}
  </div>;
}
