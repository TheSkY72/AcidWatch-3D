import React, { useState } from "react";

import GlobeScene from "./globe/GlobeScene";
import YearScrubber from "./ui/YearScrubber";
import ScenarioButtons from "./ui/ScenarioButtons";
import CO2Slider from "./ui/CO2Slider";
import DepthPanel from "./panels/DepthPanel";

import { useStore } from "./store";

function App() {
  const selectedLocation = useStore((s) => s.selectedLocation);
  const [testPH, setTestPH] = useState(7.75);

  // State to control the speed of globe rotation
  // Range: 0 to 2 (0.4 is default moderate speed, higher = faster spin)
  const [spinSpeed, setSpinSpeed] = useState(0.4);

  // Handler function that updates spin speed when slider changes
  // Called from GlobeScene when user adjusts the speed slider
  const handleSpeedChange = (newSpeed) => setSpinSpeed(newSpeed);

  return (
    <div className="app">
      <header className="header">
        <h1>AcidWatch</h1>
        <p>Interactive Ocean Acidification Explorer</p>
      </header>

      <div className="dashboard">
        <div className="globe-card">
          {/* Pass two props to GlobeScene:
              1. spinSpeed: number controlling rotation speed (0-2)
              2. onSpeedChange: callback function called when speed slider value changes */}
          <GlobeScene spinSpeed={spinSpeed} onSpeedChange={handleSpeedChange} />
        </div>

        <div className="controls-card">
          <YearScrubber />
          <ScenarioButtons />
          <CO2Slider />
        </div>
      </div>

      {selectedLocation && <DepthPanel />}
    </div>
  );
}

export default App;
