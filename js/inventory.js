// some animations for opening and closing with the big button
$(".openInventoryButton").click(function() {
    if (!$("#inventoryArea").hasClass("inventory-open")) {
        //START OPENING ANIMATION
        $("#inventoryArea").addClass("inventory-opening");
        //ANIMATION DONE
        $(".inventory-opening").on("animationend webkitAnimationEnd oAnimationEnd", function() {
            $("#inventoryArea").addClass("inventory-open");
            $("#inventoryArea").removeClass("inventory-opening");
        });
    }
    else {
        //START closing animation
        $("#inventoryArea").addClass("inventory-closing");
        $("#inventoryArea").removeClass("inventory-open");
        //animation done
        $(".inventory-closing").on("animationend webkitAnimationEnd oAnimationEnd", function() {
            $("#inventoryArea").removeClass("inventory-open"); // safety first! (rare case)
            $("#inventoryArea").removeClass("inventory-closing");
        });
    }
    //SMILE TIME
});

// setting the dimensions of the maininventory so I don't have to remember as much
$("#mainInventory").height($("#inventoryHolder").height()-2*(parseInt($("#mainInventory").css("margin"), 10)));
$("#mainInventory").width($("#inventoryHolder").width()-2*(parseInt($("#mainInventory").css("margin"), 10)));

// Creating the slots
ROWS_OF_SLOTS = 6;
COLS_OF_SLOTS = 5;
NUM_OF_SLOTS = ROWS_OF_SLOTS*COLS_OF_SLOTS;


// representing the inventory data in the inventory as a thing you can interact with because that's how inventories are
//console.log(inventory.equips[22] == undefined) //true
//console.log(inventory.equips[2] == undefined) //true

ITEM_REFERENCES = {
    "1113095": {name: "I don't know"},
    "1342111": {name: "I don't know"},
    "1282036": {name: "I don't know"},
    "1282027": {name: "I don't know"},
    "2870008": {name: "I don't know"},
    "2870021": {name: "I don't know"},
    "2000019": {name: "I don't know"},
    "2046319": {name: "I don't know"},
    "4000001": {name: "I don't know"},
    "4000012": {name: "I don't know"},
    "4000097": {name: "I don't know"},
    "4000024": {name: "I don't know"},
    "1342098": {name: "I don't know"},
    "1582026": {name: "I don't know"},
    "1402266": {name: "I don't know"},
    "1412148": {name: "I don't know"}
}

var inventory = {
    Equip: [1113095, 0, 0, 1113095, 1342111, 0, 0, 0, 0, 1412148],
    Use: [2000019, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2046319],
    Etc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4000001],
    getter: function() {
        str = inventoryCurrentSelectedTab.innerHTML.toLowerCase();
        string = str.charAt(0).toUpperCase() + str.slice(1);
        return inventory[string];
    },
    countsGetter: function() {
        str = inventoryCurrentSelectedTab.innerHTML.toLowerCase();
        string = str.charAt(0).toUpperCase() + str.slice(1);
        return inventory.counts[string];
    },
    readyName: function() {
        str = inventoryCurrentSelectedTab.innerHTML.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    counts: {
        Equip: [],
        Use: [178, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45],
        Etc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 103]
    }
};

// making the inventory
// showing the first tab first by making it the selected tab
$(document).ready(function() {
    inventoryTabs = document.getElementById('moreInventoryButtonsArea').getElementsByClassName("subTab");
    inventoryTabs[0].classList.add("subTabFocused");
    $(inventoryTabs).on("click", inventoryTabs, switchTabs);
});

var inventoryCurrentSelectedTab = ''; // TODO: since i now have this I should probably change the variables so that only this gets used
$(document).ready(function() {
    inventoryCurrentSelectedTab = document.getElementsByClassName("subTabFocused")[0];
})

function switchTabs() {
    if (inventoryCurrentSelectedTab != this) {
        inventoryCurrentSelectedTab.classList.remove("subTabFocused");
        this.classList.add("subTabFocused");
        inventoryCurrentSelectedTab = this;
        inventoryLoad();
    }
}

// filling in the empty spots with empty data then zeroes
_ = inventory.Equip.length;
inventory.Equip.length = NUM_OF_SLOTS;
inventory.Equip.fill(0, _, NUM_OF_SLOTS)
_ = inventory.Use.length;
inventory.Use.length = NUM_OF_SLOTS;
inventory.Use.fill(0, _, NUM_OF_SLOTS)
_ = inventory.Etc.length;
inventory.Etc.length = NUM_OF_SLOTS;
inventory.Etc.fill(0, _, NUM_OF_SLOTS)
_ = inventory.counts.Equip.length;
inventory.counts.Equip.length = NUM_OF_SLOTS;
inventory.counts.Equip.fill(0, _, NUM_OF_SLOTS)
_ = inventory.counts.Use.length;
inventory.counts.Use.length = NUM_OF_SLOTS;
inventory.counts.Use.fill(0, _, NUM_OF_SLOTS)
_ = inventory.counts.Etc.length;
inventory.counts.Etc.length = NUM_OF_SLOTS;
inventory.counts.Etc.fill(0, _, NUM_OF_SLOTS)

// loading images of the items into the slots where they're supposed to be
function inventoryLoad() {
    allTheSlots = document.getElementsByClassName("slot");
    while (allTheSlots.length < 1) {
        sleep(50); // Le epic bruh
        allTheSlots = document.getElementsByClassName("slot");
    }
    tab = inventory.getter();
    for (var slot = 0; slot < NUM_OF_SLOTS; slot++) {
        if (allTheSlots[slot].hasChildNodes()) {
                removeAllChildNodes(allTheSlots[slot])
            }
        if (tab[slot]) {
            img = itemImageSetup(tab[slot]);
            itemHolder = itemHolderSetup(inventory.readyName(), slot, img);
            allTheSlots[slot].appendChild(itemHolder);
        }
    }
    makeDraggableItemsDraggable()
}

function inventoryLoadOne(tabName, slot, itemID, justTheNumber=false) {
    if (tabName == inventory.readyName()) {
        if (justTheNumber) {
            document.getElementsByClassName('slot')[slot].getElementsByClassName('itemCount')[0].innerHTML = inventory.counts[tabName][slot];
        }
        else {
            img = itemImageSetup(itemID);
            itemHolder = itemHolderSetup(tabName, slot, img);
            document.getElementsByClassName('slot')[slot].appendChild(itemHolder);
        }
        makeDraggableItemsDraggable()
    }
}

function itemHolderSetup(tabName, slot, img) {
    //span area
    var span = document.createElement('span');
    span.classList = ['numberText itemCount'];
    if (!inventory.counts[tabName][slot] == 0) {   
        span.innerHTML = inventory.counts[tabName][slot];
    }
    //itemHolder area
    itemHolder = document.createElement('div');
    itemHolder.setAttribute('data-slotID', slot)
    itemHolder.classList = ['draggableItem itemHolder'];
    itemHolder.appendChild(img);
    itemHolder.appendChild(span)
    return itemHolder
}

// set up the inventory slots and load what should be in those slots AFTER
$(document).ready(function() {
    for (var i = 0;  i < ROWS_OF_SLOTS; i++) {
        $("#slotsSpot").append('<tr class="row"><td class="slot"></td><td class="slot"></td><td class="slot"></td><td class="slot"></td><td class="slot"></td></tr>');
    };
    inventoryLoad(); // I know not of a better way to get this to load after that^  Its like the computer is too fast
});