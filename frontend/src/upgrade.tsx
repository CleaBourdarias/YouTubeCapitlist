import { World, Palier } from "./world";
import React, { useState } from 'react';
import {Snackbar, Alert} from "@mui/material";


type UpgradeProps = {
    loadworld : World,
    buyUpgrade: (Upgrade: Palier) => void,
    handleUpgrade: () => void,
    showUpgrades:Boolean,
    money: number,


}

export default function UpgradeComponent({loadworld, buyUpgrade, handleUpgrade, showUpgrades, money}:UpgradeProps) {
    //let showUpgrades = false; // déclaration d'une variable booléenne showUpgrades à true

    const [world,setWorld] = useState(loadworld)
    const [snackBarUpgrade, setSnackBarUpgrade] = useState(false);
    const [actualUpgrade, setSnackActualUpgrade] = useState(world.upgrades[0]);


    function clickUpgrade(upgrade: Palier){
        setSnackBarUpgrade(true)
        buyUpgrade(upgrade)
        setSnackActualUpgrade(upgrade)
    }

    return (
        <div className="manager" >
            <div>
                {showUpgrades &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Effectue un feat pour augmenter le nombre de vues
                            <img className="img-partenaire" src="https://cdn-icons-png.flaticon.com/512/564/564056.png"/>
                            <button className="boutonCroix" onClick={() => handleUpgrade()}>
                            <img className="boutonCroix" src="https://cdn-icons-png.flaticon.com/512/4226/4226718.png" alt="X" />
                            </button>

                            {/*<button onClick={() => handleUpgrade()}>X</button>*/}
                            </h1>
                        </div>
                        <div>
                            {
                                world.upgrades.filter((upgrade: Palier) => !upgrade.unlocked).map(
                                    (upgrade: Palier) => {
                        
                                        return (
                                            <div className="managergrid">
                                                <div>
                                                    <div className="logo">
                                                    <img className="round" src={"http://localhost:4000/" + upgrade.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{upgrade.name}</div>
                                                    <div className="managercible">
                                                        {world.products[upgrade.idcible - 1].name}
                                                    </div>
                                                    <div className="Upgradecost">{upgrade.seuil}</div>
                                                </div>
                                                <div onClick={() => clickUpgrade(upgrade)}>
                                                    <button className="boutonHire" disabled={money < upgrade.seuil}>
                                                    <img className="boutonHire" src="https://cdn-icons-png.flaticon.com/512/7286/7286290.png" alt="Hire" style={{ pointerEvents: money < upgrade.seuil ? 'none' : 'auto' }}/>
                                                    </button>
                                                    {/*<button disabled={money < upgrade.seuil}>Hire !</button>*/}
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                )
                            }
                            
                        </div>
                        <div>
                            <Snackbar open={snackBarUpgrade} autoHideDuration={3000} onClose={() => setSnackBarUpgrade(false)}>
                                <Alert severity="success" sx={{ width: '100%' }}>
                                    <img className="petitRound" src={"http://localhost:4000/" + actualUpgrade.logo}/>
                                    Vous venez de faire un <div>{actualUpgrade.name}</div> !
                                </Alert>
                          </Snackbar>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
