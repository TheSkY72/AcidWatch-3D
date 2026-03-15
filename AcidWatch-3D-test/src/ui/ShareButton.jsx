import queryString from "query-string"
import { useStore } from "../store"

export default function ShareButton(){

  const {year,scenario} = useStore()

  const share=()=>{

    const url = queryString.stringifyUrl({

      url:window.location.href,
      query:{year,scenario}

    })

    navigator.clipboard.writeText(url)

    alert("Share link copied!")

  }

  return <button onClick={share}>Share View</button>

}
