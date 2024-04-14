class Animator {
  constructor() {
    this.fullMatt = document.getElementById('matt-animator');
    this.topMatt = document.getElementById('matt-top');
    this.bottomMatt = document.getElementById('matt-bottom');
    this.state = 'pending';
  }

  setState(state) {
    this.state = state;
    console.log(this.state);
    this.update();
  }

  update() {
    if (this.state === 'pending') {
      this.fullMatt.src = '/matt-pending.png';
      this.fullMatt.style.animation = 'none';
      this.fullMatt.style.display = 'block';
      this.topMatt.style.display = 'none';
      this.bottomMatt.style.display = 'none';
    }
    if (this.state === 'talking') {
      this.fullMatt.src = '/matt-pending.png';
      this.fullMatt.style.display = 'none';
      this.topMatt.style.display = 'block';
      this.topMatt.style.animation = 'talking-up 0.2s infinite';
      this.bottomMatt.style.display = 'block';
      this.bottomMatt.style.animation = 'talking-down 0.2s infinite';
    }
    if (this.state === 'typing') {
      this.fullMatt.src = '/matt-typing.png';
      this.fullMatt.style.display = 'block';
      this.fullMatt.style.animation = 'typing 0.25s infinite';
      this.topMatt.style.display = 'none';
      this.bottomMatt.style.display = 'none';
    }
    if (this.state === 'thinking') {
      this.fullMatt.src = '/matt-thinking.png';
      this.fullMatt.style.display = 'block';
      this.fullMatt.style.animation = 'thinking 1s ease-in-out infinite';
      this.topMatt.style.display = 'none';
      this.bottomMatt.style.display = 'none';
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
