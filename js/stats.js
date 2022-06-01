function getCompoundedStats() {
    compoundedStatsToIterateThrough.forEach(getOneCompoundedStat);
}

const statsWithPercentMultipliers = ['strength', 'dexterity', 'intelligence', 'luck', 'hp', 'mp'];
const relatedStats = {
    hp: ['strength', 'dexterity'],
    mp: ['intelligence', 'luck'],
    defense: ['strength'],
    accuracy: ['dexterity'],
    pierce: ['intelligence'],
    evasion: ['luck']
};
const statCoefficients = {
    hp: 3,
    mp: 2,
    defense: 1,
    accuracy: 1,
    pierce: 1,
    evasion: 1
};
function getOneCompoundedStat(stat) { // updates the compoundStat and also returns it for if I want it (I might)
    if (statsWithPercentMultipliers.includes('luck')) { // TEMPORARY TESTING
        wantPercent = true;
    }
    else {
        wantPercent = false;
    }
    value = character.stats[stat];
    getAllocatedPassiveSkills().forEach((skillId) => {
        let statBonuses = getPassiveOrBuffSkillStats(skillId, passiveSkillVars);
        if (stat in statBonuses) {
            value += statBonuses[stat];
        }
    });
    Object.keys(activeBuffs).forEach((buffName) => {
        if (activeBuffs[buffName].type == 'skill') { // stats will not be in the data
            let statBonuses = getPassiveOrBuffSkillStats(buffName, buffSkillVars);
            if (stat in statBonuses) {
                value += statBonuses[stat];
            }
        }
        else if (activeBuffs[buffName].type == 'item') {
            console.log('+');
        }
        else { // everything else will have that info in their data
            console.log('=');
        }
    });
    if (stat in relatedStats) {
        values = [];
        relatedStats[stat].forEach((x) => values.push(character.compoundedStats[x]));
        sum = values.reduce((x, y) => x + y);
        sum *= statCoefficients[stat];
        value += sum;
    }
    [flatValue, percentValue] = getEquipmentStat(stat, wantPercent);
    value += flatValue;
    value *= (1 + percentValue / 100);
    character.compoundedStats[stat] = value;
    return value;
}

function getEquipmentStat(stat, percent=false) {
    percents = [];
    flats = [];
    if (percent) {
        character.equipment.forEach(function(slot) {
            if (Object.keys(slot).includes(stat + 'Percent')) {
                percents.push(slot[stat + 'Percent']);
            }
        });
    }
    character.equipment.forEach(function(slot) {
        if (Object.keys(slot).includes(stat)) {
            flats.push(slot[stat]);
        }
    });
    if (percents.length) {
        percentValue = percents.reduce((x, y) => x + y);
    }
    else {
        percentValue = 0;
    }
    if (flats.length) {
        flatValue = flats.reduce((x, y) => x + y);
    }
    else {
        flatValue = 0;
    }
    return [flatValue, percentValue];
}

function regeneration() {
    if (character.info.currentHp + character.info.hpRegen > character.compoundedStats.hp) {
        character.info.currentHp = character.compoundedStats.hp;
    }
    else {
        character.info.currentHp += character.info.hpRegen;
    }
    if (character.info.currentMp + character.info.mpRegen > character.compoundedStats.mp) {
        character.info.currentMp = character.compoundedStats.mp;
    }
    else {
        character.info.currentMp += character.info.mpRegen;
    }
    updateOneCharacterDisplay('hp');
    updateOneCharacterDisplay('mp');
    scheduleToGameLoop(850, regeneration);
}

$(() => {
    updateCharacterDisplay();
    regeneration();
});

// some animations for opening and closing with the big button
$('.openStatsButton').click(() => {
    if (!$('#statsArea').hasClass('stats-open')) {
        // START OPENING ANIMATION
        $('#statsArea').addClass('stats-opening');
        // ANIMATION DONE
        $('.stats-opening').on('animationend webkitAnimationEnd oAnimationEnd', () => {
            $('#statsArea').addClass('stats-open');
            $('#statsArea').removeClass('stats-opening');
        });
    }
    else {
        // START closing animation
        $('#statsArea').addClass('stats-closing');
        $('#statsArea').removeClass('stats-open');
        // animation done
        $('.stats-closing').on('animationend webkitAnimationEnd oAnimationEnd', () => {
            $('#statsArea').removeClass('stats-open'); // safety first! (rare case)
            $('#statsArea').removeClass('stats-closing');
        });
    }
});
