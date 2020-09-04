$('.guiOpeningButton').click(function() {
    guiType = guiGetType(this);
    guiToggleVisibility(guiType)
    guiLoadData(guiType)
});

guiIDs = ['#shopHolder'];
$('body').keydown(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        guiIDs.forEach(guiClose)
    }
});

$(function() {
    $('#guiHolder').draggable({handle: '* .draggableBar'});
    $('#guiHolder').draggable({cancel: '* .guiInnerContentArea'});
    //$().disableSelection();
} );

guiTypes = {
    80001: 'shop'
}

shopInventories = {

}

function guiGetType(node) {
    return guiTypes[node.getAttribute('value')]
}

function guiToggleVisibility(guiType) {
    if (guiType == 'shop') {   
        target = guiIDs[0];
    }
    else {
        console.log('big bug big smile');
    }
    if ($(target).css('visibility') == 'hidden') {
        $(target).css('visibility', 'visible');
    }
    else {
        $(target).css('visibility', 'hidden');
    }
}

function guiClose(target) { //all of them
    $(target).css('visibility', 'hidden');
}

function guiLoadData(guiType) {
    if (guiType == 'shop'){
        // do something
        console.log('function guiLoadData is incomplete, obviously')
    }
    else {
        console.log('big bug big smile');
    }
}