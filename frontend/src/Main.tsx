import { useEffect, useState } from "react"
import ProductComponent from "./Product"
//import Product from "./Product"
import { World } from "./world"
import { transform } from "./utils";
import { Product } from './world';

type MainProps = {
  loadworld: World
  username: string
}
export default function Main({ loadworld, username }: MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  useEffect(() => {
    setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
  }, [loadworld])

  const money = world.money;

  const [qtmulti, setQtmulti] = useState("x1");

  function onProductionDone(p: Product, qt : number): void {
    // calcul de la somme obtenue par la production du produit
    let gain =  p.revenu * qt * p.quantite; // le gain du nombre de produits générés depuis la dernière mise à jour
    // ajout de la somme à l’argent possédé
    addToScore(gain)
  }

  function addToScore(gain: number) {
    world.score = world.score + gain;
}

function handleChange() {
  if(qtmulti==="x1"){
    setQtmulti("x10");
  }

  if(qtmulti==="x10"){
    setQtmulti("x100");
  }

  if(qtmulti==="x100"){
    setQtmulti("Max");
  }

  if(qtmulti==="Max"){
    setQtmulti("x1");
  }
}


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
          
          
            <div className="product">
            <ProductComponent onProductionDone={onProductionDone} qtmulti={qtmulti} product={world.products[0]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} qtmulti={qtmulti} product={world.products[1]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} qtmulti={qtmulti} product={world.products[2]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} qtmulti={qtmulti} product={world.products[3]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} qtmulti={qtmulti} product={world.products[4]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} qtmulti={qtmulti} product={world.products[5]} money={money} />
          </div>
          
          
          <button onClick={() => handleChange()}>Clique</button>
        </div>

      </div>


    </div>
  )
}
