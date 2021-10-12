function depositProcess() {
    soldAmount = shopGetTransferAmount();
    remaining = itemBeingSoldCount-soldAmount;
    tab = inventory.getter();
    counts = inventory.countsGetter();
    slotNumber = itemBeingSold.parentElement.getAttribute('data-slotID');
    if (inventory.readyName() == 'Equip' || remaining <= 0) {
        deleteItem(slotNumber);
    }
    else {
        counts[slotNumber] = remaining;
        $('.slot:eq(' + slotNumber + ') span')[0].innerHTML = remaining;
        $(itemBeingSold).css('left', '0px');
        $(itemBeingSold).css('top', '0px');
        $(itemBeingSold).css('pointer-events', 'auto');
        $(itemBeingSold).css('visibility', 'visible');
    }

    weAreCurrentlySelling = false;
    createItemCard(itemBeingSoldId, false, soldAmount, '80002');
    if (!shopInventories[80002].includes(itemBeingSoldId)) {
        shopInventories[80002].push(itemBeingSoldId);
    }
    if (shopStocks[80002][itemBeingSoldId]) {
        shopStocks[80002][itemBeingSoldId] += soldAmount;
    }
    else {
        shopStocks[80002][itemBeingSoldId] = soldAmount;
    }
    removeSellingTip();
}
