"use client";

import Link from "next/link";
import { useState } from "react";
import { evidenceLabels, lineLabels, lineOrder, timelineEvents, type TimelineLine } from "./timeline-data";

export function TimelineExplorer({ compact = false }: { compact?: boolean }) {
  const [activeLine, setActiveLine] = useState<TimelineLine | "all">("all");
  const availableEvents = [...(compact ? timelineEvents.filter((event) => event.landmark) : timelineEvents)]
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  const visibleEvents = activeLine === "all"
    ? availableEvents
    : availableEvents.filter((event) => event.lines.includes(activeLine));

  return (
    <div className={`timeline-explorer ${compact ? "timeline-compact" : ""}`}>
      <div className="timeline-controls" aria-label="Filter by family line">
        <button className={activeLine === "all" ? "active" : ""} type="button" aria-pressed={activeLine === "all"} onClick={() => setActiveLine("all")}>All lines</button>
        {lineOrder.map((line) => <button className={`line-${line} ${activeLine === line ? "active" : ""}`} type="button" aria-pressed={activeLine === line} onClick={() => setActiveLine(line)} key={line}>{lineLabels[line]}</button>)}
      </div>
      <p className="timeline-state" aria-live="polite">{activeLine === "all" ? `Showing ${visibleEvents.length} events across all family lines.` : `Showing only ${visibleEvents.length} ${lineLabels[activeLine]} events. Choose All lines to restore the complete chronology.`}</p>
      <div className="consolidated-timeline">
        {visibleEvents.map((event) => {
          return <article className="timeline-event" key={event.id}>
            <div className="timeline-date"><span>{event.displayDate}</span></div>
            <Link className="timeline-event-card" href={event.href}>
              <div className="timeline-event-lines">{event.lines.map((line) => <span className={`line-chip line-${line}`} key={line}>{lineLabels[line]}</span>)}</div>
              <p className={`event-evidence evidence-${event.evidence}`}>{evidenceLabels[event.evidence]}</p>
              <h3>{event.title}</h3>
              <p className="timeline-place">{event.place}</p>
              <p>{event.summary}</p>
              <strong>{event.linkLabel} →</strong>
            </Link>
          </article>;
        })}
      </div>
    </div>
  );
}
