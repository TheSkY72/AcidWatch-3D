import React from "react";
import { useStore } from "../store";

export default function ScenarioButtons(){

  const scenario = useStore(s=>s.scenario);
  const setScenario = useStore(s=>s.setScenario);

  const scenarios=[
    {id:"bau",label:"Business As Usual"},
    {id:"paris",label:"Paris Agreement"},
    {id:"best",label:"Best Case"}
  ];

  return(

    <div>

      <h3>Climate Scenario</h3>

      <div style={{display:"grid",gap:"10px"}}>

        {scenarios.map(s=>(

          <button
            key={s.id}
            className={scenario===s.id?"active":""}
            onClick={()=>setScenario(s.id)}
          >
            {s.label}
          </button>

        ))}

      </div>

    </div>

  );

}
