// /* eslint-disable no-undef */
class Animator {
  constructor() {
    this.animator = document.getElementById('animator');

    this.state = 'pending';
    this.animationsList = animations.map((x) => x.sprites);
    this.interval = setInterval(() => {
      this.draw();
    }, FRAME_RATE);

    this.currentAnimation = null;
    this.currentFrame = 0;

    this.setAnimation('Neutral-A');

    this.w = 300;

    this.loop = true;
  }

  setState(state) {
    this.state = state;
    console.log(this.state);
    this.update();
  }

  setAnimation(name) {
    if (name.includes('.png')) name = name.replace('.png', '');
    this.animator.style.backgroundImage = `url(animations/${name}.png)`;
    this.animator.style.backgroundRepeat = 'no-repeat';
    this.currentAnimation = animations.find((x) => x.sprites == `${name}.png`);
    this.animator.style.backgroundSize = `${this.w * this.currentAnimation.frames}px ${this.w}px`;
    this.currentFrame = 0;
    console.log('Switched to animation: ', this.currentAnimation);
  }

  setRandomAnimation() {
    // choose a new animation
    const list = this.animationsList.filter((x) => x !== 'Neutral-A.png');
    const random = Math.floor(Math.random() * list.length);
    this.setAnimation(list[random]);
  }

  update() {
    this.loop = true;
    const choices = stateAnimations[this.state];
    if (choices) {
      const random = Math.floor(Math.random() * choices.length);
      this.setAnimation(choices[random]);
    } else {
      this.setAnimation('Neutral-A');
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

const animations = [
  { sprites: '360-A.png', frames: 8 },
  { sprites: '360-B.png', frames: 8 },
  { sprites: 'Coffee.png', frames: 12 },
  { sprites: 'Confused-A.png', frames: 8 },
  { sprites: 'Confused-B.png', frames: 8 },
  { sprites: 'Dancing.png', frames: 8 },
  { sprites: 'Excited-A.png', frames: 12 },
  { sprites: 'Excited-B.png', frames: 8 },
  { sprites: 'Excited-C.png', frames: 8 },
  { sprites: 'Frazzled.png', frames: 8 },
  { sprites: 'Head-shaking.png', frames: 8 },
  { sprites: 'Neutral-A.png', frames: 12 },
  { sprites: 'Neutral-Waving.png', frames: 16 },
  { sprites: 'Noding.png', frames: 8 },
  { sprites: 'Ooooh.png', frames: 8 },
];

const stateAnimations = {
  pending: ['Neutral-A'],
  talking: [
    'Excited-A',
    'Excited-B',
    'Excited-C',
    'Ooooh',
    'Frazzled',
    'Dancing',
  ],
  typing: ['Head-shaking', '360-A', '360-B', 'Noding'],
  thinking: ['Confused-A', 'Confused-B', 'Neutral-Waving', 'Coffee'],
};

const FRAME_RATE = 120;

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
