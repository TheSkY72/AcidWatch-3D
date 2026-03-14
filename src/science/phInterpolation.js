export function interpolatePH(year, scenario){

  const startPH = 8.2
  const endPH = {
    bau: 7.7,
    paris: 7.9,
    best: 8.05
  }

  const t = (year-1980)/(2100-1980)

  return startPH + (endPH[scenario]-startPH)*t

}
