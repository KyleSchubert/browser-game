var previousSkill = 0;
var usedSkill = 0;
var realSkill = 0;
var realSkillData = {};
var cannotUse = [];
var previousSequentialSkillIndex = 0;
var attackSpeedBonus = 1 - .25;
function processSkill(skill) {
    if (cannotUse.includes(skill)) {
        return;
    }
    cannotUse.push(skill);
    scheduleToGameLoop(classSkills[skill].reuseWaitTime * attackSpeedBonus, removeItemOnce, [cannotUse, skill], 'skill');
    previousSkill = usedSkill;
    usedSkill = skill;
    let skillType = classSkills[skill].type;
    if (skillType == 'attackSequence') {
        let index = 0;
        if (previousSkill == skill && previousSequentialSkillIndex != attackSequences[skill].length-1) {
            index = previousSequentialSkillIndex + 1;
        }
        realSkill = attackSequences[skill][index][0];
        let linesVariable = attackSkillVars[usedSkill][0][previousSequentialSkillIndex];
        let lines = parseInt(classSkills[usedSkill].usedVariables[linesVariable]);
        let damageVariable = attackSkillVars[usedSkill][1][previousSequentialSkillIndex];
        let equation = classSkills[usedSkill].usedVariables[damageVariable];
        let damageMult = classSkills[usedSkill].computedVars[equation] / 100;
        let targetsVariable = attackSkillVars[usedSkill][2][previousSequentialSkillIndex];
        let targets = parseInt(classSkills[usedSkill].usedVariables[targetsVariable]);
        realSkillData = {'lines': lines, 'damageMult': damageMult, 'targets': targets};
        let skillDimensions = attackSequences[skill][index][1];
        previousSequentialSkillIndex = index;
        useAttackSkill(realSkill, skillDimensions[0], skillDimensions[1]);
    }
}

function useAttackSkill(skill, widthStyle, heightStyle) {
    let div = document.createElement('div');
    div.style.backgroundImage = 'url(./skills/effect/' + skill + '.png)';
    div.style.width = widthStyle + 'px';
    div.style.height = heightStyle + 'px';
    div.style.position = 'absolute';
    //div.style.left = SQUAREposX - width - $('#gameArea').position()['left'] + 'px';
    //div.style.top = SQUAREposY - height + 'px';
    let leftBound = 0;
    let rightBound = 0;
    let totalOffsetLeft = document.getElementById('gameArea').offsetLeft + AVATAR.offsetLeft;
    if (AVATAR.style.transform == '' || AVATAR.style.transform == 'scaleX(-1)') {
        div.style.left = AVATAR.offsetLeft + 'px';
        leftBound = totalOffsetLeft;
        rightBound = totalOffsetLeft + widthStyle;
    }
    else {
        div.style.left = AVATAR.offsetLeft - widthStyle + 'px';
        leftBound = totalOffsetLeft - widthStyle;
        rightBound = totalOffsetLeft;
    }
    div.style.top = AVATAR.offsetTop - 100 + 'px';
    div.style.transform = AVATAR.style.transform || 'scaleX(-1)';
    let gameArea = document.getElementById('gameArea');
    gameArea.appendChild(div);
    playSound(sounds[allSoundFiles.indexOf(skill + 'use.mp3')]);
    const topBound = AVATAR.offsetTop - 100 - heightStyle;
    const bottomBound = AVATAR.offsetTop - 100 + heightStyle;
    checkHit(leftBound, rightBound, bottomBound, topBound, document.getElementById('gameArea').offsetLeft);
    genericSpritesheetAnimation([div], 0, classSkills[usedSkill].delays);
    if (gameLoop.skillMovements.length > 0) {
        isUsingSkill = false;
        gameLoop.skillMovements = [];
        avatarComputedXPosition += -lastSkillXChange;
        AVATAR.style.left = avatarComputedXPosition + 'px';
        avatarComputedYPosition -= -lastSkillYChange;
        AVATAR.style.top = avatarComputedYPosition + 'px';
    }
    let totalDelay = 0;
    isUsingSkill = true;
    lastSkillXChange = 0;
    lastSkillYChange = 0;
    classSkills[skill].action.forEach((frameData) => {
        let frameDelay = frameData[2] * attackSpeedBonus;
        scheduleToGameLoop(totalDelay, skillActionAnimation, [frameData[0], frameData[1], frameData[3]], 'skillMovements');
        if (frameDelay < 0) { // does this happen before the attack? maybe
            return;
        }
        else {
            totalDelay += frameDelay;
        }
    });
    scheduleToGameLoop(totalDelay, () => {
        isUsingSkill = false;
        avatarComputedXPosition += -lastSkillXChange;
        AVATAR.style.left = avatarComputedXPosition + 'px';
        avatarComputedYPosition -= -lastSkillYChange;
        AVATAR.style.top = avatarComputedYPosition + 'px';
    }, [], 'skillMovements');
}

