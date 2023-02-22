module.exports = {
    "name": "YouTube",
    "logo": "icones/logomonde.jpg",
    "money": 0,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": 0,
    "products": [
        {
            "id": 1,
            "name": "Thread horreur",
            "logo": "icons/ThreadHorreur.jpg",
            "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [
                {
                    "name": "Témoignage",
                    "logo": "icones/premierpalier.jpg",
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Dans un chateau",
                    "logo": "icones/deuxiemepalier.jpg",
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Dans la fôret",
                    "logo": "icones/deuxiemepalier.jpg",
                    "seuil": 100,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        },
        {
            "id": 2,
            "name": "Essayer de ne pas rire",
            "logo": "icones/EssayePasRire.jpg",
            "cout": 60,
            "croissance": 1.15,
            "revenu": 60,
            "vitesse": 3000,
            "quantite": 0,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [
                {
                    "name": "Tiktok",
                    "logo": "icones/premierpalier.jpg",
                    "seuil": 20,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "Insta",
                    "logo": "icones/deuxiemepalier.jpg",
                    "seuil": 75,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                },
                {
                    "name": "YouTube",
                    "logo": "icones/deuxiemepalier.jpg",
                    "seuil": 100,
                    "idcible": 2,
                    "ratio": 2,
                    "typeratio": "vitesse",
                    "unlocked": false
                }]
        }
    ],
    "allunlocks": [
        {
            "name": "Trophée Argent",
            "logo": "icones/TropheeArgent.jpg",
            "seuil": 30,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": false
        }, 
        {
            "name": "Trophée Or",
            "logo": "icones/TropheeOr.jpg",
            "seuil": 60,
            "idcible": 0,
            "ratio": 2,
            "typeratio": "gain",
            "unlocked": false
        }
    ],
    "upgrades": [
        {
            "name": "ft. Natoo",
            "logo": "icones/Natoo.png",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "vitesse",
            "unlocked": false
        },
        {
            "name": "ft. Mastu",
            "logo": "icones/Mastu.png",
            "seuil": 1e4,
            "idcible": 2,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "ft. Pierre Croce",
            "logo": "icones/PierreCroce.png",
            "seuil": 1e5,
            "idcible": 1,
            "ratio": 2,
            "typeratio": "ange",
            "unlocked": false
        }
    ],
    "angelupgrades": [
        {
            "name": "Scandale fraude",
            "logo": "icones/angel.png",
            "seuil": 10,
            "idcible": 0,
            "ratio": 3,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Scandale arnaque",
            "logo": "icones/angel.png",
            "seuil": 10,
            "idcible": 0,
            "ratio": 6,
            "typeratio": "gain",
            "unlocked": false
        }
    ],
    "managers": [
        {
            "name": "Squeezie",
            "logo": "icones/Squeezie.png",
            "seuil": 10,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": false
        },
        {
            "name": "Joyca",
            "logo": "icones/WangariMaathai.jpg",
            "seuil": 100,
            "idcible": 2,
            "ratio": 0,
            "typeratio": "gain",
            "unlocked": false
        }
    ]
};