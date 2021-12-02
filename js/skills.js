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
    checkHit(leftBound, rightBound, bottomBound, topBound, document.getElementById('gameArea').offsetLeft);
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

function makeSkillCards() {
    let currentSelectedSkillTab = document.getElementsByClassName('selectedSkillTab')[0].getAttribute('value');
    skillsPerClass[character.info.class][currentSelectedSkillTab].forEach((skill) => {
        let skillInfoHolder = document.createElement('div');
        skillInfoHolder.classList = ['skillInfoHolder'];
        let tooltip = makeSkillTooltip(skill);
        skillInfoHolder.appendChild(tooltip);
        $(skillInfoHolder).on('mousemove', function(event) {
            $(event.currentTarget).children('.itemTooltip').css({
                'left': event.pageX - 240,
                'top': event.pageY + 16,
                'visibility': 'visible'
            });
        });
        $(skillInfoHolder).on('mouseleave', function(event) {
            $(event.currentTarget).children('.itemTooltip').css({
                'visibility': 'hidden'
            });
        });
        let skillImg = new Image();
        skillImg.src = "./skills/icon/" + skill + ".png";
        skillImg.style.alignSelf = 'center';
        skillImg.style.marginLeft = '2px';
        skillInfoHolder.appendChild(skillImg);
        let everythingElse = document.createElement('div');
        everythingElse.style.marginLeft = '4px';
        everythingElse.style.marginRight = '4px';
        let skillName = document.createElement('div');
        skillName.innerHTML = classSkills[skill].skillName;
        skillName.style.borderBottom = '1px dotted #e8e8e8';
        skillName.style.height = '18px';
        everythingElse.appendChild(skillName);
        let bottomInfo = document.createElement('div');
        bottomInfo.classList = ['skillBottomInfo'];
        let currentLevel = document.createElement('div');
        currentLevel.innerHTML = character.skillLevels[skill].toString();
        currentLevel.style.width = '50%';
        bottomInfo.appendChild(currentLevel);
        let allocateButton = new Image();
        allocateButton.classList = ['skillPointAllocateDisabled'];
        allocateButton.setAttribute('value', skill);
        $(allocateButton).on('click', (event) => {
            let skill = event.currentTarget.getAttribute('value');
            let skillTier = parseInt(document.getElementsByClassName('selectedSkillTab')[0].innerHTML);
            if (character.skillLevels[skill] < classSkills[skill].maxLevel && character.info.skillPoints[skillTier] > 0) {
                character.skillLevels[skill]++;
                let target = document.querySelector('.tooltipBottomArea[value="' + skill + '"]');
                removeAllChildNodes(target);
                let currentLevelText = document.createElement('div');
                currentLevelText.innerHTML = '[Current level: ' + character.skillLevels[skill] + ']';
                target.appendChild(currentLevelText);
                writeSkillHitDescription(target, skill, character.skillLevels[skill]);
                if (character.skillLevels[skill] < classSkills[skill].maxLevel) {
                    let nextLevelText = document.createElement('div');
                    nextLevelText.innerHTML = '[Next level: ' + (character.skillLevels[skill]+1) + ']';
                    target.appendChild(nextLevelText);
                    writeSkillHitDescription(target, skill, character.skillLevels[skill]+1);
                }
                character.info.skillPoints[skillTier]--;
                if (character.info.skillPoints[skillTier] < 1) {
                    makeSkillPointsAllocateable(); // makes them not allocateable
                }
                else if (!(character.skillLevels[skill] < classSkills[skill].maxLevel)) {
                    event.currentTarget.src = '';
                }
                document.getElementById('skillPoints').innerHTML = character.info.skillPoints[skillTier];
                event.currentTarget.previousElementSibling.innerHTML = character.skillLevels[skill];
            }
        });
        bottomInfo.appendChild(allocateButton);
        everythingElse.appendChild(bottomInfo);
        skillInfoHolder.appendChild(everythingElse);
        document.getElementById('skillContentAreaBottomPart').appendChild(skillInfoHolder);
    });
}

