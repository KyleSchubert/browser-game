var numberOfMobs = 0; // amount of non-dead/dying mobs. this is useful for allowing mobs that are dying to stay in activeMobs while allowing another mob to spawn
var targetableMobs = [];
var activeMobs = {};

function getMob(fromList=false) {
    if (fromList) {
        if ($('.easySelected').length > 0) {
            mob = $('.easySelected').html().toLowerCase();
        }
        else {
            mob = 'tino';
        }
    }
    else {
        mob = zoneMobs[currentZone][Math.floor(Math.random()*zoneMobs[currentZone].length)];
    }
    return mob;
}

function spawn(mob=getMob(true)) {
    numberOfMobs++;
    let mobDivId = randomIntFromInterval(0, 999999999999);
    if (mobDivId in activeMobs) {
        mobDivId = randomIntFromInterval(0, 999999999999);
        if (mobDivId in activeMobs) {
            mobDivId = randomIntFromInterval(0, 999999999999); // chance of conflicting after this is low
        }
    }
    let madeMob = createMobDiv(mob, mobDivId);
    targetableMobs.push(mobDivId);
    scheduleToGameLoop(0, mobMovement, [mobDivId], 'movement');
    document.getElementById('mobArea').appendChild(madeMob);
    return mobAnimation(mobDivId, 'stand');
}

function spawnOneOfEach() {
    knownMobs.forEach((mob) => {
        spawn(mob);
    });
}

function createMobDiv(name, mobDivId) { // name in any case
    name = name.toLowerCase();
    let mobId = mobIdsFromNames[name];
    let div = document.createElement('div');
    div = document.createElement('div');
    div.setAttribute('value', name);
    let left = 540  + randomIntFromInterval(-400, 400);
    div.style.left = left + 'px';
    let top = 550 + randomIntFromInterval(-200, 200);
    div.style.top = top + 'px';
    div.style.width = mobDimensions[mobId][0] + 'px';
    div.style.height = mobDimensions[mobId][1] + 'px';
    div.classList = ['mob clickable'];
    div.setAttribute('draggable', false);
    div.setAttribute('mobDivId', mobDivId);
    let nameAndLevelText = document.createElement('div');
    nameAndLevelText.classList = ['nameAndLevelText'];
    nameAndLevelText.style.bottom = '';
    nameAndLevelText.style.top = mobOrigins[mobId][1] + 'px';
    let nameText = document.createElement('div');
    nameText.innerHTML = mobNames[name];
    nameText.classList = ['mobNameText'];
    let levelText = document.createElement('div');
    levelText.innerHTML = 'Lv. ' + mobLevels[name];
    levelText.classList = ['mobLevelText'];
    nameAndLevelText.appendChild(levelText);
    nameAndLevelText.appendChild(nameText);
    let hpBar = document.createElement('div');
    let hpValue = 999999999999;
    hpBar.classList = ['hpBar'];
    hpBar.style.top = mobOrigins[mobId][1] + mobBoundOffsets[mobId].top - 50 + 'px';
    if (bossMobs.includes(name)) {
        hpValue = bossData[name]['hp'];
    }
    else {
        hpValue = mobLevelToHp[mobLevels[name]];
        div.appendChild(nameAndLevelText);
    }
    $(div).on('click', () => {// MOBS TAKE DAMAGE ON CLICK
        mobDamageEvent(mobDivId);
    });
    let greenPart = new Image();
    greenPart.src = './files/hpBar.png';
    let blackPart = document.createElement('div');
    blackPart.classList = ['hpBarBlackPart'];
    blackPart.style.right = '4px';
    let redPart = document.createElement('div');
    redPart.classList = ['hpBarRedPart'];
    redPart.style.right = '4px';
    hpBar.appendChild(blackPart);
    hpBar.appendChild(redPart);
    hpBar.appendChild(greenPart);
    div.appendChild(hpBar);
    activeMobs[mobDivId] = {
        'div': div, 'name': name, 'id': mobId, 'hp': hpValue, 'maxHp': hpValue, 'left': left,
        'top': top, 'currentAnimation': 'stand', 'frame': 0, 'xVel': 0.02, 'yVel': 0, 'lastFloorY': 0,
        'canJump': ('jump' in mobDelays[mobId]), 'isFalling': true, 'isJumping': false, 'movementStyle': 'nearlyConstant',
        'speedScale': mobSpeedScales[mobId], 'xAcceleration': 0, 'intendedDirection': 'none', 'remainingMovementTime': 0,
        'gameLoopUsedAnimationSlot': -1, 'isDying': false, 'facing': 'left'
    };
    mobSetAnimation(mobDivId, 'stand');
    return div;
}

