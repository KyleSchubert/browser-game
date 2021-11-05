/* eslint-disable */
var knownMobs = ['tino', 'orange mushroom', 'mushmom', 'mutant ribbon pig'];

// found using   http://gifduration.konstochvanligasaker.se/     (these are in milliseconds)
var mobDeathDuration = {'tino': 1560, 'orange mushroom': 660, 'mushmom': 1100, 'mutant ribbon pig': 2160};

var mobDropPools = {
   'tino': ['sub10Gear'],
   'orange mushroom': ['10Gear'],
   'mushmom': ['30Gear'],
   'mutant ribbon pig': ['110Gear'] 
};

var dropPoolDefinitions = {
    'sub10Gear': getEquipmentByLevel(1, 9),
    '10Gear': getEquipmentByLevel(10, 18),
    '20Gear': getEquipmentByLevel(18, 29),
    '30Gear': getEquipmentByLevel(30, 39),
    '110Gear': getEquipmentByLevel(110, 119)
};