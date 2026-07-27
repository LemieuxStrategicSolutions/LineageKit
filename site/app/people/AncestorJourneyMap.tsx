"use client";

import { useMemo, useState } from "react";

// Synthetic example places are fictional, so map hits will be approximate at
// best. When you adapt this template to a real archive, add exact query
// overrides here for places whose archival wording confuses the map search.
const exactMapQueries: Record<string, string> = {};

function mapQuery(place: string) {
  if (exactMapQueries[place]) return exactMapQueries[place];
  return place
    .replace(/^Probably /i, "")
    .replace(/^Reported /i, "")
    .replace(/,? exact locality (?:not yet established|unknown|unproved)/gi, "")
    .replace(/^Locality not yet established$/i, "")
    .replace(/ area$/i, "")
    .trim();
}

function precisionNote(place: string) {
  if (/probably|reported|region|area|exact locality|unproved|unknown|proposed|not yet established/i.test(place)) {
    return "The surviving evidence identifies a broad or probable location, so the map is intentionally approximate.";
  }
  return "Select a place to see it on the map. The wording follows the current research record.";
}

export function AncestorJourneyMap({ places, personName }: { places: string[]; personName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedPlace = places[selectedIndex] ?? places[0];
  const selectedQuery = mapQuery(selectedPlace);
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(selectedQuery)}&output=embed`;
  const largerMap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedQuery)}`;
  const journeyMap = useMemo(() => {
    const queries = places.map(mapQuery);
    if (queries.length < 2) return largerMap;
    const [origin, ...rest] = queries;
    const destination = rest.pop() ?? origin;
    const waypointPart = rest.length ? `&waypoints=${encodeURIComponent(rest.join("|"))}` : "";
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointPart}`;
  }, [largerMap, places]);

  return (
    <div className="journey-map">
      <div className="journey-map-places">
        <p className="journey-map-instruction">{precisionNote(selectedPlace)}</p>
        <ol>
          {places.map((place, index) => (
            <li key={`${place}-${index}`}>
              <button
                aria-pressed={selectedIndex === index}
                className={selectedIndex === index ? "active" : ""}
                onClick={() => setSelectedIndex(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{place}</strong><small>Show this place on the map</small></span>
              </button>
            </li>
          ))}
        </ol>
        <a className="journey-route-link" href={journeyMap} target="_blank" rel="noreferrer">
          {places.length > 1 ? "Open the complete journey in Maps" : "Open this place in Maps"} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="journey-map-frame">
        <div className="journey-map-label">
          <span>Selected place</span>
          <strong>{selectedPlace}</strong>
        </div>
        <iframe
          allowFullScreen
          aria-label={`Map showing ${selectedPlace} for ${personName}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapEmbed}
          title={`${personName}: ${selectedPlace}`}
        />
        <a href={largerMap} target="_blank" rel="noreferrer">Open this location larger <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  );
}
