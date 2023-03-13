const fs = require("fs").promises

function saveWorld(context) {
    console.log("Je sauvegarde")
    fs.writeFile("../userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(
                    `Erreur d'écriture du monde coté serveur`)
            }
        })
};

function scalcScore(context) {

    let tempsEcoule = Date.now() - parseInt(context.world.lastupdate)
    console.log("Je calcule le score")

    context.world.products.forEach(p => {
        let nbProduction = 0

        if (p.managerUnlocked) {

            tempsEcouleProduit = tempsEcoule - p.timeleft
           
            if (tempsEcouleProduit < 0) {p.timeleft -= tempsEcouleProduit}
            else {
                nbProduction = (tempsEcouleProduit / p.vitesse) + 1
                p.timeleft = tempsEcouleProduit % p.vitesse
            }         
            
        }else{
            if(p.timeleft != 0 && p.timeleft < tempsEcoule){
                nbProduction=1
                p.timeleft=0
            }
        }

        context.world.score += nbProduction * p.revenu * p.quantite * (1 + context.world.activeangels * context.world.angelbonus / 100)
        context.world.money += nbProduction * p.revenu * p.quantite * (1 + context.world.activeangels * context.world.angelbonus / 100)
    })

    context.world.lastupdate = String(Date.now())
};


module.exports = {
    Query: {
        getWorld(parent, args, context, info) {
            scalcScore(context)
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {

        acheterQtProduit(parent, args, context) {
            scalcScore(context)
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

                // on vérifie si il y a un unlock a débloquer
                produit.paliers.forEach(u =>  {
                    if (u.idcible == produit.id && produit.quantite >= u.seuil) {
                        u.unlocked = true
                        if (u.typeratio == "vitesse") {
                            produit.vitesse = Math.round(produit.vitesse / u.ratio)
                        }
                        if (u.typeratio == "gain") {
                            produit.revenu = produit.revenu * u.ratio
                        }
                        if (u.typeratio == "ange"){
                            context.world.angelbonus += u.ratio
                        }
                    }
                })

                // on vérifie si des allunlocks sont débloqués
                context.world.allunlocks.forEach(a =>  {
                    if (produit.quantite >= a.seuil) {
                        let allunlocks = true
                        // on parcours les produits pour savoir s'il ont tous un quantité suffisante
                        context.world.products.forEach(p =>  {
                            if (p.quantite < a.seuil) {
                                allunlocks = false
                            }
                        })
                        if (allunlocks) {
                            a.unlocked = true
                            if (a.typeratio == "ange"){
                                context.world.angelbonus += a.ratio
                            }else{
                                let produitCible = context.world.products.find(p => p.id === a.idcible)

                                if (produitCible === undefined) {
                                    throw new Error(
                                        `Le produit avec l'id ${a.idcible} n'existe pas`)
                                } else {
                                    if (a.typeratio == "vitesse") {
                                        produitCible.vitesse = Math.round(produitCible.vitesse / a.ratio)
                                    }
                                    if (a.typeratio == "gain") {
                                        produitCible.revenu = Math.round(produitCible.revenu * a.ratio)
                                    }
                                }
                            }
                        }
                    }
                })

                saveWorld(context)
                return produit
            }
        },

        lancerProductionProduit(parent, args, context) {
            console.log("je lance la production")
            scalcScore(context)
            let produit = context.world.products.find(p => p.id === args.id)

            if (produit === undefined) {
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.timeleft = produit.vitesse
                console.log(produit.timeleft)

                saveWorld(context)
                return produit
            }
        },

        engagerManager(parent, args, context) {
            scalcScore(context)
            let manager = context.world.managers.find(m => m.name === args.name)
            let produit = context.world.products.find(p => p.id === manager.idcible)

            if (produit === undefined) {
                throw new Error(
                    `Le produit avec l'id ${manager.idcible} n'existe pas`)
            }
            if (manager === undefined) {
                throw new Error(
                    `Le manager avec le nom ${args.name} n'existe pas`)

            } else {

                manager.unlocked = true
                produit.managerUnlocked = true

                saveWorld(context)
                return manager
            }
        },
        acheterCashUpgrade(parent, args, context) {
            scalcScore(context)
            let upgrade = context.world.upgrades.find(up => up.name === args.name)

            if (upgrade === undefined) {
                throw new Error(
                    `L'upgrade avec le nom ${args.name} n'existe pas`)

            } else {
                
                upgrade.unlocked = true
                context.world.money -= upgrade.seuil

                let produit = context.world.products.find(p => p.id === upgrade.idcible)

                if (produit === undefined) {
                    throw new Error(
                        `Le produit avec l'id ${upgrade.idcible} n'existe pas`)
                } else {
                    if (upgrade.typeratio == "vitesse") {
                        produit.vitesse = Math.round(produit.vitesse / upgrade.ratio)
                    }
                    if (upgrade.typeratio == "gain") {
                        produit.revenu = produit.revenu * upgrade.ratio
                    }
                }
                
            }
            saveWorld(context)
            return upgrade
        },
        resetWorld(parent, args, context) {
            scalcScore(context)

            if ((Math.round(150 * Math.sqrt(context.world.score / Math.pow(10, 15))) - context.world.totalangels)<0){
                context.world.activeangels += Math.round(150 * Math.sqrt(context.world.score / Math.pow(10, 10))) - context.world.totalangels
                context.world.totalangels = Math.round(150 * Math.sqrt(context.world.score / Math.pow(10, 10)))
            }

            let totalangels = context.world.totalangels
            let activeangels = context.world.activeangels

            let world = require("./world")
            
            context.world = world

            context.world.totalangels = totalangels
            context.world.activeangels = activeangels

            scalcScore(context)
            saveWorld(context)
            return context.world
        },
        acheterAngelUpgrade(parent, args, context) {
            scalcScore(context)
            let angelUpgrade = context.world.angelupgrades.find(angelUp => angelUp.name === args.name)

            if (angelUpgrade === undefined) {
                throw new Error(
                    `Le angelUpgrade avec le nom ${args.name} n'existe pas`)
            } else {
                angelUpgrade.unlocked = true

                if (angelUpgrade.typeratio == "ange") {
                    context.world.angelbonus += angelUpgrade.ratio
                } else {
                    context.world.products.forEach(produit => {

                        if (angelUpgrade.typeratio == "vitesse") {
                            produit.vitesse = Math.round(produit.vitesse / angelUpgrade.ratio)
                        }
                        if (angelUpgrade.typeratio == "gain") {
                            produit.revenu = produit.revenu * angelUpgrade.ratio
                        }

                    })
                }
                context.world.activeangels -= angelUpgrade.seuil
                saveWorld(context)
                return angelUpgrade
            }
        }
    },
};