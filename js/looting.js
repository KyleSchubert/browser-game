function obtainItem(item) { // in goes the item on the page that has its item ID as its value
    targetTab = itemsAndTheirTypes[item.value][0];
    targetSlot = inventory[targetTab].indexOf(0);
    if (targetTab == 'Use' || targetTab == 'Etc') { // items stack in these
        if (!inventory[targetTab].includes(item.value)) { // item is not there
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + 1;
            inventory[targetTab][targetSlot] = item.value;
            inventoryLoadOne(targetTab, targetSlot, item.value)
        }
        else { // it's there
            targetSlot = inventory[targetTab].indexOf(item.value);
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + 1;
            inventoryLoadOne(targetTab, targetSlot, item.value, true)
        }
    }
    else { // the equip tab only has 1 item per slot anyways
        inventory[targetTab][targetSlot] = item.value;
        inventoryLoadOne(targetTab, targetSlot, item.value)
    }
    makeItemHighlighted(targetSlot, targetTab)
}

function lootItem() { // use   this.whatever   to get what you need   ex: this.value = itemID
    $(this).off('click')
    this.classList.remove('clickable')
    obtainItem(this)
    this.classList.add('pickupAnimation')
    this.parentElement.classList.add('pickupAnimationHelper')
    this.classList.remove('droppedItem')
    this.parentElement.classList.remove('itemAnimationHelper')
    var _ = this; // I dont know any better way
    playSound(sounds[0]) // pickup.wav
    window.setTimeout(function () {
        remainingItems = _.parentElement.parentElement.value;
        remainingItems = remainingItems - 1;
        _.parentElement.parentElement.value = remainingItems;
        if (remainingItems <= 0) {
            _.parentElement.parentElement.remove(_)
        }
    }, 1020);
}

