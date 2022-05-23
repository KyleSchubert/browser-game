const skillsPerClass = {
    'Kaiser': [[60000221, 60001217, 60001216], [61001000, 61001101, 61001002, 61000003], [61100009, 61101100, 61101101, 61101002, 61101004, 61100006, 61100007, 61100005, 61100008], [], [], []]
};

// I have to manually type these
var attackSkillVars = {
    structureExample: [['attackCount'], ['damage'], ['mobCount'], ['bulletCount']],
    61001000: [['attackCount', 'v', 'z'], ['damage', 'u', 'y'], ['mobCount', 's', 'w']],
    61001101: [['attackCount'], ['damage'], ['mobCount'], ['bulletCount']],
    61101100: [['attackCount'], ['damage'], ['mobCount']],
    61101101: [['attackCount'], ['damage'], ['mobCount']],
    61101002: [['attackCount'], ['damage'], ['bulletCount'], ['cooltime']]
};

const attackSequences = {
    61001000: [[61001000], [61001004], [61001005]]
};

var passiveSkillVars = {
    structureExample: {'pddX': 'defense', 'w': 'targetSkill', 'p': 'attCountX'},
    61000003: {'pddX': 'defense'},
    60000221: {},
    60001217: {'padX': 'physicalAttack'},
    60001216: {'pddX': 'defense'},
    61100009: {},
    61100008: {'padX': 'physicalAttack'},
    61100005: {'pddX': 'defense'},
    61100007: {'mhpR': 'maxHp', 'strX': 'strength'},
    61100006: {'mastery': 'mastery'}
};

var skillsThatGetEnhanced = {
    61001000: {
        61001000: {stats: {}, effects: 'CharLevel10effect', hit: 'CharLevel10hit0', hitDimensions: [237,131]},
        61100009: {stats: {'damageMult': 'damR'}, effects: 'CharLevel30effect', hit: 'CharLevel30hit0', hitDimensions: [237,131]}
    }
};

