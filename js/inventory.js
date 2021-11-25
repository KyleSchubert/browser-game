$('#inventoryArea').on('animationend webkitAnimationEnd oAnimationEnd', () => {
    if (!$('#inventoryArea').hasClass('inventory-open') && !$('#inventoryArea').hasClass('inventory-closing') && $('#inventoryArea').hasClass('inventory-opening')) {
        $('#inventoryArea').addClass('inventory-open');
        $('#inventoryArea').removeClass('inventory-opening');
    }
    else {
        $('#inventoryArea').removeClass('inventory-closing');
    }
});

$('.openInventoryButton').on('click', (event) => {
    if (!$('#inventoryArea').hasClass('inventory-open')) {
        $('#inventoryArea').addClass('inventory-opening');
    }
    else {
        $('#inventoryArea').addClass('inventory-closing');
        $('#inventoryArea').removeClass('inventory-open');
    }
});

// setting the dimensions of the maininventory so I don't have to remember as much
$('#mainInventory').height($('#inventoryHolder').height()-2*(parseInt($('#mainInventory').css('margin'), 10)));
$('#mainInventory').width($('#inventoryHolder').width()-2*(parseInt($('#mainInventory').css('margin'), 10)));

// Creating the slots
ROWS_OF_SLOTS = 6;
COLS_OF_SLOTS = 5;
NUM_OF_SLOTS = ROWS_OF_SLOTS*COLS_OF_SLOTS;


// representing the inventory data in the inventory as a thing you can interact with because that's how inventories are
// console.log(inventory.equips[22] == undefined) //true
// console.log(inventory.equips[2] == undefined) //true


var inventory = {
    Equip: [1113095, 1112434, 0, 1113095, 1342111, 0, 0, 0, 0, 1412148, 0, 0, 0, 0, 0, 1003629, 1003686, 1004808],
    Use: [2000019, 0, 0, 0, 0, 2000019, 0, 0, 0, 0, 0, 2046319],
    Etc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4000001],
    DetailedEquip: [],
    getter: () => {
        str = inventoryCurrentSelectedTab.innerHTML.toLowerCase();
        string = str.charAt(0).toUpperCase() + str.slice(1);
        return inventory[string];
    },
    countsGetter: () => {
        str = inventoryCurrentSelectedTab.innerHTML.toLowerCase();
        string = str.charAt(0).toUpperCase() + str.slice(1);
        return inventory.counts[string];
    },
    readyName: () => {
        str = inventoryCurrentSelectedTab.innerHTML.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    counts: {
        Equip: [],
        Use: [178, 0, 0, 0, 0, 900, 0, 0, 0, 0, 0, 45],
        Etc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103]
    }
};

// making the inventory
// showing the first tab first by making it the selected tab
$(() => {
    inventoryTabs = document.getElementById('moreInventoryButtonsArea').getElementsByClassName('subTab');
    inventoryTabs[0].classList.add('subTabFocused');
    $(inventoryTabs).on('click', inventoryTabs, switchTabs);
    inventory.DetailedEquip = [new EquipItem(1113095), new EquipItem(1112434), 0, new EquipItem(1113095), new EquipItem(1342111), 0, 0, 0, 0, new EquipItem(1412148), 0, 0, 0, 0, 0, new EquipItem(1003629), new EquipItem(1003686), new EquipItem(1004808)];
    _ = inventory.DetailedEquip.length;
    inventory.DetailedEquip.length = NUM_OF_SLOTS;
    inventory.DetailedEquip.fill(0, _, NUM_OF_SLOTS);
});

var inventoryCurrentSelectedTab = ''; // TODO: since i now have this I should probably change the variables so that only this gets used
$(() => {
    inventoryCurrentSelectedTab = document.getElementsByClassName('subTabFocused')[0];
});

function switchTabs() {
    if (inventoryCurrentSelectedTab != this) {
        inventoryCurrentSelectedTab.classList.remove('subTabFocused');
        this.classList.add('subTabFocused');
        inventoryCurrentSelectedTab = this;
        inventoryLoad();
        if (this.classList.contains('highlightedTab')) {
            this.classList.remove('highlightedTab');
            if (!highlightedSeen && ($(this).text() == highlightedTabName)) {
                highlightedSeen = true;
                makeSlotHighlighted(highlightedSlot);
            }
        }
    }
}

