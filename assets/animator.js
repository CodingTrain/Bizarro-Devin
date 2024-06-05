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

  update() {
    if (this.state === 'pending') {
      // this.animator.src = "/dan-360.png";
      // this.animator.style.display = "block";
      this.animator.style.animation = 'play-8fr 1s steps(8) infinite;';
    }
    // if (this.state === "talking") {
    //   this.animator.src = "/dan.png";
    //   this.animator.style.display = "none";
    // }
    // if (this.state === "typing") {
    //   this.animator.src = "/dan.png";
    //   this.animator.style.display = "block";
    //   this.animator.style.animation = "typing 0.25s infinite";
    // }
    // if (this.state === "thinking") {
    //   this.animator.src = "/dan.png";
    //   this.animator.style.display = "block";
    //   this.animator.style.animation = "thinking 1s ease-in-out infinite";
    // }
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
const socket = io('http://127.0.0.1:3300');

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
