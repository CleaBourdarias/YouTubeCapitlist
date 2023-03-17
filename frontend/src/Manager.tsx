import { World, Palier, Product } from "./world";
import React, { useState } from 'react';
import {Snackbar, Alert} from "@mui/material";


type ManagerProps = {
    loadworld : World,
    hireManager: (manager: Palier) => void,
    handleManager: () => void,
    showManagers:Boolean,
    money: number,
}

export default function ManagerComponent({loadworld, hireManager, handleManager, showManagers, money}:ManagerProps) {
    //let showManagers = false; // déclaration d'une variable booléenne showManagers à true

    const [world,setWorld] = useState(loadworld)
    const [snackBarManager, setSnackBarManager] = useState(false);
    const [actualManager, setActualManager] = useState(world.managers[0]);


    function clickManager(manager: Palier){
        hireManager(manager)
        setSnackBarManager(true)
        setActualManager(manager)

    }


    return (
        
        <div className="manager" >
            <div className="containerManager">
                {showManagers &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Abonne-toi pour recevoir toutes les notifications
                            <img className="img-cloche" src="https://cdn-icons-png.flaticon.com/512/1156/1156949.png"/>
                            <button className="boutonCroix" onClick={() => handleManager()}>
                            <img className="boutonCroix" src="https://cdn-icons-png.flaticon.com/512/4226/4226718.png" alt="X" />
                            </button>
                            </h1>
                        </div>
                        <div>
                            {
                                world.managers.filter((manager: Palier) => !manager.unlocked).map(
                                    (manager: Palier) => {
                        
                                        return (
                                            <div key={manager.idcible} className="managergrid">
                                                
                                                <div>
                                                    <div className="logo">
                                                    <img className="round" src={"http://localhost:4000/" + manager.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{manager.name}</div>
                                                    <div className="managercible">
                                                        {world.products[manager.idcible - 1].name}
                                                    </div>
                                                    <div className="managercost">{manager.seuil}
                                                    <img className="logoDollarsUpgradre" src="https://cdn-icons-png.flaticon.com/512/2842/2842651.png"/></div>
                                                </div>
                                                <div onClick={() => clickManager(manager)}>
                                                
                                                <button className="boutonHire" disabled={money < manager.seuil}>
                                                <img className="boutonHire" src="https://cdn-icons-png.flaticon.com/512/4470/4470940.png" alt="Hire" style={{ pointerEvents: money < manager.seuil ? 'none' : 'auto' }}/>
                                                </button>
                                                </div>
                                               
                                            </div>
                                        );
                                    }
                                )
                            }
                            
                        </div>
                        <div className="SnackBar">
                            <Snackbar open={snackBarManager} autoHideDuration={3000} onClose={() => setSnackBarManager(false)}>
                                <Alert severity="success" sx={{ width: '100%' }}>
                                    <img className="petitRound" src={"http://localhost:4000/" + actualManager.logo}/>
                                    {actualManager.name} travail désormais avec vous !
                                </Alert>
                          </Snackbar>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
