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
});

$(document).ready(function() {
    node = document.getElementById('shopButtonArea');
    shopButtonAppeared(node)
});

function shopButtonAppeared(shopNode) {
    $(shopNode).mouseenter(function(event) {
        id = this.getAttribute('value');
        if (!shopInventories[id].every(checkIfStoreItemsInKnownItems)) {
            shopInventories[id].forEach(maybeFindItemName)
        }
        $(this).off(event)
    });
}

function preloadTheShop() {
    id = this.getAttribute('value')
    if (!shopInventories[id].every(checkIfStoreItemsInKnownItems)) {
        shopInventories[id].forEach(maybeFindItemName)
    }
    $(this).unbind('mouseenter', preloadTheShop)
}

function shopLoad(id) {
    $('#shopHolder .guiInnerContentArea .shopItemArea:not(.sellArea)').html('')
    if (!shopInventories[id].every(checkIfStoreItemsInKnownItems)) { // Essentially, this is a backup for if I forget to do   shopButtonAppeared(shopNode)
        shopInventories[id].forEach(maybeFindItemName)
        setTimeout(function(){ shopInventories[id].forEach(createItemCard); }, 30); //I really really can't figure out a better way. async: false was deprecated
    }  //                                                                             and nothing else works exactly like that.
    else {
        shopInventories[id].forEach(createItemCard)
    }
    
}

const checkIfStoreItemsInKnownItems = (id) => knownItemNames.includes(id);
    

function createItemCard(itemID) {
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

    $('#shopHolder .guiInnerContentArea .shopItemArea:not(.sellArea)').append(newDiv)
}

function neededToWaitBeforeContinuing(id) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: getItemName(id),
            success: function (data) {
                resolve(data)
            },
            error: function(err) {
                reject(err)
            }
        });
    });  
}

function maybeFindItemName(id) {
    if (!knownItemNames.includes(id)) {
        neededToWaitBeforeContinuing(id).then(function(data) {
            wanted = data['name'];
            itemNames[id] = wanted;
            knownItemNames.push(id)
        }).catch(function(err) {
            console.log(err)
        })
    }
}

function getItemName(itemID) {
    url = "https://maplestory.io/api/GMS/215/item/".concat(itemID).concat('/name');
    return url
}

function sellProcess(itemCount, id, theItem) {
    $(theItem).css('pointer-events', 'none')
    $(theItem).css('visibility', 'hidden')
    sellAmount = itemCount;
    if (!sellAmount) {
        sellAmount = 1;
    }
    if (!(id in shopWorths)) {
        value = 1*sellAmount;
    }
    else {
        value = shopWorths[id]*sellAmount;
    }
    sentence = 'The value of this stuff is ' + numberWithCommas(value) + '.';
    console.log(sentence)
    tab = inventory.getter(inventoryCurrentSelectedTab.innerHTML);
    counts = inventory.countsGetter(inventoryCurrentSelectedTab.innerHTML);
    tab[theItem.getAttribute('data-slotID')] = 0;
    if (!(counts[theItem.getAttribute('data-slotID')] == 0)) { // must not be an equip item
        counts[theItem.getAttribute('data-slotID')] = itemCount-sellAmount;
    }
    if (itemCount - sellAmount <= 0) {
        $("#slotsSpot").remove(theItem)
    }
    else {
        $(theItem).css('left', '0px')
        $(theItem).css('top', '0px')
        $(theItem).css('pointer-events', 'auto')
        $(theItem).css('visibility', 'visible')
    }

    updateDoubloons(value)
}

var doubloons = 0;
function updateDoubloons(value) {
    doubloons = Number(doubloons) + value;
    document.getElementsByClassName('amountOfDoubloons')[0].innerHTML = numberWithCommas(doubloons);
}