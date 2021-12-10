var zoneConnections = {
    1: [{l: 962, t: 630, dest: 2}],
    2: [{l: 38, t: 162, dest: 1}, {l: 600, t: 265, dest: 3}],
    3: [{l: 78, t: 162, dest: 2}, {l: 600, t: 265, dest: 4}],
    4: [{l: 78, t: 162, dest: 3}, {l: 600, t: 265, dest: 5}],
    5: [{l: 78, t: 162, dest: 4}, {l: 600, t: 265, dest: 6}],
    6: [{l: 78, t: 162, dest: 5}, {l: 600, t: 265, dest: 7}],
    7: [{l: 78, t: 162, dest: 6}, {l: 600, t: 265, dest: 8}],
    8: [{l: 78, t: 162, dest: 7}, {l: 600, t: 265, dest: 9}]
};

var zoneMobs = {
    1: ['tino'],
    2: ['potted sprout'],
    3: ['pig'],
    4: ['ghost stump'],
    5: ['mano'],
    6: ['orange mushroom'],
    7: ['water thief monster'],
    8: ['crying blue mushroom']
};

var currentZone = 1;

function loadPortals() {
    $('.portal').remove();
    zoneConnections[currentZone].forEach(function(portalData) {
        let portal = document.createElement('div');
        portal.value = portalData.dest;
        portal.classList = ['portal clickable'];
        portal.setAttribute('draggable', 'false');
        let tooltip = document.createElement('span');
        tooltip.classList = ['textTooltip'];
        let text = 'Lv. ' + mobLevels[zoneMobs[portalData.dest]] + ' ' + mobNames[zoneMobs[portalData.dest]];
        tooltip.innerHTML = text;
        portal.appendChild(tooltip);
        $(portal).css('left', portalData.l);
        $(portal).css('top', portalData.t);
        $(portal).on('click', portal, changeZones);
        $('#lootArea').append(portal);
    });
    $('.portal').on('mousemove', function(event) {
        $(event.currentTarget).children('.textTooltip').css({
            'left': event.pageX +6,
            'top': event.pageY +6,
            'visibility': 'visible'
        });
    });
    $('.portal').on('mouseleave', function(event) {
        $(event.currentTarget).children('.textTooltip').css({
            'visibility': 'hidden'
        });
    });
}

function canEnterThisZone() {
    return true;
}

function changeZones() {
    $(this).off('click');
    this.classList.remove('clickable');
    let success = canEnterThisZone(this.value);
    if (!success) {
        this.classList.add('clickable');
        $(this).on('click', this, changeZones);
        return;
    }
    $('#superBlocker').css('background', 'rgba(0,0,0,0)');
    $('#superBlocker').css('visibility', 'visible');
    $('#superBlocker').css('pointer-events', 'all');
    $('#superBlocker').addClass('fadeToBlack');
    $('#superBlocker').css('background', 'rgba(0,0,0,1)');
    currentZone = this.value;
}

$('#superBlocker').on('animationend webkitAnimationEnd oAnimationEnd', function(event) { // part of changeZones()
    $('.mob').remove();
    if ($('#superBlocker').hasClass('fadeToBlack')) { 
        loadPortals();
        $('#superBlocker').removeClass('fadeToBlack');
        $('#superBlocker').addClass('unfadeToBlack');
    }
    else if ($('#superBlocker').hasClass('unfadeToBlack')) {
        $('#superBlocker').css('visibility', 'hidden');
        $('#superBlocker').css('pointer-events', 'none');
        $('#superBlocker').css('background', '');
        $('#superBlocker').removeClass('unfadeToBlack');
    }
});

$(() => {
    loadPortals();
});