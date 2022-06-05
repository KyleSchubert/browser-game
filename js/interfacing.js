var isSomethingBeingDragged = false;
var isSellBoxReady = false;
var isSwapItemsReady = false;
var currentSwapDestination = '';

var itemBeingSold = '';
var itemBeingSoldCount = 0;
var itemBeingSoldId = 0;


function makeDraggableItemsDraggable() {
    $(function() {
        $('.draggableItem').draggable({
            start: function(event) {
                if (event.shiftKey) {
                    return false;
                }
                playSound(sounds[8]); // DragStart.mp3
                $(event.currentTarget).css('visibility', 'hidden');
                $('#draggedItemHolder').css('visibility', 'visible');
                isSomethingBeingDragged = true;
                if (inventoryCurrentSelectedTab.innerHTML == 'EQUIP') {
                    draggedThingType = 'equipItem';
                }
                else if (inventoryCurrentSelectedTab.innerHTML == 'USE') {
                    draggedThingType = 'useItem';
                }
                else if (inventoryCurrentSelectedTab.innerHTML == 'ETC') {
                    draggedThingType = 'etcItem';
                }
                $(event.currentTarget).css('pointer-events', 'none');
                let imgLink = $(event.currentTarget).children('img').attr('src');
                $('#draggedItemHolder').children('img').attr('src', imgLink);
            },
            stop: function() {
                $('#draggedItemHolder').css('visibility', 'hidden');
                $(this).css('visibility', '');
                isSomethingBeingDragged = false;
                $(this).css('pointer-events', 'auto');
                if (isSellBoxReady) { // THEY MUST BE TRYING TO SELL THE ITEM
                    itemBeingSoldCount = parseInt($(this).children('.itemCount').html());
                    if (!itemBeingSoldCount) {
                        itemBeingSoldCount = 1; // as in how many are in the dragged pile of items. NOT how many are they deciding to sell from that pile
                    }
                    itemBeingSoldId = $(this).children('.item').val();
                    itemBeingSold = this;
                    sellProcess();
                }
                else if (isSwapItemsReady) {
                    playSound(sounds[7]); // DragEnd.mp3
                    pickedUpItemSlot = this.parentElement.getAttribute('data-slotID');
                    targetSlot = currentSwapDestination;
                    const involvingEquipmentScreen = (pickedUpItemSlot > 29 || targetSlot > 29);
                    const involvingInventory = (pickedUpItemSlot < 30 || targetSlot < 30);
                    if (pickedUpItemSlot != targetSlot) {
                        if (involvingEquipmentScreen && !involvingInventory) {
                            if (canEquipToHere(targetSlot, pickedUpItemSlot)) {
                                $(this).remove();
                                $('[data-slotid="' + targetSlot + '"] .itemHolder').remove();
                                _ = itemsInEquipmentSlots[pickedUpItemSlot-30]; // for some reason, doing the usual [1, 2] = [2, 1]; swap gives an error so oh well
                                itemsInEquipmentSlots[pickedUpItemSlot-30] = itemsInEquipmentSlots[targetSlot-30];
                                itemsInEquipmentSlots[targetSlot-30] = _;
                                character.equipment[pickedUpItemSlot-30] = {};
                                character.equipment[targetSlot-30] = {};
                                if (itemsInEquipmentSlots[pickedUpItemSlot-30] != 0) {
                                    equipmentLoadOne(itemsInEquipmentSlots[pickedUpItemSlot-30], pickedUpItemSlot-30);
                                }
                                else {
                                    $('[data-slotid="' + pickedUpItemSlot + '"]').addClass('emptyEquipmentSlot');
                                    $('[data-slotid="' + pickedUpItemSlot + '"] .slotRestrictionHelper').removeAttr('style');
                                }
                                equipmentLoadOne(itemsInEquipmentSlots[targetSlot-30], targetSlot-30);
                                $('[data-slotid="' + targetSlot + '"]').removeClass('emptyEquipmentSlot');
                                $('[data-slotid="' + targetSlot + '"] .slotRestrictionHelper').css('visibility', 'hidden');
                            }
                            else {
                                $(this).css('left', '0px');
                                $(this).css('top', '0px');
                            }
                        }
                        else if (involvingEquipmentScreen && involvingInventory) {
                            const tab = inventory.readyName();
                            if (tab == 'Equip') {
                                if (pickedUpItemSlot > 29) {
                                    equippedItemSlot = pickedUpItemSlot;
                                    inventoryItemSlot = targetSlot;
                                }
                                else {
                                    equippedItemSlot = targetSlot;
                                    inventoryItemSlot = pickedUpItemSlot;
                                }
                                if (inventory.DetailedEquip[inventoryItemSlot]) {
                                    if (canEquipToHere(equippedItemSlot, inventoryItemSlot)) {
                                        removeAllChildNodes($('[data-slotid="' + inventoryItemSlot + '"]'));
                                        if (itemsInEquipmentSlots[equippedItemSlot-30]) { // swapping an equipped item with an unequipped one
                                            $('[data-slotid="' + equippedItemSlot + '"] .itemHolder').remove();
                                            const oldEquippedItem = itemsInEquipmentSlots[equippedItemSlot-30];
                                            itemsInEquipmentSlots[equippedItemSlot-30] = inventory.DetailedEquip[inventoryItemSlot];
                                            inventory.DetailedEquip[inventoryItemSlot] = oldEquippedItem;
                                            equipmentLoadOne(itemsInEquipmentSlots[equippedItemSlot-30], equippedItemSlot-30);
                                            inventoryLoadOne('Equip', inventoryItemSlot, inventory.DetailedEquip[inventoryItemSlot].id, false, inventory.DetailedEquip[inventoryItemSlot]);
                                        }
                                        else { // equipping an item into an empty slot
                                            itemsInEquipmentSlots[equippedItemSlot-30] = inventory.DetailedEquip[inventoryItemSlot];
                                            inventory.DetailedEquip[inventoryItemSlot] = 0;
                                            inventory.Equip[inventoryItemSlot] = 0;
                                            equipmentLoadOne(itemsInEquipmentSlots[equippedItemSlot-30], equippedItemSlot-30);
                                        }
                                        if (equipmentThatShowsUp.includes(equippedItemSlot-30)) {
                                            equipmentLatestChange = equippedItemSlot-30;
                                            loadAvatar();
                                        }
                                    }
                                    else {
                                        $(this).css('left', '0px');
                                        $(this).css('top', '0px');
                                    }
                                }
                                else { // unequipping an item
                                    $('[data-slotid="' + equippedItemSlot + '"] .itemHolder').remove();
                                    character.equipment[equippedItemSlot-30] = {};
                                    updateCharacterDisplay();
                                    $('[data-slotid="' + pickedUpItemSlot + '"]').addClass('emptyEquipmentSlot');
                                    $('[data-slotid="' + pickedUpItemSlot + '"] .slotRestrictionHelper').removeAttr('style');
                                    inventory.DetailedEquip[inventoryItemSlot] = itemsInEquipmentSlots[equippedItemSlot-30];
                                    inventory.Equip[inventoryItemSlot] = inventory.DetailedEquip[inventoryItemSlot].id;
                                    itemsInEquipmentSlots[equippedItemSlot-30] = 0;
                                    inventoryLoadOne('Equip', inventoryItemSlot, inventory.DetailedEquip[inventoryItemSlot].id, false, inventory.DetailedEquip[inventoryItemSlot]);
                                    if (equipmentThatShowsUp.includes(equippedItemSlot-30)) {
                                        equipmentLatestChange = equippedItemSlot-30;
                                        loadAvatar();
                                    }
                                }
                            }
                            else {
                                $(this).css('left', '0px');
                                $(this).css('top', '0px');
                            }
                        }
                        else { // just   involvingInventory
                            const targetTab = inventory.readyName();
                            removeAllChildNodes($('[data-slotid="' + targetSlot + '"]'));
                            $(this).remove();
                            if (targetTab == 'Equip') {
                                [inventory.DetailedEquip[targetSlot], inventory.DetailedEquip[pickedUpItemSlot]] = [inventory.DetailedEquip[pickedUpItemSlot], inventory.DetailedEquip[targetSlot]];
                            }
                            if (targetTab != 'Equip' && inventory[targetTab][pickedUpItemSlot] == inventory[targetTab][targetSlot]) { // same stackable item
                                if (inventory.counts[targetTab][pickedUpItemSlot] + inventory.counts[targetTab][targetSlot] >= 9999) {
                                    inventory.counts[targetTab][pickedUpItemSlot] += (inventory.counts[targetTab][targetSlot] - 9999);
                                    inventory.counts[targetTab][targetSlot] = 9999;
                                }
                                else {
                                    inventory.counts[targetTab][targetSlot] += inventory.counts[targetTab][pickedUpItemSlot];
                                    inventory.counts[targetTab][pickedUpItemSlot] = 0;
                                    inventory[targetTab][pickedUpItemSlot] = 0;
                                }
                            }
                            else {
                                [inventory[targetTab][targetSlot], inventory[targetTab][pickedUpItemSlot]] = [inventory[targetTab][pickedUpItemSlot], inventory[targetTab][targetSlot]];
                                [inventory.counts[targetTab][targetSlot], inventory.counts[targetTab][pickedUpItemSlot]] = [inventory.counts[targetTab][pickedUpItemSlot], inventory.counts[targetTab][targetSlot]];
                            }
                            previousHighlightedImage.remove();
                            if (inventory[targetTab][pickedUpItemSlot] != 0) {
                                inventoryLoadOne(targetTab, pickedUpItemSlot, inventory[targetTab][pickedUpItemSlot]);
                            }
                            inventoryLoadOne(targetTab, targetSlot, inventory[targetTab][targetSlot]);
                        }
                    }
                    else {
                        $(this).css('left', '0px');
                        $(this).css('top', '0px');
                    }
                }
                else {
                    $(this).css('left', '0px');
                    $(this).css('top', '0px');
                }
            },
            containment: 'window'
        });
    });
}

