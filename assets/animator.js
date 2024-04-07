class Animator {
  constructor() {
    this.img = document.getElementById('matt-animator');
    this.state = 'pending';
  }

  setState(state) {
    this.state = state;
    this.update();
  }

  update() {
    if (this.state === 'pending') {
      this.img.src = '/matt-pending.png';
      this.img.style.animation = 'none';
    }
    if (this.state === 'talking') {
      this.img.src = '/matt-pending.png';
      this.img.style.animation = 'talking 0.25s infinite';
    }
    if (this.state === 'writing') {
      this.img.src = '/matt-typing.png';
      this.img.style.animation = 'writing 0.25s infinite';
    }
    if (this.state === 'thinking') {
      this.img.src = '/matt-thinking.png';
      this.img.style.animation = 'thinking 1s ease-in-out infinite';
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
const socket = io('http://127.0.0.1:4025');
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