var blockedSoundGroups = []; // to prevent stacking sounds when hitting a bunch of enemies
function mobDamageEvent(mobDivId, soundGroupNumber=-1, skill=0) {
    if (soundGroupNumber >= 0) {
        if (!blockedSoundGroups.includes(soundGroupNumber)) {
            blockedSoundGroups.push(soundGroupNumber);
            if (realSkillData[skill].sound != -1) {
                playSound(realSkillData[skill].sound, 'hit');
            }
            scheduleToGameLoop(1, () => {
                removeItemOnce(blockedSoundGroups, soundGroupNumber);
            });
        }
    }
    if (!(mobDivId in activeMobs)) {
        return;
    }
    let mobId = activeMobs[mobDivId].id;
    let currentAnimation = activeMobs[mobDivId].currentAnimation;
    let frame = activeMobs[mobDivId].frame;
    let left = activeMobs[mobDivId].left + mobHeadMovements[mobId][currentAnimation][frame][0];
    let top = activeMobs[mobDivId].top + mobHeadMovements[mobId][currentAnimation][frame][1] - 100; 
    let damageRoll = rollDamageToMob(skill);
    damageNumbers(damageRoll, left, top);
    if (skill != 0) {
        for (let i=1; i<realSkillData[skill].lines; i++) {
            let damage = rollDamageToMob(skill);
            damageRoll += damage;
            let parameters = [damage, left, top - 32*i];
            scheduleToGameLoop(75*i, damageNumbers, parameters, 'damageNumber');
        }
    }
    let mobDiv = activeMobs[mobDivId].div;
    let theirNameAndLevelText = mobDiv.firstChild;
    let theirHpBar = mobDiv.lastChild;
    theirHpBar.style.visibility = 'visible';
    let newHP = activeMobs[mobDivId].hp - damageRoll; // maybe needs improvement
    activeMobs[mobDivId].hp = newHP;
    if (newHP < 0) {
        newHP = 0;
    }
    let width = (1 - newHP / activeMobs[mobDivId].maxHp) * 67; // maybe needs improvement
    let theirRedPart = theirHpBar.children[1];
    if (theirRedPart.classList.contains('hpFasterFade')) {
        theirRedPart.classList.remove('hpFasterFade');
        theirRedPart.style.animation = 'none';
        scheduleToGameLoop(0, () => theirRedPart.style.animation = '');
    }
    theirRedPart.style.width = width + 4 - parseInt(theirRedPart.style.right) + 'px'; // maybe needs improvement
    theirRedPart.classList.add('hpFasterFade');
    theirBlackPart = theirHpBar.firstChild; // maybe needs improvement
    theirBlackPart.style.width = width + 'px'; // maybe needs improvement
    if (newHP <= 0) {
        theirHpBar.style.visibility = 'hidden';
        theirNameAndLevelText.style.visibility = 'hidden';
        mobDie(mobDivId);
    }
    else {
        theirNameAndLevelText.style.visibility = 'visible';
    }
    return; 
}

