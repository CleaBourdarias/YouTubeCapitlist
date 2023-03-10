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


  const [username, setUsername] = useState(localStorage.getItem('username') || `Youtubeur${Math.floor(Math.random()*10000)}`);

  
  const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("username", event.currentTarget.value);
    setUsername(event.currentTarget.value);
    // forcer le client Apollo à refabriquer la requête
    client.resetStore()
    console.log(event.currentTarget.value);
  };

  const client = useApolloClient();

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
    </div>
  );

}


export default App;

