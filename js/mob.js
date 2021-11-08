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

function mobGifSetup(name) { // name in any case
    name = name.toLowerCase();
    let div = document.createElement('div');
    div = $(div);
    div.val(name);
    mobSetAnimation(div, 'alive');
    div.css('left', 540 - mobDimensions[name]['alive'][0]/2 + 'px')
    div.addClass('mob clickable');
    div.attr('draggable', false);
    div.attr('hp', Math.ceil(Math.random() * 34) + 90); // temporary example for HP
    div.attr('maxHP', $(div).attr('hp')); // temporary example for maxHP
    $('#mobHP').text(''.concat(div.attr('hp'), ' / ', div.attr('maxHP')));
    div.on('click', (event) => {// MOBS TAKE DAMAGE ON CLICK
        newHP = $(event.currentTarget).attr('hp') - rollDamageToMob();
        if (newHP < 0) {
            newHP = 0;
        }
        $('#mobHP').text(''.concat(newHP, ' / ', $(event.currentTarget).attr('maxHP')));
        if (newHP <= 0) {
            mobDie(event.currentTarget);
        }
        $(event.currentTarget).attr('hp', newHP);
    });
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
        target = $('#mobArea div:not(.mobDying)').last();
    }
    else {
        target = $(origin); // it will be activated by clicking the mob so that should catch it
    }
    if (target.length > 0 || target.is('img')) {
        target.css('pointer-events', 'none');
        let mobName = target.val();
        mobSetAnimation(target, 'dead')
        target.css('transition-duration', mobDeathDuration[mobName].toString() + 'ms');
        target.addClass('mobDying');

        mobDropAmount = Math.ceil(Math.random() * 3); // temporary example
        dropLoot(mobName.toLowerCase(), mobDropAmount);
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

$(document).on('animationend webkitAnimationEnd oAnimationEnd', '.mobMoving', function(event) { // part of the mob death effect
    mobSetAnimation(event.currentTarget, 'alive');
    $(event.currentTarget).removeClass('mobMoving');
    mobMove(event.currentTarget);
})

function mobMove(mob) {
    mob = $(mob);
    setTimeout(() => {
        mobSetAnimation(mob, 'move');
        let movingLeft = Boolean(randomIntFromInterval(0, 1));
        let distance = mobMoveDuration[mob.val()] * randomIntFromInterval(1, 6) * .05;
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
        }
        else {
            mob.css('transform', 'scaleX(-1)');
        }
        mob.css('left', final + 'px');
    }, randomIntFromInterval(4217, 10203));
}

function mobSetAnimation(mob, status) {
    mob = $(mob);
    sprites = '/mob/' + status + '/' + mob.val() + '.png';
    mob.css('background-image', 'url(' + sprites + ')');
    mob.attr('status', status)
    mob.css('background-position-x', '0px')
    console.log(mob)
    console.log(mob.val())
    console.log(mobDimensions[mob.val()])
    console.log(status)
    mob.css('width', mobDimensions[mob.val()][status][0] + 'px')
    mob.css('height', mobDimensions[mob.val()][status][1] + 'px')
    //mob.css('left', '-=' + mobDimensions[name]['alive'][0]/2)
}

function someAnimate(mob, lastStatus, frame=0) {
    mob = $(mob);
    let status = mob.attr('status');
    let durationSource = [];
    mob.css('background-position-x', '-=' + mob.width());
    if (status == 'alive') {
        durationSource = mobAliveFrameDurations[mob.val()];
    }
    else if (status == 'dead') {
        durationSource = mobDeadFrameDurations[mob.val()];
    }
    else if (status == 'move') {
        durationSource = mobMoveFrameDurations[mob.val()];
    }
    if (frame >= durationSource.length || status != lastStatus) {
        if (mob.hasClass('mobDying')) {
            mob.remove();
        }
        if (mob.attr('queued')) {
            status = mob.attr('queued');
        }
        mob.css('background-position-x', '0px')
        frame = 0;
    }
    //console.log(durationSource)
    setTimeout(() => {
        someAnimate(mob, status, frame+1)
    }, durationSource[frame]);
}
