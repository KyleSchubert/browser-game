const testTimings = [90,90,90,90];
function testFart() {
    let div = document.createElement('div');
    div.style.backgroundImage = 'url(./skills/effect/61001000.png)';
    div.style.width = '283px';
    let width = parseInt(div.style.width) / 2 + 14;
    div.style.height = '167px';
    let height = parseInt(div.style.height) / 2 + 14;
    div.style.position = 'absolute';
    div.style.left = SQUAREposX - width - $('#gameArea').position()['left'] + 'px';
    div.style.top = SQUAREposY - height + 'px';
    let gameArea = document.getElementById('gameArea');
    gameArea.appendChild(div);
    playSound(sounds[allSoundFiles.indexOf('61001000use.mp3')]);
    const leftBound = SQUAREposX - width - 400;
    const rightBound = SQUAREposX + width + 400;
    const topBound = SQUAREposY - height;
    const bottomBound = SQUAREposY + height;
    checkHit(leftBound, rightBound, bottomBound, topBound, gameArea.offsetLeft);
    genericSpritesheetAnimation([div], 0, testTimings);
}

const testTimings2 = [90,90,90,90,90,90];
function hitTestFart(left, top, reason) {
    let div = document.createElement('div');
    div.style.backgroundImage = 'url(./skills/hit/61001000.png)';
    div.style.width = '187px';
    div.style.height = '131px';
    div.style.position = 'absolute';
    div.style.left = (left - 187 / 2 + 14) + 'px';
    div.style.top = (top - 131 / 2 + 14) + 'px';
    div.setAttribute('group', reason);
    return div;
}

const marginToAccountFor = parseInt($('#lootBlocker').css('margin-top'));
var skillHitData = {};
function checkHit(left, right, bottom, top, leftOffset) {
    skillHitData['left'] = left;
    skillHitData['right'] = right;
    skillHitData['bottom'] = bottom;
    skillHitData['top'] = top;
    skillHitData['leftOffset'] = leftOffset;
    Array.from(document.getElementsByClassName('mob')).forEach((element) => {
        if (!element.classList.contains('mobDying')) {
            hitCheckObserver.observe(element);
        }
    });
}

const hitCheckObserver = new IntersectionObserver((entries) => {
    let trueLeft = skillHitData['left'];
    let trueRight = skillHitData['right'];
    let poggersGroup = document.createElement('div');
    for (const entry of entries) {
        const bounds = entry.boundingClientRect;
        if ((between(bounds['left'], trueLeft, trueRight) || between(bounds['right'], trueLeft, trueRight)) && (between(bounds['top'], skillHitData['top'], skillHitData['bottom']) || between(bounds['bottom'], skillHitData['top'], skillHitData['bottom']))) {
            mobDamageEvent(entry.target, 61001000, [bounds['left']-skillHitData['leftOffset']+bounds['width']/2, bounds['top']]);
            poggersGroup.appendChild(hitTestFart(bounds['left']-skillHitData['leftOffset']+bounds['width']/2, bounds['top']+bounds['height']/2));
        }
    }
    if (poggersGroup.hasChildNodes()) {
        playSound(sounds[allSoundFiles.indexOf('61001000hit.mp3')]);
        document.getElementById('gameArea').appendChild(poggersGroup);
        genericSpritesheetAnimation(poggersGroup.children, 0, testTimings2);
    }
    hitCheckObserver.disconnect();
});