function rollDamageToMob(skill=0) {
    let damage = 0;
    let damageMult = 1.00;
    let weaponMult = 1;
    if (skill != 0) {
        damageMult = realSkillData[skill]['damageMult'];
    }
    if (!jQuery.isEmptyObject(character.equipment[16])) {
        switch (itemsInEquipmentSlots[16].exactType) {
            case 'Katara':
                weaponMult = 1.00;
                break;
            case 'One-Handed Sword':
            case 'One-Handed Axe':
            case 'One-Handed Blunt Weapon':
            case 'Staff':
            case 'Wand':
            case 'Gauntlet':
                weaponMult = 1.20;
                break;
            case 'Bow':
            case 'Dagger':
                weaponMult = 1.30;
                break;
            case 'Two-Handed Sword':
            case 'Two-Handed Axe':
            case 'Two-Handed Blunt':
            case 'Scepter':
                weaponMult = 1.34;
                break;
            case 'Gun':
            case 'Spear':
            case 'Pole Arm':
                weaponMult = 1.50;
                break;
            case 'Arm Cannon':
            case 'Claw':
                weaponMult = 1.75;
        }
    }
    let mainStat = character.compoundedStats[classData[character.info.class].mainStat];
    let subStat = character.compoundedStats[classData[character.info.class].subStat];
    let characterAttackStat = character.compoundedStats[classData[character.info.class].attackStat];
    baseDamage = (4*mainStat + subStat) * weaponMult * damageMult * (characterAttackStat/100);
    damage = randomIntFromInterval(baseDamage * 0.8, baseDamage * 1.2);
    if (damage < 1) {
        damage = 1;
    }
    return damage;
}

function mobDie(mobDivId=-1) {
    let mobDiv;
    if (mobDivId == -1) { // if killing a random mob via a command 
        mobDiv = $('#mobArea .mob:not(.mobDying)').last();
    }
    else {
        mobDiv = activeMobs[mobDivId].div;
    }
    $(mobDiv).off('click');
    mobDiv.style.pointerEvents = 'none';
    if (activeMobs[mobDivId].isDying == true) {
        return;
    }
    //console.log(mobDivId, 'JUST DIED');
    activeMobs[mobDivId].isDying = true;
    removeItemOnce(targetableMobs, mobDivId);
    if (numberOfMobs > 0) {
        numberOfMobs--;
    }
    mobSetAnimation(mobDivId, 'die1'); // the dying animation should always be generated as "die1" but I am not sure about that
    let mobName = activeMobs[mobDivId].name;
    let mobId = activeMobs[mobDivId].id;
    let lootDropLocation = [activeMobs[mobDivId].left, activeMobs[mobDivId].top];
    mobDiv.style.transitionDuration = mobDelays[mobId]['die1'].reduce((partial_sum, a) => partial_sum + a, 0).toString() + 'ms';
    mobDiv.classList.add('mobDying');

    mobDropAmount = Math.round(Math.random()*5/9); // temporary example
    dropLoot(mobName, lootDropLocation[0], getFirstPlatformBelow(lootDropLocation[0], lootDropLocation[1]), mobDropAmount); // NEED TO FIX DROP LOOT TO WORK ANYWHERE----------------------------------------------------------------
    console.log('mobDropAmount: ' + mobDropAmount.toString() + '  mob: ' + mobName);

    if (bossMobs.includes(mobName)) {
        experienceAmount = bossData[mobName]['exp'];
    }
    else {
        experienceAmount = mobLevelToExp[mobLevels[mobName]];
    }
    gainExperience(experienceAmount);
    gainTextStreamAdd('You have gained experience (+' + experienceAmount.toString() + ')');
}

function gainTextStreamAdd(text) {
    console.log(text);
    let div = document.createElement('div');
    div.innerText = text;
    div.classList = ['fadeToGone'];
    $('#gainTextStream').append(div);
}

$(document).on('animationend webkitAnimationEnd oAnimationEnd', '.fadeToGone', function(event) { 
    $(event.currentTarget).remove();
});

