class EquipItem {
    constructor(itemID, craftedStats={}) {
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
        this.craftedStats = craftedStats;
    }
    generateRNGStats() {
        const numberOfChanges = Math.floor(Math.random() * 3);
        for (let j=0; j<numberOfChanges; j++) {
            const changeQuality = Math.floor(Math.random() * 2);
            let statToChange = Math.floor(Math.random() * Object.keys(this.stats).length);
            statToChange = Object.keys(this.stats)[statToChange];
            if (changeQuality) { // (1) good roll
                this.stats[statToChange] += 1;
            }
            else { // (0) bad roll
                const neutralChange = Math.floor(Math.random() * 2);
                if (!neutralChange) {
                    this.stats[statToChange] -= 1;
                }
            }
        }
    }
}

function getUsedStats(stats) {
    const usedStats = [];
    Object.keys(stats).forEach(function(stat) {
        if (stats[stat] != 0 && stat != 'reqLevelEquip') {
            usedStats.push(stat);
        }
    });
    return usedStats;
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
    'Glove': [23],
    'Cape': [24],
    'Shoes': [27]
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
    'Glove': 'Gloves',
    'Cape': 'Cape',
    'Shoes': 'Shoes'
};

function canEquipToHere(desiredSlot, itemSlot) {
    console.log(desiredSlot);
    console.log(itemSlot);
    let itemID = 0;
    if (itemSlot < 30) {
        itemID = inventory.DetailedEquip[itemSlot].id;
    }
    else {
        itemID = itemsInEquipmentSlots[itemSlot-30].id;
    }
    if (equipmentStats[itemID]['reqLevelEquip'] > character.info.level) {
        return false;
    }
    else {
        let actualType = '';
        switch (itemsAndTheirTypes[itemID][1]) {
            case 'Accessory':
            case 'Armor':
                actualType = itemsAndTheirTypes[itemID][2];
                break;
            case 'Two-Handed Weapon':
            case 'One-Handed Weapon':
                actualType = 'Weapon';
                break;
            case 'Secondary Weapon':
                actualType = 'Sub Weapon';
                break;
            default: // assuming no others need specific help to find their slot
                actualType = itemsAndTheirTypes[itemID][2]; // not sure what others could have so this should be safe
                break;
        }
        if (slotRestrictions[actualType].includes(desiredSlot-30)) {
            return true;
        }
        else {
            return false;
        }
    }
}

$(document).ready(function() {
    for (let i = 0; i < 6; i++) {
        $('#equipmentSlotsArea').append('<tr class="row"><td class="equipmentSlot"></td><td class="equipmentSlot"></td><td class="equipmentSlot"></td><td class="equipmentSlot"></td><td class="equipmentSlot"></td></tr>');
    };

    for (var slot = 0; slot < 30; slot++) {
        $('.equipmentSlot:eq(' + slot + ')').attr('data-slotID', 30+slot);
    }

    disabledSlots.forEach(function(value) {
        $('.equipmentSlot:eq(' + value + ')').addClass('disabledSlot');
    });

    Object.keys(slotRestrictions).forEach(function(key) {
        const slots = slotRestrictions[key];
        slots.forEach(function(slot) {
            $('.equipmentSlot:eq(' + slot + ')').append('<span class="slotRestrictionHelper">' + slotText[key].toUpperCase() + '</span>');
        });
    });

    for (var slot = 0; slot < 30; slot++) {
        $('.equipmentSlot:eq(' + slot + ')').addClass('emptyEquipmentSlot');
    }

    character.equipment.length = 30;
    character.equipment.fill({}, 0, 30);

    itemsInEquipmentSlots = [new EquipItem(1112434, {luck: 5, evasion: 13, luckPercent: 18})];
    itemsInEquipmentSlots.length = 30;
    itemsInEquipmentSlots.fill(0, 1, 30);

    equipmentLoad();
});

function getEquipmentCompoundStats(item) {
    stats = {};
    usedCraftedStats = Object.keys(item.craftedStats);
    item.usedStats.forEach(function(value) {
        if (usedCraftedStats.includes(value)) {
            stats[value] = item.craftedStats[value] + item.stats[value];
        }
        else {
            stats[value] = item.stats[value];
        }
    });
    usedCraftedStats.forEach(function(value) {
        if (!item.usedStats.includes(value)) {
            stats[value] = item.craftedStats[value];
        }
    });
    return stats;
}

function equipmentLoad() {
    $('.equipmentSlot:not(.disabledSlot) div').remove();
    itemsInEquipmentSlots.forEach(function(value, slot) {
        if (value) {
            $('.equipmentSlot:eq(' + slot + ') .slotRestrictionHelper').css('visibility', 'hidden');
            $('.equipmentSlot:eq(' + slot + ')').removeClass('emptyEquipmentSlot');
            itemImageSetup(value.id, processEquipmentImages, slot);
            character.equipment[slot] = getEquipmentCompoundStats(value);
        }
    });
    updateCharacterDisplay();
    makeDraggableItemsDraggable();
    $('.equipmentSlot').mousemove(function(event) {
        if (isSomethingBeingDragged) { // someone wants to swap items
            prepareToSwapItems(event, 1);
        }
        else { // nevermind
            prepareToSwapItems(event, 0);
        }
    });

    $('.equipmentSlot').mouseleave(function(event) {
        prepareToSwapItems(event, 0);
    });
}


