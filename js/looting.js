

function lootItem() { // use   this.whatever   to get what you need   ex: this.value = itemID
    $(this).off('click')
    this.classList.remove('clickable')
    targetTab = itemsAndTheirTypes[this.value][0];
    targetSlot = inventory[targetTab].indexOf(0)
    if (targetTab == 'Use' || targetTab == 'Etc') {
        if (!inventory[targetTab].includes(this.value)) {
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + 1;
            inventory[targetTab][targetSlot] = this.value;
            inventoryLoadOne(targetTab, targetSlot, this.value)
        }
        else {
            targetSlot = inventory[targetTab].indexOf(this.value);
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + 1;
            inventoryLoadOne(targetTab, targetSlot, this.value, true)
        }
    }
    else {
        inventory[targetTab][targetSlot] = this.value;
        inventoryLoadOne(targetTab, targetSlot, this.value)
    }
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

