export const hotspots = [

{lat:-18,lng:147},
{lat:60,lng:-40},
{lat:35,lng:-122},
{lat:-55,lng:20},
{lat:45,lng:160}

]
export function startTour(globe){

  let i = 0

  const interval = setInterval(()=>{

    const h = hotspots[i]

    globe.pointOfView(
      {lat:h.lat,lng:h.lng,altitude:1.5},
      3000
    )

    i++

    if(i>=hotspots.length) clearInterval(interval)

  },3500)

}
