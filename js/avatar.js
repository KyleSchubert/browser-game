var equipmentLatestChange = 0;
const equipmentThatShowsUp = [2, 7, 12, 13, 16, 17, 19, 22, 23, 24, 27];
var lastAvatarHeight = 68;
var previousHatHeight = 0;

function loadAvatar() {
    console.log('activated');
    $('#avatar').attr('src', constructAvatarURL());
}

function constructAvatarURL(state='stand1') {
    let finishedURL = 'https://maplestory.io/api/character/%7B%22itemId%22%3A2000,%22version%22%3A%22213%22%7D,%7B%22itemId%22%3A12000,%22version%22%3A%22213%22%7D,%7B%22itemId%22%3A20100%2C%22animationName%22%3A%22default%22%2C%22version%22%3A%22213%22%7D,';
    equipmentThatShowsUp.forEach(function(i) {
        if (itemsInEquipmentSlots[i] != 0) {
            finishedURL = finishedURL.concat('%7B%22itemId%22%3A', itemsInEquipmentSlots[i].id, ',%22version%22%3A%22213%22%7D,');
        }
    });
    return finishedURL.concat('/', state, '/animated?showEars=false&showLefEars=false&resize=1&flipX=false');
}

$(() => {
    $('#avatar').on('load', function() {
        console.log(''.concat('THE HEIGHT IS NOW: ', $(this).height()));
        if (equipmentLatestChange == 2) { // hat changed
            previousHatHeight -= lastAvatarHeight - $(this).height();
            let shift = previousHatHeight;
            let newValue = 702 - shift;
            $('#avatarArea').css('top', ''.concat(newValue, 'px'));
        }
        lastAvatarHeight = $(this).height();
    });
});

function testing() {
    let body = 2000;
    let head = 12000;
    let face = 20000;
    let ids = [head, body, face];
    let faceState = 'default';
    let headState  = 'stand1';
    let bodyState  = 'stand1';
    for (let i=0; i<ids.length; i++) {
        addBodyPartsToAvatar(ids[i]);
        //addBodyPartToAvatar(ids[i], states[i]);
    }
    cyclicAvatarAnimate(body, bodyState);
    cyclicAvatarAnimate(head, headState);
    cyclicAvatarAnimate(face, faceState);
}

