import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { phColor } from "../science/phColor";
import { depthProfile } from "../science/depthModel";
import { useStore } from "../store";
import { hotspots } from "../data/hotspots";
import { phHistoricalData } from "../data/ph_historical";

// Component receives 2 props for controlling globe speed:
// - spinSpeed: number (0-2) controlling how fast the globe rotates
// - onSpeedChange: function called when user adjusts the speed slider
export default function GlobeScene({ spinSpeed = 0.4, onSpeedChange }) {
  const globeRef = useRef();
  const containerRef = useRef(null);
  const tourTimeoutRef = useRef(null);
  const tourIndexRef = useRef(0);
  const isTouringRef = useRef(false);
  const [isShowing, setIsShowing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 650 });

  const stopTour = () => {
    if (tourTimeoutRef.current) {
      clearTimeout(tourTimeoutRef.current);
      tourTimeoutRef.current = null;
    }

    tourIndexRef.current = 0;
    isTouringRef.current = false;
    setIsShowing(false);
  };

  const runTour = () => {
    const globe = globeRef.current;
    if (!globe) return;

    if (tourTimeoutRef.current) {
      clearTimeout(tourTimeoutRef.current);
    }

    isTouringRef.current = true;
    setIsShowing(true);

    const fly = () => {
      if (!isTouringRef.current) {
        return;
      }

      const spot = hotspots[tourIndexRef.current];
      if (!spot) {
        stopTour();
        return;
      }

      globe.pointOfView({ lat: spot.lat, lng: spot.lng, altitude: 2 }, 2000);
      tourIndexRef.current += 1;

      if (tourIndexRef.current < hotspots.length) {
        tourTimeoutRef.current = setTimeout(fly, 3000);
        return;
      }

      stopTour();
    };

    fly();
  };

  const toggleTour = () => {
    if (isTouringRef.current) {
      stopTour();
      return;
    }

    runTour();
  };

  const year = useStore((s) => s.year);
  const setSelectedLocation = useStore((s) => s.setLocation);

  const formatTooltip = (d) => {
    const lat = Number(d.lat).toFixed(2);
    const lng = Number(d.lng).toFixed(2);
    const ph = Number(d.ph).toFixed(3);
    const depths = depthProfile({ lat: d.lat, lng: d.lng }, d.year);

    const depthRows = depths.length
      ? depths
          .map(
            (item) =>
              `<div class="point-tooltip-depth-row"><span>${item.depth}m</span><span>${Number(item.ph).toFixed(3)}</span></div>`,
          )
          .join("")
      : `<div class="point-tooltip-depth-empty">No depth data</div>`;

    return `
      <div class="point-tooltip">
        <div><strong>Year:</strong> ${d.year}</div>
        <div><strong>pH:</strong> ${ph}</div>
        <div><strong>Lat:</strong> ${lat}°</div>
        <div><strong>Lng:</strong> ${lng}°</div>
        <div class="point-tooltip-depth">
          <div class="point-tooltip-depth-title"><strong>Depth profile</strong></div>
          ${depthRows}
        </div>
      </div>
    `;
  };

  const points = useMemo(() => {
    return Object.entries(phHistoricalData)
      .map(([coordKey, yearlyData]) => {
        const [latStr, lngStr] = coordKey.split(",");
        const lat = Number(latStr);
        const lng = Number(lngStr);

        const yearSamples = Object.entries(yearlyData)
          .map(([yearKey, yearValue]) => ({
            year: Number(yearKey),
            ph: yearValue?.surface?.pH,
          }))
          .filter(
            (sample) =>
              Number.isFinite(sample.year) && typeof sample.ph === "number",
          )
          .sort((a, b) => a.year - b.year);

        if (
          !yearSamples.length ||
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return null;
        }

        const first = yearSamples[0];
        const last = yearSamples[yearSamples.length - 1];

        let ph;

        if (year <= first.year) {
          ph = first.ph;
        } else if (year >= last.year) {
          ph = last.ph;
        } else {
          const upperIndex = yearSamples.findIndex(
            (sample) => sample.year >= year,
          );
          const upper = yearSamples[upperIndex];
          const lower = yearSamples[upperIndex - 1];

          if (upper.year === lower.year) {
            ph = upper.ph;
          } else {
            const t = (year - lower.year) / (upper.year - lower.year);
            ph = lower.ph + (upper.ph - lower.ph) * t;
          }
        }

        return {
          lat,
          lng,
          ph,
          year,
        };
      })
      .filter(Boolean);
  }, [year]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Enable auto-rotate on the globe (always spinning)
    globe.controls().autoRotate = true;
    
    // Set the rotation speed from the spinSpeed prop (controlled by slider)
    // Range: 0-2 with 0.4 as default moderate speed
    globe.controls().autoRotateSpeed = spinSpeed;

    const light = new THREE.AmbientLight(0xffffff, 1.2);
    globe.scene().add(light);

    return () => {
      globe.scene().remove(light);
    };
  }, [spinSpeed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Make the startTour function accessible outside the component
  useEffect(() => {
    window.startTour = toggleTour;

    return () => {
      stopTour();
      delete window.startTour;
    };
  }, []);

  return (
    <div className="globe-scene">
      <div className="globe-canvas-wrap" ref={containerRef}>
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="#f6fbff"
          pointsData={points}
          pointLat={(d) => d.lat}
          pointLng={(d) => d.lng}
          pointAltitude={0.01}
          pointColor={(d) => phColor(d.ph)}
          pointRadius={0.5}
          pointLabel={formatTooltip}
          labelsData={hotspots}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelText={(d) => d.name}
          labelColor={() => "white"}
          labelSize={1.4}
          onPointClick={(d) => {
            setSelectedLocation(d);
          }}
        />
      </div>

      <button
        className={`tour-button ${isShowing ? "active" : ""}`}
        onClick={toggleTour}
        aria-pressed={isShowing}
      >
        {isShowing ? "Stop Exploring" : "Explore Hotspots"}
      </button>

      {/* Speed control slider positioned in the top-left corner of the globe */}
      {/* Allows user to adjust how fast the globe rotates */}
      {onSpeedChange && (
        <div className="speed-control">
          {/* Label for the speed slider */}
          <label htmlFor="speed-slider" className="speed-label">Speed of Spin</label>
          {/* Slider input ranging from 0 to 2 */}
          <input
            id="speed-slider"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={spinSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="speed-slider"
            aria-label="Globe rotation speed"
          />
          {/* Display current speed value as text */}
          <span className="speed-value">{spinSpeed.toFixed(1)}x</span>
        </div>
      )}
    </div>
  );
}
