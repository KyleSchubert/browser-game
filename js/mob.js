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
    let madeMob = mobGifSetup(mob);
    mobMove(madeMob);
    someAnimate(madeMob, 'alive');
    $('#mobArea').append(madeMob);
}

function spawnOneOfEach() {
    knownMobs.forEach((mob) => {
        spawn(mob);
    });
}

function mobGifSetup(name) { // name in any case
    name = name.toLowerCase();
    let div = document.createElement('div');
    div = $(div);
    div.val(name);
    mobSetAnimation(div, 'alive');
    div.css('left', 540 - mobDimensions[name]['alive'][0]/2 + randomIntFromInterval(-400, 400) + 'px' );
    div.addClass('mob clickable');
    div.attr('draggable', false);
    let nameAndLevelText = document.createElement('div');
    nameAndLevelText = $(nameAndLevelText);
    nameAndLevelText.addClass('nameAndLevelText');
    let nameText = document.createElement('div');
    nameText.innerHTML = mobNames[name];
    nameText.classList = ['mobNameText'];
    let levelText = document.createElement('div');
    levelText.innerHTML = 'Lv. ' + mobLevels[name];
    levelText.classList = ['mobLevelText'];
    nameAndLevelText.append(levelText);
    nameAndLevelText.append(nameText);
    let hpBar = document.createElement('div');
    hpBar = $(hpBar);
    hpBar.addClass('hpBar');
    if (bossMobs.includes(name)) {
        hpBar.attr('hp', bossData[name]['hp']);
    }
    else {
        hpBar.attr('hp', mobLevelToHp[mobLevels[name]]);
        div.append(nameAndLevelText);
    }
    hpBar.attr('maxHP', $(hpBar).attr('hp')); // temporary example for maxHP
    div.on('click', (event) => {// MOBS TAKE DAMAGE ON CLICK
        mobDamageEvent(event.currentTarget);
    });
    let greenPart = new Image();
    greenPart.src = './files/hpBar.png';
    let blackPart = document.createElement('div');
    blackPart.classList = ['hpBarBlackPart'];
    $(blackPart).css('right', '4px');
    let redPart = document.createElement('div');
    redPart.classList = ['hpBarRedPart'];
    $(redPart).css('right', '4px');
    hpBar.append(blackPart);
    hpBar.append(redPart);
    hpBar.append(greenPart);
    div.append(hpBar);
    return div;
}

function mobDamageEvent(event, skill=0, damageNumberLocation=[]) {
    let damageRoll = 1;
    if (skill == 0) { // default attack AKA click
        damageRoll = rollDamageToMob(skill);
        damageNumbers(damageRoll, parseInt($(event).css('left')) + parseInt($(event).css('width')) / 2, -parseInt($(event).css('height')) + marginToAccountFor - 20);
    }
    else {
        let damageTopLocation = 70;
        damageRoll = rollDamageToMob(skill);
        damageNumbers(damageRoll, damageNumberLocation[0], damageNumberLocation[1] - damageTopLocation);
        damageTopLocation += 32;
        for (let i=1; i<realSkillData.lines; i++) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    damageRoll = rollDamageToMob(skill);
                    damageNumbers(damageRoll, damageNumberLocation[0], damageNumberLocation[1] - damageTopLocation);
                    damageTopLocation += 32;
                });
            }, 75*i);
        }
    }
    let theirNameAndLevelText = event.firstChild;
    let theirHpBar = event.lastChild;
    theirHpBar.style.visibility = 'visible';
    newHP = theirHpBar.getAttribute('hp') - damageRoll; // maybe needs improvement
    if (newHP < 0) {
        newHP = 0;
    }
    let width = (1 - newHP / theirHpBar.getAttribute('maxHP')) * 67; // maybe needs improvement
    let theirRedPart = theirHpBar.children[1];
    if (theirRedPart.classList.contains('hpFasterFade')) {
        theirRedPart.classList.remove('hpFasterFade');
        theirRedPart.style.animation = 'none';
        requestAnimationFrame(() => theirRedPart.style.animation = '');
    }
    theirRedPart.style.width = width + 4 - parseInt(theirRedPart.style.right) + 'px'; // maybe needs improvement
    theirRedPart.classList.add('hpFasterFade');
    theirBlackPart = theirHpBar.firstChild; // maybe needs improvement
    theirBlackPart.style.width = width + 'px'; // maybe needs improvement
    if (newHP <= 0) {
        theirHpBar.style.visibility = 'hidden';
        theirNameAndLevelText.style.visibility = 'hidden';
        mobDie(event);
    }
    else {
        theirNameAndLevelText.style.visibility = 'visible';
    }
    theirHpBar.setAttribute('hp', newHP);
    return; 
}

