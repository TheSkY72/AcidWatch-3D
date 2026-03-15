import React from "react";

const species = [

{ name:"Oysters", threshold:8.0 },
{ name:"Pteropods", threshold:7.9 },
{ name:"Cold Coral", threshold:7.8 },
{ name:"Warm Coral", threshold:7.75 },
{ name:"Sea Urchins", threshold:7.7 },
{ name:"Fish Larvae", threshold:7.6 }

];

export default function SpeciesCascade({ph}){

  return(

    <div className="species">

      <h3>Species Impact</h3>

      {species.map((s,i)=>{

        const collapsed = ph < s.threshold;

        return(

          <div
            key={s.name}
            style={{
              opacity:collapsed?0.3:1,
              transition:"opacity 1s",
              transitionDelay:`${i*0.3}s`
            }}
          >

            {s.name} — {collapsed ? "collapsed" : "surviving"}

          </div>

        );

      })}

    </div>

  );

}
