import { phHistoricalData } from "../data/ph_historical";

function getLocationRecord(selectedLocation) {
  if (!selectedLocation) return null;

  const lat = Number(selectedLocation.lat);
  const lng = Number(selectedLocation.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const directKey = `${lat},${lng}`;
  if (phHistoricalData[directKey]) {
    return phHistoricalData[directKey];
  }

  // Source data keys are often serialized with one decimal place.
  const oneDecimalKey = `${lat.toFixed(1)},${lng.toFixed(1)}`;
  if (phHistoricalData[oneDecimalKey]) {
    return phHistoricalData[oneDecimalKey];
  }

  // Fallback for any unusual key formatting in the source data.
  const matchKey = Object.keys(phHistoricalData).find((coordKey) => {
    const [keyLat, keyLng] = coordKey.split(",").map(Number);
    return Math.abs(keyLat - lat) < 1e-6 && Math.abs(keyLng - lng) < 1e-6;
  });

  return matchKey ? phHistoricalData[matchKey] : null;
}

function getDepthPHValue(depthEntry) {
  if (typeof depthEntry === "number") return depthEntry;
  if (depthEntry && typeof depthEntry.pH === "number") return depthEntry.pH;
  return undefined;
}

export function depthProfile(selectedLocation, year) {
  if (!selectedLocation || !Number.isFinite(year)) return [];

  const locationRecord = getLocationRecord(selectedLocation);
  if (!locationRecord) {
    console.warn(
      "No depth profile record found for location",
      selectedLocation,
    );
    return [];
  }

  const years = Object.keys(locationRecord)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  if (!years.length) return [];

  let lowerYear = years[0];
  let upperYear = years[years.length - 1];

  if (year <= years[0]) {
    lowerYear = years[0];
    upperYear = years[0];
  } else if (year >= years[years.length - 1]) {
    lowerYear = years[years.length - 1];
    upperYear = years[years.length - 1];
  } else {
    for (let i = 1; i < years.length; i += 1) {
      if (year <= years[i]) {
        lowerYear = years[i - 1];
        upperYear = years[i];
        break;
      }
    }
  }

  const lowerDepthData = locationRecord[String(lowerYear)]?.depth ?? {};
  const upperDepthData = locationRecord[String(upperYear)]?.depth ?? {};

  const depthKeys = Array.from(
    new Set([...Object.keys(lowerDepthData), ...Object.keys(upperDepthData)]),
  )
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  const t =
    lowerYear === upperYear ? 0 : (year - lowerYear) / (upperYear - lowerYear);

  return depthKeys
    .map((depth) => {
      const depthKey = String(depth);
      const lowerPH = getDepthPHValue(lowerDepthData[depthKey]);
      const upperPH = getDepthPHValue(upperDepthData[depthKey]);

      if (typeof lowerPH === "number" && typeof upperPH === "number") {
        return {
          depth,
          ph: lowerPH + (upperPH - lowerPH) * t,
        };
      }

      if (typeof lowerPH === "number") {
        return { depth, ph: lowerPH };
      }

      return { depth, ph: upperPH };
    })
    .filter((d) => typeof d.ph === "number");
}

export function interpolateDepthPH(depthRows, targetDepth) {
  if (
    !Array.isArray(depthRows) ||
    !depthRows.length ||
    !Number.isFinite(targetDepth)
  ) {
    return null;
  }

  const rows = [...depthRows]
    .filter((d) => Number.isFinite(d.depth) && typeof d.ph === "number")
    .sort((a, b) => a.depth - b.depth);

  if (!rows.length) return null;

  if (targetDepth <= rows[0].depth) return rows[0].ph;
  if (targetDepth >= rows[rows.length - 1].depth)
    return rows[rows.length - 1].ph;

  for (let i = 1; i < rows.length; i += 1) {
    const upper = rows[i];
    if (targetDepth <= upper.depth) {
      const lower = rows[i - 1];

      if (upper.depth === lower.depth) {
        return upper.ph;
      }

      const t = (targetDepth - lower.depth) / (upper.depth - lower.depth);
      return lower.ph + (upper.ph - lower.ph) * t;
    }
  }

  return rows[rows.length - 1].ph;
}
