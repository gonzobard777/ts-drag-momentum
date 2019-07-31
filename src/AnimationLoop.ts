export class AnimationLoop {
  animations: Function[] = [];
  animating = true;
  frame: number | undefined;

  constructor() {
  }

  animate() {
    if (this.frame) {
      return;
    }
    if (this.animating) {
      this.frame = requestAnimationFrame(this.animate);
    }
    let i = this.animations.length;
    while (i--) {
      if (!this.animations[i] || this.animations[i]() === false) {
        this.animations.splice(i, 1);
      }
    }
    this.frame = undefined;
  }

  add(animateFn: Function) {
    this.animations.push(animateFn);
  }

  start() {
    this.animating = true;
    this.animate();
  }

  stop() {
    this.animating = false;
  }
}
