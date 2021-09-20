function getCompoundedStats() {
    compoundedStatsToIterateThrough.forEach(getOneCompoundedStat)
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
    if (stat in relatedStats) {
        values = [];
        relatedStats[stat].forEach(x => values.push(character.compoundedStats[x]))
        sum = values.reduce((x, y) => x + y);
        sum *= statCoefficients[stat];
        value += sum;
    }
    [flatValue, percentValue] = getEquipmentStat(stat, wantPercent);
    value += flatValue;
    value *= (1 + percentValue / 100);
    character.compoundedStats[stat] = value;
    return value
}

function getEquipmentStat(stat, percent=false) {
    percents = [];
    flats = [];
    if (percent) {
        Object.keys(character.equipment).filter(item => (stat + 'Percent') in character.equipment[item])
            .forEach(item => percents.push(character.equipment[item][stat + 'Percent']))
    }
    Object.keys(character.equipment).filter(item => stat in character.equipment[item])
        .forEach(item => flats.push(character.equipment[item][stat]))
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
    return [flatValue, percentValue]
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
    updateOneCharacterDisplay('hp')
    updateOneCharacterDisplay('mp')
    setTimeout(regeneration, 850)
}

$(document).ready(function() {
    updateCharacterDisplay()
    regeneration()
})