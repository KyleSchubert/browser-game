shopInventories = {
    80001: [1113095, 1342111, 1282036, 1282027, 2870008, 2870021, 2000019, 2046319, 4000001, 4000012]
};

shopWorths = {
    1113095: 15000000, 
    1342111: 351000000, 
    1282036: 79999, 
    1282027: 359000, 
    2870008: 1200, 
    2870021: 880, 
    2000019: 15000, 
    2046319: 240000, 
    4000001: 34, 
    4000012: 10
};

$('#shopHolder .guiInnerContentArea .closeButton').click(function() {
    guiClose(guiIDs[0])
    playSound(sounds[5]) // MenuUp.mp3
});

$(document).ready(function() {
    node = document.getElementById('shopButtonArea');
    shopButtonAppeared(node)
});

function shopButtonAppeared(shopNode) {
    $(shopNode).mouseenter(function(event) {
        id = this.getAttribute('value');
        if (!shopInventories[id].every(checkIfStoreItemsInKnownItems)) {
            shopInventories[id].forEach(checkIfWeKnowTheItemName)
        }
        $(this).off(event)
    });
}

function preloadTheShop() {
    id = this.getAttribute('value')
    if (!shopInventories[id].every(checkIfStoreItemsInKnownItems)) {
        shopInventories[id].forEach(checkIfWeKnowTheItemName)
    }
    $(this).unbind('mouseenter', preloadTheShop)
}

function shopLoad(id) {
    $('#shopHolder .guiInnerContentArea .shopItemArea:not(.sellArea)').html('')
    if (!shopInventories[id].every(checkIfStoreItemsInKnownItems)) { // Essentially, this is a backup for if I forget to do   shopButtonAppeared(shopNode)
        shopInventories[id].forEach(checkIfWeKnowTheItemName)
        setTimeout(function () {
            shopInventories[id].forEach(function (i) {
                createItemCard(i)
            }); 
        }, 30); //I really really can't figure out a better way. async: false was deprecated
    }  //                                      and nothing else works exactly like that.
    else {
        shopInventories[id].forEach(function (i) {
            createItemCard(i)
        })
    }
    
}

const checkIfStoreItemsInKnownItems = (id) => knownItemNames.includes(id); // i don't know what this means, but it is important


function createItemCard(itemID, playerItem=false) {
    newDiv = document.createElement('div');
    newDiv.classList = ['itemCard clickable'];

    newerDiv = document.createElement('div');
    newerDiv.classList = ['itemCardImageArea'];
    newImg = itemImageSetup(itemID);
    newerDiv.appendChild(newImg)
    newDiv.appendChild(newerDiv)

    newItemName = document.createElement('span');
    newItemName.innerHTML = itemNames[itemID];
    newItemName.classList = ['itemCardName'];
    newDiv.appendChild(newItemName)

    newCoinImg = document.createElement('img');
    newCoinImg.src = "/files/doubloon.png";
    newCoinImg.classList = ['itemCardPriceCoin'];
    newDiv.appendChild(newCoinImg)

    newItemPrice = document.createElement('span');
    newItemPrice.innerHTML = numberWithCommas(shopWorths[itemID]);
    newItemPrice.classList = ['itemCardPrice numberText'];
    newDiv.appendChild(newItemPrice)

    addSelectionListener(newDiv)
    if (playerItem) {
        $('#shopHolder .guiInnerContentArea .sellArea').append(newDiv)
    }
    else {
        $('#shopHolder .guiInnerContentArea .shopItemArea:not(.sellArea)').append(newDiv)
    }
}

function neededToWaitBeforeContinuing(id) { // as in: needed to wait before continuing with getting the item name so it becomes known and saved
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: getUrlForItemName(id),
            success: function (data) {
                resolve(data)
            },
            error: function(err) {
                reject(err)
            }
        });
    });  
}

function checkIfWeKnowTheItemName(id) { // every item for the shop goes through here just in case
    if (!knownItemNames.includes(id)) { // but here it only does stuff if the name isn't known
        neededToWaitBeforeContinuing(id).then(function(data) {
            wanted = data['name'];
            itemNames[id] = wanted;
            knownItemNames.push(id)
        }).catch(function(err) {
            console.log(err)
        })
    }
}

function getUrlForItemName(itemID) { //
    url = "https://maplestory.io/api/GMS/215/item/".concat(itemID).concat('/name');
    return url
}

function deleteItem(slotNumber) {
    tab = inventory.getter()
    tab[slotNumber] = 0;
    counts[slotNumber] = 0;
    $('.slot')[slotNumber].children[0].remove()
}

var sellingItemId = 0;
var weAreCurrentlySelling = false;
function sellProcess() {
    $(itemBeingSold).css('pointer-events', 'none')
    $(itemBeingSold).css('visibility', 'hidden')
    sellingItemId = itemBeingSoldId; // ez fix or maybe this is just the brainiac solution?
    weAreCurrentlySelling = true;
    dialogTrigger('shop')
}

function secondPartOfSellProcess() {
    soldAmount = shopGetTransferAmount();
    remaining = itemBeingSoldCount-soldAmount;
    tab = inventory.getter();
    counts = inventory.countsGetter();
    slotNumber = itemBeingSold.getAttribute('data-slotID');
    if (inventory.readyName() == 'Equip' || remaining <= 0) {
        deleteItem(slotNumber)
    }
    else {
        counts[slotNumber] = remaining;
        $('.slot:eq(' + slotNumber + ') span')[0].innerHTML = remaining;
        $(itemBeingSold).css('left', '0px')
        $(itemBeingSold).css('top', '0px')
        $(itemBeingSold).css('pointer-events', 'auto')
        $(itemBeingSold).css('visibility', 'visible')
    }

    weAreCurrentlySelling = false;
    createItemCard(itemBeingSoldId, true)
    removeSellingTip()
}

function shopGetTransferAmount() { // the dialog box has to be open while this happens; otherwise, it will just return whatever the thing's default value is
    return $('#smallAmountArea').val()
}

function shopGetItemId() {
    return $('.selectedThing:eq(0) img:eq(0)').val()
}

function transferIt(buying) { //id is only necessary for selling because it can be easily gotten when buying
    transferAmount = shopGetTransferAmount();
    if (buying) {
        id = shopGetItemId();
        obtainItem(id, transferAmount)
        value = -1;
    }
    else {
        id = itemBeingSoldId;
        value = 1;
    }
    if (!(id in shopWorths)) {
        value = value*transferAmount;
    }
    else {
        value = value*shopWorths[id]*transferAmount;
    }
    updateDoubloons(value) // when buying the value should be negative
    console.log(id)
    console.log(value)
    console.log(transferAmount)
    // temporary v v v
    sentence = 'The value of this stuff is ' + numberWithCommas(value) + '.';
    console.log(sentence)
    // temporary ^ ^ ^
}

function removeSellingTip() {
    $('.beforeSellText1').remove()
    $('.beforeSellText2').remove()
}

var doubloons = 0;
function updateDoubloons(value=0) {
    doubloons = Number(doubloons) + value;
    document.getElementsByClassName('amountOfDoubloons')[0].innerHTML = numberWithCommas(doubloons);
}