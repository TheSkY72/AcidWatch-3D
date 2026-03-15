import React from "react";

import GlobeScene from "./globe/GlobeScene";
import YearScrubber from "./ui/YearScrubber";
import ScenarioButtons from "./ui/ScenarioButtons";
import CO2Slider from "./ui/CO2Slider";
import DepthPanel from "./panels/DepthPanel";

import { useStore } from "./store";

function App() {

  const selectedLocation = useStore((s) => s.selectedLocation);

  return (
    <div className="app">

      <header className="header">
        <h1>AcidWatch</h1>
        <p>Interactive Ocean Acidification Explorer</p>
      </header>

      <div className="dashboard">

        <div className="globe-card">
          <GlobeScene />
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
