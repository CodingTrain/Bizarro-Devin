class Animator {
  constructor() {
    this.animator = document.getElementById('animator');

    this.state = 'pending';
    this.animationsList = animations.map((x) => x.sprites);

    this.interval = setInterval(() => {
      this.draw();
    }, 200);

    this.currentAnimation = null;
    this.currentFrame = 0;

    this.setAnimation('Neutral-A');

    this.w = 100;

    this.loop = true;
  }

  setState(state) {
    this.state = state;
    console.log(this.state);
    this.update();
  }

  setAnimation(name) {
    if (name.includes('.png')) name = name.replace('.png', '');
    this.animator.style.background = `url(animations/${name}.png)`;
    this.currentAnimation = animations.find((x) => x.sprites == `${name}.png`);
    this.currentFrame = 0;
  }

  setRandomAnimation() {
    // choose a new animation
    const list = this.animationsList.filter((x) => x !== 'Neutral-A.png');
    const random = Math.floor(Math.random() * list.length);
    this.setAnimation(list[random]);
  }

  update() {
    if (this.state === 'pending') {
      this.setAnimation('Neutral-A');
      this.loop = true;
    }
    if (this.state === 'talking') {
      this.setRandomAnimation();
      this.loop = false;
    }
    if (this.state === 'typing') {
      this.setRandomAnimation();
      this.loop = false;
    }
    if (this.state === 'thinking') {
      this.setRandomAnimation();
      this.loop = false;
    }
  }

  draw() {
    this.animator.style.backgroundPosition = `-${this.currentFrame * this.w}px 0px`;

    this.currentFrame++;
    if (this.currentFrame >= this.currentAnimation.frames) {
      if (this.loop) {
        this.currentFrame = 0;
      } else {
        if (Math.random() < 0.5) {
          this.setRandomAnimation();
        } else {
          this.currentFrame = 0;
        }
      }
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
