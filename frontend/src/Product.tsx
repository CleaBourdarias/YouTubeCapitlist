import { useRef, useState } from "react";
import { useInterval } from "./MyInterval";
import MyProgressbar, { Orientation } from "./MyProgressbar"
import { Product } from "./world"



type ProductProps = {
    product: Product,
    onProductionDone: (product: Product, qt: number) => void,
    onProductBuy: (product : Product) => void,
    money: number,
    qtmulti : String

}
export default function ProductComponent({ product, onProductionDone, onProductBuy, money, qtmulti }: ProductProps) {
    //fait des hooks de lastupdate et timeleft
    const lastupdate = useRef(Date.now()); //à mémoriser la date de dernière mise à jour du produit
    
    
    let [timeleft, setTimeleft] = useState(product.timeleft);

    function startFabrication() {
    
        
        setTimeleft(product.vitesse);
        lastupdate.current = Date.now();

        console.log("test : sa part ");
    }


    function scalcScore() {
        let nbProduction = 0;

        const now = Date.now();
        const tempsEcoule = now - lastupdate.current; // temps écoulé depuis la dernière mise à jour du score
       
        lastupdate.current = now; // on remet à jour lastupdate

        if (timeleft === 0) {
            return; // produit pas en cours de production, on ne fait rien
        }

        if (product.managerUnlocked) {
            if (timeleft > 0) {
                const tempsEcouleProduit = tempsEcoule - timeleft
                if (tempsEcouleProduit < 0) timeleft -= tempsEcoule
                else {

                    nbProduction = tempsEcouleProduit / product.vitesse + 1
                    setTimeleft(tempsEcouleProduit % product.vitesse)
                }
            } else {
                timeleft -= tempsEcoule
                if (timeleft <= 0) {
                    nbProduction = 1
                    setTimeleft(0)
                }
                
            }
        }else{
            console.log(tempsEcoule)
            console.log(timeleft)
            if(timeleft != 0 && timeleft < tempsEcoule){
                console.log(timeleft)
                nbProduction=1
                setTimeleft(0)
            }
            if(timeleft == 0){
                console.log("coucou")
                setTimeleft(0)
            }
        }

        if (nbProduction > 0) {
            onProductionDone(product, nbProduction)
        }

        lastupdate.current = Date.now()
    }

    useInterval(() => scalcScore(), 100);




    return (
        <div className="produit" >
            <div className="lesdeux">
                <div className="lepremier">
                    <img className="round" onClick={startFabrication} src={"http://localhost:4000/" + product.logo}/>
                </div>
                <div className="lesecond">
                    <span> {product.name} </span>
                    <span> {product.quantite} </span>
                    <button onClick={() => onProductBuy(product)} disabled={money<product.cout}>+1</button>
                    <div> Temps restant: {product.timeleft} </div>
                </div>
            </div>

            <MyProgressbar className="barstyle" vitesse={product.vitesse}
                initialvalue={product.vitesse - timeleft}
                run={timeleft>0 || product.managerUnlocked} frontcolor="#ff8800" backcolor="#ffffff"
                auto={product.managerUnlocked}
                orientation={Orientation.horizontal} />


        </div>

    )
}
