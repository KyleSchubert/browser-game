function spawn(fromList=false) {
    if (fromList) {
        if ($('.easySelected').length > 0) {
            monster = $('.easySelected').html().toLowerCase();
        }
        else {
            monster = 'tino';
        }
    }
    else {
        monster = knownMobs[Math.floor(Math.random() * knownMobs.length)];
    }
}