var leveledUp = false;

var character = {
    info: {
        name: '-',
        attributePoints: 0,
        skillPoints: [0, 0, 0, 0, 0, 0],
        class: 'Kaiser',
        job: 'Kaiser',
        level: 1,
        experience: 0,
        loot: 100,
        gold: 100,
        rarity: 100,
        hpRegen: 1,
        mpRegen: 1,
        currentHp: 20,
        currentMp: 20
    },
    skillLevels: {
        61001000: 0,
        61000003: 0,
        61001101: 0
    },
    stats: { // stats from skills and allocated points
        mastery: 0,
        physicalAttack: 1,
        magicAttack: 1,
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        luck: 5,
        hp: 20,
        mp: 20,
        defense: 0,
        pierce: 0,
        evasion: 0,
        accuracy: 0,
        attackSpeedBonus: 0,
        speedBonus: 0,
        jumpBonus: 0,
        powerStanceBonus: 0,
        bossDamageBonus: 0,
        critChance: 0
    },
    compoundedStats: { // values from stats combined with gear and any unaccounted multipliers
        mastery: 0,
        physicalAttack: 1,
        magicAttack: 1,
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        luck: 5,
        hp: 20,
        mp: 20,
        defense: 0,
        pierce: 0,
        evasion: 0,
        accuracy: 0,
        attackSpeedBonus: 0,
        speedBonus: 0,
        jumpBonus: 0,
        powerStanceBonus: 0,
        bossDamageBonus: 0,
        critChance: 0
    },
    equipment: []
};

function gainExperience(amount) {
    if (amount > 0) {
        character.info.experience += amount;
        leveledUp = false;
        while (character.info.experience >= experienceCurve[character.info.level-1]) {
            character.info.experience -=  experienceCurve[character.info.level-1];
            character.info.level += 1;
            character.info.attributePoints += 5;
            leveledUp = true;
            let whichTierGetsSkillPoints = 0;
            if (character.info.level > 99) {
                whichTierGetsSkillPoints = 4;
            }
            else if (character.info.level > 59) {
                whichTierGetsSkillPoints = 3;
            }
            else if (character.info.level > 29) {
                whichTierGetsSkillPoints = 2;
            }
            else if (character.info.level > 10) {
                whichTierGetsSkillPoints = 1;
            }
            let skillTabs = document.getElementsByClassName('skillTab');
            if (character.info.level > 10) {
                skillTabs[1].style.visibility = '';
            }
            if (character.info.level > 30) {
                skillTabs[2].style.visibility = '';
            }
            if (character.info.level > 60) {
                skillTabs[3].style.visibility = '';
            }
            if (character.info.level > 100) {
                skillTabs[4].style.visibility = '';
            }
            character.info.skillPoints[whichTierGetsSkillPoints] += 3;
            if (whichTierGetsSkillPoints == document.getElementsByClassName('selectedSkillTab')[0].getAttribute('value')) {
                document.getElementById('skillPoints').innerHTML = character.info.skillPoints[whichTierGetsSkillPoints];
            }
        }
        if (leveledUp) {
            makeSkillPointsAllocateable();
            prepareLevelUpAnimation();
            playSound(sounds[9]);
            updateCharacterDisplay();
        }
        updateExpBar();
    }
}

const compoundedStatsToIterateThrough = Object.keys(character.compoundedStats);

const displayValuesToUpdate = ['name', 'attributePoints', 'class', 'job', 'level', 'loot', 'gold', 'rarity', 'strength', 'dexterity', 'intelligence', 'luck', 'hp', 'mp', 'defense', 'pierce', 'evasion', 'accuracy'];
function updateCharacterDisplay() {
    getCompoundedStats(); // I think I'd always want to do this if I'm updating it anyways
    displayValuesToUpdate.forEach(updateOneCharacterDisplay);
    if (canAllocateAP) {
        $('.statButton').removeAttr('disabled');
    }
    else {
        $('.statButton').attr('disabled', 'disabled');
    }
}

const levelUpGifTimings = [500, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90];
function genericSpritesheetAnimation(animations, frame, timings, deleteGroupWhenDone=false, infiniteLooping=false) {
    if (frame >= timings.length) {
        if (infiniteLooping) {
            frame = 0;
            if (animations[0].parentNode === null || animations[0].parentNode.parentNode === null) { // removes elements that were removed already
                return;
            }
        }
        else {
            if (deleteGroupWhenDone) {
                animations[0].parentElement.remove();
            }
            else {
                animations[0].remove();
            }
            return;
        }
    }
    Array.from(animations).forEach((animation) => {
        if (frame == 0) {
            animation.style.backgroundPositionX = '0px';
        }
        if (frame > 0) {
            animation.style.backgroundPositionX = parseInt(animation.style.backgroundPositionX) - parseInt(animation.style.width) + 'px';
        }
    });
    let data = [animations, frame+1, timings, deleteGroupWhenDone, infiniteLooping];
    scheduleToGameLoop(timings[frame], genericSpritesheetAnimation, data);
}

function prepareLevelUpAnimation() {
    let div = document.createElement('div');
    div.style.width = '904px';
    div.classList = ['levelUpGif'];
    document.getElementById('mobArea').appendChild(div);
    genericSpritesheetAnimation([div], 0, levelUpGifTimings);
}