function rollDamageToMob(skill=0) {
    let damage = 0;
    let damageMult = 1.00;
    if (skill != 0) {
        damageMult = realSkillData['damageMult'];
    }
    if (jQuery.isEmptyObject(character.equipment[16])) {
        weaponType = 'strength';
    }
    else {
        switch (itemsInEquipmentSlots[16].exactType) {
            case 'One-Handed Sword':
            case 'One-Handed Axe':
            case 'One-Handed Blunt Weapon':
            case 'Two-Handed Sword':
            case 'Two-Handed Axe':
            case 'Two-Handed Blunt':
                weaponType = 'strength';
                break;
            case 'Bow':
            case 'Gun':
            case 'Spear':
            case 'Pole Arm':
                weaponType = 'dexterity';
                break;
            case 'Wand':
            case 'Staff':
            case 'Scepter':
            case 'Arm Cannon':
                weaponType = 'intelligence';
                break;
            case 'Katara':
            case 'Claw':
            case 'Gauntlet':
            case 'Dagger':
                weaponType = 'luck';
                break;
        }
    }
    baseDamage = character.compoundedStats[weaponType] * damageMult;
    damage = randomIntFromInterval(baseDamage * 0.8, baseDamage * 1.2);
    return damage;
}

function mobDie(origin='') {
    if (!origin) {
        target = $('#mobArea .mob:not(.mobDying)').last();
    }
    else {
        target = $(origin); // it will be activated by clicking the mob so that should catch it
    }
    if (target.length > 0 || target.is('img')) {
        target.off('click');
        target.css('pointer-events', 'none');
        let mobName = target.val();
        mobSetAnimation(target, 'dead');
        target.css('transition-duration', mobFrameDurations[mobName]['dead'].reduce((partial_sum, a) => partial_sum + a, 0).toString() + 'ms');
        target.addClass('mobDying');

        mobDropAmount = Math.round(Math.random()*5/9); // temporary example
        dropLoot(mobName.toLowerCase(), target.css('left'), mobDropAmount);
        console.log('mobDropAmount: ' + mobDropAmount.toString() + '  mob: ' + mobName);

        if (bossMobs.includes(mobName)) {
            experienceAmount = bossData[mobName]['exp'];
        }
        else {
            experienceAmount = mobLevelToExp[mobLevels[mobName]];
        }
        character.gainExperience(experienceAmount);
        gainTextStreamAdd('You have gained experience (+' + experienceAmount.toString() + ')');

        doubloonsAmount = randomIntFromInterval(28, 32) + mobLevelToExp[mobLevels[mobName]]; // TEMPORARY EXAMPLE
        updateDoubloons(doubloonsAmount);
        gainTextStreamAdd('You have gained doubloons (+' + doubloonsAmount.toString() + ')');
    }
}

MAX_MOBS = 30;
$(() => {
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    spawn(getMob());
    setInterval(() => {
        if ($('.mob').length < MAX_MOBS) {
            console.log("Respawning mobs");
            let amountToSpawn = (MAX_MOBS-$('.mob').length);
            for (i=0; i<amountToSpawn; i++) {
                spawn(getMob());
            }
        }
    }, 6680);
});

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

