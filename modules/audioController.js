export class AudioController {
  constructor() {
    // @ts-ignore
    this.mic = null;
    this.sensitivity = 1;
  }

  init() {
    // @ts-ignore
    this.mic = new p5.AudioIn();
    this.mic.start();
  }

  getLevel() {
    return this.mic.getLevel() * this.sensitivity;
  }

  start() {
    userStartAudio();
  }

  increaseSensitivity(amount = 0.5) {
    this.sensitivity += amount;
  }

  decreaseSensitivity(amount = 0.5) {
    this.sensitivity -= amount;
    if (this.sensitivity < 0.1) this.sensitivity = 0.1;
  }

  resetSensitivity() {
    this.sensitivity = 1;
  }
}