function prepareToSwapItems(event, yes) {
    if (yes) {
        currentSwapDestination = event.delegateTarget.getAttribute('data-slotID');
        isSwapItemsReady = true;
    }
    else {
        isSwapItemsReady = false;
    }
}

$('.sellArea').on('mousemove', function(event) {
    if (isSomethingBeingDragged) { // someone wants to sell something
        prepareSellBox(event, 1);
    }
    else { // they don't :^(
        prepareSellBox(event, 0);
    }
});

$('.sellArea').on('mouseleave', function(event) {
    prepareSellBox(event, 0);
});

const originalSellAreaBackgroundColor = $('.sellArea').css('background-color');
function prepareSellBox(event, yes) {
    if (yes) {
        isSellBoxReady = true;
        $(event.delegateTarget).css('background-color', 'rgb(218, 218, 218');
        $(event.delegateTarget).children('.beforeSellText1').css('visibility', 'hidden');
        $(event.delegateTarget).children('.beforeSellText2').css('visibility', 'hidden');
    }
    else {
        isSellBoxReady = false;
        $(event.delegateTarget).css('background-color', originalSellAreaBackgroundColor);
        $(event.delegateTarget).children('.beforeSellText1').css('visibility', 'inherit');
        $(event.delegateTarget).children('.beforeSellText2').css('visibility', 'inherit');
    }
}

