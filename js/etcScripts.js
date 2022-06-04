// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
    parent = $(parent);
    parent.empty();
}


// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#answer-2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


// me
function getLatestStuff() {
    $('#latest-itemData_itemNames').val(JSON.stringify(itemNames));
    $('#latest-itemData_knownItemNames').val(JSON.stringify(knownItemNames));
    $('#latest-itemData_knownItemImages').val(JSON.stringify(knownItemImages));
    $('#latest-itemData_itemsByType').val(JSON.stringify(itemsByType));
    $('#latest-itemData_itemsAndTheirTypes').val(JSON.stringify(itemsAndTheirTypes));
    $('#latest-itemData_equipmentStats').val(JSON.stringify(equipmentStats));
    console.log('It ran.');
}

// me
function checkForProblems() {
    // problems with item prices
    resultList = [];
    problematicIDs = [];
    validItemIDs.forEach(function(id) {
        if (!(id in shopWorths)) {
            if (!resultList.includes('missing item worths')) {
                resultList.push('missing item worths');
            }
            problematicIDs.push(id);
        }
    });
    result = organizeResultList(resultList);
    console.warn('From "problemsWithItemPrices": ' + JSON.stringify(problematicIDs));
    // problems with item names
    resultList = [];
    problematicIDs = [[], []];
    validItemIDs.forEach(function(id) {
        if (!(knownItemNames.includes(id))) {
            if (!resultList.includes('missing id in knownItemNames')) {
                resultList.push('missing id in knownItemNames');
            }
            problematicIDs[0].push(id);
        }
    });
    knownItemNames.forEach(function(id) {
        if (!(id in itemNames)) {
            if (!resultList.includes('missing item name in itemNames')) {
                resultList.push('missing item name in itemNames');
            }
            problematicIDs[1].push(id);
        }
    });
    result = organizeResultList(resultList);
    if (problematicIDs[0].length || problematicIDs[1].length) {
        console.warn('From "problemsWithItemNames": ' + JSON.stringify(problematicIDs));
    }
}
$(checkForProblems());

// me
function organizeResultList(results) {
    if (results.length > 0) {
        result = '⚠️ ';
        for (let i = 0; i < results.length; i++) {
            if (i == 0) {
                result = result + results[0].charAt(0).toUpperCase() + results[0].slice(1);
            }
            else {
                result = result + ', ' + results[i];
            }
        }
        result = result + '. The problematic itemIDs are in the console. ⚠️';
    }
    else {
        result = '🟢 All good 🟢';
    }
    return result;
}

// https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
$('.textTightContainer input').on('click', () => {
    const $temp = $('<input>');
    $('body').append($temp);
    $temp.val($(event.currentTarget).val()).select();
    document.execCommand('copy');
    $temp.remove();
});

// me
function doNothing() {
    return;
}

// https://stackoverflow.com/questions/16868122/mousemove-very-laggy/29276058#answer-29263341    with some tweaks but it's practically the same
var SQUAREposX; var SQUAREposY;
$('body').on('mousemove', function(event) {
    event.preventDefault();
    SQUAREposX = event.pageX;
    SQUAREposY = event.pageY;
    scheduleToGameLoop(0, showBigImg);
});

function showBigImg() {
    let x = SQUAREposX-14;
    let y = SQUAREposY-14;
    $('#draggedItemHolder').css({
        '-webkit-transform': 'translateX(' + x + 'px) translateY(' + y + 'px)',
        'transform': 'translateX(' + x + 'px) translateY(' + y + 'px)'
    });
}

// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript#answer-7228322
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// me
function preloadImages(array) {
    array.forEach((data) => {
        let img = new Image();
        img.src = data;
        img.classList = ['preloading'];
        $('body').append(img);
    });
}

$(preloadImages(["./files/hit/0.png", "./files/hit/1.png", "./files/hit/2.png", "./files/hit/3.png", "./files/hit/4.png", "./files/hit/5.png", "./files/hit/6.png", "./files/hit/7.png", "./files/hit/8.png", "./files/hit/9.png", "./files/levelup.png", './files/pointsEnabled.png', './files/pointsDisabled.png']));

