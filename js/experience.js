// inspiration https://hyssopi.github.io/Level-Experience-Visualization/


// boring TEMPORARY math-based experience curve below with no customization
var experienceCurve = [10];
for (i=0; i<120; i++) {
    experienceCurve.push(Math.round(experienceCurve[i] * (1 + (.50 / (Math.floor(i/10) + 1)))));
}