const classSkills = {
    60000221: {
        className: 'Kaiser',
        skillName: 'Transfiguration',
        maxLevel: 1,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Fill up your Morph Gauge in battle to transform into a more powerful being.',
        hitDescriptions: ['#cStage 1: #Attack Speed: +1, Speed: +5, Jump: +10, Power Stance Chance: 40%', '#cStage 2: #Attack Speed: +1, Speed: +10, Jump: +20, Power Stance Chance: 80%'],
        usedVariables: {'mpCon': '0'},
        computedVars: {}
    },
    60001217: {
        className: 'Kaiser',
        skillName: 'Realign: Attacker Mode',
        maxLevel: 1,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Switches from defensive to offensive mode. Passive enhancements increase at higher Job Advancements. Skill enhancements stack.',
        hitDescriptions: ['Attack Power: +5, Critical Rate: +3%, Boss Damage: +3%'],
        usedVariables: {'mpCon': '0', 'padX': '5', 'bdR': '3', 'cr': '3'},
        computedVars: {}
    },
    60001216: {
        className: 'Kaiser',
        skillName: 'Realign: Defender Mode',
        maxLevel: 1,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Switches from offensive to defensive mode. Passive enhancements increase at higher Job Advancements. Skill enhancements stack.',
        hitDescriptions: ['Defense: +200'],
        usedVariables: {'mpCon': '0', 'pddX': '200'},
        computedVars: {}
    },
    61001000: {
        className: 'Kaiser',
        skillName: 'Dragon Slash',
        maxLevel: 25,
        TYPE: 'attackSequence',
        mpCon: 0,
        effects: {'61001000CharLevel10effect': [[283, 167], [253, 126], [90, 90, 90, 90]], '61001000CharLevel100effect': [[349, 168], [264, 116], [90, 90, 90, 90]], '61001000CharLevel30effect': [[352, 170], [267, 118], [90, 90, 90, 90]], '61001000CharLevel60effect': [[349, 168], [264, 116], [90, 90, 90, 90]], '61001000effect': [[283, 167], [253, 126], [90, 90, 90, 90]]},
        LTRB: [-220, -80, 10, 30],
        action: [['swingT3', 0, 90, [-1, 0]], ['swingT3', 1, 90, [-6, 0]], ['swingT3', 2, 90, [-7, 0]], ['swingT3', 2, 90, [-15, 0]], ['swingT3', 2, 90, [-15, 0]], ['swingT3', 2, 120, [-15, 0]]],
        reuseWaitTime: 320,
        hit: [[237, 131], [90, 90, 90, 90, 90, 90]],
        description: 'Mash the attack key to whip enemies in front of you up to 3 times. Can be used with basic attack key while in Final Form.',
        requirementText: 'Level 20 required to learn Dragon Slash I.',
        hitDescriptions: ['1-hit: Attack up to 8 enemies for {50+x}% damage 3 times', '2-hit: Up to 6 enemies attack for {30+x}% damage 5 times', '3-hit: Up to 6 enemies attack for {40+x}% damage 5 times', 'Final Form: Up to 8 enemies attack for {140+x}% damage 5 times, Up to 10 enemies attack 6 times after 4th job'],
        usedVariables: {'mpCon': '0', 'attackCount': '3', 'mobCount': '8', 'damage': '50+x', 'q2': '140+x', 's2': '5', 'u2': '10', 'v2': '6', 's': '6', 'u': '30+x', 'v': '5', 'w': '6', 'y': '40+x', 'z': '5', 'q': '8'},
        computedVars: {}
    },
    61001004: {
        className: 'Kaiser',
        skillName: 'Dragon Slash',
        maxLevel: 25,
        TYPE: 'attackSequence',
        mpCon: 0,
        effects: {'61001004CharLevel10effect': [[363, 129], [247, 99], [90, 90, 90, 90]], '61001004CharLevel100effect': [[363, 133], [259, 104], [90, 90, 90, 90]], '61001004CharLevel30effect': [[369, 138], [261, 104], [90, 90, 90, 90]], '61001004CharLevel60effect': [[363, 133], [259, 104], [90, 90, 90, 90]], '61001004effect': [[363, 129], [247, 99], [90, 90, 90, 90]]},
        LTRB: [-220, -50, 10, 10],
        action: [['stabOF', 2, 90, [-2, 0]], ['stabOF', 2, 90, [-4, 0]], ['stabOF', 2, 90, [-6, 0]], ['stabOF', 2, 90, [-6, 0]], ['stabOF', 2, 90, [-6, 0]], ['stabOF', 2, 120, [-6, 0]]],
        reuseWaitTime: 320,
        hit: [[237, 131], [90, 90, 90, 90, 90, 90]],
        description: 'Mash the attack key to keep attacking enemies.',
        hitDescriptions: ['Damage: {30+x}%, Max Enemies Hit: 6, Max Hits: 5'],
        usedVariables: {'mpCon': '0', 'attackCount': '5', 'mobCount': '6', 'damage': '30+x'},
        computedVars: {}
    },
    61001005: {
        className: 'Kaiser',
        skillName: 'Dragon Slash',
        maxLevel: 20,
        TYPE: 'attackSequence',
        mpCon: 0,
        effects: {'61001005CharLevel10effect': [[335, 209], [278, 146], [90, 90, 90, 90]], '61001005CharLevel100effect': [[330, 216], [289, 147], [120, 120, 120, 120]], '61001005CharLevel30effect': [[335, 219], [292, 147], [120, 120, 120, 120]], '61001005CharLevel60effect': [[330, 216], [289, 147], [120, 120, 120, 120]], '61001005effect': [[335, 209], [278, 146], [90, 90, 90, 90]]},
        LTRB: [-225, -110, 10, 40],
        action: [['swingTF', 2, 90, [6, 0]], ['swingTF', 3, 90, [2, 0]], ['swingTF', 3, 90, [1, 0]], ['swingTF', 3, 90, [1, 0]], ['swingTF', 3, 90, [1, 0]], ['swingTF', 3, 120, [1, 0]]],
        reuseWaitTime: 320,
        hit: [[237, 131], [90, 90, 90, 90, 90, 90]],
        description: 'Mash the attack key to keep attacking enemies.',
        hitDescriptions: ['Damage: {40+x}%, Max Enemies Hit: 6, Max Hits: 5'],
        usedVariables: {'mpCon': '0', 'attackCount': '5', 'mobCount': '6', 'damage': '40+x'},
        computedVars: {}
    },
    61001101: {
        className: 'Kaiser',
        skillName: 'Flame Surge',
        maxLevel: 20,
        TYPE: 'ballEmitter',
        mpCon: '6+Math.ceil(x/5)',
        ball: {'61001101ball': [[104, 63], [40, 32], [120, 120, 120]]},
        effects: {'61001101effect': [[389, 295], [210, 176], [210, 90, 90, 90, 90]]},
        LTRB: [-400, -150, -80, 10],
        action: [['swingT1', 0, -90, [5, 0]], ['swingT1', 0, -120, [6, 0]], ['swingT1', 1, 90, [-37, 0]], ['swingT1', 2, 90, [-39, 0]], ['swingT1', 2, 90, [-40, 0]], ['swingT1', 2, 90, [-41, 0]]],
        reuseWaitTime: 507,
        hit: [[160, 130], [90, 90, 90, 90, 90]],
        description: 'Blast forward with warrior spirit.',
        hitDescriptions: ['MP Cost: {6+Math.ceil(x/5)}, Damage: {110+3*x}%, Number of Attacks: 2, Max Enemies Hit: 6'],
        usedVariables: {'mpCon': '6+Math.ceil(x/5)', 'attackCount': '2', 'mobCount': '6', 'damage': '110+3*x', 'bulletCount': '1'},
        computedVars: {}
    },
    61001002: {
        className: 'Kaiser',
        skillName: 'Air Lift',
        maxLevel: 15,
        TYPE: 'jump',
        mpCon: '25-x',
        effects: {'61001002effect': [[322, 119], [108, 103], [60, 60, 60, 60, 60]]},
        description: 'Grants an increase to Speed and an extra mid-air jump.',
        hitDescriptions: ['MP Cost: {25-x}, Set Jump Distance, Max Speed: +{5+x}, Speed: +{5+x}'],
        usedVariables: {'mpCon': '25-x', 'speedMax': '5+x', 'psdSpeed': '5+x'},
        computedVars: {}
    },
    61000003: {
        className: 'Kaiser',
        skillName: 'Scale Skin',
        maxLevel: 10,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Hardens your skin to permanently increase Defense and gain a chance resist knockback. Stacks with Transfiguration\'s Knockback Resistance effects.',
        hitDescriptions: ['DEF: +{20*x}, Knockback Resistance: +{4*x}%'],
        usedVariables: {'mpCon': '0', 'pddX': '20*x', 'prop': '4*x'},
        computedVars: {}
    },
    61100009: {
        className: 'Kaiser',
        skillName: 'Dragon Slash I',
        maxLevel: 2,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Enhances Dragon Slash\'s Attack Power. Required Skill: #cLevel 20 Dragon Slash#',
        requirementText: 'Level 2 required to learn Dragon Slash II.',
        hitDescriptions: ['Additional {20*x}% bonus to Dragon Slash damage'],
        usedVariables: {'mpCon': '0', 'damR': '20*x'},
        computedVars: {}
    },
    61101002: {
        className: 'Kaiser',
        skillName: 'Tempest Blades',
        maxLevel: 20,
        TYPE: 'flyingSwords',
        mpCon: '20+Math.ceil(x/2)',
        effects: {'61101002effect': [[196, 217], [120, 215], [60, 90, 90, 90, 90, 90, 90, 90, 90, 90]], '61101002effect0': [[168, 256], [83, 162], [60, 90, 90, 90, 90, 90, 90, 90, 90, 90, 60]]},
        LTRB: [-400, -400, 400, 200],
        particles: {
            dimensions: {'forceAtom2atom1endEff2': [113, 48], 'forceAtom2atom1parentAtom': [115, 58], 'forceAtom2atom1parentAtomAdd1effect': [71, 20], 'forceAtom2atom1startEff': [159, 86], 'forceAtom2atom2endEff2': [164, 65], 'forceAtom2atom2parentAtom': [164, 77], 'forceAtom2atom2parentAtomAdd1effect': [90, 54], 'forceAtom2atom2startEff': [179, 115], 'forceAtom2atom3endEff2': [265, 107], 'forceAtom2atom3parentAtom': [271, 139], 'forceAtom2atom3startEff': [229, 156], 'forceAtom2atom4endEff2': [265, 107], 'forceAtom2atom4parentAtom': [271, 139], 'forceAtom2atom4startEff': [229, 156]},
            origins: {'forceAtom2atom1endEff2': [52, 23], 'forceAtom2atom1parentAtom': [53, 28], 'forceAtom2atom1parentAtomAdd1effect': [71, 8], 'forceAtom2atom1startEff': [54, 41], 'forceAtom2atom2endEff2': [79, 31], 'forceAtom2atom2parentAtom': [79, 37], 'forceAtom2atom2parentAtomAdd1effect': [90, 27], 'forceAtom2atom2startEff': [12, 59], 'forceAtom2atom3endEff2': [123, 54], 'forceAtom2atom3parentAtom': [126, 70], 'forceAtom2atom3startEff': [43, 77], 'forceAtom2atom4endEff2': [110, 54], 'forceAtom2atom4parentAtom': [113, 70], 'forceAtom2atom4startEff': [43, 77]},
            delays: {'forceAtom2atom1endEff2': [60, 60, 60], 'forceAtom2atom1parentAtom': [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60], 'forceAtom2atom1parentAtomAdd1effect': [300], 'forceAtom2atom1startEff': [120, 120, 120, 120, 120, 120], 'forceAtom2atom2endEff2': [60, 60, 60], 'forceAtom2atom2parentAtom': [999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999], 'forceAtom2atom2parentAtomAdd1effect': [999, 999, 999, 999], 'forceAtom2atom2startEff': [120, 120, 120, 120, 120, 120], 'forceAtom2atom3endEff2': [120, 120], 'forceAtom2atom3parentAtom': [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120], 'forceAtom2atom3startEff': [120, 120, 120, 120, 120, 120], 'forceAtom2atom4endEff2': [120, 120], 'forceAtom2atom4parentAtom': [120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120], 'forceAtom2atom4startEff': [120, 120, 120, 120, 120, 120]}
        },
        action: [['alert', 0, 180]],
        reuseWaitTime: 773,
        hit: [[161, 136], [60, 60, 60, 60, 60, 60]],
        description: 'Summons 3 swords to track and attack monsters.',
        requirementText: 'Level 20 required to learn Advanced Tempest Blades.',
        hitDescriptions: ['MP Cost: {20+Math.ceil(x/2)}, Swords Summoned: 3. #cUse the skill again after summoning# to send the swords at the enemy and deal {220+4*x}% damage with 3 attacks.', 'Cooldown: 10 sec\\r', 'Final Form: Number of Attacks: +1 '],
        usedVariables: {'mpCon': '20+Math.ceil(x/2)', 'bulletCount': '3', 'attackCount': '3', 'cooltime': '10', 'damage': '220+4*x'},
        computedVars: {}
    },
    61101004: {
        className: 'Kaiser',
        skillName: 'Blaze On',
        maxLevel: 20,
        TYPE: 'buff',
        mpCon: '10+x',
        effects: {'61101004effect': [[313, 555], [172, 292], [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90]]},
        action: [['alert', 0, 150], ['alert', 1, 150], ['alert', 2, 420], ['swingT1', 1, 360]],
        reuseWaitTime: 1200,
        description: 'Draw out inner strength to temporarily increase Attack Power and Speed.',
        hitDescriptions: ['MP Cost: {10+x}, Duration: {12*x} sec, Attack Power: +{x}, Attack Speed: +2'],
        usedVariables: {'mpCon': '10+x', 'indiePad': 'x', 'time': '12*x'},
        computedVars: {}
    },
    61101100: {
        className: 'Kaiser',
        skillName: 'Impact Wave',
        maxLevel: 20,
        TYPE: 'attack',
        mpCon: '12+Math.floor(x/4)',
        effects: {'61101100effect': [[865, 241], [448, 149], [180, 90, 90, 90, 90, 90, 90, 90, 90]], '61101100effect0': [[227, 331], [129, 194], [180, 90, 90, 90, 90]]},
        LTRB: [-350, -100, -10, 0],
        action: [['swingT3', 1, -90, [1, 0]], ['swingT3', 1, -90, [2, 0]], ['swingT3', 2, -90, [-22, 0]], ['swingT3', 2, 90, [-23, 0]], ['swingT3', 2, 90, [-24, 0]], ['swingT3', 2, 90, [-25, 0]], ['swingT3', 2, 90, [-22, 0]]],
        reuseWaitTime: 800,
        hit: [[151, 178], [60, 60, 60, 60, 60, 60]],
        description: 'Stab your sword into the ground to create an explosive shockwave that blasts multiple enemies. #cCommand Skill: During Attack + Up key',
        hitDescriptions: ['MP Cost: {12+Math.floor(x/4)}, Damage: {190+4*x}%, Mobs Hit: 8, Number of Attacks: 2'],
        usedVariables: {'mpCon': '12+Math.floor(x/4)', 'attackCount': '2', 'mobCount': '8', 'damage': '190+4*x'},
        computedVars: {}
    },
    61101101: {
        className: 'Kaiser',
        skillName: 'Piercing Blaze',
        maxLevel: 10,
        TYPE: 'attack',
        mpCon: '10+x',
        effects: {'61101101effect': [[519, 155], [58, 109], [120, 120, 90, 90, 90, 90, 90]]},
        LTRB: [-300, -100, 0, 0],
        action: [['alert', 2, -90], ['swingT3', 1, 510]],
        reuseWaitTime: 613,
        hit: [[156, 124], [90, 90, 90, 90]],
        description: 'Dash forward to knock back enemies. Deals damage to multiple targets with a chance to stun. Can be resisted by some monsters.',
        hitDescriptions: ['MP Cost: {10+x}, Monsters Hit: 12, Damage: {160+9*x}%, Stun Chance: {20+6*x}%, Stun Duration: 2 sec'],
        usedVariables: {'mpCon': '10+x', 'mobCount': '12', 'damage': '160+9*x', 'prop': '20+6*x', 'time': '2'},
        computedVars: {}
    },
    61100006: {
        className: 'Kaiser',
        skillName: 'Sword Mastery',
        maxLevel: 10,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Increases two-handed sword weapon mastery and accuracy.',
        requirementText: 'Level 10 required to learn Expert Sword Mastery.',
        hitDescriptions: ['Two-Handed Sword Mastery: +{10+4*x}%'],
        usedVariables: {'mpCon': '0', 'mastery': '10+4*x'},
        computedVars: {}
    },
    61100007: {
        className: 'Kaiser',
        skillName: 'Inner Blaze',
        maxLevel: 10,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Increases Strength and HP.',
        requirementText: 'Level 10 required to learn Advanced Inner Blaze.',
        hitDescriptions: ['STR: +{2*x}, HP: +{2*x}%'],
        usedVariables: {'mpCon': '0', 'strX': '2*x', 'mhpR': '2*x'},
        computedVars: {}
    },
    61100005: {
        className: 'Kaiser',
        skillName: 'Defender Mode I',
        maxLevel: 1,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Enhances Realign: Defender Mode. Enhanced effects stack.',
        requirementText: 'Level 1 required to learn Defender Mode II.',
        hitDescriptions: ['Defense: Additional +200'],
        usedVariables: {'mpCon': '0', 'pddX': '200'},
        computedVars: {}
    },
    61100008: {
        className: 'Kaiser',
        skillName: 'Attacker Mode I',
        maxLevel: 1,
        TYPE: 'passive',
        mpCon: 0,
        description: 'Further enhances Realign: Attacker Mode. Enhanced effects stack.',
        requirementText: 'Level 1 required to learn Attacker Mode II.',
        hitDescriptions: ['Attack Power: +10, Critical Rate: +2%, Boss Damage: +5%'],
        usedVariables: {'mpCon': '0', 'padX': '10', 'bdR': '5', 'cr': '2'},
        computedVars: {}
    }
};