function activateFastSell() {
    $('#slotsSpot .draggableItem:not(.fastSellReady)').on('mouseover', function(e) {
        if (e.shiftKey) {
            sellProcess(e.currentTarget);
        } 
    });
    $('#slotsSpot .draggableItem:not(.fastSellReady)').addClass('fastSellReady');
}

function addSelectionListener(node) { // BUYING AN ITEM BY CLICKING THE SELECTED THING AGAIN
    $(node).mousedown(function(event) {
        if ($('.selectedThing')[0]) {
            if ($('.selectedThing')[0] == $(this)[0]) {
                if ($(this).parent()[0].classList.contains('shopItemArea')) {
                    price = parseInt($('.selectedThing').eq(0).find('.itemCardPrice').text().replace(/,/g, ''));
                    if (doTheyHaveEnoughDoubloons(price)) {
                        dialogTrigger('shop');
                    }
                    else {
                        dialogTrigger('too expensive');
                    }
                }
            }
            $('.selectedThing')[0].classList.remove('selectedThing');
        }
        this.classList.add('selectedThing');
    });
}

var dialogAmountAreaAutoUpdateText = false; // self-explanatory
var dialogAmountAreaWhatAreWeDoing = ''; // used to keep track of what the dialog amount area is updating for
var dialogMainReason = ''; // used when the reason can't easily be given as an input to the function
var dialogSubReason = ''; // used typically with the above variable
function dialogTrigger(reason) {
    dialogPrepare(reason);
    dialogShow(reason);
}

var smallDialogBoxOpen = false;
function dialogShow(reason) {
    playSound(sounds[3]);
    dialogMainReason = reason;
    if (reason == 'shop') {
        dialogActivateInteractivityControl();
    }
    if (reason == 'too expensive') {
        dialogActivateInteractivityControl();
    }
}

function dialogActivateInteractivityControl() {
    smallDialogBoxOpen = true;
    $('#smallDialogBoxHolder').css('visibility', 'visible');
    $('#superBlocker').css('visibility', 'visible');
    $('#superBlocker').css('pointer-events', 'auto');
    $('#guiHolder #shopHolder div').css('pointer-events', 'none');
}

