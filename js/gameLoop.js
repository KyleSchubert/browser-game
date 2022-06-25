const start = performance.now();
var oldTimeStamp = start;
var gameLoopNextMobSlot = 0;
var gameLoop = {
    mob: {},
    skill: [],
    damageNumber: [],
    body: [],
    interfacing: [],
    movement: [],
    other: [],
    skillMovements: [],
    buffs: []
};

function scheduleToGameLoop(delay, callback, data=[], category='other') {
    let locationToSchedule = gameLoop[category];
    if (category == 'mob') {
        let index = gameLoopNextMobSlot++;
        locationToSchedule[index] = [performance.now() + delay - start, callback, data];
        return index;
    }
    else {
        locationToSchedule.push([performance.now() + delay - start, callback, data]);
    }
}

function scheduleReplace(category, index, callback, data=[], delay=0) {
    let locationToSchedule = gameLoop[category];
    locationToSchedule[index] = [performance.now() + delay - start, callback, data];
}

var lastTimeDelta = 10;
const isBelow = (currentValue) =>  currentValue - (performance.now() - start) < 0;
function gameLoopAdvance(timeStamp) {
    let timeDelta = timeStamp - oldTimeStamp;
    if (timeDelta > 100) { // 10 frames per second should never happen on a browser, I THINK (not sure)
        timeDelta = lastTimeDelta;
    }
    if (!timeDelta) {
        timeDelta = 1;
    }
    oldTimeStamp = timeStamp;
    Object.keys(gameLoop).forEach((key) => {
        if (key == 'movement') { // things that need  timeDelta
            for (let i=gameLoop[key].length-1;i>=0;i--) {
                let scheduledThing = gameLoop[key][i];
                if (isBelow(scheduledThing[0])) {
                    scheduledThing[2].unshift(timeDelta);
                    scheduledThing[1].apply(null, scheduledThing[2]);
                    gameLoop[key].splice(i, 1);
                }
            }
        }
        else if (key == 'mob') { // things that are in an object
            Object.keys(gameLoop[key]).forEach((slot) => {
                let scheduledThing = gameLoop[key][slot];
                if (isBelow(scheduledThing[0])) {
                    scheduledThing[1].apply(null, scheduledThing[2]);
                    delete gameLoop[key][slot];
                }
            });
        }
        else {
            for (let i=gameLoop[key].length-1;i>=0;i--) {
                let scheduledThing = gameLoop[key][i];
                if (isBelow(scheduledThing[0])) {
                    scheduledThing[1].apply(null, scheduledThing[2]);
                    gameLoop[key].splice(i, 1);
                }
            }
        } 
    });
    requestAnimationFrame(gameLoopAdvance);
}

$(() => {
    scheduleToGameLoop(0, checkForToggleKeys, [], 'interfacing');
    scheduleToGameLoop(0, checkForPressedKeys, [], 'interfacing');
    scheduleToGameLoop(0, avatarMovement, [], 'movement');
    gameLoopAdvance();
});
