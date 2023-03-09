import { World, Palier } from "./world";
import React, { useState } from 'react';


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

    return (
        <div className="manager" >
            <div>
                {showUpgrades &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Upgrades make you feel better !
                            <button onClick={() => handleUpgrade()}>X</button>
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
                                                <div onClick={() => buyUpgrade(upgrade)}>
                                                    <button disabled={money < upgrade.seuil}>Hire !</button>
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
