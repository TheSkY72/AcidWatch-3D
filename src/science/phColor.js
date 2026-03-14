import * as d3 from "d3-scale";

export const phColor = d3
  .scaleLinear()
  .domain([7.7, 7.9, 8.05, 8.2])
  .range([
    "#8b0000", // critical red
    "#ff7b00", // orange
    "#00bcd4", // teal
    "#1e3a8a"  // deep blue
  ]);
