const { lastupdate } = require("./world");

const fs = require("fs").promises

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(
                    `Erreur d'écriture du monde coté serveur`)
            }
        })
};


module.exports = {
    Query: {
        getWorld(parent, args, context, info) {
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        resetWorld(){
            tempsCourant = Date.now() - Float32Array(context.world.lastupdate)
            let count = 0
            for (p in context.world.products){
                if (p.managerUnlocked){
                    count = tempsCourant/p.vitesse
                    if (p.timeleft-tempsCourant > 0){
                        context.world.score = context.world.score + count*p.revenu*p.quantite +1
                    }else{
                        context.world.score = context.world.score + count*p.revenu*p.quantite 
                    }
                    p.timeleft = tempsCourant%vitesse
                }else{
                    if (p.timeleft != 0 && p.timeleft<tempsCourant){
                        context.world.score = context.world.score + p.revenu*p.quantite
                    }else{
                        p.timeleft = p.timeleft - tempsCourant
                    }
                }
            }
            lastupdate = String(Date.now())


        },
        acheterQtProduit(parent, args, context){
            let produit = context.world.products.find(p => p.id === args.id)

            if (produit === undefined){
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            }else{
                // on augmente la quantité du produit 
                produit.quantite = produit.quantite + args.quantite

                // on soustrait le montant acheté à l'argent total
                context.world.money = context.world.money - ((Math.pow(produit.croissance,args.quantite)-1)/produit.croissance-1)

                // on reactualise le coût du produit
                produit.cout = produit.cout*Math.pow(produit.croissance,args.quantite)

                saveWorld(context)
            }
        },

        lancerProductionProduit(parent, args, context){
            let produit = context.world.products.find(p => p.id === args.id)

            produit.timeleft = produit.vitesse
        },

        engagerManager(parent, args, context){
            let manager = context.world.managers.find(m => m.name === args.name)
            let produit = context.world.products.find(p => p.id === manager.idcible)

            manager.unlocked = "true"
            produit.managerUnlocked = "true"
        }
    }
};

