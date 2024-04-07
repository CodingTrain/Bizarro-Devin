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

const animator = new Animator();
const socket = io('http://127.0.0.1:11434');
socket.on('status', (status) => {
  animator.setState(status);
});
