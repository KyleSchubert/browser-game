class EquipItem {
    constructor(itemID) {
        itemID = parseInt(itemID);
        this.id = itemID;
        this.mainType = itemsAndTheirTypes[itemID][0];
        this.subType = itemsAndTheirTypes[itemID][1];
        this.exactType = itemsAndTheirTypes[itemID][2];

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

// makes the slots
const disabledSlots = [1, 3, 6, 8, 20, 25, 26, 28, 29];
const slotRestrictions = {
    'Ring': [0, 5, 10, 15],
    'Hat': [2],
    'Emblem': [4],
    'Face Accessory': [7],
    'Badge': [9],
    'Pendant': [11],
    'Eye Decoration': [12],
    'Earrings': [13],
    'Medal': [14],
    'Weapon': [16],
    'Top': [17],
    'Shoulder Accessory': [18],
    'Sub Weapon': [19],
    'Belt': [21],
    'Bottom': [22],
    'Gloves': [23],
    'Cape': [24],
    'Shoes': [27],
};
const slotText = {
    'Ring': 'Ring',
    'Hat': 'Hat',
    'Emblem': 'Emblem',
    'Face Accessory': 'Face Acc',
    'Badge': 'Badge',
    'Pendant': 'Pendant',
    'Eye Decoration': 'Eye Acc',
    'Earrings': 'Earrings',
    'Medal': 'Medal',
    'Weapon': 'Weapon',
    'Top': 'Top',
    'Bottom': 'Bottom',
    'Shoulder Accessory': 'Shoulder',
    'Sub Weapon': 'Sub Weapon',
    'Belt': 'Belt',
    'Bottom': 'Bottom',
    'Gloves': 'Gloves',
    'Cape': 'Cape',
    'Shoes': 'Shoes'
}

$(document).ready(function() {
    for (var i = 0;  i < 6; i++) {
        $("#equipmentSlotsArea").append('<tr class="row"><td class="equipmentSlot"></td><td class="equipmentSlot"></td><td class="equipmentSlot"></td><td class="equipmentSlot"></td><td class="equipmentSlot"></td></tr>');
    };
    
    for (var slot = 0; slot < 30; slot++) {
        $('.equipmentSlot:eq(' + slot + ')').attr('data-slotID', slot)
    }

    disabledSlots.forEach(function(value) {
        $('.equipmentSlot:eq(' + value + ')').addClass('disabledSlot')
    })

    Object.keys(slotRestrictions).forEach(function(key) {
        let slots = slotRestrictions[key];
        slots.forEach(function(slot) {
            $('.equipmentSlot:eq(' + slot + ')').append('<span class="slotRestrictionHelper">' + slotText[key].toUpperCase() + '</span>')
        })
    })

    loadEquipment()
})

function loadEquipment() {
    for (var slot = 0; slot < 30; slot++) {
        $('.equipmentSlot:eq(' + slot + ')').addClass('emptyEquipmentSlot')
    }
}

