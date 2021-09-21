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
        if (this.hasPrice) {
            this.price = shopWorths[itemID];
        }

        this.stats = {
            'dung': 0
        };
    }
    generateRNGStats() {
        let numberOfChanges = Math.floor(Math.random() * 3);
        for (i=0; i<numberOfChanges; i++) {
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