// filling in the empty spots with empty data then zeroes
_ = inventory.Equip.length;
inventory.Equip.length = NUM_OF_SLOTS;
inventory.Equip.fill(0, _, NUM_OF_SLOTS);
_ = inventory.Use.length;
inventory.Use.length = NUM_OF_SLOTS;
inventory.Use.fill(0, _, NUM_OF_SLOTS);
_ = inventory.Etc.length;
inventory.Etc.length = NUM_OF_SLOTS;
inventory.Etc.fill(0, _, NUM_OF_SLOTS);
_ = inventory.counts.Equip.length;
inventory.counts.Equip.length = NUM_OF_SLOTS;
inventory.counts.Equip.fill(0, _, NUM_OF_SLOTS);
_ = inventory.counts.Use.length;
inventory.counts.Use.length = NUM_OF_SLOTS;
inventory.counts.Use.fill(0, _, NUM_OF_SLOTS);
_ = inventory.counts.Etc.length;
inventory.counts.Etc.length = NUM_OF_SLOTS;
inventory.counts.Etc.fill(0, _, NUM_OF_SLOTS);

// loading images of the items into the slots where they're supposed to be
function inventoryLoad() {
    allTheSlots = document.getElementsByClassName('slot');
    while (allTheSlots.length < 1) {
        allTheSlots = document.getElementsByClassName('slot');
    }
    tab = inventory.getter();
    for (let slot = 0; slot < NUM_OF_SLOTS; slot++) {
        if (allTheSlots[slot].hasChildNodes()) {
            removeAllChildNodes(allTheSlots[slot]);
        }
        if (tab[slot]) {
            itemImageSetup(tab[slot], processInventoryImages, slot);
        }
    }
    makeDraggableItemsDraggable();
    activateFastSell();
    $('.slot').mousemove(function(event) {
        if (isSomethingBeingDragged) { // someone wants to swap items
            prepareToSwapItems(event, 1);
        }
        else { // nevermind
            prepareToSwapItems(event, 0);
        }
    });

    $('.slot').mouseleave(function(event) {
        prepareToSwapItems(event, 0);
    });
}

