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
    $('#mobArea').append(mobGifSetup(mob));
}

function mobGifSetup(name) { // name in any case
    name = name.toLowerCase();
    gif = '/mob/alive/' + name + '.gif';
    const img = new Image();

    img.classList = ['mob clickable'];
    img.src = gif;
    img.value = name;
    img.setAttribute('draggable', false);
    img.setAttribute('hp', Math.ceil(Math.random() * 34) + 90); // temporary example for HP
    img.setAttribute('maxHP', $(img).attr('hp')); // temporary example for maxHP
    $('#mobHP').text(''.concat($(img).attr('hp'), ' / ', $(img).attr('maxHP')));

    $(img).click(function() {// MOBS TAKE DAMAGE ON CLICK
        newHP = $(this).attr('hp') - rollDamageToMob();
        if (newHP < 0) {
            newHP = 0;
        }
        $('#mobHP').text(''.concat(newHP, ' / ', $(img).attr('maxHP')));
        if (newHP <= 0) {
            mobDie(this);
        }
        $(this).attr('hp', newHP);
    });
    return img;
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
        target = $('#mobArea img:not(.mobDying)').last();
    }
    else {
        target = $(origin); // it will be activated by clicking the mob so that should catch it
    }
    if (target.length > 0 || target.is('img')) {
        target.css('pointer-events', 'none');
        mobName = target.val();
        target.attr('src', '/mob/dead/' + mobName + '.gif');
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
$(document).ready(function() {
    spawn(getMob())
    setInterval(function() {
        if ($('.mob').length < MAX_MOBS) {
            console.log("Spawning a mob");
            spawn(getMob());
        }}, 14000);
})

$(document).on('transitionend webkitTransitionEnd oTransitionEnd', '.mob', function(event) { // part of the mob death effect
    $(event.currentTarget).remove();
});

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
