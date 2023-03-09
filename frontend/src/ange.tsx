import { World, Palier } from "./world";
import React, { useState } from 'react';


type AngeProps = {
    loadworld : World,
    buyAnge: (Ange: Palier) => void,
    handleAnge: () => void,
    showAnges:Boolean
    ange: number,

}

export default function AngeComponent({loadworld, buyAnge, handleAnge, showAnges, ange}:AngeProps) {
    //let showAnges = false; // déclaration d'une variable booléenne showAnges à true

    const [world,setWorld] = useState(loadworld)

    return (
        <div className="manager" >
            <div>
                {showAnges &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Anges make you feel better !
                            <button onClick={() => handleAnge()}>X</button>
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
                                                    <div className="managercost">{angel.seuil}</div>
                                                </div>
                                                <div onClick={() => buyAnge(angel)}>
                                                    <button disabled={ange < angel.seuil}>Buy !</button>
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                )
                            }
                            
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
