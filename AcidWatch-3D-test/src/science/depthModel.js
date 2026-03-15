export function depthProfile(surfacePH) {

  return [
    { depth: 0, ph: surfacePH },
    { depth: 200, ph: surfacePH - 0.04 },
    { depth: 1000, ph: surfacePH - 0.09 },
    { depth: 4000, ph: surfacePH - 0.18 }
  ];

}
