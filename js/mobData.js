/* eslint-disable */
var knownMobs = ['tino', 'orange mushroom', 'mushmom', 'mutant ribbon pig'];

// found using   http://gifduration.konstochvanligasaker.se/     (these are in milliseconds)
var mobDeathDuration = {'tino': 1560, 'orange mushroom': 660, 'mushmom': 1100, 'mutant ribbon pig': 2160};
var mobMoveDuration = {'tino': 750, 'orange mushroom': 480, 'mushmom': 1200, 'mutant ribbon pig': 960};

var mobAliveFrameDurations = {'mushmom': [250], 'mutant ribbon pig': [180, 180, 180, 180, 180, 180], 'orange mushroom': [180, 180], 'tino': [210, 210, 210, 210]};
var mobDeadFrameDurations = {'mushmom': [200, 150, 150, 150, 150, 300], 'mutant ribbon pig': [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120], 'orange mushroom': [180, 180, 300], 'tino': [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]};
var mobMoveFrameDurations = {'mutant ribbon pig': [120, 120, 120, 120, 120, 120, 120, 120], 'orange mushroom': [180, 120, 180], 'tino': [0, 150, 150, 150, 150, 100], 'mushmom': [500, 100, 100, 300, 100, 100]};
var mobDimensions = {'mushmom.png': {'alive': [119, 110], 'dead': [202, 142], 'move': [121, 203]}, 'mutant ribbon pig.png': {'alive': [153, 155], 'dead': [232, 163], 'move': [163, 152]}, 'orange mushroom.png': {'alive': [63, 61], 'dead': [63, 59], 'move': [65, 76]}, 'tino.png': {'alive': [33, 34], 'dead': [74, 36], 'move': [37, 41]}};

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