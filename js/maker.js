// Starts chosen support on the menus
$(() => {
    $('.chosen-select').chosen();
    $('.chosen-select').on('change', function(evt, params) {
        chosenLoadNextOptions(evt, params);
    });
});

// loads different things in the next chosen-select thing based on the current changed one
var chosenInitialCategory = '';
var chosenIsEquipment = false;
var chosenTopSelected = {};
var chosenMiddleOneSelected = {};
var chosenMiddleTwoSelected = {};
function chosenLoadNextOptions(e, parameters) {
    targetSelectArea = parseInt(e.currentTarget.getAttribute('data-index')) + 1;
    let optionsToAdd = [];
    let target = {};
    if (targetSelectArea == 1) {
        $('.chosen-select').eq(1).empty();
        $('.chosen-select').eq(1).trigger('chosen:updated');
        $('.chosen-select').eq(2).empty();
        $('.chosen-select').eq(2).trigger('chosen:updated');
        chosenIsEquipment = false;
        switch (parameters.selected) {
            case 'Items - Equip':
                target = itemsByType['Equip'];
                Object.keys(target).forEach(function(value) {
                    Object.keys(target[value]).forEach(function(value2) {
                        optionsToAdd.push([value2, 0]);
                    });
                });
                chosenInitialCategory = 'Items';
                chosenIsEquipment = true;
                break;
            case 'Items - Use':
                target = itemsByType['Use'];
                Object.keys(target).forEach(function(value) {
                    Object.keys(target[value]).forEach(function(value2) {
                        optionsToAdd.push([value2, 0]);
                    });
                });
                chosenInitialCategory = 'Items';
                break;
            case 'Items - Etc':
                target = itemsByType['Etc'];
                Object.keys(target).forEach(function(value) {
                    Object.keys(target[value]).forEach(function(value2) {
                        optionsToAdd.push([value2, 0]);
                    });
                });
                chosenInitialCategory = 'Items';
                break;
            case 'Mobs':
                target = knownMobs;
                optionsToAdd = target; // this could probably be made better later
                chosenInitialCategory = 'Mobs';
                break;
        }
        chosenTopSelected = target;
    }
    else if (targetSelectArea == 2) {
        $('.chosen-select').eq(2).empty();
        $('.chosen-select').eq(2).trigger('chosen:updated');
        Object.keys(chosenTopSelected).forEach(function(value) {
            if (Object.keys(chosenTopSelected[value]).includes(parameters.selected)) {
                chosenMiddleOneSelected = value;
                chosenMiddleTwoSelected = parameters.selected;
            }
        });
        switch (chosenInitialCategory) {
            case 'Items':
                if (chosenIsEquipment) {
                    chosenTopSelected[chosenMiddleOneSelected][chosenMiddleTwoSelected].forEach(function(value) {
                        optionsToAdd.push([''.concat('[LVL ', equipmentStats[value]['reqLevelEquip'], '] ', itemNames[value]), value]);
                    });
                }
                else {
                    chosenTopSelected[chosenMiddleOneSelected][chosenMiddleTwoSelected].forEach(function(value) {
                        optionsToAdd.push([itemNames[value], value]);
                    });
                }
                break;
        }
    }
    else if (targetSelectArea == 3) { // there is no fourth dropdown select thing. just gotta set the image
        // NOW we can set the makerVisual
        $('#makerVisual img').attr('src');
        console.log(parameters);
        if (chosenInitialCategory == 'Mobs') {
            let name = parameters.selected.toLowerCase();
            $('#makerVisual img').attr('src', './mob/alive/' + name + '.gif');
            makerLoadTheEditor(name, 'Mobs');
        }
        else if (chosenInitialCategory == 'Items') {
            itemImageSetup(parameters.selected, setMakerVisualPartTwo);
            makerLoadTheEditor(parameters.selected, 'Items');
        }
    }
    $('.chosen-select').eq(targetSelectArea).empty();
    optionsToAdd.forEach(function(value) {
        if (value[1] == 0) {
            $('.chosen-select').eq(targetSelectArea).append('<option>' + value[0] + '</option>');
        }
        else {
            $('.chosen-select').eq(targetSelectArea).append('<option value="' + value[1].toString() + '">' + value[0] + '</option>');
        }
    });
    $('.chosen-select').eq(targetSelectArea).trigger('chosen:updated');
}

function setMakerVisualPartTwo(img) {
    $('#makerVisual img').replaceWith(img);
    return;
}

function makerEditorFixed(text) {
    let span = document.createElement('span');
    span.classList = ['makerEditorFixed'];
    span.innerHTML = text.toString();
    return span;
}

function makerEditorLinkedData(key, value, dictionary) {
    let div = document.createElement('div');
    div.classList = ['makerEditorLinkedData'];
    let span = document.createElement('span');
    span.innerHTML = key.toString();
    let input = document.createElement('input');
    $(input).val(value);
    div.append(span);
    div.append(input);
    return div;
}

function makerEditorLinkedDataTable(dictionary) {
    let keys = Object.keys(dictionary);
    let elementsToAppend = [];
    keys.forEach(function(key) {
        elementsToAppend.push(makerEditorLinkedData(key, dictionary[key], dictionary));
    });
    let div = document.createElement('div');
    div.classList = ['makerEditorLinkedDataTable'];
    elementsToAppend.forEach(function(element) {
        div.append(element);
    });
    return div;
}

function makerLoadTheEditor(id, overallType) { // id can be an itemID or a mobID as of right now
    let elementsToAppend = [];
    $('#makerDataArea').empty();
    switch (overallType) { // there will probably be more than just 2
        case 'Items':
            // Name non-changeable
            if (knownItemNames.includes(parseInt(id))) {
                elementsToAppend.push(makerEditorFixed(itemNames[id]));
            }
            else {
                elementsToAppend.push(makerEditorFixed('Unknown Item Name'));
            }
            // ID non-changeable
            elementsToAppend.push(makerEditorFixed(''.concat('ID: ', id)));
            // item types non-changeable
            if (Object.keys(itemsAndTheirTypes).includes(id)) {
                elementsToAppend.push(makerEditorFixed(itemsAndTheirTypes[id]));
                // Stats changeable:linked   table of keys and values
                switch (itemsAndTheirTypes[id][0]) {
                    case 'Equip':
                        elementsToAppend.push(makerEditorLinkedDataTable(equipmentStats[id]));
                        break;
                    case 'Use':
                        break;
                    case 'Etc':
                        break;
                }
            }
            else {
                elementsToAppend.push(makerEditorFixed('Unknown Item Types'));
            }
            // value in shop changeable:linked   value
            if (Object.keys(shopWorths).includes(id)) {
                elementsToAppend.push(makerEditorLinkedData('shopWorth', shopWorths[id], shopWorths));
            }
            else {
                elementsToAppend.push(makerEditorFixed('Unset shopWorths - set manually'));
            }
            break;
        case 'Mobs':
            // not there yet
            break;
    }
    elementsToAppend.forEach(function(element) {
        $('#makerDataArea').append(element);
    });
}
