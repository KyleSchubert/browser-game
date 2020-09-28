$('.guiOpeningButton').click(function() {
    guiType = guiGetType(this);
    guiToggleVisibility(guiType, this.getAttribute('value'))
});

guiIDs = ['#shopHolder'];
$('body').keydown(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        if (smallDialogBoxOpen) {
            closeSmallDialogBox()
        }
        else {
            guiIDs.forEach(guiClose)
            if (somethingWasClosed) {
                playSound(sounds[5])
                somethingWasClosed = false;
            }
        }
    }
});

$(function() {
    $('#guiHolder').draggable({handle: '#shopHolder .draggableBar'});
    $('#guiHolder').draggable({cancel: '#shopHolder .guiInnerContentArea'});
    $('#guiHolder').draggable({containment: 'window'});
    $('#smallDialogBoxHolder').draggable({handle: '.draggableBar'})
    $('#smallDialogBoxHolder').draggable({cancel: '.smallDialogBox'})
    $('#smallDialogBoxHolder').draggable({containment: '#guiHolder'})
    //$().disableSelection();
} );

guiTypes = {
    80001: 'shop'
}


function guiGetType(node) {
    return guiTypes[node.getAttribute('value')]
}

function guiToggleVisibility(guiType, guiID) {
    if (guiType == 'shop') {   
        target = guiIDs[0];
    }
    else {
        console.log('big bug big smile');
    }
    if ($(target).css('visibility') == 'hidden') {
        guiLoadData(guiType, guiID)
        $(target).css('visibility', 'visible');
        playSound(sounds[6]) // Tab.mp3
    }
    else {
        $(target).css('visibility', 'hidden');
        playSound(sounds[5]) // MenuUp.mp3
    }
}

function guiClose(target) { //all of them
    if ($(target).css('visibility') == 'visible') {
        somethingWasClosed = true;
        $(target).css('visibility', 'hidden');
    }
}

function guiLoadData(guiType, id) {
    if (guiType == 'shop') {
        shopLoad(id)
    }
    else {
        console.log('big bug big smile');
    }
}

$('.textTightContainer').on('mousemove', function(event) {
    $(event.currentTarget).children('.textTooltip').css({
        'left': event.pageX +6,
        'top': event.pageY +6,
        'visibility': 'visible'
    });
});
$('.textTightContainer').on('mouseleave', function(event) {
    $(event.currentTarget).children('.textTooltip').css({
        'visibility': 'hidden'
    });
});

function closeSmallDialogBox() {
    $('#smallDialogBoxHolder').css('visibility', 'hidden')
    $('#superBlocker').css('visibility', 'hidden')
    $('#superBlocker').css('pointer-events', 'none')
    $('#guiHolder #shopHolder div').css('pointer-events', 'auto')
    smallDialogBoxOpen = false;
}