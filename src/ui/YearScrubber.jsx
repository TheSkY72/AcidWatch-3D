import React from "react";
import { useStore } from "../store";

export default function YearScrubber(){

  const year = useStore(s=>s.year);
  const setYear = useStore(s=>s.setYear);

  return(

    <div>

      <h3>Year</h3>

      <input
        type="range"
        min="1980"
        max="2100"
        value={year}
        onChange={(e)=>setYear(Number(e.target.value))}
      />

      <p>{year}</p>

    </div>

  );

}
