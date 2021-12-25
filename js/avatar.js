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
    let ids = [body, head, face];
    let faceState = 'default';
    let headState  = 'stand1';
    let bodyState  = 'stand1';
    let states = [bodyState, headState, faceState];
    for (let i=0; i<ids.length; i++) {
        addBodyPartsToAvatar(ids[i]);
        //addBodyPartToAvatar(ids[i], states[i]);
    }
    makeTestPixel(neck[0], neck[1]);
    makeTestPixel(neck[0]-4, neck[1]-19);
    makeTestPixel(neck[0]-4, neck[1]+11);
    cyclicAvatarAnimate(body, bodyState);
    cyclicAvatarAnimate(head, headState);
    cyclicAvatarAnimate(face, faceState);
}

function makeTestPixel(x, y) {
    let appendLocation = document.getElementById('avatarAreaNew');
    let pixel = document.createElement('div');
    pixel.style.position = 'absolute';
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    pixel.style.backgroundColor = 'red';
    pixel.style.width = '1px';
    pixel.style.height = '1px';
    pixel.style.zIndex = '999';
    appendLocation.appendChild(pixel);
}

function cyclicAvatarAnimate(id, state, reverse=false, frame=0) { // the part needs to already be on the avatar
    if (bodyData[id][state].length == 1) {
        let part = bodyData[id][state][frame][0];
        let partDiv = allAvatarParts[id][part[0][0]];
        partDiv.style.visibility = 'visible';
        return;
    }
    bodyData[id][state][frame].forEach((part) => {
        let partName = part[0][0];
        if (id == 12000 && partName == 'accessoryOverHair') { // the other kinds of ears (dont want these)
            return;
        }
        let partXOffset = part[0][1];
        let partDiv = allAvatarParts[id][partName];
        let staticPartDimensions = bodyOffsets[id][partName][0]; // these never change for any frame
        let mapTo = part[1];
        let origin = part[2];
        if (mapTo[0] == 'neck' || mapTo[0] == 'brow' || mapTo[0] == 'navel') {
            let value = [0, 0];
            if (mapTo[0] == 'brow') {
                value[0] -= 4;
                value[1] -= 20;
            }
            else if (mapTo[0] == 'navel') {
                value[0] -= 4;
                value[1] += 11;
            }
            //console.log('NECK STUFF!  ' + neck);
            //console.log(2*origin[0] - staticPartDimensions[0] + mapTo[1][0]);
            //console.log(2*origin[1] - staticPartDimensions[1] + mapTo[1][1]);
            //let changeX = neck[0] + value[0] - (2*origin[0] - staticPartDimensions[0] + mapTo[1][0]);
            //let changeY = neck[1] + value[1] - (2*origin[1] - staticPartDimensions[1] + mapTo[1][1]);
            let relativeLocationOfTargetX = origin[0] + mapTo[1][0];
            let relativeLocationOfTargetY = origin[1] + mapTo[1][1];
            let changeX = neck[0] + value[0] - relativeLocationOfTargetX;
            let changeY = neck[1] + value[1] - relativeLocationOfTargetY;
            partDiv.style.left = changeX + 'px';
            partDiv.style.top = changeY + 'px';
        }
        
        partDiv.style.backgroundPositionX = '-' + partXOffset + 'px';
        partDiv.style.visibility = 'visible';
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

function originFinder() {
    let x = 0;
    let y = 0;
    makeTestPixel(x, y);
    return;
}

var allAvatarParts = {};
var neck = [21, 34];
var avatarNavel = 1;
function addBodyPartsToAvatar(id) {
    let appendLocation = document.getElementById('avatarAreaNew');
    //let initialFrame = frames[0];
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
                let staticPartDimensions = bodyOffsets[id][partName][0]; // these never change for any frame
                let mapTo = part[1];
                let origin = part[2];
                console.log(partName);
                console.log(state);
                console.log(mapTo);
                //console.log(partName);
                //console.log(mapTo);
                if (mapTo[0] == 'neck' || mapTo[0] == 'brow' || mapTo[0] == 'navel') {
                    let value = [0, 0];
                    if (mapTo[0] == 'brow') {
                        value[0] -= 4;
                        value[1] -= 20;
                    }
                    else if (mapTo[0] == 'navel') {
                        value[0] -= 4;
                        value[1] += 11;
                    }
                    //console.log('NECK STUFF!  ' + neck);
                    //console.log(2*origin[0] - staticPartDimensions[0] + mapTo[1][0]);
                    //console.log(2*origin[1] - staticPartDimensions[1] + mapTo[1][1]);
                    //let changeX = neck[0] + value[0] - (2*origin[0] - staticPartDimensions[0] + mapTo[1][0]);
                    //let changeY = neck[1] + value[1] - (2*origin[1] - staticPartDimensions[1] + mapTo[1][1]);
                    let relativeLocationOfTargetX = origin[0] + mapTo[1][0];
                    let relativeLocationOfTargetY = origin[1] + mapTo[1][1];
                    console.log(relativeLocationOfTargetX);
                    console.log(relativeLocationOfTargetY);
                    let changeX = neck[0] + value[0] - relativeLocationOfTargetX;
                    let changeY = neck[1] + value[1] - relativeLocationOfTargetY;
                    partDiv.style.left = changeX + 'px';
                    partDiv.style.top = changeY + 'px';
                }
                if (id == 2000) {
                    partDiv.style.zIndex = 1;
                    let xSpot = staticPartDimensions[0] + -10;
                    let ySpot = staticPartDimensions[1] + 3;
                    if (partName == 'body' && state == 'stand1') {
                        //neck = [origin[0] + mapTo[1][0] + xSpot, origin[1] + mapTo[1][1] + ySpot];
                        //console.log('The neck is at  (left, top):  ' + neck[0] + ', ' + neck[1]);
                        //partDiv.style.left = xSpot + 'px';
                        //partDiv.style.top = ySpot + 'px';
                    }
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
                //makeTestPixel(origin[0], origin[1]);
                appendLocation.appendChild(partDiv);
                allAvatarParts[id][partName] = partDiv;
            });
        });
    });
}

$(() => {
    testing();
});
