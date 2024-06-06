class Animator {
  constructor() {
    this.animator = document.getElementById('animator');

    this.state = 'pending';
  }

  setState(state) {
    this.state = state;
    console.log(this.state);
    this.update();
  }

  setAnimation(name, play = true) {
    this.animator.style.background = `url(animations/${name}.png)`;
    if (play) {
      const numFrames = animations.find(
        (a) => a.sprites === `${name}.png`
      ).frames;
      this.animator.style.animation = `play-${numFrames}fr 1s steps(${numFrames}) infinite`;
    } else {
      this.animator.style.animation = 'none';
    }
  }

  update() {
    if (this.state === 'pending') {
      this.setAnimation('Neutral-A');
    }
    if (this.state === 'talking') {
      this.setAnimation('Excited-A');
    }
    if (this.state === 'typing') {
      this.setAnimation('Coffee');
    }
    if (this.state === 'thinking') {
      this.setAnimation('360-A');
    }
  }
}

class CaptionManager {
  constructor() {
    this.elt = document.getElementById('captions');
  }

  setCaption(caption) {
    this.elt.innerText = caption;
    this.show();
  }

  show() {
    this.elt.style.display = 'block';
  }

  hide() {
    this.elt.style.display = 'none';
  }

  clear() {
    this.elt.innerText = '';
    this.hide();
  }
}

const animator = new Animator();
const captionManager = new CaptionManager();
const socket = io('http://127.0.0.1:$$PORT$$');

socket.on('status', (status) => {
  animator.setState(status);
});
socket.on('caption', (caption) => {
  if (caption.status === 'start') {
    captionManager.setCaption(caption.content);
  } else {
    captionManager.clear();
  }
});
