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
        b.test = thing.originalFileIndex;
        sounds[thing.originalFileIndex] = buffer;
    }, function(e){console.warn(e)});
}

function prepareSound(file, index) {
    // please load the sound on the first try
    file = '/files/sounds/' + file;
    xhr = new XMLHttpRequest();
    xhr.onload = createBuffer;
    xhr.open('GET', file, true);
    xhr.responseType = 'arraybuffer';
    xhr.originalFileIndex = index;
    xhr.send();
}

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

$(document).ready(function() { //double checks that I have every sound loaded
    soundWork() // FIRST TIME
    badEgg = false;
    window.setTimeout(soundWork(), 1000) // SECOND TIME
    window.setTimeout(function() {
        for (var i = 0;  i < allSoundFiles.length; i++) {
            if (!sounds[i]) {
                badEgg = true; // smelly rotten egg
            }
        };
        if (badEgg) {
            console.error('SOUNDS GAVE OUT! WE BLEW IT!')
            soundWork() // THIRD TIME WOOOOOOO
            window.setTimeout(function() {
                badEgg = false;
                for (var i = 0;  i < allSoundFiles.length; i++) {
                    if (!sounds[i]) {
                        badEgg = true; // smelly rotten egg v2.0
                    }
                };
                if (badEgg) {
                    console.error('We have one last resort to load these sounds: load them again!  >:^D')
                    soundWork() // FOURTH TIME AWOOOOGA
                }
                else {
                    console.log("OK, the sounds loaded, so we're fine again.")
                }
            }, 18000)
        }
    }, 2000)
})

// Assigning the sounds to things
$('#testSound').click(function() {
    playSound(sounds[0]) // pickup.wav
});