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
    let face = 20000;
    let head = 12000;
    let body = 2000;
    let ids = [face, head, body];
    let faceState = 'default';
    let headState  = 'front';
    let bodyState  = 'stand1';
    let states = [faceState, headState, bodyState];
    for (let i=0; i<ids.length; i++) {
        addBodyPartToAvatar(ids[i], states[i]);
    }
}

function addBodyPartToAvatar(id, state) {
    let appendLocation = document.getElementById('avatarAreaNew');
    let frames = bodyData[id][state];
    let initialFrame = frames[0];
    initialFrame.forEach((part) => {
        let fileDir = './item/' + id + '/' + part[0] + '.png';
        let coordsForPart = part[1];
        let partDiv = document.createElement('div');
        let partDimensions = bodyDimensions[id][part[0]][1];
        let staticPartDimensions = bodyOffsets[id][part[0]]; // these never change for any frame
        switch(id) {
            case 2000: // body
                partDiv.style.zIndex = 1;
                staticPartDimensions[0] += -10;
                staticPartDimensions[1] += 3;
                break;
            case 12000: // head
                partDiv.style.zIndex = 2;
                staticPartDimensions[0] += -15;
                staticPartDimensions[1] += -15;
                break;
            case 20000: // face
                partDiv.style.zIndex = 3;
                staticPartDimensions[0] += -8;
                staticPartDimensions[1] += 10;
                break;
        }
        partDiv.classList = ['avatarPart'];
        partDiv.style.width = partDimensions[0] + 'px';
        partDiv.style.height = partDimensions[1] + 'px';
        partDiv.style.backgroundImage = 'url(' + fileDir + ')';
        partDiv.style.backgroundPosition = '-' + coordsForPart[0] + 'px -' + coordsForPart[1] + 'px';
        partDiv.style.left = staticPartDimensions[0] + 'px';
        partDiv.style.top = staticPartDimensions[1] + 'px';
        appendLocation.appendChild(partDiv);
    });
}

$(() => {
    testing();
});
