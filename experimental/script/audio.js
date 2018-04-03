game.sounds = {
	move:     { file: 'move',     audio: null, mute: true,  },
	eat:      { file: 'eat2',     audio: null, mute: true,  },
	fail:     { file: 'fail2',    audio: null, mute: true,  },
	pause:    { file: 'pause',    audio: null, mute: false, },
	uphigh:   { file: 'uphigh',   audio: null, mute: true,  },
	wrapon:   { file: 'wrapon',   audio: null, mute: false, },
	wrapoff:  { file: 'wrapoff',  audio: null, mute: false, },
	scorex10: { file: 'scorex10', audio: null, mute: true,  },
};

function initAudio() {
	var folder = 'audio/';
	var ext    = '.wav';
	for (var name in game.sounds) {
		var sound = game.sounds[name];
		var path = folder + sound.file + ext;
		sound.audio = new Audio(path);
	}
}

function playSound(name) {
	if (name in game.sounds) {
		var sound = game.sounds[name];
		if (!game.paused || !sound.mute) {
			sound.audio.currentTime = 0;
			sound.audio.play();
		}
	}
}