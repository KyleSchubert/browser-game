var moneyWord = 'doubloons';

var itemNames = {"1113095":"Forgotten Hero's Ring","1282027":"Ame-no-Uzume's Lucent Gauntlet","1282036":"Onyx Maple Lucent Gauntlet","1342111":"Arcane Umbra Katara","2000019":"Power Elixir","2046319":"Scroll for Accessory Magic ATT 15%","2870008":"Slime Familiar","2870021":"Orange Mushroom Familiar","4000001":"Orange Mushroom Cap","4000012":"Green Mushroom Cap"};



var knownItemNames = [1113095,1342111,2870021,2000019,4000001,1282036,1282027,2870008,2046319,4000012];



var knownItemImages = [1113095, 2046319, 1342098, 4000012, 2049117, 1342111, 1282027, 1412148, 4000001, 2870021, 4310100, 2043219, 4000097, 2870643, 1402266, 4021029, 1582026, 1282036, 2000000, 4000024, 2000019, 4021036, 2870008, 2590009, 2001003];



var itemsByType = {"Equip":{"Accessory":{"Ring":[1113095]},"One-Handed Weapon":{"Katara":[1342098,1342111],"Gauntlet":[1282027,1282036]},"Two-Handed Weapon":{"Arm Cannon":[1582026],"Two-Handed Sword":[1402266],"Two-Handed Axe":[1412148]}},"Use":{"Monster/Familiar":{"Familiar Card":[2870008,2870643,2870021]},"Weapon Scroll":{"One-Handed BW":[2043219]},"Special Scroll":{"Soul Weapon":[2590009],"Chaos Scroll":[2049117]},"Consumable":{"Potion":[2000000,2000019,2001003]},"Armor Scroll":{"Accessory":[2046319]}},"Etc":{"Crafting":{"Crafting Item":[4021029,4021036]},"Other":{"Coin":[4310100],"Monster Drop":[4000097,4000012,4000024]}}};



var itemsAndTheirTypes = {"1113095":["Equip","Accessory","Ring"],"1282027":["Equip","One-Handed Weapon","Gauntlet"],"1282036":["Equip","One-Handed Weapon","Gauntlet"],"1342098":["Equip","One-Handed Weapon","Katara"],"1342111":["Equip","One-Handed Weapon","Katara"],"1402266":["Equip","Two-Handed Weapon","Two-Handed Sword"],"1412148":["Equip","Two-Handed Weapon","Two-Handed Axe"],"1582026":["Equip","Two-Handed Weapon","Arm Cannon"],"2000000":["Use","Consumable","Potion"],"2000019":["Use","Consumable","Potion"],"2001003":["Use","Consumable","Potion"],"2043219":["Use","Weapon Scroll","One-Handed BW"],"2046319":["Use","Armor Scroll","Accessory"],"2049117":["Use","Special Scroll","Chaos Scroll"],"2590009":["Use","Special Scroll","Soul Weapon"],"2870008":["Use","Monster/Familiar","Familiar Card"],"2870021":["Use","Monster/Familiar","Familiar Card"],"2870643":["Use","Monster/Familiar","Familiar Card"],"4000001":["Etc","Other","Monster Drop"],"4000012":["Etc","Other","Monster Drop"],"4000024":["Etc","Other","Monster Drop"],"4000097":["Etc","Other","Monster Drop"],"4021029":["Etc","Crafting","Crafting Item"],"4021036":["Etc","Crafting","Crafting Item"],"4310100":["Etc","Other","Coin"]};



var validItemIDs = [1113095, 1342111, 1282036, 1282027, 2870008, 2870021, 2000019, 2046319, 4000001, 4000012, 4000097, 4000024, 1342098, 1582026, 1402266, 1412148, 4021029, 4021036, 4310100, 2001003, 2000000, 2870643, 2590009, 2049117, 2043219];

var ITEM_REFERENCES = {
    "1113095": {name: "I don't know"},
    "1342111": {name: "I don't know"},
    "1282036": {name: "I don't know"},
    "1282027": {name: "I don't know"},
    "2870008": {name: "I don't know"},
    "2870021": {name: "I don't know"},
    "2000019": {name: "I don't know"},
    "2046319": {name: "I don't know"},
    "4000001": {name: "I don't know"},
    "4000012": {name: "I don't know"},
    "4000097": {name: "I don't know"},
    "4000024": {name: "I don't know"},
    "1342098": {name: "I don't know"},
    "1582026": {name: "I don't know"},
    "1402266": {name: "I don't know"},
    "1412148": {name: "I don't know"}
}