$(() => {
    let snackbarContainer = document.getElementById('snackbarHolderForSaving');
    let showSnackbarButton = document.getElementById('saveButton');
    showSnackbarButton.addEventListener('click', () => {
        'use strict';
        let data = {
            message: 'Game saved successfully.',
            timeout: 2400
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
});


// https://stackoverflow.com/questions/2010892/how-to-store-objects-in-html5-localstorage#answer-3146971
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

// me
$(() => {
    let data = window.localStorage.getObject('character');
    if (data) {
        let oldCharacter = character;
        character = data;
        Object.keys(oldCharacter.stats).forEach((stat) => {
            if (!(stat in character.stats)) {
                character.stats[stat] = 1;
                character.compoundedStats[stat] = 1;
                getCompoundedStats(stat);
            }
        });
        updateExpBar();
        makeSkillCards();
        makeKeybindableThingsDraggable();
        if (character.info.skillPoints[0] > 1) {
            document.getElementById('skillPoints').innerHTML = character.info.skillPoints[0];
            makeSkillPointsAllocateable();
        }
        Object.keys(character.skillLevels).forEach((skill) => {
            skillOnlyLoadComputedVars(skill);
        });
    }
    else {
        makeSkillCards();
        makeKeybindableThingsDraggable();
    }
    data = window.localStorage.getObject('activeBuffs');
    if (data) {
        activeBuffs = data;
        buffsThatNeedToBeDrawn = Object.keys(activeBuffs);
    }
    let skillTabs = document.getElementsByClassName('skillTab');
    if (character.info.level > 10) {
        skillTabs[1].style.visibility = '';
    }
    if (character.info.level > 30) {
        skillTabs[2].style.visibility = '';
    }
    if (character.info.level > 60) {
        skillTabs[3].style.visibility = '';
    }
    if (character.info.level > 100) {
        skillTabs[4].style.visibility = '';
    }
    data = window.localStorage.getObject('inventory');
    if (data) {
        inventory = data;
        addFunctionsToInventory();
        inventoryLoad();
    }
    data = window.localStorage.getObject('equipment');
    if (data) {
        itemsInEquipmentSlots = data;
        equipmentLoad();
        updateCharacterDisplay();
        loadAvatar();
    }
    data = window.localStorage.getObject('doubloons');
    if (data) {
        doubloons = data;
        updateDoubloons(0);
    }
    data = window.localStorage.getObject('storageItems');
    if (data) {
        shopInventories[80002] = data;
        data = window.localStorage.getObject('storageStock');
        shopStocks[80002] = data;
    }
    data = window.localStorage.getObject('currentZone');
    if (data) {
        currentZone = data;
    }
    data = window.localStorage.getObject('keybinds');
    if (data) {
        keybindReferences = data;
        Object.keys(keybindReferences).forEach((key) => {
            if (keybindReferences[key].type == 'skill') {
                addSkillToKeybinds(keybindReferences[key].id, key);
            }
        });
    }
    else {
        addSkillToKeybinds(60001217, '0');
        addSkillToKeybinds(60001216, '9');
        addSkillToKeybinds(61001000, 'x');
        addSkillToKeybinds(61001101, 'c');
        addSkillToKeybinds(61101002, 'a');
        addSkillToKeybinds(61101004, 's');
        addSkillToKeybinds(61101100, 'd');
        addSkillToKeybinds(61101101, 'f');
    }
    loadPortals();
    let amountToSpawn = (MAX_MOBS-$('.mob').length);
    for (i=0; i<amountToSpawn; i++) {
        spawn(getMob());
    }
    setInterval(() => {
        if ($('.mob').length < MAX_MOBS) {
            console.log("Respawning mobs");
            let amountToSpawn = (MAX_MOBS-$('.mob').length);
            for (i=0; i<amountToSpawn; i++) {
                spawn(getMob());
            }
        }
    }, 6680);
});

function saveAlmostEverything() {
    window.localStorage.setObject('character', character);
    window.localStorage.setObject('activeBuffs', activeBuffs);
    window.localStorage.setObject('inventory', inventory);
    window.localStorage.setObject('equipment', itemsInEquipmentSlots);
    window.localStorage.setObject('doubloons', doubloons);
    window.localStorage.setObject('storageItems', shopInventories[80002]);
    window.localStorage.setObject('storageStock', shopStocks[80002]);
    window.localStorage.setObject('currentZone', currentZone);
    window.localStorage.setObject('keybinds', keybindReferences);
    
    console.log('Game saved');
}

// https://stackoverflow.com/questions/4270485/drawing-lines-on-html-page#answer-5912283
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    line.classList = ['debugLine'];
    var styles = 'border: 1px solid red; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);  
    return line;
}
function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}

function addMissingSkillPoints() {
    character.info.skillPoints[1] = (character.info.level) * 3;
    character.info.skillPoints[2] = (character.info.level-29) * 3;
    character.info.skillPoints[3] = (character.info.level-59) * 3;
}

// me
// the problem is css's transform: rotation thing starts at the top and goes clockwise rather than starting at the right and going counter-clockwise
function angleFixer(angle) { // input a normal angle and get back a transform:rotation angle.
    return - ((90 + angle) % 360) + 180; // all of this is in degrees
}

// me
function secondsToReadableTime(seconds) {
    let minutes = parseInt(seconds / 60);
    let realSeconds = parseInt(seconds - minutes * 60);
    if (realSeconds < 10) {
        return minutes + ':0' + realSeconds;
    }
    else {
        return minutes + ':' + realSeconds;
    }
}
