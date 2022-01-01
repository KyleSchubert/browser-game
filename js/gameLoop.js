const start = performance.now();
var targets = [performance.now() + 4700 - start , performance.now() + 5800 - start , performance.now() + 2200 - start ];
const isBelow = (currentValue) =>  currentValue - (performance.now() - start) < 0;

function test() {
    if (targets.every(isBelow)) {
        return;
    }
    else {
        requestAnimationFrame(test);
    }
}
