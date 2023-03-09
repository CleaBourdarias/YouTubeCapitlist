import { useEffect, useState } from "react"
import ProductComponent from "./Product"
import { World } from "./world"
import { transform } from "./utils";
import { Product } from './world';
import ManagerComponent from "./Manager"
import AngeComponent from "./ange"
import UpgradeComponent from "./upgrade"
import { Palier } from './world';

type MainProps = {
  loadworld: World
  username: string
}

export default function Main({ loadworld, username }: MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  useEffect(() => {
    setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
  }, [loadworld])

  const [money, setMoney] = useState(world.money);
  const [ange, setAnge] = useState(world.activeangels);
  const [qtmulti, setQtmulti] = useState("x1");
  const [showManagers, setShowManagers] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showAnges, setShowAnges] = useState(false);
  const [score, setScore] = useState(world.score);

  function onProductionDone(p: Product): void {
    // calcul de la somme obtenue par la production du produit
    let gain =  p.revenu * p.quantite; // le gain du nombre de produits générés depuis la dernière mise à jour
    // ajout de la somme à l’argent possédé
    let newScore = score + gain
    let newMoney = money + gain
    setScore(newScore)
    setMoney(newMoney)
  }

  function hireManager(manager: Palier): void {
    manager.unlocked = true;
    let produit = world.products.find(p => p.id === manager.idcible)
    if (produit === undefined) {
        throw new Error(
            `Le produit avec l'id ${manager.idcible} n'existe pas`)
    } else {
        produit.managerUnlocked = true
        let newMoney = money - manager.seuil      
        setMoney(newMoney)      
    }
  }

  function buyUpgrade(upgrade: Palier): void {
    upgrade.unlocked = true;
    
    let newMoney = money - upgrade.seuil
    setMoney(newMoney)

    let produit = world.products.find(p => p.id === upgrade.idcible)

    if (produit === undefined) {
        throw new Error(
            `Le produit avec l'id ${upgrade.idcible} n'existe pas`)
    } else {
        if (upgrade.typeratio == "vitesse") {
            produit.vitesse = Math.round(produit.vitesse / upgrade.ratio)
        }
        if (upgrade.typeratio == "gain") {
            produit.revenu = produit.revenu * upgrade.ratio
        }
      }  
  }

  function buyAnge(angel: Palier): void {
    angel.unlocked = true
    let newAnge = ange - angel.seuil
    setAnge(newAnge)

    if (angel.typeratio == "ange") {
        world.angelbonus += angel.ratio
    } else {
        world.products.forEach(produit => {

            if (angel.typeratio == "vitesse") {
                produit.vitesse = Math.round(produit.vitesse / angel.ratio)
            }
            if (angel.typeratio == "gain") {
                produit.revenu = produit.revenu * angel.ratio
            }

        })
      }
  }
  
// affichage des fenetres
  function handleManager(){
    setShowManagers(!showManagers)
  }
  function handleUpgrade(){
    setShowUpgrades(!showUpgrades)
  }
  function handleAnge(){
    setShowAnges(!showAnges)
  }

  function onProductBuy(p: Product) {
    if(money >= p.cout){
      if(qtmulti==="x1"){
        p.quantite += 1
        let moneyWorld = money - ((Math.pow(p.croissance, 1) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 1)
        setMoney(moneyWorld)
      }
      if(qtmulti==="x10"){
        p.quantite += 10
        let moneyWorld = money - ((Math.pow(p.croissance, 10) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 10)
        setMoney(moneyWorld)
      }
      if(qtmulti==="x100"){
        p.quantite += 100
        let moneyWorld = money - ((Math.pow(p.croissance, 100) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 100)
        setMoney(moneyWorld)
      }
    }
  }

  function handleChange() {
    if(qtmulti==="x1"){setQtmulti("x10");}
    if(qtmulti==="x10"){setQtmulti("x100");}
    if(qtmulti==="x100"){setQtmulti("x1");}
    if(qtmulti==="Max"){setQtmulti("x1");}
  }

  return (
    <div className="App">

      <div className="header">
        <div> <img className="square" src={"http://localhost:4000/" + world.logo} /> </div>
        <span> {world.name} </span>
        <div>
          <div> YouTubeMoney </div>
          <span dangerouslySetInnerHTML={{ __html: transform(money)}}/>
          <div>ange : </div>
          <span dangerouslySetInnerHTML={{ __html: transform(ange)}}/>
          <div>score : </div>
          <span dangerouslySetInnerHTML={{ __html: transform(score)}}/>
        </div>
        <div> <div>multiplicateur : {qtmulti}</div>
        <button onClick={() => handleChange()}>Clique pour changer la quantité</button>
        </div>

      </div>

      <div className="main">
        <div> liste des boutons de menu 
        <button onClick={() => handleManager()} >Engager un manager</button>
        {showManagers && <ManagerComponent loadworld={world} hireManager={hireManager} handleManager={handleManager} showManagers={showManagers} money={money}/>}
        <button onClick={() => handleUpgrade()} >Afficher les CashUpgrades</button>
        {showUpgrades && <UpgradeComponent loadworld={world} buyUpgrade={buyUpgrade} handleUpgrade={handleUpgrade} showUpgrades={showUpgrades} money={money}/>}
        <button onClick={() => handleAnge()} >Acheter les AngeUpgrades</button>
        {showAnges && <AngeComponent loadworld={world} buyAnge={buyAnge} handleAnge={handleAnge} showAnges={showAnges} ange={ange}/>}


        <div>
          {
            world.allunlocks.filter((allunlock: Palier) => allunlock.unlocked).map(
                (allunlock: Palier) => {
                  return (
                      <div key={allunlock.seuil} className="managergrid">
                          <div>
                              <div className="logo">
                              <img className="round" src={"http://localhost:4000/" + allunlock.logo}/>
                              </div>
                          </div>
                          <div className="infosmanager">
                              <div className="managername">{allunlock.name}</div>
                          </div>
                      </div>
                  );
                }
            )
          }
        </div>
        
        </div>

        <div className="product">
          
          
          <div className="product">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[0]} money={money} user={username} />
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[1]} money={money} user={username}/>
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[2]} money={money} user={username}/>
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[3]} money={money} user={username}/>
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[4]} money={money} user={username}/>
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[5]} money={money} user={username}/>
          </div>

        </div>
      </div>
    </div>
    
  )
}
