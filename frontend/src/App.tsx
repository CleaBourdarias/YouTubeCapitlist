import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    //App est le div racine - obligatoire en react
    <div className="App">
      
      <div className="header">
        <div> logo monde </div>
        <div> argent </div>
        <div> multiplicateur </div>
        <div> ID du joueur </div>
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
  );
}

export default App;