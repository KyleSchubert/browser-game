const skillsPerClass = {
    'Kaiser': [[61001000, 61001101, 61000003], [], [], [], [], []]
};

// I have to manually type these
var attackSkillVars = {
    structureExample: [['attackCount'], ['damage'], ['mobCount'], ['bulletCount']],
    61001000: [['attackCount', 'v', 'z'], ['damage', 'u', 'y'], ['mobCount', 's', 'w']],
    61001101: [['attackCount'], ['damage'], ['mobCount'], ['bulletCount']]
};

const attackSequences = {
    61001000: [[61001000,[283,167]], [61001004,[363,129]], [61001005,[335,209]]]
};

var passiveSkillVars = {
    structureExample: {'pddX': 'defense', 'w': 'targetSkill', 'p': 'attCountX'},
    61000003: {'pddX': 'defense'}
};

const classSkills = {
    61001000: {
        className: 'Kaiser',
        skillName: 'Dragon Slash',
        tier: 1,
        maxLevel: 25,
        type: 'attackSequence',
        mpCon: '0',
        ball: {},
        action: [['swingT3', 0, 90, [-1, 0]], ['swingT3', 1, 90, [-6, 0]], ['swingT3', 2, 90, [-7, 0]], ['swingT3', 2, 90, [-15, 0]], ['swingT3', 2, 90, [-15, 0]], ['swingT3', 2, 120, [-15, 0]]],
        delays: [90, 90, 90, 90],
        reuseWaitTime: 425,
        finalForm: {},
        hitDelays: [90, 90, 90, 90, 90, 90],
        hitDimensions: [187, 131],
        description: 'Mash the attack key to whip enemies in front of you up to 3 times. Can be used with basic attack key while in Final Form.',
        requirementText: 'Level 20 required to learn Dragon Slash I.',
        hitDescriptions: ['1-hit: Attack up to 8 enemies for {50+x}% damage 3 times', '2-hit: Up to 6 enemies attack for {30+x}% damage 5 times', '3-hit: Up to 6 enemies attack for {40+x}% damage 5 times', 'Final Form: Up to 8 enemies attack for {140+x}% damage 5 times, Up to 10 enemies attack 6 times after 4th job'],
        usedVariables: {'mpCon': '0', 'attackCount': '3', 'mobCount': '8', 'damage': '50+x', 'q2': '140+x', 's2': '5', 'u2': '10', 'v2': '6', 's': '6', 'u': '30+x', 'v': '5', 'w': '6', 'y': '40+x', 'z': '5', 'q': '8'},
        computedVars: {}
    },
    61001101: {
        className: 'Kaiser',
        skillName: 'Flame Surge',
        tier: 1,
        maxLevel: 25,
        type: 'ballEmitter',
        mpCon: '6+Math.ceil(x/5)',
        ball: {'ballDelay': 90, 'ballDelay1': 90, 'ballDelay2': 90},
        action: [['swingT1', 0, -90, [5, 0]], ['swingT1', 0, -120, [6, 0]], ['swingT1', 1, 90, [-37, 0]], ['swingT1', 2, 90, [-39, 0]], ['swingT1', 2, 90, [-40, 0]], ['swingT1', 2, 90, [-41, 0]]],
        delays: [210, 90, 90, 90, 90],
        reuseWaitTime: 507,
        finalForm: {},
        hitDelays: [90, 90, 90, 90, 90],
        hitDimensions: [124, 113],
        description: 'Blast forward with warrior spirit.',
        requirementText: '',
        hitDescriptions: ['MP Cost: {6+Math.ceil(x/5)}, Damage: {110+3*x}%, Number of Attacks: 2, Max Enemies Hit: 6'],
        usedVariables: {'mpCon': '6+Math.ceil(x/5)', 'attackCount': '2', 'mobCount': '6', 'damage': '110+3*x', 'bulletCount': '1'},
        computedVars: {}
    },
    61001002: {
        className: 'Kaiser',
        skillName: 'Air Lift',
        tier: 1,
        maxLevel: 15,
        type: 'jump',
        mpCon: '25-x',
        ball: {},
        delays: [60, 60, 60, 60, 60],
        reuseWaitTime: 267,
        finalForm: {},
        hitDelays: [],
        hitDimensions: [],
        description: 'Grants an increase to Speed and an extra mid-air jump.',
        requirementText: '',
        hitDescriptions: ['MP Cost: {25-x}, Set Jump Distance, Max Speed: +{5+x}, Speed: +{5+x}'],
        usedVariables: {'mpCon': '25-x', 'speedMax': '5+x', 'psdSpeed': '5+x'},
        computedVars: {}
    },
    61000003: {
        className: 'Kaiser',
        skillName: 'Scale Skin',
        tier: 1,
        maxLevel: 15,
        type: 'passive',
        mpCon: '0',
        ball: {},
        delays: [],
        reuseWaitTime: 0,
        finalForm: {},
        hitDelays: [],
        hitDimensions: [],
        description: 'Hardens your skin to permanently increase Defense and gain a chance resist knockback. Stacks with Transfiguration\'s Knockback Resistance effects.',
        requirementText: '',
        hitDescriptions: ['DEF: +{20*x}, Knockback Resistance: +{4*x}%'],
        usedVariables: {'mpCon': '0', 'pddX': '20*x', 'prop': '4*x'},
        computedVars: {}
    },
    61001004: {
        action: [['stabOF', 2, 90, [-2, 0]], ['stabOF', 2, 90, [-4, 0]], ['stabOF', 2, 90, [-6, 0]], ['stabOF', 2, 90, [-6, 0]], ['stabOF', 2, 90, [-6, 0]], ['stabOF', 2, 120, [-6, 0]]]
    },
    61001005: {
        action: [['swingTF', 2, 90, [6, 0]], ['swingTF', 3, 90, [2, 0]], ['swingTF', 3, 90, [1, 0]], ['swingTF', 3, 90, [1, 0]], ['swingTF', 3, 90, [1, 0]], ['swingTF', 3, 120, [1, 0]]]
    }
};
