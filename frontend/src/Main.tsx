import { useEffect, useState } from "react"
import ProductComponent from "./Product"
import { World } from "./world"
import { transform } from "./utils";
import { Product } from './world';
import ManagerComponent from "./Manager"
import AngeComponent from "./ange"
import UpgradeComponent from "./upgrade"
import { Palier } from './world';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {Snackbar, Alert, Button} from "@mui/material";


//liaison avec le backend
//appel des mutations du backend
const ACHETER_PRODUIT = gql`
    mutation acheterQtProduit($id: Int!, $quantite: Int!) {
        acheterQtProduit(id: $id, quantite: $quantite) {
            id
        }
    }
`;

const ENGAGER_MANAGER = gql`
    mutation engagerManager($name: String!) {
      engagerManager(name: $name) {
            name
        }
    }
`;

const ANGE_UPGRADE = gql`
    mutation acheterAngelUpgrade($name: String!) {
      acheterAngelUpgrade(name: $name) {
            name
        }
    }
`;

const CASH_UPGRADE = gql`
    mutation acheterCashUpgrade($name: String!) {
      acheterCashUpgrade(name: $name) {
            name
        }
    }
`;

const RESET_WORLD = gql`
    mutation resetWorld {
      resetWorld {
        name
        }
    }
`;


type MainProps = {
  loadworld: World
  username: string
}

export default function Main({ loadworld, username }: MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  useEffect(() => {
    setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
  }, [loadworld])

  const [acheterProduit] = useMutation(ACHETER_PRODUIT,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        // actions en cas d'erreur
      }
    }
  )

  const [acheterAngelUpgrade] = useMutation(ANGE_UPGRADE,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        // actions en cas d'erreur
      }
    }
  )

  const [engagerManager] = useMutation(ENGAGER_MANAGER,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        // actions en cas d'erreur
      }
    }
  )

  const [acheterCashUpgrade] = useMutation(CASH_UPGRADE,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        // actions en cas d'erreur
      }
    }
  )

  const [newWorld] = useMutation(RESET_WORLD,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        // actions en cas d'erreur
      }
    }
  )

  //initialisation des hooks
  const [money, setMoney] = useState(world.money);
  const [ange, setAnge] = useState(world.activeangels);
  const [qtmulti, setQtmulti] = useState("x1");
  const [showManagers, setShowManagers] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showAnges, setShowAnges] = useState(false);
  const [score, setScore] = useState(world.score);
  const [bonusAnge, setBonusAnge] = useState(world.angelbonus);
  const [snackBarUnlocks, setSnackBarUnlocks] = useState(false);
  const [snackBarAllUnlocks, setSnackBarAllUnlocks] = useState(false);
  const [actualUnlocks, setActualUnlocks] = useState(world.allunlocks[0]);
  const [actualAllUnlocks, setActualAllUnlocks] = useState(world.allunlocks[0]);
  const [snackBarReset, setSnackBarReset] = useState(false);
  const [resetAnge, setResetAnge] = useState(0);

// fonction qui met à jour le score une fois que la production est finie
  function onProductionDone(p: Product): void {
    // calcul de la somme obtenue par la production du produit
    let gain = p.revenu * p.quantite * (1 + ange * bonusAnge / 100)
    // ajout de la somme à l’argent possédé
    let newScore = score + gain
    let newMoney = money + gain
    setScore(newScore)
    setMoney(newMoney)
  }

  // engager un manager
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

    engagerManager({ variables: { name: manager.name } });
  }

