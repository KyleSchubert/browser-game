var isSomethingBeingDragged = false;
var isSellBoxReady = false;
var currentDraggedPARENT = '';

function makeDraggableItemsDraggable() {
    $(function () {
        $('.draggableItem').draggable({
            start: function(event) {
                $(event.currentTarget).css('visibility', 'hidden')
                $('#draggedItemHolder').css('visibility', 'visible')
                isSomethingBeingDragged = true;
                $(event.currentTarget).css('pointer-events', 'none')
                imgLink = $(event.currentTarget).children('img').attr('src');
                $('#draggedItemHolder').children('img').attr('src', imgLink);
            },
            stop: function(event) {
                $('#draggedItemHolder').css('visibility', 'hidden')
                $(this).css('visibility', 'visible')
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
                    dialogTrigger('shop')
                }
            }
            $('.selectedThing')[0].classList.remove('selectedThing')
        }
        this.classList.add('selectedThing')
    })
}

var smallDialogBoxOpen = false;
function dialogTrigger(reason) {
    dialogPrepare(reason);
    playSound(sounds[3])
    if (reason == 'shop') {
        smallDialogBoxOpen = true;
        $('#smallDialogBoxHolder').css('visibility', 'visible')
        $('#superBlocker').css('visibility', 'visible')
        $('#superBlocker').css('pointer-events', 'auto')
        $('#guiHolder #shopHolder div').css('pointer-events', 'none')
    }
}

function dialogPrepare(reason) {
    text = [];
    if (reason == 'shop') {
        card = $('.selectedThing')[0];
        if ($(card).parent()[0].classList.contains('sellArea')) {
            sell = true;
            text.push('Would you like to sell')
        }
        else {
            sell = false;
            text.push('Would you like to purchase')
        }
        itemName = $(card).find('.itemCardName').text();
        text.push('<strong>' + itemName + '</strong>')
        itemPrice = $(card).find('.itemCardPrice').text();
        text.push('for ' + itemPrice + ' ' + moneyWord + '?')
    }
    dialogSetText(text)
}

function dialogSetText(t) {
    area = $('#smallTextArea span');
    $(area).html(t.join('<br>')) 
}

function dialogCancel() {
    closeSmallDialogBox()
}

function dialogProceed() {
    closeSmallDialogBox()
    playSound(sounds[2])
}