function equipmentLoadOne(theItem, slot) {
    $('.equipmentSlot:eq(' + slot + ') .slotRestrictionHelper').css('visibility', 'hidden');
    $('.equipmentSlot:eq(' + slot + ')').removeClass('emptyEquipmentSlot');
    itemImageSetup(theItem.id, processEquipmentImages, slot);
    character.equipment[slot] = getEquipmentCompoundStats(theItem);

    updateCharacterDisplay();
    makeDraggableItemsDraggable();

    target = $('.equipmentSlot:eq(' + slot + ')');
    target.mousemove(function(event) {
        if (isSomethingBeingDragged) { // someone wants to swap items
            prepareToSwapItems(event, 1);
        }
        else { // nevermind
            prepareToSwapItems(event, 0);
        }
    });

    target.mouseleave(function(event) {
        prepareToSwapItems(event, 0);
    });
}

function processEquipmentImages(img, slot) {
    itemHolder = equipmentItemHolderSetup(slot, img);
    $('.equipmentSlot:eq(' + slot + ')').append(itemHolder);
}

function equipmentItemHolderSetup(slot, img) {
    const itemID = itemsInEquipmentSlots[slot].id;
    // tooltip area
    tooltip = document.createElement('div');
    tooltip.classList = ['itemTooltip'];

    tooltipName = document.createElement('div');
    tooltipName.innerHTML = itemNames[itemID];
    tooltipName.classList = ['tooltipName'];

    tooltipTopArea = document.createElement('div');
    tooltipTopArea.classList = ['tooltipTopArea'];

    tooltipBottomArea = document.createElement('div');
    tooltipBottomArea.classList = ['tooltipBottomArea'];

    tooltipTopArea.appendChild(img.cloneNode());

    levelReqText = document.createElement('div');
    levelReqText.innerHTML = 'REQ LEV: '.concat(itemsInEquipmentSlots[slot]['stats']['reqLevelEquip']);
    tooltipTopArea.appendChild(levelReqText);

    categoryText = document.createElement('div');
    categoryText.innerHTML = 'CATEGORY: '.concat(itemsInEquipmentSlots[slot]['exactType']);
    tooltipBottomArea.appendChild(categoryText);

    statsTextArea = document.createElement('div');
    statsTextArea.classList = ['tooltipStatsTextArea'];
    itemsInEquipmentSlots[slot]['usedStats'].forEach(function(stat) {
        const statText = document.createElement('div');
        statText.innerHTML = ''.concat(inventoryStatPairs[stat], ': +', itemsInEquipmentSlots[slot]['stats'][stat]);
        if (stat == 'bossDamageMultiplier') {
            statText.innerHTML += '%';
        }
        statsTextArea.appendChild(statText);
    });
    Object.keys(itemsInEquipmentSlots[slot]['craftedStats']).forEach(function(stat) {
        const statText = document.createElement('div');
        statText.classList = ['craftedStat'];
        if (stat.includes('Percent')) {
            statName = stat.slice(0, stat.length-7);
            statText.innerHTML = ''.concat(inventoryStatPairs[statName], ': +', itemsInEquipmentSlots[slot]['craftedStats'][stat], '%');
        }
        else {
            statText.innerHTML = ''.concat(inventoryStatPairs[stat], ': +', itemsInEquipmentSlots[slot]['craftedStats'][stat]);
            if (stat == 'bossDamageMultiplier') {
                statText.innerHTML += '%';
            }
        }

        statsTextArea.appendChild(statText);
    });
    tooltipBottomArea.appendChild(statsTextArea);


    tooltip.appendChild(tooltipName);
    tooltip.appendChild(tooltipTopArea);
    tooltip.appendChild(tooltipBottomArea);
    // itemHolder area
    itemHolder = document.createElement('div');
    itemHolder.classList = ['draggableItem itemHolder'];
    itemHolder.appendChild(tooltip);
    itemHolder.appendChild(img);

    $(itemHolder).on('mousemove', function(event) {
        $(event.currentTarget).children('.itemTooltip').css({
            'left': event.pageX - 240,
            'top': event.pageY + 16,
            'visibility': 'visible'
        });
    });
    $(itemHolder).on('mouseleave', function(event) {
        $(event.currentTarget).children('.itemTooltip').css({
            'visibility': 'hidden'
        });
    });
    return itemHolder;
}

function getEquipmentByLevel(min, max) {
    let theseItems = [];
    Object.keys(equipmentStats).forEach(function(id) {
        if (min <= equipmentStats[id].reqLevelEquip && equipmentStats[id].reqLevelEquip <= max) {
            theseItems.push(id);
        };
    })
    return theseItems;
}
