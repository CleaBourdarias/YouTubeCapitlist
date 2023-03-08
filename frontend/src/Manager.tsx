import { Palier } from "./world"


type ManagerProps = {
    manager: Palier,


}
export default function ManagerComponent({ manager }: ManagerProps) {
    let showManagers = true; // déclaration d'une variable booléenne showManagers à true
    let world = require("./world") //recupere world

    function hireManager(manager: Palier): void {
        throw new Error("Function not implemented.");
    }
    return (
        <div className="manager" >
            <div>
                {showManagers &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Managers make you feel better !</h1>
                        </div>
                        <div>
                            {
                                world.managers.pallier.filter((manager: Palier) => !manager.unlocked).map(
                                    (manager: Palier) => {
                                        return (
                                            <div key={manager.idcible} className="managergrid">
                                                <div>
                                                    <div className="logo">
                                                        <img
                                                            alt="manager logo"
                                                            className="round"
                                                            src={manager.logo}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{manager.name}</div>
                                                    <div className="managercible">
                                                        {world.products.product[manager.idcible - 1].name}
                                                    </div>
                                                    <div className="managercost">{manager.seuil}</div>
                                                </div>
                                                <div onClick={() => hireManager(manager)}>
                                                    <button disabled={world.money < manager.seuil}>Hire !</button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            }
                            <button className="closebutton" onClick={() => showManagers = !showManagers}>Close</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
