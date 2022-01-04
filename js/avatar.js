var equipmentLatestChange = 0;
const equipmentThatShowsUp = [2, 7, 12, 13, 16, 17, 19, 22, 23, 24, 27];
var lastAvatarHeight = 68;
var previousHatHeight = 0;
var avatarMoving = false;
var faceState = 'default';
var headState  = 'stand1';
var bodyState  = 'stand1';
var walkType = 'walk1';
const AVATAR = document.getElementById('avatarAreaNew');
const bodyItems = [2000, 12000, 20000];


var lastEquipmentPerVisualSlot = {2: 0, 7: 0, 12: 0, 13: 0, 16: 0, 17: 0, 19: 0, 22: 0, 23: 0, 24: 0, 27: 0};
function loadAvatar() {
    equipmentThatShowsUp.forEach((slot) => {
        if (itemsInEquipmentSlots[slot] != 0) {
            if (lastEquipmentPerVisualSlot[slot] == 0) {
                lastEquipmentPerVisualSlot[slot] = itemsInEquipmentSlots[slot].id;
                addItemToAvatar(itemsInEquipmentSlots[slot].id);
                if (slot == 16) {
                    walkType = getWeaponWalkType(itemsInEquipmentSlots[slot].id);
                }
            }
            else if (lastEquipmentPerVisualSlot[slot] != itemsInEquipmentSlots[slot].id) {
                removeItemFromAvatar(lastEquipmentPerVisualSlot[slot]);
                lastEquipmentPerVisualSlot[slot] = itemsInEquipmentSlots[slot].id;
                addItemToAvatar(itemsInEquipmentSlots[slot].id);
                if (slot == 16) {
                    walkType = getWeaponWalkType(itemsInEquipmentSlots[slot].id);
                }
            }
        }
        else if (itemsInEquipmentSlots[slot] == 0 && lastEquipmentPerVisualSlot[slot] != 0) {
            if (slot == 16) {
                walkType = 'walk1';
            }
            removeItemFromAvatar(lastEquipmentPerVisualSlot[slot]);
            lastEquipmentPerVisualSlot[slot] = 0;
        }
    });
    return;
}

function getWeaponWalkType(id) {
    if ('walk1' in allData[id]) {
        return 'walk1';
    }
    else {
        return 'walk2';
    }
}

function testing() {
    let body = 2000;
    let head = 12000;
    let face = 20000;
    let ids = [head, body, face];
    for (let i=0; i<ids.length; i++) {
        addBodyPartsToAvatar(ids[i]);
    }
    avatarAnimate();
}

function addItemToAvatar(id) {
    addBodyPartsToAvatar(id);
}

function removeItemFromAvatar(id) {
    Object.keys(allAvatarParts[id]).forEach((key) => {
        allAvatarParts[id][key].remove();
    });
    delete avatarEquipmentFrameRecords[lastEquipmentPerVisualSlot[slot]];
    delete allAvatarParts[lastEquipmentPerVisualSlot[slot]];
}

function makeTestPixel(x, y, color='red', name='') {
    let appendLocation = AVATAR;
    let pixel = document.createElement('div');
    pixel.style.position = 'absolute';
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    pixel.style.backgroundColor = color;
    pixel.style.width = '1px';
    pixel.style.height = '1px';
    pixel.style.zIndex = '999';
    pixel.setAttribute('name', name);
    appendLocation.appendChild(pixel);
}

function avatarDealWithUnusedParts(id, dataSource, state, frame) {
    let itemsUnusedParts = [];
    Object.keys(allAvatarParts[id]).forEach((partName) => {
        itemsUnusedParts.push(partName);
    });
    dataSource[id][state][frame].forEach((part) => {
        let partName = part[0][0];
        if (id == 12000 && partName == 'accessoryOverHair') { // the other kinds of ears (dont want these)
            return;
        }
        itemsUnusedParts.splice(itemsUnusedParts.indexOf(partName), 1);
        avatarSetPositionOfOnePart(part, id);
    });
    itemsUnusedParts.forEach((partName) => {
        let partDiv = allAvatarParts[id][partName];
        partDiv.style.visibility = 'hidden';
    });
}

function tempMoveFace() {
    let face = [];
    if (bodyData[20000][faceState].length == 1) {
        face = bodyData[20000][faceState][0][0];
    }
    else {
        face = bodyData[20000][faceState][frame][0];
    }
    avatarSetPositionOfOnePart(face, 20000);
}

