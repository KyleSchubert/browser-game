var isSomethingBeingDragged = false;
var isSellBoxReady = false;
var currentDraggedPARENT = '';

var itemBeingSold = '';
var itemBeingSoldCount = 0;
var itemBeingSoldId = 0;

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
                if (isSellBoxReady) { // THEY MUST BE TRYING TO SELL THE ITEM
                    itemBeingSoldCount = $(this).children('.itemCount').html();
                    if (!itemBeingSoldCount) {
                        itemBeingSoldCount = 1; // as in how many are in the dragged pile of items. NOT how many are they deciding to sell from that pile
                    }
                    itemBeingSoldId = $(this).children('.item').val();
                    itemBeingSold = this;
                    sellProcess()
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

var dialogAmountAreaAutoUpdateText = false; // self-explanatory
var dialogAmountAreaWhatAreWeDoing = ''; // used to keep track of what the dialog amount area is updating for
var dialogMainReason = ''; // used when the reason can't easily be given as an input to the function
var dialogSubReason = ''; // used typically with the above variable
function dialogTrigger(reason) {
    dialogPrepare(reason);
    dialogShow(reason)
}

var smallDialogBoxOpen = false;
function dialogShow(reason) {
    playSound(sounds[3])
    dialogMainReason = reason;
    if (reason == 'shop') {
        smallDialogBoxOpen = true;
        $('#smallDialogBoxHolder').css('visibility', 'visible')
        $('#superBlocker').css('visibility', 'visible')
        $('#superBlocker').css('pointer-events', 'auto')
        $('#guiHolder #shopHolder div').css('pointer-events', 'none')
    }
}

function dialogPrepare(reason) {
    prepareAmountInitialValue()
    prepareAmountRange()
    dialogPrepareText(reason)
    if (reason == 'shop') {
        if ((!weAreCurrentlySelling && itemsAndTheirTypes[shopGetItemId()][0] == 'Equip') || (weAreCurrentlySelling && inventory.readyName() == 'Equip')) {
            silentToggleVisibility(dialogTextArea)
        }
        else {
            silentToggleVisibility(dialogAmountArea)
            silentToggleVisibility(dialogTextArea)
        }
        
    }
}

const dialogTextArea = $('#smallTextArea');
const dialogAmountArea = $('#smallAmountArea');
var transferAmount = 1;
function dialogPrepareText(reason) {
    text = [];
    if (reason == 'shop') {
        dialogAmountAreaAutoUpdateText = true;
        dialogAmountAreaWhatAreWeDoing = 'shop';
        card = $('.selectedThing')[0];
        if (weAreCurrentlySelling) {
            dialogSubReason = 'sell';
            text.push('Would you like to sell')
            itemName = itemNames[itemBeingSoldId].toString();
            itemPrice = shopWorths[itemBeingSoldId].toString();
        }
        else {
            dialogSubReason = 'buy';
            text.push('Would you like to purchase')
            itemName = $(card).find('.itemCardName').text();
            itemPrice = $(card).find('.itemCardPrice').text();
        }
        text.push('<strong>' + numberWithCommas(transferAmount) + 'x</strong>')
        text.push('<strong>' + itemName + '</strong>')
        itemPrice = parseInt(itemPrice.replace(/,/g, ''), 10); // https://stackoverflow.com/questions/4083372/in-javascript-jquery-what-is-the-best-way-to-convert-a-number-with-a-comma-int#answer-4083378
        itemPrice = numberWithCommas(itemPrice*transferAmount);
        text.push('for ' + itemPrice + ' ' + moneyWord + '?')
    }
    dialogSetText(text)
}

const originalAmountMinimum = 1;
const originalAmountMaximum = 9999;
var amountMinimum = originalAmountMinimum;
var amountMaximum = originalAmountMaximum;
function prepareAmountRange() {
    if ((!weAreCurrentlySelling && itemsAndTheirTypes[shopGetItemId()][0] == 'Equip') || (weAreCurrentlySelling && inventory.readyName() == 'Equip')) { // I guess this is a backup if i'm already hiding the input
        amountMinimum = originalAmountMinimum;
        amountMaximum = originalAmountMinimum;
    }
    else {
        amountMinimum = originalAmountMinimum;
        if (shopGetStock()) {
            amountMaximum = shopGetStock()
        }
        else {   
            amountMaximum = originalAmountMaximum;
        }
    }
}

var amountInitialValue = 1;
function prepareAmountInitialValue() {
    if (weAreCurrentlySelling) {
        if (inventory.readyName() == 'Equip') {
            amountInitialValue = 1;
        }
        else {
            amountInitialValue = parseInt(itemBeingSold.children[1].innerHTML);
        }
    }
    else {
        amountInitialValue = 1;
    }
    amountSetInitialValues()
}

function amountSetInitialValues(value=amountInitialValue) { // separated just in case I wanna do something with the fact that it's separated later
    $('#smallAmountArea').val(value)
    transferAmount = value;
}

$('#smallAmountArea').on('input', function() {
    checkItFirst = dialogAmountArea.val().replace(/\D+/g, ''); // https://stackoverflow.com/questions/6649327/regex-to-remove-letters-symbols-except-numbers#answer-6649350
    if (checkItFirst) {
        if (amountMinimum <= checkItFirst) {
            if (checkItFirst <= amountMaximum) {
                transferAmount = checkItFirst;
            }
            else { transferAmount = amountMaximum; }
        }
        else { transferAmount = amountMinimum; }
    }
    else { transferAmount = amountMinimum; }
    if (dialogAmountAreaAutoUpdateText) {
        dialogPrepareText(dialogAmountAreaWhatAreWeDoing)
    }
});

function dialogSetText(t) {
    area = $('#smallTextArea span');
    $(area).html(t.join('<br>')) 
}

function dialogCancel() {
    closeSmallDialogBox()
    resetSellProcess()
}

function dialogProceed() {
    $('#smallAmountArea').val(transferAmount)
    if (dialogMainReason == 'shop') {
        if (dialogSubReason == 'buy') {
            transferIt(true)
        }
        else if (dialogSubReason == 'sell') {
            transferIt(false)
            secondPartOfSellProcess()
        }
    }
    closeSmallDialogBox()
    playSound(sounds[2])
}