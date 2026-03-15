import { useStore } from "../store";
import { depthProfile } from "../science/depthModel";
import "../styles.css";

export default function DepthPanel() {

  const selectedLocation = useStore((s) => s.selectedLocation);
  const year = useStore((s) => s.year);

  if (!selectedLocation) return null;

  const surfacePH = 8.1 - (year - 1980) * 0.002;

  const depths = depthProfile(surfacePH);

  return (
    <div className="depth-panel">

      <h2>Ocean Depth Profile</h2>

      {depths.map((d, i) => {

        const ph = Number(d.ph);

        return (
          <div key={i} className="depth-row">

            <span>{d.depth}m</span>

            <span>{ph.toFixed(2)}</span>

          </div>
        );
      })}

    </div>
  );
}
