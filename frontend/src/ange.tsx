import { World, Palier } from "./world";
import React, { useState } from 'react';
import {Snackbar, Alert} from "@mui/material";


type AngeProps = {
    loadworld : World,
    buyAnge: (Ange: Palier) => void,
    handleAnge: () => void,
    showAnges:Boolean
    ange: number,

}

export default function AngeComponent({loadworld, buyAnge, handleAnge, showAnges, ange}:AngeProps) {

    const [world,setWorld] = useState(loadworld)
    const [snackBarAnge, setSnackBarAnge] = useState(false);
    const [actualAnge, setSnackActualAnge] = useState(world.angelupgrades[0]);


    function clickAnge(ange: Palier){
        setSnackBarAnge(true)
        buyAnge(ange)
        setSnackActualAnge(ange)
    }

    return (
        <div className="manager" >
            <div>
                {showAnges &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Les placements de produits vont augmenter tes revenus 
                            <img className="img-angeupgrade" src="https://cdn-icons-png.flaticon.com/512/4626/4626780.png"/>
                            <button className="boutonCroix" id="boutonAngeUpgrade" onClick={() => handleAnge()}>
                            <img className="boutonCroix" src="https://cdn-icons-png.flaticon.com/512/4226/4226718.png" alt="X" />
                            </button>


                            {/*<button onClick={() => handleAnge()}>X</button>*/}
                            </h1>
                        </div>
                        <div>
                            {
                                world.angelupgrades.filter((angel: Palier) => !angel.unlocked).map(
                                    (angel: Palier) => {
                        
                                        return (
                                            <div className="managergrid">
                                                <div>
                                                    <div className="logo">
                                                    <img className="round" src={"http://localhost:4000/" + angel.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{angel.name}</div>
                                                    <div className="managercost">{angel.seuil}
                                                    <img className="logoAngeUpgradre" src="https://cdn-icons-png.flaticon.com/512/4442/4442490.png"/></div>
                                                </div>
                                                <div onClick={() => clickAnge(angel)}>

                                                    <button className="boutonHire"  disabled={ange < angel.seuil}>
                                                        <img className="boutonHire" src="https://cdn-icons-png.flaticon.com/512/478/478045.png" alt="Hire" style={{ pointerEvents: ange < angel.seuil ? 'none' : 'auto' }}  />
                                                    </button>

                                                    {/*<button disabled={ange < angel.seuil}>Buy !</button>*/}
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                )
                            }
                            
                        </div>
                        <div>
                            <Snackbar open={snackBarAnge} autoHideDuration={3000} onClose={() => setSnackBarAnge(false)}>
                                <Alert severity="success" sx={{ width: '100%' }}>
                                    <img className="petitRound" src={"http://localhost:4000/" + actualAnge.logo}/>
                                    Vous venez de faire un placement de produit {actualAnge.name}
                                </Alert>
                          </Snackbar>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