var lastSkillXChange = 0;
var lastSkillYChange = 0;
function skillActionAnimation(state, frameOfState, avatarPositionChange) {
    setState(state, frameOfState, true);
    avatarComputedXPosition += avatarPositionChange[0] - lastSkillXChange;
    AVATAR.style.left = avatarComputedXPosition + 'px';
    avatarComputedYPosition -= avatarPositionChange[1] - lastSkillYChange;
    AVATAR.style.top = avatarComputedYPosition + 'px';
    lastSkillXChange = avatarPositionChange[0];
    lastSkillYChange = avatarPositionChange[1];
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

const hitCheckObserver = new IntersectionObserver((entries) => {
    let trueLeft = skillHitData['left'];
    let trueRight = skillHitData['right'];
    let hitGroup = document.createElement('div');
    let mobHits = 0;
    for (const entry of entries) {
        if (mobHits == realSkillData['targets']) {
            break;
        }
        const bounds = entry.boundingClientRect;
        if (
            (between(bounds['left'], trueLeft, trueRight)
                || between(bounds['right'], trueLeft, trueRight)
                || between(trueLeft, bounds['left'], bounds['right'])
                || between(trueRight, bounds['left'], bounds['right']))
            && 
            (between(bounds['top'], skillHitData['top'], skillHitData['bottom'])
                || between(bounds['bottom'], skillHitData['top'], skillHitData['bottom'])
                || between(skillHitData['top'], bounds['top'], bounds['bottom'])
                || between(skillHitData['bottom'], bounds['top'], bounds['bottom']))
        ) {
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
        if (!character.skillLevels[skill]) { // example: if the game updated and a skill was added, someone might not have it
            character.skillLevels[skill] = 0;
        }
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
                if (classSkills[skill].type == 'passive') {
                    Object.keys(getPassiveSkillStats(skill)).forEach((stat) => {
                        getOneCompoundedStat(stat);
                        updateOneCharacterDisplay(stat);
                    });
                }
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
    masterLevel.innerHTML = '[Master level: ' + classSkills[skill].maxLevel + ']';
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

function skillEquationManager(source, level, skill) {
    while (source.search('{.+?}') != -1) {
        originalEquation = source.match('{.+?}')[0];
        equation = originalEquation.slice(1, -1);
        let value = eval(equation.replace('x', level));
        if (character.skillLevels[skill] == level) {
            classSkills[skill].computedVars[equation] = value;
            if (equation == classSkills[skill].usedVariables.mpCon) {
                classSkills[skill].mpCon = value;
            }
        }
        source = source.replace('{' + equation + '}', value);
    }
    return source;
}

function writeSkillHitDescription(elementToAppendTo, skill, level) {
    let repeatCount = 1;
    if (classSkills[skill].type == 'attackSequence') {
        repeatCount = attackSkillVars[skill][0].length;
    }
    for (let i=0; i<repeatCount; i++) {
        let string = skillEquationManager(classSkills[skill].hitDescriptions[i], level, skill);
        let textSpot = document.createElement('div');
        textSpot.innerHTML = string;
        elementToAppendTo.appendChild(textSpot);
    }
}

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

function getAllocatedPassiveSkills() {
    let skills = [];
    Object.keys(character.skillLevels).forEach((skillId) => {
        if (classSkills[skillId].type == 'passive' && character.skillLevels[skillId] >= 1) {
            skills.push(skillId);
        }
    });
    return skills;
}

function getPassiveSkillStats(skillId) {
    let data = {};
    Object.keys(passiveSkillVars[skillId]).forEach((stat) => {
        let equation = classSkills[skillId].usedVariables[stat];
        let statValue = classSkills[skillId].computedVars[equation];
        let statMeaning = passiveSkillVars[skillId][stat];
        data[statMeaning] = statValue;
    });
    return data;
}
