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
        acheterQtProduit(parent, args, context){
            let produit = context.world.products.find(p => p.id === args.id)

            if (produit === undefined){
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            }else{}
        }
    }
};

