// (THIS MAKES THE PICKUP SOUND ABLE TO PLAY WHILE IT IS STILL PLAYING WITHOUT OPENING AND CLOSING NETWORK REQUESTS EACH TIME)
// Some stuff from here: https://stackoverflow.com/questions/30433667/cloning-audio-source-without-having-to-download-it-again
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var buffer, ctx = new AudioContext(), gainNode = ctx.createGain();
if (window.AudioContext) {
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.16; 
}

var sounds = [];
function createBuffer() {
    thing = this;
    ctx.decodeAudioData(this.response, function(b) {
        buffer = b;
        b.gotten = thing.originalFileIndex;
        b.true = UNIQUELENGTHS.indexOf(b.length);
        sounds[thing.originalFileIndex] = buffer;
    }, function(e){console.warn(e)});
}

function prepareSound(file, index) {
    // please load the sound on the first try
    if (!sounds[index]) {
        file = '/files/sounds/' + file;
        xhr = new XMLHttpRequest();
        xhr.onload = createBuffer;
        xhr.open('GET', file, true);
        xhr.responseType = 'arraybuffer';
        xhr.originalFileIndex = index;
        xhr.send();
    }
}

var UNIQUELENGTHS = [60769, 12538, 56424, 46393, 8777, 18808, 7523];
var allSoundFiles = ['pickup.wav', 'BtMouseOver.mp3', 'BuyShopItem.mp3', 'DlgNotice.mp3', 'MenuDown.mp3', 'MenuUp.mp3', 'Tab.mp3'];

function playSound(buf) {
    var source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(gainNode);
    source.onended = function(){if(this.stop)this.stop(); if(this.disconnect)this.disconnect();}
    source.start(0);
}

sounds.length = allSoundFiles.length;
function soundWork() {
    allSoundFiles.forEach(prepareSound);
}

function soundFileCheck() {
    badEgg = false;
    for (var i = 0;  i < allSoundFiles.length; i++) {
        if (!sounds[i]) {
            badEgg = true; // smelly rotten egg
        }
        else {
            if (sounds[i].gotten != sounds[i].true) {
                sounds[i] = null;
                badEgg = true;
            }
        }
    };
    return badEgg
}

$(document).ready(function() { //double checks that I have every sound loaded
    soundWork() // FIRST TIME
    window.setTimeout(function() {
        soundWork() // SECOND TIME
        window.setTimeout(function() {
            badEgg = soundFileCheck();
            if (badEgg) {
                console.error('SOUNDS GAVE OUT! WE BLEW IT!')
                soundWork() // THIRD TIME WOOOOOOO
                window.setTimeout(function() {
                    badEgg = soundFileCheck();
                    if (badEgg) {
                        console.error('We have one last resort to load these sounds: load them again!  >:^D')
                        soundWork() // FOURTH TIME AWOOOOGA
                    }
                    else {
                        console.log("OK. The sounds loaded, so we're fine again.")
                    }
                }, 18000)
            }
        }, 5000)
    }, 2000)
})

// Assigning the sounds to things
$('#testSound').click(function() {
    playSound(sounds[0]) // pickup.wav
});