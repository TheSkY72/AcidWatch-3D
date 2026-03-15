import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store";
import { depthProfile, interpolateDepthPH } from "../science/depthModel";
import "../styles.css";

export default function DepthPanel() {
  const selectedLocation = useStore((s) => s.selectedLocation);
  const year = useStore((s) => s.year);
  const [customDepth, setCustomDepth] = useState(0);

  const depths = useMemo(() => {
    if (!selectedLocation) return [];
    return depthProfile(selectedLocation, year);
  }, [selectedLocation, year]);

  const minDepth = depths.length ? depths[0].depth : 0;
  const maxDepth = depths.length ? depths[depths.length - 1].depth : 4000;

  useEffect(() => {
    setCustomDepth(minDepth);
  }, [minDepth, selectedLocation?.lat, selectedLocation?.lng]);

  const customDepthPH = useMemo(
    () => interpolateDepthPH(depths, customDepth),
    [depths, customDepth],
  );

  if (!selectedLocation) {
    return (
      <div className="header-point-info empty">
        Click a point on the globe to see full location + depth profile details.
      </div>
    );
  }

  const currentPH =
    typeof selectedLocation.ph === "number"
      ? selectedLocation.ph
      : depths[0]?.ph;

  return (
    <div className="header-point-info">
      <div className="point-meta-grid">
        <div>
          <strong>Year</strong>
          <div>{year}</div>
        </div>
        <div>
          <strong>Current pH</strong>
          <div>
            {typeof currentPH === "number" ? currentPH.toFixed(3) : "N/A"}
          </div>
        </div>
        <div>
          <strong>Latitude</strong>
          <div>{Number(selectedLocation.lat).toFixed(2)}°</div>
        </div>
        <div>
          <strong>Longitude</strong>
          <div>{Number(selectedLocation.lng).toFixed(2)}°</div>
        </div>
      </div>

      <div className="depth-slider-block">
        <label htmlFor="custom-depth-slider">
          Custom depth: <strong>{Math.round(customDepth)}m</strong>
          {typeof customDepthPH === "number" ? (
            <span className="custom-depth-ph">
              {" "}
              → pH {customDepthPH.toFixed(3)}
            </span>
          ) : null}
        </label>
        <input
          id="custom-depth-slider"
          type="range"
          min={minDepth}
          max={maxDepth}
          step={1}
          value={customDepth}
          onChange={(e) => setCustomDepth(Number(e.target.value))}
        />
      </div>

      <div className="depth-list">
        {depths.map((d) => (
          <div key={d.depth} className="depth-row">
            <span>{d.depth}m</span>
            <span>{Number(d.ph).toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