// acheter des cash upgrades
  function buyUpgrade(upgrade: Palier): void {
    upgrade.unlocked = true;

    let newMoney = money - upgrade.seuil
    setMoney(newMoney)

    let produit = world.products.find(p => p.id === upgrade.idcible)

    if (produit === undefined) {
      throw new Error(
        `Le produit avec l'id ${upgrade.idcible} n'existe pas`)
    } else {
      if (upgrade.typeratio === "vitesse") {
        produit.vitesse = Math.round(produit.vitesse / upgrade.ratio)
      }
      if (upgrade.typeratio === "gain") {
        produit.revenu = produit.revenu * upgrade.ratio
      }
    }
    acheterCashUpgrade({ variables: { name: upgrade.name } });
  }

  // acheter des angelUpgrades
  function buyAnge(angel: Palier): void {
    angel.unlocked = true
    let newAnge = ange - angel.seuil
    setAnge(newAnge)

    if (angel.typeratio === "ange") {
      let newAngelBonus = bonusAnge + angel.ratio
      setBonusAnge(newAngelBonus)
    } else {
      world.products.forEach(produit => {

        if (angel.typeratio === "vitesse") {
          produit.vitesse = Math.round(produit.vitesse / angel.ratio)
        }
        if (angel.typeratio === "gain") {
          produit.revenu = produit.revenu * angel.ratio
        }
      })
    }
    acheterAngelUpgrade({ variables: { name: angel.name } });
  }

  // reset world
  function resetWorld() {
    newWorld({ variables: {} });
    window.location.reload();
  }

  // affichage des fenetres
  function handleManager() {
    setShowManagers(!showManagers)
  }
  function handleUpgrade() {
    setShowUpgrades(!showUpgrades)
  }
  function handleAnge() {
    setShowAnges(!showAnges)
  }

  // acheter des produits
  function onProductBuy(p: Product) {
    let lastQuantite = p.quantite
    //console.log("jai cliqué ")
    if (money >= p.cout) {
      if (qtmulti === "x1") {
        p.quantite += 1
        let moneyWorld = money - ((Math.pow(p.croissance, 1) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 1)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: 1 } });
      }
      if (qtmulti === "x10") {
        p.quantite += 10
        let moneyWorld = money - ((Math.pow(p.croissance, 10) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 10)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: 10 } });
      }
      if (qtmulti === "x100") {
        p.quantite += 100
        let moneyWorld = money - ((Math.pow(p.croissance, 100) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 100)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: 100 } });
      }
      if (qtmulti === "Max"){
        // on calcule le maximum de produit qu'on peut acheter
        let maxCanBuy = Math.floor((Math.log10(((money * (p.croissance - 1))/p.cout) + 1))/Math.log10(p.croissance))

        p.quantite += maxCanBuy
        let moneyWorld = money - ((Math.pow(p.croissance, maxCanBuy) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, maxCanBuy)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: maxCanBuy } });
      }
    }
    // on vérifie si il y a un unlock a débloquer
    p.paliers.forEach(u => {
      if (u.idcible === p.id && p.quantite >= u.seuil && lastQuantite<u.seuil) {
        u.unlocked = true
        setActualUnlocks(u)
        setSnackBarUnlocks(true)
        
        if (u.typeratio === "vitesse") {
          p.vitesse = Math.round(p.vitesse / u.ratio)
        }
        if (u.typeratio === "gain") {
          p.revenu = p.revenu * u.ratio
        }
        if (u.typeratio === "ange") {
          world.angelbonus += u.ratio
        }
      }
    })
    // on vérifie si des allunlocks sont débloqués
    world.allunlocks.forEach(a => {
      if (p.quantite >= a.seuil && lastQuantite<a.seuil) {
        let allunlocks = true
        // on parcours les produits pour savoir s'il ont tous un quantité suffisante
        world.products.forEach(p => {
          if (p.quantite < a.seuil) {
            allunlocks = false
          }
        })
        if (allunlocks) {
          a.unlocked = true
          setActualAllUnlocks(a)
          setSnackBarAllUnlocks(true)
          if (a.typeratio === "ange") {
            world.angelbonus += a.ratio
          } else {
            let produitCible = world.products.find(p => p.id === a.idcible)

            if (produitCible === undefined) {
              throw new Error(
                `Le produit avec l'id ${a.idcible} n'existe pas`)
            } else {
              if (a.typeratio === "vitesse") {
                produitCible.vitesse = Math.round(produitCible.vitesse / a.ratio)
              }
              if (a.typeratio === "gain") {
                produitCible.revenu = Math.round(produitCible.revenu * a.ratio)
              }
            }
          }
        }
      }
    })
  }

  // fonction qui change la variable qtmulti pour l'achat des produits
  function handleChange() {
    if (qtmulti === "x1") { setQtmulti("x10"); }
    if (qtmulti === "x10") { setQtmulti("x100"); }
    if (qtmulti === "x100") { setQtmulti("Max"); }
    if (qtmulti === "Max") { setQtmulti("x1"); }
  }

  // affiche le nombre d'ange qu'on va gagner si on reset le world et demande confirmation pour le reset
  function clickReset(){
    setSnackBarReset(true)
    let calculAnge = Math.round(150 * Math.sqrt(score / Math.pow(10, 10))) - world.totalangels
    setResetAnge(calculAnge)
  }


  return (
    <div className="App">

      <div className="header">
        <div className="logo-container">
          <img className="logo" src={"http://localhost:4000/" + world.logo} />
        </div>
        <div className="search-container">
          <span> {world.name} </span>
          <button><img src="https://cdn-icons-png.flaticon.com/512/1062/1062199.png" alt="Logo monde" /></button>
        </div>
      </div>

      <div className="header">
        <div className="YouTubeMoney-container">
          {/*<div> YouTubeMoney </div>*/}
          <img className="YouTubeMoney" src="https://cdn-icons-png.flaticon.com/512/3037/3037150.png" />
          <span className="style" dangerouslySetInnerHTML={{ __html: transform(money) }} />
        </div>
        <div className="ange-container">
          {/*<div> ange </div>*/}
          <img className="ange" src="https://cdn-icons-png.flaticon.com/512/1480/1480530.png" />
          <span className="style" dangerouslySetInnerHTML={{ __html: transform(ange) }} />
        </div>
        <div className="score-container">
          {/*<div> score </div>*/}
          <img className="score" src="https://cdn-icons-png.flaticon.com/512/9091/9091565.png" />
          <span className="style" dangerouslySetInnerHTML={{ __html: transform(score) }} />
        </div>
        <div className="BonusAnge-container">
          {/*<div> Bonus ange  </div>*/}
          <img className="BonusAnge" src="https://cdn-icons-png.flaticon.com/512/5110/5110795.png" />
          <span className="style" dangerouslySetInnerHTML={{ __html: transform(bonusAnge) }} />
        </div>
      </div>

      <div className="header">
        <span className="style-Multiplicateur">Multiplicateur</span>
        <button className="boutonMenu-Multiplicateur" onClick={() => handleChange()}>{qtmulti}</button>
      </div>

      <br></br>

      <div className="main">

        <div>
          {/*<button className="boutonMenu" onClick={() => handleManager()} >Engager un manager</button>*/}
          <button className="boutonMenu" onClick={() => handleManager()}>
            <img src="https://cdn-icons-png.flaticon.com/512/9686/9686199.png" alt="Engager un manager" />
            <span>Engager un manager</span>
          </button>
          {showManagers && <ManagerComponent loadworld={world} hireManager={hireManager} handleManager={handleManager} showManagers={showManagers} money={money}/>}

          {/*<button className="boutonMenu" onClick={() => handleUpgrade()} >Afficher les CashUpgrades</button>*/}
          <button className="boutonMenu" onClick={() => handleUpgrade()}>
            <img src="https://cdn-icons-png.flaticon.com/512/1548/1548175.png" alt="Afficher les CashUpgrades" />
            <span>Afficher les CashUpgrades</span>
          </button>
          {showUpgrades && <UpgradeComponent loadworld={world} buyUpgrade={buyUpgrade} handleUpgrade={handleUpgrade} showUpgrades={showUpgrades} money={money} />}


          {/*<button className="boutonMenu" onClick={() => handleAnge()} >Acheter les AngeUpgrades</button>*/}
          <button className="boutonMenu" onClick={() => handleAnge()}>
            <img src="https://cdn-icons-png.flaticon.com/512/1497/1497829.png" alt="Acheter les AngeUpgrades" />
            <span>Acheter les AngeUpgrades</span>
          </button>
          {showAnges && <AngeComponent loadworld={world} buyAnge={buyAnge} handleAnge={handleAnge} showAnges={showAnges} ange={ange} />}

          {/*<button className="boutonMenu" id="reset-world" onClick={() => resetWorld()} >Reset World !</button>*/}
          <button className="boutonMenu" id="reset-world" onClick={() => clickReset()} disabled={(Math.round(150 * Math.sqrt(score / Math.pow(10, 10))) - world.totalangels)<0}>
            <img src="https://cdn-icons-png.flaticon.com/512/5486/5486166.png" alt="Reset World !" />
          </button>

        </div>



        <div className="product">
            <div className="V1">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[0]} money={money} user={username} />
            </div>
            <div className="V2">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[1]} money={money} user={username} />
            </div>
            <div className="V3">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[2]} money={money} user={username} />
            </div>
            <div className="V4">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[3]} money={money} user={username} />
            </div>
            <div className="V5">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[4]} money={money} user={username} />
            </div>
            <div className="V6">
            <ProductComponent loadworld={loadworld} onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[5]} money={money} user={username} />
            </div>
        </div>
      </div>

      <div className="SnackBar">
        <Snackbar open={snackBarUnlocks} autoHideDuration={3000} onClose={() => setSnackBarUnlocks(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            <img className="petitRound" src={"http://localhost:4000/" + actualUnlocks.logo}/>
            Vous avez {actualUnlocks.name} !
          </Alert>
        </Snackbar>
      </div>

      <div className="SnackBar">
        <Snackbar open={snackBarAllUnlocks} autoHideDuration={3000} onClose={() => setSnackBarAllUnlocks(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            <img className="petitRound" src={"http://localhost:4000/" + actualAllUnlocks.logo}/>
            Vous avez {actualAllUnlocks.name} !
          </Alert>
        </Snackbar>
      </div>

      <div className="SnackBar">
        <Snackbar open={snackBarReset} autoHideDuration={10000} onClose={() => setSnackBarReset(false)}>
          <Alert severity="error" sx={{ width: '100%' }}>
            Es-tu sûr de vouloir reset ton compte YouTube ? Avec {resetAnge} anges 
            <Button onClick={() => resetWorld()}>OK</Button>
          </Alert>
        </Snackbar>
      </div>

    </div>

  )
}
