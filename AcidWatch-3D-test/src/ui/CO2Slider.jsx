import React from "react";
import { useStore } from "../store";

import { co2ToPH } from "../science/pHCalc";

export default function CO2Slider() {
  const co2 = useStore((s) => s.co2);
  const setCO2 = useStore((s) => s.setCO2);

  const result = co2ToPH(co2);

  return (
    <div>
      <h3>Atmospheric CO₂</h3>

      <input
        type="range"
        min="280"
        max="800"
        value={co2}
        onChange={(e) => setCO2(Number(e.target.value))}
      />

      <p>{co2} ppm</p>

      <p>Predicted Ocean pH: {result.pH.toFixed(2)}</p>
      <p>
        Delta from preindustrial:{" "}
        {result.delta_pH_from_preindustrial.toFixed(2)}
      </p>
      <p>Acidity increase: {result.acidity_increase_percent.toFixed(1)}%</p>
    </div>
  );
}