function dialogPrepare(reason) {
    prepareAmountInitialValue();
    prepareAmountRange();
    dialogPrepareText(reason);
    if (reason == 'shop') {
        if ((!weAreCurrentlySelling && itemsAndTheirTypes[shopGetItemId()][0] == 'Equip') || (weAreCurrentlySelling && inventory.readyName() == 'Equip')) {
            silentToggleVisibility(dialogTextArea);
        }
        else {
            silentToggleVisibility(dialogAmountArea);
            silentToggleVisibility(dialogTextArea);
        }
    }
    else if (reason == 'too expensive') { // only happens if buying an item
        dialogPrepareText(reason);
        silentToggleVisibility(dialogTextArea);
    }
}

const dialogTextArea = $('#smallTextArea');
const dialogAmountArea = $('#smallAmountArea');
var transferAmount = 1;
function dialogPrepareText(reason) {
    text = [];
    if (reason == 'shop') {
        dialogAmountAreaAutoUpdateText = true;
        dialogAmountAreaWhatAreWeDoing = 'shop';
        if (storageIsOpen) {
            if (weAreCurrentlySelling) {
                dialogSubReason = 'deposit';
                text.push('Would you like to deposit');
                itemName = itemNames[itemBeingSoldId].toString();
                itemPrice = '1';
            }
            else {
                dialogSubReason = 'withdraw';
                text.push('Would you like to withdraw');
                itemName = $('.selectedThing').eq(0).find('.itemCardName').text();
                itemPrice = $('.selectedThing').eq(0).find('itemCardPrice').text();
            }
            text.push('<strong>' + numberWithCommas(transferAmount) + 'x</strong>');
            text.push('<strong>' + itemName + '</strong>');
            itemPrice = parseInt(itemPrice.replace(/,/g, ''), 10); // https://stackoverflow.com/questions/4083372/in-javascript-jquery-what-is-the-best-way-to-convert-a-number-with-a-comma-int#answer-4083378
            itemPrice = numberWithCommas(transferAmount);
            text.push('for ' + itemPrice + ' ' + moneyWord + '?');
        }
        else {
            if (weAreCurrentlySelling) {
                dialogSubReason = 'sell';
                text.push('Would you like to sell');
                itemName = itemNames[itemBeingSoldId].toString();
                if (Object.keys(shopWorths).includes(itemBeingSoldId.toString())) {
                    itemPrice = shopWorths[itemBeingSoldId].toString();
                }
                else {
                    itemPrice = '1';
                }
            }
            else {
                dialogSubReason = 'buy';
                text.push('Would you like to purchase');
                itemName = $('.selectedThing').eq(0).find('.itemCardName').text();
                itemPrice = $('.selectedThing').eq(0).find('.itemCardPrice').text();
            }
            text.push('<strong>' + numberWithCommas(transferAmount) + 'x</strong>');
            text.push('<strong>' + itemName + '</strong>');
            itemPrice = parseInt(itemPrice.replace(/,/g, ''), 10); // https://stackoverflow.com/questions/4083372/in-javascript-jquery-what-is-the-best-way-to-convert-a-number-with-a-comma-int#answer-4083378
            itemPrice = numberWithCommas(itemPrice*transferAmount);
            text.push('for ' + itemPrice + ' ' + moneyWord + '?');
        }
    }
    else if (reason == 'too expensive') {
        text.push('This item cannot be afforded');
    }
    dialogSetText(text);
}

const originalAmountMinimum = 1;
const originalAmountMaximum = 9999;
var amountMinimum = originalAmountMinimum;
var amountMaximum = originalAmountMaximum;
function prepareAmountRange() {
    if ((!weAreCurrentlySelling && itemsAndTheirTypes[shopGetItemId()][0] == 'Equip') || (weAreCurrentlySelling && inventory.readyName() == 'Equip')) { // I guess this is a backup if i'm already hiding the input
        amountMinimum = 1; // ^ that is   "buying an Equip item   OR   selling an Equip item"
        amountMaximum = 1;
    }
    else if (weAreCurrentlySelling) {
        amountMinimum = originalAmountMinimum;
        amountMaximum = itemBeingSoldCount;
    }
    else {
        amountMinimum = originalAmountMinimum;
        if (shopGetStock()) {
            amountMaximum = Math.min(shopGetStock(), shopMaxAffordNumber());
        }
        else {
            amountMaximum = Math.min(originalAmountMaximum, shopMaxAffordNumber());
        }
    }
}

var amountInitialValue = 1;
function prepareAmountInitialValue() {
    if (weAreCurrentlySelling) {
        if (inventory.readyName() == 'Equip') {
            amountInitialValue = 1;
        }
        else {
            amountInitialValue = parseInt(itemBeingSold.children[2].innerHTML);
        }
    }
    else {
        amountInitialValue = 1;
    }
    amountSetInitialValues();
}

