import React from "react";

export default function GlobeControls(){

  const resetView = () => {

    window.location.reload();

  };

  return(

    <div className="globe-controls">

      <button onClick={resetView}>
        Reset View
      </button>

    </div>

  );

}
