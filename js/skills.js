
const testTimings = [90,90,90,90];
function testFart() {
    let div = document.createElement('div');
    div = $(div);
    div.css('background-image', 'url(./skills/effect/61001000.png)')
    div.css('width', '283px');
    div.css('height', '167px');
    div.css('position', 'absolute');
    div.css('left', SQUAREposX - parseInt(div.css('width')) / 2 + 14);
    div.css('top', SQUAREposY - parseInt(div.css('height')) / 2 + 14);
    $('#gameArea').append(div)
    playSound(sounds[allSoundFiles.indexOf('61001000use.mp3')])
    let bounds = div[0].getBoundingClientRect();
    checkHit(bounds['left'], bounds['right'], bounds['bottom'], bounds['top']);
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
function checkHit(left, right, bottom, top) {
    gotHit = [];
    let groupID = randomIntFromInterval(0, 1000000);
    $('.mob').each((i) => {
        if (!$('.mob:eq(' + i + ')').hasClass('mobDying')) {
            let pos = $('.mob:eq(' + i + ')').position();
            if (between(pos['left'], left, right) && between(pos['top'] + marginToAccountFor, top, bottom)) {
                gotHit.push($('.mob:eq(' + i + ')'));
                $('.mob:eq(' + i + ')').trigger('click');
                hitTestFart(pos['left'] + parseInt($('.mob:eq(' + i + ')').css('width')) / 2, pos['top'] + parseInt($('.mob:eq(' + i + ')').css('height')) / 2 + marginToAccountFor, groupID)
            }
        }
    });
    genericSpritesheetAnimation($('[group="' + groupID.toString() + '"]'), 0, testTimings2);
}