const SMALL_UNIT_OF_TIME = 10;
var avatarEquipmentFrameRecords = {};
function avatarAnimate(reverse=false, frame=0) { // the part needs to already be on the avatar
    avatarDealWithUnusedParts(2000, bodyData, bodyState, frame);
    if (headState in bodyData[12000]) {
        if (bodyData[12000][headState].length == 1) { // stuff that needs to be updated when they get moved
            avatarDealWithUnusedParts(12000, bodyData, headState, 0);
        }
        else if (headState in bodyDelays[12000]) {
            if (bodyDelays[12000][headState].length == 0) {
                avatarDealWithUnusedParts(12000, bodyData, headState, 0);
            }
        }
    }
    tempMoveFace();
    Object.keys(avatarEquipmentFrameRecords).forEach((id) => {
        let realFrame = frame;
        if (allData[id][bodyState].length != 3) {
            realFrame = avatarEquipmentFrameRecords[id][1];
        }
        if (bodyState in allData[id]) {
            if (allData[id][bodyState].length == 1) { // stuff that needs to be updated when they get moved
                avatarDealWithUnusedParts(id, allData, bodyState, 0);
                return;
            }
        }
        else { // HIDE EVERYTHING 
            Object.keys(allAvatarParts[id]).forEach((partName) => {
                let partDiv = allAvatarParts[id][partName];
                partDiv.style.visibility = 'hidden';
            });
            return;
        }
        avatarDealWithUnusedParts(id, allData, bodyState, realFrame);
        if (allData[id][bodyState].length != 3) {
            if (realFrame == allData[id][bodyState].length-1) {
                realFrame = -1;
            }
            avatarEquipmentFrameRecords[id] = [false, realFrame+1];
        }
    });
    let delay = bodyDelays[2000][bodyState][frame];
    if (bodyState == 'stand1' || bodyState == 'stand2' || bodyState == 'alert') { // cyclic animation
        if (frame == bodyData[2000][bodyState].length-1) {
            scheduleToGameLoop(delay, avatarAnimate, [true, frame-1], 'body');
        }
        else {
            if (frame == 0) {
                reverse = false;
            }
            if (reverse) {
                scheduleToGameLoop(delay, avatarAnimate, [true, frame-1], 'body');
            }
            else {
                scheduleToGameLoop(delay, avatarAnimate, [false, frame+1], 'body');
            }
        }
    }
    else {
        if (frame == bodyData[2000][bodyState].length-1) {
            frame = -1; // restart the animation
        }
        scheduleToGameLoop(delay, avatarAnimate, [false, frame+1], 'body');
    }
}

function avatarSetPositionOfOnePart(part, id) { // part   =    entire item -> one state -> one frame -> one part  ex:  part = bodyData[id][state][frame]
    let partName = part[0][0];
    let partDiv = allAvatarParts[id][partName];
    let partXOffset = part[0][1];
    partDiv.style.backgroundPositionX = '-' + partXOffset + 'px';
    partDiv.style.visibility = 'visible';
    let offsets = positionOneAvatarPart(part);
    partDiv.style.left = offsets[0] + 'px';
    partDiv.style.top = offsets[1] + 'px';
    return;
}

var allAvatarParts = {};
//var neck = [21, 34];
function addBodyPartsToAvatar(id) {
    let appendLocation = AVATAR;
    let doneParts = [];
    let dataSource = [];
    let dataDimensionsSource = [];
    let item = false;
    if (bodyItems.includes(id)) {
        dataSource = bodyData;
        dataDimensionsSource = bodyDimensions;
    }
    else {
        dataSource = allData;
        dataDimensionsSource = allGroupDimensionsAndUnitDimensions;
        item = true;
    }
    Object.keys(dataSource[id]).forEach((state) => {
        dataSource[id][state].forEach((frame) => {
            frame.forEach((part) => {
                let partName = part[0][0];
                let fileDir = './item/' + id + '/' + partName + '.png';
                if (doneParts.includes(fileDir)) {
                    return;
                }
                doneParts.push(fileDir);
                let partXOffset = part[0][1];
                let partDiv = document.createElement('div');
                let partDimensions = dataDimensionsSource[id][partName];
                if (item) {
                    partDiv.style.width = partDimensions[1] + 'px';
                    partDiv.style.height = partDimensions[0][1] + 'px';
                }
                else {
                    partDiv.style.width = partDimensions[1][0] + 'px';
                    partDiv.style.height = partDimensions[1][1] + 'px';
                }
                let offsets = positionOneAvatarPart(part);
                partDiv.style.left = offsets[0] + 'px';
                partDiv.style.top = offsets[1] + 'px';
                if (id == 12000 && part[0][0] == 'accessoryOverHair') {
                    return;
                }
                partDiv.style.zIndex = avatarZIndexOrder.indexOf(part[0][0]);
                partDiv.classList = ['avatarPart'];
                partDiv.style.backgroundImage = 'url(' + fileDir + ')';
                partDiv.style.backgroundPositionX = '-' + partXOffset + 'px';
                partDiv.style.visibility = 'hidden';
                if (!(id in allAvatarParts)) {
                    allAvatarParts[id] = {};
                }
                if (!(id in avatarEquipmentFrameRecords) && !(bodyItems.includes(id))) {
                    avatarEquipmentFrameRecords[id] = [false, 0];
                }
                appendLocation.appendChild(partDiv);
                allAvatarParts[id][partName] = partDiv;
            });
        });
    });
}