function amountSetInitialValues(value=amountInitialValue) { // separated just in case I wanna do something with the fact that it's separated later
    $('#smallAmountArea').val(value);
    transferAmount = value;
}

$('#smallAmountArea').on('input', function() {
    checkItFirst = dialogAmountArea.val().replace(/\D+/g, ''); // https://stackoverflow.com/questions/6649327/regex-to-remove-letters-symbols-except-numbers#answer-6649350
    if (checkItFirst) {
        if (amountMinimum <= checkItFirst) {
            if (checkItFirst <= amountMaximum) {
                transferAmount = checkItFirst;
            }
            else {
                transferAmount = amountMaximum;
            }
        }
        else {
            transferAmount = amountMinimum;
        }
    }
    else {
        transferAmount = amountMinimum;
    }
    if (dialogAmountAreaAutoUpdateText) {
        dialogPrepareText(dialogAmountAreaWhatAreWeDoing);
    }
});

function dialogSetText(t) {
    area = $('#smallTextArea span');
    $(area).html(t.join('<br>'));
}

function dialogCancel() {
    if (dialogMainReason == 'too expensive') {
        playSound(sounds[5]);
    }
    closeSmallDialogBox();
    resetSellProcess();
}

function dialogProceed() {
    $('#smallAmountArea').val(transferAmount);
    if (dialogMainReason == 'shop') {
        switch (dialogSubReason) {
            case 'buy':
                transferIt(true);
                break;
            case 'sell':
                transferIt(false);
                secondPartOfSellProcess();
                break;
            case 'withdraw':
                transferIt(true);
                break;
            case 'deposit':
                transferIt(false);
                depositProcess();
                break;
            default:
                console.log('there is no case for this dialogSubReason: ');
                console.log(dialogSubReason);
        }
        playSound(sounds[2]);
    }
    else if (dialogMainReason == 'too expensive') {
        playSound(sounds[5]); // maybe no sound would be nicer?
    }
    closeSmallDialogBox();
}

var pressedKeys = [];
document.addEventListener('keydown', (event) => {
    if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key);
    }
});

document.addEventListener('keyup', (event) => {
    if (pressedKeys.includes(event.key)) {
        pressedKeys.splice(pressedKeys.indexOf(event.key), 1);
    }
});

function beingToggled(key) {
    if (!pressedKeys.includes(key)) {
        toggledKeys[key] = false;
    }
    return (!toggledKeys[key] && pressedKeys.includes(key));
}

var toggledKeys = {'i': false, 'ArrowLeft': false, 'ArrowRight': false, 'ArrowDown': false};
function checkForToggleKeys() {
    if (beingToggled('i')) {
        toggledKeys['i'] = true;
        if (!(document.getElementById('inventoryArea').classList.contains('inventory-closing') || document.getElementById('inventoryArea').classList.contains('inventory-opening'))) {
            $('.openInventoryButton').eq(0).click();
        }
    }
    scheduleToGameLoop(0, checkForToggleKeys, [], 'interfacing');
}

function checkForPressedKeys() {
    if (smallDialogBoxOpen) { // this prevents buying stuff and activating skills on your number keys
        return;
    }
    let endEarly = false;
    pressedKeys.forEach((someKey) => {
        if (endEarly) {
            return;
        }
        if (someKey in keybindReferences) {
            endEarly = true;
            if (keybindReferences[someKey].type == 'skill') {
                let id = keybindReferences[someKey].id;
                if (id in character.skillLevels) { // it should be in there, but if it isn't something strange happened
                    if (character.skillLevels[id] >= 1) {
                        processSkill(id);
                    }
                }
                else {
                    endEarly = false;
                }
            }
            else if (keybindReferences[someKey].type == 'function') {
                let id = keybindReferences[someKey].id;
                if (id == 'pickUp') {
                    if (currentHoveredDropItem) {
                        lootItem(currentHoveredDropItem);
                    }
                }
            }
        }
    });
    
    scheduleToGameLoop(0, checkForPressedKeys, [], 'interfacing');
}

var skillTierNames = ['Kaiser Basics', 'Kaiser 1', 'Kaiser 2', 'Kaiser 3', 'Kaiser 4', 'Kaiser 5'];
$('.skillTab').on('click', (event) => {
    document.getElementsByClassName('selectedSkillTab')[0].classList = ['skillTab'];
    event.currentTarget.classList = ['skillTab selectedSkillTab'];
    removeAllChildNodes(document.getElementById('skillContentAreaBottomPart'));
    let skillTier = event.currentTarget.getAttribute('value');
    document.getElementById('skillPoints').innerHTML = character.info.skillPoints[skillTier];
    document.getElementById('skillContentAreaTabName').innerHTML = skillTierNames[skillTier];
    document.getElementById('skillBookPictureHolder').firstElementChild.src = './files/book' + skillTier + '.png';
    makeSkillCards();
    makeKeybindableThingsDraggable();
    makeSkillPointsAllocateable();
});

