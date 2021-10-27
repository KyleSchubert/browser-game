function itemDropSetup(img, aligner) {
    console.log(img)
    $(img).on('click', img, lootItem);
    img.classList.add('droppedItem');
    const div = document.createElement('div');
    div.classList = ['itemAnimationHelper'];
    document.getElementById('lootSurface').appendChild(aligner);
    $('.dropAligner').last().append(div);
    $('.itemAnimationHelper').last().append(img);
}

function itemImageSetup(itemID, callback, slot=999999) {
    if (knownItemImages.includes(itemID)) {
        url = '/item/'.concat(itemID).concat('/icon.png');
        img = setupImage(url, itemID);
        if (slot != 999999) {
            callback(img, slot);
        }
        else {
            return callback(img);
        }
    }
    else {
        $.ajax({
            url: '/item/'.concat(itemID).concat('/icon.png'),
            type: 'HEAD',
            error: function() {
                img = getItemURL(itemID).concat('/icon');
                knownItemImages.push(itemID);
                img = setupImage(img, itemID);
                if (slot != 999999) {
                    callback(img, slot);
                }
                else {
                    return callback(img);
                }
            },
            success: function() {
                img = '/item/'.concat(itemID).concat('/icon.png');
                knownItemImages.push(itemID);
                img = setupImage(img, itemID);
                if (slot != 999999) {
                    callback(img, slot);
                }
                else {
                    return callback(img);
                }
            }
        });
    }
}

function setupImage(url, itemID) {
    const finishedImage = new Image();
    finishedImage.classList = ['item clickable'];
    finishedImage.src = url;
    finishedImage.value = itemID;
    finishedImage.setAttribute('draggable', false);
    return finishedImage;
}

function dropLoot(dropCount=$('#dropCount').val()) {
    const aligner = document.createElement('div');
    aligner.classList = ['dropAligner'];
    aligner.style.width = ''.concat(dropCount*32, 'px');
    aligner.value = dropCount;
    const lootSurface = document.getElementById('lootSurface');
    if (lootSurface.lastElementChild) {
        aligner.style.zIndex = Number(lootArea.lastElementChild.style.zIndex)+1;
    }
    else {
        aligner.style.zIndex = 1;
    }
    aligner.style.marginLeft = ''.concat((lootArea.offsetWidth - dropCount*32)/2, 'px');
    for (let i = 0; i < dropCount; i++) {
        id = validItemIDs[Math.floor((Math.random() * validItemIDs.length))]; // FOR TESTING
        itemImageSetup(id, itemDropSetup, aligner);
        memorizeItemType(id);
    }
}


// overcat: {cat: {subcat: [itemID, itemID, ...]}}

// itemID: [overcat, cat, subcat]

function memorizeItemType(itemID) {
    if (typeof itemsAndTheirTypes[itemID] == 'undefined') {
        $.get(getItemURL(itemID), function(data) {
            typeInfo = data['typeInfo'];
            overcat = typeInfo['overallCategory'];
            cat = typeInfo['category'];
            subcat = typeInfo['subCategory'];
            if (typeof itemsByType[overcat][cat] == 'undefined') { // as in: if it doesn't exist yet, make it
                itemsByType[overcat][cat] = {};
            }
            if (typeof itemsByType[overcat][cat][subcat] == 'undefined') {
                itemsByType[overcat][cat][subcat] = [];
            }
            if (!itemsByType[overcat][cat][subcat].includes(itemID)) {
                itemsByType[overcat][cat][subcat].push(itemID);
            }
            if (typeof itemsAndTheirTypes[itemID] == 'undefined') {
                itemsAndTheirTypes[itemID] = [overcat, cat, subcat];
            }

            if (itemsAndTheirTypes[itemID][0] == 'Equip') {
                memorizeEquipmentStats(itemID, data['metaInfo']);
            }

            checkIfWeKnowTheItemName(itemID);
        });
    }
}

// 'strength', 'dexterity', 'intelligence', 'luck', 'hp', 'mp'
function memorizeEquipmentStats(itemID, stats) {
    if (typeof equipmentStats[itemID] == 'undefined') {
        const usedStats = Object.keys(stats);
        equipmentStats[itemID] = {};
        if (usedStats.includes('incSTR')) {
            equipmentStats[itemID]['strength'] = stats['incSTR'];
        }
        if (usedStats.includes('incDEX')) {
            equipmentStats[itemID]['dexterity'] = stats['incDEX'];
        }
        if (usedStats.includes('incINT')) {
            equipmentStats[itemID]['intelligence'] = stats['incINT'];
        }
        if (usedStats.includes('incLUK')) {
            equipmentStats[itemID]['luck'] = stats['incLUK'];
        }
        if (usedStats.includes('incMHP')) {
            equipmentStats[itemID]['hp'] = stats['incMHP'];
        }
        if (usedStats.includes('incMMP')) {
            equipmentStats[itemID]['mp'] = stats['incMMP'];
        }
        if (usedStats.includes('incPAD')) {
            equipmentStats[itemID]['physicalAttack'] = stats['incPAD'];
        }
        if (usedStats.includes('incMAD')) {
            equipmentStats[itemID]['magicAttack'] = stats['incMAD'];
        }
        if (usedStats.includes('bdR')) {
            equipmentStats[itemID]['bossDamageMultiplier'] = stats['bdR'];
        }
        if (usedStats.includes('reqLevelEquip')) {
            equipmentStats[itemID]['reqLevelEquip'] = stats['reqLevelEquip'];
        }
    }
}

function clearItems() {
    const lootSurface = document.getElementById('lootSurface');
    while (lootSurface.lastElementChild) {
        lootSurface.removeChild(lootSurface.lastElementChild);
    }
}

function getItemURL(id) {
    url = 'https://maplestory.io/api/GMS/210.1.1/item/'.concat(id);
    return url;
}
