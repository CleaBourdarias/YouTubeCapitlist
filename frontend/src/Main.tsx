import { useEffect, useState } from "react"
import ProductComponent from "./Product"
import Product from "./Product"
import { World } from "./world"
import { transform } from "./utils";

type MainProps = {
  loadworld: World
  username: string
}
export default function Main({ loadworld, username }: MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  useEffect(() => {
    setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
  }, [loadworld])
  return (

    <div className="App">

      <div className="header">
        <div> <img className="square" src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + world.logo} /> </div>
        <span> {world.name} </span>
        <div> argent </div>
        <span dangerouslySetInnerHTML={{ __html: transform(world.money) }} />
        <div> multiplicateur </div>

      </div>

      <div className="main">
        <div> liste des boutons de menu </div>
        <div className="product">
          {/*
    <div > premier produit 
    <ProductComponent product={ world.products[0] } /></div>

    <div> second produit 
    <ProductComponent product={ world.products[1] } /></div> 
    
    <div> troisième produit 
    <ProductComponent product={ world.products[2] } /></div>

    <div> quatrième produit 
    <ProductComponent product={ world.products[3] } /></div>
    
    <div> cinquième produit 
    <ProductComponent product={ world.products[4] } /></div>

    <div> sixième produit 
    <ProductComponent product={ world.products[5] } /></div>
    */}
        </div>

      </div>


    </div>
  )
}
