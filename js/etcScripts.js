// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#answer-2901298
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// me
function getLatestStuff() {
    $("#latest-itemData_itemNames").val(JSON.stringify(itemNames))
    $("#latest-itemData_knownItemNames").val(JSON.stringify(knownItemNames))
    $("#latest-itemData_knownItemImages").val(JSON.stringify(knownItemImages))
    $("#latest-itemData_itemsByType").val(JSON.stringify(itemsByType))
    $("#latest-itemData_itemsAndTheirTypes").val(JSON.stringify(itemsAndTheirTypes))
    console.log('It ran.')
}

// me
function checkForProblems() {
    // problems with item prices
    resultList = [];
    problematicIDs = [];
    validItemIDs.forEach(function(id) {
        if (!(id in shopWorths)) {
            if (!resultList.includes('missing item worths')) {
                resultList.push('missing item worths')
            }
            problematicIDs.push(id)
        }
    });
    result = organizeResultList(resultList)
    $("#problemsWithItemPrices").val(result)
    console.log('From "problemsWithItemPrices": ' + JSON.stringify(problematicIDs))
    // problems with item names
    resultList = [];
    problematicIDs = [[],[]];
    validItemIDs.forEach(function(id) {
        if (!(id in knownItemNames)) {
            if (!resultList.includes('missing id in knownItemNames')) {
                resultList.push('missing id in knownItemNames')
            }
            problematicIDs[0].push(id)
        }
    });
    knownItemNames.forEach(function(id) {
        if (!(id in itemNames)) {
            if (!resultList.includes('missing item name in itemNames')) {
                resultList.push('missing item name in itemNames')
            }
            problematicIDs[1].push(id)
        }
    });
    result = organizeResultList(resultList)
    $("#problemsWithItemNames").val(result)
    console.log('From "problemsWithItemNames": ' + JSON.stringify(problematicIDs))
}
$(document).ready(checkForProblems())

// me
function organizeResultList(results) {
    if (results.length > 0) {
            result = '⚠️ ';
        for (var i = 0;  i < results.length; i++) {
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
    return result
}

//https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
$('.textTightContainer input').on('click', function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).val()).select();
    document.execCommand("copy");
    $temp.remove();
});