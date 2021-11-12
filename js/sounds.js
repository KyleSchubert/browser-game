// Some stuff from here: https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const UNIQUELENGTHS = [60769, 12538, 56424, 46393, 8777, 18808, 7523, 21315, 16300];
const allSoundFiles = ['pickup.wav', 'BtMouseOver.mp3', 'BuyShopItem.mp3', 'DlgNotice.mp3', 'MenuDown.mp3', 'MenuUp.mp3', 'Tab.mp3', 'DragEnd.mp3', 'DragStart.mp3'];

var sounds = [];

if (window.AudioContext) {
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.16;
}

async function getFile(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function loadFile(filePath) {
    filePath = './files/sounds/' + filePath;
    const track = await getFile(filePath);
    return track;
}

let offset = 0;

function playTrack(audioBuffer) {
    const trackSource = audioCtx.createBufferSource();
    trackSource.buffer = audioBuffer;
    trackSource.connect(audioCtx.destination);

    if (offset == 0) {
        trackSource.start();
        offset = audioCtx.currentTime;
    }
    else {
        trackSource.start(0, audioCtx.currentTime - offset);
    }

    return trackSource;
}

function playSound(buf) {
    const source = audioCtx.createBufferSource();
    source.buffer = buf;
    source.connect(gainNode);
    source.onended = function() {
        if (this.stop) this.stop(); if (this.disconnect) this.disconnect();
    };
    source.start(0);
}

sounds.length = allSoundFiles.length;
function soundWork(sound) {
    loadFile(sound).then((track) => {
        sounds[UNIQUELENGTHS.indexOf(track.length)] = track;
    });
}

$(document).ready(function() { // double checks that I have every sound loaded
    allSoundFiles.forEach(soundWork);
});

// Assigning the sounds to things
$('#testSound').click(function() {
    playSound(sounds[0]); // pickup.wav
});
