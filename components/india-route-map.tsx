import type { CoverageRegion } from "@/types/content";
import { INDIA_MAP_VIEWBOX, INDIA_STATES } from "./india-map-data";

export interface IndiaRouteMapProps {
  className?: string;
  regions: readonly CoverageRegion[];
  origin?: string;
  note?: string;
  ariaLabel?: string;
}

interface HubNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  stateId: string;
  bend: number;
  labelDx: number;
  labelDy: number;
}

// Configured hubs mapped to real geographic points on the India SVG (viewBox 0 0 612 696)
const KNOWN_REGION_HUBS: Record<string, Omit<HubNode, "id">> = {
  "gujarat": {
    x: 78,
    y: 355,
    label: "GUJARAT",
    sub: "Industrial Belt",
    stateId: "gj",
    bend: 0.12,
    labelDx: -72,
    labelDy: 14,
  },
  "maharashtra": {
    x: 125,
    y: 428,
    label: "MAHARASHTRA",
    sub: "Western & Central",
    stateId: "mh",
    bend: -0.10,
    labelDx: -108,
    labelDy: 4,
  },
  "telangana-hyderabad": {
    x: 228,
    y: 462,
    label: "HYDERABAD",
    sub: "Telangana Hub",
    stateId: "tg",
    bend: 0.14,
    labelDx: 14,
    labelDy: 4,
  },
  "andhra-visakhapatnam": {
    x: 318,
    y: 448,
    label: "VISAKHAPATNAM",
    sub: "Eastern Corridor",
    stateId: "ap",
    bend: -0.16,
    labelDx: 14,
    labelDy: 4,
  },
  "karnataka": {
    x: 182,
    y: 530,
    label: "KARNATAKA",
    sub: "Southern Network",
    stateId: "ka",
    bend: -0.12,
    labelDx: -96,
    labelDy: 6,
  },
};

// State fallback positions in case custom regions are added via admin
const STATE_FALLBACK_HUBS: Record<string, { x: number; y: number; stateId: string; bend: number }> = {
  "madhya pradesh": { x: 214, y: 319, stateId: "mp", bend: -0.12 },
  "chhattisgarh": { x: 296, y: 388, stateId: "ct", bend: -0.15 },
  "odisha": { x: 340, y: 405, stateId: "or", bend: -0.18 },
  "tamil nadu": { x: 255, y: 565, stateId: "tn", bend: 0.12 },
  "rajasthan": { x: 119, y: 257, stateId: "rj", bend: 0.15 },
  "uttar pradesh": { x: 265, y: 245, stateId: "up", bend: -0.14 },
  "west bengal": { x: 405, y: 360, stateId: "wb", bend: -0.18 },
  "jharkhand": { x: 355, y: 325, stateId: "jh", bend: -0.16 },
  "goa": { x: 118, y: 504, stateId: "ga", bend: -0.10 },
  "punjab": { x: 160, y: 155, stateId: "pb", bend: 0.12 },
  "haryana": { x: 175, y: 195, stateId: "hr", bend: 0.12 },
  "delhi": { x: 188, y: 205, stateId: "dl", bend: 0.10 },
};

