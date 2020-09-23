$('.guiOpeningButton').click(function() {
    guiType = guiGetType(this);
    guiToggleVisibility(guiType, this.getAttribute('value'))
});

guiIDs = ['#shopHolder'];
$('body').keydown(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        if (smallDialogBoxOpen) {
            $('#smallDialogBoxHolder').css('visibility', 'hidden')
        }
        else {
            guiIDs.forEach(guiClose)
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
    }
    else {
        $(target).css('visibility', 'hidden');
    }
}

function guiClose(target) { //all of them
    $(target).css('visibility', 'hidden');
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