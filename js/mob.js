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
    div.css('left', 540 - mobDimensions[name]['alive'][0]/2 + randomIntFromInterval(-20, 20) + 'px' )
    div.addClass('mob clickable');
    div.attr('draggable', false);
    let hpBar = document.createElement('div');
    hpBar = $(hpBar);
    hpBar.addClass('hpBar');
    hpBar.attr('hp', Math.ceil(Math.random() * 34) + 90); // temporary example for HP
    hpBar.attr('maxHP', $(hpBar).attr('hp')); // temporary example for maxHP
    $('#mobHP').text(''.concat(hpBar.attr('hp'), ' / ', hpBar.attr('maxHP')));
    div.on('click', (event) => {// MOBS TAKE DAMAGE ON CLICK
        let theirHpBar = $(event.currentTarget).children();
        theirHpBar.css('visibility', 'visible');
        newHP = theirHpBar.attr('hp') - rollDamageToMob();
        if (newHP < 0) {
            newHP = 0;
        }
        $('#mobHP').text(''.concat(newHP, ' / ', theirHpBar.attr('maxHP')));
        let width = (1 - newHP / theirHpBar.attr('maxHP')) * 67;
        let theirRedPart = theirHpBar.children('.hpBarRedPart');
        if (theirRedPart.hasClass('hpFasterFade')) {
            theirRedPart.removeClass('hpFasterFade');
            theirRedPart.width(); // stupid garbage necessary code says these people:  https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/
        }
        theirRedPart.css('width', width + 4 - parseInt(theirRedPart.css('right')) + 'px');
        theirRedPart.addClass('hpFasterFade');
        let theirBlackPart = theirHpBar.children('.hpBarBlackPart');
        theirBlackPart.css('width', width);
        if (newHP <= 0) {
            theirHpBar.css('visibility', 'hidden');
            mobDie(event.currentTarget);
        }
        theirHpBar.attr('hp', newHP);
    });
    let greenPart = new Image();
    greenPart.src = 'files/hpBar.png';
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

function rollDamageToMob(skill='') {
    let damage = 0;
    if (skill) {
        // do something
    }
    else {
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
        baseDamage = character.compoundedStats[weaponType];
        damage = randomIntFromInterval(baseDamage * 0.6, baseDamage * 1.2);
    }
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
        target.css('pointer-events', 'none');
        let mobName = target.val();
        mobSetAnimation(target, 'dead')
        target.css('transition-duration', mobFrameDurations[mobName]['dead'].reduce((partial_sum, a) => partial_sum + a, 0).toString() + 'ms');
        target.addClass('mobDying');

        mobDropAmount = Math.ceil(Math.random() * 3); // temporary example
        dropLoot(mobName.toLowerCase(), target.css('left'), mobDropAmount);
        console.log('mobDropAmount: ' + mobDropAmount.toString() + '  mob: ' + mobName);

        experienceAmount = Math.ceil(Math.random() * 6); // temporary example
        character.gainExperience(experienceAmount);
        gainTextStreamAdd('You have gained experience (+' + experienceAmount.toString() + ')');

        doubloonsAmount = Math.ceil(Math.random() * 12); // temporary example
        updateDoubloons(doubloonsAmount);
        gainTextStreamAdd('You have gained doubloons (+' + doubloonsAmount.toString() + ')');
    }
}

MAX_MOBS = 1;
$(document).ready( () => {
    spawn(getMob())
    setInterval(() => {
        if ($('.mob').length < MAX_MOBS) {
            console.log("Spawning a mob");
            spawn(getMob());
        }}, 14000);
})

function gainTextStreamAdd(text) {
    console.log(text)
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
    if ($(event.target).hasClass('mob')) {
        mobSetAnimation(event.target, 'alive');
        $(event.target).removeClass('mobMoving');
        mobMove(event.target);
    }
})

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
    sprites = '/mob/' + status + '/' + mob.val().replaceAll(' ', '%20') + '.png';
    mob.css('background-image', 'url(' + sprites + ')');
    mob.attr('status', status)
    mob.css('background-position-x', '0px')
    mob.css('width', mobDimensions[mob.val()][status][0] + 'px')
    mob.css('height', mobDimensions[mob.val()][status][1] + 'px')
    //mob.css('left', '-=' + mobDimensions[name]['alive'][0]/2)
}

function someAnimate(mob, lastStatus, frame=0) {
    mob = $(mob);
    let status = mob.attr('status');
    let durationSource = mobFrameDurations[mob.val()][status];
    if (durationSource.length == 1) {
        durationSource = [300];
    }
    mob.css('background-position-x', '-=' + mob.width());
    if (frame >= durationSource.length || status != lastStatus) {
        if (frame >= durationSource.length && mob.hasClass('mobDying')) {
            mob.remove();
            return
        }
        mob.css('background-position-x', '0px')
        frame = 0;
        if (status == 'move' && status != lastStatus) {
            let movingLeft = Boolean(randomIntFromInterval(0, 1));
            let distance = mobFrameDurations[mob.val()]['move'].reduce((partial_sum, a) => partial_sum + a, 0) * randomIntFromInterval(1, 6) * .05;
            let final = 0;
            let duration = distance / .05;
            console.log('Movingleft: %s, distance: %s, duration: %s', movingLeft, distance, duration)
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
                mob.children().first().css('transform', 'scaleX(1)');
            }
            else {
                mob.css('transform', 'scaleX(-1)');
                mob.children().first().css('transform', 'scaleX(-1)');
            }
            mob.css('left', final + 'px');
        }
    }
    setTimeout(() => {
        someAnimate(mob, status, frame+1)
    }, durationSource[frame]);
}
