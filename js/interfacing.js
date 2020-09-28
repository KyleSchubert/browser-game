var isSomethingBeingDragged = false;
var isSellBoxReady = false;

function makeDraggableItemsDraggable() {
    $(function () {
        $('.draggableItem').draggable({
            start: function(event) {
                $(event.currentTarget).css('zIndex', 6)
                isSomethingBeingDragged = true;
                $(event.currentTarget).css('pointer-events', 'none')
            },
            stop: function(event) {
                $(this).css('zIndex', 'auto')
                isSomethingBeingDragged = false;
                $(this).css('pointer-events', 'auto')
                if (isSellBoxReady) {
                    sellProcess($(this).children('.itemCount').html(), $(this).children('.item').val(), this)
                }
                else {
                    $(this).css('left', '0px')
                    $(this).css('top', '0px')
                }
            },
            containment: 'window'
        });
    });
}


$('.sellArea').on('mousemove', function(event) {
    if (isSomethingBeingDragged) { // someone wants to sell something
        prepareSellBox(event, 1)
    }
    else { // they don't :^(
        prepareSellBox(event, 0)
    }
});

$('.sellArea').on('mouseleave', function(event) {
    prepareSellBox(event, 0)
})

const originalSellAreaBackgroundColor = $('.sellArea').css('background-color');
function prepareSellBox(event, yes) {
    if (yes) {
        isSellBoxReady = true;
        $(event.delegateTarget).css('background-color', 'rgb(218, 218, 218')
        $(event.delegateTarget).children('.beforeSellText1').css('visibility', 'hidden')
        $(event.delegateTarget).children('.beforeSellText2').css('visibility', 'hidden')
    }
    else {
        isSellBoxReady = false;
        $(event.delegateTarget).css('background-color', originalSellAreaBackgroundColor)
        $(event.delegateTarget).children('.beforeSellText1').css('visibility', 'inherit')
        $(event.delegateTarget).children('.beforeSellText2').css('visibility', 'inherit')
    }
}

function addSelectionListener(node) {
    $(node).mousedown(function(event) {
        if ($('.selectedThing')[0]) {
            if ($('.selectedThing')[0] == $(this)[0]) {
                if ($(this).parent()[0].classList.contains('shopItemArea')) {
                    triggerDialog('shop')
                }
            }
            $('.selectedThing')[0].classList.remove('selectedThing')
        }
        this.classList.add('selectedThing')
    })
}

var smallDialogBoxOpen = false;
function triggerDialog(reason) {
    playSound(sounds[3])
    if (reason == 'shop') {
        smallDialogBoxOpen = true;
        $('#smallDialogBoxHolder').css('visibility', 'visible')
        $('#superBlocker').css('visibility', 'visible')
        $('#superBlocker').css('pointer-events', 'auto')
        $('#guiHolder #shopHolder div').css('pointer-events', 'none')
    }
}

function dialogCancel() {
    closeSmallDialogBox()
}

function dialogProceed() {
    closeSmallDialogBox()
    playSound(sounds[2])
}