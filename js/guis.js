var somethingIsOpen = false;
var somethingWasClosed = false;

$('.guiOpeningButton').click(function() {
    guiType = guiGetType(this);
    guiToggleVisibility(guiType, this.getAttribute('value'));
});

guiIDs = ['#shopHolder', '#equipmentHolder'];
$('body').keydown(function(e) {
    if (e.key === 'Escape') { // escape key maps to keycode `27`
        if (smallDialogBoxOpen) {
            closeSmallDialogBox();
            if (weAreCurrentlySelling) {
                resetSellProcess();
            }
            if (dialogMainReason == 'too expensive') {
                playSound(sounds[5]);
            }
        }
        else {
            guiIDs.forEach(guiClose);
            if (somethingWasClosed) {
                playSound(sounds[5]);
                doubloonsHaveToBeUpdatedNow = false;
                somethingWasClosed = false;
                somethingIsOpen = false;
                $('#guiHolder').css('top', 'calc(50% - 400px)');
                $('#guiHolder').css('left', 'calc(50% - 320px)');
            }
        }
    }
});

$('body').keydown(function(e) {
    if (e.key === 'Enter') {
        if (smallDialogBoxOpen) {
            dialogProceed();
        }
    }
});

$(function() {
    $('#guiHolder').draggable({handle: '.draggableBar'});
    $('#guiHolder').draggable({cancel: '.guiInnerContentArea'});
    $('#guiHolder').draggable({scroll: false});
    $('#smallDialogBoxHolder').draggable({handle: '.draggableBar'});
    $('#smallDialogBoxHolder').draggable({cancel: '.smallDialogBox'});
    $('#smallDialogBoxHolder').draggable({containment: '#guiHolder'});
    // $().disableSelection();
} );

guiTypes = {
    80001: 'shop',
    80002: 'storage',
    200: 'equipment'
};


function guiGetType(node) {
    return guiTypes[node.getAttribute('value')];
}

function guiToggleVisibility(guiType, guiID) {
    switch (guiType) {
        case 'shop':
            target = guiIDs[0];
            break;
        case 'storage':
            target = guiIDs[0];
            break;
        case 'equipment':
            target = guiIDs[1];
            break;
        default:
            console.log('in guiToggleVisibility, there is no case for this guiType: ');
            console.log(guiType);
    }
    if (somethingIsOpen) {
        guiIDs.forEach(silentHide);
        playSound(sounds[5]); // MenuUp.mp3
        somethingIsOpen = false;
        $('#guiHolder').css('top', 'calc(50% - 400px)');
        $('#guiHolder').css('left', 'calc(50% - 320px)');
    }
    else {
        guiLoadData(guiType, guiID); // this has to happen first!
        $(target).css('visibility', 'visible');
        somethingIsOpen = true;
        playSound(sounds[6]); // Tab.mp3
    }
}

function silentHide(node) {
    $(node).css('visibility', 'hidden');
}

function silentToggleVisibility(node) {
    node = $(node);
    if (node.css('visibility') == 'hidden') {
        $(node).css('visibility', 'visible');
        return true; // as in: "is it visible?" --> "yes"
    }
    else {
        $(node).css('visibility', 'hidden');
        return false; // as in: "is it visible?" --> "no"
    }
}

function guiClose(target) { // all of them
    if ($(target).css('visibility') == 'visible') {
        doubloonsHaveToBeUpdatedNow = false;
        storageIsOpen = false;
        somethingWasClosed = true;
        $(target).css('visibility', 'hidden');
    }
}

function guiLoadData(guiType, id) {
    switch (guiType) {
        case 'shop':
            shopLoad(id);
            break;
        case 'storage':
            shopLoad(id, true);
            break;
        default:
            console.log('guiLoadData does not have any case for this guiType: ');
            console.log(guiType);
    }
}

$('.textTightContainer, .statName').on('mousemove', function(event) {
    $(event.currentTarget).children('.textTooltip').css({
        'left': event.pageX +6,
        'top': event.pageY +6,
        'visibility': 'visible'
    });
});
$('.textTightContainer, .statName').on('mouseleave', function(event) {
    $(event.currentTarget).children('.textTooltip').css({
        'visibility': 'hidden'
    });
});

function closeSmallDialogBox() {
    $('#smallDialogBoxHolder').css('visibility', 'hidden');
    dialogAmountArea.css('visibility', 'hidden');
    dialogTextArea.css('visibility', 'hidden');
    dialogAmountArea.val(1);
    transferAmount = 1;
    $('#superBlocker').css('visibility', 'hidden');
    $('#superBlocker').css('pointer-events', 'none');
    $('#guiHolder #shopHolder div').css('pointer-events', 'auto');
    smallDialogBoxOpen = false;
}

$('.easyItem').click(function(e) {
    if (!$(e.currentTarget).hasClass('easySelected')) {
        $('.easySelected').removeClass('easySelected');
        $(e.currentTarget).addClass('easySelected');
    }
    else {
        $('.easySelected').removeClass('easySelected');
    }
});

$('.statButton').click(function(e) {
    allocatedStat = $(this).attr('stat');
    character.stats[allocatedStat] ++;
    character.info.attributePoints --;
    updateCharacterDisplay();
});

$('#shopHolder .guiInnerContentArea .closeButton').click(function() {
    somethingIsOpen = false;
    guiClose(guiIDs[0]);
    playSound(sounds[5]); // MenuUp.mp3
    $('#guiHolder').css('top', 'calc(50% - 400px)');
    $('#guiHolder').css('left', 'calc(50% - 320px)');
});

$('#equipmentHolder .guiInnerContentArea .closeButton').click(function() {
    somethingIsOpen = false;
    guiClose(guiIDs[1]);
    playSound(sounds[5]); // MenuUp.mp3
    $('#guiHolder').css('top', 'calc(50% - 400px)');
    $('#guiHolder').css('left', 'calc(50% - 320px)');
});
