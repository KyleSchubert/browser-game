function itemDropSetup(img, aligner) {
    $(img).on("click", img, lootItem);
    img.classList.add("droppedItem");
    var div = document.createElement("div");
    div.classList = ["itemAnimationHelper"];
    document.getElementById("lootSurface").appendChild(aligner);
    document.getElementsByClassName("dropAligner")[document.getElementsByClassName("dropAligner").length-1].appendChild(div);
    document.getElementsByClassName("itemAnimationHelper")[document.getElementsByClassName("itemAnimationHelper").length-1].appendChild(img);
}

function itemImageSetup(itemID) {
    if (knownItemImages.includes(itemID)) {
        url = '/item/'.concat(itemID);
        image = url.concat('/icon.png')
    }
    else {
        $.ajax({
            url:'/item/'.concat(itemID).concat('/icon.png'),
            type:'HEAD',
            error: function()
            {
                url = getItemURL(itemID);
                image = url.concat("/icon");
            },
            success: function()
            {
                url = '/item/'.concat(itemID);
                image = url.concat('/icon.png')
            }
        });
        knownItemImages.push(itemID)
    }
    //name = concat(url, "/name") and then parsing the result of the request and going ['name'] on it;
    
    var img = new Image();
    img.classList = ["item clickable"];
    img.src = image;
    img.value = itemID;
    img.setAttribute('draggable', false);
    return img;
}

function dropLoot(dropCount=document.getElementById("dropCount").value) {
    var aligner = document.createElement("div");
    aligner.classList = ["dropAligner"];
    aligner.style.width = "".concat(dropCount*32, "px");
    aligner.value = dropCount;
    const lootSurface = document.getElementById("lootSurface");
    if (lootSurface.lastElementChild) {
        aligner.style.zIndex = Number(lootArea.lastElementChild.style.zIndex)+1;
    }
    else {
        aligner.style.zIndex = 1;
    }
    aligner.style.marginLeft = "".concat((lootArea.offsetWidth - dropCount*32)/2, "px");
    for (var i = 0; i < dropCount; i++) {
        id = validItemIDs[Math.floor((Math.random() * validItemIDs.length))]; //FOR TESTING
        itemDropSetup(itemImageSetup(id), aligner)
        memorizeItemType(id)
    }
}


// overcat: {cat: {subcat: [itemID, itemID, ...]}}

// itemID: [overcat, cat, subcat]

function memorizeItemType(itemID) {
    if (typeof itemsAndTheirTypes[itemID] == 'undefined') {
        $.get(getItemURL(itemID), function(data) {
            typeInfo = data['typeInfo'];
            overcat = typeInfo['overallCategory'];
            cat = typeInfo['category'];
            subcat = typeInfo['subCategory'];
            if (typeof itemsByType[overcat][cat] == 'undefined') { // as in: if it doesn't exist yet, make it
                itemsByType[overcat][cat] = {};
            }
            if (typeof itemsByType[overcat][cat][subcat] == 'undefined') {
                itemsByType[overcat][cat][subcat] = [];
            }
            if (!itemsByType[overcat][cat][subcat].includes(itemID)) {
                itemsByType[overcat][cat][subcat].push(itemID);
            }
            if (typeof itemsAndTheirTypes[itemID] == 'undefined') {
                itemsAndTheirTypes[itemID] = [overcat, cat, subcat];
            }
        });
    }
}

function clearItems() {
    const lootSurface = document.getElementById("lootSurface");
    while (lootSurface.lastElementChild) {
        lootSurface.removeChild(lootSurface.lastElementChild);
    }
}

function getItemURL(id) {
    url = "https://maplestory.io/api/GMS/215/item/".concat(id);
    return url
}