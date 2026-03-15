import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { phColor } from "../science/phColor";
import { useStore } from "../store";
import { hotspots } from "../data/hotspots";

const RADIUS = 100;

export default function GlobeScene() {
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
  const setSelectedLocation = useStore((s) => s.setSelectedLocation);

  // simple pH model
  const basePH = 8.2 - (year - 1980) * 0.002;

  // create fake grid points (later replaced with real data)
  const points = [];
  // ... (rest of your code)
  for (let lat = -80; lat < 80; lat += 10) {
    for (let lng = -180; lng < 180; lng += 10) {
      // eslint-disable-next-line react-hooks/purity
      const ph = basePH + (Math.random() - 0.5) * 0.03;

      points.push({
        lat,
        lng,
        ph,
      });
    }
  }
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;

    const light = new THREE.AmbientLight(0xffffff, 1.2);
    globe.scene().add(light);

    return () => {
      globe.scene().remove(light);
    };
  }, []);

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
    </div>
  );
}
