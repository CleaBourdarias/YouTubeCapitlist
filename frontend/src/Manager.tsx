import { World, Palier, Product } from "./world";
import React, { useState } from 'react';
import {Snackbar} from "@mui/material";


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

    function clickManager(manager: Palier){
        hireManager(manager)
        setSnackBarManager(true)

        console.log(snackBarManager)
    }


    return (
        <div className="manager" >
            <div>
                {showManagers &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Abonne-toi pour recevoir toutes les notifications
                            <img className="img-cloche" src="https://cdn-icons-png.flaticon.com/512/1156/1156949.png"/>
                            <button className="boutonCroix" onClick={() => handleManager()}>
                            <img className="boutonCroix" src="https://cdn-icons-png.flaticon.com/512/4226/4226718.png" alt="X" />
                            </button>
                            {/*<button onClick={() => handleManager()}>X</button>*/}
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
                                                    <div className="managercost">{manager.seuil}</div>
                                                </div>
                                                <div onClick={() => clickManager(manager)}>
                                                
                                                <button className="boutonHire" disabled={money < manager.seuil}>
                                                <img className="boutonHire" src="https://cdn-icons-png.flaticon.com/512/4470/4470940.png" alt="Hire" style={{ pointerEvents: money < manager.seuil ? 'none' : 'auto' }}/>
                                                </button>
                                                    {/*<button disabled={money < manager.seuil}>Hire !</button>*/}
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            }
                            
                        </div>
                        <div>
                            <Snackbar 
                                open={snackBarManager}
                                autoHideDuration={5000}
                                message="Nouveau manager embauché !"
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
