var previousSkill = 0;
var usedSkill = 0;
var realSkill = 0;
var realSkillData = {};
var cannotUse = [];
function processSkill(skill) {
    if (cannotUse.includes(skill)) {
        return;
    }
    cannotUse.push(skill);
    setTimeout(() => {
        removeItemOnce(cannotUse, skill);
    }, classSkills[skill].reuseWaitTime);
    previousSkill = usedSkill;
    usedSkill = skill;
    let skillType = classSkills[skill].type;
    if (skillType == 'attackSequence') {
        if (previousSkill == skill) {
            if (realSkill in classSkills[skill].attackSequence) {
                realSkill = classSkills[skill].attackSequence[realSkill].next;
            }
            else {
                realSkill = classSkills[skill].attackSequence[skill].next;
            }
        }
        else {
            realSkill = skill;
        }
        realSkillData = classSkills[skill].attackSequence[realSkill];
        let skillDimensions = classSkills[skill].attackSequence[realSkill].dimensions;
        useAttackSkill(realSkill, skillDimensions[0], skillDimensions[1]);
    }
}

function useAttackSkill(skill, widthStyle, heightStyle) {
    let div = document.createElement('div');
    div.style.backgroundImage = 'url(./skills/effect/' + skill + '.png)';
    div.style.width = widthStyle + 'px';
    let width = widthStyle / 2;
    div.style.height = heightStyle + 'px';
    let height = heightStyle / 2;
    div.style.position = 'absolute';
    div.style.left = SQUAREposX - width - $('#gameArea').position()['left'] + 'px';
    div.style.top = SQUAREposY - height + 'px';
    let gameArea = document.getElementById('gameArea');
    gameArea.appendChild(div);
    playSound(sounds[allSoundFiles.indexOf(skill + 'use.mp3')]);
    const leftBound = SQUAREposX - width;
    const rightBound = SQUAREposX + width;
    const topBound = SQUAREposY - height;
    const bottomBound = SQUAREposY + height;
    checkHit(leftBound, rightBound, bottomBound, topBound, 0);
    genericSpritesheetAnimation([div], 0, classSkills[usedSkill].delays);
}

function hitTest(left, top, reason) {
    let hitDimensions = classSkills[usedSkill].hitDimensions;
    let div = document.createElement('div');
    div.style.backgroundImage = 'url(./skills/hit/' + usedSkill + '.png)';
    div.style.width = hitDimensions[0] + 'px';
    div.style.height = hitDimensions[1] + 'px';
    div.style.position = 'absolute';
    div.style.left = (left - hitDimensions[0] / 2) + 'px';
    div.style.top = (top - hitDimensions[1] / 2) + 'px';
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

var skillHitLimit = 8;
const hitCheckObserver = new IntersectionObserver((entries) => {
    let trueLeft = skillHitData['left'];
    let trueRight = skillHitData['right'];
    let hitGroup = document.createElement('div');
    let mobHits = 0;
    for (const entry of entries) {
        if (mobHits == skillHitLimit) {
            break;
        }
        const bounds = entry.boundingClientRect;
        if ((between(bounds['left'], trueLeft, trueRight) || between(bounds['right'], trueLeft, trueRight)) && (between(bounds['top'], skillHitData['top'], skillHitData['bottom']) || between(bounds['bottom'], skillHitData['top'], skillHitData['bottom']))) {
            mobDamageEvent(entry.target, realSkill, [bounds['left']-skillHitData['leftOffset']+bounds['width']/2, bounds['top']]);
            hitGroup.appendChild(hitTest(bounds['left']-skillHitData['leftOffset']+bounds['width']/2, bounds['top']+bounds['height']/2));
            mobHits++;
        }
    }
    if (hitGroup.hasChildNodes()) {
        playSound(sounds[allSoundFiles.indexOf(usedSkill + 'hit.mp3')]);
        document.getElementById('gameArea').appendChild(hitGroup);
        genericSpritesheetAnimation(hitGroup.children, 0, classSkills[usedSkill].hitDelays, deleteGroupWhenDone=true);
    }
    hitCheckObserver.disconnect();
});