$('#keyboardChangeArea').on('animationend webkitAnimationEnd oAnimationEnd', () => {
    if (!$('#keyboardChangeArea').hasClass('inventory-open') && !$('#keyboardChangeArea').hasClass('inventory-closing') && $('#keyboardChangeArea').hasClass('inventory-opening')) {
        $('#keyboardChangeArea').addClass('inventory-open');
        $('#keyboardChangeArea').removeClass('inventory-opening');
    }
    else {
        $('#keyboardChangeArea').removeClass('inventory-closing');
    }
});

$('#keyboardChangeButtonArea').on('click', () => {
    if (!$('#keyboardChangeArea').hasClass('inventory-open')) {
        $('#keyboardChangeArea').addClass('inventory-opening');
    }
    else {
        $('#keyboardChangeArea').addClass('inventory-closing');
        $('#keyboardChangeArea').removeClass('inventory-open');
    }
});

const KEYBIND_LOCATIONS_ON_THE_KEYBOARD = {
    '`': [31, 30],
    '1': [81, 30],
    '2': [130, 30],
    '3': [179, 30],
    '4': [229, 30],
    '5': [279, 30],
    '6': [328, 30],
    '7': [378, 30],
    '8': [428, 30],
    '9': [477, 30],
    '0': [527, 30],
    '-': [576, 30],
    '=': [626, 30],
    'q': [105, 79],
    'w': [154, 79],
    'e': [204, 79],
    'r': [254, 79],
    't': [303, 79],
    'y': [353, 79],
    'u': [402, 79],
    'i': [452, 79],
    'o': [501, 79],
    'p': [551, 79],
    '[': [600, 79],
    ']': [650, 79],
    'a': [129, 129],
    's': [178, 129],
    'd': [228, 129],
    'f': [277, 129],
    'g': [327, 129],
    'h': [376, 129],
    'j': [426, 129],
    'k': [476, 129],
    'l': [525, 129],
    ';': [575, 129],
    "'": [624, 129],
    'Shift': [[67, 178], [684, 178]],
    'z': [152, 178],
    'x': [202, 178],
    'c': [252, 178],
    'v': [301, 178],
    'b': [351, 178],
    'n': [400, 178],
    'm': [450, 178],
    ',': [499, 178],
    '.': [549, 178],
    'Control': [[43, 228], [712, 228]],
    'Alt': [[190, 228], [561, 228]],
    'Space': [373, 228]
};