$(document).on('animationend webkitAnimationEnd oAnimationEnd', '.hpFasterFade', function(event) { 
    $(event.currentTarget).css('right', '+=' + parseInt($(event.currentTarget).css('width')));
    $(event.currentTarget).css('width', 0);
});

function mobSetAnimation(mobDivId, newStatusName) {
    if (mobDivId in activeMobs) {
        if (activeMobs[mobDivId].currentAnimation != newStatusName) {
            let mobId = activeMobs[mobDivId].id;
            let sprites = './mob/' + mobId + '/' + newStatusName + '.png';
            let mob = activeMobs[mobDivId].div;
            mob.style.backgroundImage = 'url(' + sprites + ')';
            mob.style.backgroundPositionX = '0px';
            activeMobs[mobDivId].currentAnimation = newStatusName;
            if (activeMobs[mobDivId].gameLoopUsedAnimationSlot != -1) {
                if (activeMobs[mobDivId].gameLoopUsedAnimationSlot in gameLoop.mob) {
                    gameLoop.mob[activeMobs[mobDivId].gameLoopUsedAnimationSlot][0] = 0; // makes the animation advance immediately so that the next animation can start
                }
            }
        }
    }
}

const mobMaxMovementSpeed = 0.20;
const mobMaxXAcceleration = 0.02;
var mobJumpPower = 5.5;
function mobMovement(timeDelta, mobDivId) {
    if (!(mobDivId in activeMobs)) {
        return;
    }
    if (activeMobs[mobDivId].isDying) {
        return;
    }
    let mobDiv = activeMobs[mobDivId].div;
    let mobOrigin = mobOrigins[activeMobs[mobDivId].id];
    if (activeMobs[mobDivId].remainingMovementTime > 0) {
        activeMobs[mobDivId].remainingMovementTime -= timeDelta;
        if (activeMobs[mobDivId].remainingMovementTime < 0) {
            activeMobs[mobDivId].remainingMovementTime = 0;
        }
    }
    


    // MOVEMENT AI HERE
    if (activeMobs[mobDivId].remainingMovementTime == 0) {
        if (Math.random() >= 0.5) { // random wandering
            activeMobs[mobDivId].intendedDirection = 'right';
        }
        else {
            activeMobs[mobDivId].intendedDirection = 'left';
        }
        activeMobs[mobDivId].remainingMovementTime = randomIntFromInterval(350, 2000);
        if (!activeMobs[mobDivId].isJumping) {
            mobSetAnimation(mobDivId, 'move');
        }
        if (activeMobs[mobDivId].intendedDirection == 'right') {
            mobDiv.style.transform = 'scaleX(-1)';
            activeMobs[mobDivId].facing = 'right';
            mobDiv.childNodes.forEach((node) => {
                node.style.transform = 'scaleX(-1)';
            });
        }
        else {
            mobDiv.style.transform = 'scaleX(1)';
            activeMobs[mobDivId].facing = 'left';
            mobDiv.childNodes.forEach((node) => {
                node.style.transform = 'scaleX(1)';
            });
        }
    }
    if (activeMobs[mobDivId].intendedDirection != 'none') {
        if (activeMobs[mobDivId].canJump) {
            if (Math.random() >= 0.995) { // random jumping
                if (!activeMobs[mobDivId].isFalling) {
                    activeMobs[mobDivId].yVel = mobMaxMovementSpeed * mobJumpPower * 0.6;
                }
                mobSetAnimation(mobDivId, 'jump');
            }
        }
        if (!activeMobs[mobDivId].isFalling) {
            if (activeMobs[mobDivId].intendedDirection == 'right') {
                if (activeMobs[mobDivId].xAcceleration < maxXAcceleration) {
                    activeMobs[mobDivId].xAcceleration += 0.002;
                }
            }
            else {
                if (activeMobs[mobDivId].xAcceleration > -maxXAcceleration) {
                    activeMobs[mobDivId].xAcceleration -= 0.002;
                }
            }
        }
    }



    if (activeMobs[mobDivId].xAcceleration != 0) {
        if (between(activeMobs[mobDivId].xVel + activeMobs[mobDivId].xAcceleration * timeDelta, -mobMaxMovementSpeed * activeMobs[mobDivId].speedScale, mobMaxMovementSpeed * activeMobs[mobDivId].speedScale)) {
            activeMobs[mobDivId].xVel += activeMobs[mobDivId].xAcceleration * timeDelta;
        }
        else {
            if (activeMobs[mobDivId].xVel +  activeMobs[mobDivId].xAcceleration * timeDelta > mobMaxMovementSpeed * activeMobs[mobDivId].speedScale) {
                activeMobs[mobDivId].xVel = mobMaxMovementSpeed * activeMobs[mobDivId].speedScale;
            }
            else {
                activeMobs[mobDivId].xVel = -mobMaxMovementSpeed * activeMobs[mobDivId].speedScale;
            }
        }
        if (Math.abs(activeMobs[mobDivId].xAcceleration) < 0.0001) {
            activeMobs[mobDivId].xAcceleration = 0;
        }
        activeMobs[mobDivId].xAcceleration *= 0.9 ** timeDelta;
    }
    if (activeMobs[mobDivId].xVel != 0) {
        activeMobs[mobDivId].isFalling = (getFirstPlatformBelow(activeMobs[mobDivId].left, activeMobs[mobDivId].top) != activeMobs[mobDivId].top);
        if (activeMobs[mobDivId].left + activeMobs[mobDivId].xVel * timeDelta > 1079) {
            activeMobs[mobDivId].left = 1079;
            activeMobs[mobDivId].xVel = 0;
            activeMobs[mobDivId].xAcceleration = 0;
            activeMobs[mobDivId].intendedDirection = 'left';
            mobDiv.style.transform = 'scaleX(1)';
            activeMobs[mobDivId].facing = 'left';
            mobDiv.childNodes.forEach((node) => {
                node.style.transform = 'scaleX(1)';
            });
        } 
        else if (activeMobs[mobDivId].left + activeMobs[mobDivId].xVel * timeDelta < 0) {
            activeMobs[mobDivId].left = 0;
            activeMobs[mobDivId].xVel = 0;
            activeMobs[mobDivId].xAcceleration = 0;
            activeMobs[mobDivId].intendedDirection = 'right';
            mobDiv.style.transform = 'scaleX(-1)';
            activeMobs[mobDivId].facing = 'right';
            mobDiv.childNodes.forEach((node) => {
                node.style.transform = 'scaleX(-1)';
            });
        } 
        else {
            activeMobs[mobDivId].left += activeMobs[mobDivId].xVel * timeDelta;
        }
        mobDiv.style.left = activeMobs[mobDivId].left - mobOrigin[0] + 'px';
        if (activeMobs[mobDivId].intendedDirection == 'none') {
            if (!activeMobs[mobDivId].isFalling) {
                activeMobs[mobDivId].xVel *= 0.97 ** timeDelta;
            }
        }
        if (Math.abs(activeMobs[mobDivId].xVel) < 0.0001) {
            activeMobs[mobDivId].xVel = 0;
        }
    }
    if (!activeMobs[mobDivId].isFalling) {
        activeMobs[mobDivId].isFalling = (activeMobs[mobDivId].yVel < 0);
    }
    else {
        activeMobs[mobDivId].isJumping = true;
    }
    if (activeMobs[mobDivId].yVel != 0 || activeMobs[mobDivId].isFalling) {
        activeMobs[mobDivId].lastFloorY = getFirstPlatformBelow(activeMobs[mobDivId].left, activeMobs[mobDivId].top);
        activeMobs[mobDivId].top -= activeMobs[mobDivId].yVel * timeDelta;
        mobDiv.style.top = activeMobs[mobDivId].top - mobOrigin[1] + 'px';
        activeMobs[mobDivId].yVel -= gravity * timeDelta;

    }
    if (activeMobs[mobDivId].isFalling) {
        if (activeMobs[mobDivId].top >= activeMobs[mobDivId].lastFloorY) {
            activeMobs[mobDivId].isFalling = false;
            activeMobs[mobDivId].isJumping = false;
            if (activeMobs[mobDivId].remainingMovementTime > 0) {
                mobSetAnimation(mobDivId, 'move');
            }
            activeMobs[mobDivId].yVel = 0;
            activeMobs[mobDivId].top = activeMobs[mobDivId].lastFloorY;
            mobDiv.style.top = activeMobs[mobDivId].top - mobOrigin[1] + 'px';
        }
    }


    scheduleToGameLoop(0, mobMovement, [mobDivId], 'movement');
}