function makeTestPixel(x, y, color='red', name='') {
    let appendLocation = document.getElementById('avatarAreaNew');
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

function cyclicAvatarAnimate(id, state, reverse=false, frame=0) { // the part needs to already be on the avatar
    if (bodyData[id][state].length == 1) {
        let part = bodyData[id][state][frame][0];
        let partDiv = allAvatarParts[id][part[0][0]];
        let partName = part[0][0];
        let partXOffset = part[0][1];
        partDiv.style.backgroundPositionX = '-' + partXOffset + 'px';
        partDiv.style.visibility = 'visible';
        console.log('TRIED TO POSITION ' + partName + ' at:');
        let offsets = positionOneAvatarPart(part,id);
        console.log(offsets);
        makeTestPixel(offsets[0], offsets[1], 'red', partName);
        return;
    }
    bodyData[id][state][frame].forEach((part) => {
        let partName = part[0][0];
        if (id == 12000 && partName == 'accessoryOverHair') { // the other kinds of ears (dont want these)
            return;
        }
        let partXOffset = part[0][1];
        let partDiv = allAvatarParts[id][partName];
        partDiv.style.backgroundPositionX = '-' + partXOffset + 'px';
        partDiv.style.visibility = 'visible';
        console.log('TRIED TO POSITION ' + partName + ' at:');
        let offsets = positionOneAvatarPart(part, id);
        console.log(offsets);
        makeTestPixel(offsets[0], offsets[1], 'red', partName);
        partDiv.style.left = offsets[0] + 'px';
        partDiv.style.top = offsets[1] + 'px';
    });
    if (frame == bodyData[id][state].length-1) {
        setTimeout(() => {
            cyclicAvatarAnimate(id, state, true, frame-1);
        }, 500);
    }
    else {
        if (frame == 0) {
            reverse = false;
        }
        if (reverse) {
            setTimeout(() => {
                cyclicAvatarAnimate(id, state, true, frame-1);
            }, 500);
        }
        else {
            setTimeout(() => {
                cyclicAvatarAnimate(id, state, false, frame+1);
            }, 500);
        }
    }
}

var allAvatarParts = {};
//var neck = [21, 34];
function addBodyPartsToAvatar(id) {
    let appendLocation = document.getElementById('avatarAreaNew');
    let doneParts = [];
    Object.keys(bodyData[id]).forEach((state) => {
        bodyData[id][state].forEach((frame) => {
            frame.forEach((part) => {
                let partName = part[0][0];
                let fileDir = './item/' + id + '/' + partName + '.png';
                if (doneParts.includes(fileDir) || (state != 'stand1' && id == 2000)) {
                    return;
                }
                doneParts.push(fileDir);
                let partXOffset = part[0][1];
                let partDiv = document.createElement('div');
                let partDimensions = bodyDimensions[id][partName][1];
                console.log('TRIED TO POSITION ' + partName + ' at:');
                let offsets = positionOneAvatarPart(part, id);
                console.log(offsets);
                partDiv.style.left = offsets[0] + 'px';
                partDiv.style.top = offsets[1] + 'px';
                if (id == 2000) {
                    partDiv.style.zIndex = 1;
                }
                else if (id == 12000) {
                    if (part[0][0] == 'accessoryOverHair') {
                        return;
                    }
                    partDiv.style.zIndex = 2;
                }
                else if (id == 20000) {
                    partDiv.style.zIndex = 3;
                }
                partDiv.classList = ['avatarPart'];
                partDiv.style.width = partDimensions[0] + 'px';
                partDiv.style.height = partDimensions[1] + 'px';
                partDiv.style.backgroundImage = 'url(' + fileDir + ')';
                partDiv.style.backgroundPositionX = '-' + partXOffset + 'px';
                partDiv.style.visibility = 'hidden';
                if (!(id in allAvatarParts)) {
                    allAvatarParts[id] = {};
                }
                appendLocation.appendChild(partDiv);
                allAvatarParts[id][partName] = partDiv;
            });
        });
    });
}

function getPartType(itemId) {
    let partType = '';
    switch (Math.floor(itemId / 10000)) {
        case 0:
            partType = 'body';
            break;
        case 1:
            partType = 'head';
            break;
        case 2, 5:
            partType = 'face';
            break;
        case 3, 4, 6:
            partType = 'hair';
            break;
    }
    return partType;
}

// I'LL REMOVE WHAT I DONT USE (like normal)
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
function positionOneAvatarPart(part, itemId) { // converted to JS from pascal and slightly changed (from github user Elem8100's https://github.com/Elem8100/MapleStory-GM-Client/blob/1dd68e134e84fba54937c21d9889eff4c63dbe94/Src/MapleCharacter.pas)
    //console.log('NECK');
    //console.log(neck);
    let offsets = [0, 0];  // [Left, Top] like everything else
    let origin = part[2];
    let maps = part[1];
    let mapSpots = Object.keys(maps);
    let partName = part[0][0]; // I'm assuming this is what they used in place of these -> example:   if (Image == 'arm') { ... }
    console.log('--------' + partName + '---------');
    if (mapSpots.includes('brow')) {
        brow[0] = maps['brow'][0];
        brow[1] = maps['brow'][1];
        if (partName == 'head') {
            //headBrow = brow;
            headBrow[0] = brow[0];
            headBrow[1] = brow[1];
        }
        console.log(origin + '   ' + headNeck + '   ' + bodyNeck + '   ' + headBrow + '   ' + brow);
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
        console.log(origin + '   ' + hand + '   ' + armNavel + '   ' + armHand + '   ' + bodyNavel);
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
        console.log(origin + '   ' + handMove + '   ' + leftHandMove);
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
        console.log(origin + '   ' + navel + '   ' + bodyNavel);
        offsets[0] = -(origin[0] + navel[0] - bodyNavel[0]);
        offsets[1] = -(origin[1] + navel[1] - bodyNavel[1]);
    }
    return offsets;
}

$(() => {
    testing();
});