function getHoveredKeyboardKey() { // for detecting which keybind they want to put something on (using the picture + click and drag)
    // there are 5 rows of keys. `1234... -> qwert... -> asdfg... -> shift zxcv... -> control alt space...
    var key = '';
    let mouseY = SQUAREposY; // SQUAREposY = cursor Y location
    let mouseX = SQUAREposX + document.getElementById('gameArea').offsetLeft;
    if (between(mouseY, 129, 178)) {
        if (between(mouseX, 26, 75)) {
            key = '`';
        }
        else if (between(mouseX, 76, 124)) {
            key = '1';
        }
        else if (between(mouseX, 125, 173)) {
            key = '2';
        }
        else if (between(mouseX, 174, 223)) {
            key = '3';
        }
        else if (between(mouseX, 224, 273)) {
            key = '4';
        }
        else if (between(mouseX, 274, 322)) {
            key = '5';
        }
        else if (between(mouseX, 323, 372)) {
            key = '6';
        }
        else if (between(mouseX, 373, 422)) {
            key = '7';
        }
        else if (between(mouseX, 423, 471)) {
            key = '8';
        }
        else if (between(mouseX, 472, 521)) {
            key = '9';
        }
        else if (between(mouseX, 522, 570)) {
            key = '0';
        }
        else if (between(mouseX, 571, 620)) {
            key = '-';
        }
        else if (between(mouseX, 621, 670)) {
            key = '=';
        }
    }
    else if (between(mouseY, 179, 228)) {
        if (between(mouseX, 100, 148)) {
            key = 'q';
        }
        else if (between(mouseX, 149, 198)) {
            key = 'w';
        }
        else if (between(mouseX, 199, 248)) {
            key = 'e';
        }
        else if (between(mouseX, 249, 297)) {
            key = 'r';
        }
        else if (between(mouseX, 298, 347)) {
            key = 't';
        }
        else if (between(mouseX, 348, 396)) {
            key = 'y';
        }
        else if (between(mouseX, 397, 446)) {
            key = 'u';
        }
        else if (between(mouseX, 447, 495)) {
            key = 'i';
        }
        else if (between(mouseX, 496, 545)) {
            key = 'o';
        }
        else if (between(mouseX, 546, 594)) {
            key = 'p';
        }
        else if (between(mouseX, 595, 644)) {
            key = '[';
        }
        else if (between(mouseX, 645, 694)) {
            key = ']';
        }
    }
    else if (between(mouseY, 229, 278)) {
        if (between(mouseX, 124, 172)) {
            key = 'a';
        }
        else if (between(mouseX, 173, 222)) {
            key = 's';
        }
        else if (between(mouseX, 223, 271)) {
            key = 'd';
        }
        else if (between(mouseX, 272, 321)) {
            key = 'f';
        }
        else if (between(mouseX, 322, 370)) {
            key = 'g';
        }
        else if (between(mouseX, 371, 420)) {
            key = 'h';
        }
        else if (between(mouseX, 421, 470)) {
            key = 'j';
        }
        else if (between(mouseX, 471, 519)) {
            key = 'k';
        }
        else if (between(mouseX, 520, 569)) {
            key = 'l';
        }
        else if (between(mouseX, 570, 618)) {
            key = ';';
        }
        else if (between(mouseX, 619, 668)) {
            key = "'";
        }
    }
    else if (between(mouseY, 279, 328)) {
        if (between(mouseX, 26, 146)) {
            key = 'Shift';
        }
        else if (between(mouseX, 147, 196)) {
            key = 'z';
        }
        else if (between(mouseX, 197, 246)) {
            key = 'x';
        }
        else if (between(mouseX, 247, 295)) {
            key = 'c';
        }
        else if (between(mouseX, 296, 345)) {
            key = 'v';
        }
        else if (between(mouseX, 346, 394)) {
            key = 'b';
        }
        else if (between(mouseX, 395, 444)) {
            key = 'n';
        }
        else if (between(mouseX, 445, 493)) {
            key = 'm';
        }
        else if (between(mouseX, 494, 543)) {
            key = ',';
        }
        else if (between(mouseX, 544, 593)) {
            key = '.';
        }
        else if (between(mouseX, 643, 768)) { // this gap compared to the previous key is visible on the keyboard
            key = 'Shift';
        }
    }
    else if (between(mouseY, 329, 378)) {
        if (between(mouseX, 26, 99)) {
            key = 'Control';
        }
        else if (between(mouseX, 173, 246)) {
            key = 'Alt';
        }
        else if (between(mouseX, 247, 543)) {
            key = 'Space';
        }
        else if (between(mouseX, 544, 618)) {
            key = 'Alt';
        }
        else if (between(mouseX, 694, 768)) {
            key = 'Control';
        }
    }
    return key;
}

var keybindReferences = {}; // example: {'Control': {type: 'skill', id: 61101002}, 'a': {type: 'useItem', id: 2000019}, ...}
var assignedKeyboardKeys = {}; // example:  {'Control': [element, element],  'a': [element], ...}
function addToKeybinds(information, keybind, type) {
    realKeybind = keybind;
    if (keybind == 'Space') {
        realKeybind = ' ';
    }
    if (realKeybind in assignedKeyboardKeys) {
        assignedKeyboardKeys[realKeybind].forEach((someElement) => {
            someElement.remove();
        });
        delete assignedKeyboardKeys[realKeybind];
    }
    let imgLink = '';
    removeItemOnce(allJumpKeys, realKeybind);
    if (information == 'pickUp') {
        imgLink = 'url(./files/keyboard/Pick_Up.png)';
    }
    else if (information == 'jump') {
        imgLink = 'url(./files/keyboard/Jump.png)';
        allJumpKeys.push(realKeybind);
    }
    else {
        imgLink = 'url(./skills/icon/' + information + '.png)';
    }
    keybindReferences[realKeybind] = {};
    keybindReferences[realKeybind]['id'] = information;
    keybindReferences[realKeybind]['type'] = type;
    assignedKeyboardKeys[realKeybind] = [];
    console.log(keybind);
    let location = KEYBIND_LOCATIONS_ON_THE_KEYBOARD[keybind];
    if (keybind == 'Shift' || keybind == 'Control' || keybind == 'Alt') {
        let div = document.createElement('div');
        div.classList.add('changeableKeybind');
        div.style.left = KEYBIND_LOCATIONS_ON_THE_KEYBOARD[keybind][0][0] + 'px';
        div.style.top = KEYBIND_LOCATIONS_ON_THE_KEYBOARD[keybind][0][1] + 'px';
        div.style.backgroundImage = imgLink;
        div.setAttribute('value', information);
        let img = new Image();
        img.src = './files/keyboard/' + keybind + '.png';
        img.setAttribute('value', realKeybind);
        div.appendChild(img);
        document.getElementById('keyboardChangeEntireHolder').appendChild(div);
        assignedKeyboardKeys[realKeybind].push(div);
        location = KEYBIND_LOCATIONS_ON_THE_KEYBOARD[keybind][1];
    }
    let div = document.createElement('div');
    div.classList.add('changeableKeybind');
    div.style.left = location[0] + 'px';
    div.style.top = location[1] + 'px';
    div.style.backgroundImage = imgLink;
    div.setAttribute('value', information);
    let img = new Image();
    img.src = './files/keyboard/' + keybind + '.png';
    img.setAttribute('value', realKeybind);
    div.appendChild(img);
    document.getElementById('keyboardChangeEntireHolder').appendChild(div);
    assignedKeyboardKeys[realKeybind].push(div);
    makeChangeableKeybindsDraggable();
    return;
}

