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
            ScaleScore()
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {

        acheterQtProduit(parent, args, context) {
            ScaleScore()
            let produit = context.world.products.find(p => p.id === args.id)

            if (produit === undefined) {
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                // on augmente la quantité du produit 
                produit.quantite = produit.quantite + args.quantite

                // on soustrait le montant acheté à l'argent total
                context.world.money = context.world.money - ((Math.pow(produit.croissance, args.quantite) - 1) / (produit.croissance - 1) * produit.cout)

                // on reactualise le coût du produit
                produit.cout = produit.cout * Math.pow(produit.croissance, args.quantite)

                saveWorld(context)
                return produit
            }
        },

        lancerProductionProduit(parent, args, context) {
            ScaleScore()
            let produit = context.world.products.find(p => p.id === args.id)

            produit.timeleft = produit.vitesse

            saveWorld(context)
            return produit
        },

        engagerManager(parent, args, context) {
            ScaleScore()
            let manager = context.world.managers.find(m => m.name === args.name)
            let produit = context.world.products.find(p => p.id === manager.idcible)

            manager.unlocked = true
            produit.managerUnlocked = true

            saveWorld(context)
            return manager
        }
    },

    ScaleScore() {
        tempsEcoule = Date.now() - parseInt(context.world.lastupdate)

        let nbProduction = 0

        for (p in context.world.products) {

            if (p.managerUnlocked) {
                if (p.timeleft > 0) {
                    tempsEcouleProduit = temspEcoule - p.timeleft
                    if (tempsEcouleProduit < 0) p.timeleft -= tempsEcoule
                    else {

                        nbProduction = tempsEcouleProduit / p.vitesse + 1
                        p.timeleft = tempsEcouleProduit % p.vitesse
                    }
                } else {
                    p.timeleft -= tempsEcoule
                    if (p.timeleft <= 0) {
                        nbProduction = 1
                        p.timeleft = 0
                    }
                }
                context.world.score = context.world.score + nbProduction * p.revenu * p.quantite
            }
            lastupdate = String(Date.now())
        }
    }
};
