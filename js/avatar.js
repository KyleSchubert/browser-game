var equipmentLatestChange = 0;
const equipmentThatShowsUp = [2, 7, 12, 13, 16, 17, 19, 22, 23, 24, 27];
var lastAvatarHeight = 68;
var previousHatHeight = 0;

function loadAvatar() {
    console.log('activated')
    $('#avatar').attr('src', constructAvatarURL())
};

function constructAvatarURL(state='stand1') {
    finishedURL = 'https://maplestory.io/api/character/%7B%22itemId%22%3A2000,%22version%22%3A%22213%22%7D,%7B%22itemId%22%3A12000,%22version%22%3A%22213%22%7D,%7B%22itemId%22%3A20100%2C%22animationName%22%3A%22default%22%2C%22version%22%3A%22213%22%7D,';
    equipmentThatShowsUp.forEach(function(i) {
        if (itemsInEquipmentSlots[i] != 0) {
            finishedURL = finishedURL.concat('%7B%22itemId%22%3A', itemsInEquipmentSlots[i].id, ',%22version%22%3A%22213%22%7D,');
        };
    })
    return finishedURL.concat('/', state, '/animated?showEars=false&showLefEars=false&resize=1&flipX=false');
};

$(document).ready(function() {
    $('#avatar').on('load', function(event) {
        console.log(''.concat('THE HEIGHT IS NOW: ', $(this).height()));
        if (equipmentLatestChange == 2) { // hat changed
            previousHatHeight -= lastAvatarHeight - $(this).height();
            let shift = previousHatHeight;
            let newValue = 702 - shift;
            $('#avatarArea').css('top', ''.concat(newValue, 'px'));
        }
        lastAvatarHeight = $(this).height();
    });
})
