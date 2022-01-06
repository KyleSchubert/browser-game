const start = performance.now();
var oldTimeStamp = start;
var gameLoop = {
    mob: [],
    skill: [],
    damageNumber: [],
    body: [],
    interfacing: [],
    movement: [],
    other: [],
    skillMovements: []
};

function scheduleToGameLoop(delay, callback, data=[], category='other') {
    let locationToSchedule = gameLoop[category];
    locationToSchedule.push([performance.now() + delay - start, callback, data]);
}

function scheduleReplace(category, index, callback, data=[], delay=0) {
    let locationToSchedule = gameLoop[category];
    locationToSchedule[index] = [performance.now() + delay - start, callback, data];
}

const isBelow = (currentValue) =>  currentValue - (performance.now() - start) < 0;
function gameLoopAdvance(timeStamp) {
    let timeDelta = timeStamp - oldTimeStamp;
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
