export function co2ToPH(co2_ppm, temperature = 20, salinity = 35) {
  const TK = temperature + 273.15;

  // ── Henry's Law (Weiss 1974) ───────────────────────────────────────────
  // KH in mol/(kg·atm)
  const lnKH = 93.4517 * (100 / TK) - 60.2409 + 23.3585 * Math.log(TK / 100)
    + salinity * (0.023517 - 0.023656 * (TK / 100) + 0.0047036 * (TK / 100) ** 2);
  const KH = Math.exp(lnKH);

  const pCO2_atm = co2_ppm * 1e-6;
  const CO2_mol  = KH * pCO2_atm;   // mol/kg — do NOT multiply by 1e6 here

  // ── Dissociation constants (Lueker et al. 2000) ────────────────────────
  const logK1 = -3633.86 / TK + 61.2172 - 9.67770 * Math.log(TK)
    + 0.011555 * salinity - 0.0001152 * salinity ** 2;
  const K1 = Math.pow(10, logK1);

  const logK2 = -471.78 / TK - 25.9290 + 3.16967 * Math.log(TK)
    + 0.01781 * salinity - 0.0001122 * salinity ** 2;
  const K2 = Math.pow(10, logK2);

  // ── Water dissociation (Millero 1995) ─────────────────────────────────
  const lnKw = -13847.26 / TK + 148.9652 - 23.6521 * Math.log(TK)
    + (118.67 / TK - 5.977 + 1.0495 * Math.log(TK)) * Math.sqrt(salinity)
    - 0.01615 * salinity;
  const Kw = Math.exp(lnKw);

  // ── Total alkalinity (Lee et al. 2006) ────────────────────────────────
  const TA = (2305 + 53.97 * (salinity - 35)) * 1e-6; // mol/kg

  // ── Newton-Raphson solver for [H+] ────────────────────────────────────
  let H = 1e-8; // initial guess pH 8
  for (let iter = 0; iter < 100; iter++) {
    const HCO3 = K1 * CO2_mol / H;
    const CO3  = K1 * K2 * CO2_mol / (H * H);
    const OH   = Kw / H;
    const f    = HCO3 + 2 * CO3 + OH - H - TA;
    const df   = -(HCO3 + 4 * CO3 + OH) / H - 1;
    const dH   = f / df;
    H -= dH;
    H  = Math.max(H, 1e-14);
    if (Math.abs(dH / H) < 1e-10) break;
  }

  const pH = -Math.log10(H);
  const preindustrial_H = Math.pow(10, -8.179);

  return {
    pH:                          parseFloat(pH.toFixed(4)),
    delta_pH_from_preindustrial: parseFloat((pH - 8.179).toFixed(4)),
    H_concentration_nmol_per_L:  parseFloat((H * 1e9).toFixed(3)),
    co2_dissolved_umol_kg:       parseFloat((CO2_mol * 1e6).toFixed(2)),
    acidity_increase_percent:    parseFloat(((H / preindustrial_H - 1) * 100).toFixed(1))
  };
}