var canAllocateAP = false;
function updateOneCharacterDisplay(subject) {
    if (subject in character.info) {
        value = character.info[subject];
        if (subject == 'attributePoints') {
            if (value > 0) {
                canAllocateAP = true;
            }
            else {
                canAllocateAP = false;
            }
        }
    }
    else {
        switch (subject) {
            case 'hp':
                value = ''.concat(Math.round(character.info.currentHp), '/', Math.round(character.compoundedStats.hp));
                break;
            case 'mp':
                value = ''.concat(Math.round(character.info.currentMp), '/', Math.round(character.compoundedStats.mp));
                break;
            case 'dexterity': case 'strength':
                character.info.hpRegen = (1/5) * Math.min(character.compoundedStats.strength, character.compoundedStats.dexterity);
                value = character.compoundedStats[subject];
                break;
            case 'intelligence': case 'luck':
                character.info.mpRegen = (1/5) * Math.min(character.compoundedStats.intelligence, character.compoundedStats.luck);
                value = character.compoundedStats[subject];
                break;
            default:
                value = character.compoundedStats[subject];
        }
    }
    if (typeof value == 'number') {
        $('#' + subject + 'Value').text(Math.round(value));
    }
    else {
        $('#' + subject + 'Value').text(value);
    }
}

const classData = {
    'Kaiser': {
        mainStat: 'strength',
        subStat: 'dexterity',
        validWeapons: 'Two-Handed Sword',
        attackStat: 'physicalAttack'
    }
};

var buffsThatNeedToBeDrawn = [];
var activeBuffs = {};

function addBuff(buff, type, duration=0, bonuses={}) {
    if (type == 'skill') {
        if (buff in oneOrTheOtherSkills) {
            if (oneOrTheOtherSkills[buff] in activeBuffs) {
                removeBuff(oneOrTheOtherSkills[buff]);
            }
        }
    }
    if (buff in activeBuffs) {
        if (duration in activeBuffs[buff]) {
            activeBuffs[buff].duration = duration;
        }
    }
    else {
        buffsThatNeedToBeDrawn.push(buff);
    }
    if (duration == 0) {
        activeBuffs[buff] = {'type': type};
    }
    else {
        activeBuffs[buff] = {'type': type, 'duration': duration};
    }
    getCompoundedStats();
}

function removeBuff(buff) {
    delete activeBuffs[buff];
    document.getElementById('buff-' + buff).remove();
    getCompoundedStats();
}

function makeBuffIconAndInfo(buffName) { // the buff will still be in activeBuffs when this is run
    let div = document.createElement('div');
    div.classList.add('buffHolder');
    div.id = 'buff-' + buffName;
    let tooltip = document.createElement('span');
    tooltip.classList = ['textTooltip'];
    let img = new Image();
    if (activeBuffs[buffName].type == 'skill') {
        img.src = './skills/icon/' + buffName + '.png';
        tooltip.innerHTML = classSkills[buffName].skillName; // since the buffName would be the skillId
    }
    $(div).on('mousemove', function(event) {
        $(event.currentTarget).children('.textTooltip').css({
            'left': event.pageX +6,
            'top': event.pageY +6,
            'visibility': 'visible'
        });
    });
    $(div).on('mouseleave', function(event) {
        $(event.currentTarget).children('.textTooltip').css({
            'visibility': 'hidden'
        });
    });
    div.appendChild(tooltip);
    if ('duration' in activeBuffs[buffName]) {
        let remainingTime = document.createElement('span');
        remainingTime.classList = ['numberText buffRemainingTime'];
        remainingTime.innerHTML = secondsToReadableTime(activeBuffs[buffName].duration);
        remainingTime.id = 'buffTimer-' + buffName;
        div.appendChild(remainingTime);
    }
    div.appendChild(img); // this being the final thing may still not be enough time for the image to load before being put into the buff
    return div;
}

const BUFF_DELAY = 250;
const BUFF_AREA = document.getElementById('buffArea');
function handleBuffs() {
    let allBuffNames = Object.keys(activeBuffs);
    let newlyDrawnBuffs = [];
    buffsThatNeedToBeDrawn.forEach((buffName) => {
        BUFF_AREA.appendChild(makeBuffIconAndInfo(buffName));
        newlyDrawnBuffs.push(buffName);
    });
    newlyDrawnBuffs.forEach((buffName) => {
        removeItemOnce(buffsThatNeedToBeDrawn, buffName);
    });
    allBuffNames.forEach((buffName) => {
        if ('duration' in activeBuffs[buffName]) {
            activeBuffs[buffName].duration -= BUFF_DELAY/1000; // close enough to the actual time (who cares if the player gets a little more time with a buff)
            if (activeBuffs[buffName].duration < 0) {
                removeBuff(buffName);
            }
            else {
                document.getElementById('buffTimer-' + buffName).innerHTML = secondsToReadableTime(activeBuffs[buffName].duration);
            }
        }
    });
    scheduleToGameLoop(BUFF_DELAY, handleBuffs, [], 'buffs');
}

$(() => {
    scheduleToGameLoop(BUFF_DELAY, handleBuffs, [], 'buffs');
});