function inventoryLoadOne(tabName, slot, itemID, justTheNumber=false, equipItem=false) {
    if (tabName == inventory.readyName()) {
        if (justTheNumber) {
            document.getElementsByClassName('slot')[slot].getElementsByClassName('itemCount')[0].innerHTML = inventory.counts[tabName][slot];
        }
        else {
            data = [tabName, slot, itemID, justTheNumber, equipItem];
            itemImageSetup(itemID, secondPartOfInventoryLoadOne, data);
        }
        makeDraggableItemsDraggable();
        activateFastSell();

        target = $('.slot').eq(slot);
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
}

function secondPartOfInventoryLoadOne(img, data) {
    tabName = data[0];
    slot = data[1];
    itemID = data[2];
    justTheNumber = data[3];
    equipItem = data[4];
    if (equipItem) { // for when the item should not be rerolled
        itemHolder = itemHolderSetup(tabName, slot, img, equipItem);
    }
    else {
        itemHolder = itemHolderSetup(tabName, slot, img);
    }
    document.getElementsByClassName('slot')[slot].appendChild(itemHolder);
}

function processInventoryImages(img, slot) {
    itemHolder = itemHolderSetup(inventory.readyName(), slot, img);
    allTheSlots[slot].appendChild(itemHolder);
}


const inventoryStatPairs = {'strength': 'STR', 'dexterity': 'DEX', 'intelligence': 'INT', 'luck': 'LUK', 'magicAttack': 'MAGIC ATTACK', 'physicalAttack': 'PHYSICAL ATTACK', 'maxHP': 'MaxHP', 'maxMP': 'MaxMP', 'hp': 'MaxHP', 'mp': 'MaxMP', 'bossDamageMultiplier': 'BOSS DAMAGE MULTIPLIER', 'evasion': 'Evasion', 'defense': 'Defense', 'accuracy': 'Accuracy', 'pierce': 'Pierce'};

function itemHolderSetup(tabName, slot, img, equipItem) {
    const itemID = inventory[tabName][slot];
    if (equipItem) { // if it came from the equipment screen (not the tab)
        source = equipItem;
    }
    else { // if it came from the tab or the ground or the shop
        source = inventory.DetailedEquip[slot];
    }
    // span area
    const span = document.createElement('span');
    span.classList = ['numberText itemCount'];
    if (!inventory.counts[tabName][slot] == 0) {
        span.innerHTML = inventory.counts[tabName][slot];
    }
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

    if (tabName == 'Equip') {
        levelReqText = document.createElement('div');
        levelReqText.innerHTML = 'REQ LEV: '.concat(source['stats']['reqLevelEquip']);
        tooltipTopArea.appendChild(levelReqText);

        categoryText = document.createElement('div');
        categoryText.innerHTML = 'CATEGORY: '.concat(source['exactType']);
        tooltipBottomArea.appendChild(categoryText);

        statsTextArea = document.createElement('div');
        statsTextArea.classList = ['tooltipStatsTextArea'];
        source['usedStats'].forEach(function(stat) {
            const statText = document.createElement('div');
            statText.innerHTML = ''.concat(inventoryStatPairs[stat], ': +', source['stats'][stat]);
            if (stat == 'bossDamageMultiplier') {
                statText.innerHTML += '%';
            }
            statsTextArea.appendChild(statText);
        });
        Object.keys(source['craftedStats']).forEach(function(stat) {
            const statText = document.createElement('div');
            statText.classList = ['craftedStat'];
            if (stat.includes('Percent')) {
                statName = stat.slice(0, stat.length-7);
                statText.innerHTML = ''.concat(inventoryStatPairs[statName], ': +', source['craftedStats'][stat], '%');
            }
            else {
                statText.innerHTML = ''.concat(inventoryStatPairs[stat], ': +', source['craftedStats'][stat]);
                if (stat == 'bossDamageMultiplier') {
                    statText.innerHTML += '%';
                }
            }
            statsTextArea.appendChild(statText);
        });
        tooltipBottomArea.appendChild(statsTextArea);
    }

    tooltip.appendChild(tooltipName);
    tooltip.appendChild(tooltipTopArea);
    tooltip.appendChild(tooltipBottomArea);
    // itemHolder area
    itemHolder = document.createElement('div');
    itemHolder.classList = ['draggableItem itemHolder'];
    itemHolder.appendChild(tooltip);
    itemHolder.appendChild(img);
    itemHolder.appendChild(span);

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

// set up the inventory slots and load what should be in those slots AFTER
$(() => {
    for (let i = 0; i < ROWS_OF_SLOTS; i++) {
        $('#slotsSpot').append('<tr class="row"><td class="slot"></td><td class="slot"></td><td class="slot"></td><td class="slot"></td><td class="slot"></td></tr>');
    }

    for (let slot = 0; slot < NUM_OF_SLOTS; slot++) {
        $('.slot').eq(slot).attr('data-slotID', slot);
    }

    inventoryLoad(); // I know not of a better way to get this to load after that^  Its like the computer is too fast
});

// tab is the string name of the tab and slot is the integer number of the slot
var highlightedSeen = true;
function makeItemHighlighted(slot, tab) { // every new item should go through this function when it gets gathered
    newTab = getMentionedTab(tab);
    highlightedSeen = false;
    previousHighlightedImage.remove();
    $('.highlightedTab').removeClass('highlightedTab');
    if (canWeMakeSlotHighlighted(slot, newTab)) {
        makeSlotHighlighted(slot);
    }
    else {
        makeTabHighlighted(newTab);
    }
}

var highlightedTabName = '';
function getMentionedTab(tabName) { // string name of tab goes in and the thing on the page comes out
    tabName = tabName.toUpperCase();
    if (tabName == 'EQUIP') {
        target = $('#equipTab');
    }
    else if (tabName == 'USE') {
        target = $('#useTab');
    }
    else if (tabName == 'ETC') {
        target = $('#etcTab');
    }
    else { // bad
        console.error('function getMentionedTab - Not sure what the tabName variable is but it became: "' + tabName + '" minus the quotes');
    }
    highlightedTabName = tabName;
    return target;
}

function makeTabHighlighted(tab) { // thing on the page comes in
    if (!$(tab).hasClass('subTabFocused')) {
        $(tab).addClass('highlightedTab');
    }
}

var highlightedSlot = 0;
function canWeMakeSlotHighlighted(slot, newTab) {
    highlightedSlot = slot;
    if (!highlightedSeen && ($(inventoryCurrentSelectedTab).text() == newTab.text())) {
        highlightedSeen = true;
        return true;
    }
}

var previousHighlightedImage = new Image();
function makeSlotHighlighted(slot) {
    const img = new Image();
    img.classList = ['highlightedSlot'];
    img.src = './files/newitemYELLOW.gif';
    img.setAttribute('draggable', false);
    previousHighlightedImage = img;
    $('.slot')[slot].append(img);
}
