const skillsPerClass = {
    'Kaiser': [[61001000], [], [], [], [], []]
};

const classSkills = {
    61001000: {
        className: 'Kaiser',
        skillName: 'Dragon Slash',
        tier: 1,
        maxLevel: 20,
        type: 'attackSequence',
        delays: [90,90,90,90],
        reuseWaitTime: 320,
        attackSequence: {
            61001000: {damage: 0.50, lines: 3, targets: 8, scaling: {damage: 0.01}, dimensions: [283,167], next: 61001004},
            61001004: {damage: 0.30, lines: 5, targets: 6, scaling: {damage: 0.01}, dimensions: [363,129], next: 61001005},
            61001005: {damage: 0.40, lines: 5, targets: 6, scaling: {damage: 0.01}, dimensions: [335,209], next: 61001000}
        },
        finalForm: {damage: 1.40, lines: 5, targets: 8, scaling: {damage: 0.01}},
        hitDelays: [90,90,90,90,90,90],
        hitDimensions: [187, 131],
        description: 'Mash the attack key to whip enemies in front of you up to 3 times. Can be used with basic attack key while in Final Form.',
        requirementText: 'Level 20 required to learn Dragon Slash I.',
        hitDescriptions: ['1-hit: Attack up to 8 enemies for {damage}% damage 3 times', '2-hit: Up to 6 enemies attack for {damage}% damage 5 times', '3-hit: Up to 6 enemies attack for {damage}% damage 5 times', 'Final Form: Up to 8 enemies attack for {damage}% damage 5 times, Up to 10 enemies attack 6 times after 4th job']
    }
};
