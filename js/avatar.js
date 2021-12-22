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
        addBodyPartToAvatar(ids[i], states[i]);
    }
}

var neck = [0, 0];
var avatarNavel = 1;
function addBodyPartToAvatar(id, state) {
    let appendLocation = document.getElementById('avatarAreaNew');
    let frames = bodyData[id][state];
    let initialFrame = frames[0];
    initialFrame.forEach((part) => {
        let fileDir = './item/' + id + '/' + part[0][0] + '.png';
        let coordsForPart = part[0][1];
        let partDiv = document.createElement('div');
        let partDimensions = bodyDimensions[id][part[0][0]][1];
        let staticPartDimensions = bodyOffsets[id][part[0][0]][0]; // these never change for any frame
        let mapTo = part[1];
        let origin = part[2];
        if (mapTo[0] == 'neck' || mapTo[0] == 'brow' || mapTo[0] == 'navel') {
            let value = [0, 0];
            if (mapTo[0] == 'brow') {
                value[0] -= 4;
                value[1] -= 20;
            }
            else if (mapTo[0] == 'navel') {
                value[0] -= 5;
                value[1] += 12;
            }
            //console.log('NECK STUFF!  ' + neck);
            //console.log(2*origin[0] - staticPartDimensions[0] + mapTo[1][0]);
            //console.log(2*origin[1] - staticPartDimensions[1] + mapTo[1][1]);
            let changeX = neck[0] + value[0] - (2*origin[0] - staticPartDimensions[0] + mapTo[1][0]);
            let changeY = neck[1] + value[1] - (2*origin[1] - staticPartDimensions[1] + mapTo[1][1]);
            partDiv.style.left = changeX + 'px';
            partDiv.style.top = changeY + 'px';
        }
        switch(id) {
            case 2000: // body
                partDiv.style.zIndex = 1;
                staticPartDimensions[0] += -10;
                staticPartDimensions[1] += 3;
                if (part[0][0] == 'body') {
                    neck = [origin[0] + mapTo[1][0] + staticPartDimensions[0], origin[1] + mapTo[1][1] + staticPartDimensions[1]];
                    //console.log('The neck is at  (left, top):  ' + neck[0] + ', ' + neck[1]);
                    partDiv.style.left = staticPartDimensions[0] + 'px';
                    partDiv.style.top = staticPartDimensions[1] + 'px';
                }
                break;
            case 12000: // head
                partDiv.style.zIndex = 2;
                if (part[0][0] == 'accessoryOverHair') {
                    return;
                }
                break;
            case 20000: // face
                partDiv.style.zIndex = 3;
                break;
        }
        partDiv.classList = ['avatarPart'];
        partDiv.style.width = partDimensions[0] + 'px';
        partDiv.style.height = partDimensions[1] + 'px';
        partDiv.style.backgroundImage = 'url(' + fileDir + ')';
        partDiv.style.backgroundPosition = '-' + coordsForPart[0] + 'px -' + coordsForPart[1] + 'px';
        appendLocation.appendChild(partDiv);
    });
}

$(() => {
    testing();
});
