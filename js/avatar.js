gearSlotOrder = ["hat", "boots", "cape", "gloves", "top", "bottom", "weapon"];
function loadAvatar() {
    document.getElementById("avatar").src=constructAvatarURL();
};

function constructAvatarURL(state="stand1") {
    finishedURL = "https://maplestory.io/api/character/%7B%22itemId%22:2000,%22version%22:%22213%22%7D,%7B%22itemId%22:12000,%22version%22:%22213%22%7D,";
    for (var i = 0; i < gearSlotOrder.length; i++) {
        currentElement = document.getElementById(gearSlotOrder[i]);
        if (currentElement.value.length != 0) {
            finishedURL = finishedURL.concat('%7B%22itemId%22:', currentElement.value, ',%22version%22:%22213%22%7D,');
        }
    }
    return finishedURL.concat("/", state, "/animated?flipX=true")
};

baseGear = [1005200, 1072745, 1102484, 1082544, 1042395, 1062258, 1242146];
function loadBase() {
    for (var i = 0; i < gearSlotOrder.length; i++) {
        currentElement = document.getElementById(gearSlotOrder[i]);
        currentElement.parentNode.classList.add("is-dirty");
        currentElement.value = baseGear[i];
    };
};