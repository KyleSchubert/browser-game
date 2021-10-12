// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
    parent = $(parent);
    parent.empty();
}


// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#answer-2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


// me
function getLatestStuff() {
    $('#latest-itemData_itemNames').val(JSON.stringify(itemNames));
    $('#latest-itemData_knownItemNames').val(JSON.stringify(knownItemNames));
    $('#latest-itemData_knownItemImages').val(JSON.stringify(knownItemImages));
    $('#latest-itemData_itemsByType').val(JSON.stringify(itemsByType));
    $('#latest-itemData_itemsAndTheirTypes').val(JSON.stringify(itemsAndTheirTypes));
    $('#latest-itemData_equipmentStats').val(JSON.stringify(equipmentStats));
    console.log('It ran.');
}

// me
function checkForProblems() {
    // problems with item prices
    resultList = [];
    problematicIDs = [];
    validItemIDs.forEach(function(id) {
        if (!(id in shopWorths)) {
            if (!resultList.includes('missing item worths')) {
                resultList.push('missing item worths');
            }
            problematicIDs.push(id);
        }
    });
    result = organizeResultList(resultList);
    console.warn('From "problemsWithItemPrices": ' + JSON.stringify(problematicIDs));
    // problems with item names
    resultList = [];
    problematicIDs = [[], []];
    validItemIDs.forEach(function(id) {
        if (!(knownItemNames.includes(id))) {
            if (!resultList.includes('missing id in knownItemNames')) {
                resultList.push('missing id in knownItemNames');
            }
            problematicIDs[0].push(id);
        }
    });
    knownItemNames.forEach(function(id) {
        if (!(id in itemNames)) {
            if (!resultList.includes('missing item name in itemNames')) {
                resultList.push('missing item name in itemNames');
            }
            problematicIDs[1].push(id);
        }
    });
    result = organizeResultList(resultList);
    if (problematicIDs[0].length || problematicIDs[1].length) {
        console.warn('From "problemsWithItemNames": ' + JSON.stringify(problematicIDs));
    }
}
$(document).ready(checkForProblems());

// me
function organizeResultList(results) {
    if (results.length > 0) {
        result = '⚠️ ';
        for (let i = 0; i < results.length; i++) {
            if (i == 0) {
                result = result + results[0].charAt(0).toUpperCase() + results[0].slice(1);
            }
            else {
                result = result + ', ' + results[i];
            }
        };
        result = result + '. The problematic itemIDs are in the console. ⚠️';
    }
    else {
        result = '🟢 All good 🟢';
    }
    return result;
}

// https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
$('.textTightContainer input').on('click', function() {
    const $temp = $('<input>');
    $('body').append($temp);
    $temp.val($(this).val()).select();
    document.execCommand('copy');
    $temp.remove();
});

// me
function doNothing() {
    return;
}

// https://stackoverflow.com/questions/16868122/mousemove-very-laggy/29276058#answer-29263341    with some tweaks but it's practically the same
var SQUAREposX; var SQUAREposY;
$('body').mousemove(FollowSquare);
function FollowSquare(e) {
    e.preventDefault();
    SQUAREposX = e.pageX-14;
    SQUAREposY = e.pageY-14;
    window.requestAnimationFrame(showBigImg);
}
function showBigImg() {
    $('#draggedItemHolder').css({
        '-webkit-transform': 'translateX(' + SQUAREposX + 'px) translateY(' + SQUAREposY + 'px)',
        'transform': 'translateX(' + SQUAREposX + 'px) translateY(' + SQUAREposY + 'px)'
    });
}

// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript#answer-7228322
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
