// Some stuff from here: https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();
const gainNodeHits = audioCtx.createGain();
const gainNodeSkillUses = audioCtx.createGain();

const allSoundFiles = ['pickup.wav', 'BtMouseOver.mp3', 'BuyShopItem.mp3', 'DlgNotice.mp3', 'MenuDown.mp3', 'MenuUp.mp3', 'Tab.mp3', 'DragEnd.mp3', 'DragStart.mp3', 
    'levelup.mp3', '61001000hit.mp3', '61001000use.mp3', '61001004use.mp3', '61001005use.mp3', '61001101use.mp3', '61001101hit.mp3', '61001002.mp3', '61101002hit.mp3',
    '61101002use.mp3', '61101004use.mp3', '61101100use.mp3', '61101101hit.mp3', '61101101use.mp3', '61111002hit.mp3', '61111002use.mp3', '61111003use.mp3',
    '61111100use.mp3', '61111100hit.mp3', '61111101use.mp3', '61111101hit.mp3'   
];

var sounds = [];

if (window.AudioContext) {
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.22; // master
    gainNodeHits.connect(gainNode);
    gainNodeHits.gain.value = -0.30;
    gainNodeSkillUses.connect(gainNode);
    gainNodeSkillUses.gain.value = -0.10;
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

var reasons = [];
function playSound(buf, volumeType='normal') {
    const source = audioCtx.createBufferSource();
    source.buffer = buf;
    source.connect(gainNode);
    if (volumeType == 'hit') {
        source.connect(gainNodeHits);
    }
    else if (volumeType == 'use') {
        source.connect(gainNodeSkillUses);
    }
    source.onended = () => {
        if (this.stop) this.stop(); if (this.disconnect) this.disconnect();
    };
    source.start(0);
}

sounds.length = allSoundFiles.length;
function soundWork(sound) {
    loadFile(sound).then((track) => {
        sounds[allSoundFiles.indexOf(sound)] = track;
    });
}

$(() => { // double checks that I have every sound loaded
    allSoundFiles.forEach(soundWork);
});