var brow = [0, 0];
var headBrow = [0, 0];
var headNeck = [0, 0];
var neck = [0, 0];
var bodyNeck = [0, 0];
var bodyNavel = [0, 0];
var navel = [0, 0];
var armNavel = [0, 0];
var armHand = [0, 0];
var hand = [0, 0];
var handMove = [0, 0];
var leftHandMove = [0, 0];
function positionOneAvatarPart(part) { // converted to JS from pascal and slightly changed (from github user Elem8100's https://github.com/Elem8100/MapleStory-GM-Client/blob/1dd68e134e84fba54937c21d9889eff4c63dbe94/Src/MapleCharacter.pas)
    let offsets = [0, 0];  // [Left, Top] like everything else
    let origin = part[2];
    let maps = part[1];
    let mapSpots = Object.keys(maps);
    let partName = part[0][0]; // I'm assuming this is what they used in place of these -> example:   if (Image == 'arm') { ... }
    if (mapSpots.includes('brow')) {
        brow[0] = maps['brow'][0];
        brow[1] = maps['brow'][1];
        if (partName == 'head') {
            headBrow[0] = brow[0];
            headBrow[1] = brow[1];
        }
        offsets[0] = -(origin[0] + headNeck[0] - bodyNeck[0] - headBrow[0] + brow[0]);
        offsets[1] = -(origin[1] + headNeck[1] - bodyNeck[1] - headBrow[1] + brow[1]);
    }
    if (mapSpots.includes('neck')) {
        neck[0] = maps['neck'][0];
        neck[1] = maps['neck'][1];
        if (partName == 'body') {
            bodyNeck[0] = neck[0];
            bodyNeck[1] = neck[1];
        }
        if (partName == 'head') {
            headNeck[0] = neck[0];
            headNeck[1] = neck[1];
        }
    }
    if (mapSpots.includes('hand')) {
        hand[0] = maps['hand'][0];
        hand[1] = maps['hand'][1];
        if (partName == 'arm') {
            armHand[0] = hand[0];
            armHand[1] = hand[1];
        }
        offsets[0] = -(origin[0] + hand[0] + armNavel[0] - armHand[0] - bodyNavel[0]);
        offsets[1] = -(origin[1] + hand[1] + armNavel[1] - armHand[1] - bodyNavel[1]);
    }
    if (mapSpots.includes('handMove')) {
        handMove[0] = maps['handMove'][0];
        handMove[1] = maps['handMove'][1];
        if (partName == 'lHand') {
            leftHandMove[0] = handMove[0];
            leftHandMove[1] = handMove[1];
        }
        offsets[0] = -(origin[0] + handMove[0] - leftHandMove[0]);
        offsets[1] = -(origin[1] + handMove[1] - leftHandMove[1]);
    }
    if (mapSpots.includes('navel')) {
        navel[0] = maps['navel'][0];
        navel[1] = maps['navel'][1];
        if (partName == 'arm') {
            armNavel[0] = navel[0];
            armNavel[1] = navel[1];
        }
        if (partName == 'body') {
            bodyNavel[0] = navel[0];
            bodyNavel[1] = navel[1];
        }
        offsets[0] = -(origin[0] + navel[0] - bodyNavel[0]);
        offsets[1] = -(origin[1] + navel[1] - bodyNavel[1]);
    }
    return offsets;
}

$(() => {
    testing();
});

function avatarWalk() {
    if (avatarMoving) {
        bodyState = walkType;
        headState = walkType;
        requestAnimationFrame(() => {
            if (leftArrowPressed) {
                if (AVATAR.style.transform == 'scaleX(-1)') {
                    AVATAR.style.left = AVATAR.offsetLeft + 6 + 'px';
                }
                AVATAR.style.transform = 'scaleX(1)';
                AVATAR.style.left = AVATAR.offsetLeft - 3 + 'px';
            }
            else {
                if (AVATAR.style.transform == 'scaleX(1)') {
                    AVATAR.style.left = AVATAR.offsetLeft - 6 + 'px';
                }
                AVATAR.style.transform = 'scaleX(-1)';
                AVATAR.style.left = AVATAR.offsetLeft + 3 + 'px';
            }
            setTimeout(() => {
                avatarWalk();
            }, 20);
        });
    }
}
