import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './style.css';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import Main from './Main';
import { Product } from './world';
import ProductComponent from './Product';

//a voir si ça marche 
const GET_WORLD = gql`
  query getWorld {
    getWorld {
      name
      logo
      money
      score
      totalangels
      activeangels
      angelbonus
      lastupdate
      products {
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        managerUnlocked
        paliers {
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;



function App() {

  //ici on met toutes les const
  const client = useApolloClient();

  const [username, setUsername] = useState("");

  let world = require("./world")

  const money = world.money;

  const [qtmulti, setQtmulti] = useState("x1");

  useEffect(() => {
    let lusername = localStorage.getItem("username");
    if (lusername === undefined) {
      lusername = "Youtubeur " + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", lusername);
    }
    if (lusername !== null) setUsername(lusername);
  }, []);



  const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {

    localStorage.setItem("username", event.currentTarget.value);
    setUsername(event.currentTarget.value);
    // forcer le client Apollo à refabriquer la requête
    client.resetStore()
    console.log(event.currentTarget.value);

  };

  const lastupdate = useRef(Date.now()); //à mémoriser la date de dernière mise à jour du produit

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


  const { loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
  });


  let corps = undefined
  if (loading) corps = <div> Loading... </div>
  else if (error) corps = <div> Erreur de chargement du monde ! </div>
  else corps = <Main loadworld={data.getWorld} username={username} />

  return (
    //App est le div racine - obligatoire en react
    <div>

      <div> Votre ID :</div>
      <input type="text" value={username} onChange={onUserNameChanged} />
      {corps}
      
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
  );

}


export default App;

