import React from "react";

import GlobeScene from "./globe/GlobeScene";
import YearScrubber from "./ui/YearScrubber";
import CO2Slider from "./ui/CO2Slider";
import DepthPanel from "./panels/DepthPanel";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>AcidWatch</h1>
        <p>Interactive Ocean Acidification Explorer</p>
        <DepthPanel />
      </header>

      <div className="dashboard">
        <div className="globe-card">
          <GlobeScene />
        </div>

        <div className="controls-card">
          <YearScrubber />

          <CO2Slider />
        </div>
      </div>
    </div>
  );
}

export default App;
