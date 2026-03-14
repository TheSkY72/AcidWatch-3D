import React from "react";
import { useStore } from "../store";

import { calculateOceanPH } from "../science/carbonateChemistry";

export default function CO2Slider(){

  const co2 = useStore(s=>s.co2);
  const setCO2 = useStore(s=>s.setCO2);

  const ph = calculateOceanPH(co2);

  return(

    <div>

      <h3>Atmospheric CO₂</h3>

      <input
        type="range"
        min="280"
        max="800"
        value={co2}
        onChange={(e)=>setCO2(Number(e.target.value))}
      />

      <p>{co2} ppm</p>

      <p>Predicted Ocean pH: {ph.toFixed(2)}</p>

    </div>

  );

}
