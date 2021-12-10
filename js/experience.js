// inspiration https://hyssopi.github.io/Level-Experience-Visualization/


// boring TEMPORARY math-based experience curve below with no customization
var experienceCurve = [10];
for (i=0; i<120; i++) {
    experienceCurve.push(Math.round(experienceCurve[i] * (1 + (.50 / (Math.floor(i/10) + 1)))));
}

function updateExpBar() {
    let percentExp = character.info.experience / experienceCurve[character.info.level-1] * 100;
    let text = character.info.experience + ' [' + percentExp.toFixed(2) + '%]';
    let expBar = document.getElementById('expText');
    expBar.innerHTML = text;
    expBar.style.backgroundSize = percentExp/100 * 1080 + 'px 9px';
}

character.info.level;
