var zoneConnections = {
    1: [{l: 962, t: 630, dest: 2}],
    2: [{l: 38, t: 162, dest: 1}, {l: 940, t: 214, dest: 3}]
};

var zoneMobs = {
    1: ['tino'],
    2: ['tino']
};

var currentZone = 1;

function loadPortals() {
    $('.portal').remove();
    zoneConnections[currentZone].forEach(function(portalData) {
        let portal = new Image();
        portal.src = "/files/portal.gif";
        portal.value = portalData.dest;
        portal.classList = ['portal clickable'];
        portal.setAttribute('draggable', 'false')
        $(portal).css('left', portalData.l);
        $(portal).css('top', portalData.t);
        $(portal).on('click', portal, changeZones);
        $('#lootArea').append(portal);
    });
}

function canEnterThisZone() {
    return true
}

function changeZones() {
    $(this).off('click');
    this.classList.remove('clickable');
    let success = canEnterThisZone(this.value);
    if (!success) {
        this.classList.add('clickable');
        $(this).on('click', this, changeZones);
        return
    }
    $('#superBlocker').css('background', 'rgba(0,0,0,0)');
    $('#superBlocker').css('visibility', 'visible');
    $('#superBlocker').css('pointer-events', 'all');
    $('#superBlocker').addClass('fadeToBlack');
    $('#superBlocker').css('background', 'rgba(0,0,0,1)');
    currentZone = this.value;
}

$('#superBlocker').on('animationend webkitAnimationEnd oAnimationEnd', function(event) { // part of changeZones()
    if ($('#superBlocker').hasClass('fadeToBlack')) { 
        loadPortals()
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

$(document).ready(function() {
    loadPortals();
});