$(document).on('animationend webkitAnimationEnd oAnimationEnd', '.mobMoving', function(event) { // part of the mob death effect
    if (event.target.classList.contains('mob')) {
        mobSetAnimation(event.target, 'alive');
        event.target.classList.remove('mobMoving');
        mobMove(event.target);
    }
});

function mobMove(mob) {
    mob = $(mob);
    setTimeout(() => {
        if (!mob.hasClass('mobDying')) {
            mobSetAnimation(mob, 'move');
        }
    }, randomIntFromInterval(4217, 10203));
}

function mobSetAnimation(mob, status) {
    mob = $(mob);
    sprites = './mob/' + status + '/' + mob.val().replaceAll(' ', '%20') + '.png';
    mob.css('background-image', 'url(' + sprites + ')');
    mob.attr('status', status);
    mob.css('background-position-x', '0px');
    mob.css('width', mobDimensions[mob.val()][status][0] + 'px');
    mob.css('height', mobDimensions[mob.val()][status][1] + 'px');
    //mob.css('left', '-=' + mobDimensions[name]['alive'][0]/2)
}

function someAnimate(mob, lastStatus, frame=0) {
    let status = mob.attr('status');
    let durationSource = mobFrameDurations[mob.val()][status];
    if (durationSource.length == 1) {
        durationSource = [300];
    }
    mob.css('background-position-x', '-=' + mob.width());
    if (frame >= durationSource.length || status != lastStatus) {
        if (frame >= durationSource.length && mob.hasClass('mobDying')) {
            mob.remove();
            return;
        }
        mob.css('background-position-x', '0px');
        frame = 0;
        if (status == 'move' && status != lastStatus) {
            let movingLeft = Boolean(randomIntFromInterval(0, 1));
            let currentLeft = parseInt(mob.css('left'));
            if (!movingLeft) {
                currentLeft = 1080 - currentLeft - parseInt(mob.css('width'));
            }
            let upperLimit = 6;
            if (Math.floor(currentLeft / (mobFrameDurations[mob.val()]['move'].reduce((partial_sum, a) => partial_sum + a, 0) / 20)) < upperLimit) {
                upperLimit = Math.floor(currentLeft / (mobFrameDurations[mob.val()]['move'].reduce((partial_sum, a) => partial_sum + a, 0) / 20));
            }
            if (upperLimit <= 1) {
                movingLeft = !movingLeft;
                upperLimit = 6;
            } 
            let distance = mobFrameDurations[mob.val()]['move'].reduce((partial_sum, a) => partial_sum + a, 0) * randomIntFromInterval(1, upperLimit) / 20;
            let final = 0;
            let duration = distance * 20;
            //console.log('Movingleft: %s, distance: %s, duration: %s', movingLeft, distance, duration)
            if (movingLeft) { 
                final = parseInt(mob.css('left'))-distance;
            }
            else {
                final = parseInt(mob.css('left'))+distance;
            }
            mob.css('animation-duration', duration + 'ms');
            mob.css('--currentLeft', mob.css('left'));
            mob.css('--finalLeft',  final + 'px');
            mob.addClass('mobMoving');
            if (movingLeft) { 
                mob.css('transform', 'scaleX(1)');
                mob.find('.hpBar').css('transform', 'scaleX(1)');
                mob.find('.nameAndLevelText').css('transform', 'scaleX(1)');
            }
            else {
                mob.css('transform', 'scaleX(-1)');
                mob.find('.hpBar').css('transform', 'scaleX(-1)');
                mob.find('.nameAndLevelText').css('transform', 'scaleX(-1)');
            }
            mob.css('left', final + 'px');
        }
    }
    setTimeout(() => {
        requestAnimationFrame(() => someAnimate(mob, status, frame+1));
    }, durationSource[frame]);
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
