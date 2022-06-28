var currentHoveredDropItem = '';

function itemDropSetup(img, aligner) {
    $(img).on('click mouseenter mouseleave', (event) => {
        if (event.type == 'click') {
            lootItem(event.currentTarget);
        }
        else {
            if (event.type == 'mouseenter') {
                currentHoveredDropItem = event.currentTarget;
            }
            else {
                currentHoveredDropItem = '';
            }
        }
    });
    img.classList.add('droppedItem');
    const div = document.createElement('div');
    div.classList = ['itemAnimationHelper'];
    document.getElementById('lootSurface').appendChild(aligner);
    $('.dropAligner').last().append(div);
    $('.itemAnimationHelper').last().append(img);
    return;
}

function itemImageSetup(itemID, callback, slot=999999, additionalElementAttibutes={}) {
    itemID = parseInt(itemID);
    if (knownItemImages.includes(itemID)) {
        url = './item/'.concat(itemID).concat('/icon.png');
        img = setupImage(url, itemID);
        Object.keys(additionalElementAttibutes).forEach((key) => {
            img.setAttribute(key, additionalElementAttibutes[key]);
        });
        if (slot != 999999) {
            callback(img, slot);
        }
        else {
            return callback(img);
        }
    }
    else {
        $.ajax({
            url: './item/'.concat(itemID).concat('/icon.png'),
            type: 'HEAD',
            error: () => {
                img = getItemURL(itemID).concat('/icon');
                knownItemImages.push(itemID);
                img = setupImage(img, itemID);
                Object.keys(additionalElementAttibutes).forEach((key) => {
                    img.setAttribute(key, additionalElementAttibutes[key]);
                });
                if (slot != 999999) {
                    callback(img, slot);
                }
                else {
                    return callback(img);
                }
            },
            success: () => {
                img = './item/'.concat(itemID).concat('/icon.png');
                knownItemImages.push(itemID);
                img = setupImage(img, itemID);
                Object.keys(additionalElementAttibutes).forEach((key) => {
                    img.setAttribute(key, additionalElementAttibutes[key]);
                });
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

const doubloonDimensions = {
    9000000: [35, 32], 9000001: [35, 32], 9000002: [37, 36], 9000003: [32, 33], 9000004: [46, 46]
};

function setupImage(url, itemID) {
    if (between(itemID, 9000000, 9000004)) { // doubloons -> they need to be animated
        let finishedImage = document.createElement('div');
        finishedImage.style.backgroundImage = 'url(' + url + ')';
        finishedImage.style.width = doubloonDimensions[itemID][0] + 'px';
        finishedImage.style.height = doubloonDimensions[itemID][1] + 'px';
        scheduleToGameLoop(0, genericSpritesheetAnimation, [[finishedImage], 0, [200, 200, 200, 200], false, true]);
        finishedImage.classList = ['item clickable'];
        finishedImage.value = itemID;
        return finishedImage;
    }
    else {
        let finishedImage = new Image();
        finishedImage.src = url;
        finishedImage.onerror=() => { // this seems to fix the problem of items RARELY not loading when they drop onto the ground
            finishedImage.src = url;
        };
        finishedImage.setAttribute('draggable', false);
        finishedImage.classList = ['item clickable'];
        finishedImage.value = itemID;
        return finishedImage;
    }
}

function dropLoot(mobName, left=540, top=400, dropCount=0, doubloonCount=0.7, unknown=false, justGetThem=false) {
    const aligner = document.createElement('div');
    aligner.classList = ['dropAligner'];
    aligner.style.width = ''.concat(dropCount*32, 'px');
    aligner.value = dropCount;
    aligner.style.left = ''.concat(left - dropCount*32/2 + 16, 'px');
    aligner.style.top = top - 46 + 'px';
    if (justGetThem) {
        let stuff = getUnknownItems();
        for (let i = 0; i < stuff.length; i++) {
            let id = (stuff[i]).toString();
            itemImageSetup(id, itemDropSetup, aligner);
            memorizeItemType(id);
        }
    }
    else {
        for (let i = 0; i < dropCount; i++) {
            let choices = [];
            if (unknown) {
                choices = getUnknownItems();
                if (choices.length == 0) {
                    choices = [4000001];
                }
            }
            else {
                let pool = mobDropPools[mobName][Math.floor(Math.random() * mobDropPools[mobName].length)];
                choices = dropPoolDefinitions[pool];
            }
            let id = choices[Math.floor((Math.random() * choices.length))];
            itemImageSetup(id, itemDropSetup, aligner);
            memorizeItemType(id);
        }
    }
    while (doubloonCount > 0) {
        if (doubloonCount < 1) {
            if (Math.random() > doubloonCount) {
                return;
            }
        }
        let doubloonsAmount = randomIntFromInterval(28, 32) + mobLevelToExp[mobLevels[mobName]]; // TEMPORARY EXAMPLE
        if (doubloonsAmount < 1) { // should never happen normally
            doubloonsAmount = 1;
        }
        let doubloonId = dropDoubloons(doubloonsAmount);
        itemImageSetup(doubloonId, itemDropSetup, aligner, {'doubloons-amount': doubloonsAmount});
        doubloonCount--;
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

// 'strength', 'dexterity', 'intelligence', 'luck', 'hp', 'mp', 'physicalAttack', 'magicAttack', 'bossDamageMultiplier'
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
    url = 'https://maplestory.io/api/GMS/217/item/'.concat(id);
    return url;
}

function dropDoubloons(amount) {
    if (between(amount, 1, 49)) {
        return 9000000;
    }
    else if (between(amount, 50, 99)) {
        return 9000001;
    }
    else if (between(amount, 100, 999)) {
        return 9000002;
    }
    else if (amount >= 1000) {
        return 9000003;
    }
}
