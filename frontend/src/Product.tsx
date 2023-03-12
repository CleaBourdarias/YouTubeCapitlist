import { useRef, useState } from "react";
import { useInterval } from "./MyInterval";
import MyProgressbar, { Orientation } from "./MyProgressbar"
import { World, Product, Palier } from "./world"
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { transform } from "./utils";



const LANCER_PRODUCTION = gql`
    mutation lancerProductionProduit($id: Int!) {
        lancerProductionProduit(id: $id) {
            id
        }
    }
`;


type ProductProps = {
    product: Product,
    onProductionDone: (product: Product) => void,
    onProductBuy: (product : Product) => void,
    money: number,
    qtmulti : String,
    user : String,
    loadworld : World
}

 
export default function ProductComponent({ loadworld, product, onProductionDone, onProductBuy, money, qtmulti, user}: ProductProps) {
    //fait des hooks de lastupdate et timeleft


    const [lancerProduction] = useMutation(LANCER_PRODUCTION,
        { context: { headers: { "x-user": user }},
        onError: (error): void => {
        // actions en cas d'erreur
        }
        }
       )

    const lastupdate = useRef(Date.now()); //à mémoriser la date de dernière mise à jour du produit
    const [world,setWorld] = useState(loadworld)
    
    const [timeleft, setTimeleft] = useState(product.timeleft);

    function startFabrication() {
    
        setTimeleft(product.vitesse);
        lastupdate.current = Date.now();

        console.log("test : sa part ");
        lancerProduction({ variables: { id: product.id } });
    }


    function scalcScore() {
        
        let tempsEcoule = Date.now() - lastupdate.current
        lastupdate.current = Date.now(); // on remet à jour lastupdate

        if (product.managerUnlocked) {
            setTimeleft(product.vitesse)
            if (timeleft === 0) {
                return; // produit pas en cours de production, on ne fait rien
            }
            if (tempsEcoule < timeleft) {
                let newTimeLeft = timeleft - tempsEcoule
                setTimeleft(newTimeLeft)
            } else {
                setTimeleft(0)
                onProductionDone(product)  
            }

        }else{

            if (timeleft === 0) {
                return; // produit pas en cours de production, on ne fait rien
            }

            if(tempsEcoule < timeleft){
                let newTimeLeft = timeleft - tempsEcoule
                setTimeleft(newTimeLeft)
            }else{
                setTimeleft(0)
                onProductionDone(product)
            }
        }
    }


    useInterval(() => scalcScore(), 100);




    return (
        <div className="produit" >
            <div className="lesdeux">

           
                <button className="boutonProduit" disabled={product.quantite === 0}>
                
             
                
                <div className="lepremier">
                    <img className="imageVideo" onClick={() => startFabrication()} src={"http://localhost:4000/" + product.logo}/>
                </div>
                
               
                <div className="lesecond">
                    <span className="titre-video"> {product.name} </span>
                    <div className="style-infoVideo">Quantité de produit : <span> {product.quantite} </span></div>
                    <div className="style-infoVideo">Coût du produit : <span> {transform(product.cout)} </span></div>

                    <button className="buy-product" onClick={() => onProductBuy(product)} disabled={
                        (money<product.cout && qtmulti==="x1") || (money<(product.cout*10) && qtmulti==="x10") || (money<(product.cout*100) && qtmulti==="x100")}>BUY</button>
                </div>
               
                
                </button>
              
                
                <div className="unlocks">
                    {
                        product.paliers.filter((palier: Palier) => palier.unlocked).map(
                            (palier: Palier) => {
                
                                return (
                                    <div key={palier.idcible} className="managergrid">
                                        <div>
                                            <div className="logo">
                                            <img className="round" src={"http://localhost:4000/" + palier.logo}/>
                                            </div>
                                        </div>
                                        <div className="infosmanager">
                                            <div className="managername">{palier.name}</div>
                                        </div>
                                    </div>
                                );
                            }
                        )
                    }
                    
                </div>
            </div>





            <MyProgressbar className="barstyle" 
                vitesse={product.vitesse}
                initialvalue={product.vitesse - timeleft}
                run={timeleft>0 || product.managerUnlocked} frontcolor="#215eb9" backcolor="#ffffff"
                auto={product.managerUnlocked}
                orientation={Orientation.horizontal} />


        </div>

    )
}
