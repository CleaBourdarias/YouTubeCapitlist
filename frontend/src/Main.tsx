import { useEffect, useState } from "react"
import { World } from "./world"

type MainProps = {
    loadworld: World
    username: string
   }
   export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
    useEffect(() => {
        setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
       }, [loadworld])
return(

<div className="App">

<div className="header">
  <div> <img src={"http://localhost:4000" + world.logo} /> </div>
  <div> argent </div>
  <div> multiplicateur </div>
  
</div>

<div className="main">
  <div> liste des boutons de menu </div>
  <div className="product">
    <div> premier produit </div>
    <div> second produit </div>
    <div> troisième produit </div>
    <div> quatrième produit </div>
    <div> cinquième produit </div>
    <div> sixième produit </div>
  </div>

</div>

</div>

)       
}
   