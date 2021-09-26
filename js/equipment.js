class EquipItem {
    constructor(itemID) {
        itemID = parseInt(itemID);
        this.id = itemID;
        this.mainType = itemsAndTheirTypes[itemID][0];
        this.subType = itemsAndTheirTypes[itemID][1];

        this.hasImage = knownItemImages.includes(itemID);

        this.hasName = knownItemNames.includes(itemID);
        this.hasPrice = Object.keys(shopWorths).includes(itemID.toString());
        
        if (this.hasName) {
            this.name = itemNames[itemID];
        }
        else {
            this.name = 'UNKNOWN_ITEM';
        }
        
        if (this.hasPrice) {
            this.price = shopWorths[itemID];
        }
        else {
            this.price = 1;
        }

        this.stats = equipmentStats[itemID];
        this.usedStats = getUsedStats(this.stats);
    }
    generateRNGStats() {
        let numberOfChanges = Math.floor(Math.random() * 3);
        for (let j=0; j<numberOfChanges; j++) {
            let changeQuality = Math.floor(Math.random() * 2);
            let statToChange = Math.floor(Math.random() * Object.keys(this.stats).length);
            statToChange = Object.keys(this.stats)[statToChange]
            if (changeQuality) { // (1) good roll
                this.stats[statToChange] += 1
            }
            else { // (0) bad roll
                let neutralChange = Math.floor(Math.random() * 2);
                if (!neutralChange) {
                    this.stats[statToChange] -= 1
                }
            }
        }
    }
}

function getUsedStats(stats) {
    let usedStats = [];
    Object.keys(stats).forEach(function(stat) {
        if (stats[stat] != 0 && stat != 'reqLevelEquip') {
            usedStats.push(stat)
        }
    });
    return usedStats
}