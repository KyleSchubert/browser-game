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
                playSound(sounds[8]); // DragStart.mp3
                $(event.currentTarget).css('visibility', 'hidden');
                $('#draggedItemHolder').css('visibility', 'visible');
                isSomethingBeingDragged = true;
                $(event.currentTarget).css('pointer-events', 'none');
                imgLink = $(event.currentTarget).children('img').attr('src');
                $('#draggedItemHolder').children('img').attr('src', imgLink);
            },
            stop: function(event) {
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

function addSelectionListener(node) { // BUYING AN ITEM BY CLICKING THE SELECTED THING AGAIN
    $(node).mousedown(function(event) {
        if ($('.selectedThing')[0]) {
            if ($('.selectedThing')[0] == $(this)[0]) {
                if ($(this).parent()[0].classList.contains('shopItemArea')) {
                    price = parseInt($('.selectedThing:eq(0) .itemCardPrice').text().replace(/,/g, ''));
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
                itemPrice = shopWorths[itemBeingSoldId].toString();
            }
            else {
                dialogSubReason = 'withdraw';
                text.push('Would you like to withdraw');
                itemName = $('.selectedThing:eq(0) .itemCardName').text();
                itemPrice = $('.selectedThing:eq(0) .itemCardPrice').text();
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
                itemName = $('.selectedThing:eq(0) .itemCardName').text();
                itemPrice = $('.selectedThing:eq(0) .itemCardPrice').text();
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