$('#keyboardChangeEntireHolder').on('mouseup', (event) => {
    if (isSomethingBeingDragged) {
        let targetKey = getHoveredKeyboardKey();
        if (targetKey == '') { // this means they missed a key or accidentally dragged something onto the keyboard
            return;
        }
        addToKeybinds(draggedThingId, targetKey, draggedThingType);
    }
});

var draggedThingType = 'etcItem';
var draggedThingId = '';
function makeKeybindableThingsDraggable() {
    $(function() {
        $('.keybindableThing').draggable({
            start: function(event) {
                playSound(sounds[8]); // DragStart.mp3
                $(event.currentTarget).css('visibility', 'hidden');
                $('#draggedItemHolder').css('visibility', 'visible');
                isSomethingBeingDragged = true;
                draggedThingType = 'skill';
                draggedThingId = event.currentTarget.getAttribute('value');
                let imgLink = $(event.currentTarget).attr('src');
                $(event.currentTarget).css('pointer-events', 'none');
                $('#draggedItemHolder').children('img').attr('src', imgLink);
            },
            stop: function() {
                $('#draggedItemHolder').css('visibility', 'hidden');
                $(this).css('visibility', '');
                isSomethingBeingDragged = false;
                $(this).css('pointer-events', 'auto');
                $(this).css('left', '0px');
                $(this).css('top', '0px');
            },
            containment: 'window'
        });
    });
}

var liftedKey = '';
var keyboardGameFunctionKeyLocations = {'pickUp': '16px', 'jump': '72px'};
function makeChangeableKeybindsDraggable() {
    $(function() {
        $('.changeableKeybind').draggable({
            start: function(event) {
                playSound(sounds[8]); // DragStart.mp3
                $(event.currentTarget).css('visibility', 'hidden');
                $('#draggedItemHolder').css('visibility', 'visible');
                isSomethingBeingDragged = true;
                if (event.currentTarget.children.length > 0) {
                    liftedKey = event.currentTarget.children[0].getAttribute('value');
                }
                else { // if the key was from the additional game function keys area
                    liftedKey = '';
                }
                draggedThingId = event.currentTarget.getAttribute('value');
                let text = event.currentTarget.style.backgroundImage;
                let imgLink = text.slice(5, text.length-2);
                let letterOfDirectory = imgLink[2];
                if (letterOfDirectory == 'f') {
                    draggedThingType = 'function'; // from "files" folder. stuff like "Pick Up"
                }
                else if (letterOfDirectory == 's') { // from "skills" folder
                    draggedThingType = 'skill';
                }
                else if (letterOfDirectory == 'i') { // from "item" folder
                    draggedThingType = 'useItem';
                }
                $(event.currentTarget).css('pointer-events', 'none');
                $('#draggedItemHolder').children('img').attr('src', imgLink);
            },
            stop: function() {
                $('#draggedItemHolder').css('visibility', 'hidden');
                isSomethingBeingDragged = false;
                if (liftedKey == '') {
                    $(this).css('visibility', '');
                    $(this).css('pointer-events', 'auto');
                    $(this).css('left', keyboardGameFunctionKeyLocations[draggedThingId]);
                    $(this).css('top', '');
                }
                else {
                    assignedKeyboardKeys[liftedKey].forEach((someElement) => {
                        someElement.remove();
                    });
                    removeItemOnce(allJumpKeys, liftedKey);
                    delete assignedKeyboardKeys[liftedKey];
                    if (liftedKey in keybindReferences) {
                        delete keybindReferences[liftedKey];
                    }
                }
            },
            containment: 'window'
        });
    });

}
