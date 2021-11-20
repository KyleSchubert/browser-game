const testTimings = [90,90,90,90];
function testFart() {
    let div = document.createElement('div');
    div = $(div);
    div.css('background-image', 'url(./skills/effect/61001000.png)')
    div.css('width', '283px');
    div.css('height', '167px');
    div.css('position', 'absolute');
    div.css('left', SQUAREposX - parseInt(div.css('width')) / 2 + 14 - $('#gameArea').position()['left']);
    div.css('top', SQUAREposY - parseInt(div.css('height')) / 2 + 14);
    $('#gameArea').append(div)
    playSound(sounds[allSoundFiles.indexOf('61001000use.mp3')])
    let bounds = div[0].getBoundingClientRect();
    checkHit(bounds['left'], bounds['right'], bounds['bottom'], bounds['top'], $('#gameArea').position()['left']);
    genericSpritesheetAnimation(div, 0, testTimings);
}

const testTimings2 = [90,90,90,90,90,90];
function hitTestFart(left, top, reason) {
    let div = document.createElement('div');
    div = $(div);
    div.css('background-image', 'url(./skills/hit/61001000.png)')
    div.css('width', '187px');
    div.css('height', '131px');
    div.css('position', 'absolute');
    div.css('left', left - parseInt(div.css('width')) / 2 + 14);
    div.css('top', top - parseInt(div.css('height')) / 2 + 14);
    $('#gameArea').append(div)
    div.attr('group', reason)
    playSound(sounds[allSoundFiles.indexOf('61001000hit.mp3')], reason)
}

const marginToAccountFor = parseInt($('#lootBlocker').css('margin-top'));
var data = {};
function checkHit(left, right, bottom, top, leftOffset) {
    data['left'] = left;
    data['right'] = right;
    data['bottom'] = bottom;
    data['top'] = top;
    data['leftOffset'] = leftOffset;
    Array.from(document.getElementsByClassName('mob')).forEach((element) => {
        if (!element.classList.contains('mobDying')) {
            hitCheckObserver.observe(element);
        }
    });
}

const hitCheckObserver = new IntersectionObserver((entries) => {
    let groupID = randomIntFromInterval(0, 1000000);
    let trueLeft = data['left'];
    let trueRight = data['right'];
    for (const entry of entries) {
        const bounds = entry.boundingClientRect;
        if ((between(bounds['left'], trueLeft, trueRight) || between(bounds['right'], trueLeft, trueRight)) && (between(bounds['top'], data['top'], data['bottom']) || between(bounds['bottom'], data['top'], data['bottom']))) {
            entry.target.click();
            hitTestFart(bounds['left']-data['leftOffset']+bounds['width']/2, bounds['top']+bounds['height']/2, groupID);
        }
    }
    genericSpritesheetAnimation($('[group="' + groupID.toString() + '"]'), 0, testTimings2);
    hitCheckObserver.disconnect();
});