function calculateArc(from: { x: number; y: number }, to: { x: number; y: number }, bend: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const cx = midX - dy * bend;
  const cy = midY + dx * bend;
  return `M ${from.x} ${from.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
}

export function IndiaRouteMap({
  className,
  regions,
  origin = "Wani",
  note,
  ariaLabel = "Real geographic map of India showing operating supply routes and dispatch corridors from Wani",
}: IndiaRouteMapProps) {
  // Origin Hub: Wani, Yavatmal, Maharashtra (approx 20.06° N, 78.95° E)
  const originNode = { x: 232, y: 418, name: origin.toUpperCase() };

  // Resolve target nodes from coverage regions data
  const targetNodes: HubNode[] = [];
  const activeStateIds = new Set<string>(["mh"]); // Origin state Maharashtra always active

  regions.forEach((region) => {
    const known = KNOWN_REGION_HUBS[region.id];
    if (known) {
      activeStateIds.add(known.stateId);
      targetNodes.push({
        ...known,
        id: region.id,
        label: region.mapLabel || region.label.toUpperCase(),
        sub: region.cityOrMarket || known.sub,
      });
      return;
    }

    // Attempt matching by state name or id
    const stateKey = (region.state || "").toLowerCase().trim();
    const fallback = STATE_FALLBACK_HUBS[stateKey];
    if (fallback) {
      activeStateIds.add(fallback.stateId);
      targetNodes.push({
        id: region.id,
        x: fallback.x,
        y: fallback.y,
        stateId: fallback.stateId,
        bend: fallback.bend,
        label: region.mapLabel || region.label.toUpperCase(),
        sub: region.cityOrMarket || region.name,
        labelDx: fallback.x > originNode.x ? 14 : -80,
        labelDy: 4,
      });
    }
  });

  return (
    <svg
      className={className ? `india-map ${className}` : "india-map"}
      viewBox={INDIA_MAP_VIEWBOX}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <pattern id="india-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="currentColor" opacity="0.18" />
        </pattern>
        <radialGradient id="hub-pulse-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cartographic dot matrix background */}
      <rect width="612" height="696" fill="url(#india-dot-grid)" opacity="0.65" />

      {/* Latitude / Longitude Graticule lines */}
      <g className="india-map__graticule">
        <line x1="40" y1="200" x2="570" y2="200" />
        <line x1="40" y1="350" x2="570" y2="350" />
        <line x1="40" y1="500" x2="570" y2="500" />
        <line x1="150" y1="80" x2="150" y2="650" />
        <line x1="300" y1="80" x2="300" y2="650" />
        <line x1="450" y1="80" x2="450" y2="650" />
      </g>

      {/* Graticule degree markers */}
      <g className="india-map__graticule-text">
        <text x="45" y="196">28° N</text>
        <text x="45" y="346">20° N</text>
        <text x="45" y="496">12° N</text>
        <text x="154" y="95">72° E</text>
        <text x="304" y="95">80° E</text>
        <text x="454" y="95">88° E</text>
      </g>

      {/* Real geographic shape of India: Inactive states rendered first */}
      <g className="india-map__states-base">
        {INDIA_STATES.map((state) => {
          if (activeStateIds.has(state.id)) return null;
          return (
            <path
              key={state.id}
              id={`state-${state.id}`}
              d={state.path}
              className="india-map__state"
            >
              <title>{state.name}</title>
            </path>
          );
        })}
      </g>

      {/* Real geographic shape of India: Active operating states highlighted */}
      <g className="india-map__states-active">
        {INDIA_STATES.map((state) => {
          if (!activeStateIds.has(state.id)) return null;
          return (
            <path
              key={state.id}
              id={`state-active-${state.id}`}
              d={state.path}
              className="india-map__state india-map__state--active"
            >
              <title>{state.name} (Operating Coverage)</title>
            </path>
          );
        })}
      </g>

      {/* Curved supply route corridors connecting Wani Hub to destination industrial regions */}
      <g className="india-map__routes">
        {targetNodes.map((target) => (
          <path
            key={`route-${target.id}`}
            d={calculateArc(originNode, target, target.bend)}
            className="india-map__route"
          />
        ))}
      </g>

      {/* Origin Hub aura & concentric rings */}
      <g className="india-map__hub-glow">
        <circle cx={originNode.x} cy={originNode.y} r="24" fill="url(#hub-pulse-glow)" />
        <circle cx={originNode.x} cy={originNode.y} r="14" className="india-map__hub-ring" />
      </g>

      {/* Destination Hub nodes */}
      <g className="india-map__nodes">
        {targetNodes.map((target) => (
          <g key={`node-${target.id}`}>
            <circle cx={target.x} cy={target.y} r="4.5" className="india-map__node" />
            <circle cx={target.x} cy={target.y} r="1.8" className="india-map__node-inner" />
          </g>
        ))}
      </g>

      {/* Central Origin Node */}
      <g className="india-map__hub-origin">
        <circle cx={originNode.x} cy={originNode.y} r="7" className="india-map__hub-outer" />
        <circle cx={originNode.x} cy={originNode.y} r="2.2" className="india-map__hub-inner" />
      </g>

      {/* Origin Badge */}
      <g className="india-map__badge" transform={`translate(${originNode.x + 12}, ${originNode.y - 6})`}>
        <rect x="-4" y="-12" width="72" height="23" rx="2" className="india-map__badge-bg" />
        <text x="4" y="2" className="india-map__badge-title">
          {originNode.name} HUB
        </text>
        <text x="4" y="9" className="india-map__badge-sub">
          CENTRAL YARD
        </text>
      </g>

      {/* Regional Destination Callout Labels */}
      <g className="india-map__labels">
        {targetNodes.map((target) => (
          <g
            key={`label-${target.id}`}
            transform={`translate(${target.x + target.labelDx}, ${target.y + target.labelDy})`}
          >
            <text x="0" y="0" className="india-map__label-title">
              {target.label}
            </text>
            {target.sub ? (
              <text x="0" y="8.5" className="india-map__label-sub">
                {target.sub}
              </text>
            ) : null}
          </g>
        ))}
      </g>

      {/* Architectural compass indicator */}
      <g className="india-map__compass" transform="translate(540, 60)">
        <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        <path d="M 0 -12 L 3 -3 L 0 -1 L -3 -3 Z" fill="currentColor" opacity="0.75" />
        <path d="M 0 12 L 3 3 L 0 1 L -3 3 Z" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
        <text x="0" y="-15" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" opacity="0.8">
          N
        </text>
      </g>

      {/* Map footnote / note */}
      {note ? (
        <text className="india-map__key" x="28" y="668">
          {note}
        </text>
      ) : null}
    </svg>
  );
}
