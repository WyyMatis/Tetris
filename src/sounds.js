class Sound {
  constructor(parent) {
    this.parent = parent;
    this.sounds = [];
    this.muted = true;
  }

  create(src, id, loop = false) {
    let audio = document.createElement("audio");
    audio.src = src;
    audio.id = id;
    audio.muted = true;
    this.sounds.push(audio);
    this.parent.append(audio);

    if (loop) {
      audio.setAttribute("loop", "");
    }

    return audio;
  }
}

Sound.prototype.soundSetting = function () {
  let soundItems = document.querySelectorAll(".sound-div");
  for (let soundItem of soundItems) {
    soundItem.addEventListener("click", (e) => {
      this.muteToggle();
    });
  }
};

Sound.prototype.muteToggle = function () {
  if (!this.muted) {
    for (let sound of this.sounds) {
      sound.muted = true;
    }

    this.muted = true;
  } else {
    for (let sound of this.sounds) {
      sound.muted = false;
    }

    this.muted = false;
  }
};

Sound.prototype.pause = function () {
  for (let sound of this.sounds) {
    sound.pause();
  }
};

Sound.prototype.play = function () {
  for (let sound of this.sounds) {
    sound.play();
  }
};

let sound = new Sound(document.querySelector("#sound-div")),
  movesSound = sound.create("assets/sounds/moves.mp3", "moves_sound"),
  dropSound = sound.create("assets/sounds/drop.mp3", "drop_sound");

sound.muteToggle();
sound.soundSetting();
