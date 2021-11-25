var leveledUp = false;

var character = {
    info: {
        name: '-',
        attributePoints: 0,
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
    stats: { // stats from skills and allocated points
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        luck: 5,
        hp: 20,
        mp: 20,
        defense: 0,
        pierce: 0,
        evasion: 0,
        accuracy: 0
    },
    compoundedStats: { // values from stats combined with gear and any unaccounted multipliers
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        luck: 5,
        hp: 20,
        mp: 20,
        defense: 0,
        pierce: 0,
        evasion: 0,
        accuracy: 0
    },
    equipment: [],
    gainExperience: function(amount) {
        if (amount > 0) {
            character.info.experience += amount;
            leveledUp = false;
            while (character.info.experience > experienceCurve[character.info.level]) {
                character.info.level += 1;
                character.info.attributePoints += 5;
                leveledUp = true;
            }
            if (leveledUp) {
                prepareLevelUpAnimation();
                playSound(sounds[9]);
                updateCharacterDisplay();
            }
        }
    }

};

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
function genericSpritesheetAnimation(animations, frame, timings, deleteGroupWhenDone=false) {
    if (frame >= timings.length) {
        if (deleteGroupWhenDone) {
            animations[0].parentElement.remove();
        }
        else {
            animations[0].remove();
        }
        return;
    }
    Array.from(animations).forEach((animation) => {
        if (frame == 0) {
            animation.style.backgroundPositionX = '0px';
        }
        if (frame > 0) {
            animation.style.backgroundPositionX = parseInt(animation.style.backgroundPositionX) - parseInt(animation.style.width) + 'px';
        }
    });
    setTimeout(() => {
        requestAnimationFrame(() => genericSpritesheetAnimation(animations, frame+1, timings, deleteGroupWhenDone));
    }, timings[frame]);
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

const classMainStat = {
    'Kaiser': 'strength'
};

const classSkills = {
    61001000: {
        className: 'kaiser',
        skillName: 'Dragon Slash',
        tier: 1,
        type: 'attackSequence',
        reuseWaitTime: 320,
        delays: [90,90,90,90],
        attackSequence: {
            61001000: {damage: 0.7, lines: 3, targets: 8, dimensions: [283,167], next: 61001004},
            61001004: {damage: 0.5, lines: 5, targets: 6, dimensions: [363,129], next: 61001005},
            61001005: {damage: 0.6, lines: 5, targets: 6, dimensions: [335,209], next: 61001000}
        },
        hitDelays: [90,90,90,90,90,90],
        hitDimensions: [187, 131]
    }
};
