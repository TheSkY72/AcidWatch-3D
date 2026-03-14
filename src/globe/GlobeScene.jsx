import React, { useEffect, useRef} from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { phColor } from "../science/phColor";
import { useStore } from "../store";
import { hotspots } from "../data/hotspots";

const RADIUS = 100;

export default function GlobeScene() {
  const runTour = () => {
    const globe = globeRef.current;
    let i = 0;
    const fly = () => {
      const spot = hotspots[i];
      globe.pointOfView(
        { lat: spot.lat, lng: spot.lng, altitude: 2 },
        2000
      );
      i++;
      if (i < hotspots.length) {
        setTimeout(fly, 3000);
      }
    };
    fly();
  };

  const globeRef = useRef();

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
        ph
      });
    }
  }
  useEffect(() => {
    const globe = globeRef.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
    globe.scene().add(new THREE.AmbientLight(0xffffff, 1.2));
  }, []);

  // Make the startTour function accessible outside the component
  useEffect(() => {
    window.startTour = runTour;
  }, []);

  return (
    <><Globe
      ref={globeRef}
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
      labelColor={() => "red"}
      labelSize={1.4}
      onPointClick={(d) => {
        setSelectedLocation(d);
      } } /><button onClick={runTour}>Explore Hotspots</button></>
  );
}