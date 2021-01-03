$('.guiOpeningButton').click(function() {
    guiType = guiGetType(this);
    guiToggleVisibility(guiType, this.getAttribute('value'))
});

guiIDs = ['#shopHolder'];
$('body').keydown(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        if (smallDialogBoxOpen) {
            closeSmallDialogBox()
            if (weAreCurrentlySelling) {
                resetSellProcess()
            }
            if (dialogMainReason == 'too expensive') {
                playSound(sounds[5])
            }
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

$('body').keydown(function(e) {
    if (e.key === "Enter") {
        if (smallDialogBoxOpen) {
            dialogProceed()
        }
    }
})

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
        guiLoadData(guiType, guiID) // this has to happen first!
        $(target).css('visibility', 'visible');
        playSound(sounds[6]) // Tab.mp3
    }
    else {
        $(target).css('visibility', 'hidden');
        playSound(sounds[5]) // MenuUp.mp3
    }
}

function silentToggleVisibility(node) { //jquery version of the node
    if (node.css('visibility') == 'hidden'){
        $(node).css('visibility', 'visible');
        return true // as in: "is it visible?" --> "yes"
    }
    else {
        $(node).css('visibility', 'hidden');
        return false // as in: "is it visible?" --> "no"
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
    $('#smallDialogBoxHolder').css('visibility', 'hidden')
    dialogAmountArea.css('visibility', 'hidden')
    dialogTextArea.css('visibility', 'hidden')
    dialogAmountArea.val(1)
    transferAmount = 1;
    $('#superBlocker').css('visibility', 'hidden')
    $('#superBlocker').css('pointer-events', 'none')
    $('#guiHolder #shopHolder div').css('pointer-events', 'auto')
    smallDialogBoxOpen = false;
}

$('.easyItem').click(function(e) {
    if (!$(e.currentTarget).hasClass('easySelected')) {
        $('.easySelected').removeClass('easySelected')
        $(e.currentTarget).addClass('easySelected')
    }
    else {
        $('.easySelected').removeClass('easySelected')
    }
});