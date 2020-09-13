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


//https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
$('.textTightContainer input').on('click', function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).val()).select();
    document.execCommand("copy");
    $temp.remove();
});