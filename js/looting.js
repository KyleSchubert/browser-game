// (THIS MAKES THE PICKUP SOUND ABLE TO PLAY WHILE IT IS STILL PLAYING WITHOUT OPENING AND CLOSING NETWORK REQUESTS EACH TIME)
// Some stuff from here: https://stackoverflow.com/questions/30433667/cloning-audio-source-without-having-to-download-it-again
window.AudioContext = window.AudioContext||window.webkitAudioContext;
if(!window.AudioContext)
    yourFirstImplementation();
else {
    var buffer,
    ctx = new AudioContext(),
    gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.16;

    function createBuffer() {
        ctx.decodeAudioData(this.response, function(b) {buffer = b;}, function(e){console.warn(e)});
        var button = document.getElementById("testSound");
        button.addEventListener('click', function(){playSound(buffer)});
    }

    var file = '/files/pickup.wav',
    xhr = new XMLHttpRequest();
    xhr.onload = createBuffer;
    xhr.open('GET', file, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();

    function playSound(buf){
        var source = ctx.createBufferSource();
        source.buffer = buf;
        source.connect(gainNode);
        source.onended = function(){if(this.stop)this.stop(); if(this.disconnect)this.disconnect();}
        source.start(0);
    }
}

function lootItem() { // use   this.whatever   to get what you need   ex: this.value = itemID
    $(this).off('click')
    this.classList.remove('clickable')
    targetTab = itemsAndTheirTypes[this.value][0];
    targetSlot = inventory[targetTab].indexOf(0)
    if (targetTab == 'Use' || targetTab == 'Etc') {
        if (!inventory[targetTab].includes(this.value)) {
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + 1;
            inventory[targetTab][targetSlot] = this.value;
            inventoryLoadOne(targetTab, targetSlot, this.value)
        }
        else {
            targetSlot = inventory[targetTab].indexOf(this.value);
            inventory.counts[targetTab][targetSlot] = inventory.counts[targetTab][targetSlot] + 1;
            inventoryLoadOne(targetTab, targetSlot, this.value, true)
        }
    }
    else {
        inventory[targetTab][targetSlot] = this.value;
        inventoryLoadOne(targetTab, targetSlot, this.value)
    }
    this.classList.add('pickupAnimation')
    this.parentElement.classList.add('pickupAnimationHelper')
    this.classList.remove('droppedItem')
    this.parentElement.classList.remove('itemAnimationHelper')
    var _ = this // I dont know any better way
    playSound(buffer)
    window.setTimeout(function () {
        remainingItems = _.parentElement.parentElement.value
        remainingItems = remainingItems - 1
        _.parentElement.parentElement.value = remainingItems
        if (remainingItems <= 0) {
            _.parentElement.parentElement.remove(_)
        }
    }, 1020);
}