function makeSkillTooltip(skill) {
    let tooltip = document.createElement('div');
    tooltip.classList = 'itemTooltip';
    let skillName = document.createElement('div');
    skillName.classList = ['tooltipName skillName'];
    skillName.innerHTML = classSkills[skill].skillName;
    tooltip.appendChild(skillName);
    let topArea = document.createElement('div');
    topArea.classList = ['skillTooltipTopArea'];
    let skillImg = new Image();
    skillImg.src = "./skills/icon/" + skill + ".png";
    skillImg.style.width = '64px';
    skillImg.style.height = '64px';
    skillImg.setAttribute('draggable', 'false');
    topArea.appendChild(skillImg);
    let descriptionArea = document.createElement('div');
    descriptionArea.classList = ['skillDescriptionArea'];
    let masterLevel = document.createElement('div');
    masterLevel.innerHTML = '[Master level: 20]';
    descriptionArea.appendChild(masterLevel);
    let description = document.createElement('div');
    description.innerHTML = classSkills[skill].description;
    descriptionArea.appendChild(description);
    if ('requirementText' in classSkills[skill]) {
        let requirementText = document.createElement('div');
        requirementText.innerHTML = classSkills[skill].requirementText;
        requirementText.style.color = 'darkorange';
        descriptionArea.appendChild(requirementText);
    }
    topArea.appendChild(descriptionArea);
    tooltip.appendChild(topArea);
    let bottomArea = document.createElement('div');
    bottomArea.classList = ['tooltipBottomArea'];
    bottomArea.setAttribute('value', skill);
    if (character.skillLevels[skill] != 0) {
        let currentLevelText = document.createElement('div');
        currentLevelText.innerHTML = '[Current level: ' + character.skillLevels[skill] + ']';
        bottomArea.appendChild(currentLevelText);
        writeSkillHitDescription(bottomArea, skill, character.skillLevels[skill]);
    }
    let nextLevelText = document.createElement('div');
    nextLevelText.innerHTML = '[Next level: ' + (character.skillLevels[skill]+1) + ']';
    bottomArea.appendChild(nextLevelText);
    writeSkillHitDescription(bottomArea, skill, character.skillLevels[skill]+1);
    tooltip.appendChild(bottomArea);
    return tooltip;
}

function writeSkillHitDescription(elementToAppendTo, skill, level) {
    if (classSkills[skill].type == 'attackSequence') {
        let attackSequence = classSkills[skill].attackSequence;
        let nextSkill = skill;
        classSkills[skill].hitDescriptions.forEach((text, index) => {
            if (nextSkill == skill && index != 0) {
                return;
            }
            let finishedText = text.replace('{damage}', Math.round((attackSequence[nextSkill].damage + attackSequence[nextSkill].scaling.damage * level) * 100));
            let textSpot = document.createElement('div');
            textSpot.innerHTML = finishedText;
            elementToAppendTo.appendChild(textSpot);
            nextSkill = attackSequence[nextSkill].next;
            if (nextSkill == skill && 'finalForm' in classSkills[skill]) {
                let realText = classSkills[skill].hitDescriptions[index+1];
                realText = realText.replace('{damage}', Math.round((classSkills[skill].finalForm.damage + classSkills[skill].finalForm.scaling.damage * level) * 100)); 
                let textSpot = document.createElement('div');
                textSpot.innerHTML = realText;
                elementToAppendTo.appendChild(textSpot);
                return;
            }
        });
    }
}

$(makeSkillCards);

function makeSkillPointsAllocateable() {
    let skillTier = document.getElementsByClassName('selectedSkillTab')[0].getAttribute('value');
    skillsPerClass[character.info.class][skillTier].forEach((skill) => {
        let target = document.querySelector('.skillBottomInfo [value="' + skill + '"]');
        if (character.skillLevels[skill] < classSkills[skill].maxLevel && character.info.skillPoints[skillTier] > 0) {
            target.src = './files/pointsEnabled.png';
            target.classList.add('clickable');
        }
        else {
            target.src = '';
            target.classList.remove('clickable');
        }
    });
}

const skillsPerClass = {
    'Kaiser': [[61001000], [], [], [], [], []]
};

const classSkills = {
    61001000: {
        className: 'Kaiser',
        skillName: 'Dragon Slash',
        tier: 1,
        maxLevel: 20,
        type: 'attackSequence',
        reuseWaitTime: 320,
        delays: [90,90,90,90],
        attackSequence: {
            61001000: {damage: 0.50, lines: 3, targets: 8, scaling: {damage: 0.01}, dimensions: [283,167], next: 61001004},
            61001004: {damage: 0.30, lines: 5, targets: 6, scaling: {damage: 0.01}, dimensions: [363,129], next: 61001005},
            61001005: {damage: 0.40, lines: 5, targets: 6, scaling: {damage: 0.01}, dimensions: [335,209], next: 61001000}
        },
        finalForm: {damage: 1.40, lines: 5, targets: 8, scaling: {damage: 0.01}},
        hitDelays: [90,90,90,90,90,90],
        hitDimensions: [187, 131],
        description: 'Mash the attack key to whip enemies in front of you up to 3 times. Can be used with basic attack key while in Final Form.',
        requirementText: 'Level 20 required to learn Dragon Slash I.',
        hitDescriptions: ['1-hit: Attack up to 8 enemies for {damage}% damage 3 times', '2-hit: Up to 6 enemies attack for {damage}% damage 5 times', '3-hit: Up to 6 enemies attack for {damage}% damage 5 times', 'Final Form: Up to 8 enemies attack for {damage}% damage 5 times, Up to 10 enemies attack 6 times after 4th job']
    }
};
