function obtainItem(itemID, amount=1) { // in goes the item on the page that has its item ID as its value
    itemID = parseInt(itemID); // just in case
    amount = parseInt(amount); // just in case
    targetTab = itemsAndTheirTypes[itemID][0];
    targetSlot = inventory[targetTab].indexOf(0);
    
    if (targetTab == 'Use' || targetTab == 'Etc') { // items stack in these
        if (!inventory[targetTab].includes(itemID)) { // item is not there
            if (targetSlot == -1) {
                return false;
            }
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + amount;
            inventory[targetTab][targetSlot] = itemID;
            inventoryLoadOne(targetTab, targetSlot, itemID);
        }
        else { // it's there
            targetSlot = inventory[targetTab].indexOf(itemID);
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + amount;
            inventoryLoadOne(targetTab, targetSlot, itemID, true);
        }
    }
    else { // the equip tab only has 1 item per slot anyways
        if (targetSlot == -1) {
            return false;
        }
        inventory[targetTab][targetSlot] = itemID;
        inventory.DetailedEquip[targetSlot] = new EquipItem(itemID);
        inventoryLoadOne(targetTab, targetSlot, itemID);
    }
    makeItemHighlighted(targetSlot, targetTab);
    return true;
}

function lootItem() { // use   this.whatever   to get what you need   ex: this.value = itemID
    $(this).off('click');
    this.classList.remove('clickable');
    let success = obtainItem(this.value);
    if (!success) {
        this.classList.add('clickable');
        $(this).on('click', this, lootItem);
        return
    }
    this.classList.add('pickupAnimation');
    this.parentElement.classList.add('pickupAnimationHelper');
    this.classList.remove('droppedItem');
    this.parentElement.classList.remove('itemAnimationHelper');
    const _ = this; // I dont know any better way
    playSound(sounds[0]); // pickup.wav
    window.setTimeout(function() {
        remainingItems = _.parentElement.parentElement.value;
        remainingItems = remainingItems - 1;
        _.parentElement.parentElement.value = remainingItems;
        if (remainingItems <= 0) {
            _.parentElement.parentElement.remove(_);
        }
    }, 1020);
}