function mobAnimation(mobDivId, lastStatus) {
    if (mobDivId in activeMobs) {
        let mobId = activeMobs[mobDivId].id;
        let currentAnimation = activeMobs[mobDivId].currentAnimation;
        let durationSource = mobDelays[mobId][currentAnimation];
        let mob = activeMobs[mobDivId].div;
        let frame = activeMobs[mobDivId].frame++;
        if (mob.parentNode === null || mob.parentNode.parentNode === null) { // stops trying to animate elements that were removed already
            return;
        }
        mob.style.backgroundPositionX = parseFloat(mob.style.backgroundPositionX) - mobDimensions[mobId][0] + 'px';
        if (frame+1 >= durationSource.length || currentAnimation != lastStatus) {
            if (frame+1 >= durationSource.length && activeMobs[mobDivId].currentAnimation == 'die1') {
                delete activeMobs[mobDivId];
                mob.remove();
                return;
            }
            mob.style.backgroundPositionX = '0px';
            activeMobs[mobDivId].frame = 0;
            frame = 0;
        }
        let data = [mobDivId, currentAnimation];
        activeMobs[mobDivId].gameLoopUsedAnimationSlot = scheduleToGameLoop(durationSource[frame], mobAnimation, data, 'mob');
    }
}

const damageNumberLefts = {0: 12, 1: 8, 2: 11, 3: 11, 4: 12, 5: 11, 6: 12, 7: 11, 8: 12, 9: 12};
function damageNumbers(number, left, top) {
    let div = document.createElement('div');
    div.classList = ['damageNumberHolder'];
    number = String(number);
    let randomLeftMovement = randomIntFromInterval(-22, 22);
    let leftChange = -4 + randomLeftMovement;
    let lastWidth = 0;
    for (i=0; i<number.length; i++) {
        let img = new Image();
        img.src = './files/hit/' + number[i] + '.png';
        if (i == 0) {
            $(img).css('top', '-8px');
            $(img).css('width', Math.round(img.width * 7/6) + 'px');
            $(img).css('height', Math.round(img.height * 7/6) + 'px');
            lastWidth = parseInt($(img).css('width'));
            $(img).css('left', -6 + randomLeftMovement + 'px');
        }
        else if (i % 2 == 0) {
            if (i % 4 == 0) {
                $(img).css('top', '-3px');
            }
            else {
                $(img).css('top', '-4px');
            }
        }
        if (i != 0) {
            leftChange += lastWidth - damageNumberLefts[number.at(i-1)];
            $(img).css('left', leftChange + 'px');
            lastWidth = img.width;
        }
        div.append(img);
    }
    let finalWidth = lastWidth + leftChange;
    $(div).css('left', left - finalWidth / 2 + 'px');
    $(div).css('--finalTop', top - 20 + 'px');
    $(div).css('top', top + 'px');
    $('#lootArea').append(div);
}

$(document).on('animationend webkitAnimationEnd oAnimationEnd', '.damageNumberHolder', function(event) { 
    $(event.currentTarget).remove();
});
