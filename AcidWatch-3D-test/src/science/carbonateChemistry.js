export function calculateOceanPH(co2ppm, temperature=15){

  const KH = 0.034
  const pCO2 = co2ppm * 1e-6

  const dissolvedCO2 = KH * pCO2

  const K1 = 1.45e-6
  const K2 = 1.04e-9

  const H = Math.sqrt(K1 * dissolvedCO2)

  const pH = -Math.log10(H)

  return pH

}
