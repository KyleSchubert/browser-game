const start = performance.now();
var oldTimeStamp = start;
var gameLoop = {
    mob: [],
    skill: [],
    damageNumber: [],
    body: [],
    head: [],
    avatar: [],
    other: []
};

function scheduleToGameLoop(delay, callback, data=[], category='other') {
    let locationToSchedule = gameLoop[category];
    locationToSchedule.push([performance.now() + delay - start, callback, data]);
}

function scheduleReplace(category, index, callback, data=[], delay=0) {
    let locationToSchedule = gameLoop[category];
    locationToSchedule[index] = [performance.now() + delay - start, callback, data];
}

function gameLoopParseCallback(callback, data) {
    callback.apply(null, data);
}

const isBelow = (currentValue) =>  currentValue - (performance.now() - start) < 0;
function gameLoopAdvance(timeStamp) {
    let timeDelta = timeStamp - oldTimeStamp;
    oldTimeStamp = timeStamp;
    Object.keys(gameLoop).forEach((key) => {
        for (let i=gameLoop[key].length-1;i>=0;i--) {
            let scheduledThing = gameLoop[key][i];
            if (isBelow(scheduledThing[0])) {
                scheduledThing[1].apply(null, scheduledThing[2]);
                gameLoop[key].splice(i, 1);
            }
        }
    });
    requestAnimationFrame(gameLoopAdvance);
}

$(gameLoopAdvance());
